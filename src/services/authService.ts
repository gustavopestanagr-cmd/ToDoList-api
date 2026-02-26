import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import bcrypy from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserInput } from '../schemas/userSchema.js';
import { AppError } from '../errors/appError.js';

const caminhoUsuarios = path.join(process.cwd(), 'usuario.json');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("ERRO CRÍTICO: Variável de ambiente JWT_SECRET não definida!");
}

export const lerUsuarios = async (): Promise<User[]> => {
    try {
        const dados = await fs.readFile(caminhoUsuarios, 'utf-8');
        return JSON.parse(dados)
    }
    catch {
        return [];
    }
};

export const cadastrarUsuario = async (dados: UserInput) => {
    const usuarios = await lerUsuarios();

    if (usuarios.find(u => u.email === dados.email)) {
        throw new AppError("Este e-mail já está cadastrado");
    }
    const passwordHash = await bcrypy.hash(dados.password, 10);

    const novoUsuario: User = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        email: dados.email,
        passwordHash
    };
    usuarios.push(novoUsuario);
    await fs.writeFile(caminhoUsuarios, JSON.stringify(usuarios, null, 2));

    return { id: novoUsuario.id, email: novoUsuario.email };
};
export const login = async (dados: UserInput) => {
    const usuarios = await lerUsuarios();
    const usuario = usuarios.find(u => u.email === dados.email);

    if (!usuario || !(await bcrypy.compare(dados.password, usuario.passwordHash))) {
        throw new AppError("E-mail ou senha inválidos", 401);
    }
    const token = jwt.sign(
        { email: usuario.email },
        JWT_SECRET,
        { subject: String(usuario.id), expiresIn: '1d' }
    );
    return { token };
}
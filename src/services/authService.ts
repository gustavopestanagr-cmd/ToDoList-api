import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import bcrypy from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginInput, User, UserInput } from '../schemas/userSchema.js';
import { AppError } from '../errors/appError.js';

console.log("Arquivo de service carregado");

const caminhoUsuarios = path.join(process.cwd(), 'usuario.json');

const caminhoTarefas = path.join(process.cwd(), 'tarefas.json');

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

export const lerTarefas = async () => {
    try {
        const dado = await fs.readFile(caminhoTarefas, 'utf-8');
        return JSON.parse(dado)
    }
    catch (error) {
        console.error("Erro ao ler tarefas:", error);
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
        name: dados.name,
        email: dados.email,
        passwordHash,
        role: "user"
    };
    usuarios.push(novoUsuario);
    await fs.writeFile(caminhoUsuarios, JSON.stringify(usuarios, null, 2));

    return { id: novoUsuario.id, name: novoUsuario.name, email: novoUsuario.email };
};
export const login = async (dados: LoginInput) => {
    const usuarios = await lerUsuarios();
    const usuario = usuarios.find(u => u.email === dados.email);

    if (!usuario || !(await bcrypy.compare(dados.password, usuario.passwordHash))) {
        throw new AppError("E-mail ou senha inválidos", 401);
    }
    const token = jwt.sign(
        { sub: String(usuario.id), role: usuario.role },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
    return { token };
}
//ADMIN SERVICE---------------------------------------------------------

export const buscarTodosUsuarios = async () => {
    const usuarios = await lerUsuarios();

    const resultado = usuarios.map(u => {
        const { passwordHash, ...copia } = u;
        return copia
    });
    return resultado;

}

export const deletarUsuario = async (idParaDeletar: number, adminId: number) => {
    const usuarios = await lerUsuarios();

    if (idParaDeletar === adminId) {
        throw new AppError("Operação inválida: Você não pode remover sua própria conta de administrador.", 400);
    }
    const usuariosExistente = usuarios.find(u => u.id === idParaDeletar);

    if (!usuariosExistente) {
        throw new AppError("Usuário não encontrado.", 404);
    }
    const novaLista = usuarios.filter(u => u.id !== idParaDeletar);
    await fs.writeFile(caminhoUsuarios, JSON.stringify(novaLista, null, 2));

    return { mensagem: `Usuário ${idParaDeletar} removido com sucesso.` };
}

export const lerTodasAsTarefas = async () => {
    const tarefas = await lerTarefas();
    return tarefas;
}

export const promoverParaAdmin = async (idDoUsuario: number) => {
    const usuarios = await lerUsuarios();
    const index = usuarios.findIndex(u => u.id === idDoUsuario);

    if (!index) {
        throw new AppError("Usuário não encontrado.", 400);
    }
    usuarios[index].role = "admin";

    await fs.writeFile(caminhoUsuarios, JSON.stringify(usuarios, null, 2));

    const { passwordHash, ...resultado } = usuarios[index];

    return resultado
};
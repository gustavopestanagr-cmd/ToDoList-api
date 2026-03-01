import { Request, Response } from 'express';
import { userSchema, loginSchema } from '../schemas/userSchema.js';
import * as authService from '../services/authService.js'

export const registrar = async (req: Request, res: Response) => {
    const dadosValidados = userSchema.parse(req.body);

    const usuario = await authService.cadastrarUsuario(dadosValidados);

    res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
        usuario
    });
};
export const logarUsuario = async (req: Request, res: Response) => {
    const dadosValidados = loginSchema.parse(req.body);

    const usuario = await authService.login(dadosValidados);

    res.status(200).json({
        mensagem: "Usuário logado com sucesso!",
        usuario
    });
};
// ADMIN CONTROLLER!-----------------------------------------------------------------

export const listarTodosUsuarios = async (req: Request, res: Response) => {
    const usuarios = await authService.buscarTodosUsuarios();
    return res.json(usuarios)
};

export const deletarUsuario = async (req: Request, res: Response) => {
    const idParaDeletar = Number(req.params.id);
    const adminId = req.user!.id;

    const resultado = await authService.deletarUsuario(idParaDeletar, adminId);

    return res.json(resultado);
}

export const listarTodasTarefas = async (req: Request, res: Response) => {
    const tarefas = await authService.lerTodasAsTarefas();
    return res.json(tarefas)
}

export const novoAdmin = async (req: Request, res: Response) => {
    const idParaPromover = Number(req.params.id);
    const resultado = await authService.promoverParaAdmin(idParaPromover);
    return res.status(200).json({
        mensagem: "Alteração feita com sucesso!",
        resultado
    })
}
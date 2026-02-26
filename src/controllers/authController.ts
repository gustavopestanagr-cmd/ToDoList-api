import { Request, Response } from 'express';
import { userSchema } from '../schemas/userSchema.js';
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
    const dadosValidados = userSchema.parse(req.body);

    const usuario = await authService.login(dadosValidados);

    res.status(200).json({
        mensagem: "Usuário logado com sucesso!",
        usuario
    });
}
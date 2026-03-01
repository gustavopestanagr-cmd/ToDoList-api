import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError.js';

export const authorize = (rolesPermitidas: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const usuarioRole = req.user;

        if (!usuarioRole || !rolesPermitidas.includes(usuarioRole.role)) {
            throw new AppError("Acesso Negado: Não tem permissão para acesssar este recurso.");
        }
        next();
    };
};
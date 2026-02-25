import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/appError.js';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            erro: "Dados inválidos",
            detalhes: error.issues.map(e => e.message)
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ erro: error.message });
    }

    console.error("Erro não tratado:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
};
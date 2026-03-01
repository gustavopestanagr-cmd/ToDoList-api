import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/appError.js';


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("ERRO CRÍTICO: Variável de ambiente JWT_SECRET não definida!");
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token não fornecido", 401);
    }
    const [, token] = authHeader.split(' ');

    interface TokenPayload {
        sub?: string;
        id?: number;
        role: string;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
        const userId = decoded.sub ? Number(decoded.sub) : decoded.id!;
        const { role } = decoded;
        req.user = {
            id: userId,
            role: role
        };

        return next()
    }
    catch {
        throw new AppError("Token inválido ou expirado", 401);
    }
};
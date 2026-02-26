import rateLimit from "express-rate-limit";
import { AppError } from "../errors/appError.js";
import { error } from "node:console";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res, next) => {
        throw new AppError("Muitas tentativas de login. Tente novamente após 15 minutos.", 429);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: { error: "Calma aí! Você está enviando requisições rápido demais." }
});
// src/@types/express.d.ts
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            // Aqui definimos que TODO 'req' pode ter um objeto user
            user?: {
                id: number;
            };
        }
    }
}
declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        PORT?: string;
    }
}
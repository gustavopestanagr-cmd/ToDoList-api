import * as express from 'express';
declare global {
    namespace Express {
        interface Request {
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
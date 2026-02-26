import { Router } from "express";
import * as authController from '../controllers/authController.js'
import { loginLimiter } from "../middlewares/rateLimiter.js";

const authRouter = Router();

authRouter.post('/registrar', loginLimiter, authController.registrar);

authRouter.post('/login', loginLimiter, authController.logarUsuario);


export default authRouter;
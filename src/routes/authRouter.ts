import { Router } from "express";
import * as authController from '../controllers/authController.js'

const authRouter = Router();

authRouter.post('/registrar', authController.registrar);

authRouter.post('/login', authController.logarUsuario);


export default authRouter;
import { Router } from "express";
import * as authController from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js'

console.log("Arquivo de rotas carregado");

const adminRouter = Router()

adminRouter.get('/users', authMiddleware, authorize(['admin']), authController.listarTodosUsuarios);

adminRouter.delete('/users/:id', authMiddleware, authorize(['admin']), authController.deletarUsuario);

adminRouter.get('/alltasks', authMiddleware, authorize(['admin']), authController.listarTodasTarefas);

adminRouter.patch('/newadm/:id', authMiddleware, authorize(['admin']), authController.novoAdmin);

export default adminRouter;
import { Router } from 'express'
import * as todoController from '../controllers/todoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', todoController.verTarefa);
router.post('/', todoController.criarTarefa);
router.patch('/:id', todoController.editarTarefa);
router.delete('/:id', todoController.deletarTarefa);

export default router;
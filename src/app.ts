import 'dotenv/config';
import express from 'express';
import todoRoutes from './routes/todoRouter.js';
import authRouter from './routes/authRouter.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const app = express();

app.use(express.json());

app.use(apiLimiter);

app.use('/auth', authRouter);

app.use('/tarefas', todoRoutes);

app.use(errorMiddleware);


const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});

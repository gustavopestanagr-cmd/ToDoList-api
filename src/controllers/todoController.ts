import { Request, Response } from 'express';
import { paramsSchema, tarefaSchema, Tarefa } from '../schemas/todoSchema.js';
import * as todoService from '../services/todoService.js'
import { AppError } from '../errors/appError.js';

export const criarTarefa = async (req: Request, res: Response) => {
    const dadosValidados = tarefaSchema.parse(req.body);
    const userId = req.user!.id;

    const tarefas = await todoService.lerBanco();

    const novaTarefa: Tarefa = {
        id: todoService.gerarProximoId(tarefas),
        userId: userId,
        titulo: dadosValidados.titulo,
        concluida: false
    };

    tarefas.push(novaTarefa);
    await todoService.salvarBanco(tarefas);

    res.status(201).json(novaTarefa);
};

export const verTarefa = async (req: Request, res: Response) => {
    const userIdLogado = req.user?.id;

    const bancoDeDados = await todoService.lerBanco();

    const tarefasDoUsuario = bancoDeDados.filter(t => t.userId === userIdLogado);

    res.json(tarefasDoUsuario);

};

export const deletarTarefa = async (req: Request, res: Response) => {
    const { id: idParaDeletar } = paramsSchema.parse(req.params);
    const userIdLogado = req.user!.id;

    let bancoDeDados = await todoService.lerBanco();

    const tarefa = bancoDeDados.find(t => t.id === idParaDeletar);

    if (!tarefa) {
        throw new AppError("Tarefa não encontrada", 404);
    }
    if (tarefa.userId !== userIdLogado) {
        throw new AppError("Você não tem permissão para deletar esta tarefa", 403);
    }
    const listaAtualizada = bancoDeDados.filter(t => t.id !== idParaDeletar);

    await todoService.salvarBanco(listaAtualizada);
    res.json({ mensagem: `Tarefa ${idParaDeletar} removida com sucesso!` });
};

export const editarTarefa = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const dadosValidados = tarefaSchema.parse(req.body);
    const userIdLogado = req.user!.id;

    let bancoDeDados = await todoService.lerBanco();

    const tarefa = bancoDeDados.find(t => t.id === id);

    if (!tarefa) {
        throw new AppError("Tarefa não encontrada", 404);
    }
    if (tarefa.userId !== userIdLogado) {
        throw new AppError("Você não tem permissão para editar esta tarefa", 403);
    }

    let tarefas = await todoService.lerBanco();
    const index = tarefas.findIndex(t => t.id === id);
    if (index === -1) {
        throw new AppError("Tarefa não encontrada", 404);
    }

    tarefas[index] = {
        ...tarefas[index]!,
        concluida: dadosValidados.concluida !== undefined ? dadosValidados.concluida : tarefas[index]!.concluida,
        titulo: dadosValidados.titulo !== undefined ? dadosValidados.titulo : tarefas[index]!.titulo
    };
    await todoService.salvarBanco(tarefas);
    res.json({ mensagem: "Tarefa atualizada!", tarefas: tarefas[index] });
};
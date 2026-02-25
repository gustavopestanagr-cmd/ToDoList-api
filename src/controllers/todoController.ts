import { Request, Response } from 'express';
import { paramsSchema, tarefaSchema, Tarefa } from '../schemas/todoSchema.js';
import * as todoService from '../services/todoService.js'
import { AppError } from '../errors/appError.js';

export const criarTarefa = async (req: Request, res: Response) => {
    const dadosValidados = tarefaSchema.parse(req.body);
    const tarefas = await todoService.lerBanco();

    const novaTarefa: Tarefa = {
        id: tarefas.length > 0 ? tarefas[tarefas.length - 1]!.id + 1 : 1,
        titulo: dadosValidados.titulo,
        concluida: false
    };

    tarefas.push(novaTarefa);
    await todoService.salvarBanco(tarefas)
    res.status(201).json(novaTarefa);
};

export const verTarefa = async (req: Request, res: Response) => {
    const bancoDeDados = await todoService.lerBanco()
    res.json(bancoDeDados);
};

export const deletarTarefa = async (req: Request, res: Response) => {
    const { id: idParaDeletar } = paramsSchema.parse(req.params);
    let bancoDeDados = await todoService.lerBanco();

    const listaAtualizada = bancoDeDados.filter(t => t.id !== idParaDeletar);

    if (listaAtualizada.length === bancoDeDados.length) {
        return res.status(404).json({ erro: "Tarefa não encontrada para deletar!" });
    }
    await todoService.salvarBanco(listaAtualizada);
    res.json({ mensagem: `Tarefa ${idParaDeletar} removida com sucesso!` });
};

export const editarTarefa = async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const dadosValidados = tarefaSchema.parse(req.body);

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
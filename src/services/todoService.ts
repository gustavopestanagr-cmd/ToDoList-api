import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Tarefa } from '../schemas/todoSchema.js';

const caminhoArquivo = path.join(process.cwd(), 'tarefas.json');

export const lerBanco = async (): Promise<Tarefa[]> => {
    try {
        const dados = await fs.readFile(caminhoArquivo, 'utf-8');
        return JSON.parse(dados);
    } catch {
        return [];
    }
};

export const salvarBanco = async (dados: Tarefa[]): Promise<void> => {
    await fs.writeFile(caminhoArquivo, JSON.stringify(dados, null, 2));
};

export const gerarProximoId = (tarefas: Tarefa[]): number => {
    if (tarefas.length === 0) return 1;
    return Math.max(...tarefas.map(t => t.id)) + 1;
};
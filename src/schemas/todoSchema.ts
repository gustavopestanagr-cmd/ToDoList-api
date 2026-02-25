import { z } from 'zod'

export const tarefaSchema = z.object({
    titulo: z.string()
        .min(3, "O título deve ter pelo menos 3 caracteres")
        .max(100),
    concluida: z.boolean().optional()
});
export const paramsSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, "O ID deve conter apenas números")
        .transform(Number)
});
export interface Tarefa {
    id: number;
    titulo: string;
    concluida: boolean;
}

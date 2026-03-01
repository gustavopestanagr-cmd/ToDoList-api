
import z from "zod";

export const userSchema = z.object({
    name: z.string().min(2, "O nome tem que ter no mínimo 2 letras"),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type UserInput = z.infer<typeof userSchema>;

export const loginSchema = userSchema.pick({
    email: true,
    password: true
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    role: string
}
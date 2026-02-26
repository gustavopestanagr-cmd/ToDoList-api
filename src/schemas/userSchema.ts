
import z from "zod";

export const userSchema = z.object({
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export type UserInput = z.infer<typeof userSchema>;

export interface User {
    id: number;
    email: string;
    passwordHash: string;
}
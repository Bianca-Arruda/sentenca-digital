/*
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve possuir pelo menos 2 caracteres.').max(100),
  email: z.string().trim().email('E-mail inválido.').max(160),
  password: z.string().min(8, 'A senha deve possuir pelo menos 8 caracteres.').max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido.').max(160),
  password: z.string().min(1, 'Senha é obrigatória.').max(72),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('E-mail inválido.').max(160),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z.string()
    .min(8, 'A senha deve possuir pelo menos 8 caracteres.')
    .max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

*/

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve possuir pelo menos 2 caracteres.').max(100),
  email: z.string().trim().email('E-mail inválido.').max(160),
  password: z.string().min(8, 'A senha deve possuir pelo menos 8 caracteres.').max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido.').max(160),
  password: z.string().min(1, 'Senha é obrigatória.').max(72),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('E-mail inválido.').max(160),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32, 'Token de recuperação inválido.'),
  password: z
    .string()
    .min(8, 'A senha deve possuir pelo menos 8 caracteres.')
    .max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
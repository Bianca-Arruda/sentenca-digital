/*
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve possuir pelo menos 32 caracteres.'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
});

export const env = envSchema.parse(process.env);
*/

import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().int().positive().default(3333),

  DATABASE_URL: z.string().min(1),

  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve possuir pelo menos 32 caracteres.'),

  JWT_EXPIRES_IN: z.string().default('7d'),

  COOKIE_SAME_SITE: z
    .enum(['lax', 'strict', 'none'])
    .default('lax'),

  RESEND_API_KEY: z.string().min(1),

  EMAIL_FROM: z.string().min(1),

  WEB_APP_URL: z.string().url().default('http://localhost:3000'),

  PASSWORD_RESET_EXPIRES_MINUTES: z.coerce
    .number()
    .int()
    .positive()
    .default(15),
});

export const env = envSchema.parse(process.env);
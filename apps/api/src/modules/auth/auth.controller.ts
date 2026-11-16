
import type { Request, Response } from 'express';

import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';

import {
  getCurrentUser,
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from './auth.service';

import {
  AUTH_COOKIE_MAX_AGE_MS,
  AUTH_COOKIE_NAME,
} from './auth.constants';

import { env } from '../../config/env';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.COOKIE_SAME_SITE,
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
  path: '/',
} as const;

function setAuthCookie(
  response: Response,
  token: string,
): void {
  response.cookie(
    AUTH_COOKIE_NAME,
    token,
    cookieOptions,
  );
}

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = registerSchema.parse(request.body);
  const result = await register(input);

  setAuthCookie(response, result.token);

  response.status(201).json({
    user: sanitizeUser(result.user),
  });
}

export async function loginController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = loginSchema.parse(request.body);
  const result = await login(input);

  setAuthCookie(response, result.token);

  response.json({
    user: sanitizeUser(result.user),
  });
}

export async function logoutController(
  _request: Request,
  response: Response,
): Promise<void> {
  response.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
  });

  response.status(204).send();
}

export async function meController(
  request: Request,
  response: Response,
): Promise<void> {
  const user = await getCurrentUser(request.user!.id);

  response.json({
    user: sanitizeUser(user),
  });
}

export async function forgotPasswordController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = forgotPasswordSchema.parse(request.body);

  await requestPasswordReset(input);

  response.json({
    message:
      'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
  });
}

export async function resetPasswordController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = resetPasswordSchema.parse(request.body);

  await resetPassword(input);

  response.json({
    message: 'Senha alterada com sucesso.',
  });
}

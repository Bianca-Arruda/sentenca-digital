import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AUTH_COOKIE_NAME } from '../modules/auth/auth.constants';


function unauthorized(message = 'Autenticação necessária.') {
  const error = new Error(message);
  error.name = 'UnauthorizedError';
  return error;
}

export function authMiddleware(request: Request, _response: Response, next: NextFunction): void {
  try {
    const token = request.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      throw unauthorized();
    }

    const payload = jwt.verify(token, env.JWT_SECRET);

    if (typeof payload === 'string' || !payload.sub) {
      throw unauthorized('Sessão inválida.');
    }

    request.user = {
      id: payload.sub,
      role: payload.role === 'ADMIN' ? 'ADMIN' : 'PLAYER',
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(unauthorized('Sessão expirada.'));
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(unauthorized('Sessão inválida.'));
      return;
    }

    next(error);
  }
}

export function requireRole(...roles: Array<'PLAYER' | 'ADMIN'>) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    if (!request.user || !roles.includes(request.user.role)) {
      next(unauthorized('Você não possui permissão para acessar este recurso.'));
      return;
    }

    next();
  };
}

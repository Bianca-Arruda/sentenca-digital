import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Dados inválidos.',
      details: error.issues,
    });
    return;
  }

  if (error instanceof Error) {
    if (error.name === 'UnauthorizedError') {
      response.status(401).json({
        error: 'UNAUTHORIZED',
        message: error.message,
      });
      return;
    }

    if (error.name === 'ConflictError') {
      response.status(409).json({
        error: 'CONFLICT',
        message: error.message,
      });
      return;
    }

    if (error.name === 'ForbiddenError') {
      response.status(403).json({
        error: 'FORBIDDEN',
        message: error.message,
      });
      return;
    }

    if (error.name === 'NotFoundError') {
      response.status(404).json({
        error: 'NOT_FOUND',
        message: error.message,
      });
      return;
    }

    if (error.name === 'ValidationError') {
      response.status(400).json({
        error: 'VALIDATION_ERROR',
        message: error.message,
      });
      return;
    }
  }

  console.error(error);

  response.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Ocorreu um erro interno no servidor.',
  });
};

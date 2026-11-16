import type { RequestHandler } from 'express';

export const notFoundMiddleware: RequestHandler = (request, response) => {
  response.status(404).json({
    error: 'NOT_FOUND',
    message: `Rota não encontrada: ${request.method} ${request.originalUrl}`,
  });
};

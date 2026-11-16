import type { RequestHandler } from 'express';
import { getWorldArchive } from './map.service';

export const getMap: RequestHandler = async (request, response, next) => {
  try {
    response.json({ data: await getWorldArchive(request.user!.id) });
  } catch (error) {
    next(error);
  }
};

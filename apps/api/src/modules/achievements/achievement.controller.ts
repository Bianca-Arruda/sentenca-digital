import type { RequestHandler } from 'express';
import { AchievementService } from './achievement.service';

const service = new AchievementService();

export const listAchievements: RequestHandler = async (request, response, next) => {
  try {
    response.json({ data: await service.list(request.user!.id) });
  } catch (error) {
    next(error);
  }
};

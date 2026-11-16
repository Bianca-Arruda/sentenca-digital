import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { listAchievements } from './achievement.controller';

export const achievementRoutes = Router();
achievementRoutes.use(authMiddleware);
achievementRoutes.get('/', listAchievements);

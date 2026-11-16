import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getProgress } from './progress.controller';

export const progressRoutes = Router();
progressRoutes.use(authMiddleware);
progressRoutes.get('/', getProgress);

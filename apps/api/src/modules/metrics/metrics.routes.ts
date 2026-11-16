import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getMetrics } from './metrics.controller';

export const metricsRoutes = Router();
metricsRoutes.use(authMiddleware);
metricsRoutes.get('/', getMetrics);

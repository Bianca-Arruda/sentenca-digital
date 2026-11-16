import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { registerDecision } from './decision.controller';

export const decisionRoutes = Router();
decisionRoutes.use(authMiddleware);
decisionRoutes.post('/cases/:id/decision', registerDecision);

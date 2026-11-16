import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { achievementRoutes } from '../modules/achievements/achievement.routes';
import { caseRoutes } from '../modules/cases/case.routes';
import { mapRoutes } from '../modules/map/map.routes';
import { metricsRoutes } from '../modules/metrics/metrics.routes';
import { progressRoutes } from '../modules/progress/progress.routes';
import { decisionRoutes } from '../modules/decisions/decision.routes';

export const apiRoutes = Router();

apiRoutes.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'sentenca-digital-api',
    version: '1.0.0',
  });
});

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/cases', caseRoutes);
apiRoutes.use('/achievements', achievementRoutes);
apiRoutes.use('/map', mapRoutes);
apiRoutes.use('/metrics', metricsRoutes);
apiRoutes.use('/progress', progressRoutes);
apiRoutes.use('/', decisionRoutes);

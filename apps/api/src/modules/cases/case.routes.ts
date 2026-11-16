import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getCase, getCaseDecisions, getCaseEvidence, listCases } from './case.controller';

export const caseRoutes = Router();
caseRoutes.use(authMiddleware);

caseRoutes.get('/', listCases);
caseRoutes.get('/:id/evidence', getCaseEvidence);
caseRoutes.get('/:id/decisions', getCaseDecisions);
caseRoutes.get('/:id', getCase);

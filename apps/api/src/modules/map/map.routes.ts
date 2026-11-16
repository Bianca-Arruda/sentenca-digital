import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getMap } from './map.controller';

export const mapRoutes = Router();
mapRoutes.use(authMiddleware);
mapRoutes.get('/', getMap);

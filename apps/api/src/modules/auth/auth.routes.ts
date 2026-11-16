/*
import { Router } from 'express';
import {
  loginController,
  logoutController,
  meController,
  registerController,
} from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.post('/logout', logoutController);
authRoutes.get('/me', authMiddleware, meController);
*/
import { Router } from 'express';
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  registerController,
  resetPasswordController,
} from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);
authRoutes.post('/logout', logoutController);
authRoutes.get('/me', authMiddleware, meController);
authRoutes.post('/forgot-password', forgotPasswordController);
authRoutes.post('/reset-password', resetPasswordController);
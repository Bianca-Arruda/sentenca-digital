/*

import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import type { AuthenticatedUser } from './auth.types';
import type { LoginInput, RegisterInput } from './auth.validation';

const SALT_ROUNDS = 12;

function toAuthenticatedUser(user: {
  id: string;
  name: string;
  email: string;
  role: 'PLAYER' | 'ADMIN';
}): AuthenticatedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function signToken(user: AuthenticatedUser): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };

  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    options,
  );
}

export interface AuthResult {
  user: AuthenticatedUser;
  token: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const email = input.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const error = new Error('E-mail já cadastrado.');
    error.name = 'ConflictError';
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash,
      progress: {
        create: {
          currentCaseOrder: 1,
          completedCases: 0,
          discoveredCases: 0,
          progressPercent: 0,
          societyMetrics: {
            create: {
              responsibility: 50,
              aiAdoption: 50,
              publicTrust: 50,
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const authenticatedUser = toAuthenticatedUser(user);

  return {
    user: authenticatedUser,
    token: signToken(authenticatedUser),
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const email = input.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    const error = new Error('E-mail ou senha inválidos.');
    error.name = 'UnauthorizedError';
    throw error;
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error('E-mail ou senha inválidos.');
    error.name = 'UnauthorizedError';
    throw error;
  }

  const authenticatedUser = toAuthenticatedUser(user);

  return {
    user: authenticatedUser,
    token: signToken(authenticatedUser),
  };
}

export async function getCurrentUser(userId: string): Promise<AuthenticatedUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    error.name = 'UnauthorizedError';
    throw error;
  }

  return toAuthenticatedUser(user);
}

*/

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';

import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';

import type { AuthenticatedUser } from './auth.types';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './auth.validation';

import { sendPasswordResetEmail } from '../../lib/email';

const SALT_ROUNDS = 12;

function toAuthenticatedUser(user: {
  id: string;
  name: string;
  email: string;
  role: 'PLAYER' | 'ADMIN';
}): AuthenticatedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function signToken(user: AuthenticatedUser): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    options,
  );
}

function hashResetToken(token: string): string {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
}

export interface AuthResult {
  user: AuthenticatedUser;
  token: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const email = input.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('E-mail já cadastrado.');
    error.name = 'ConflictError';
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash,
      progress: {
        create: {
          currentCaseOrder: 1,
          completedCases: 0,
          discoveredCases: 0,
          progressPercent: 0,
          societyMetrics: {
            create: {
              responsibility: 50,
              aiAdoption: 50,
              publicTrust: 50,
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  const authenticatedUser = toAuthenticatedUser(user);

  return {
    user: authenticatedUser,
    token: signToken(authenticatedUser),
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const email = input.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    const error = new Error('E-mail ou senha inválidos.');
    error.name = 'UnauthorizedError';
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    const error = new Error('E-mail ou senha inválidos.');
    error.name = 'UnauthorizedError';
    throw error;
  }

  const authenticatedUser = toAuthenticatedUser(user);

  return {
    user: authenticatedUser,
    token: signToken(authenticatedUser),
  };
}

export async function getCurrentUser(
  userId: string,
): Promise<AuthenticatedUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    const error = new Error('Usuário não encontrado.');
    error.name = 'UnauthorizedError';
    throw error;
  }

  return toAuthenticatedUser(user);
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<void> {
  const email = input.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });

  /*
   * Não revelamos se o e-mail existe.
   * Isso evita enumeração de usuários.
   */
  if (!user) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(rawToken);

  const expiresAt = new Date(
    Date.now() +
      env.PASSWORD_RESET_EXPIRES_MINUTES * 60 * 1000,
  );

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  const resetUrl =
    `${env.WEB_APP_URL}/reset-password?token=${encodeURIComponent(rawToken)}`;

  await sendPasswordResetEmail(user.email, resetUrl);
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<void> {
  const tokenHash = hashResetToken(input.token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!resetToken) {
    const error = new Error('Token de recuperação inválido.');
    error.name = 'BadRequestError';
    throw error;
  }

  if (resetToken.expiresAt.getTime() <= Date.now()) {
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    const error = new Error('O link de recuperação expirou.');
    error.name = 'BadRequestError';
    throw error;
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    SALT_ROUNDS,
  );

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        passwordHash,
      },
    }),

    prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    }),
  ]);
}

import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import type { CreateDecisionInput } from './decision.validation';
import { AchievementService } from '../achievements/achievement.service';

function clampMetric(value: number) {
  return Math.max(0, Math.min(100, value));
}

const achievementService = new AchievementService();

export class DecisionService {
  async register(
    userId: string,
    caseIdentifier: string,
    input: CreateDecisionInput,
  ) {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        caseIdentifier,
      );

    const found = await prisma.case.findFirst({
      where: {
        status: 'PUBLISHED',
        ...(isUuid ? { id: caseIdentifier } : { code: caseIdentifier }),
      },
      select: {
        id: true,
        code: true,
        title: true,
        order: true,
        realOutcome: true,
        sourceUrl: true,
        sourceTitle: true,
      },
    });

    if (!found) {
      const error = new Error('Caso não encontrado.');
      error.name = 'NotFoundError';
      throw error;
    }

    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        societyMetrics: { create: {} },
      },
      include: { societyMetrics: true },
    });

    if (found.order > progress.currentCaseOrder) {
      const error = new Error('Este caso ainda está bloqueado.');
      error.name = 'ForbiddenError';
      throw error;
    }

    const option = await prisma.decisionOption.findFirst({
      where: {
        id: input.decisionOptionId,
        caseId: found.id,
      },
      select: {
        id: true,
        title: true,
        responsibilityImpact: true,
        adoptionImpact: true,
        trustImpact: true,
      },
    });

    if (!option) {
      const error = new Error('Opção de decisão inválida para este caso.');
      error.name = 'ValidationError';
      throw error;
    }

    const existingDecision = await prisma.userDecision.findUnique({
      where: { userId_caseId: { userId, caseId: found.id } },
      select: { id: true },
    });

    if (existingDecision) {
      const error = new Error('A decisão deste caso já foi registrada.');
      error.name = 'ConflictError';
      throw error;
    }

    try {
      return await prisma.$transaction(async (transaction) => {
        const latestProgress = await transaction.userProgress.findUnique({
          where: { userId },
          include: { societyMetrics: true },
        });

        if (!latestProgress?.societyMetrics) {
          const error = new Error(
            'Progresso do jogador não está inicializado.',
          );
          error.name = 'InternalError';
          throw error;
        }

        if (found.order > latestProgress.currentCaseOrder) {
          const error = new Error('Este caso ainda está bloqueado.');
          error.name = 'ForbiddenError';
          throw error;
        }

        const previousProgressPercent = latestProgress.progressPercent;

        const duplicate = await transaction.userDecision.findUnique({
          where: { userId_caseId: { userId, caseId: found.id } },
          select: { id: true },
        });

        if (duplicate) {
          const error = new Error(
            'A decisão deste caso já foi registrada.',
          );
          error.name = 'ConflictError';
          throw error;
        }

        const before = {
          responsibility: latestProgress.societyMetrics.responsibility,
          adoption: latestProgress.societyMetrics.aiAdoption,
          trust: latestProgress.societyMetrics.publicTrust,
        };

        const after = {
          responsibility: clampMetric(
            before.responsibility + option.responsibilityImpact,
          ),
          adoption: clampMetric(
            before.adoption + option.adoptionImpact,
          ),
          trust: clampMetric(
            before.trust + option.trustImpact,
          ),
        };

        const metricChanges = {
          responsibility: after.responsibility - before.responsibility,
          adoption: after.adoption - before.adoption,
          trust: after.trust - before.trust,
        };

        await transaction.userDecision.create({
          data: {
            userId,
            caseId: found.id,
            decisionOptionId: option.id,
            responsibilityBefore: before.responsibility,
            responsibilityAfter: after.responsibility,
            adoptionBefore: before.adoption,
            adoptionAfter: after.adoption,
            trustBefore: before.trust,
            trustAfter: after.trust,
          },
        });

        await transaction.userCase.upsert({
          where: { userId_caseId: { userId, caseId: found.id } },
          update: {
            isCompleted: true,
            completedAt: new Date(),
          },
          create: {
            userId,
            caseId: found.id,
            isCompleted: true,
            discoveredAt: new Date(),
            completedAt: new Date(),
          },
        });

        const completedCases = await transaction.userCase.count({
          where: { userId, isCompleted: true },
        });

        const discoveredCases = await transaction.userCase.count({
          where: { userId, discoveredAt: { not: null } },
        });

        const totalPublishedCases = await transaction.case.count({
          where: { status: 'PUBLISHED' },
        });

        const currentCaseOrder = Math.max(
          latestProgress.currentCaseOrder,
          found.order + 1,
        );

        const progressPercent =
          totalPublishedCases === 0
            ? 0
            : Math.min(
                100,
                Math.round(
                  (completedCases / totalPublishedCases) * 100,
                ),
              );

        const discoveredCountries = await transaction.case.findMany({
          where: {
            status: 'PUBLISHED',
            userCases: {
              some: { userId, discoveredAt: { not: null } },
            },
          },
          distinct: ['countryCode'],
          select: { countryCode: true },
        });

        await transaction.societyMetrics.update({
          where: { userProgressId: latestProgress.id },
          data: {
            responsibility: after.responsibility,
            aiAdoption: after.adoption,
            publicTrust: after.trust,
          },
        });

        await transaction.userProgress.update({
          where: { id: latestProgress.id },
          data: {
            currentCaseOrder,
            completedCases,
            discoveredCases,
            progressPercent,
          },
        });

        await transaction.playerEvent.create({
          data: {
            userId,
            caseId: found.id,
            type: 'DECISION_REGISTERED',
            title: 'DECISÃO REGISTRADA',
            message: `${found.code}: sua decisão foi registrada no sistema.`,
          },
        });

        const nextCase = await transaction.case.findFirst({
          where: {
            status: 'PUBLISHED',
            order: currentCaseOrder,
          },
          select: {
            id: true,
            code: true,
            title: true,
            order: true,
          },
        });

        if (nextCase && nextCase.order === found.order + 1) {
          const unlockEventExists =
            await transaction.playerEvent.findFirst({
              where: {
                userId,
                caseId: nextCase.id,
                type: 'CASE_UNLOCKED',
              },
              select: { id: true },
            });

          if (!unlockEventExists) {
            await transaction.playerEvent.create({
              data: {
                userId,
                caseId: nextCase.id,
                type: 'CASE_UNLOCKED',
                title: 'NOVO CASO DESBLOQUEADO',
                message: `${nextCase.code} está disponível no arquivo de casos.`,
              },
            });
          }
        }

        const unlockedAchievements =
          await achievementService.evaluateAndUnlock(
            transaction,
            userId,
            {
              completedCases,
              discoveredCases,
              totalCases: totalPublishedCases,
              countryCount: discoveredCountries.length,
            },
          );

        for (const achievement of unlockedAchievements) {
          await transaction.playerEvent.create({
            data: {
              userId,
              type: 'ACHIEVEMENT_UNLOCKED',
              title: 'CONQUISTA DESBLOQUEADA',
              message: `${achievement.title} foi adicionada ao seu arquivo.`,
            },
          });
        }

        const milestones = [25, 50, 75, 100];

        for (const milestone of milestones) {
          if (
            previousProgressPercent < milestone &&
            progressPercent >= milestone
          ) {
            await transaction.playerEvent.create({
              data: {
                userId,
                type: 'MILESTONE',
                title: `CARREIRA: ${milestone}%`,
                message: `Você alcançou ${milestone}% da campanha.`,
              },
            });
          }
        }

        return {
          case: {
            code: found.code,
            title: found.title,
            order: found.order,
          },
          decision: {
            optionId: option.id,
            title: option.title,
          },
          metrics: after,
          metricChanges,
          progress: {
            currentCaseOrder,
            completedCases,
            discoveredCases,
            progressPercent,
          },
          realCase: {
            outcome: found.realOutcome,
            sourceUrl: found.sourceUrl,
            sourceTitle: found.sourceTitle,
          },
          nextCase: nextCase
            ? {
                code: nextCase.code,
                title: nextCase.title,
                order: nextCase.order,
              }
            : null,
          unlockedAchievements: unlockedAchievements.map(
            (achievement) => ({
              code: achievement.code,
              title: achievement.title,
              icon: achievement.icon,
            }),
          ),
        };
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target;

        const isDuplicateDecision = Array.isArray(target)
          ? target.includes('userId') && target.includes('caseId')
          : typeof target === 'string' &&
            target.includes('userId') &&
            target.includes('caseId');

        if (isDuplicateDecision) {
          const conflict = new Error(
            'A decisão deste caso já foi registrada.',
          );
          conflict.name = 'ConflictError';
          throw conflict;
        }
      }

      throw error;
    }
  }
}

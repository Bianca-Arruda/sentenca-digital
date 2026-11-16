import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';
import { AchievementRepository } from './achievement.repository';

const repository = new AchievementRepository();

export class AchievementService {
  async list(userId: string) {
    const achievements = await repository.findForUser(userId);
    return achievements.map(({ users, ...achievement }) => ({
      ...achievement,
      unlocked: users.length > 0,
      unlockedAt: users[0]?.unlockedAt ?? null,
    }));
  }

  async evaluateAndUnlock(transaction: Prisma.TransactionClient, userId: string, stats: { completedCases: number; discoveredCases: number; totalCases: number; countryCount: number }) {
    const codes = [
      stats.completedCases >= 1 ? 'FIRST_SENTENCE' : null,
      stats.discoveredCases >= 5 ? 'OPEN_ARCHIVE' : null,
      stats.completedCases >= 10 ? 'DIGITAL_JURISPRUDENCE' : null,
      stats.countryCount >= 5 ? 'INTERNATIONAL_COURT' : null,
      stats.totalCases > 0 && stats.discoveredCases >= stats.totalCases ? 'COMPLETE_ARCHIVE' : null,
    ].filter((code): code is string => Boolean(code));

    const unlocked = [];
    for (const code of codes) {
      const achievement = await transaction.achievement.findUnique({
        where: { code },
        select: { id: true, code: true, title: true, description: true, icon: true },
      });
      if (!achievement) continue;

      const existing = await transaction.userAchievement.findUnique({
        where: { userId_achievementId: { userId, achievementId: achievement.id } },
        select: { id: true },
      });
      if (existing) continue;

      await transaction.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      });
      unlocked.push(achievement);
    }

    return unlocked;
  }
}

import { prisma } from '../../lib/prisma';

export class AchievementRepository {
  findForUser(userId: string) {
    return prisma.achievement.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sortOrder: 'asc' },
      include: {
        users: {
          where: { userId },
          select: { unlockedAt: true },
        },
      },
    });
  }

  findActiveByCode(code: string) {
    return prisma.achievement.findUnique({
      where: { code },
      select: { id: true, code: true, title: true, description: true, icon: true },
    });
  }

  unlock(transaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], userId: string, achievementId: string) {
    return transaction.userAchievement.upsert({
      where: { userId_achievementId: { userId, achievementId } },
      update: {},
      create: { userId, achievementId },
    });
  }
}

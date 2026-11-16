import { prisma } from '../../lib/prisma';

export class ProgressRepository {
  findByUserId(userId: string) {
    return prisma.userProgress.findUnique({
      where: { userId },
      include: { societyMetrics: true },
    });
  }

  ensureByUserId(userId: string) {
    return prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        societyMetrics: {
          create: {},
        },
      },
      include: { societyMetrics: true },
    });
  }

  countPublishedCases() {
    return prisma.case.count({ where: { status: 'PUBLISHED' } });
  }

  findNextCase(order: number) {
    return prisma.case.findFirst({
      where: { status: 'PUBLISHED', order },
      select: { code: true, title: true, order: true },
    });
  }

  countUserDecisions(userId: string) {
    return prisma.userDecision.count({ where: { userId } });
  }

  async countDiscoveredCountries(userId: string) {
    const rows = await prisma.case.findMany({
      where: {
        status: 'PUBLISHED',
        userCases: { some: { userId, discoveredAt: { not: null } } },
      },
      select: { countryCode: true },
      distinct: ['countryCode'],
    });
    return rows.length;
  }

  countUnlockedAchievements(userId: string) {
    return prisma.userAchievement.count({ where: { userId } });
  }

  countActiveAchievements() {
    return prisma.achievement.count({ where: { status: 'ACTIVE' } });
  }

  findRecentEvents(userId: string, limit = 8) {
    return prisma.playerEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        createdAt: true,
        case: { select: { code: true } },
      },
    });
  }
}

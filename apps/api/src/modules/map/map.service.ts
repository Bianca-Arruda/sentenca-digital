import { prisma } from '../../lib/prisma';

export async function getWorldArchive(userId: string) {
  const progress = await prisma.userProgress.upsert({
    where: { userId },
    update: {},
    create: { userId, societyMetrics: { create: {} } },
    select: { currentCaseOrder: true, completedCases: true, discoveredCases: true, progressPercent: true },
  });

  const cases = await prisma.case.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      id: true,
      code: true,
      title: true,
      country: true,
      countryCode: true,
      year: true,
      latitude: true,
      longitude: true,
      order: true,
      userCases: {
        where: { userId },
        select: { isCompleted: true, discoveredAt: true },
        take: 1,
      },
      decisions: {
        where: { userId },
        select: { id: true },
        take: 1,
      },
    },
    orderBy: { order: 'asc' },
  });

  const countries = new Map<string, {
    country: string;
    countryCode: string;
    caseCount: number;
    completedCases: number;
    discoveredCases: number;
    unlocked: boolean;
  }>();

  const mappedCases = cases.map((item) => {
    const userCase = item.userCases[0];
    const completed = Boolean(userCase?.isCompleted || item.decisions.length > 0);
    const unlocked = item.order <= progress.currentCaseOrder;
    const discovered = Boolean(userCase?.discoveredAt);

    const current = countries.get(item.countryCode);
    countries.set(item.countryCode, {
      country: item.country,
      countryCode: item.countryCode,
      caseCount: (current?.caseCount ?? 0) + 1,
      completedCases: (current?.completedCases ?? 0) + (completed ? 1 : 0),
      discoveredCases: (current?.discoveredCases ?? 0) + (discovered ? 1 : 0),
      unlocked: Boolean(current?.unlocked || unlocked),
    });

    return {
      id: item.id,
      code: item.code,
      title: item.title,
      country: item.country,
      countryCode: item.countryCode,
      year: item.year,
      latitude: item.latitude,
      longitude: item.longitude,
      order: item.order,
      accessStatus: completed ? 'COMPLETED' : unlocked ? (discovered ? 'IN_PROGRESS' : 'AVAILABLE') : 'LOCKED',
    } as const;
  });

  return {
    progress: {
      currentCaseOrder: progress.currentCaseOrder,
      completedCases: progress.completedCases,
      discoveredCases: progress.discoveredCases,
      progressPercent: progress.progressPercent,
    },
    totalCases: mappedCases.length,
    totalCountries: countries.size,
    countries: [...countries.values()].sort((a, b) => a.country.localeCompare(b.country)),
    cases: mappedCases,
  };
}

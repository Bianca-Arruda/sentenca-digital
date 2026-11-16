import { ProgressRepository } from './progress.repository';

const repository = new ProgressRepository();

function getCareer(progressPercent: number) {
  if (progressPercent >= 100) {
    return { code: 'MASTER', title: 'Sentença Digital', nextPercent: null };
  }

  if (progressPercent >= 75) {
    return { code: 'SENIOR', title: 'Conselheiro Digital', nextPercent: 100 };
  }

  if (progressPercent >= 50) {
    return { code: 'JUDGE', title: 'Juiz Digital', nextPercent: 75 };
  }

  if (progressPercent >= 25) {
    return { code: 'ANALYST', title: 'Analista Digital', nextPercent: 50 };
  }

  return { code: 'NOVICE', title: 'Observador Digital', nextPercent: 25 };
}

export class ProgressService {
  async getForUser(userId: string) {
    const progress = await repository.ensureByUserId(userId);
    const [totalCases, nextCase, events, decisionsCount, discoveredCountries, unlockedAchievements, totalAchievements] = await Promise.all([
      repository.countPublishedCases(),
      repository.findNextCase(progress.currentCaseOrder),
      repository.findRecentEvents(userId),
      repository.countUserDecisions(userId),
      repository.countDiscoveredCountries(userId),
      repository.countUnlockedAchievements(userId),
      repository.countActiveAchievements(),
    ]);

    return {
      progress,
      totalCases,
      career: getCareer(progress.progressPercent),
      nextCase,
      events,
      statistics: {
        decisionsCount,
        discoveredCountries,
        unlockedAchievements,
        totalAchievements,
      },
    };
  }
}

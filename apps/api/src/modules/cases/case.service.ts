import { prisma } from '../../lib/prisma';
import { CaseRepository } from './case.repository';

const repository = new CaseRepository();

export class CaseService {
  async listCasesForUser(userId: string) {
    const [cases, progress] = await Promise.all([
      repository.findPublishedCasesWithUserState(userId),
      prisma.userProgress.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          societyMetrics: { create: {} },
        },
        select: { currentCaseOrder: true },
      }),
    ]);

    return cases.map(({ userCases, decisions, ...item }) => {
      const userCase = userCases[0];
      const completed = userCase?.isCompleted || decisions.length > 0;
      const available = item.order <= progress.currentCaseOrder;

      return {
        ...item,
        accessStatus: completed ? 'COMPLETED' : available ? (userCase ? 'IN_PROGRESS' : 'AVAILABLE') : 'LOCKED',
      } as const;
    });
  }

  async getAccessibleCase(userId: string, identifier: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    const found = isUuid ? await repository.findPublicById(identifier) : await repository.findPublicByCode(identifier);

    if (!found || found.status !== 'PUBLISHED') {
      return null;
    }

    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        societyMetrics: { create: {} },
      },
      select: { currentCaseOrder: true },
    });

    if (found.order > progress.currentCaseOrder) {
      return null;
    }

    const existingUserCase = await prisma.userCase.findUnique({
      where: { userId_caseId: { userId, caseId: found.id } },
      select: { id: true, discoveredAt: true },
    });

    await prisma.userCase.upsert({
      where: { userId_caseId: { userId, caseId: found.id } },
      update: {},
      create: {
        userId,
        caseId: found.id,
        discoveredAt: new Date(),
      },
    });

    if (!existingUserCase?.discoveredAt) {
      await prisma.playerEvent.create({
        data: {
          userId,
          caseId: found.id,
          type: 'CASE_STARTED',
          title: 'CASO DESCOBERTO',
          message: `${found.code} foi adicionado ao seu registro de investigação.`,
        },
      });
    }

    const [userCase, decision] = await Promise.all([
      prisma.userCase.findUnique({
        where: { userId_caseId: { userId, caseId: found.id } },
        select: { isCompleted: true },
      }),
      prisma.userDecision.findUnique({
        where: { userId_caseId: { userId, caseId: found.id } },
        select: { id: true },
      }),
    ]);

    return {
      ...found,
      playerStatus: decision || userCase?.isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
    }; 
  }

  getEvidence(caseId: string) {
    return repository.findEvidenceByCaseId(caseId);
  }

  getDecisionOptions(caseId: string) {
    return repository.findDecisionOptionsByCaseId(caseId);
  }
}

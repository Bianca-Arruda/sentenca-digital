import type { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const caseSummarySelect = {
  id: true,
  code: true,
  title: true,
  description: true,
  country: true,
  countryCode: true,
  year: true,
  category: true,
  kind: true,
  status: true,
  order: true,
} satisfies Prisma.CaseSelect;

const publicCaseSelect = {
  ...caseSummarySelect,
  guideMessage: true,
  context: true,
  decisionQuestion: true,
  evidence: { orderBy: { sortOrder: 'asc' } },
  decisionOptions: {
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      sortOrder: true,
    },
  },
} satisfies Prisma.CaseSelect;

export class CaseRepository {
  findPublishedCases() {
    return prisma.case.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      select: caseSummarySelect,
    });
  }

  findPublishedCasesWithUserState(userId: string) {
    return prisma.case.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      select: {
        ...caseSummarySelect,
        userCases: {
          where: { userId },
          select: {
            isCompleted: true,
            discoveredAt: true,
            startedAt: true,
          },
        },
        decisions: {
          where: { userId },
          select: { id: true },
          take: 1,
        },
      },
    });
  }

  findById(id: string) {
    return prisma.case.findUnique({
      where: { id },
      include: {
        evidence: { orderBy: { sortOrder: 'asc' } },
        decisionOptions: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  findByCode(code: string) {
    return prisma.case.findUnique({
      where: { code },
      include: {
        evidence: { orderBy: { sortOrder: 'asc' } },
        decisionOptions: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  findPublicById(id: string) {
    return prisma.case.findUnique({
      where: { id },
      select: publicCaseSelect,
    });
  }

  findPublicByCode(code: string) {
    return prisma.case.findUnique({
      where: { code },
      select: publicCaseSelect,
    });
  }

  findEvidenceByCaseId(caseId: string) {
    return prisma.evidence.findMany({
      where: { caseId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findDecisionOptionsByCaseId(caseId: string) {
    return prisma.decisionOption.findMany({
      where: { caseId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}

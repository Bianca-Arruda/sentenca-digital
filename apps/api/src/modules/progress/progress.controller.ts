import type { RequestHandler } from 'express';
import { ProgressService } from './progress.service';

const service = new ProgressService();

export const getProgress: RequestHandler = async (request, response, next) => {
  try {
    const result = await service.getForUser(request.user!.id);
    const progress = result.progress;

    response.json({
      data: {
        currentCaseOrder: progress.currentCaseOrder,
        completedCases: progress.completedCases,
        discoveredCases: progress.discoveredCases,
        progressPercent: progress.progressPercent,
        totalCases: result.totalCases,
        career: result.career,
        nextCase: result.nextCase,
        societyMetrics: {
          responsibility: progress.societyMetrics?.responsibility ?? 50,
          adoption: progress.societyMetrics?.aiAdoption ?? 50,
          trust: progress.societyMetrics?.publicTrust ?? 50,
        },
        events: result.events,
        statistics: result.statistics,
      },
    });
  } catch (error) {
    next(error);
  }
};

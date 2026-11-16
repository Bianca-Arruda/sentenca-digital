
import type { RequestHandler } from 'express';
import { ProgressService } from '../progress/progress.service';

const service = new ProgressService();

export const getMetrics: RequestHandler = async (request, response, next) => {
  try {
    const result = await service.getForUser(request.user!.id);
    const metrics = result.progress.societyMetrics;

    response.json({
      data: {
        responsibility: metrics?.responsibility ?? 50,
        adoption: metrics?.aiAdoption ?? 50,
        trust: metrics?.publicTrust ?? 50,
      },
    });
  } catch (error) {
    next(error);
  }
};


import type { RequestHandler } from 'express';
import { createDecisionSchema } from './decision.validation';
import { DecisionService } from './decision.service';

const service = new DecisionService();

export const registerDecision: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const rawId = request.params.id;
    const caseId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!caseId) {
      response.status(400).json({
        message: 'Identificador do caso inválido.',
      });
      return;
    }

    const input = createDecisionSchema.parse(request.body);

    const result = await service.register(
      request.user!.id,
      caseId,
      input,
    );

    response.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

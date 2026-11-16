
import type { RequestHandler } from 'express';
import { CaseService } from './case.service';

const service = new CaseService();

function getCaseIdentifier(id: string | string[] | undefined): string | null {
  const value = Array.isArray(id) ? id[0] : id;
  return value?.trim() || null;
}

export const listCases: RequestHandler = async (request, response, next) => {
  try {
    const cases = await service.listCasesForUser(request.user!.id);
    response.json({ data: cases });
  } catch (error) {
    next(error);
  }
};

export const getCase: RequestHandler = async (request, response, next) => {
  try {
    const caseId = getCaseIdentifier(request.params.id);

    if (!caseId) {
      response.status(400).json({ message: 'Identificador do caso inválido.' });
      return;
    }

    const found = await service.getAccessibleCase(request.user!.id, caseId);

    if (!found) {
      response.status(404).json({
        error: 'CASE_LOCKED_OR_NOT_FOUND',
        message: 'Caso não encontrado ou ainda bloqueado.',
      });
      return;
    }

    response.json({ data: found });
  } catch (error) {
    next(error);
  }
};

export const getCaseEvidence: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const caseId = getCaseIdentifier(request.params.id);

    if (!caseId) {
      response.status(400).json({ message: 'Identificador do caso inválido.' });
      return;
    }

    const found = await service.getAccessibleCase(request.user!.id, caseId);

    if (!found) {
      response.status(404).json({
        error: 'CASE_LOCKED_OR_NOT_FOUND',
        message: 'Caso não encontrado ou ainda bloqueado.',
      });
      return;
    }

    response.json({ data: found.evidence });
  } catch (error) {
    next(error);
  }
};

export const getCaseDecisions: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const caseId = getCaseIdentifier(request.params.id);

    if (!caseId) {
      response.status(400).json({ message: 'Identificador do caso inválido.' });
      return;
    }

    const found = await service.getAccessibleCase(request.user!.id, caseId);

    if (!found) {
      response.status(404).json({
        error: 'CASE_LOCKED_OR_NOT_FOUND',
        message: 'Caso não encontrado ou ainda bloqueado.',
      });
      return;
    }

    response.json({ data: found.decisionOptions });
  } catch (error) {
    next(error);
  }
};

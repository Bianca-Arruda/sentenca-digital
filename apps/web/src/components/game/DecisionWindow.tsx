"use client";

import { useEffect, useState } from 'react';
import { registerDecision } from '@/features/decisions/api';
import { getCase } from '@/features/cases/api';
import { PixelButton } from '@/components/system/PixelButton';
import type { CaseDetail } from '@/types/case';
import type { DecisionResult } from '@/types/decision';

export function DecisionWindow({ caseCode, onRegistered }: { caseCode: string; onRegistered: (result: DecisionResult) => void }) {
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setCaseData(null);
    setSelectedOption(null);

    getCase(caseCode)
      .then((response) => {
        if (active) setCaseData(response.data);
      })
      .catch(() => {
        if (active) setError('NÃO FOI POSSÍVEL CARREGAR O MÓDULO DE DECISÃO.');
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [caseCode]);

  async function handleDecision() {
    if (!selectedOption || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await registerDecision(caseCode, selectedOption);
      onRegistered(response.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'NÃO FOI POSSÍVEL REGISTRAR A DECISÃO.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="window-content system-loading">INICIANDO JUDICIAL_DECISION.EXE...<br />CARREGANDO ALTERNATIVAS...</div>;
  }

  if (error && !caseData) {
    return <div className="window-content system-error">{error}</div>;
  }

  if (!caseData) {
    return <div className="window-content system-error">CASO NÃO DISPONÍVEL.</div>;
  }

  return (
    <div className="window-content decision-window-content">
      <div className="decision-terminal-header">{caseData.code}</div>
      <div className="decision-warning">VOCÊ ESTÁ DIANTE DA DECISÃO. A ESCOLHA É SUA.</div>
      <div className="terminal-rule" />
      <div className="decision-question">
        <span>QUESTÃO DO CASO</span>
        <h2>{caseData.decisionQuestion}</h2>
      </div>
      <div className="decision-options">
        {caseData.decisionOptions.map((option, index) => (
          <button
            key={option.id}
            type="button"
            className={`decision-option ${selectedOption === option.id ? 'selected' : ''}`}
            onClick={() => setSelectedOption(option.id)}
            disabled={submitting}
          >
            <span className="decision-letter">{String.fromCharCode(65 + index)}</span>
            <span>
              <strong>{option.title}</strong>
              <small>{option.description}</small>
            </span>
          </button>
        ))}
      </div>
      {error && <div className="decision-error">{error}</div>}
      <div className="decision-footer">
        <span>{selectedOption ? 'ALTERNATIVA SELECIONADA' : 'SELECIONE UMA ALTERNATIVA'}</span>
        <PixelButton onClick={handleDecision} disabled={!selectedOption || submitting}>
          {submitting ? 'REGISTRANDO...' : 'CONFIRMAR DECISÃO ▶'}
        </PixelButton>
      </div>
    </div>
  );
}

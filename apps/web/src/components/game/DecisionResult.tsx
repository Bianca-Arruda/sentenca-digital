
"use client";

import type {
  DecisionOption,
  RealOutcome,
} from "@/types/decision";

type DecisionResultProps = {
  decision: DecisionOption;
  realOutcome: RealOutcome;
  scores: {
    societyProtection: number;
    innovationFreedom: number;
    justiceTrust: number;
  };
  onContinue: () => void;
};

export default function DecisionResult({
  decision,
  realOutcome,
  scores,
  onContinue,
}: DecisionResultProps) {
  return (
    <section className="decision-result">
      <div className="decision-result__verdict">
        <span>SEU VEREDITO</span>
        <h2>{decision.title}</h2>
        <p>{decision.consequence}</p>
      </div>

      <div className="decision-result__scores">
        <h3>Impacto da sua decisão</h3>

        <p>
          Proteção da sociedade: {scores.societyProtection}/100
        </p>

        <p>
          Liberdade e inovação: {scores.innovationFreedom}/100
        </p>

        <p>
          Confiança na Justiça: {scores.justiceTrust}/100
        </p>
      </div>

      <div className="decision-result__news">
        <span>NOTÍCIA DO FUTURO</span>
        <h3>{decision.newsHeadline}</h3>
        <small>
          Manchete fictícia criada a partir da sua decisão.
        </small>
      </div>

      <div className="decision-result__real">
        <span>O QUE ACONTECEU NA VIDA REAL?</span>
        <h3>{realOutcome.title}</h3>

        <p>{realOutcome.summary}</p>

        <strong>O que aprendemos?</strong>
        <p>{realOutcome.lesson}</p>

        {realOutcome.sourceUrl && (
          <a
            href={realOutcome.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar fonte oficial
          </a>
        )}

        <p className="decision-result__source">
          Fonte: {realOutcome.sourceLabel}
        </p>
      </div>

      <button type="button" onClick={onContinue}>
        Continuar
      </button>
    </section>
  );
}

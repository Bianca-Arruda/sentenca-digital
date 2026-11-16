
"use client";

import type { DecisionOption } from "@/types/decision";

type DecisionPanelProps = {
  decisions: DecisionOption[];
  onSelect: (decision: DecisionOption) => void;
};

export default function DecisionPanel({
  decisions,
  onSelect,
}: DecisionPanelProps) {
  return (
    <section className="decision-panel">
      <header className="decision-panel__header">
        <span className="decision-panel__eyebrow">
          DECISÃO FINAL
        </span>

        <h2>Qual será seu veredito?</h2>

        <p>
          Analise as alternativas. Cada escolha terá consequências
          diferentes para a sociedade.
        </p>
      </header>

      <div className="decision-panel__options">
        {decisions.map((decision, index) => (
          <article
            className="decision-option"
            key={decision.id}
          >
            <span className="decision-option__number">
              OPÇÃO {index + 1}
            </span>

            <h3>{decision.title}</h3>

            <p>{decision.description}</p>

            <div className="decision-option__consequence">
              <strong>Possível consequência</strong>
              <p>{decision.consequence}</p>
            </div>

            <button
              type="button"
              onClick={() => onSelect(decision)}
            >
              Escolher esta decisão
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

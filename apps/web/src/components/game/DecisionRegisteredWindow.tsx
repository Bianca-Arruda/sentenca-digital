
import { PixelButton } from '@/components/system/PixelButton';
import type { DecisionResult } from '@/types/decision';

export function DecisionRegisteredWindow({ result, onOpenRealCase }: { result: DecisionResult; onOpenRealCase: () => void }) {
  return (
    <div className="window-content decision-registered-content">
      <div className="decision-registered-icon">✓</div>
      <div className="decision-terminal-header">DECISAO_REGISTRADA.EXE</div>
      <h2>DECISÃO REGISTRADA</h2>
      <p>{result.case.code} — {result.case.title}</p>

      <div className="registered-choice">
        <span>SUA ESCOLHA</span>
        <strong>{result.decision.title}</strong>
      </div>

      <div className="registered-metrics">
        <Metric
          label="RESPONSABILIDADE"
          value={result.metrics.responsibility}
          change={result.metricChanges.responsibility}
        />

        <Metric
          label="ADOÇÃO DA IA"
          value={result.metrics.adoption}
          change={result.metricChanges.adoption}
        />

        <Metric
          label="CONFIANÇA PÚBLICA"
          value={result.metrics.trust}
          change={result.metricChanges.trust}
        />
      </div>

      <div className="decision-registered-message">
        A decisão foi salva no registro do jogador. Agora veja o que aconteceu no caso real clicando no botão abaixo.
      </div>

      <PixelButton onClick={onOpenRealCase}>
        CASO_REAL.DOC ▶
      </PixelButton>
    </div>
  );
}

function Metric({
  label,
  description,
  value,
  change,
}: {
  label: string;
  description: string;
  value: number;
  change: number;
}) {
  const sign = change > 0 ? '+' : '';
  const className = change > 0 ? 'positive' : change < 0 ? 'negative' : '';

  return (
    <div className="registered-metric">
      <span>{label}</span>
      <strong>
        {value}
        <small className={`metric-change ${className}`}>
          {sign}{change}
        </small>
      </strong>
      <p className="metric-description">{description}</p>
    </div>
  );
}

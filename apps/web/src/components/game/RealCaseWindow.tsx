import { PixelButton } from '@/components/system/PixelButton';
import type { DecisionResult } from '@/types/decision';

export function RealCaseWindow({ result, onContinue }: { result: DecisionResult; onContinue: () => void }) {
  return (
    <div className="window-content real-case-content">
      <div className="document-paper real-case-paper">
        <div className="document-header">
          <strong>CASO_REAL.DOC</strong>
          <span>{result.case.code}</span>
        </div>
        <h2>O QUE ACONTECEU NO CASO REAL?</h2>
        <p>{result.realCase.outcome}</p>
        <div className="document-rule" />
        {result.realCase.sourceUrl ? (
        <>
          <p className="source-label">FONTE VERIFICADA</p>
          <a
            className="source-url"
            href={result.realCase.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            {result.realCase.sourceTitle || "Consultar fonte oficial"}
          </a>
        </>
      ) : (
        <p className="source-label">
          Fonte externa não disponível nesta consulta.
        </p>
      )}
      </div>
      <div className="real-case-footer">
        <span>{result.nextCase ? `${result.nextCase.code} FOI DESBLOQUEADO.` : 'CAMPANHA CONCLUÍDA.'}</span>
        <PixelButton onClick={onContinue}>{result.nextCase ? 'CONTINUAR ▶' : 'FECHAR ▶'}</PixelButton>
      </div>
    </div>
  );
}

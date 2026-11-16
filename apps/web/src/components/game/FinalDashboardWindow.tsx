import { PixelButton } from "@/components/system/PixelButton";
import { PixelProgressBar } from "@/components/system/PixelProgressBar";
import type { ProgressState } from "@/types/progress";

//import { MetricRow } from "@/features/dashboard/components/MetricRow"; // Exemplo de caminho


export function FinalDashboardWindow({ progress, onDashboard }: { progress: ProgressState; onDashboard: () => void }) {
  const completed = progress.progressPercent >= 100;

  return (
    <div className="window-content final-dashboard-content">
      <div className="program-menubar"><span>Arquivo</span><span>Exibir</span><span>Relatório</span><span>Ajuda</span></div>

      <div className="final-header">
        <div>
          <small>ARQUIVO FINAL DO PROJETO</small>
          <h1>{completed ? "SENTENÇA DIGITAL" : "RELATÓRIO DE PROGRESSO"}</h1>
          <p>{completed ? "O projeto foi concluída. O arquivo registra as decisões tomadas e o estado final da sociedade." : "O relatório final será liberado quando todos os casos forem concluídos."}</p>
        </div>
        <div className="final-stamp">{completed ? "100%" : `${progress.progressPercent}%`}</div>
      </div>

      <section className="inset-panel final-career-panel">
        <div className="panel-title">▣ CARREIRA CONCLUÍDA</div>
        <div className="final-career-line">
          <strong>{progress.career.title}</strong>
          <span>{progress.completedCases} / {progress.totalCases} casos</span>
        </div>
        <PixelProgressBar value={progress.progressPercent} />
        <p>{completed ? "Todos os casos publicados foram concluídos." : `Faltam ${Math.max(progress.totalCases - progress.completedCases, 0)} casos para concluir o projeto.`}</p>
      </section>

      <div className="final-grid">
        <section className="inset-panel">
          <div className="panel-title">▤ ESTATÍSTICAS</div>
          <div className="final-stat-list">
            <Stat label="Casos concluídos" value={`${progress.completedCases} / ${progress.totalCases}`} />
            <Stat label="Casos descobertos" value={`${progress.discoveredCases} / ${progress.totalCases}`} />
            <Stat label="Decisões registradas" value={String(progress.statistics.decisionsCount)} />
            <Stat label="Países descobertos" value={String(progress.statistics.discoveredCountries)} />
            <Stat label="Conquistas" value={`${progress.statistics.unlockedAchievements} / ${progress.statistics.totalAchievements}`} />
          </div>
        </section>
        <section className="inset-panel">
  <div className="panel-title">▣ ESTADO FINAL DA SOCIEDADE</div>
  <Metric label="Responsabilidade - nível de responsabilidade das empresas que desenvolvem IA." value={progress.societyMetrics.responsibility} />
  <Metric label="Adoção da IA - aumento/redução do uso de IA pela população." value={progress.societyMetrics.adoption} />
  <Metric label="Confiança Pública - aumento/redução da confiança da população no sistema judiciário." value={progress.societyMetrics.trust} />
</section>

      </div>

      <section className="inset-panel final-message-panel">
        <div className="panel-title">▣ ENCERRAMENTO</div>
        {completed ? (
          <>
            <p> Você chegou ao fim do arquivo.</p>
            <p> As decisões registradas nesse projeto não são classificadas como certas ou erradas. Elas representam as escolhas feitas diante de situações reais envolvendo sistemas de Inteligência Artificial.</p>
          </>
        ) : (
          <p>Continue o projeto para liberar o relatório final e o encerramento.</p>
        )}
      </section>

      <div className="final-footer">
        <span>{completed ? "PROJETO_STATUS: CONCLUÍDO" : "PROJETO_STATUS: EM_PROGRESSO"}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="final-stat"><span>{label}</span><strong>{value}</strong></div>;
}
/*
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="final-metric">
      <div><span>{label}</span><strong>{value}</strong></div>
      <div className="metric-track"><div style={{ width: `${value}%` }} /></div>
    </div>
  );
}
  */
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="final-metric">
      <div className="flex justify-between items-center mb-1">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      {/* Usando o componente de barra oficial do seu sistema pixel */}
      <PixelProgressBar value={value} />
    </div>
  );
}

  



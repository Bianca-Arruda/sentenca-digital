"use client";

import { useEffect, useState } from "react";
import { PixelButton } from "@/components/system/PixelButton";
import { PixelProgressBar } from "@/components/system/PixelProgressBar";
import { listCases } from "@/features/cases/api";
import type { CaseSummary } from "@/types/case";
import type { SocietyMetrics } from "@/types/game";
import type { ProgressState } from "@/types/progress";

export function DashboardWindow({ metrics, progress, onContinue, onMap, onFinal }: { metrics: SocietyMetrics; progress: ProgressState; onContinue: () => void; onMap: () => void; onFinal: () => void }) {
  const [casesList, setCasesList] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    listCases()
      .then((response) => {
        if (active) setCasesList(response.data);
      })
      .catch(() => {
        if (active) setCasesList([]);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [progress.currentCaseOrder, progress.completedCases]);

  if (loading) {
    return <div className="window-content dashboard-content font-mono p-8 text-center flex items-center justify-center"><span>🔄 CONECTANDO AO SISTEMA DE CASOS...</span></div>;
  }

  const featuredCase = casesList.find((item) => item.accessStatus === "IN_PROGRESS")
    ?? casesList.find((item) => item.accessStatus === "AVAILABLE")
    ?? casesList.find((item) => item.accessStatus === "COMPLETED");
  const recentCases = casesList.filter((item) => item.id !== featuredCase?.id).slice(0, 8);
  const totalCountries = new Set(casesList.map((item) => item.country).filter(Boolean)).size;
  const nextMilestone = progress.career.nextPercent;
  const eventList = progress.events.slice(0, 6);

  return (
    <div className="window-content dashboard-content">
      <div className="program-menubar"><span>Arquivo</span><span>Editar</span><span>Exibir</span><span>Ajuda</span></div>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="inset-panel career-panel">
            <div className="panel-title">▣ CARREIRA</div>
            <div className="career-head">
              <div>
                <small>STATUS PROFISSIONAL</small>
                <strong>{progress.career.title}</strong>
              </div>
              <strong>{progress.progressPercent}%</strong>
            </div>
            <PixelProgressBar value={progress.progressPercent} />
            {progress.progressPercent >= 100 && <div className="final-dashboard-action"><PixelButton onClick={onFinal}>ABRIR RELATÓRIO FINAL ▶</PixelButton></div>}
            <div className="career-stats">
              <span><strong>{progress.completedCases}</strong> concluídos</span>
              <span><strong>{progress.discoveredCases}</strong> descobertos</span>
              <span>{nextMilestone ? `Próximo marco: ${nextMilestone}%` : "Campanha concluída"}</span>
            </div>
          </section>

          <section className="inset-panel featured-panel">
            <div className="panel-title">🌐 CASO ATUAL</div>
            {featuredCase ? (
              <div className="featured-case">
                <div className="case-art">⚖<span>AI</span></div>
                <div className="featured-copy">
                  <small>{featuredCase.code}</small>
                  <h2>{featuredCase.title}</h2>
                  <p>{featuredCase.description}</p>
                  <PixelButton onClick={onContinue}>{featuredCase.accessStatus === "COMPLETED" ? "REVER ARQUIVO ▶" : "CONTINUAR CASO ▶"}</PixelButton>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center font-mono text-xs text-gray-500">NENHUM CASO DISPONÍVEL NO BANCO.</div>
            )}
          </section>

          <section className="inset-panel recent-panel">
            <div className="panel-title">▤ ARQUIVO RECENTE</div>
            <div className="recent-list">
              {recentCases.length > 0 ? recentCases.map((item) => (
                <div className="recent-row" key={item.id}>
                  <span className={`case-status-icon ${item.accessStatus}`}>
                    {item.accessStatus === "LOCKED" ? "🔒" : item.accessStatus === "COMPLETED" ? "✓" : "⚖"}
                  </span>
                  <div><strong>{item.code} — {item.title}</strong><small>{item.country} · {item.year}</small></div>
                  <span className={`status-label ${item.accessStatus}`}>
                    {item.accessStatus === "IN_PROGRESS" ? "● Em andamento" : item.accessStatus === "AVAILABLE" ? "● Disponível" : item.accessStatus === "COMPLETED" ? "✓ Concluído" : "🔒 Bloqueado"}
                  </span>
                </div>
              )) : <div className="p-4 text-center font-mono text-xs text-gray-500">NENHUM OUTRO CASO DISPONÍVEL.</div>}
            </div>
          </section>
        </div>

        <aside className="dashboard-side">
          <section className="inset-panel metrics-panel">
            <div className="panel-title">▣ ESTADO DA SOCIEDADE</div>
            <MetricRow label="Responsabilidade" value={metrics.responsibility} type="responsibility" />
            <MetricRow label="Adoção da IA" value={metrics.adoption} type="adoption" />
            <MetricRow label="Confiança Pública" value={metrics.trust} type="trust" />
          </section>

          <section className="inset-panel events-panel">
            <div className="panel-title">▤ EVENTOS DO SISTEMA</div>
            <div className="event-list">
              {eventList.length > 0 ? eventList.map((event) => (
                <div className="event-row" key={event.id}>
                  <span className="event-icon">{getEventIcon(event.type)}</span>
                  <div>
                    <strong>{event.title}</strong>
                    <small>{event.message}</small>
                    {event.case?.code && <span>{event.case.code}</span>}
                  </div>
                </div>
              )) : <div className="event-empty">NENHUM EVENTO REGISTRADO.</div>}
            </div>
          </section>

         
        </aside>
      </div>
    </div>
  );
}

function MetricRow({ label, value, type }: { label: string; value: number; type: string }) {
  return (
    <div className="metric-row">
      <div className="metric-label"><span>{label}</span><strong>{value}</strong></div>
      <div className={`metric-track ${type}`}><div style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function getEventIcon(type: string) {
  if (type === "CASE_STARTED") return "📂";
  if (type === "DECISAO_REGISTRADA") return "⚖";
  if (type === "CASE_UNLOCKED") return "🔓";
  return "★";
}

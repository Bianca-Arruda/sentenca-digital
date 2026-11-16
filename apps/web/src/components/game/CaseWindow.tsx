"use client";

import { useEffect, useState } from "react";
import { PixelButton } from "@/components/system/PixelButton";
import { getCase } from "@/features/cases/api";
import type { CaseDetail, CaseEvidence } from "@/types/case";
import { CaseGuide } from "./CaseGuide";

export function CaseWindow({
  caseCode,
  onEvidence,
  onDecision,
  discoveredClueIds,
}: {
  caseCode: string;
  onEvidence: (evidence: CaseEvidence) => void;
  onDecision: () => void;
  discoveredClueIds: string[];
}) {
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Acompanhamento da investigação para a JU-STINA.
  const [openedEvidenceIds, setOpenedEvidenceIds] = useState<string[]>([]);
  const [currentEvidence, setCurrentEvidence] =
    useState<CaseEvidence | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);
    setCaseData(null);
    setOpenedEvidenceIds([]);
    setCurrentEvidence(null);

    getCase(caseCode)
      .then((response) => {
        if (active) {
          setCaseData(response.data);
        }
      })
      .catch(() => {
        if (active) {
          setError("ARQUIVO BLOQUEADO, CORROMPIDO OU NÃO ENCONTRADO.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [caseCode]);

  function handleOpenEvidence(evidence: CaseEvidence) {
    setCurrentEvidence(evidence);

    setOpenedEvidenceIds((current) =>
      current.includes(evidence.id)
        ? current
        : [...current, evidence.id]
    );

    onEvidence(evidence);
  }

  if (loading) {
    return (
      <div className="window-content system-loading">
        ABRINDO {caseCode}.EXE...
        <br />
        CARREGANDO EVIDÊNCIAS...
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="window-content system-error">
        {error ?? "CASO NÃO ENCONTRADO."}
      </div>
    );
  }

  return (
    <div className="window-content case-window-content">
      <CaseGuide
        message={caseData.guideMessage}
        caseCode={caseData.code}
        currentEvidence={currentEvidence}
        openedEvidenceCount={openedEvidenceIds.length}
        totalEvidenceCount={caseData.evidence.length}
        discoveredClueIds={discoveredClueIds}
        investigationCompleted={
          discoveredClueIds.length > 0 &&
          discoveredClueIds.length >= caseData.evidence.filter(
            (item) => Boolean(item.hiddenClue)
          ).length
        }
      />

      <div className="case-file-header">
        ARQUIVO DO CASO / INVESTIGAÇÃO
      </div>

      <div className="case-meta-grid">
        <div>
          <span>PAÍS</span>
          <strong>{caseData.country.toUpperCase()}</strong>
        </div>

        <div>
          <span>ANO</span>
          <strong>{caseData.year}</strong>
        </div>

        <div>
          <span>CATEGORIA</span>
          <strong>{caseData.category}</strong>
        </div>

        <div>
          <span>TIPO</span>
          <strong>{formatKind(caseData.kind)}</strong>
        </div>

        <div>
          <span>STATUS</span>
          <strong className="status-open">
            INVESTIGAÇÃO ABERTA
          </strong>
        </div>
      </div>

      <div className="terminal-rule" />


      <h3>EVIDÊNCIAS</h3>

      <p className="case-instruction">
        ABRA OS ARQUIVOS ANTES DE FORMAR SUA DECISÃO.
      </p>

      <div className="evidence-list">
        {caseData.evidence.map((evidence) => {
          const opened = openedEvidenceIds.includes(evidence.id);

          return (
            <PixelButton
              key={evidence.id}
              className="evidence-button"
              onClick={() => handleOpenEvidence(evidence)}
            >
              <span>{evidenceIcon(evidence.type)}</span>
              <span>{evidence.title.toUpperCase()}</span>
              <small>
                {evidence.type}
                {opened ? " · ABERTO" : ""}
              </small>
            </PixelButton>
          );
        })}
      </div>

      <div className="decision-launch-panel">
        <div>
          <strong>JUDICIAL_DECISION.EXE</strong>
          <span>
            AS EVIDÊNCIAS ESTÃO CARREGADAS.
          </span>
        </div>

        <PixelButton onClick={onDecision}>
          ABRIR DECISÃO ▶
        </PixelButton>
      </div>

      <div className="case-footer">
        [ MODO DE INVESTIGAÇÃO ] — {caseData.code}
      </div>
    </div>
  );
}

function formatKind(kind: CaseDetail["kind"]) {
  if (kind === "REGULATORY") return "REGULATÓRIO";
  if (kind === "CORPORATE_INCIDENT") return "INCIDENTE";
  return "JUDICIAL";
}

function evidenceIcon(type: CaseDetail["evidence"][number]["type"]) {
  if (type === "CONVERSATION") return "▣";
  if (type === "POLICY") return "▤";
  if (type === "REPORT") return "▥";
  return "▧";
}
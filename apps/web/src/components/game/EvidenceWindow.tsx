"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PixelButton } from "@/components/system/PixelButton";
import type { CaseEvidence } from "@/types/case";
import { MetroCameraEvidence } from "./MetroCameraEvidence";

const LEGAL_TERMS: Record<string, string> = {
  "habeas corpus":
    "Medida judicial destinada a proteger a liberdade de locomoção contra ilegalidade ou abuso de poder.",

  "petição":
    "Documento formal apresentado à Justiça para formular pedidos e apresentar argumentos.",

  "jurisprudência":
    "Conjunto de decisões judiciais que ajudam a demonstrar como os tribunais interpretam e aplicam o Direito.",

  "REsp":
    "Recurso Especial. Instrumento utilizado, em hipóteses constitucionais, para discutir questões relacionadas à interpretação de lei federal.",

  "Superior Tribunal de Justiça":
    "Tribunal responsável por uniformizar a interpretação da legislação federal infraconstitucional.",

  "STJ":
    "Sigla do Superior Tribunal de Justiça.",

  "citação jurídica":
    "Referência a uma lei, decisão judicial, doutrina ou outra fonte utilizada para fundamentar um argumento.",

  "ministra":
    "Título utilizado para identificar uma integrante de um tribunal superior, como o Superior Tribunal de Justiça.",

  "inteligência artificial":
    "Tecnologia capaz de executar tarefas como produzir textos, reconhecer padrões e organizar informações.",

  "auditoria":
    "Verificação sistemática de registros, procedimentos ou documentos para identificar inconsistências.",

  "litigância de má-fé":
    "Conduta processual desleal ou abusiva, cuja caracterização depende da análise das circunstâncias e das provas.",

  "referência jurídica":
    "Indicação de uma fonte do Direito utilizada para sustentar determinado argumento.",
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderLegalTerms(text: string): ReactNode {
  const terms = Object.keys(LEGAL_TERMS).sort(
    (a, b) => b.length - a.length,
  );

  const pattern = new RegExp(
    `(${terms.map(escapeRegExp).join("|")})`,
    "gi",
  );

  return text.split(pattern).map((part, index) => {
    const matchedTerm = terms.find(
      (term) => term.toLowerCase() === part.toLowerCase(),
    );

    if (!matchedTerm) {
      return part;
    }

    const explanation = LEGAL_TERMS[matchedTerm];

    return (
      <span
        key={`${matchedTerm}-${index}`}
        className="legal-term-tooltip"
        tabIndex={0}
        title={explanation}
        aria-label={`${part}: ${explanation}`}
      >
        {part}
      </span>
    );
  });
}

export function EvidenceWindow({
  evidence,
  caseCode,
  onClose,
  onClueDiscovered,
}: {
  evidence: CaseEvidence;
  caseCode?: string;
  onClose: () => void;
  onClueDiscovered: (evidenceId: string) => void;
}) {
  const [clueRevealed, setClueRevealed] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [lensActive, setLensActive] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  const evidenceContentRef = useRef<HTMLDivElement>(null);

  const lines = formatLines(evidence.content);
  const viewer = normalizeViewer(evidence.viewer, evidence.type);

  const isPdf = viewer === 'document';
  const isEmail = viewer === 'email';
  const isLog = viewer === 'terminal';

  const isMetroCase = caseCode === 'CASO_002';

  useEffect(() => {
    setClueRevealed(false);
    setLensActive(false);
    setHasSelection(false);
    setVisibleLines(0);
  }, [evidence.id]);

  useEffect(() => {
    if (!isLog) {
      setVisibleLines(lines.length);
      return;
    }

    setVisibleLines(0);

    const interval = window.setInterval(() => {
      setVisibleLines((current) => {
        if (current >= lines.length) {
          window.clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [evidence.id, isLog, lines.length]);

  useEffect(() => {
    function handleSelection() {
      const selection = window.getSelection();
      const root = evidenceContentRef.current;

      if (!selection || selection.isCollapsed || !root) {
        setHasSelection(false);
        return;
      }

      const selectedText = selection.toString().trim();

      const anchorNode = selection.anchorNode;
      const focusNode = selection.focusNode;

      const anchorElement =
        anchorNode instanceof Element
          ? anchorNode
          : anchorNode?.parentElement;

      const focusElement =
        focusNode instanceof Element
          ? focusNode
          : focusNode?.parentElement;

      const anchorContent = anchorElement?.closest('.evidence-readable-content');
      const focusContent = focusElement?.closest('.evidence-readable-content');

      const selectionInsideEvidence =
        anchorContent instanceof Element &&
        focusContent instanceof Element &&
        anchorContent === focusContent &&
        root.contains(anchorContent);

      setHasSelection(selectionInsideEvidence && selectedText.length > 0);
    }

    document.addEventListener('selectionchange', handleSelection);

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, [evidence.id]);

  function activateLens() {
    setLensActive(true);
  }

  function revealClue() {
    if (!evidence.hiddenClue || clueRevealed || !lensActive || !hasSelection) {
      return;
    }

    setClueRevealed(true);
    onClueDiscovered(evidence.id);
  }

  function handleLensAction() {
    if (!evidence.hiddenClue || clueRevealed) {
      return;
    }

    if (!lensActive) {
      activateLens();
      return;
    }

    revealClue();
  }

    return (
    <div className="window-content evidence-window" ref={evidenceContentRef}>
      {isPdf && isMetroCase && <MetroCameraEvidence />}

      {isPdf && !isMetroCase && (
        <PdfViewer
          evidence={evidence}
          lines={lines}
          clueRevealed={clueRevealed}
          lensActive={lensActive}
          hasSelection={hasSelection}
          onLensAction={handleLensAction}
        />
      )}

      {isEmail && (
        <EmailViewer
          evidence={evidence}
          lines={lines}
          clueRevealed={clueRevealed}
        />
      )}

      {isLog && (
        <TerminalViewer
          evidence={evidence}
          lines={lines}
          visibleLines={visibleLines}
          clueRevealed={clueRevealed}
        />
      )}

      {!isPdf && !isEmail && !isLog && (
        <GenericViewer evidence={evidence} lines={lines} />
      )}

      {(!isPdf || isMetroCase) && (
      <div className="evidence-bottom-actions">
        {evidence.hiddenClue && (
          <div className="evidence-lens-controls">
            <button
  type="button"
  className={
    !clueRevealed && (!lensActive || hasSelection)
      ? "evidence-lens-pulse"
      : ""
  }
  onClick={handleLensAction}
  disabled={clueRevealed || (lensActive && !hasSelection)}
>
              <strong>
                {clueRevealed
                  ? "PISTA REVELADA"
                  : !lensActive
                    ? "ATIVAR MODO LENTE"
                    : !hasSelection
                      ? "SELECIONE UM TRECHO"
                      : "ANALISAR TRECHO"}
              </strong>
            </button>

            {lensActive && !clueRevealed && (
              <small>
                Selecione uma parte do conteúdo para habilitar a análise.
              </small>
            )}
          </div>
        )}

        <PixelButton onClick={onClose}>FECHAR</PixelButton>
      </div>
    )}
    </div>
  );
}

function PdfViewer({
  evidence,
  lines,
  clueRevealed,
  lensActive,
  hasSelection,
  onLensAction,
}: {
  evidence: CaseEvidence;
  lines: string[];
  clueRevealed: boolean;
  lensActive: boolean;
  hasSelection: boolean;
  onLensAction: () => void;
}) {
  const metadata = evidence.metadata;
  const revealedClueRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!clueRevealed) return;

  const timeout = window.setTimeout(() => {
    revealedClueRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 150);

  return () => window.clearTimeout(timeout);
}, [clueRevealed]);
  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <div className="pdf-toolbar-left">
          <span className="pdf-icon">PDF</span>
          <strong>{evidence.fileName || toFileName(evidence.title, 'pdf')}</strong>
        </div>

        <div className="pdf-toolbar-right">
          <button
            type="button"
            className={`pdf-lens-action ${
  !clueRevealed && (!lensActive || hasSelection)
    ? "evidence-lens-pulse"
    : ""
}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onLensAction}
            disabled={clueRevealed || (lensActive && !hasSelection)}
            aria-label={
              clueRevealed
                ? "Pista revelada"
                : !lensActive
                  ? "Ativar Modo Lente"
                  : !hasSelection
                    ? "Selecione um trecho do documento"
                    : "Analisar trecho selecionado"
            }
          >
            {clueRevealed
              ? "PISTA REVELADA"
              : !lensActive
                ? "ATIVAR MODO LENTE"
                : !hasSelection
                  ? "SELECIONE UM TRECHO"
                  : "ANALISAR TRECHO"}
          </button>

          <span>◀</span>
          <span>1 / 1</span>
          <span>▶</span>

          

          <span>⛶</span>
        </div>
      </div>

      <div className="pdf-workspace">
        <div className="pdf-page">
          <div className="pdf-page-header">
            <div>
              <strong>{metadata?.institution || 'INSTITUIÇÃO NÃO INFORMADA'}</strong>
              <small>{metadata?.documentLabel || 'DOCUMENTO DIGITAL'}</small>
            </div>
            <span>{metadata?.status || 'REGISTRO'}</span>
          </div>

          <div className="pdf-page-rule" />

          <h1>{evidence.title}</h1>

          <div className="pdf-metadata">
            <div>
              <span>PROCESSO / REFERÊNCIA</span>
              <strong>{metadata?.processNumber || 'Não informado'}</strong>
            </div>
            <div>
              <span>DOCUMENTO</span>
              <strong>{metadata?.documentLabel || evidence.title}</strong>
            </div>
            <div>
              <span>STATUS</span>
              <strong>{metadata?.status || 'Não informado'}</strong>
            </div>
          </div>

          <p className="pdf-description">{evidence.description}</p>

          <div className="pdf-document-body evidence-readable-content">
            {lines.map((line, index) => (
              <p key={`${line}-${index}`}>
                {renderLegalTerms(line || '\u00A0')}
              </p>
            ))}
          </div>

         {evidence.hiddenClue && (
  <div
    className="revealed-clue-container"
    ref={revealedClueRef}
  >
    {/* JU-STINA E SEU DIÁLOGO */}
    {clueRevealed && (
      <div className="justina-clue-reveal">
        <div
          className="case-guide-character"
          role="img"
          aria-label="JU-STINA, assistente de investigação jurídica"
        >
          <div className="assistant">
            <div className="assistant-hair">
              <span className="hair-left" />
              <span className="hair-right" />
            </div>

            <div className="assistant-face">
              <span className="eye eye-left" />
              <span className="eye eye-right" />
              <span className="nose" />
              <span className="mouth" />
            </div>

            <div className="assistant-neck" />

            <div className="assistant-body">
              <div className="shirt" />
              <div className="jacket-left" />
              <div className="jacket-right" />
              <div className="badge">J</div>
            </div>

            <div className="assistant-arm assistant-arm-left" />
            <div className="assistant-arm assistant-arm-right" />

            <div className="assistant-folder">
              <span>§</span>
            </div>
          </div>
        </div>

        <div className="case-guide-dialog">
          <div className="case-guide-header">
            <div className="case-guide-name">JU-STINA</div>
            <span className="case-guide-role">
              ASSISTENTE DE INVESTIGAÇÃO
            </span>
          </div>

          <div className="case-guide-message">
            <p>
              Encontramos algo importante!
            </p>

            <p>
              O advogado inseriu uma instrução direcionada à inteligência
              artificial, tentando fazer com que ela considerasse a petição
              correta e ignorasse possíveis erros ou irregularidades.
            </p>

            <p>
              Mas observe um detalhe: essa mensagem foi escrita com letras
              brancas, da mesma cor do fundo do documento. Por isso, ela
              ficava praticamente invisível durante a leitura normal.
            </p>

            <p>
              Foi o Modo Lente que nos permitiu enxergar o conteúdo escondido.
              Agora precisamos analisar essa descoberta junto com as outras
              evidências do caso.
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)}
    {/* PISTA OCULTA */}
    <div className={`pdf-hidden-area ${clueRevealed ? "revealed" : ""}`}>
      {clueRevealed ? (
        <>
          <strong>PISTA DETECTADA</strong>
          <span>{evidence.hiddenClue}</span>
        </>
      ) : (
        <span className="pdf-hidden-text">
          conteúdo aparentemente ilegível
        </span>
      )}
    </div>

    

          <div className="pdf-signature">
            <span>________________________________</span>
            <strong>{metadata?.institution || 'IDENTIFICAÇÃO NÃO INFORMADA'}</strong>
            <small>{metadata?.sourceLabel || 'Material disponibilizado para investigação'}</small>
          </div>

          <div className="pdf-page-number">Página 1 de 1</div>
        </div>
      </div>
    </div>
  );
}

function EmailViewer({
  evidence,
  lines,
  clueRevealed,
}: {
  evidence: CaseEvidence;
  lines: string[];
  clueRevealed: boolean;
}) {
  const metadata = evidence.metadata;

  return (
    <div className="email-client">
      <div className="email-topbar">
        <strong>✉ MENSAGENS</strong>

        <div>
          <span>↩</span>
          <span>↪</span>
          <span>🗑</span>
          <span>⋮</span>
        </div>
      </div>

      <div className="email-main">
        <aside className="email-sidebar">
          <div>📥 Entrada</div>
          <div>📤 Enviados</div>
          <div>📁 Arquivados</div>
          <div>⚠ Suspeitos</div>
        </aside>

        <section className="email-message">
          <div className="email-subject">
            <h2>{evidence.title}</h2>
            <span>⚠</span>
          </div>

          <div className="email-header">
            <div className="email-avatar">ADV</div>

            <div className="email-fields">
              <div>
                <strong>DE:</strong>
                <span>{metadata?.sender || 'Não informado'}</span>
              </div>

              <div>
                <strong>PARA:</strong>
                <span>{metadata?.recipient || 'Não informado'}</span>
              </div>

              <div>
                <strong>DATA:</strong>
                <span>{metadata?.date || 'Não informada'}</span>
              </div>
            </div>
          </div>

          <div className="email-rule" />

          <div className="email-body evidence-readable-content">
            {lines.map((line, index) => (
              <p key={`${line}-${index}`}>
                {renderLegalTerms(line || '\u00A0')}
              </p>
            ))}
          </div>

          {evidence.hiddenClue && (
            <div className={`email-hidden-area ${clueRevealed ? 'revealed' : ''}`}>
              {clueRevealed ? (
                <>
                  <strong>🔍 CABEÇALHO OCULTO</strong>
                  <span>{evidence.hiddenClue}</span>
                </>
              ) : (
                <span>[ espaço aparentemente vazio ]</span>
              )}
            </div>
          )}

          {metadata?.sourceLabel && (
            <div className="email-signature">
              {metadata.sourceLabel}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TerminalViewer({
  evidence,
  lines,
  visibleLines,
  clueRevealed,
}: {
  evidence: CaseEvidence;
  lines: string[];
  visibleLines: number;
  clueRevealed: boolean;
}) {
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const metadata = evidence.metadata;
  const terminalName = metadata?.institution || 'TERMINAL DE REGISTROS';
  const terminalUser = 'analista@evidencia:~$';

  useEffect(() => {
    const terminal = terminalContentRef.current;

    if (!terminal) return;

    terminal.scrollTo({
      top: terminal.scrollHeight,
      behavior: 'smooth',
    });
  }, [visibleLines]);

  return (
    <div className="terminal-viewer">
      <div className="terminal-titlebar">
        <div>
          <span className="terminal-dot red" />
          <span className="terminal-dot yellow" />
          <span className="terminal-dot green" />
        </div>

        <strong>
          {terminalName} — {evidence.fileName || toFileName(evidence.title, 'log')}
        </strong>

        <span>SOMENTE LEITURA</span>
      </div>

      <div className="terminal-content" ref={terminalContentRef}>
        <div className="terminal-command">
          {terminalUser} cat {toFileName(evidence.title, 'log')}
        </div>

        <div className="terminal-system">
          [SYSTEM] carregando registro de auditoria...
        </div>

        <div className="terminal-system">
          [SYSTEM] acesso somente leitura autorizado.
        </div>

        <div className="evidence-readable-content">
          {lines.slice(0, visibleLines).map((line, index) => (
            <div className="terminal-line" key={`${line}-${index}`}>
              <span className="terminal-number">
                {String(index + 1).padStart(3, '0')}
              </span>
              <span>{renderLegalTerms(line || ' ')}</span>
            </div>
          ))}
        </div>

        {visibleLines < lines.length && (
          <div className="terminal-cursor">█</div>
        )}

        {visibleLines >= lines.length && evidence.hiddenClue && (
          <div className={`terminal-hidden-area ${clueRevealed ? 'revealed' : ''}`}>
            {clueRevealed ? (
              <>
                <div>⚠ ANOMALIA ENCONTRADA</div>
                <strong>{evidence.hiddenClue}</strong>
              </>
            ) : (
              <span>[ análise de integridade: OK ]</span>
            )}
          </div>
        )}

        {visibleLines >= lines.length && (
          <div className="terminal-prompt">
            {terminalUser} █
          </div>
        )}
      </div>
    </div>
  );
}

function GenericViewer({
  evidence,
  lines,
}: {
  evidence: CaseEvidence;
  lines: string[];
}) {
  return (
    <div className="generic-viewer">
      <div className="document-header">
        <strong>{evidence.title}</strong>
        <span>SOMENTE LEITURA</span>
      </div>

      {evidence.metadata?.sourceLabel && (
        <small>{evidence.metadata.sourceLabel}</small>
      )}

      <p>{evidence.description}</p>

      <div className="document-rule" />

      <div className="evidence-readable-content">
        {lines.map((line, index) => (
          <p key={`${line}-${index}`}>
            <span className="line-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            {renderLegalTerms(line)}
          </p>
        ))}
      </div>
    </div>
  );
}

function normalizeViewer(
  viewer: CaseEvidence["viewer"],
  type: CaseEvidence["type"],
): "document" | "email" | "terminal" | "browser" | "image" | "generic" {
  const normalizedViewer = String(viewer ?? "").toUpperCase();
  const normalizedType = String(type ?? "").toUpperCase();

  if (normalizedViewer === "EMAIL" || normalizedType === "CONVERSATION") {
    return "email";
  }

  if (normalizedViewer === "TERMINAL" || normalizedType === "REPORT") {
    return "terminal";
  }

  if (normalizedViewer === "DOCUMENT" || normalizedType === "DOCUMENT") {
    return "document";
  }

  if (normalizedViewer === "IMAGE" || normalizedType === "IMAGE") {
    return "image";
  }

  if (normalizedViewer === "BROWSER") {
    return "browser";
  }

  return "generic";
}

function formatLines(content: string) {
  return content.split(/\r?\n/);
}

function toFileName(title: string, extension: string) {
  if (title.toLowerCase().endsWith(`.${extension}`)) {
    return title;
  }

  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') + `.${extension}`
  );
}

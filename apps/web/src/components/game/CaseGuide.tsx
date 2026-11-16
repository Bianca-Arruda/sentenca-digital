"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { CaseEvidence } from "@/types/case";

/* =========================================
   TERMOS JURÍDICOS
   ========================================= */

const LEGAL_TERMS: Record<string, string> = {
  "habeas corpus":
    "Medida judicial destinada a proteger a liberdade de locomoção de alguém quando ela sofre ou está ameaçada por ilegalidade ou abuso de poder.",

  petição:
    "Documento formal apresentado à Justiça para fazer um pedido, apresentar argumentos ou comunicar informações relevantes a um processo.",

  jurisprudência:
    "Conjunto de decisões judiciais que ajudam a demonstrar como os tribunais interpretam e aplicam o Direito.",

  REsp:
    "Abreviação de Recurso Especial, utilizado em hipóteses previstas na Constituição para discutir questões relacionadas à interpretação de lei federal.",

  "citação jurídica":
    "Referência a uma lei, decisão judicial, doutrina ou outra fonte jurídica utilizada para fundamentar um argumento. É necessário conferir autoria, origem, contexto e fidelidade.",

  "litigância de má-fé":
    "Conduta processual desleal, como alterar intencionalmente a verdade dos fatos ou utilizar o processo de maneira abusiva. Sua caracterização depende da análise do caso concreto.",

  "inteligência artificial":
    "Tecnologia capaz de executar tarefas que normalmente exigiriam capacidades humanas, como produzir textos, reconhecer padrões e organizar informações.",

  auditoria:
    "Verificação sistemática de registros, procedimentos ou documentos para identificar inconsistências e avaliar sua confiabilidade.",
};

/* =========================================
   UTILITÁRIOS
   ========================================= */
function findLegalTerm(text: string, term: string): boolean {
  const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    `\\b${escapedTerm}\\b`,
    "i"
  );

  return regex.test(text);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderLegalTerms(text: string): ReactNode {
  const terms = Object.keys(LEGAL_TERMS).sort(
    (a, b) => b.length - a.length,
  );

  const pattern = new RegExp(
    `(?<![\\p{L}\\p{N}_])(${terms.map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}_])`,
    "giu",
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


/* =========================================
   TIPOS
   ========================================= */

type GuideState =
  | "welcome"
  | "orientation"
  | "hint"
  | "progress"
  | "completed";

type CaseGuideProps = {
  message: string;
  caseCode?: string;
  currentEvidence?: CaseEvidence | null;
  openedEvidenceCount?: number;
  totalEvidenceCount?: number;
  discoveredClueIds?: string[];
  investigationCompleted?: boolean;
};

/* =========================================
   MENSAGEM INICIAL
   ========================================= */

const CASE_001_INTRO =
"Temos um caso que precisa da sua atenção. O advogado responsável pelo caso apresentou uma petição com informações que parecem não corresponder a fatos que realmente aconteceram. Além disso, há indícios de que ele tenha incluído uma mensagem escondida no próprio documento, com o objetivo de influenciar a análise feita por sistemas de inteligência artificial. \n Sua missão é investigar essas suspeitas, verificar quais informações são verdadeiras e descobrir se houve uma tentativa de manipular a análise do documento.\n Comece abrindo uma das evidências disponíveis abaixo.";
/* =========================================
   COMPONENTE PRINCIPAL
   ========================================= */

export function CaseGuide({
  message,
  caseCode,
  currentEvidence = null,
  openedEvidenceCount = 0,
  totalEvidenceCount = 0,
  discoveredClueIds = [],
  investigationCompleted = false,
}: CaseGuideProps) {
  const [response, setResponse] = useState("");
  const [hintLevel, setHintLevel] = useState(0);

  const [guideState, setGuideState] = useState<GuideState>(
    investigationCompleted ? "completed" : "welcome",
  );

  const isCase001 = caseCode === "CASO_001";

  /* =========================================
     REINICIALIZAÇÃO CONTEXTUAL
     ========================================= */

  useEffect(() => {
    setHintLevel(0);
    setResponse("");
    setGuideState(
      investigationCompleted ? "completed" : "welcome",
    );
  }, [currentEvidence?.id, caseCode, investigationCompleted]);

  /* =========================================
     MENSAGEM ATUAL
     ========================================= */

  const initialMessage = isCase001
    ? CASE_001_INTRO
    : message;

  const displayedMessage = response || initialMessage;

  /* =========================================
     CONTROLE DE MENSAGENS
     ========================================= */

  function showMessage(
    text: string,
    state: GuideState = "orientation",
  ) {
    setResponse(text);
    setGuideState(state);
  }

  /* =========================================
     ORIENTAÇÃO SOBRE EVIDÊNCIAS
     ========================================= */

  function getEvidenceOrientation(): string {
    if (!currentEvidence) {
      return "Comece abrindo uma das evidências disponíveis. Leia o documento com atenção e observe nomes, datas, números de processos, citações e a origem das informações. Não considere uma afirmação verdadeira apenas porque ela aparece em um documento.";
    }

    const title = currentEvidence.title.toLowerCase();
    const type = currentEvidence.type;

    if (
      title.includes("habeas") ||
      title.includes("petição") ||
      title.includes("peticao") ||
      type === "DOCUMENT"
    ) {
      return "Nesta petição, observe os fundamentos do pedido de soltura. Confira especialmente o número do processo citado, a autoria dos trechos atribuídos a autoridades e a relação entre cada referência e o argumento apresentado.";
    }

    if (
      title.includes("auditoria") ||
      title.includes("relatório") ||
      title.includes("relatorio") ||
      type === "REPORT"
    ) {
      return "Neste relatório, observe quais referências foram verificadas, quais resultados foram encontrados e quais pontos ainda exigem conferência. Um resultado automatizado pode indicar uma inconsistência, mas não substitui a análise da fonte original.";
    }

    if (
      type === "CONVERSATION" ||
      title.includes("email") ||
      title.includes("mensagem") ||
      title.includes("defesa")
    ) {
      return "Neste arquivo, observe quem participou da comunicação, a sequência dos acontecimentos e o que cada pessoa afirma saber ou ter feito. Diferencie declarações dos personagens de fatos confirmados por outras evidências.";
    }

    return "Leia o conteúdo integralmente e procure informações que possam ser comparadas com as outras evidências. Observe a origem, a data, os envolvidos e qualquer dado que possa ser confirmado de forma independente.";
  }

  function examineEvidence() {
    showMessage(
      getEvidenceOrientation(),
      "orientation",
    );
  }

  /* =========================================
     SISTEMA DE DICAS PROGRESSIVAS
     ========================================= */

  function requestHint() {
    if (!currentEvidence) {
      showMessage(
        "Minha primeira orientação é abrir uma evidência. Depois de examiná-la, poderei oferecer dicas relacionadas ao documento que você está investigando.",
        "orientation",
      );

      return;
    }

    if (hintLevel >= 3) {
      showMessage(
        "Você já recebeu as três dicas desta evidência. Agora é hora de aplicar o que descobriu e comparar as informações com os demais documentos.",
        "hint",
      );

      return;
    }

    const nextLevel = hintLevel + 1;

    const title = currentEvidence.title.toLowerCase();

    let hints: string[];

    /* DICAS PARA PETIÇÕES */

    if (
      title.includes("habeas") ||
      title.includes("petição") ||
      title.includes("peticao") ||
      currentEvidence.type === "DOCUMENT"
    ) {
      hints = [
        "Comece pelas referências jurídicas. Há nomes, números de processos e trechos atribuídos a autoridades. Algum desses elementos merece conferência?",

        "Tente verificar separadamente a existência do REsp 842.119 e a correspondência da citação atribuída à ministra Laurita Vaz.",

        "Não basta localizar um processo com aquele número. Compare também o assunto, o conteúdo da decisão e o trecho efetivamente atribuído à ministra.",
      ];
    }

    /* DICAS PARA RELATÓRIOS */

    else if (
      title.includes("auditoria") ||
      title.includes("relatório") ||
      title.includes("relatorio") ||
      currentEvidence.type === "REPORT"
    ) {
      hints = [
        "Observe os resultados apresentados e identifique quais referências foram consideradas inconsistentes.",

        "Compare os resultados da auditoria com as referências utilizadas na petição. Elas apontam para os mesmos elementos?",

        "Verifique a origem e os limites do relatório. Ele pode orientar a investigação, mas suas conclusões precisam ser confrontadas com fontes confiáveis.",
      ];
    }

    /* DICAS PARA OUTRAS EVIDÊNCIAS */

    else {
      hints = [
        "Observe a cronologia e identifique quem participou dos acontecimentos.",

        "Procure declarações sobre a elaboração da petição, o uso de ferramentas automatizadas e a conferência das referências.",

        "Compare as declarações com os demais documentos. Uma afirmação isolada não comprova, por si só, que determinado fato aconteceu.",
      ];
    }

    setHintLevel(nextLevel);

    showMessage(
      `DICA ${nextLevel}/3\n\n${hints[nextLevel - 1]}`,
      "hint",
    );
  }

  /* =========================================
     RESUMO DA INVESTIGAÇÃO
     ========================================= */

  function showSummary() {
    if (investigationCompleted) {
      showMessage(
        "Você concluiu a etapa de investigação. Antes de decidir, separe o que está documentado, o que foi apontado como suspeito e o que ainda depende de confirmação. Avalie também se as evidências permitem distinguir erro, negligência e intenção.",
        "completed",
      );

      return;
    }

    const openedText =
      totalEvidenceCount > 0
        ? `Você abriu ${openedEvidenceCount} de ${totalEvidenceCount} evidências.`
        : "Ainda não tenho informações suficientes sobre o progresso da sua investigação.";

    const clueText = discoveredClueIds.length
      ? ` Você registrou ${discoveredClueIds.length} descoberta(s).`
      : " Ainda não há descobertas registradas pelo sistema.";

    const remainingText =
      totalEvidenceCount > 0
        ? ` Ainda faltam ${Math.max(
            0,
            totalEvidenceCount - openedEvidenceCount,
          )} evidência(s) para examinar.`
        : "";

    showMessage(
      `${openedText}${clueText}${remainingText} Continue examinando os documentos e comparando as informações. Não se apresse para concluir antes de avaliar o conjunto das evidências.`,
      "progress",
    );
  }

  /* =========================================
     RENDERIZAÇÃO
     ========================================= */

  return (
    <section
      className="case-guide"
      data-state={guideState}
      aria-label="Assistente JU-STINA"
    >
      {/* PERSONAGEM */}

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

            <div className="assistant-badge">
              J
            </div>
          </div>

          <div className="assistant-arm assistant-arm-left" />
          <div className="assistant-arm assistant-arm-right" />

          <div className="assistant-folder">
            <span>§</span>
          </div>
        </div>
      </div>

      {/* DIÁLOGO */}

      <div className="case-guide-dialog">

        <div className="case-guide-header">
          <div className="case-guide-name">
            JU-STINA
          </div>

          <span className="case-guide-role">
            ASSISTENTE DE INVESTIGAÇÃO
          </span>
        </div>

        <div
          className="case-guide-message"
          aria-live="polite"
          aria-atomic="true"
          key={`${guideState}-${displayedMessage}`}
        >
          {renderLegalTerms(displayedMessage)}
        </div>

      </div>
    </section>
  );
}
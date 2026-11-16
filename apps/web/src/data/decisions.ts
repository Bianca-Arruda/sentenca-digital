
import type { CaseDecisionContent } from "@/types/decision";

export const caseDecisions: CaseDecisionContent[] = [
  {
    caseId: "leis-e-jurisprudencia-inventadas",
    challenge:
      "Como responsabilizar o uso descuidado da inteligência artificial na Justiça?",

    decisions: [
      {
        id: "responsabilizar-com-rigor",
        title: "Responsabilizar com rigor",
        description:
          "Determinar a correção das informações falsas, aplicar as medidas cabíveis e encaminhar o caso aos órgãos responsáveis.",
        consequence:
          "A decisão reforça a responsabilidade de quem utiliza IA, mas pode gerar receio de usar essas ferramentas, mesmo corretamente.",
        scoreChanges: {
          societyProtection: 12,
          innovationFreedom: -8,
          justiceTrust: 10,
        },
        newsHeadline:
          "Justiça reforça fiscalização sobre o uso de inteligência artificial em processos.",
      },
      {
        id: "corrigir-e-investigar",
        title: "Corrigir e investigar",
        description:
          "Exigir a correção das referências falsas e investigar a responsabilidade do profissional com base nas provas.",
        consequence:
          "O problema é corrigido e a responsabilidade é analisada com cuidado, mas a investigação pode levar mais tempo.",
        scoreChanges: {
          societyProtection: 8,
          innovationFreedom: 4,
          justiceTrust: 8,
        },
        newsHeadline:
          "Tribunais discutem novas regras para conferir informações produzidas por inteligência artificial.",
      },
      {
        id: "permitir-correcao",
        title: "Permitir a correção sem punição imediata",
        description:
          "Permitir a substituição das referências falsas sem aplicar punição naquele momento, caso não existam provas suficientes de intenção de enganar.",
        consequence:
          "Evita uma punição precipitada, mas pode transmitir a ideia de que erros graves podem ser resolvidos apenas com uma correção.",
        scoreChanges: {
          societyProtection: -6,
          innovationFreedom: 10,
          justiceTrust: -5,
        },
        newsHeadline:
          "Decisão divide opiniões sobre os limites do uso de IA no trabalho jurídico.",
      },
    ],

    realOutcome: {
      title: "O que aconteceu na vida real?",
      summary:
        "Em 2025, a Justiça Federal do Paraná informou que um advogado apresentou manifestações com referências legais e decisões judiciais inexistentes, em peças produzidas com uso de inteligência artificial. Foram aplicadas duas multas de dez salários mínimos cada, e a OAB do Paraná foi comunicada.",
      lesson:
        "A inteligência artificial pode ajudar no trabalho jurídico, mas quem utiliza a ferramenta precisa conferir se as informações são verdadeiras.",
      sourceLabel: "Justiça Federal da 4ª Região (TRF4)",
      sourceUrl:
        "https://www.trf4.jus.br/trf4/controlador.php?acao=noticia_visualizar&id_noticia=29304",
    },
  },

  {
    caseId: "cameras-que-analisavam-passageiros",
    challenge:
      "Até onde uma empresa pode ir para conhecer o comportamento das pessoas?",

    decisions: [
      {
        id: "proibir-a-coleta",
        title: "Proibir a coleta",
        description:
          "Interromper a análise das imagens dos passageiros e impedir o uso comercial desses dados sem autorização adequada.",
        consequence:
          "A privacidade dos passageiros recebe maior proteção, mas o uso dessa tecnologia para publicidade fica limitado.",
        scoreChanges: {
          societyProtection: 12,
          innovationFreedom: -8,
          justiceTrust: 10,
        },
        newsHeadline:
          "Justiça determina limites para tecnologias que analisam passageiros no transporte público.",
      },
      {
        id: "permitir-com-regras",
        title: "Permitir somente com regras claras",
        description:
          "Interromper a coleta irregular e permitir o uso da tecnologia apenas se a empresa demonstrar que cumpre as exigências legais e protege os dados.",
        consequence:
          "Busca conciliar tecnologia e privacidade, mas exige fiscalização e provas de que as regras estão sendo cumpridas.",
        scoreChanges: {
          societyProtection: 8,
          innovationFreedom: 5,
          justiceTrust: 8,
        },
        newsHeadline:
          "Empresas terão de demonstrar como protegem dados coletados por sistemas inteligentes.",
      },
      {
        id: "manter-com-avisos",
        title: "Manter o sistema com avisos mais visíveis",
        description:
          "Permitir a continuidade do sistema, exigindo avisos mais claros sobre a análise das imagens.",
        consequence:
          "Facilita a continuidade da tecnologia, mas avisos não resolvem, sozinhos, os problemas relacionados à coleta e ao uso dos dados.",
        scoreChanges: {
          societyProtection: -7,
          innovationFreedom: 10,
          justiceTrust: -5,
        },
        newsHeadline:
          "Uso de câmeras inteligentes gera debate sobre privacidade nos espaços públicos.",
      },
    ],

    realOutcome: {
      title: "O que aconteceu na vida real?",
      summary:
        "No caso dos painéis publicitários da ViaQuatro, no metrô de São Paulo, o Tribunal de Justiça de São Paulo manteve a proibição da captura e do uso das imagens sem autorização adequada e aumentou a indenização por dano moral coletivo para R$ 500 mil.",
      lesson:
        "Estar em um espaço público não significa abrir mão do direito à privacidade e à proteção da própria imagem.",
      sourceLabel: "Tribunal de Justiça de São Paulo (TJSP)",
      sourceUrl:
        "https://www.tjsp.jus.br/Noticias/Noticia?codigoNoticia=91605",
    },
  },

  {
    caseId: "o-golpe-que-parece-verdadeiro",
    challenge:
      "Quem deve responder quando um vídeo falso engana milhares de pessoas?",

    decisions: [
      {
        id: "remover-e-investigar",
        title: "Remover e investigar",
        description:
          "Determinar a retirada do anúncio, impedir sua republicação e investigar quem criou, publicou e pagou pela divulgação.",
        consequence:
          "Reduz rapidamente o risco de novas vítimas, mas exige cuidado para não remover conteúdos legítimos sem análise.",
        scoreChanges: {
          societyProtection: 12,
          innovationFreedom: -6,
          justiceTrust: 10,
        },
        newsHeadline:
          "Plataformas digitais são pressionadas a combater anúncios com vídeos manipulados.",
      },
      {
        id: "remover-durante-a-investigacao",
        title: "Remover enquanto o caso é investigado",
        description:
          "Determinar a retirada temporária do anúncio e investigar a participação de cada envolvido com base nas provas.",
        consequence:
          "Protege as pessoas durante a investigação, mas identificar os responsáveis pode levar tempo.",
        scoreChanges: {
          societyProtection: 9,
          innovationFreedom: 4,
          justiceTrust: 8,
        },
        newsHeadline:
          "Justiça busca equilibrar proteção dos usuários e responsabilidade das plataformas.",
      },
      {
        id: "aguardar-comprovacao",
        title: "Aguardar a fraude ser comprovada",
        description:
          "Manter o anúncio disponível até que a vítima apresente provas suficientes de que o vídeo é falso e houve fraude.",
        consequence:
          "Evita retirar conteúdos antes de uma análise mais completa, mas permite que o anúncio continue alcançando pessoas.",
        scoreChanges: {
          societyProtection: -8,
          innovationFreedom: 9,
          justiceTrust: -6,
        },
        newsHeadline:
          "Demora na retirada de anúncios suspeitos aumenta preocupação de usuários.",
      },
    ],

    realOutcome: {
      title: "O que aconteceu na vida real?",
      summary:
        "Um caso julgado no Distrito Federal envolveu uma médica cuja imagem e voz foram manipuladas para parecer que ela recomendava um suplemento. A Justiça determinou a retirada do vídeo. A responsabilidade de cada empresa envolvida, porém, precisava ser analisada separadamente.",
      lesson:
        "Um vídeo falso pode causar danos reais. Para responsabilizar alguém, é necessário investigar o que cada pessoa ou empresa fez e quais provas existem.",
      sourceLabel: "Tribunal de Justiça do Distrito Federal e dos Territórios (TJDFT)",
    },
  },
];

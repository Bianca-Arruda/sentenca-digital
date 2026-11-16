
"use client";

import { useState } from "react";
import "./MetroCameraEvidence.css";

type Passenger = {
  id: string;
  code: string;
  age: string;
  attention: string;
  gender: string;
  reaction: string;
  duration: string;
  confidence: string;
  position: string;
  description: string;
};

const passengers: Passenger[] = [
  {
    id: "A",
    code: "PASSAGEIRO A",
    age: "18–25 anos",
    attention: "Alta",
    gender: "Não confirmado",
    reaction: "Neutra",
    duration: "00:08 segundos",
    confidence: "87%",
    position: "passenger-a",
    description:
      "O sistema classificou a atenção ao anúncio como alta, possivelmente devido à orientação corporal e ao tempo de permanência diante do painel.",
  },
  {
    id: "B",
    code: "PASSAGEIRO B",
    age: "35–45 anos",
    attention: "Baixa",
    gender: "Não confirmado",
    reaction: "Indeterminada",
    duration: "00:02 segundos",
    confidence: "64%",
    position: "passenger-b",
    description:
      "O sistema classificou a atenção como baixa. Entretanto, a pessoa pode ter observado o anúncio sem direcionar o rosto diretamente para a tela.",
  },
  {
    id: "C",
    code: "PASSAGEIRO C",
    age: "25–35 anos",
    attention: "Moderada",
    gender: "Não confirmado",
    reaction: "Surpresa",
    duration: "00:05 segundos",
    confidence: "72%",
    position: "passenger-c",
    description:
      "O sistema classificou uma possível reação de surpresa. A expressão visual, entretanto, não permite determinar com segurança o estado emocional de uma pessoa.",
  },
];

const analysisFields = [
  {
    label: "Faixa etária estimada",
    key: "age" as const,
    icon: "calendar",
  },
  {
    label: "Atenção ao anúncio",
    key: "attention" as const,
    icon: "eye",
  },
  {
    label: "Gênero aparente",
    key: "gender" as const,
    icon: "user",
  },
  {
    label: "Reação classificada",
    key: "reaction" as const,
    icon: "activity",
  },
  {
    label: "Tempo de atenção",
    key: "duration" as const,
    icon: "clock",
  },
  {
    label: "Confiança da classificação",
    key: "confidence" as const,
    icon: "chart",
  },
];

export function MetroCameraEvidence() {
  const [selected, setSelected] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"original" | "analysis">(
    "original"
  );

  const activePassenger =
    passengers.find((passenger) => passenger.id === selected) ?? null;

  function selectPassenger(id: string) {
    setSelected((current) => (current === id ? null : id));
  }

  return (
    <main className="metro-evidence">
      <header className="metro-header">
        <div className="metro-header__identity">
          <div className="metro-header__icon">
            <span>04</span>
          </div>

          <div>
            <span className="metro-eyebrow">
              ARQUIVO DIGITAL / EVIDÊNCIA 04
            </span>
            <h2>O olhar da câmera</h2>
            <p>Auditoria de vigilância e análise automatizada</p>
          </div>
        </div>

        <div className="metro-header__status">
          <span className="metro-status-dot" />
          RECONSTRUÇÃO SIMULADA
        </div>
      </header>

      <section className="metro-workspace">
        <div className="metro-main-column">
          <div className="metro-viewer">
            <div className="metro-viewer__topbar">
              <div className="metro-viewer__camera">
                <span className="metro-rec-dot" />
                <span>CAM-04</span>
                <span className="metro-viewer__separator">/</span>
                <span>PLATAFORMA</span>
              </div>

              <div className="metro-viewer__time">
                REC <strong>14:32:08</strong>
              </div>
            </div>


<div className="metro-scene__photo" aria-hidden="true" />
<div className="metro-scene__shade" aria-hidden="true" />

<svg
  className="metro-scene__illustration"
  viewBox="0 0 1200 650"
  preserveAspectRatio="xMidYMid slice"
  role="img"
  aria-label="Estação de metrô monitorada por uma câmera. Uma pessoa está em pé olhando um anúncio, outra está sentada no banco e uma terceira observa o anúncio com expressão de surpresa."
>
  <defs>
    <linearGradient id="metro-screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#183d53" />
      <stop offset="100%" stopColor="#071724" />
    </linearGradient>
    <linearGradient id="metro-shirt-a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#497f9a" />
      <stop offset="100%" stopColor="#24465d" />
    </linearGradient>
    <linearGradient id="metro-shirt-b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#a47c55" />
      <stop offset="100%" stopColor="#654a38" />
    </linearGradient>
    <linearGradient id="metro-shirt-c" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#698a76" />
      <stop offset="100%" stopColor="#3c5948" />
    </linearGradient>
    <filter id="metro-shadow">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </defs>

  {/* Luz e profundidade sobre a fotografia */}
  <path d="M0 500 L1200 500 L1200 650 L0 650Z" fill="#101b25" opacity=".23" />
  <ellipse cx="350" cy="565" rx="85" ry="17" fill="#050b11" opacity=".48" filter="url(#metro-shadow)" />
  <ellipse cx="600" cy="565" rx="100" ry="17" fill="#050b11" opacity=".48" filter="url(#metro-shadow)" />
  <ellipse cx="900" cy="565" rx="85" ry="17" fill="#050b11" opacity=".48" filter="url(#metro-shadow)" />

  {/* Painel publicitário */}
  <g>
    <rect x="65" y="190" width="190" height="215" rx="8" fill="#111d28" stroke="#d0d8dc" strokeWidth="7" />
    <rect x="75" y="200" width="170" height="195" rx="3" fill="url(#metro-screen)" />
    <rect x="88" y="215" width="144" height="7" rx="3" fill="#e8c75d" />
    <text x="160" y="250" textAnchor="middle" fill="#f4f6f4" fontSize="17" fontWeight="700">SUA CIDADE</text>
    <text x="160" y="273" textAnchor="middle" fill="#f4f6f4" fontSize="17" fontWeight="700">EM MOVIMENTO</text>
    <path d="M105 320 L145 285 L175 315 L210 280" fill="none" stroke="#5bd7d0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="160" cy="350" r="17" fill="#e9c45c" />
    <text x="160" y="356" textAnchor="middle" fill="#182b38" fontSize="16" fontWeight="800">M</text>
    <text x="160" y="382" textAnchor="middle" fill="#b8cbd4" fontSize="9" letterSpacing="2">INFORMAÇÃO • CULTURA</text>
    <rect x="151" y="405" width="18" height="35" fill="#263b49" />
  </g>

  {/* Câmera de vigilância no teto */}
  <g transform="translate(1010 80)">
    <path d="M25 0 V25" stroke="#18232c" strokeWidth="9" strokeLinecap="round" />
    <path d="M25 20 L10 33" stroke="#18232c" strokeWidth="8" strokeLinecap="round" />
    <rect x="0" y="28" width="100" height="43" rx="10" fill="#d4dce0" stroke="#637782" strokeWidth="4" />
    <path d="M10 34 H83" stroke="#f5f7f7" strokeWidth="5" opacity=".7" />
    <rect x="4" y="42" width="18" height="15" rx="4" fill="#293b47" />
    <circle cx="13" cy="49" r="5" fill="#64c8d4" />
    <path d="M100 38 L118 46 L118 65 L100 67Z" fill="#8d9da4" stroke="#52646e" strokeWidth="3" />
    <circle cx="113" cy="56" r="8" fill="#10212d" stroke="#9eb1ba" strokeWidth="3" />
    <circle cx="113" cy="56" r="3" fill="#55d9e8" />
    <circle cx="31" cy="50" r="4" fill="#e14f58" />
    <text x="48" y="88" fill="#e8eef7" fontSize="11" fontWeight="700" letterSpacing="2">CAM 04</text>
  </g>

  {/* Banco da plataforma: atrás do passageiro B */}
  <g>
    <path d="M505 430 H700 V449 H505Z" fill="#aeb8bc" stroke="#52616a" strokeWidth="4" />
    <path d="M515 449 V535 M690 449 V535" stroke="#52616a" strokeWidth="12" strokeLinecap="round" />
    <path d="M500 535 H705" stroke="#344650" strokeWidth="12" strokeLinecap="round" />
    <path d="M510 430 V390 H695 V430" fill="none" stroke="#8f9da2" strokeWidth="12" strokeLinecap="round" />
    <path d="M520 410 H685" stroke="#d7dfe0" strokeWidth="3" opacity=".55" />
  </g>

  {/* PASSAGEIRO A — em pé, olhando para o anúncio */}
  <g transform="translate(350 0)">
    {/* Pernas */}
    <path d="M-30 440 L-35 555 Q-35 568 -22 568 H-7 L7 455Z" fill="#263746" />
    <path d="M8 450 L15 558 Q15 568 28 568 H43 L42 440Z" fill="#344657" />
    <path d="M-35 563 H-5 Q0 563 0 574 H-43 Q-47 570 -35 563Z" fill="#111c27" />
    <path d="M17 563 H45 Q53 563 52 574 H12 Q9 568 17 563Z" fill="#111c27" />

    {/* Tronco e roupa */}
    <path d="M-48 285 Q-43 265 -22 260 H23 Q47 266 51 290 L62 425 Q60 442 42 444 H-42 Q-59 441 -58 425Z" fill="url(#metro-shirt-a)" stroke="#1d3a4c" strokeWidth="3" />
    <path d="M-21 265 L0 294 L22 265" fill="none" stroke="#8db4c5" strokeWidth="4" opacity=".6" />
    <path d="M-45 300 L-67 385 Q-70 399 -58 404 Q-47 406 -42 390 L-22 333" fill="#bd896d" stroke="#805a48" strokeWidth="3" />
    <path d="M43 300 L59 370 Q64 386 52 391 Q40 393 36 378 L22 330" fill="#bd896d" stroke="#805a48" strokeWidth="3" />

    {/* Pescoço */}
    <rect x="-13" y="240" width="27" height="35" rx="10" fill="#bd896d" />

    {/* Rosto voltado para o anúncio */}
    <g transform="rotate(-8 -2 220)">
      <ellipse cx="0" cy="215" rx="35" ry="45" fill="#c99475" />
      <path d="M-35 211 Q-42 166 -5 162 Q32 158 37 196 L30 207 Q22 185 4 184 Q-13 195 -35 190Z" fill="#29232a" />
      <path d="M-33 193 Q-25 164 0 166 Q28 163 36 193 L31 207 Q18 191 4 190 Q-16 200 -33 199Z" fill="#332a2b" />
      <path d="M-31 210 Q-44 218 -37 231" fill="none" stroke="#a8755c" strokeWidth="5" />
      <ellipse cx="-13" cy="214" rx="4" ry="3" fill="#f4eee5" />
      <ellipse cx="12" cy="214" rx="4" ry="3" fill="#f4eee5" />
      <circle cx="-12" cy="214" r="2" fill="#25252a" />
      <circle cx="13" cy="214" r="2" fill="#25252a" />
      <path d="M0 216 L-5 230 L2 232" fill="none" stroke="#996b56" strokeWidth="2" />
      <path d="M-9 243 Q0 247 10 242" fill="none" stroke="#75483e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M-26 205 Q-14 199 -5 204 M7 204 Q18 198 27 204" fill="none" stroke="#392b29" strokeWidth="3" />
    </g>
  </g>

  {/* PASSAGEIRO B — sentado no banco, olhando para outro lado */}
  <g transform="translate(600 0)">
    {/* Pernas dobradas */}
    <path d="M-35 425 Q-55 465 -70 495 L-24 520 Q5 493 15 460Z" fill="#303d49" />
    <path d="M15 430 Q43 460 64 482 L35 515 Q2 496 -14 464Z" fill="#3b4855" />
    <path d="M-73 493 Q-88 512 -71 522 L-22 529 Q-13 523 -25 515Z" fill="#17232d" />
    <path d="M31 510 Q42 526 60 520 L82 502 Q85 491 72 490 L42 497Z" fill="#17232d" />

    {/* Tronco sentado */}
    <path d="M-49 315 Q-38 290 -15 288 H22 Q48 294 52 322 L48 435 Q44 451 26 452 H-35 Q-52 449 -53 432Z" fill="url(#metro-shirt-b)" stroke="#594333" strokeWidth="3" />
    <path d="M-28 296 Q0 320 27 296" fill="none" stroke="#d2ad83" strokeWidth="4" opacity=".45" />

    {/* Braços apoiados no colo */}
    <path d="M-45 325 L-67 390 Q-75 409 -57 416 L-12 443 Q2 448 8 435 Q12 424 -2 416 L-37 390" fill="#b78262" stroke="#805c46" strokeWidth="3" />
    <path d="M42 325 L63 390 Q69 406 55 415 L20 439 Q6 447 -2 434 Q-7 423 8 414 L37 389" fill="#b78262" stroke="#805c46" strokeWidth="3" />

    {/* Pescoço */}
    <rect x="-13" y="260" width="27" height="35" rx="10" fill="#a9795c" />

    {/* Rosto */}
    <ellipse cx="0" cy="235" rx="35" ry="43" fill="#a9795c" />
    <path d="M-35 231 Q-43 187 -8 181 Q26 174 37 211 L32 225 Q15 204 0 204 Q-17 216 -35 210Z" fill="#514139" />
    <path d="M-32 196 Q-17 174 8 181 Q31 184 36 211 L27 201 Q9 194 -7 203 L-31 213Z" fill="#514139" />
    <ellipse cx="-13" cy="235" rx="4" ry="3" fill="#f4eee5" />
    <ellipse cx="12" cy="235" rx="4" ry="3" fill="#f4eee5" />
    <circle cx="-12" cy="235" r="2" fill="#28262a" />
    <circle cx="13" cy="235" r="2" fill="#28262a" />
    <path d="M0 238 L-4 250 L3 252" fill="none" stroke="#805b48" strokeWidth="2" />
    <path d="M-9 264 Q0 266 9 262" fill="none" stroke="#704438" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M-26 226 Q-15 220 -5 225 M7 225 Q18 219 27 225" fill="none" stroke="#46352e" strokeWidth="3" />
  </g>

  {/* PASSAGEIRO C — em pé, expressão de surpresa, olhando o anúncio */}
  <g transform="translate(900 0)">
    {/* Pernas */}
    <path d="M-29 440 L-34 555 Q-34 568 -21 568 H-7 L7 450Z" fill="#273d37" />
    <path d="M8 450 L16 557 Q16 568 29 568 H43 L42 440Z" fill="#354d42" />
    <path d="M-35 563 H-6 Q0 563 0 574 H-43 Q-47 570 -35 563Z" fill="#111c27" />
    <path d="M17 563 H45 Q53 563 52 574 H12 Q9 568 17 563Z" fill="#111c27" />

    {/* Tronco */}
    <path d="M-47 285 Q-40 264 -20 260 H22 Q47 266 52 290 L60 425 Q59 442 41 444 H-42 Q-59 441 -58 425Z" fill="url(#metro-shirt-c)" stroke="#344f40" strokeWidth="3" />
    <path d="M-43 300 L-59 377 Q-64 393 -50 400 Q-38 403 -34 388 L-20 334" fill="#d1a080" stroke="#9a7259" strokeWidth="3" />
    <path d="M44 300 L62 375 Q66 391 52 398 Q40 400 36 385 L21 333" fill="#d1a080" stroke="#9a7259" strokeWidth="3" />

    {/* Pescoço */}
    <rect x="-13" y="240" width="27" height="35" rx="10" fill="#d1a080" />

    {/* Rosto e cabelo */}
    <g transform="rotate(-9 -2 215)">
      <ellipse cx="0" cy="215" rx="35" ry="45" fill="#d1a080" />
      <path d="M-36 211 Q-42 171 -7 162 Q25 158 37 190 L33 211 Q20 187 2 187 Q-15 199 -35 195Z" fill="#4b352d" />
      <path d="M-32 180 Q-14 151 16 164 Q37 172 36 199 L25 188 Q6 177 -8 190 L-33 199Z" fill="#4b352d" />
      <path d="M-29 205 Q-13 198 -4 205 M7 205 Q19 197 29 204" fill="none" stroke="#523a30" strokeWidth="3" />
      <ellipse cx="-13" cy="215" rx="5" ry="6" fill="#f8f1e9" />
      <ellipse cx="13" cy="215" rx="5" ry="6" fill="#f8f1e9" />
      <circle cx="-12" cy="215" r="2.5" fill="#28252a" />
      <circle cx="13" cy="215" r="2.5" fill="#28252a" />
      <path d="M0 218 L-5 232 L2 234" fill="none" stroke="#a57960" strokeWidth="2" />
      <ellipse cx="0" cy="246" rx="7" ry="9" fill="#70463e" />
      <ellipse cx="0" cy="246" rx="4" ry="6" fill="#34272a" />
    </g>
  </g>
</svg>

<button
  type="button"
  className={`metro-detection metro-detection--a ${selected === "A" ? "is-selected" : ""}`}
  onClick={() => selectPassenger("A")}
  aria-label="Investigar passageiro A"
>
  01
</button>

<button
  type="button"
  className={`metro-detection metro-detection--b ${selected === "B" ? "is-selected" : ""}`}
  onClick={() => selectPassenger("B")}
  aria-label="Investigar passageiro B"
>
  02
</button>

<button
  type="button"
  className={`metro-detection metro-detection--c ${selected === "C" ? "is-selected" : ""}`}
  onClick={() => selectPassenger("C")}
  aria-label="Investigar passageiro C"
>
  03
</button>

<div className="metro-scene__scanline" aria-hidden="true" />
<div className="metro-scene__camera-label">
  <span>CAM 04</span>
  <span>PLATAFORMA</span>
  <span>14:32:08</span>
</div>

  <div className="metro-platform" />
  <div className="metro-scene__floor" />
  <div className="metro-scene__scanline" />

  <div className="metro-scene__camera-label">
    <span>VISÃO COMPUTACIONAL</span>
    <span>SIMULAÇÃO 2D</span>
  </div>
</div>


            <div className="metro-viewer__footer">
              <span>
                {viewMode === "original"
                  ? "REGISTRO VISUAL ORIGINAL"
                  : "CAMADA DE ANÁLISE AUTOMATIZADA"}
              </span>
              <span>03 OBJETOS IDENTIFICADOS</span>
            </div>
          </div>

          <div className="metro-toolbar">
            <div className="metro-toolbar__heading">
              <span>VISUALIZAÇÃO DA EVIDÊNCIA</span>
              <small>Alterne entre as camadas de análise</small>
            </div>

            <div className="metro-view-switch">
              <button
                type="button"
                className={viewMode === "original" ? "is-active" : ""}
                onClick={() => setViewMode("original")}
              >
                <span className="metro-switch-icon">◉</span>
                Original
              </button>

              <button
                type="button"
                className={viewMode === "analysis" ? "is-active" : ""}
                onClick={() => setViewMode("analysis")}
              >
                <span className="metro-switch-icon">⌗</span>
                Análise da IA
              </button>
            </div>
          </div>

          <div className="metro-passenger-list">
            <div className="metro-section-heading">
              <span>REGISTROS DETECTADOS</span>
              <small>SELECIONE PARA INVESTIGAR</small>
            </div>

            <div className="metro-passenger-cards">
              {passengers.map((passenger) => (
                <button
                  key={passenger.id}
                  type="button"
                  className={`metro-passenger-card ${
                    selected === passenger.id ? "is-selected" : ""
                  }`}
                  onClick={() => selectPassenger(passenger.id)}
                >
                  <span className="metro-passenger-card__code">
                    {passenger.id}
                  </span>

                  <span className="metro-passenger-card__info">
                    <strong>{passenger.code}</strong>
                    <small>Registro individual</small>
                  </span>

                  <span className="metro-passenger-card__arrow">
                    {selected === passenger.id ? "−" : "+"}
                  </span>
                </button>
              ))}
            </div>
          </div>

        <aside className="metro-analysis-panel" aria-live="polite">
          {!activePassenger ? (
            <div className="metro-empty-state">
              <div className="metro-empty-icon">
                <span>⌕</span>
              </div>

              <span className="metro-eyebrow">
                CENTRAL DE INVESTIGAÇÃO
              </span>

              <h3>Nenhum registro selecionado</h3>

              <p>
                Selecione um dos três passageiros na imagem ou nos registros
                abaixo para consultar os dados hipoteticamente extraídos pelo
                sistema.
              </p>

              <div className="metro-empty-instruction">
                <span>01</span>
                <div>
                  <strong>Identifique um passageiro</strong>
                  <small>Selecione A, B ou C na reconstrução.</small>
                </div>
              </div>

              <div className="metro-empty-instruction">
                <span>02</span>
                <div>
                  <strong>Consulte as inferências</strong>
                  <small>Examine as classificações automatizadas.</small>
                </div>
              </div>

              <div className="metro-empty-instruction">
                <span>03</span>
                <div>
                  <strong>Questione os resultados</strong>
                  <small>Observe o que o sistema não pode comprovar.</small>
                </div>
              </div>
            </div>
          ) : (
            <div className="metro-passenger-analysis">
              <div className="metro-panel-top">
                <span>REGISTRO INDIVIDUAL</span>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Fechar análise"
                >
                  ×
                </button>
              </div>

              <div className="metro-analysis-identity">
                <div className="metro-analysis-avatar">
                  {activePassenger.id}
                </div>

                <div>
                  <span className="metro-eyebrow">
                    IDENTIFICADOR / 00{activePassenger.id === "A" ? "1" : activePassenger.id === "B" ? "2" : "3"}
                  </span>
                  <h3>{activePassenger.code}</h3>
                  <small>Identidade não identificada</small>
                </div>
              </div>

              <div className="metro-ai-status">
                <span className="metro-status-dot" />
                CLASSIFICAÇÃO AUTOMATIZADA
              </div>

              <div className="metro-fields-heading">
                <strong>Dados extraídos pelo sistema</strong>
                <small>RESULTADOS FICTÍCIOS</small>
              </div>

              <div className="metro-data-grid">
                {analysisFields.map((field) => (
                  <div className="metro-data-card" key={field.key}>
                    <span className="metro-data-card__icon">
                      {field.icon === "calendar" && "▦"}
                      {field.icon === "eye" && "◎"}
                      {field.icon === "user" && "♙"}
                      {field.icon === "activity" && "⌁"}
                      {field.icon === "clock" && "◷"}
                      {field.icon === "chart" && "▥"}
                    </span>

                    <span className="metro-data-card__label">
                      {field.label}
                    </span>

                    <strong>{activePassenger[field.key]}</strong>
                  </div>
                ))}
              </div>

              <div className="metro-confidence">
                <div>
                  <span>CONFIANÇA INFORMADA PELO MODELO</span>
                  <strong>{activePassenger.confidence}</strong>
                </div>

                <div className="metro-confidence__track">
                  <span
                    style={{ width: activePassenger.confidence }}
                  />
                </div>

                <small>
                  Indicador ilustrativo de confiança, não representa
                  precisão comprovada.
                </small>
              </div>

              <div className="metro-observation">
                <div className="metro-observation__title">
                  <span>!</span>
                  OBSERVAÇÃO INVESTIGATIVA
                </div>

                <p>{activePassenger.description}</p>
              </div>

              <div className="metro-uncertainty">
                <strong>ATENÇÃO: INFERÊNCIA NÃO É FATO</strong>
                <p>
                  As classificações são estimativas produzidas em uma
                  simulação. Não comprovam características pessoais,
                  sentimentos ou intenções do passageiro.
                </p>
              </div>

              <button
                type="button"
                className="metro-next-passenger"
                onClick={() => {
                  const currentIndex = passengers.findIndex(
                    (passenger) => passenger.id === activePassenger.id
                  );

                  const nextIndex = (currentIndex + 1) % passengers.length;

                  setSelected(passengers[nextIndex].id);
                }}
              >
                INVESTIGAR PRÓXIMO PASSAGEIRO
                <span>→</span>
              </button>
            </div>
          )}
        </aside>
      </section>

      <section className="metro-investigation-note">
        <div className="metro-investigation-note__icon">i</div>

        <div>
          <strong>O que esta evidência revela?</strong>
          <p>
            A câmera pode registrar a circulação de pessoas, mas o sistema
            também pode tentar interpretar características, comportamentos
            e reações. A investigação deve apurar quais dados são realmente
            coletados, como são utilizados e se os passageiros foram
            informados sobre esse tratamento.
          </p>
        </div>
      </section>

      <footer className="metro-disclaimer">
        <span>ARQUIVO 04 / O OLHAR DA CÂMERA</span>

        <p>
          Reconstrução visual didática. Passageiros, registros e
          classificações são inteiramente fictícios. Os indicadores
          apresentados não representam medições reais nem comprovam a
          existência de um sistema de vigilância específico.
        </p>
      </footer>
    </main>
  );
}

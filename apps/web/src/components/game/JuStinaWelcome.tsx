
"use client";

import { useEffect, useState } from "react";

interface JuStinaWelcomeProps {
  userId: string;
  onContinueCases: () => void;
}

export function JuStinaWelcome({
  userId,
  onContinueCases,
}: JuStinaWelcomeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const storageKey = `sentenca-digital-justina-intro-${userId}`;
    const alreadySeen = localStorage.getItem(storageKey);

    if (!alreadySeen) {
      setVisible(true);
    }
  }, [userId]);

  function closeWelcome() {
    const storageKey = `sentenca-digital-justina-intro-${userId}`;

    localStorage.setItem(storageKey, "true");
    setVisible(false);
  }

  function handleContinue() {
    closeWelcome();
    onContinueCases();
  }

  if (!visible) return null;

  return (
  <aside
    className="justina-welcome"
    role="dialog"
    aria-label="Apresentação da Ju-Stina"
  >
    <div className="justina-welcome__content">
      <div className="justina-welcome__header">
        <span>JU-STINA — ASSISTENTE DO JUIZ</span>
        <button
          type="button"
          className="justina-welcome__close"
          onClick={closeWelcome}
          aria-label="Fechar apresentação"
        >
          ×
        </button>
      </div>

      <div className="justina-welcome__message">
        Olá! Seja bem-vindo ao Sentença Digital!

        {"\n\n"}Aqui, você assumirá o papel de juiz e será responsável por
        analisar casos envolvendo o uso inadequado da Inteligência Artificial.

        {"\n\n"}Sua missão é examinar as evidências, compreender o que
        aconteceu e tomar suas próprias decisões para sentenciar cada caso.

        {"\n\n"}Para começar, clique em
        <strong> CONTINUAR CASO </strong>
        para abrir a lista de processos disponíveis. Depois, escolha um caso
        disponível, analise as informações e comece sua atuação como juiz.

        {"\n\n"}Lembre-se: a decisão final é sua!
      </div>
     

    </div>

    <div className="justina-welcome__character">
      <div className="assistant">
        <div className="assistant-hair">
          <div className="hair-left" />
          <div className="hair-right" />
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
        <div className="assistant-folder">J</div>
      </div>
    </div>
  </aside>
  );
}

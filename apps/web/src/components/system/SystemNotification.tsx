{/*

import { PixelButton } from "@/components/system/PixelButton";

export function SystemNotification({ onClose }: { onClose: () => void }) {
  return (
    <div className="system-notification" role="dialog" aria-label="Nova conquista">
      <div className="window-titlebar">
        <span>🏆 Nova Conquista!</span>
        <button className="window-control close" onClick={onClose} aria-label="Fechar">×</button>
      </div>
      <div className="notification-body">
        <div className="achievement-icon">🏆</div>
        <div>
          <strong>PRIMEIRA SENTENÇA</strong>
          <p>Realize sua primeira decisão.</p>
        </div>
      </div>
      <div className="notification-actions"><PixelButton onClick={onClose}>OK</PixelButton></div>
    </div>
  );
}

*/}

{/*

import { PixelButton } from "@/components/system/PixelButton";

export function SystemNotification({ onClose }: { onClose: () => void }) {
  return (
    <div 
      className="system-notification" 
      role="dialog" 
      aria-label="Nova conquista"
      onClick={(e) => e.stopPropagation()} // Impede o clique de vazar no painel
    >
      <div className="window-titlebar">
        <span>🏆 Nova Conquista!</span>
        <button 
          className="window-control close" 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          aria-label="Fechar"
        >
          ×
        </button>
      </div>
      <div className="notification-body">
        <div className="achievement-icon">🏆</div>
        <div>
          <strong>PRIMEIRA SENTENÇA</strong>
          <p>Realize sua primeira decisão.</p>
        </div>
      </div>
      <div className="notification-actions">
        <PixelButton onClick={(e) => { e.stopPropagation(); onClose(); }}>
          OK
        </PixelButton>
      </div>
    </div>
  );
}

*/}

import { useEffect, useState } from "react";
import { PixelButton } from "@/components/system/PixelButton";

export function SystemNotification({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já fechou essa conquista antes
    const jaViuConquista = localStorage.getItem("achievement_first_sentence_viewed") === "true";
    
    // Se NÃO viu, nós permitimos que ela apareça na tela
    if (!jaViuConquista) {
      setIsVisible(true);
    }
  }, []);

  // Função interna para fechar e salvar no navegador que já foi vista
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem("achievement_first_sentence_viewed", "true");
    setIsVisible(false);
    onClose(); // Avisa o componente pai que fechou
  };

  // Se já tiver visto ou fechado, não renderiza absolutamente nada na tela
  if (!isVisible) return null;

  return (
    <div 
      className="system-notification" 
      role="dialog" 
      aria-label="Nova conquista"
      onClick={(e) => e.stopPropagation()} // Impede o clique de vazar no painel
    >
      <div className="window-titlebar">
        <span>🏆 Nova Conquista!</span>
        <button 
          className="window-control close" 
          onClick={handleClose} 
          aria-label="Fechar"
        >
          ×
        </button>
      </div>
      <div className="notification-body">
        <div className="achievement-icon">🏆</div>
        <div>
          <strong>PRIMEIRA SENTENÇA</strong>
          <p>Realize sua primeira decisão.</p>
        </div>
      </div>
      <div className="notification-actions">
        <PixelButton onClick={handleClose}>
          OK
        </PixelButton>
      </div>
    </div>
  );
}

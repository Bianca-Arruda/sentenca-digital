
"use client";
{/*

import type { ReactNode } from "react";
import type { WindowId } from "@/types/game";

export function Window({
  id,
  title,
  icon,
  zIndex,
  children,
  minimized,
  onFocus,
  onMinimize,
  onClose,
  className = "",
}: {
  id: WindowId;
  title: string;
  icon: string;
  zIndex: number;
  children: ReactNode;
  minimized: boolean;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  className?: string;
}) {
  if (minimized) return null;

  return (
    <section className={`pixel-window ${className}`} style={{ zIndex }} onMouseDown={() => onFocus(id)}>
      <div className="window-titlebar" onDoubleClick={() => onMinimize(id)}>
        <div className="window-title">
          <span className="window-icon">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="window-controls">
          <button className="window-control" onClick={() => onMinimize(id)} aria-label="Minimizar">_</button>
          <button className="window-control" onClick={() => onMinimize(id)} aria-label="Maximizar">□</button>
          <button className="window-control close" onClick={() => onClose(id)} aria-label="Fechar">×</button>
        </div>
      </div>
      {children}
    </section>
  );
}


*/}

import { useState, type ReactNode } from "react";
import type { WindowId } from "@/types/game";

export function Window({
  id,
  title,
  icon,
  zIndex,
  children,
  minimized,
  onFocus,
  onMinimize,
  onClose,
  className = "",
  style = {}, // 1. Adicionado suporte para receber a posição do arrastar
}: {
  id: WindowId;
  title: string;
  icon: string;
  zIndex: number;
  children: ReactNode;
  minimized: boolean;
  onFocus: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  className?: string;
  style?: React.CSSProperties; // 2. Adicionado o tipo correto do style
}) {
  const [isMaximized, setIsMaximized] = useState( ["caseFile", "finalDashboard","dashboard" , "decision", "decisionResult", "realCase"].includes(id));

  if (minimized) return null;

    return (
    <section 
      className={`pixel-window ${isMaximized ? "maximized" : ""} ${className}`} 
      
      style={
        isMaximized 
          ? { zIndex, left: "0px", top: "0px", width: "100%", height: "calc(100% - 0px)" } 
          : { zIndex, ...style }
      }
      onMouseDown={() => onFocus(id)}
    >

      <div className="window-titlebar" onDoubleClick={() => setIsMaximized(!isMaximized)}>
        <div className="window-title">
          <span className="window-icon">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="window-controls">
          <button className="window-control" onClick={() => onMinimize(id)} aria-label="Minimizar">_</button>
          <button className="window-control" onClick={() => setIsMaximized(!isMaximized)} aria-label="Maximizar">
            {isMaximized ? "🗗" : "□"}
          </button>
          <button className="window-control close" onClick={() => onClose(id)} aria-label="Fechar">×</button>
        </div>
      </div>
      {/* 4. Envolve os filhos com o corpo padrão da janela */}
      <div className="window-body" style={{ height: "calc(100% - 30px)", overflow: "auto" }}>
        {children}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

export function BootScreen({ onReady }: { onReady: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const bootLines = [
    "SISTEMA DIGITAL JUDICIAL v1.0",
    "",
    "VERIFICANDO MEMÓRIA...",
    "CARREGANDO MOTOR DE EVIDÊNCIAS...",
    "CARREGANDO ARQUIVO DO CASO...",
    "CARREGANDO BANCO DE DADOS JUDICIAL...",
    "",
    "SISTEMA PRONTO...",
  ];

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      setLines((current) => [...current, bootLines[index]]);
      index += 1;
      if (index >= bootLines.length) {
        window.clearInterval(timer);
        window.setTimeout(onReady, 850);
      }
    }, 155);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="boot-screen">
      <div className="boot-logo">⚖</div>
      <h1>SENTENÇA DIGITAL BIOS</h1>
      <div className="boot-rule" />
      <div className="boot-terminal">{lines.map((line, index) => <div key={index}>{line || "\u00a0"}</div>)}</div>
      <div className="crt-vignette" />
    </main>
  );
}

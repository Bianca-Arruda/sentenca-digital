"use client";

import { useEffect, useState } from 'react';
import { listCases } from '@/features/cases/api';
import type { CaseSummary } from '@/types/case';

export function CaseArchiveWindow({ onOpenCase }: { onOpenCase: (caseCode: string, title: string) => void }) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listCases()
      .then((response) => {
        if (!active) return;
        setCases(response.data);
      })
      .catch(() => {
        if (!active) return;
        setError('NÃO FOI POSSÍVEL ACESSAR O ARQUIVO DE CASOS.');
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="window-content explorer-content">
      <div className="program-menubar"><span>Arquivo</span><span>Editar</span><span>Exibir</span></div>
      <div className="explorer-path">C:\\SENTENCA\\CASOS\\PUBLICADO</div>

      {loading && <div className="system-loading">LENDO CASE_ARCHIVE.DAT...</div>}
      {error && <div className="system-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="file-list">
            {cases.map((item) => {
              const locked = item.accessStatus === 'LOCKED';
              const completed = item.accessStatus === 'COMPLETED';
              const inProgress = item.accessStatus === 'IN_PROGRESS';
              const status = completed ? '✓ CONCLUÍDO' : inProgress ? '● EM ANDAMENTO' : locked ? '🔒 BLOQUEADO' : '● DISPONÍVEL';

              return (
                <button
                  key={item.id}
                  className={`file-row ${locked ? 'locked' : 'available'}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!locked) {
                      onOpenCase(item.code, item.title);
                    }
                  }}
                  title={locked ? 'Conclua os casos anteriores para desbloquear' : 'Clique para abrir'}
                  disabled={locked}
                >
                  <span>{locked ? '🔒' : completed ? '✓' : '📄'}</span>
                  <span>{item.code}.DIG</span>
                  <small>{item.title} · {status}</small>
                </button>
              );
            })}
          </div>
          <div className="explorer-status">
            {cases.filter((item) => item.accessStatus !== 'LOCKED').length} disponíveis · {cases.filter((item) => item.accessStatus === 'LOCKED').length} bloqueados · CLIQUE PARA ABRIR
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { BootScreen } from '@/components/desktop/BootScreen';
import { DesktopIcon } from '@/components/desktop/DesktopIcon';
import { LoginScreen } from '@/components/desktop/LoginScreen';
import { RegisterScreen } from '@/components/desktop/RegisterScreen';
import { ForgotPasswordScreen } from '@/features/auth/ForgotPasswordScreen';
import { getSession, login, logout, register, type LoginInput, type RegisterInput } from '@/features/auth/api';
import { getProgress } from '@/features/progress/api';
import type { AuthUser } from '@/types/user';
import type { CaseEvidence } from '@/types/case';
import type { DecisionResult } from '@/types/decision';
import type { ProgressState } from '@/types/progress';
import type { DesktopIconData, SocietyMetrics, WindowId, WindowState } from '@/types/game';
import { Taskbar } from '@/components/desktop/Taskbar';
import { StartMenu } from '@/components/system/StartMenu';
import { SystemNotification } from '@/components/system/SystemNotification';
import { AchievementsWindow } from '@/components/game/AchievementsWindow';
import { ArchiveWindow } from '@/components/game/ArchiveWindow';
import { CaseArchiveWindow } from '@/components/game/CaseArchiveWindow';
import { CaseWindow } from '@/components/game/CaseWindow';
import { DashboardWindow } from '@/components/game/DashboardWindow';
import { FinalDashboardWindow } from '@/components/game/FinalDashboardWindow';
import { DecisionRegisteredWindow } from '@/components/game/DecisionRegisteredWindow';
import { DecisionWindow } from '@/components/game/DecisionWindow';
import { EvidenceWindow } from '@/components/game/EvidenceWindow';
import { MapWindow } from '@/components/game/MapWindow';
import { RealCaseWindow } from '@/components/game/RealCaseWindow';
import { Window } from '@/components/windows/Window';
import { JuStinaWelcome } from '@/components/game/JuStinaWelcome';

const desktopIcons: DesktopIconData[] = [
  { id: 'cases', label: 'Casos', icon: '📁' },
  { id: 'dashboard', label: 'Sentença Digital', icon: '⚖' },
  { id: 'achievements', label: 'Conquistas', icon: '🏆' },
  { id: 'trash', label: 'Lixeira', icon: '🗑' },
  { id: 'settings', label: 'Créditos', icon: 'ℹ️' },
];

const initialWindows: WindowState[] = [
  { id: 'dashboard', title: 'Sentença Digital', icon: '⚖', zIndex: 10, minimized: false },
];

const defaultProgress: ProgressState = {
  currentCaseOrder: 1,
  completedCases: 0,
  discoveredCases: 0,
  progressPercent: 0,
  totalCases: 0,
  career: { code: 'NOVICE', title: 'Observador Digital', nextPercent: 25 },
  nextCase: null,
  societyMetrics: { responsibility: 50, adoption: 50, trust: 50 },
  events: [],
  statistics: { decisionsCount: 0, discoveredCountries: 0, unlockedAchievements: 0, totalAchievements: 0 },
};

export function GameShell() {
  const [stage, setStage] = useState<'boot' | 'login' | 'register' | 'forgot-password' | 'desktop'>('boot');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);
  const [nextZ, setNextZ] = useState(20);
  const [startOpen, setStartOpen] = useState(false);
  const [notification, setNotification] = useState(true);
  const [clock, setClock] = useState('');
  const [progress, setProgress] = useState<ProgressState>(defaultProgress);
  const [selectedCase, setSelectedCase] = useState<{ code: string; title: string } | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<CaseEvidence | null>(null);
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);
  const [discoveredClueIds, setDiscoveredClueIds] = useState<string[]>([]);
  const metrics: SocietyMetrics = progress.societyMetrics;
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(25);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  useEffect(() => {
    const update = () =>
      setClock(new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

    useEffect(() => {
    const clickSound = new Audio('/assets/sounds/click.mp3');

    clickSound.preload = 'auto';

    function handleButtonClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const button = target.closest(
        'button, [role="button"], input[type="button"], input[type="submit"]'
      );

      if (!button) return;

      if (
        button.hasAttribute('disabled') ||
        button.getAttribute('aria-disabled') === 'true'
      ) {
        return;
      }

      if (!soundEnabled || soundVolume === 0) return;

      clickSound.volume = soundVolume / 100;
      clickSound.currentTime = 0;

      void clickSound.play().catch(() => {});
    }

    document.addEventListener('click', handleButtonClick);

    return () => {
      document.removeEventListener('click', handleButtonClick);
      clickSound.pause();
    };
  }, [soundEnabled, soundVolume]);

  const activeWindows = useMemo(
    () => windows.filter((window) => !window.minimized),
    [windows]
  );

  async function loadPlayerState() {
    try {
      const response = await getProgress();
      setProgress(response.data);
    } catch {
      setProgress(defaultProgress);
    }
  }

      function openWindow(id: WindowId) {
    setStartOpen(false);
    if (!id) return;

    setWindows((current) => {
      const existing = current.find((window) => window.id === id);
      if (existing)
        return current.map((window) => (window.id === id ? { ...window, minimized: false, zIndex: nextZ } : window));
      
      const meta = getWindowMeta(id);
      
      return [...current, { id, ...meta, zIndex: nextZ, minimized: false }];
    });
    setNextZ((value) => value + 1);
  }

  function focusWindow(id: WindowId) {
    setWindows((current) =>
      current.map((window) => (window.id === id ? { ...window, zIndex: nextZ, minimized: false } : window)),
    );
    setNextZ((value) => value + 1);
  }

  function minimizeWindow(id: WindowId) {
    setWindows((current) => current.map((window) => (window.id === id ? { ...window, minimized: true } : window)));
  }

  function closeWindow(id: WindowId) {
    setWindows((current) => current.filter((window) => window.id !== id));
    if (id === 'decision') setDecisionResult(null);
  }

  function handleClueDiscovered(evidenceId: string) {
    setDiscoveredClueIds((current) => {
      if (current.includes(evidenceId)) {
        return current;
      }

      return [...current, evidenceId];
    });
  }

  function selectCase(code: string, title: string) {
  setSelectedCase({ code, title });
  setSelectedEvidence(null);
  setDiscoveredClueIds([]);
  setDecisionResult(null);

  setWindows((current) => {
    const exists = current.some((w) => w.id === 'caseFile');

    if (exists) {
      return current.map((w) =>
        w.id === 'caseFile'
          ? { ...w, title: `${code}.EXE`, minimized: false }
          : w
      );
    }

    return current;
  });
}

  function openDecision() {
    if (!selectedCase) return;
    setDecisionResult(null);
    openWindow('decision');
  }

  function handleDecisionRegistered(result: DecisionResult) {
    setDecisionResult(result);
    setProgress((current) => ({
      ...current,
      ...result.progress,
      societyMetrics: result.metrics,
    }));
    setWindows((current) =>
      current.map((item) =>
        item.id === 'decision'
          ? { ...item, title: 'DECISAO_REGISTRADA.EXE' }
          : item
      ),
    );
    void loadPlayerState();
  }

  function continueAfterRealCase() {
    if (!decisionResult?.nextCase) {
      closeWindow('realCase');
      closeWindow('decision');
      void loadPlayerState().then(() => openWindow('finalDashboard'));
      return;
    }

    const nextCase = decisionResult.nextCase;
    selectCase(nextCase.code, nextCase.title);
    closeWindow('realCase');
    closeWindow('decision');
    openWindow('caseFile');
  }

  async function shutdown() {
    setStartOpen(false);
    try {
      await logout();
    } finally {
      setCurrentUser(null);
      setProgress(defaultProgress);
      setSelectedCase(null);
      setSelectedEvidence(null);
      setDecisionResult(null);
      setWindows(initialWindows);
      setStage('boot');
    }
  }

  async function handleBootReady() {
    try {
      const session = await getSession();
      setCurrentUser(session.user);
      await loadPlayerState();
      setStage('desktop');
    } catch {
      setStage('login');
    }
  }

  async function handleLogin(input: LoginInput) {
    const session = await login(input);
    setCurrentUser(session.user);
    await loadPlayerState();
    setStage('desktop');
  }

  async function handleRegister(input: RegisterInput) {
    const session = await register(input);
    setCurrentUser(session.user);
    await loadPlayerState();
    setStage('desktop');
  }

  if (stage === 'boot') return <BootScreen onReady={handleBootReady} />;
if (stage === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onRegister={() => setStage('register')}
        onForgotPassword={() => setStage('forgot-password')}
      />
    );
  }  if (stage === 'register') return <RegisterScreen onRegister={handleRegister} onBack={() => setStage('login')} />;
  
  if (stage === 'forgot-password') {
    return (
      <ForgotPasswordScreen
        onBack={() => setStage('login')}
      />
    );
  }
  return (
    <main className="desktop-shell" onClick={() => startOpen && setStartOpen(false)}>
      <div className="desktop-noise" />
      <div className="desktop-icons" onClick={(event) => event.stopPropagation()}>
        {desktopIcons.map((item) => (
          <DesktopIcon key={item.id} item={item} onOpen={openWindow} />
        ))}
      </div>

              <div className="window-layer" onClick={(event) => event.stopPropagation()}>
        {activeWindows.map((window, index) => {
          const handleMouseDown = (e: React.MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.window-titlebar') || target.closest('.window-controls')) return;
            
            e.preventDefault();
            let startX = e.clientX;
            let startY = e.clientY;

            const handleMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = moveEvent.clientX - startX;
              const deltaY = moveEvent.clientY - startY;
              startX = moveEvent.clientX;
              startY = moveEvent.clientY;

              setWindows((current) =>
                current.map((w) =>
                  w.id === window.id
                    ? { ...w, x: (w.x ?? (40 + index * 20)) + deltaX, y: (w.y ?? (40 + index * 20)) + deltaY }
                    : w
                )
              );
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          };

          return (
            <div key={`drag-wrapper-${window.id}-${index}`} onMouseDown={handleMouseDown} style={{ display: 'contents' }}>
              <Window
                id={window.id}
                title={window.title}
                icon={window.icon}
                zIndex={window.zIndex}
                minimized={window.minimized}
                onFocus={focusWindow}
                onMinimize={minimizeWindow}
                onClose={closeWindow}
                className={`window-${window.id}`}
                style={{
                  position: 'absolute',
                  left: `${window.x ?? (40 + index * 20)}px`,
                  top: `${window.y ?? (40 + index * 20)}px`,
                }}
              >
                {renderWindow(window.id, {
                  metrics,
                  progress,
                  openWindow,
                  selectedCase,
                  decisionResult,
                  discoveredClueIds,
                  onOpenCase: selectCase,
                  onEvidence: setSelectedEvidence,
                  onDecision: openDecision,
                  onDecisionRegistered: handleDecisionRegistered,
                  onOpenRealCase: () => openWindow('realCase'),
                  onContinueRealCase: continueAfterRealCase,
                })}
              </Window>
            </div>
          );
        })}

        {selectedEvidence && (
          <Window
            key={`win-evidence-${selectedEvidence.id || 'readme'}`}
            id="readme"
            title={`${selectedEvidence.title}`}
            icon="📄"
            zIndex={nextZ + 1}
            minimized={false}
            onFocus={() => focusWindow('readme')}
            onMinimize={() => setSelectedEvidence(null)}
            onClose={() => setSelectedEvidence(null)}
            className="window-evidence"
            style={{
              position: 'absolute',
              left: '120px',
              top: '120px',
            }}
          >
            <EvidenceWindow evidence={selectedEvidence} caseCode={selectedCase?.code} onClose={() => setSelectedEvidence(null)} onClueDiscovered={handleClueDiscovered}/>
          </Window>
        )}
      </div>

      {currentUser && (
        <JuStinaWelcome
          userId={String(currentUser.id)}
          onContinueCases={() => openWindow('cases')}
        />
      )}

      {startOpen && (
        <div onClick={(event) => event.stopPropagation()}>
          <StartMenu onOpen={openWindow} onShutdown={shutdown} />
        </div>
      )}
      {notification && <SystemNotification onClose={() => setNotification(false)} />}
      <Taskbar
  windows={windows}
  startOpen={startOpen}
  onStart={() => setStartOpen((value) => !value)}
  onWindow={focusWindow}
  time={clock}
  soundEnabled={soundEnabled}
  setSoundEnabled={setSoundEnabled}
  soundVolume={soundVolume}
  setSoundVolume={setSoundVolume}
  showVolumeControl={showVolumeControl}
  setShowVolumeControl={setShowVolumeControl}
/>
      <div className="crt-overlay" />
    </main>
  );
}

function renderWindow(
  id: WindowId,
  context: {
    metrics: SocietyMetrics;
    progress: ProgressState;
    openWindow: (id: WindowId) => void;
    selectedCase: { code: string; title: string } | null;
    decisionResult: DecisionResult | null;
    discoveredClueIds: string[];
    onOpenCase: (code: string, title: string) => void;
    onEvidence: (evidence: CaseEvidence) => void;
    onDecision: () => void;
    onDecisionRegistered: (result: DecisionResult) => void;
    onOpenRealCase: () => void;
    onContinueRealCase: () => void;
  },
) {
  const cleanId = id === ('' as any) || !id ? 'cases' : id;

  switch (cleanId) {
    case 'finalDashboard':
      return <FinalDashboardWindow progress={context.progress} onDashboard={() => context.openWindow('dashboard')} />;
    
    case 'dashboard':
      return (
        <DashboardWindow
          metrics={context.metrics}
          progress={context.progress}
          onContinue={() => context.openWindow('cases')}
          onMap={() => context.openWindow('map')}
          onFinal={() => context.openWindow('finalDashboard')}
        />
      );
    
    case 'cases':
      return (
        <CaseArchiveWindow
          onOpenCase={(code, title) => {
            context.onOpenCase(code, title);
            context.openWindow('caseFile');
          }}
        />
      );
    
    case 'computer':
      return <ComputerWindow />;
    
    case 'caseFile':
      return context.selectedCase ? (
        <CaseWindow
          caseCode={context.selectedCase.code}
          onEvidence={context.onEvidence}
          onDecision={context.onDecision}
          discoveredClueIds={context.discoveredClueIds}
        />
      ) : (
        <div className="window-content system-error">NENHUM CASO SELECIONADO.</div>
      );
    
    case 'decision':
      return context.selectedCase ? (
        context.decisionResult ? (
          <DecisionRegisteredWindow result={context.decisionResult} onOpenRealCase={context.onOpenRealCase} />
        ) : (
          <DecisionWindow caseCode={context.selectedCase.code} onRegistered={context.onDecisionRegistered} />
        )
      ) : (
        <div className="window-content system-error">NENHUM CASO SELECIONADO.</div>
      );
    
    case 'realCase':
      return context.decisionResult ? (
        <RealCaseWindow result={context.decisionResult} onContinue={context.onContinueRealCase} />
      ) : (
        <div className="window-content system-error">NENHUM RESULTADO DISPONÍVEL.</div>
      );
    
    case 'map':
      return <MapWindow />;
    
    case 'achievements':
      return <AchievementsWindow refreshKey={context.progress.completedCases} />;
    
    case 'archive':
    case 'readme':
      return <ArchiveWindow />;
    
    case 'settings':
      return <SettingsWindow />;
    
    case 'trash':
      return <TrashWindow />;
    
    default:
      return <div className="window-content p-4 font-mono">ERRO: A janela "{cleanId}" não pôde ser renderizada.</div>;
  }
}

function ComputerWindow() {
  return (
    <div className="window-content simple-window">
      <div className="program-menubar">
        <span>Arquivo</span>
        <span>Exibir</span>
      </div>

      <h2>MEU COMPUTADOR</h2>

      <p>Ambiente virtual do Sentença Digital.</p>
    </div>
  );
}

function SettingsWindow() {
  return (
    <div className="window-content simple-window">
      <div className="program-menubar">
        <span>Créditos</span>
        <span>Sobre o projeto</span>
      </div>

      <h2>SENTENÇA DIGITAL</h2>

      <p>Projeto acadêmico desenvolvido no contexto da graduação.</p>

      <h3>DESENVOLVIMENTO</h3>
      <p>Bianca Ribeiro Vidal de Arruda</p>

      <h3>INFORMAÇÕES ACADÊMICAS</h3>
      <p>Universidade Federal da Grande Dourados (UFGD)</p>
      <p>Tópicos Avançados em Computação I</p>
      <p><strong>Professora:</strong> Valguima Victoria Viana Aguiar Odakura</p>

      <h3>CRÉDITOS DE MÍDIA</h3>
      <p><strong>Efeito sonoro:</strong> Pixabay</p>
    </div>
  );
}

function TrashWindow() {
  return (
    <div className="window-content simple-window">
      <div className="program-menubar">
        <span>Arquivo</span>
        <span>Editar</span>
      </div>
      <h2>LIXEIRA</h2>
      <p>Não há itens para exibir.</p>
    </div>
  );
}


function getWindowMeta(id: WindowId): Pick<WindowState, 'title' | 'icon'> {
  const meta: Partial<Record<WindowId, { title: string; icon: string }>> = {
    dashboard: { title: 'Sentença Digital', icon: '⚖' },
    finalDashboard: { title: 'RELATORIO_FINAL.EXE', icon: '🏁' },
    cases: { title: 'ARQUIVOS_CASOS.EXE', icon: '📁' },
    achievements: { title: 'CONQUISTAS.EXE', icon: '🏆' },
    settings: { title: 'CRÉDITOS.EXE', icon: 'ℹ️' },
    computer: { title: 'MEU_COMPUTADOR.EXE', icon: '🖥' },
    caseFile: { title: 'ARQUIVO_DO_CASO.EXE', icon: '⚖' },
    decision: { title: 'DECISÃO_JUDICIAL.EXE', icon: '⚖' },
    realCase: { title: 'CASO_REAL.DOC', icon: '📄' },
    trash: { title: 'Lixeira', icon: '🗑' },
  };

  return meta[id] ?? { title: '', icon: '' };
}

import { PixelButton } from '@/components/system/PixelButton';
import type { WindowState } from '@/types/game';

export function Taskbar({
  windows,
  startOpen,
  onStart,
  onWindow,
  time,
  soundEnabled,
  setSoundEnabled,
  soundVolume,
  setSoundVolume,
  showVolumeControl,
  setShowVolumeControl,
}: {
  windows: WindowState[];
  startOpen: boolean;
  onStart: () => void;
  onWindow: (id: WindowState["id"]) => void;
  time: string;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  soundVolume: number;
  setSoundVolume: (value: number) => void;
  showVolumeControl: boolean;
  setShowVolumeControl: (value: boolean) => void;
}) {
  return (
    <div className="taskbar">
      <button
  type="button"
  className={`start-button ${startOpen ? "pressed" : ""}`}
  onClick={onStart}
>
  <span className="start-flag"></span> INICIAR
</button>

      <div className="taskbar-apps">
        {windows.map((window, index) => (
          <button
  type="button"
  key={`task-app-${window.id}-${index}`}
  className={`taskbar-app ${window.minimized ? "minimized" : ""}`}
  onClick={() => onWindow(window.id)}
>
  <span>{window.icon}</span> {window.title}
</button>
        ))}
      </div>

      <div className="system-tray">
  <div className="sound-control">
    <button
      type="button"
      className="sound-toggle"
      title={soundEnabled ? 'Silenciar áudio' : 'Ativar áudio'}
      onClick={() => {
        setSoundEnabled(!soundEnabled);
        setShowVolumeControl(false);
      }}
    >
      {soundEnabled && soundVolume > 0 ? '🔊' : '🔇'}
    </button>

    <button
      type="button"
      className="volume-button"
      title="Ajustar volume"
      onClick={() => setShowVolumeControl(!showVolumeControl)}
    >
      ▾
    </button>

    {showVolumeControl && (
      <div className="volume-popup">
        <div className="volume-popup-header">
          <span>VOLUME</span>
          <strong>{soundEnabled ? `${soundVolume}%` : 'MUTADO'}</strong>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={soundVolume}
          onChange={(e) => {
            const volume = Number(e.target.value);
            setSoundVolume(volume);

            if (volume > 0) {
              setSoundEnabled(true);
            }
          }}
        />

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? 'SILENCIAR' : 'ATIVAR SOM'}
        </button>
      </div>
    )}
  </div>

  <span className="connection-dot" title="Sistema online" />
  <span>{time}</span>
</div>

    </div>
  );
}

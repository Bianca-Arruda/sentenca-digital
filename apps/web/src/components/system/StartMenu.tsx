import { PixelButton } from "@/components/system/PixelButton";
import type { WindowId } from "@/types/game";

const items: Array<{ id: WindowId; icon: string; label: string }> = [
  { id: "dashboard", icon: "⚖", label: "Sentença Digital" },
  { id: "cases", icon: "📁", label: "Casos" },
  { id: "achievements", icon: "🏆", label: "Conquistas" },
  { id: "settings", icon: "ℹ️", label: "Créditos" },
];

export function StartMenu({ onOpen, onShutdown }: { onOpen: (id: WindowId) => void; onShutdown: () => void }) {
  return (
    <div className="start-menu" role="menu">
      <div className="start-brand"><span>🏛️</span><strong>SISTEMA TRIBUNAL</strong></div>
      <div className="start-items">
        {items.map((item) => (
          <PixelButton key={item.id} className="start-item" onClick={() => onOpen(item.id)}>
            <span>{item.icon}</span><span>{item.label}</span>
          </PixelButton>
        ))}
      </div>
      <div className="start-separator" />
      <PixelButton className="start-item shutdown" onClick={onShutdown}>
        <span>🔴</span><span>Sair</span>
      </PixelButton>
    </div>
  );
}

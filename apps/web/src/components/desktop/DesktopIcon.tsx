import type { DesktopIconData } from "@/types/game";

export function DesktopIcon({ item, onOpen }: { item: DesktopIconData; onOpen: (id: DesktopIconData["id"]) => void }) {
  return (
    <button className="desktop-icon" onDoubleClick={() => onOpen(item.id)} onClick={() => onOpen(item.id)}>
      <span className="desktop-icon-art">{item.icon}</span>
      <span className="desktop-icon-label">{item.label}</span>
    </button>
  );
}

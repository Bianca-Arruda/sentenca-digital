"use client";

import { useEffect, useState } from "react";
import { listAchievements } from "@/features/achievements/api";
import type { Achievement } from "@/types/achievement";

export function AchievementsWindow({ refreshKey = 0 }: { refreshKey?: number }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    listAchievements()
      .then((response) => setAchievements(response.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return <div className="window-content system-loading">🔄 CARREGANDO ARQUIVO DE CONQUISTAS...</div>;
  }

  if (error) {
    return <div className="window-content system-error">ERRO AO ACESSAR CONQUISTAS.EXE.</div>;
  }

  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;

  return (
    <div className="window-content achievements-content">
      <div className="program-menubar"><span>Arquivo</span><span>Exibir</span></div>
      <div className="achievement-summary">
        <strong> ARQUIVO DE CONQUISTAS </strong>
        <span> - {unlockedCount} / {achievements.length} desbloqueada</span>
      </div>
      <div className="achievement-grid">
        {achievements.map((achievement) => (
          <article key={achievement.id} className={`achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`}>
            <div className="achievement-trophy">{achievement.unlocked ? (achievement.icon || "🏆") : "🔒"}</div>
            <div>
  <strong>{achievement.title}</strong>
  <p>{achievement.description}</p>

  <small className="achievement-status">
    STATUS: {achievement.unlocked ? "DESBLOQUEADA" : "BLOQUEADA"}
  </small>

  {achievement.unlockedAt && (
    <small className="achievement-date">
      DESBLOQUEADA EM:{" "}
      {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}
    </small>
  )}
</div>
          </article>
        ))}
      </div>
    </div>
  );
}

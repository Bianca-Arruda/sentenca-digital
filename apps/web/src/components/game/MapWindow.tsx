"use client";

import { useEffect, useMemo, useState } from "react";
import { PixelButton } from "@/components/system/PixelButton";
import { getMap } from "@/features/map/api";
import type { MapCase, MapData } from "@/types/map";

const fallbackPositions: Record<string, { x: number; y: number }> = {
  BR: { x: 39, y: 59 },
  CA: { x: 24, y: 32 },
  US: { x: 27, y: 42 },
  GB: { x: 48, y: 30 },
  IT: { x: 52, y: 39 },
  CN: { x: 75, y: 43 },
  CO: { x: 31, y: 52 },
  NZ: { x: 91, y: 75 },
};

export function MapWindow() {
  const [map, setMap] = useState<MapData | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMap()
      .then((response) => {
        setMap(response.data);
        setSelectedCountryCode(response.data.countries.find((country) => country.unlocked)?.countryCode ?? null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const selectedCountry = map?.countries.find((country) => country.countryCode === selectedCountryCode) ?? null;
  const selectedCases = useMemo(
    () => map?.cases.filter((item) => item.countryCode === selectedCountryCode) ?? [],
    [map, selectedCountryCode],
  );

  if (loading) {
    return <div className="window-content system-loading">CARREGANDO WORLD ARCHIVE...</div>;
  }

  if (error || !map) {
    return <div className="window-content system-error">NÃO FOI POSSÍVEL ACESSAR O ARQUIVO MUNDIAL.</div>;
  }

  return (
    <div className="window-content map-window-content">
      <div className="program-menubar"><span>Arquivo</span><span>Exibir</span><span>Localizar</span></div>
      <div className="map-toolbar">
        <span>WORLD ARCHIVE / {String(map.progress.completedCases).padStart(2, "0")} DE {map.totalCases} CASOS</span>
        <span>{map.totalCountries} PAÍSES INDEXADOS</span>
      </div>

      <div className="world-map">
        <div className="map-grid" />
        <div className="continent-art">▟▟▟　　▟▟<br />▟▟▟▟　▟▟▟<br />　▟▟▟▟▟　　　▟▟</div>
        {map.cases.map((item) => {
          const position = getMarkerPosition(item);
          const locked = item.accessStatus === "LOCKED";
          return (
            <button
              key={item.id}
              className={`country-marker ${locked ? "locked" : "unlocked"} ${selectedCountryCode === item.countryCode ? "selected" : ""}`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              title={`${item.country} — ${item.code}`}
              onClick={() => setSelectedCountryCode(item.countryCode)}
              disabled={locked}
            >
              <span>{locked ? "🔒" : "•"}</span>{getCountryCaseCount(map.cases, item.countryCode)}
            </button>
          );
        })}
      </div>

      <div className="map-progress-panel">
        <div><strong>PROGRESSO DA CAMPANHA</strong><span>{map.progress.progressPercent}%</span></div>
        <div className="map-progress-track"><div style={{ width: `${map.progress.progressPercent}%` }} /></div>
        <small>{map.progress.completedCases} casos concluídos · {map.progress.discoveredCases} casos descobertos · próximo: {map.progress.currentCaseOrder <= map.totalCases ? `CASE_${String(map.progress.currentCaseOrder).padStart(3, "0")}` : "CAMPANHA CONCLUÍDA"}</small>
      </div>

      <div className="country-strip">
        {selectedCountry ? (
          <div className="map-country-details">
            <div>
              <strong>{selectedCountry.country.toUpperCase()}</strong>
              <span>{selectedCountry.discoveredCases} de {selectedCountry.caseCount} casos descobertos · {selectedCountry.completedCases} concluídos</span>
            </div>
            <PixelButton onClick={() => setSelectedCountryCode(selectedCountry.countryCode)}>ATUALIZAR</PixelButton>
          </div>
        ) : (
          <span>SELECIONE UM MARCADOR PARA VER OS CASOS.</span>
        )}
      </div>

      <div className="map-case-list">
        {selectedCases.map((item) => <MapCaseRow key={item.id} item={item} />)}
      </div>
    </div>
  );
}

function getMarkerPosition(item: MapCase) {
  const latitude = Number(item.latitude);
  const longitude = Number(item.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return fallbackPositions[item.countryCode] ?? { x: 50, y: 50 };
  return {
    x: Math.min(96, Math.max(4, ((longitude + 180) / 360) * 100)),
    y: Math.min(92, Math.max(8, ((90 - latitude) / 180) * 100)),
  };
}

function getCountryCaseCount(cases: MapCase[], countryCode: string) {
  return cases.filter((item) => item.countryCode === countryCode).length;
}

function MapCaseRow({ item }: { item: MapCase }) {
  const statusLabel = {
    LOCKED: "🔒 Bloqueado",
    AVAILABLE: "● Disponível",
    IN_PROGRESS: "● Em andamento",
    COMPLETED: "✓ Concluído",
  }[item.accessStatus];

  return (
    <div className={`map-case-row ${item.accessStatus.toLowerCase()}`}>
      <span className="map-case-code">{item.code}</span>
      <div><strong>{item.title}</strong><small>{item.country} · {item.year}</small></div>
      <span className="map-case-status">{statusLabel}</span>
    </div>
  );
}

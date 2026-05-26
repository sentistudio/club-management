import { createContext, useContext, useState } from "react";

export type PositionSchema = "auto" | "football" | "volleyball" | "handball" | "fitness" | "none";

export interface TeamVisibilitySettings {
  saisonEnabled: boolean;
  seasonVisible: boolean;
  uebungenVisible: boolean;
  wissenVisible: boolean;
  aufgabenVisible: boolean;
  aufstellungVisible: boolean;
  positionSchema: PositionSchema;
}

const DEFAULTS: TeamVisibilitySettings = {
  saisonEnabled: false,
  seasonVisible: true,
  uebungenVisible: false,
  wissenVisible: false,
  aufgabenVisible: false,
  aufstellungVisible: false,
  positionSchema: "auto",
};

type SettingValue = boolean | PositionSchema;

interface TeamVisibilityContextValue {
  settings: TeamVisibilitySettings;
  updateSetting: <K extends keyof TeamVisibilitySettings>(key: K, value: TeamVisibilitySettings[K]) => void;
}

const TeamVisibilityContext = createContext<TeamVisibilityContextValue | null>(null);

export function TeamVisibilityProvider({ teamId, children }: { teamId: string; children: React.ReactNode }) {
  const storageKey = `team_visibility_${teamId}`;
  const [settings, setSettings] = useState<TeamVisibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  const updateSetting = <K extends keyof TeamVisibilitySettings>(key: K, value: TeamVisibilitySettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  };

  return (
    <TeamVisibilityContext.Provider value={{ settings, updateSetting }}>
      {children}
    </TeamVisibilityContext.Provider>
  );
}

export function useTeamVisibility() {
  const ctx = useContext(TeamVisibilityContext);
  if (!ctx) throw new Error("useTeamVisibility must be used within TeamVisibilityProvider");
  return ctx;
}

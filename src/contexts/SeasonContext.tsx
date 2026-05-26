import { createContext, useContext, useState, ReactNode } from "react";
import { type Season, getSeasonsByTeam, mockSeasons, CURRENT_SEASON_ID } from "../data/mockSeasons";

interface SeasonContextType {
  seasons: Season[];
  currentSeason: Season;
  setCurrentSeason: (seasonId: string) => void;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

interface SeasonProviderProps {
  children: ReactNode;
  teamId?: string;
}

export function SeasonProvider({ children, teamId }: SeasonProviderProps) {
  const seasons = teamId ? getSeasonsByTeam(teamId) : mockSeasons;
  const defaultActive = seasons.find(s => s.status === "active") ?? seasons[seasons.length - 1];
  const storageKey = teamId ? `team-season-${teamId}` : "team-season";

  const [currentSeasonId, setCurrentSeasonId] = useState<string>(() => {
    return localStorage.getItem(storageKey) ?? defaultActive.id;
  });

  const currentSeason = seasons.find(s => s.id === currentSeasonId) ?? defaultActive;

  const setCurrentSeason = (seasonId: string) => {
    setCurrentSeasonId(seasonId);
    localStorage.setItem(storageKey, seasonId);
  };

  return (
    <SeasonContext.Provider value={{ seasons, currentSeason, setCurrentSeason }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error("useSeason must be used within a SeasonProvider");
  return ctx;
}

// Keep backward-compat re-export
export type { Season };
export { CURRENT_SEASON_ID };

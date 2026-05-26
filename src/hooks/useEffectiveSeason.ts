import { useParams } from "react-router-dom";
import { useSeason } from "../contexts/SeasonContext";
import { useTeamVisibility } from "../contexts/TeamVisibilityContext";
import { getActiveSeasonForTeam } from "../data/mockSeasons";

export function useEffectiveSeason() {
  const { teamId } = useParams<{ teamId: string }>();
  const { currentSeason, seasons, setCurrentSeason } = useSeason();
  const { settings: vis } = useTeamVisibility();

  const effectiveSeason = vis.saisonEnabled
    ? currentSeason
    : (seasons.find(s => s.status === "active") ?? getActiveSeasonForTeam(teamId ?? ""));

  return { effectiveSeason, currentSeason, seasons, setCurrentSeason };
}

import { Outlet, useParams, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SeasonProvider } from "../../contexts/SeasonContext";
import { TeamVisibilityProvider, useTeamVisibility } from "../../contexts/TeamVisibilityContext";
import { TeamSubNav } from "../../components/teams/TeamSubNav";
import { SeasonSelector } from "../../components/teams/SeasonSelector";
import { mockTeams } from "../../data/mockTeams";
import type { Team } from "../../types/domain";

function TeamLayoutContent({ team }: { team: Team }) {
  const navigate = useNavigate();
  const { settings: vis } = useTeamVisibility();

  const genderLabel =
    team.gender === "m" ? "Herren" : team.gender === "w" ? "Damen" : "Mixed";
  const ageLabel = team.ageGroup ? ` · ${team.ageGroup}` : "";

  return (
    <div className="flex flex-col h-full">
      {/* Team context header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/teams")}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Mannschaften</span>
            </button>
            <div className="w-px h-5 bg-neutral-200" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-teal-700 font-bold text-sm">
                  {team.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-neutral-900 leading-tight">
                  {team.name}
                </h1>
                <p className="text-xs text-neutral-500">
                  {genderLabel}{ageLabel}
                </p>
              </div>
            </div>
          </div>

          {vis.saisonEnabled && (
            <div className="flex items-center gap-3">
              <SeasonSelector />
            </div>
          )}
        </div>
      </div>

      {/* Sub navigation */}
      <TeamSubNav />

      {/* Page content */}
      <div className="flex-1 overflow-auto bg-neutral-50">
        <Outlet />
      </div>
    </div>
  );
}

export function TeamLayout() {
  const { teamId } = useParams<{ teamId: string }>();
  const team = mockTeams.find(t => t.id === teamId);

  if (!team) {
    return <Navigate to="/teams" replace />;
  }

  return (
    <SeasonProvider teamId={teamId!}>
      <TeamVisibilityProvider teamId={teamId!}>
        <TeamLayoutContent team={team} />
      </TeamVisibilityProvider>
    </SeasonProvider>
  );
}

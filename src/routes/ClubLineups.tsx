import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { Card } from "../components/ui/Card";
import { mockTeams } from "../data/mockTeams";
import { getLineupsByTeam } from "../data/mockLineups";

const FORMATION_LABELS: Record<string, string> = {
  "4-4-2": "4-4-2",
  "4-3-3": "4-3-3",
  "3-5-2": "3-5-2",
  "4-2-3-1": "4-2-3-1",
};

export function ClubLineups() {
  const [teamFilter, setTeamFilter] = useState<string>("all");

  const activeTeams = mockTeams.filter(t => t.isActive);

  const teamsWithLineups = activeTeams
    .map(team => ({
      team,
      lineups: getLineupsByTeam(team.id),
    }))
    .filter(({ lineups }) => lineups.length > 0);

  const displayTeams =
    teamFilter === "all"
      ? teamsWithLineups
      : teamsWithLineups.filter(({ team }) => team.id === teamFilter);

  const totalLineups = teamsWithLineups.reduce((acc, { lineups }) => acc + lineups.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Aufstellungen</h1>
        <p className="text-neutral-500 mt-1">
          {totalLineups} Aufstellungen · {teamsWithLineups.length} Teams
        </p>
      </div>

      {/* Team filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTeamFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            teamFilter === "all"
              ? "bg-teal-600 text-white"
              : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
          }`}
        >
          Alle Teams
        </button>
        {activeTeams.map(team => (
          <button
            key={team.id}
            onClick={() => setTeamFilter(team.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              teamFilter === team.id
                ? "bg-teal-600 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      {/* Grouped by team */}
      {displayTeams.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-12">
            <LayoutGrid className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">Keine Aufstellungen vorhanden</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {displayTeams.map(({ team, lineups }) => (
            <div key={team.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-700 font-bold text-xs">{team.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900">{team.name}</h2>
                  <p className="text-xs text-neutral-400">{lineups.length} Aufstellung{lineups.length !== 1 ? "en" : ""}</p>
                </div>
                <Link
                  to={`/teams/${team.id}/lineups`}
                  className="ml-auto text-xs text-teal-600 hover:text-teal-700 font-medium"
                >
                  Alle →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lineups.map(lineup => (
                  <Link key={lineup.id} to={`/teams/${team.id}/lineups/${lineup.id}`}>
                    <Card padding="md" hover>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-neutral-900 truncate">{lineup.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                              {FORMATION_LABELS[lineup.formation] ?? lineup.formation}
                            </span>
                            {lineup.linkedMatchId && (
                              <span className="text-xs text-emerald-600">Spiel</span>
                            )}
                          </div>
                        </div>
                        <LayoutGrid className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-0.5" />
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
                        {lineup.positions.filter(p => p.personId).length}/{lineup.positions.length} besetzt
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

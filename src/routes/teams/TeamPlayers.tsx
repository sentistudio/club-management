import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, UserPlus, Shield } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useRole } from "../../contexts";
import { useTeamVisibility } from "../../contexts/TeamVisibilityContext";
import { mockTeams } from "../../data/mockTeams";
import {
  getRosterByTeam,
  getPositionLabel,
  getPositionFilters,
  type PlayerPosition,
} from "../../data/mockTeamRoster";
import { getPersonDisplay, getPersonInitials } from "../../data/personHelpers";

export function TeamPlayers() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const { settings: vis } = useTeamVisibility();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";

  const team = mockTeams.find(t => t.id === teamId);
  const posFilters = getPositionFilters(vis.positionSchema, team?.departmentId);
  const hasPositionFilter = posFilters.length > 1;

  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState<string>("all");

  const roster = getRosterByTeam(teamId!, currentSeason.id);
  const players = roster.filter(r => r.role === "player");
  const coaches = roster.filter(r => r.role !== "player");

  const filtered = players.filter(entry => {
    const person = getPersonDisplay(entry.personId);
    const matchesSearch =
      !search ||
      person.fullName.toLowerCase().includes(search.toLowerCase()) ||
      String(entry.jerseyNumber ?? "").includes(search);
    const matchesPos = posFilter === "all" || entry.position === posFilter;
    return matchesSearch && matchesPos;
  });

  const attendanceRate = (entry: typeof players[0]) =>
    entry.attendanceStats.invited > 0
      ? Math.round(entry.attendanceStats.attended / entry.attendanceStats.invited * 100)
      : 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Kader</h2>
          <p className="text-sm text-neutral-500">
            {players.length} Spieler · {coaches.length} Trainer
          </p>
        </div>
        {isCoachOrAdmin && (
          <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />}>
            Spieler hinzufügen
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Name oder Trikotnummer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {hasPositionFilter && (
          <div className="flex gap-1 flex-wrap">
            {posFilters.map(f => (
              <button
                key={f.value}
                onClick={() => setPosFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  posFilter === f.value
                    ? "bg-teal-600 text-white"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Player grid */}
      {filtered.length === 0 ? (
        <Card padding="md">
          <p className="text-sm text-neutral-400 text-center py-8">Keine Spieler gefunden</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(entry => {
            const person = getPersonDisplay(entry.personId);
            const initials = getPersonInitials(person);
            const rate = attendanceRate(entry);
            // Get color from the current schema's filter definitions
            const posColor = posFilters.find(f => f.value === entry.position)?.color
              ?? "bg-neutral-100 text-neutral-600";

            return (
              <Link key={entry.id} to={`/teams/${teamId}/players/${entry.personId}`}>
                <Card padding="none" hover className="flex flex-col items-center p-4 gap-3 text-center">
                  <div className="relative">
                    {person.avatarUrl ? (
                      <img src={person.avatarUrl} alt={person.fullName} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-700 font-bold text-lg">{initials}</span>
                      </div>
                    )}
                    {entry.jerseyNumber !== undefined && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                        {entry.jerseyNumber}
                      </div>
                    )}
                    {entry.isCaptain && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center" title="Kapitän">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <p className="text-sm font-medium text-neutral-900 truncate">{person.firstName}</p>
                    <p className="text-xs text-neutral-500 truncate">{person.lastName}</p>
                  </div>

                  {entry.position && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${posColor}`}>
                      {getPositionLabel(entry.position as PlayerPosition)}
                    </span>
                  )}

                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-400">Anwesenheit</span>
                      <span className={`text-xs font-medium ${
                        rate >= 80 ? "text-emerald-600" : rate >= 60 ? "text-amber-600" : "text-red-500"
                      }`}>{rate}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          rate >= 80 ? "bg-emerald-500" : rate >= 60 ? "bg-amber-400" : "bg-red-400"
                        }`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Coaching staff */}
      {coaches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-900">Trainer & Betreuer</h3>
          <div className="flex flex-wrap gap-3">
            {coaches.map(entry => {
              const person = getPersonDisplay(entry.personId);
              const initials = getPersonInitials(person);
              const roleLabel =
                entry.role === "coach" ? "Cheftrainer" :
                entry.role === "assistant_coach" ? "Co-Trainer" :
                "Torwarttrainer";
              return (
                <Card key={entry.id} padding="sm" className="flex items-center gap-3">
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.fullName} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center">
                      <span className="text-neutral-600 font-bold text-sm">{initials}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{person.fullName}</p>
                    <p className="text-xs text-neutral-500">{roleLabel}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

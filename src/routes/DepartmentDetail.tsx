import { useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Shield, ChevronRight, MoreVertical } from "lucide-react";
import { Card, Button } from "../components/ui";
import { mockDepartments } from "../data/mockDepartments";
import { mockTeams } from "../data/mockTeams";
import { getRosterByTeam } from "../data/mockTeamRoster";
import { getPersonDisplay, getPersonInitials } from "../data/personHelpers";
import { CURRENT_SEASON_ID } from "../data/mockSeasons";
import type { DepartmentKind } from "../types/domain";

const KIND_CONFIG: Record<DepartmentKind, { label: string; color: string; dot: string }> = {
  sport: { label: "Sport", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  admin: { label: "Verwaltung", color: "bg-sky-100 text-sky-700", dot: "bg-sky-500" },
};

const GENDER_LABELS: Record<string, string> = {
  m: "Männlich", w: "Weiblich", mixed: "Mixed"
};

type Tab = "teams" | "members";

export function DepartmentDetail() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>((searchParams.get("tab") as Tab) ?? "teams");

  const dept = mockDepartments.find(d => d.id === departmentId);

  const teams = useMemo(
    () => mockTeams.filter(t => t.departmentId === departmentId && t.isActive),
    [departmentId]
  );

  const allMembers = useMemo(() => {
    const seen = new Set<string>();
    return teams.flatMap(team => {
      const roster = getRosterByTeam(team.id, CURRENT_SEASON_ID);
      return roster
        .filter(r => {
          if (seen.has(r.personId)) return false;
          seen.add(r.personId);
          return true;
        })
        .map(r => ({ ...r, teamId: team.id, teamName: team.name }));
    });
  }, [teams]);

  const players = allMembers.filter(m => m.role === "player");
  const coaches = allMembers.filter(m => m.role !== "player");

  if (!dept) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate("/departments")} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800">
          <ArrowLeft className="w-4 h-4" /> Zurück zu Abteilungen
        </button>
        <Card><p className="text-neutral-400 text-sm">Abteilung nicht gefunden.</p></Card>
      </div>
    );
  }

  const cfg = KIND_CONFIG[dept.kind];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate("/departments")}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Abteilungen
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.color}`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{dept.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dept.isActive ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                  {dept.isActive ? "Aktiv" : "Inaktiv"}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<MoreVertical className="w-4 h-4" />}>
            Optionen
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="sm">
          <p className="text-2xl font-bold text-neutral-900">{teams.length}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Teams</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-neutral-900">{players.length}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Spieler</p>
        </Card>
        <Card padding="sm">
          <p className="text-2xl font-bold text-neutral-900">{coaches.length}</p>
          <p className="text-xs text-neutral-500 mt-0.5">Trainer</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {([["teams", "Teams"], ["members", "Mitglieder"]] as [Tab, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === value ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {label}
            {tab === value && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Teams tab */}
      {tab === "teams" && (
        teams.length === 0 ? (
          <Card className="text-center py-12">
            <Shield className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-500">Noch keine Teams</p>
            <p className="text-xs text-neutral-400 mt-1">Diese Abteilung hat noch keine aktiven Teams.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => {
              const roster = getRosterByTeam(team.id, CURRENT_SEASON_ID);
              const teamPlayers = roster.filter(r => r.role === "player");
              const teamCoaches = roster.filter(r => r.role !== "player");
              return (
                <Link key={team.id} to={`/teams/${team.id}/dashboard`}>
                  <Card hover padding="none" className="cursor-pointer">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">cb</span>
                          </div>
                          <h3 className="text-sm font-semibold text-neutral-900 leading-snug">{team.name}</h3>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-0.5" />
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <p className="text-xs text-neutral-400 uppercase tracking-wide">Spieler</p>
                          <p className="font-semibold text-neutral-900">{teamPlayers.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 uppercase tracking-wide">Trainer</p>
                          <p className="font-semibold text-neutral-900">{teamCoaches.length}</p>
                        </div>
                        {team.ageGroup && (
                          <div>
                            <p className="text-xs text-neutral-400 uppercase tracking-wide">Altersgruppe</p>
                            <p className="font-semibold text-neutral-900">{team.ageGroup}</p>
                          </div>
                        )}
                        {team.gender && (
                          <div>
                            <p className="text-xs text-neutral-400 uppercase tracking-wide">Geschlecht</p>
                            <p className="font-semibold text-neutral-900">{GENDER_LABELS[team.gender] ?? team.gender}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )
      )}

      {/* Members tab */}
      {tab === "members" && (
        allMembers.length === 0 ? (
          <Card className="text-center py-12">
            <Users className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-500">Noch keine Mitglieder</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Coaches */}
            {coaches.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Trainer & Betreuer ({coaches.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {coaches.map(entry => {
                    const person = getPersonDisplay(entry.personId);
                    const initials = getPersonInitials(person);
                    const roleLabel =
                      entry.role === "coach" ? "Cheftrainer" :
                      entry.role === "assistant_coach" ? "Co-Trainer" : "Torwarttrainer";
                    return (
                      <Card key={`${entry.personId}-${entry.teamId}`} padding="sm" className="flex items-center gap-3">
                        {person.avatarUrl ? (
                          <img src={person.avatarUrl} alt={person.fullName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-neutral-600 font-bold text-sm">{initials}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">{person.fullName}</p>
                          <p className="text-xs text-neutral-400 truncate">{roleLabel} · {entry.teamName}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Players */}
            {players.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Spieler ({players.length})
                </h3>
                <Card padding="none">
                  <div className="divide-y divide-neutral-100">
                    {players.map(entry => {
                      const person = getPersonDisplay(entry.personId);
                      const initials = getPersonInitials(person);
                      return (
                        <div key={`${entry.personId}-${entry.teamId}`} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
                          {person.avatarUrl ? (
                            <img src={person.avatarUrl} alt={person.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-teal-700 font-bold text-xs">{initials}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900">{person.fullName}</p>
                            <p className="text-xs text-neutral-400">{entry.teamName}</p>
                          </div>
                          {entry.jerseyNumber !== undefined && (
                            <span className="text-xs font-bold text-neutral-400">#{entry.jerseyNumber}</span>
                          )}
                          <Link
                            to={`/teams/${entry.teamId}/players/${entry.personId}`}
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium flex-shrink-0"
                          >
                            Profil
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

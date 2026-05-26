import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CalendarDays, ChevronRight, Archive, Play, Clock } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { mockTeams } from "../data/mockTeams";
import { mockDepartments } from "../data/mockDepartments";
import { getSeasonsByTeam, type Season, type SeasonStatus } from "../data/mockSeasons";

const STATUS_CFG: Record<SeasonStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  active:   { label: "Aktiv",      dot: "bg-teal-500",    text: "text-teal-700",    bg: "bg-teal-50",     border: "border-teal-200"   },
  planned:  { label: "Geplant",    dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200"  },
  archived: { label: "Archiviert", dot: "bg-neutral-300", text: "text-neutral-500", bg: "bg-neutral-100", border: "border-neutral-200" },
};

function StatusBadge({ status }: { status: SeasonStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function SeasonRow({ season, onAction }: { season: Season; onAction: (s: Season, action: string) => void }) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-neutral-50 group transition-colors">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-4 h-4 text-neutral-300 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-neutral-800">{season.label}</p>
          <p className="text-xs text-neutral-400">{fmt(season.startDate)} – {fmt(season.endDate)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={season.status} />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {season.status === "planned" && (
            <button
              onClick={() => onAction(season, "activate")}
              title="Aktivieren"
              className="p-1.5 rounded-md hover:bg-teal-50 text-teal-600 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          {season.status === "active" && (
            <button
              onClick={() => onAction(season, "archive")}
              title="Archivieren"
              className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface TeamWithSeasons {
  teamId: string;
  teamName: string;
  departmentId: string;
  seasons: Season[];
}

export function ClubSeasons() {
  const navigate = useNavigate();
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [teamSeasonMap, setTeamSeasonMap] = useState<Record<string, Season[]>>(() => {
    const map: Record<string, Season[]> = {};
    mockTeams.forEach(t => { map[t.id] = getSeasonsByTeam(t.id); });
    return map;
  });

  const departments = useMemo(() =>
    mockDepartments.filter(d => d.kind === "sport" && d.isActive),
    []
  );

  // Build a lookup: departmentId → department name (handles dept1/dept2/dept3 gaps)
  const deptNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    mockDepartments.forEach(d => { map[d.id] = d.name; });
    // Fallbacks for legacy dept IDs used in mockTeams
    map["dept1"] = "Fußball";
    map["dept2"] = "Handball";
    map["dept3"] = "Volleyball";
    return map;
  }, []);

  // Group sport teams by department
  const grouped = useMemo(() => {
    const sportTeams = mockTeams.filter(t => t.isActive);
    const byDept: Record<string, TeamWithSeasons[]> = {};
    sportTeams.forEach(t => {
      if (!byDept[t.departmentId]) byDept[t.departmentId] = [];
      byDept[t.departmentId].push({
        teamId: t.id,
        teamName: t.name,
        departmentId: t.departmentId,
        seasons: teamSeasonMap[t.id] ?? [],
      });
    });
    return byDept;
  }, [teamSeasonMap]);

  const filteredDepts = deptFilter === "all"
    ? Object.keys(grouped)
    : [deptFilter];

  // Simulate status change (prototype only — no real persistence)
  const handleAction = (teamId: string, season: Season, action: string) => {
    setTeamSeasonMap(prev => {
      const updated = (prev[teamId] ?? []).map(s => {
        if (s.id !== season.id) {
          // Deactivate others when activating one
          if (action === "activate" && s.status === "active") {
            return { ...s, status: "archived" as SeasonStatus, isActive: false };
          }
          return s;
        }
        if (action === "activate") return { ...s, status: "active" as SeasonStatus, isActive: true };
        if (action === "archive")  return { ...s, status: "archived" as SeasonStatus, isActive: false };
        return s;
      });
      return { ...prev, [teamId]: updated };
    });
  };

  const totalActive = Object.values(teamSeasonMap)
    .flat()
    .filter(s => s.status === "active").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Saisonverwaltung</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {mockTeams.filter(t => t.isActive).length} Teams · {totalActive} aktive Saisons
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          Neue Saison
        </Button>
      </div>

      {/* Department filter */}
      <div className="flex gap-1 border-b border-neutral-200">
        <button
          onClick={() => setDeptFilter("all")}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            deptFilter === "all" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Alle
          {deptFilter === "all" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />}
        </button>
        {departments.map(d => (
          <button
            key={d.id}
            onClick={() => setDeptFilter(d.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              deptFilter === d.id ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {d.name}
            {deptFilter === d.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Teams grouped by department */}
      {filteredDepts.map(deptId => {
        const teams = grouped[deptId];
        if (!teams || teams.length === 0) return null;
        const deptName = deptNameMap[deptId] ?? deptId;

        return (
          <div key={deptId}>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              {deptName}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {teams.map(({ teamId, teamName, seasons }) => {
                const activeSeason = seasons.find(s => s.status === "active");
                const plannedCount = seasons.filter(s => s.status === "planned").length;

                return (
                  <Card key={teamId} padding="md">
                    {/* Team header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-teal-700 font-bold text-xs">
                            {teamName.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{teamName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {activeSeason
                              ? <StatusBadge status="active" />
                              : <span className="text-xs text-neutral-400">Keine aktive Saison</span>
                            }
                            {plannedCount > 0 && (
                              <span className="flex items-center gap-1 text-xs text-amber-600">
                                <Clock className="w-3 h-3" /> {plannedCount} geplant
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/teams/${teamId}/settings`)}
                        className="flex items-center gap-1 text-xs text-neutral-400 hover:text-teal-600 transition-colors"
                      >
                        Team <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Season list */}
                    <div className="border-t border-neutral-100 pt-2 space-y-0.5">
                      {seasons
                        .sort((a, b) => b.startDate.localeCompare(a.startDate))
                        .map(s => (
                          <SeasonRow
                            key={s.id}
                            season={s}
                            onAction={(season, action) => handleAction(teamId, season, action)}
                          />
                        ))
                      }
                    </div>

                    {/* Add season link */}
                    <button className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-xs text-neutral-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-dashed border-neutral-200 hover:border-teal-300">
                      <Plus className="w-3.5 h-3.5" /> Saison hinzufügen
                    </button>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

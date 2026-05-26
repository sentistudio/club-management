import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, MoreVertical, ChevronDown } from "lucide-react";
import { Card, Button, Select } from "../components/ui";
import { mockTeams } from "../data/mockTeams";
import { mockDepartments } from "../data/mockDepartments";
import { getRosterByTeam } from "../data/mockTeamRoster";
import { getActiveSeasonForTeam } from "../data/mockSeasons";

type ViewMode = "grid" | "list";
type GenderFilter = "all" | "m" | "w" | "mixed";

// Fallback names for legacy dept IDs not in mockDepartments
const DEPT_NAME_FALLBACK: Record<string, string> = {
  dept1: "Fußball",
  dept2: "Handball",
  dept3: "Volleyball",
};

function getDeptName(deptId: string): string {
  const dept = mockDepartments.find(d => d.id === deptId);
  return dept?.name ?? DEPT_NAME_FALLBACK[deptId] ?? deptId;
}

const DEPT_COLORS: Record<string, string> = {
  dept_football: "bg-green-100 text-green-700",
  dept1:         "bg-green-100 text-green-700",
  dept_volleyball: "bg-blue-100 text-blue-700",
  dept3:         "bg-blue-100 text-blue-700",
  dept_fitness:  "bg-orange-100 text-orange-700",
  dept2:         "bg-purple-100 text-purple-700",
};

function deptColor(deptId: string) {
  return DEPT_COLORS[deptId] ?? "bg-neutral-100 text-neutral-600";
}

export function Teams() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [ageClassFilter, setAgeClassFilter] = useState("");
  const [sortBy] = useState("name");

  const teamsWithDetails = useMemo(() => {
    return mockTeams.map(team => {
      const department = mockDepartments.find(d => d.id === team.departmentId);
      const deptName = getDeptName(team.departmentId ?? "");
      const roster = getRosterByTeam(team.id, getActiveSeasonForTeam(team.id).id);
      const playerCount = roster.filter(r => r.role === "player").length;
      const coachCount = roster.filter(r => r.role !== "player").length;
      return { ...team, department, deptName, playerCount, coachCount };
    });
  }, []);

  // Unique departments that actually have active teams
  const activeDepts = useMemo(() => {
    const seen = new Map<string, string>();
    mockTeams
      .filter(t => t.isActive)
      .forEach(t => {
        const id = t.departmentId ?? "";
        if (id && !seen.has(id)) seen.set(id, getDeptName(id));
      });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  const filteredTeams = useMemo(() => {
    return teamsWithDetails
      .filter(t => t.isActive)
      .filter(t => deptFilter === "all" || (t.departmentId ?? "") === deptFilter)
      .filter(t => genderFilter === "all" || t.gender === genderFilter)
      .filter(t => !ageClassFilter || t.ageGroup === ageClassFilter)
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "players") return b.playerCount - a.playerCount;
        return 0;
      });
  }, [teamsWithDetails, deptFilter, genderFilter, ageClassFilter, sortBy]);

  const ageGroups = useMemo(() => {
    const groups = new Set(mockTeams.map(t => t.ageGroup).filter(Boolean));
    return Array.from(groups).sort();
  }, []);

  const ageClassOptions = ageGroups.map(ag => ({ value: ag || "", label: ag || "" }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Mannschaften</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{filteredTeams.length} Teams</p>
        </div>
      </div>

      {/* Department filter */}
      <div className="flex gap-1 border-b border-neutral-200">
        <button
          onClick={() => setDeptFilter("all")}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            deptFilter === "all" ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Alle Abteilungen
          {deptFilter === "all" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />}
        </button>
        {activeDepts.map(({ id, name }) => (
          <button
            key={id}
            onClick={() => setDeptFilter(id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              deptFilter === id ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {name}
            {deptFilter === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />}
          </button>
        ))}
      </div>

      {/* Secondary filters row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex gap-1">
          {[
            { value: "all", label: "Alle" },
            { value: "m", label: "Männlich" },
            { value: "w", label: "Weiblich" }
          ].map((tabOpt) => (
            <button
              key={tabOpt.value}
              onClick={() => setGenderFilter(tabOpt.value as GenderFilter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                genderFilter === tabOpt.value
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              }`}
            >
              {tabOpt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              options={ageClassOptions}
              value={ageClassFilter}
              onChange={(e) => setAgeClassFilter(e.target.value)}
              placeholder="Altersklasse wählen"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500">
            <span>Sortieren:</span>
            <button className="flex items-center gap-1 font-medium text-neutral-700 hover:text-neutral-900">
              Alphabetisch (A-Z)
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {filteredTeams.map((team) => (
          <Card
            key={team.id}
            hover
            className="group cursor-pointer"
            padding="none"
            onClick={() => navigate(`/teams/${team.id}/dashboard`)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">cb</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900 line-clamp-1">{team.name}</h3>
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${deptColor(team.departmentId ?? "")}`}>
                      {team.deptName}
                    </span>
                  </div>
                </div>
                <button
                  className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 rounded-lg transition-all flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Spieler</p>
                  <p className="text-lg font-semibold text-neutral-900 mt-0.5">{team.playerCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Trainer</p>
                  <p className="text-lg font-semibold text-neutral-900 mt-0.5">{team.coachCount}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Altersklasse</p>
                  <p className="text-base font-medium text-neutral-900 mt-0.5">
                    {team.ageGroup || "Nicht definiert"}
                    {team.gender && (
                      <span className="text-neutral-500">
                        {" / "}
                        {team.gender === "m" ? "Männlich" : team.gender === "w" ? "Weiblich" : "Mixed"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚽</span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Keine Teams gefunden</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Es wurden keine Teams gefunden, die den aktuellen Filterkriterien entsprechen.
          </p>
          <Button variant="primary">Team hinzufügen</Button>
        </Card>
      )}
    </div>
  );
}

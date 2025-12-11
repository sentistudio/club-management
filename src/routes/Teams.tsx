import { useMemo, useState } from "react";
import { LayoutGrid, List, MoreVertical, ChevronDown } from "lucide-react";
import { Card, Button, Select } from "../components/ui";
import { mockTeams } from "../data/mockTeams";
import { mockTeamRoles } from "../data/mockMemberships";
import { mockDepartments } from "../data/mockDepartments";

type ViewMode = "grid" | "list";
type GenderFilter = "all" | "m" | "w" | "mixed";

export function Teams() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [ageClassFilter, setAgeClassFilter] = useState("");
  const [sortBy] = useState("name");

  const teamsWithDetails = useMemo(() => {
    return mockTeams.map(team => {
      const department = mockDepartments.find(d => d.id === team.departmentId);
      const roles = mockTeamRoles.filter(r => r.teamId === team.id);
      const playerCount = roles.filter(r => r.roleKey === "player").length;
      
      // Generate a mock team ID
      const teamIdNum = parseInt(team.id.replace(/\D/g, '')) * 1000 + 4000;
      
      return { 
        ...team, 
        department, 
        playerCount,
        teamId: teamIdNum
      };
    });
  }, []);

  const filteredTeams = useMemo(() => {
    return teamsWithDetails
      .filter(t => genderFilter === "all" || t.gender === genderFilter)
      .filter(t => !ageClassFilter || t.ageGroup === ageClassFilter)
      .filter(t => t.isActive)
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "players") return b.playerCount - a.playerCount;
        return 0;
      });
  }, [teamsWithDetails, genderFilter, ageClassFilter, sortBy]);

  // Get unique age groups for filter
  const ageGroups = useMemo(() => {
    const groups = new Set(mockTeams.map(t => t.ageGroup).filter(Boolean));
    return Array.from(groups).sort();
  }, []);

  const ageClassOptions = ageGroups.map(ag => ({ 
    value: ag || "", 
    label: ag || "" 
  }));

  return (
    <div className="space-y-5">
      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Gender Tabs */}
        <div className="flex gap-1 border-b border-neutral-200 lg:border-0">
          {[
            { value: "all", label: "Alle" },
            { value: "m", label: "Männlich" },
            { value: "w", label: "Weiblich" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setGenderFilter(tab.value as GenderFilter)}
              className={`
                relative px-4 py-2.5 text-sm font-medium transition-colors
                ${genderFilter === tab.value 
                  ? "text-neutral-900" 
                  : "text-neutral-500 hover:text-neutral-700"
                }
              `}
            >
              {tab.label}
              {genderFilter === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Age Class Filter */}
          <div className="w-48">
            <Select
              options={ageClassOptions}
              value={ageClassFilter}
              onChange={(e) => setAgeClassFilter(e.target.value)}
              placeholder="Altersklasse wählen"
            />
          </div>

          {/* Sort */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500">
            <span>Sortieren:</span>
            <button className="flex items-center gap-1 font-medium text-neutral-700 hover:text-neutral-900">
              Alphabetisch (A-Z)
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${
                viewMode === "grid" 
                  ? "bg-neutral-100 text-neutral-900" 
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${
                viewMode === "list" 
                  ? "bg-neutral-100 text-neutral-900" 
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className={`
        grid gap-4
        ${viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
        }
      `}>
        {filteredTeams.map((team) => (
          <Card 
            key={team.id}
            hover
            className="group"
            padding="none"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">cb</span>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 line-clamp-2">
                    {team.name}
                  </h3>
                </div>
                <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-neutral-100 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Spieler</p>
                  <p className="text-lg font-semibold text-neutral-900 mt-0.5">{team.playerCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Team ID</p>
                  <p className="text-lg font-semibold text-neutral-900 mt-0.5">{team.teamId}</p>
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

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚽</span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Keine Teams gefunden</h3>
          <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
            Es wurden keine Teams gefunden, die den aktuellen Filterkriterien entsprechen.
          </p>
          <Button variant="primary">
            Team hinzufügen
          </Button>
        </Card>
      )}
    </div>
  );
}

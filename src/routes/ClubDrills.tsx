import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock, Users, Library } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useRole } from "../contexts";
import {
  getClubDrills,
  getDrillsForTeam,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  type DrillCategory,
} from "../data/mockDrills";
import { mockTeams } from "../data/mockTeams";

type CategoryFilter = "all" | DrillCategory;
type TeamFilter = "club" | string; // "club" = only isClubDrill, teamId = that team's drills

const CATEGORY_COLORS: Record<DrillCategory, string> = {
  warmup: "bg-amber-100 text-amber-700",
  technical: "bg-blue-100 text-blue-700",
  tactical: "bg-purple-100 text-purple-700",
  fitness: "bg-red-100 text-red-600",
};

const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-600",
};

export function ClubDrills() {
  const { activeRole } = useRole();
  const isAdmin = activeRole === "admin";

  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("club");

  const drills =
    teamFilter === "club"
      ? getClubDrills()
      : getDrillsForTeam(teamFilter);

  const filtered =
    catFilter === "all" ? drills : drills.filter(d => d.category === catFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Übungsbibliothek</h1>
          <p className="text-neutral-500 mt-1">
            {getClubDrills().length} vereinsweite Übungen · {mockTeams.length} Teams
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Übung erstellen
          </Button>
        )}
      </div>

      {/* Team / scope filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTeamFilter("club")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            teamFilter === "club"
              ? "bg-teal-600 text-white"
              : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
          }`}
        >
          <Library className="w-3.5 h-3.5" />
          Vereinsbibliothek
        </button>
        {mockTeams.filter(t => t.isActive).map(team => (
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

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap">
        {([
          { value: "all" as CategoryFilter, label: "Alle Kategorien" },
          ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({
            value: k as CategoryFilter,
            label: v,
          })),
        ]).map(f => (
          <button
            key={f.value}
            onClick={() => setCatFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              catFilter === f.value
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Card padding="md">
          <p className="text-sm text-neutral-400 text-center py-12">
            Keine Übungen gefunden
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(drill => {
            const teamLink = drill.teamId
              ? `/teams/${drill.teamId}/activities/${drill.id}`
              : null;
            return (
              <Card key={drill.id} padding="none" hover className="flex flex-col h-full">
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[drill.category]}`}>
                        {CATEGORY_LABELS[drill.category]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[drill.difficulty]}`}>
                        {DIFFICULTY_LABELS[drill.difficulty]}
                      </span>
                    </div>
                    {drill.isClubDrill ? (
                      <span className="text-xs text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded font-medium flex-shrink-0">Verein</span>
                    ) : (
                      <span className="text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded flex-shrink-0">Team</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{drill.title}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{drill.description}</p>
                </div>
                <div className="px-4 pb-3 flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {drill.duration} Min.
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> min. {drill.minPlayers}
                  </span>
                  {teamLink && (
                    <Link
                      to={teamLink}
                      className="ml-auto text-teal-600 hover:text-teal-700 font-medium"
                      onClick={e => e.stopPropagation()}
                    >
                      Im Team →
                    </Link>
                  )}
                </div>
                {drill.tags.length > 0 && (
                  <div className="px-4 pb-3 flex flex-wrap gap-1">
                    {drill.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

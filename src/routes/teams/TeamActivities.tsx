import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Clock, Users, BookOpen, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useTeamVisibility } from "../../contexts/TeamVisibilityContext";
import { useRole } from "../../contexts";
import { getDrillsForTeam, CATEGORY_LABELS, DIFFICULTY_LABELS, type DrillCategory } from "../../data/mockDrills";
import { getTrainingPackagesByTeam } from "../../data/mockTrainingPackages";

type Tab = "drills" | "packages";
type CategoryFilter = "all" | DrillCategory;

const CATEGORY_COLORS: Record<DrillCategory, string> = {
  warmup: "bg-amber-100 text-amber-700",
  technical: "bg-blue-100 text-blue-700",
  tactical: "bg-purple-100 text-purple-700",
  fitness: "bg-red-100 text-red-600"
};

const DIFFICULTY_COLORS = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-600"
};

export function TeamActivities() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const { settings: vis } = useTeamVisibility();

  const [tab, setTab] = useState<Tab>("drills");
  const [catFilter, setCatFilter] = useState<CategoryFilter>("all");

  const allDrills = getDrillsForTeam(teamId!);
  const packages = getTrainingPackagesByTeam(teamId!, currentSeason.id);

  const filteredDrills = catFilter === "all"
    ? allDrills
    : allDrills.filter(d => d.category === catFilter);

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Übungen & Trainingseinheiten</h2>
          <p className="text-sm text-neutral-500">
            {allDrills.length} Übungen · {packages.length} Pakete
          </p>
        </div>
        {isCoachOrAdmin && (
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            {tab === "drills" ? "Übung erstellen" : "Paket erstellen"}
          </Button>
        )}
      </div>

      {/* Visibility disclaimer */}
      {isCoachOrAdmin && !vis.uebungenVisible && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <EyeOff className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>Dieser Bereich ist für Spieler <strong>nicht sichtbar</strong>. <Link to="../settings" className="underline font-medium hover:text-amber-900">In Einstellungen aktivieren →</Link></span>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-neutral-200">
        {([
          { value: "drills" as Tab, label: "Übungen", icon: "🏃" },
          { value: "packages" as Tab, label: "Trainingspakete", icon: "📋" }
        ]).map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.value
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Drills tab */}
      {tab === "drills" && (
        <>
          {/* Category filter */}
          <div className="flex gap-1 flex-wrap">
            {([
              { value: "all" as CategoryFilter, label: "Alle" },
              ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k as CategoryFilter, label: v }))
            ]).map(f => (
              <button
                key={f.value}
                onClick={() => setCatFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  catFilter === f.value
                    ? "bg-teal-600 text-white"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Drills grid */}
          {filteredDrills.length === 0 ? (
            <Card padding="md">
              <p className="text-sm text-neutral-400 text-center py-8">Keine Übungen gefunden</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDrills.map(drill => (
                <Link key={drill.id} to={`/teams/${teamId}/activities/${drill.id}`}>
                  <Card padding="none" hover className="flex flex-col h-full">
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
                        {!drill.isClubDrill && (
                          <span className="text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">Team</span>
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
                        {drill.maxPlayers ? `–${drill.maxPlayers}` : "+"}
                      </span>
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
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Packages tab */}
      {tab === "packages" && (
        <div className="space-y-3">
          {packages.length === 0 ? (
            <Card padding="md">
              <p className="text-sm text-neutral-400 text-center py-8">Keine Trainingspakete vorhanden</p>
            </Card>
          ) : (
            packages.map(pkg => (
              <Card key={pkg.id} padding="md" hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-neutral-900">{pkg.title}</h3>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-3">{pkg.description}</p>
                    {/* Drill list */}
                    <div className="space-y-1">
                      {pkg.items.map((item, i) => {
                        const drill = getDrillsForTeam(teamId!).find(d => d.id === item.drillId);
                        return (
                          <div key={item.drillId} className="flex items-center gap-2 text-xs text-neutral-600">
                            <span className="w-4 h-4 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center font-medium text-[10px]">
                              {i + 1}
                            </span>
                            <span className="flex-1 truncate">{drill?.title ?? item.drillId}</span>
                            <span className="text-neutral-400 flex-shrink-0">
                              {item.durationOverride ?? drill?.duration ?? "?"} Min.
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-2">
                    <div className="flex items-center gap-1 text-xs text-neutral-500 justify-end">
                      <Clock className="w-3 h-3" />
                      {pkg.totalDuration} Min.
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 justify-end">
                      <BookOpen className="w-3 h-3" />
                      {pkg.items.length} Übungen
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {pkg.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

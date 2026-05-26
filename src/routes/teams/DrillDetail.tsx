import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, Play } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { getDrillsForTeam, CATEGORY_LABELS, DIFFICULTY_LABELS, type DrillCategory } from "../../data/mockDrills";
import { mockTrainingPackages } from "../../data/mockTrainingPackages";

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

export function DrillDetail() {
  const { teamId, drillId } = useParams<{ teamId: string; drillId: string }>();

  const allDrills = getDrillsForTeam(teamId!);
  const drill = allDrills.find(d => d.id === drillId);

  const usedInPackages = mockTrainingPackages.filter(pkg =>
    pkg.items.some(item => item.drillId === drillId)
  );

  if (!drill) {
    return (
      <div className="p-6">
        <p className="text-neutral-400">Übung nicht gefunden.</p>
        <Link to={`/teams/${teamId}/activities`} className="text-teal-600 text-sm mt-2 inline-block">
          ← Zurück zu Übungen
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link
        to={`/teams/${teamId}/activities`}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zu Übungen
      </Link>

      <Card padding="md">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <div className="flex gap-2 flex-wrap mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[drill.category]}`}>
                {CATEGORY_LABELS[drill.category]}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[drill.difficulty]}`}>
                {DIFFICULTY_LABELS[drill.difficulty]}
              </span>
              {!drill.isClubDrill && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">Team-exklusiv</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-neutral-900">{drill.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-neutral-400" />
            {drill.duration} Minuten
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-neutral-400" />
            {drill.minPlayers}{drill.maxPlayers ? `–${drill.maxPlayers}` : "+"} Spieler
          </div>
        </div>

        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{drill.description}</p>

        {drill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {drill.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Video */}
      {drill.mediaUrl && (
        <Card padding="md">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
            <Play className="w-4 h-4" /> Video
          </h2>
          <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
            <video src={drill.mediaUrl} controls className="w-full h-full object-cover" />
          </div>
        </Card>
      )}

      {/* Used in packages */}
      {usedInPackages.length > 0 && (
        <Card padding="md">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3">Verwendet in Paketen</h2>
          <div className="space-y-2">
            {usedInPackages.map(pkg => {
              const item = pkg.items.find(i => i.drillId === drillId);
              return (
                <div key={pkg.id} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{pkg.title}</p>
                    <p className="text-xs text-neutral-400">
                      Position {pkg.items.findIndex(i => i.drillId === drillId) + 1} · {item?.durationOverride ?? drill.duration} Min.
                    </p>
                  </div>
                  <Link
                    to={`/teams/${teamId}/activities`}
                    className="text-xs text-teal-600 hover:text-teal-700"
                  >
                    Ansehen →
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

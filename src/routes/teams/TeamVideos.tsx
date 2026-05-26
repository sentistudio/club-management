import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Upload, Play, Clock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useRole } from "../../contexts";
import { getVideosByTeam, formatDuration, VIDEO_TYPE_LABELS, type VideoType } from "../../data/mockVideos";

type TypeFilter = "all" | VideoType;

const TYPE_COLORS: Record<VideoType, string> = {
  match: "bg-emerald-100 text-emerald-700",
  training: "bg-blue-100 text-blue-700",
  highlight: "bg-amber-100 text-amber-700"
};

export function TeamVideos() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const videos = getVideosByTeam(teamId!, currentSeason.id);
  const filtered = typeFilter === "all" ? videos : videos.filter(v => v.type === typeFilter);

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Videos</h2>
          <p className="text-sm text-neutral-500">{videos.length} Videos</p>
        </div>
        {isCoachOrAdmin && (
          <Button variant="primary" size="sm" icon={<Upload className="w-4 h-4" />}>
            Video hochladen
          </Button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex gap-1 flex-wrap">
        {([
          { value: "all" as TypeFilter, label: "Alle" },
          ...Object.entries(VIDEO_TYPE_LABELS).map(([k, v]) => ({ value: k as TypeFilter, label: v }))
        ]).map(f => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === f.value
                ? "bg-teal-600 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8">
            <Play className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">Keine Videos vorhanden</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(video => (
            <Link key={video.id} to={`/teams/${teamId}/videos/${video.id}`}>
              <Card padding="none" hover className="overflow-hidden flex flex-col">
                <div className="relative aspect-video bg-neutral-900">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div className="p-3 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[video.type]}`}>
                      {VIDEO_TYPE_LABELS[video.type]}
                    </span>
                    {video.sequences.length > 0 && (
                      <span className="text-xs text-neutral-400">
                        {video.sequences.length} Szenen
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
                    <Clock className="w-3 h-3" />
                    {new Date(video.uploadedAt).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

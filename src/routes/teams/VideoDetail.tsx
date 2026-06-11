import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Clock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { getVideosByTeam, formatDuration, VIDEO_TYPE_LABELS, type VideoType } from "../../data/mockVideos";

const TYPE_COLORS: Record<VideoType, string> = {
  match: "bg-emerald-100 text-emerald-700",
  training: "bg-blue-100 text-blue-700",
  highlight: "bg-amber-100 text-amber-700"
};

export function VideoDetail() {
  const { teamId, videoId } = useParams<{ teamId: string; videoId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSeq, setActiveSeq] = useState<string | null>(null);

  const videos = getVideosByTeam(teamId!, currentSeason.id);
  const video = videos.find(v => v.id === videoId);

  if (!video) {
    return (
      <div className="p-6">
        <p className="text-neutral-400">Video nicht gefunden.</p>
        <Link to={`/teams/${teamId}/videos`} className="text-teal-600 text-sm mt-2 inline-block">
          ← Zurück zu Videos
        </Link>
      </div>
    );
  }

  function jumpTo(seconds: number, seqId: string) {
    setActiveSeq(seqId);
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link
        to={`/teams/${teamId}/videos`}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zu Videos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video + info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video bg-neutral-900 rounded-[10px] overflow-hidden">
            <video
              ref={videoRef}
              src={video.videoUrl}
              controls
              poster={video.thumbnailUrl}
              className="w-full h-full object-contain"
            />
          </div>

          <Card padding="md">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[video.type]}`}>
                    {VIDEO_TYPE_LABELS[video.type]}
                  </span>
                </div>
                <h1 className="text-lg font-bold text-neutral-900">{video.title}</h1>
                {video.description && (
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{video.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(video.duration)}
                  </span>
                  <span>
                    {new Date(video.uploadedAt).toLocaleDateString("de-DE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
                {video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {video.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sequences sidebar */}
        <div className="space-y-4">
          {video.sequences.length > 0 ? (
            <Card padding="md">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">
                Szenen ({video.sequences.length})
              </h2>
              <div className="space-y-2">
                {video.sequences.map(seq => (
                  <button
                    key={seq.id}
                    onClick={() => jumpTo(seq.startTime, seq.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeSeq === seq.id
                        ? "bg-teal-50 border border-teal-200"
                        : "bg-neutral-50 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        activeSeq === seq.id ? "bg-teal-600" : "bg-neutral-200"
                      }`}>
                        <Play className={`w-3 h-3 ml-0.5 ${activeSeq === seq.id ? "text-white" : "text-neutral-500"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-snug ${
                          activeSeq === seq.id ? "text-teal-700" : "text-neutral-800"
                        }`}>
                          {seq.title}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                          {formatDuration(seq.startTime)} – {formatDuration(seq.endTime)}
                        </p>
                        {seq.note && (
                          <p className="text-xs text-neutral-500 mt-1 italic leading-relaxed line-clamp-2">
                            {seq.note}
                          </p>
                        )}
                        {seq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {seq.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <Card padding="md">
              <h2 className="text-sm font-semibold text-neutral-900 mb-2">Szenen</h2>
              <p className="text-xs text-neutral-400">Keine Szenen markiert.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

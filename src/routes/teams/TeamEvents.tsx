import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, Plus, MapPin, Clock, ChevronRight } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useRole } from "../../contexts";
import { getTeamEventsByTeam, type TeamEvent } from "../../data/mockTeamEvents";

type EventFilter = "all" | "training" | "match";

const TYPE_CONFIG = {
  training: { label: "Training", emoji: "🏃", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  match: { label: "Spiel", emoji: "⚽", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  general: { label: "Termin", emoji: "📅", bg: "bg-neutral-100", text: "text-neutral-600", border: "border-neutral-200" }
};

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
}

function EventCard({ event, teamId }: { event: TeamEvent; teamId: string }) {
  const cfg = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.general;
  const confirmed = event.attendanceList.filter(a => a.status === "confirmed").length;
  const declined = event.attendanceList.filter(a => a.status === "declined").length;
  const pending = event.attendanceList.filter(a => a.status === "pending").length;
  const total = event.attendanceList.length;

  const isCompleted = event.status === "completed";
  const hasScore = event.type === "match" && isCompleted && event.homeScore !== undefined;
  const isWin = hasScore && (event.isHome
    ? (event.homeScore ?? 0) > (event.awayScore ?? 0)
    : (event.awayScore ?? 0) > (event.homeScore ?? 0));
  const isDraw = hasScore && event.homeScore === event.awayScore;
  const score = hasScore
    ? event.isHome
      ? `${event.homeScore}:${event.awayScore}`
      : `${event.awayScore}:${event.homeScore}`
    : null;

  return (
    <Link to={`/teams/${teamId}/events/${event.id}`}>
      <Card padding="none" hover className={`flex items-stretch overflow-hidden ${isCompleted ? "opacity-75" : ""}`}>
        {/* Left accent */}
        <div className={`w-1.5 flex-shrink-0 ${cfg.bg.replace("bg-", "bg-").replace("100", "500")}`} />

        <div className="flex-1 p-4 flex items-center gap-4">
          {/* Type icon */}
          <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 text-lg`}>
            {cfg.emoji}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-neutral-900">
                {event.type === "match" ? `vs. ${event.opponent}` : event.title}
              </p>
              {event.type === "match" && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>
                  {event.isHome ? "Heim" : "Auswärts"} · {event.matchType === "cup" ? "Pokal" : event.matchType === "friendly" ? "Freundschaft" : "Liga"}
                </span>
              )}
              {isCompleted && score && (
                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                  isDraw ? "bg-neutral-100 text-neutral-600" :
                  isWin ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"
                }`}>
                  {score}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="w-3 h-3" />
                {event.startTime} – {event.endTime}
              </div>
              {event.location && (
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </div>
              )}
            </div>
          </div>

          {/* Attendance summary */}
          {total > 0 && (
            <div className="text-right flex-shrink-0 hidden sm:block">
              <p className="text-xs font-medium text-neutral-700">{confirmed}/{total}</p>
              <p className="text-xs text-neutral-400">
                {declined > 0 && `${declined} ab`}
                {pending > 0 && ` ${pending} offen`}
              </p>
            </div>
          )}

          <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
        </div>
      </Card>
    </Link>
  );
}

export function TeamEvents() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";

  const [filter, setFilter] = useState<EventFilter>("all");
  const [showPast, setShowPast] = useState(false);

  const allEvents = getTeamEventsByTeam(teamId!, currentSeason.id)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const today = new Date().toISOString().split("T")[0];

  const filtered = allEvents.filter(e => {
    const isPast = e.date < today || e.status === "completed";
    if (!showPast && isPast) return false;
    if (showPast && !isPast) return false;
    if (filter !== "all" && e.type !== filter) return false;
    return true;
  });

  // Group by date
  const grouped: Record<string, TeamEvent[]> = {};
  for (const event of filtered) {
    if (!grouped[event.date]) grouped[event.date] = [];
    grouped[event.date].push(event);
  }
  const sortedDates = Object.keys(grouped).sort((a, b) =>
    showPast ? b.localeCompare(a) : a.localeCompare(b)
  );

  const upcomingCount = allEvents.filter(e => e.date >= today && e.status === "scheduled").length;
  const pastCount = allEvents.filter(e => e.date < today || e.status === "completed").length;

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Termine</h2>
          <p className="text-sm text-neutral-500">
            {upcomingCount} bevorstehend · {pastCount} abgeschlossen
          </p>
        </div>
        {isCoachOrAdmin && (
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Termin erstellen
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Type filter */}
        <div className="flex gap-1">
          {(["all", "training", "match"] as EventFilter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-teal-300"
              }`}
            >
              {f === "all" ? "Alle" : f === "training" ? "Training" : "Spiele"}
            </button>
          ))}
        </div>

        {/* Past/upcoming toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setShowPast(false)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !showPast
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
          >
            Bevorstehend
          </button>
          <button
            onClick={() => setShowPast(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showPast
                ? "bg-neutral-900 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
          >
            Vergangen
          </button>
        </div>
      </div>

      {/* Grouped events */}
      {sortedDates.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8">
            <CalendarDays className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">Keine Termine vorhanden</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                {formatDateLong(date)}
              </p>
              <div className="space-y-2">
                {grouped[date].map(event => (
                  <EventCard key={event.id} event={event} teamId={teamId!} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

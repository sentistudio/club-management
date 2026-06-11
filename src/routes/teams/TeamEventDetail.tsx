import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, Eye, Calendar, Trophy } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useRole } from "../../contexts";
import { getTeamEventsByTeam, type AttendanceStatus } from "../../data/mockTeamEvents";
import { mockLineups, FORMATION_SLOTS } from "../../data/mockLineups";
import { mockTrainingPackages } from "../../data/mockTrainingPackages";
import { getPersonDisplay, getPersonInitials } from "../../data/personHelpers";

const TYPE_CONFIG = {
  training: { label: "Training", emoji: "🏃", bg: "bg-blue-100", text: "text-blue-700" },
  match: { label: "Spiel", emoji: "⚽", bg: "bg-emerald-100", text: "text-emerald-700" },
  general: { label: "Termin", emoji: "📅", bg: "bg-neutral-100", text: "text-neutral-600" }
};

const VISIBILITY_CONFIG = {
  team_only: { label: "Nur Team", icon: "🔒", desc: "Nur Teammitglieder sehen diesen Termin" },
  club_visible: { label: "Verein sichtbar", icon: "🏛️", desc: "Clubadmin sieht diesen Termin in der Übersicht" },
  public: { label: "Öffentlich", icon: "🌐", desc: "Erscheint im Kalender aller Mitglieder" }
};

const STATUS_CONFIG = {
  confirmed: { label: "Zugesagt", text: "text-emerald-600", dot: "bg-emerald-500" },
  declined: { label: "Abgesagt", text: "text-red-500", dot: "bg-red-400" },
  pending: { label: "Offen", text: "text-neutral-400", dot: "bg-neutral-300" },
  absent: { label: "Gefehlt", text: "text-amber-600", dot: "bg-amber-400" }
};

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function MiniPitch({ lineupId }: { lineupId: string }) {
  const lineup = mockLineups.find(l => l.id === lineupId);
  if (!lineup) return null;
  const slots = FORMATION_SLOTS[lineup.formation] ?? [];

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium text-neutral-700">{lineup.name}</p>
        <p className="text-xs text-neutral-400">{lineup.formation}</p>
      </div>
      <div className="relative w-full aspect-[2/3] bg-emerald-700 rounded-lg overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 border-t border-emerald-500/40" />
          <div className="absolute inset-[10%] border border-emerald-500/30 rounded" />
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[35%] h-[15%] border border-emerald-500/30" />
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[35%] h-[15%] border border-emerald-500/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] aspect-square rounded-full border border-emerald-500/30" />
        </div>
        {slots.map(slotDef => {
          const pos = lineup.positions.find(p => p.slot === slotDef.slot);
          const person = pos?.personId ? getPersonDisplay(pos.personId) : null;
          return (
            <div
              key={slotDef.slot}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
              style={{ left: `${slotDef.x}%`, top: `${slotDef.y}%` }}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shadow ${
                pos?.personId ? "bg-white text-neutral-800" : "bg-emerald-600/50 text-emerald-200"
              }`}>
                {pos?.jerseyNumber ?? slotDef.label}
              </div>
              {person && (
                <span className="text-[8px] text-white/80 font-medium leading-none max-w-[40px] text-center truncate">
                  {person.lastName}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {lineup.notes && (
        <p className="text-xs text-neutral-500 italic leading-relaxed">{lineup.notes}</p>
      )}
    </div>
  );
}

export function TeamEventDetail() {
  const { teamId, eventId } = useParams<{ teamId: string; eventId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole, user: activeUser } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";

  const events = getTeamEventsByTeam(teamId!, currentSeason.id);
  const event = events.find(e => e.id === eventId);

  const [myStatus, setMyStatus] = useState<AttendanceStatus>(() => {
    if (!event || !activeUser) return "pending";
    const entry = event.attendanceList.find(a => a.personId === activeUser.id);
    return entry?.status ?? "pending";
  });

  if (!event) {
    return (
      <div className="p-6">
        <p className="text-neutral-400">Termin nicht gefunden.</p>
        <Link to={`/teams/${teamId}/events`} className="text-teal-600 text-sm mt-2 inline-block">
          ← Zurück zu Terminen
        </Link>
      </div>
    );
  }

  const cfg = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.general;
  const visCfg = VISIBILITY_CONFIG[event.visibility];

  const confirmed = event.attendanceList.filter(a => a.status === "confirmed").length;
  const declined = event.attendanceList.filter(a => a.status === "declined").length;
  const pending = event.attendanceList.filter(a => a.status === "pending").length;
  const total = event.attendanceList.length;

  const isCompleted = event.status === "completed";
  const hasScore = event.type === "match" && isCompleted && event.homeScore !== undefined;
  const score = hasScore
    ? event.isHome ? `${event.homeScore}:${event.awayScore}` : `${event.awayScore}:${event.homeScore}`
    : null;
  const isWin = hasScore && (event.isHome
    ? (event.homeScore ?? 0) > (event.awayScore ?? 0)
    : (event.awayScore ?? 0) > (event.homeScore ?? 0));
  const isDraw = hasScore && event.homeScore === event.awayScore;

  const linkedLineup = event.linkedLineupId ? mockLineups.find(l => l.id === event.linkedLineupId) : null;
  const linkedPackage = event.linkedTrainingPackageId
    ? mockTrainingPackages.find(p => p.id === event.linkedTrainingPackageId)
    : null;

  const grouped = {
    confirmed: event.attendanceList.filter(a => a.status === "confirmed"),
    declined: event.attendanceList.filter(a => a.status === "declined"),
    pending: event.attendanceList.filter(a => a.status === "pending"),
    absent: event.attendanceList.filter(a => a.status === "absent"),
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link
        to={`/teams/${teamId}/events`}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zu Terminen
      </Link>

      {/* Header */}
      <Card padding="md">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-[10px] ${cfg.bg} flex items-center justify-center flex-shrink-0 text-2xl`}>
            {cfg.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
              </span>
              {event.type === "match" && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                  {event.isHome ? "Heim" : "Auswärts"} ·{" "}
                  {event.matchType === "cup" ? "Pokal" : event.matchType === "friendly" ? "Freundschaft" : "Liga"}
                </span>
              )}
              {isCompleted && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">Abgeschlossen</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-neutral-900">
              {event.type === "match" ? `vs. ${event.opponent}` : event.title}
            </h1>
            {score && (
              <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-lg font-bold ${
                isDraw ? "bg-neutral-100 text-neutral-600" :
                isWin ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"
              }`}>
                <Trophy className="w-4 h-4" />
                {score}
                <span className="text-sm font-medium ml-1">
                  {isDraw ? "Unentschieden" : isWin ? "Sieg" : "Niederlage"}
                </span>
              </div>
            )}
          </div>
          {isCoachOrAdmin && (
            <Button variant="secondary" size="sm">Bearbeiten</Button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-600 border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-neutral-400" />
            {formatDateLong(event.date)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-neutral-400" />
            {event.startTime} – {event.endTime}
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-neutral-400" />
              {event.location}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-neutral-400" />
            {visCfg.icon} {visCfg.label}
          </div>
        </div>
        {event.description && (
          <p className="mt-4 text-sm text-neutral-600">{event.description}</p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: RSVP + attendance */}
        <div className="lg:col-span-2 space-y-4">
          {/* RSVP for members */}
          {!isCoachOrAdmin && !isCompleted && (
            <Card padding="md">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Deine Rückmeldung</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setMyStatus("confirmed")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    myStatus === "confirmed"
                      ? "bg-emerald-500 text-white"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:border-emerald-300"
                  }`}
                >
                  ✅ Dabei
                </button>
                <button
                  onClick={() => setMyStatus("declined")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    myStatus === "declined"
                      ? "bg-red-500 text-white"
                      : "bg-white border border-neutral-200 text-neutral-600 hover:border-red-300"
                  }`}
                >
                  ❌ Absagen
                </button>
              </div>
            </Card>
          )}

          {/* Attendance list */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Anwesenheit
              </h2>
              <div className="flex gap-3 text-xs">
                <span className="text-emerald-600 font-medium">{confirmed} ✅</span>
                <span className="text-red-500 font-medium">{declined} ❌</span>
                <span className="text-neutral-400">{pending} offen</span>
              </div>
            </div>
            {total > 0 && (
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-5 flex">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${confirmed / total * 100}%` }} />
                <div className="bg-red-400 h-full transition-all" style={{ width: `${declined / total * 100}%` }} />
              </div>
            )}
            <div className="space-y-4">
              {(["confirmed", "declined", "pending", "absent"] as const).map(status => {
                const entries = grouped[status];
                if (entries.length === 0) return null;
                const sc = STATUS_CONFIG[status];
                return (
                  <div key={status}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${sc.text}`}>
                      {sc.label} ({entries.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {entries.map(entry => {
                        const person = getPersonDisplay(entry.personId);
                        const initials = getPersonInitials(person);
                        return (
                          <div key={entry.personId} className="flex items-center gap-2.5 py-1">
                            <div className="relative flex-shrink-0">
                              {person.avatarUrl ? (
                                <img src={person.avatarUrl} alt={person.fullName} className="w-7 h-7 rounded-full object-cover" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-neutral-500">{initials}</span>
                                </div>
                              )}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${sc.dot}`} />
                            </div>
                            <span className="text-sm text-neutral-700 truncate">{person.fullName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Linked lineup */}
          {linkedLineup && (
            <Card padding="md">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-neutral-900">Aufstellung</h2>
                <Link to={`/teams/${teamId}/lineups`} className="text-xs text-teal-600 hover:text-teal-700">
                  Alle →
                </Link>
              </div>
              <MiniPitch lineupId={linkedLineup.id} />
            </Card>
          )}

          {/* Linked training package */}
          {linkedPackage && (
            <Card padding="md">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Trainingspaket</h2>
              <p className="text-sm font-medium text-neutral-800">{linkedPackage.title}</p>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{linkedPackage.description}</p>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mt-3">
                <span>⏱ {linkedPackage.totalDuration} Min.</span>
                <span>📋 {linkedPackage.items.length} Übungen</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {linkedPackage.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={`/teams/${teamId}/activities`} className="text-xs text-teal-600 hover:text-teal-700 block mt-3">
                Zum Trainingsplan →
              </Link>
            </Card>
          )}

          {/* Visibility (coach/admin) */}
          {isCoachOrAdmin && (
            <Card padding="md">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Sichtbarkeit</h2>
              <div className="space-y-1.5">
                {(["team_only", "club_visible", "public"] as const).map(v => {
                  const vc = VISIBILITY_CONFIG[v];
                  const isActive = event.visibility === v;
                  return (
                    <div
                      key={v}
                      className={`flex items-start gap-2 p-2 rounded-lg ${
                        isActive ? "bg-teal-50 border border-teal-200" : "border border-transparent hover:bg-neutral-50 cursor-pointer"
                      }`}
                    >
                      <span>{vc.icon}</span>
                      <div>
                        <p className={`text-xs font-medium ${isActive ? "text-teal-700" : "text-neutral-600"}`}>
                          {vc.label}
                        </p>
                        <p className="text-xs text-neutral-400">{vc.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

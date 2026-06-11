import { X, Calendar, Clock, MapPin, Users, Globe, Lock, Building2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { TeamEvent } from "../../data/mockTeamEvents";
import { mockTeams } from "../../data/mockTeams";

interface Props {
  event: TeamEvent;
  onClose: () => void;
}

const TYPE_LABEL: Record<TeamEvent["type"], string> = {
  training: "Training",
  match: "Spiel",
  general: "Allgemein",
};

const TYPE_COLOR: Record<TeamEvent["type"], string> = {
  training: "bg-blue-100 text-blue-800",
  match: "bg-emerald-100 text-emerald-800",
  general: "bg-amber-100 text-amber-800",
};

const MATCH_TYPE_LABEL: Record<string, string> = {
  league: "Liga",
  cup: "Pokal",
  friendly: "Freundschaftsspiel",
  tournament: "Turnier",
};

const VISIBILITY_LABEL: Record<TeamEvent["visibility"], string> = {
  team_only: "Nur Team",
  club_visible: "Verein sichtbar",
  public: "Öffentlich",
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export function TeamEventDetailDrawer({ event, onClose }: Props) {
  const team = mockTeams.find(t => t.id === event.teamId);
  const confirmed = event.attendanceList.filter(a => a.status === "confirmed").length;
  const declined = event.attendanceList.filter(a => a.status === "declined").length;
  const pending = event.attendanceList.filter(a => a.status === "pending").length;
  const total = event.attendanceList.length;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${TYPE_COLOR[event.type]}`}>
                {TYPE_LABEL[event.type]}
              </span>
              <h2 className="text-lg font-bold text-slate-800 truncate">
                {event.type === "match" ? `vs. ${event.opponent}` : event.title}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg flex-shrink-0 ml-2">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Team badge */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-medium">{team?.name ?? event.teamId}</span>
            </div>

            {/* Date & Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{fmt(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{event.startTime} – {event.endTime}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Match details */}
            {event.type === "match" && (
              <div className="bg-emerald-50 rounded-[10px] p-4 space-y-2">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Spieldetails</p>
                <div className="flex items-center gap-3 flex-wrap text-sm text-slate-700">
                  {event.matchType && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                      {MATCH_TYPE_LABEL[event.matchType] ?? event.matchType}
                    </span>
                  )}
                  {event.isHome !== undefined && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {event.isHome ? "Heimspiel" : "Auswärtsspiel"}
                    </span>
                  )}
                </div>
                {event.homeScore !== undefined && event.awayScore !== undefined && (
                  <p className="text-2xl font-bold text-slate-800">
                    {event.isHome ? event.homeScore : event.awayScore}
                    <span className="text-slate-400 mx-2">:</span>
                    {event.isHome ? event.awayScore : event.homeScore}
                  </p>
                )}
              </div>
            )}

            {/* Visibility */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {event.visibility === "public"
                ? <Globe className="w-4 h-4 text-slate-400" />
                : <Lock className="w-4 h-4 text-slate-400" />}
              <span>{VISIBILITY_LABEL[event.visibility]}</span>
            </div>

            {/* Attendance */}
            {total > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Anwesenheit</span>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="text-emerald-600 font-medium">{confirmed} zugesagt</span>
                  <span className="text-red-500 font-medium">{declined} abgesagt</span>
                  <span className="text-slate-400">{pending} offen</span>
                </div>
                {total > 0 && (
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                    <div className="bg-emerald-500 h-2" style={{ width: `${(confirmed / total) * 100}%` }} />
                    <div className="bg-red-400 h-2" style={{ width: `${(declined / total) * 100}%` }} />
                  </div>
                )}
              </div>
            )}

            {event.description && (
              <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Schließen
            </button>
            <Link
              to={`/teams/${event.teamId}/events/${event.id}`}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-teal-700 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Im Team öffnen
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

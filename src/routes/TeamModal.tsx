import { useState } from "react";
import {
  X, LayoutDashboard, Users, CalendarDays, ListChecks, Layers,
  Search, UserPlus, Plus, MapPin, Clock, ChevronDown, ChevronUp,
  Calendar, Shield, TrendingUp, Trophy
} from "lucide-react";
import type { Team } from "../types/domain";
import { mockDepartments } from "../data/mockDepartments";
import { getRosterByTeam, getPositionLabel, type PlayerPosition } from "../data/mockTeamRoster";
import { getPersonDisplay, getPersonInitials } from "../data/personHelpers";
import { getTeamEventsByTeam, getUpcomingTeamEvents, getPastMatches, type TeamEvent } from "../data/mockTeamEvents";
import { getTaskGroupsByTeam, getTasksByGroup, type TaskStatus } from "../data/mockTaskGroups";
import { mockLineups, FORMATION_SLOTS, FORMATION_LABELS } from "../data/mockLineups";
import { useRole } from "../contexts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "overview" | "players" | "events" | "tasks" | "lineups";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview",  label: "Übersicht",   icon: LayoutDashboard },
  { id: "players",   label: "Spieler",     icon: Users },
  { id: "events",    label: "Termine",     icon: CalendarDays },
  { id: "tasks",     label: "Aufgaben",    icon: ListChecks },
  { id: "lineups",   label: "Aufstellung", icon: Layers },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

const POSITION_COLORS: Record<string, string> = {
  goalkeeper: "bg-yellow-100 text-yellow-700",
  defender:   "bg-blue-100 text-blue-700",
  midfielder: "bg-teal-100 text-teal-700",
  forward:    "bg-orange-100 text-orange-700",
};

const EVENT_TYPE_CONFIG = {
  training: { label: "Training", emoji: "🏃", bg: "bg-blue-100", text: "text-blue-700" },
  match:    { label: "Spiel",    emoji: "⚽", bg: "bg-emerald-100", text: "text-emerald-700" },
  general:  { label: "Termin",   emoji: "📅", bg: "bg-neutral-100", text: "text-neutral-600" },
};

const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; dot: string }> = {
  todo:        { label: "Offen",         bg: "bg-neutral-50",  text: "text-neutral-600", dot: "bg-neutral-300" },
  in_progress: { label: "In Bearbeitung",bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-400" },
  done:        { label: "Erledigt",      bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-500" },
};

function formatDateLong(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long"
  });
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ teamId, seasonId }: { teamId: string; seasonId: string }) {
  const roster  = getRosterByTeam(teamId, seasonId);
  const players = roster.filter(r => r.role === "player");
  const coaches = roster.filter(r => r.role !== "player");
  const upcoming = getUpcomingTeamEvents(teamId, seasonId, 4);
  const recent   = getPastMatches(teamId, seasonId, 3);

  const attendanceAvg = players.length > 0
    ? Math.round(players.reduce((s, p) =>
        s + (p.attendanceStats.invited > 0 ? p.attendanceStats.attended / p.attendanceStats.invited : 0), 0
      ) / players.length * 100)
    : 0;

  const lastMatch = recent[0] ?? null;
  const lastScore = lastMatch
    ? (lastMatch.isHome ? `${lastMatch.homeScore}:${lastMatch.awayScore}` : `${lastMatch.awayScore}:${lastMatch.homeScore}`)
    : null;

  return (
    <div className="space-y-6">
      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{players.length}</p>
          <p className="text-xs text-slate-500">Spieler</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{coaches.length}</p>
          <p className="text-xs text-slate-500">Trainer</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-slate-400 mx-auto mb-1" />
          <p className={`text-2xl font-bold ${attendanceAvg >= 75 ? "text-emerald-600" : "text-amber-600"}`}>{attendanceAvg}%</p>
          <p className="text-xs text-slate-500">Anwesenheit</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <Trophy className="w-4 h-4 text-slate-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-slate-800">{lastScore ?? "–"}</p>
          <p className="text-xs text-slate-500">Letztes Spiel</p>
        </div>
      </div>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Nächste Termine</p>
          <div className="space-y-2">
            {upcoming.map(evt => {
              const cfg = EVENT_TYPE_CONFIG[evt.type] ?? EVENT_TYPE_CONFIG.general;
              const confirmed = evt.attendanceList.filter(a => a.status === "confirmed").length;
              const total = evt.attendanceList.length;
              return (
                <div key={evt.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 text-lg`}>
                    {cfg.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {evt.type === "match" ? `vs. ${evt.opponent}` : evt.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(evt.date + "T00:00:00").toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}
                      {" · "}{evt.startTime}
                    </p>
                  </div>
                  {total > 0 && (
                    <p className="text-xs text-slate-500 flex-shrink-0">{confirmed}/{total}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent matches */}
      {recent.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Letzte Spiele</p>
          <div className="space-y-2">
            {recent.map(match => {
              const isWin = match.isHome
                ? (match.homeScore ?? 0) > (match.awayScore ?? 0)
                : (match.awayScore ?? 0) > (match.homeScore ?? 0);
              const isDraw = match.homeScore === match.awayScore;
              const score = match.isHome
                ? `${match.homeScore ?? "–"}:${match.awayScore ?? "–"}`
                : `${match.awayScore ?? "–"}:${match.homeScore ?? "–"}`;
              return (
                <div key={match.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    isDraw ? "bg-neutral-100 text-neutral-600" :
                    isWin  ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}>{score}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">vs. {match.opponent}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(match.date + "T00:00:00").toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}
                      {" · "}{match.isHome ? "Heim" : "Auswärts"}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    isDraw ? "bg-neutral-100 text-neutral-600" :
                    isWin  ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}>{isDraw ? "U" : isWin ? "S" : "N"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Spieler tab ──────────────────────────────────────────────────────────────

function PlayersTab({ teamId, seasonId }: { teamId: string; seasonId: string }) {
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState<"all" | PlayerPosition>("all");

  const roster  = getRosterByTeam(teamId, seasonId);
  const players = roster.filter(r => r.role === "player");
  const coaches = roster.filter(r => r.role !== "player");

  const filtered = players.filter(entry => {
    const person = getPersonDisplay(entry.personId);
    const matchesSearch =
      !search ||
      person.fullName.toLowerCase().includes(search.toLowerCase()) ||
      String(entry.jerseyNumber ?? "").includes(search);
    const matchesPos = posFilter === "all" || entry.position === posFilter;
    return matchesSearch && matchesPos;
  });

  const attendanceRate = (entry: typeof players[0]) =>
    entry.attendanceStats.invited > 0
      ? Math.round(entry.attendanceStats.attended / entry.attendanceStats.invited * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{players.length} Spieler · {coaches.length} Trainer</p>
        {isCoachOrAdmin && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors">
            <UserPlus className="w-3.5 h-3.5" /> Spieler hinzufügen
          </button>
        )}
      </div>

      {/* Search + position filter */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Name oder Trikotnummer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941]/30"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[
            { value: "all",        label: "Alle" },
            { value: "goalkeeper", label: "Torwart" },
            { value: "defender",   label: "Verteidiger" },
            { value: "midfielder", label: "Mittelfeld" },
            { value: "forward",    label: "Stürmer" },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setPosFilter(f.value as typeof posFilter)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                posFilter === f.value
                  ? "bg-[#004941] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Player cards grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Keine Spieler gefunden</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {filtered.map(entry => {
            const person   = getPersonDisplay(entry.personId);
            const initials = getPersonInitials(person);
            const rate     = attendanceRate(entry);
            const posColor = POSITION_COLORS[entry.position ?? ""] ?? "bg-neutral-100 text-neutral-600";
            return (
              <div key={entry.id} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-2 text-center hover:border-slate-300 transition-colors">
                {/* Avatar */}
                <div className="relative mt-1">
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.fullName} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-700 font-bold text-base">{initials}</span>
                    </div>
                  )}
                  {entry.jerseyNumber !== undefined && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {entry.jerseyNumber}
                    </div>
                  )}
                  {entry.isCaptain && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center" title="Kapitän">
                      <Shield className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <p className="text-xs font-medium text-slate-800 truncate">{person.firstName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{person.lastName}</p>
                </div>
                {entry.position && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${posColor}`}>
                    {getPositionLabel(entry.position as PlayerPosition)}
                  </span>
                )}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-slate-400">Anwesenheit</span>
                    <span className={`text-[10px] font-medium ${rate >= 80 ? "text-emerald-600" : rate >= 60 ? "text-amber-600" : "text-red-500"}`}>{rate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${rate >= 80 ? "bg-emerald-500" : rate >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coaching staff */}
      {coaches.length > 0 && (
        <div className="pt-2">
          <p className="text-sm font-semibold text-slate-700 mb-2">Trainer & Betreuer</p>
          <div className="flex flex-wrap gap-2">
            {coaches.map(entry => {
              const person   = getPersonDisplay(entry.personId);
              const initials = getPersonInitials(person);
              const roleLabel = entry.role === "coach" ? "Cheftrainer" : entry.role === "assistant_coach" ? "Co-Trainer" : "Torwarttrainer";
              return (
                <div key={entry.id} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2">
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.fullName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-600 font-bold text-xs">{initials}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{person.fullName}</p>
                    <p className="text-xs text-slate-500">{roleLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Termine tab ──────────────────────────────────────────────────────────────

function EventsTab({ teamId, seasonId }: { teamId: string; seasonId: string }) {
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const [filter, setFilter]     = useState<"all" | "training" | "match">("all");
  const [showPast, setShowPast] = useState(false);

  const today     = new Date().toISOString().split("T")[0];
  const allEvents = getTeamEventsByTeam(teamId, seasonId)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const filtered = allEvents.filter(e => {
    const isPast = e.date < today || e.status === "completed";
    if (!showPast && isPast) return false;
    if (showPast && !isPast) return false;
    if (filter !== "all" && e.type !== filter) return false;
    return true;
  });

  const grouped: Record<string, TeamEvent[]> = {};
  for (const evt of filtered) {
    (grouped[evt.date] ??= []).push(evt);
  }
  const sortedDates = Object.keys(grouped).sort((a, b) => showPast ? b.localeCompare(a) : a.localeCompare(b));

  const upcomingCount = allEvents.filter(e => e.date >= today && e.status === "scheduled").length;
  const pastCount     = allEvents.filter(e => e.date < today || e.status === "completed").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{upcomingCount} bevorstehend · {pastCount} abgeschlossen</p>
        {isCoachOrAdmin && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Termin erstellen
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1">
          {(["all", "training", "match"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-[#004941] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {f === "all" ? "Alle" : f === "training" ? "Training" : "Spiele"}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[{ v: false, l: "Bevorstehend" }, { v: true, l: "Vergangen" }].map(({ v, l }) => (
            <button key={l} onClick={() => setShowPast(v)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${showPast === v ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped events */}
      {sortedDates.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Keine Termine vorhanden</p>
      ) : (
        <div className="space-y-5">
          {sortedDates.map(date => (
            <div key={date}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                {formatDateLong(date)}
              </p>
              <div className="space-y-2">
                {grouped[date].map(evt => {
                  const cfg = EVENT_TYPE_CONFIG[evt.type] ?? EVENT_TYPE_CONFIG.general;
                  const confirmed = evt.attendanceList.filter(a => a.status === "confirmed").length;
                  const total     = evt.attendanceList.length;
                  const isCompleted = evt.status === "completed";
                  const hasScore = evt.type === "match" && isCompleted && evt.homeScore !== undefined;
                  const isWin = hasScore && (evt.isHome ? (evt.homeScore ?? 0) > (evt.awayScore ?? 0) : (evt.awayScore ?? 0) > (evt.homeScore ?? 0));
                  const isDraw = hasScore && evt.homeScore === evt.awayScore;
                  const score = hasScore ? (evt.isHome ? `${evt.homeScore}:${evt.awayScore}` : `${evt.awayScore}:${evt.homeScore}`) : null;
                  return (
                    <div key={evt.id} className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white ${isCompleted ? "opacity-70" : ""}`}>
                      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 text-lg`}>
                        {cfg.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {evt.type === "match" ? `vs. ${evt.opponent}` : evt.title}
                          </p>
                          {score && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isDraw ? "bg-neutral-100 text-neutral-600" : isWin ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-500"}`}>{score}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3 h-3" />{evt.startTime}–{evt.endTime}</span>
                          {evt.location && <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{evt.location}</span>}
                        </div>
                      </div>
                      {total > 0 && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-medium text-slate-700">{confirmed}/{total}</p>
                          <p className="text-[10px] text-slate-400">Zusagen</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Aufgaben tab ─────────────────────────────────────────────────────────────

function TaskKanban({ groupId }: { groupId: string }) {
  const tasks = getTasksByGroup(groupId);
  return (
    <div className="grid grid-cols-3 gap-2 mt-3">
      {(["todo", "in_progress", "done"] as TaskStatus[]).map(status => {
        const col      = TASK_STATUS_CONFIG[status];
        const colTasks = tasks.filter(t => t.status === status);
        return (
          <div key={status} className={`rounded-lg ${col.bg} p-2.5`}>
            <div className="flex items-center gap-1 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
              <p className={`text-[10px] font-semibold ${col.text}`}>{col.label}</p>
              <span className="ml-auto text-[10px] text-slate-400">{colTasks.length}</span>
            </div>
            <div className="space-y-1.5">
              {colTasks.map(task => (
                <div key={task.id} className="bg-white rounded-lg p-2 shadow-sm">
                  <p className={`text-[11px] font-medium leading-snug ${task.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {task.title}
                  </p>
                  {task.dueDate && task.status !== "done" && (
                    <p className="flex items-center gap-0.5 text-[10px] text-slate-400 mt-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(task.dueDate + "T00:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                    </p>
                  )}
                  {task.assignedTo.length > 0 && (
                    <div className="flex -space-x-1 mt-1.5">
                      {task.assignedTo.slice(0, 3).map(pid => {
                        const p = getPersonDisplay(pid);
                        const ini = getPersonInitials(p);
                        return p.avatarUrl ? (
                          <img key={pid} src={p.avatarUrl} alt={p.fullName} title={p.fullName} className="w-4 h-4 rounded-full border border-white object-cover" />
                        ) : (
                          <div key={pid} className="w-4 h-4 rounded-full border border-white bg-teal-100 flex items-center justify-center" title={p.fullName}>
                            <span className="text-[7px] font-bold text-teal-700">{ini}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              {colTasks.length === 0 && <p className="text-[10px] text-slate-300 text-center py-1.5">Keine</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskGroupRow({ group }: { group: ReturnType<typeof getTaskGroupsByTeam>[0] }) {
  const [expanded, setExpanded] = useState(true);
  const tasks    = getTasksByGroup(group.id);
  const done     = tasks.filter(t => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round(done / tasks.length * 100) : 0;
  const isPastDue = group.dueDate && group.dueDate < new Date().toISOString().split("T")[0];

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button className="w-full text-left p-4" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800">{group.title}</p>
            {group.description && <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>}
            <div className="flex items-center gap-3 mt-1.5">
              {group.dueDate && (
                <span className={`flex items-center gap-1 text-xs ${isPastDue ? "text-red-500" : "text-slate-400"}`}>
                  <Calendar className="w-3 h-3" />
                  {new Date(group.dueDate + "T00:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                </span>
              )}
              <span className="text-xs text-slate-400">{done}/{tasks.length} erledigt</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className={`text-sm font-bold ${progress === 100 ? "text-emerald-600" : progress > 50 ? "text-amber-600" : "text-slate-600"}`}>{progress}%</p>
              <div className="w-14 h-1.5 bg-slate-100 rounded-full mt-1">
                <div className={`h-1.5 rounded-full ${progress === 100 ? "bg-emerald-500" : progress > 50 ? "bg-amber-400" : "bg-slate-300"}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
      </button>
      {expanded && <div className="px-4 pb-4"><TaskKanban groupId={group.id} /></div>}
    </div>
  );
}

function TasksTab({ teamId, seasonId }: { teamId: string; seasonId: string }) {
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const groups = getTaskGroupsByTeam(teamId, seasonId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{groups.length} Gruppen</p>
        {isCoachOrAdmin && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Gruppe erstellen
          </button>
        )}
      </div>
      {groups.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Keine Aufgaben vorhanden</p>
      ) : (
        <div className="space-y-3">{groups.map(g => <TaskGroupRow key={g.id} group={g} />)}</div>
      )}
    </div>
  );
}

// ─── Aufstellung tab ──────────────────────────────────────────────────────────

function PitchPreview({ lineupId }: { lineupId: string }) {
  const lineup = mockLineups.find(l => l.id === lineupId);
  if (!lineup) return null;
  const slots = FORMATION_SLOTS[lineup.formation] ?? [];
  return (
    <div className="relative w-full aspect-[2/3] bg-emerald-700 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 border-t border-emerald-500/30" />
        <div className="absolute inset-[8%] border border-emerald-500/20 rounded" />
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[35%] h-[14%] border border-emerald-500/20" />
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[35%] h-[14%] border border-emerald-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] aspect-square rounded-full border border-emerald-500/20" />
      </div>
      {slots.map(slotDef => {
        const pos    = lineup.positions.find(p => p.slot === slotDef.slot);
        const person = pos?.personId ? getPersonDisplay(pos.personId) : null;
        return (
          <div key={slotDef.slot} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
            style={{ left: `${slotDef.x}%`, top: `${slotDef.y}%` }}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shadow ${pos?.personId ? "bg-white text-slate-800" : "bg-emerald-600/40 text-emerald-300"}`}>
              {pos?.jerseyNumber ?? slotDef.label}
            </div>
            {person && <span className="text-[7px] text-white/70 leading-none max-w-[36px] text-center truncate">{person.lastName}</span>}
          </div>
        );
      })}
    </div>
  );
}

function LineupsTab({ teamId, seasonId }: { teamId: string; seasonId: string }) {
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const lineups = mockLineups.filter(l => l.teamId === teamId && l.seasonId === seasonId);
  const events  = getTeamEventsByTeam(teamId, seasonId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{lineups.length} Aufstellungen</p>
        {isCoachOrAdmin && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Neue Aufstellung
          </button>
        )}
      </div>
      {lineups.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Keine Aufstellungen vorhanden</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {lineups.map(lineup => {
            const linkedMatch  = lineup.linkedMatchId ? events.find(e => e.id === lineup.linkedMatchId) : null;
            const filledCount  = lineup.positions.filter(p => p.personId).length;
            return (
              <div key={lineup.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors cursor-pointer">
                <div className="p-2.5 pb-0">
                  <PitchPreview lineupId={lineup.id} />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-800 truncate">{lineup.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{FORMATION_LABELS[lineup.formation]}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-slate-400">{filledCount}/{lineup.positions.length} besetzt</span>
                    {linkedMatch && <span className="text-xs text-emerald-600 font-medium">⚽ vs. {linkedMatch.opponent}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Modal shell ─────────────────────────────────────────────────────────────

interface TeamModalProps {
  team: Team;
  seasonId: string;
  onClose: () => void;
}

export function TeamModal({ team, seasonId, onClose }: TeamModalProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const department = mockDepartments.find(d => d.id === team.departmentId);
  const genderLabel = team.gender === "m" ? "Herren" : team.gender === "w" ? "Damen" : "Mixed";

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-200">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Aktiv</span>
                {department && (
                  <>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm text-slate-500">{department.name}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{team.name}</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {genderLabel}{team.ageGroup ? ` · ${team.ageGroup}` : ""}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${
                  tab === t.id ? "text-[#004941] border-b-2 border-[#004941]" : "text-slate-500 hover:text-slate-700"
                }`}>
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === "overview"  && <OverviewTab  teamId={team.id} seasonId={seasonId} />}
            {tab === "players"   && <PlayersTab   teamId={team.id} seasonId={seasonId} />}
            {tab === "events"    && <EventsTab    teamId={team.id} seasonId={seasonId} />}
            {tab === "tasks"     && <TasksTab     teamId={team.id} seasonId={seasonId} />}
            {tab === "lineups"   && <LineupsTab   teamId={team.id} seasonId={seasonId} />}
          </div>

        </div>
      </div>
    </>
  );
}

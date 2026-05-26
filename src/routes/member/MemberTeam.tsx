import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, BookOpen, CheckSquare, Clock, MapPin, ChevronRight, Shield } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useRole } from "../../contexts";
import { mockTeams } from "../../data/mockTeams";
import { mockDepartments } from "../../data/mockDepartments";
import { getRosterByTeam, getCoachesByTeam } from "../../data/mockTeamRoster";
import { getTeamEventsByTeam } from "../../data/mockTeamEvents";
import { getArticlesByTeam } from "../../data/mockArticles";
import { getTasksForPerson } from "../../data/mockTaskGroups";
import { getPersonDisplay, getPersonInitials } from "../../data/personHelpers";
import { getActiveSeasonForTeam } from "../../data/mockSeasons";

type Tab = "overview" | "calendar" | "articles" | "tasks";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
}

const DEPT_COLORS: Record<string, string> = {
  dept_football:   "bg-green-100 text-green-700",
  dept_volleyball: "bg-blue-100 text-blue-700",
  dept_fitness:    "bg-orange-100 text-orange-700",
  dept_handball:   "bg-purple-100 text-purple-700",
};

export function MemberTeam() {
  const { user: activeUser } = useRole();
  const [tab, setTab] = useState<Tab>("overview");

  // Collect ALL teams this member is a player in
  const myTeams = mockTeams.flatMap(team => {
    const seasonId = getActiveSeasonForTeam(team.id).id;
    const roster = getRosterByTeam(team.id, seasonId);
    if (roster.some(r => r.personId === activeUser?.id && r.role === "player")) {
      return [{ teamId: team.id, team, seasonId }];
    }
    return [];
  });

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    myTeams.length > 0 ? myTeams[0].teamId : null
  );

  if (myTeams.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card padding="md">
          <div className="text-center py-8">
            <Shield className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-neutral-400">Du bist in dieser Saison keinem Team zugewiesen.</p>
          </div>
        </Card>
      </div>
    );
  }

  const active = myTeams.find(e => e.teamId === selectedTeamId) ?? myTeams[0];
  const { teamId, seasonId } = active;
  const today = new Date().toISOString().split("T")[0];

  const events = getTeamEventsByTeam(teamId, seasonId);
  const upcoming = events
    .filter(e => e.date >= today && e.status === "scheduled")
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const coaches = getCoachesByTeam(teamId, seasonId);
  const articles = getArticlesByTeam(teamId, seasonId, true);
  const myTasks = activeUser ? getTasksForPerson(activeUser.id) : [];

  const myAttendance = (() => {
    const roster = getRosterByTeam(teamId, seasonId);
    return roster.find(r => r.personId === activeUser?.id)?.attendanceStats;
  })();

  const attendanceRate = myAttendance && myAttendance.invited > 0
    ? Math.round(myAttendance.attended / myAttendance.invited * 100)
    : 0;

  const openTaskCount = myTasks.filter(t => t.status !== "done").length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Mein Team</h1>
        <p className="text-sm text-neutral-500">Mitgliederansicht</p>
      </div>

      {/* Team switcher — only shown when member belongs to multiple teams */}
      {myTeams.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {myTeams.map(entry => {
            const dept = mockDepartments.find(d => d.id === entry.team.departmentId);
            const colorClass = DEPT_COLORS[entry.team.departmentId ?? ""] ?? "bg-neutral-100 text-neutral-600";
            return (
              <button
                key={entry.teamId}
                onClick={() => { setSelectedTeamId(entry.teamId); setTab("overview"); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                  entry.teamId === selectedTeamId
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-[10px]">cb</span>
                </div>
                <div className="text-left">
                  <p className="leading-tight">{entry.team.name}</p>
                  {dept && (
                    <span className={`text-[10px] font-medium px-1.5 py-0 rounded-full ${colorClass}`}>
                      {dept.name}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {([
          { value: "overview" as Tab, label: "Übersicht" },
          { value: "calendar" as Tab, label: "Termine" },
          { value: "articles" as Tab, label: "Wissen" },
          { value: "tasks" as Tab, label: "Meine Aufgaben" },
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
            {t.label}
            {t.value === "tasks" && openTaskCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] inline-flex items-center justify-center">
                {openTaskCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card padding="md">
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Anwesenheit</p>
              <p className="text-2xl font-bold text-neutral-900">{attendanceRate}%</p>
              {myAttendance && (
                <p className="text-xs text-neutral-400 mt-1">
                  {myAttendance.attended}/{myAttendance.invited} Trainings
                </p>
              )}
            </Card>
            <Card padding="md">
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Nächster Termin</p>
              {upcoming[0] ? (
                <>
                  <p className="text-sm font-semibold text-neutral-900 leading-tight">
                    {upcoming[0].type === "match" ? `vs. ${upcoming[0].opponent}` : upcoming[0].title}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {formatDate(upcoming[0].date)} · {upcoming[0].startTime}
                  </p>
                </>
              ) : (
                <p className="text-sm text-neutral-400">Kein Termin</p>
              )}
            </Card>
          </div>

          {coaches.length > 0 && (
            <Card padding="md">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Trainer</h3>
              <div className="space-y-2">
                {coaches.map(entry => {
                  const person = getPersonDisplay(entry.personId);
                  const initials = getPersonInitials(person);
                  return (
                    <div key={entry.id} className="flex items-center gap-3">
                      {person.avatarUrl ? (
                        <img src={person.avatarUrl} alt={person.fullName} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center">
                          <span className="text-sm font-bold text-neutral-600">{initials}</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{person.fullName}</p>
                        <p className="text-xs text-neutral-400">
                          {entry.role === "coach" ? "Cheftrainer" : "Co-Trainer"}
                        </p>
                      </div>
                      {person.email && (
                        <a href={`mailto:${person.email}`} className="ml-auto text-xs text-teal-600 hover:text-teal-700">
                          Kontakt
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {upcoming.length > 0 && (
            <Card padding="md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-900">Nächste Termine</h3>
                <button onClick={() => setTab("calendar")} className="text-xs text-teal-600 hover:text-teal-700">
                  Alle →
                </button>
              </div>
              <div className="space-y-2">
                {upcoming.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      event.type === "match" ? "bg-emerald-100" : "bg-blue-100"
                    }`}>
                      {event.type === "match" ? "⚽" : "🏃"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {event.type === "match" ? `vs. ${event.opponent}` : event.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {formatDate(event.date)} · {event.startTime}</span>
                        {event.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {event.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Calendar tab */}
      {tab === "calendar" && (
        <div className="space-y-2">
          <p className="text-sm text-neutral-500">{upcoming.length} bevorstehende Termine</p>
          {upcoming.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">Keine Termine vorhanden</p>
              </div>
            </Card>
          ) : (
            upcoming.map(event => {
              const myEntry = event.attendanceList.find(a => a.personId === activeUser?.id);
              return (
                <Card key={event.id} padding="none" className="flex items-stretch overflow-hidden">
                  <div className={`w-1.5 flex-shrink-0 ${event.type === "match" ? "bg-emerald-400" : "bg-blue-400"}`} />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {event.type === "match" ? `vs. ${event.opponent}` : event.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(event.date)} · {event.startTime}–{event.endTime}</span>
                          {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>}
                        </div>
                      </div>
                      {myEntry && (
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                          myEntry.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                          myEntry.status === "declined" ? "bg-red-100 text-red-600" :
                          "bg-neutral-100 text-neutral-500"
                        }`}>
                          {myEntry.status === "confirmed" ? "✅ Zugesagt" :
                           myEntry.status === "declined" ? "❌ Abgesagt" : "⏳ Offen"}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Articles tab */}
      {tab === "articles" && (
        <div className="space-y-3">
          {articles.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">Keine Artikel vorhanden</p>
              </div>
            </Card>
          ) : (
            articles.map(article => (
              <Link key={article.id} to={`/teams/${teamId}/knowledge/${article.id}`}>
                <Card padding="md" hover>
                  <div className="flex items-start gap-3">
                    {article.coverImageUrl && (
                      <img src={article.coverImageUrl} alt={article.title} className="w-16 h-12 rounded object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 line-clamp-2">{article.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                        <Clock className="w-3 h-3" />
                        {article.readTimeMinutes} min
                        {article.publishedAt && (
                          <span>· {new Date(article.publishedAt).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-1" />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Tasks tab */}
      {tab === "tasks" && (
        <div className="space-y-3">
          {myTasks.length === 0 ? (
            <Card padding="md">
              <div className="text-center py-8">
                <CheckSquare className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">Keine Aufgaben zugewiesen</p>
              </div>
            </Card>
          ) : (
            myTasks.map(task => (
              <Card key={task.id} padding="md">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    task.status === "done" ? "bg-emerald-100 text-emerald-700" :
                    task.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                    "bg-neutral-100 text-neutral-600"
                  }`}>
                    {task.status === "done" ? "✅ Erledigt" : task.status === "in_progress" ? "🔄 In Bearbeitung" : "⏳ Offen"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Fällig: {new Date(task.dueDate + "T00:00:00").toLocaleDateString("de-DE")}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

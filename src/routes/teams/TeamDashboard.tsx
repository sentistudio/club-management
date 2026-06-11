import { useParams, Link } from "react-router-dom";
import { Users, CalendarDays, Trophy, TrendingUp, ChevronRight, Clock } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { getRosterByTeam } from "../../data/mockTeamRoster";
import { getUpcomingTeamEvents, getPastMatches, getLastMatchResult } from "../../data/mockTeamEvents";
import { getArticlesByTeam } from "../../data/mockArticles";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function TeamDashboard() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();

  const roster = getRosterByTeam(teamId!, currentSeason.id);
  const players = roster.filter(r => r.role === "player");
  const coaches = roster.filter(r => r.role === "coach" || r.role === "assistant_coach");
  const upcoming = getUpcomingTeamEvents(teamId!, currentSeason.id, 4);
  const lastMatch = getLastMatchResult(teamId!, currentSeason.id);
  const recentMatches = getPastMatches(teamId!, currentSeason.id, 3);
  const articles = getArticlesByTeam(teamId!, currentSeason.id, true).slice(0, 2);

  const attendanceAvg =
    players.length > 0
      ? Math.round(
          players.reduce((sum, p) => {
            const rate = p.attendanceStats.invited > 0
              ? p.attendanceStats.attended / p.attendanceStats.invited
              : 0;
            return sum + rate;
          }, 0) / players.length * 100
        )
      : 0;

  const lastResult = lastMatch
    ? lastMatch.isHome
      ? `${lastMatch.homeScore ?? "–"}:${lastMatch.awayScore ?? "–"} vs. ${lastMatch.opponent}`
      : `${lastMatch.awayScore ?? "–"}:${lastMatch.homeScore ?? "–"} vs. ${lastMatch.opponent}`
    : null;

  const lastResultColor = lastMatch
    ? (lastMatch.isHome
        ? (lastMatch.homeScore ?? 0) > (lastMatch.awayScore ?? 0)
        : (lastMatch.awayScore ?? 0) > (lastMatch.homeScore ?? 0))
      ? "text-emerald-600"
      : (lastMatch.isHome
          ? (lastMatch.homeScore ?? 0) < (lastMatch.awayScore ?? 0)
          : (lastMatch.awayScore ?? 0) < (lastMatch.homeScore ?? 0))
        ? "text-red-500"
        : "text-neutral-500"
    : "text-neutral-500";

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <Users className="w-4 h-4" />
            Spieler
          </div>
          <p className="text-3xl font-bold text-neutral-900">{players.length}</p>
          <p className="text-xs text-neutral-400">{coaches.length} Trainer</p>
        </Card>

        <Card padding="md" className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <CalendarDays className="w-4 h-4" />
            Nächster Termin
          </div>
          {upcoming[0] ? (
            <>
              <p className="text-sm font-semibold text-neutral-900 leading-tight">
                {upcoming[0].type === "match" ? `vs. ${upcoming[0].opponent}` : upcoming[0].title}
              </p>
              <p className="text-xs text-neutral-400">
                {formatDate(upcoming[0].date)} · {formatTime(upcoming[0].startTime)}
              </p>
            </>
          ) : (
            <p className="text-sm text-neutral-400">Kein Termin</p>
          )}
        </Card>

        <Card padding="md" className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <Trophy className="w-4 h-4" />
            Letztes Spiel
          </div>
          {lastResult ? (
            <>
              <p className={`text-sm font-bold ${lastResultColor}`}>
                {lastResult.split(" vs.")[0]}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                vs. {lastResult.split("vs. ")[1]}
              </p>
            </>
          ) : (
            <p className="text-sm text-neutral-400">Noch kein Spiel</p>
          )}
        </Card>

        <Card padding="md" className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium uppercase tracking-wide">
            <TrendingUp className="w-4 h-4" />
            Anwesenheit
          </div>
          <p className="text-3xl font-bold text-neutral-900">{attendanceAvg}%</p>
          <p className="text-xs text-neutral-400">Ø diese Saison</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Nächste Termine</h2>
            <Link
              to={`/teams/${teamId}/events`}
              className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Alle anzeigen <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <Card padding="md">
              <p className="text-sm text-neutral-400 text-center py-4">
                Keine bevorstehenden Termine
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {upcoming.map(event => {
                const confirmed = event.attendanceList.filter(a => a.status === "confirmed").length;
                const total = event.attendanceList.length;
                const isMatch = event.type === "match";
                return (
                  <Link key={event.id} to={`/teams/${teamId}/events/${event.id}`}>
                    <Card padding="none" hover className="flex items-center gap-4 p-4">
                      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 text-lg ${
                        isMatch ? "bg-emerald-100" : "bg-blue-100"
                      }`}>
                        {isMatch ? "⚽" : "🏃"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {isMatch ? `vs. ${event.opponent}` : event.title}
                          {isMatch && (
                            <span className="ml-2 text-xs text-neutral-400">
                              ({event.isHome ? "Heim" : "Auswärts"})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(event.date)} · {formatTime(event.startTime)}
                          {event.location ? ` · ${event.location}` : ""}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-medium text-neutral-700">{confirmed}/{total}</p>
                        <p className="text-xs text-neutral-400">Zusagen</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Recent match results */}
          {recentMatches.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-neutral-900 pt-2">Letzte Spiele</h2>
              <div className="space-y-2">
                {recentMatches.map(match => {
                  const isWin = match.isHome
                    ? (match.homeScore ?? 0) > (match.awayScore ?? 0)
                    : (match.awayScore ?? 0) > (match.homeScore ?? 0);
                  const isDraw = match.homeScore === match.awayScore;
                  const score = match.isHome
                    ? `${match.homeScore ?? "–"}:${match.awayScore ?? "–"}`
                    : `${match.awayScore ?? "–"}:${match.homeScore ?? "–"}`;

                  return (
                    <Link key={match.id} to={`/teams/${teamId}/events/${match.id}`}>
                      <Card padding="none" hover className="flex items-center gap-4 p-4">
                        <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                          isDraw ? "bg-neutral-100 text-neutral-600" :
                          isWin ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                        }`}>
                          {score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            vs. {match.opponent}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatDate(match.date)} · {match.isHome ? "Heim" : "Auswärts"}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isDraw ? "bg-neutral-100 text-neutral-600" :
                          isWin ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                        }`}>
                          {isDraw ? "U" : isWin ? "S" : "N"}
                        </span>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900">Schnellzugriff</h2>
          <Card padding="none">
            {[
              { label: "Spieler", count: players.length, path: "players", icon: "👥" },
              { label: "Aufgaben", path: "tasks", icon: "✅" },
              { label: "Aufstellung", path: "lineups", icon: "📋" }
            ].map((item, i, arr) => (
              <Link
                key={item.path}
                to={`/teams/${teamId}/${item.path}`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors ${
                  i < arr.length - 1 ? "border-b border-neutral-100" : ""
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex-1 text-sm text-neutral-700">{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </Link>
            ))}
          </Card>

          {articles.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-neutral-900">Neuigkeiten</h2>
                <Link
                  to={`/teams/${teamId}/knowledge`}
                  className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  Alle <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {articles.map(article => (
                  <Link key={article.id} to={`/teams/${teamId}/knowledge/${article.id}`}>
                    <Card padding="sm" hover>
                      <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <p className="text-xs text-neutral-400">
                          {article.readTimeMinutes} min Lesezeit
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

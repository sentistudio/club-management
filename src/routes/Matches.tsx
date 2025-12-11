import { useMemo, useState } from "react";
import { Plus, Trophy, Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { Card, Button, Select, Badge } from "../components/ui";
import { mockMatches, mockTrainingSessions } from "../data/mockDfbnet";
import { mockTeams } from "../data/mockTeams";
import type { MatchType, MatchStatus } from "../types/dfbnet";

const matchTypeConfig: Record<MatchType, { label: string; color: string }> = {
  league: { label: "Liga", color: "bg-emerald-100 text-emerald-700" },
  cup: { label: "Pokal", color: "bg-amber-100 text-amber-700" },
  friendly: { label: "Freundschaft", color: "bg-sky-100 text-sky-700" },
  tournament: { label: "Turnier", color: "bg-violet-100 text-violet-700" }
};

const matchStatusConfig: Record<MatchStatus, { label: string; variant: "success" | "warning" | "danger" | "neutral" | "info" }> = {
  scheduled: { label: "Geplant", variant: "info" },
  in_progress: { label: "Läuft", variant: "success" },
  completed: { label: "Beendet", variant: "neutral" },
  postponed: { label: "Verschoben", variant: "warning" },
  cancelled: { label: "Abgesagt", variant: "danger" }
};

export function Matches() {
  const [teamFilter, setTeamFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<MatchType | "">("");

  const matchesWithDetails = useMemo(() => {
    return mockMatches.map(match => {
      const team = mockTeams.find(t => t.id === match.teamId);
      return { ...match, team };
    });
  }, []);

  const filteredMatches = useMemo(() => {
    return matchesWithDetails
      .filter(m => !teamFilter || m.teamId === teamFilter)
      .filter(m => !typeFilter || m.matchType === typeFilter)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [matchesWithDetails, teamFilter, typeFilter]);

  const upcomingMatches = filteredMatches.filter(m => 
    new Date(m.scheduledAt) > new Date() && m.status !== "cancelled"
  ).reverse();
  
  const completedMatches = filteredMatches.filter(m => m.status === "completed");

  const trainingsWithDetails = useMemo(() => {
    return mockTrainingSessions.map(session => {
      const team = mockTeams.find(t => t.id === session.teamId);
      return { ...session, team };
    });
  }, []);

  const stats = useMemo(() => {
    const completed = mockMatches.filter(m => m.status === "completed");
    const wins = completed.filter(m => {
      if (m.homeScore === undefined || m.awayScore === undefined) return false;
      return m.isHome ? m.homeScore > m.awayScore : m.awayScore > m.homeScore;
    }).length;
    const draws = completed.filter(m => m.homeScore === m.awayScore).length;
    const losses = completed.filter(m => {
      if (m.homeScore === undefined || m.awayScore === undefined) return false;
      return m.isHome ? m.homeScore < m.awayScore : m.awayScore < m.homeScore;
    }).length;
    const goalsFor = completed.reduce((sum, m) => 
      sum + (m.isHome ? (m.homeScore || 0) : (m.awayScore || 0)), 0
    );
    const goalsAgainst = completed.reduce((sum, m) => 
      sum + (m.isHome ? (m.awayScore || 0) : (m.homeScore || 0)), 0
    );
    
    return { wins, draws, losses, goalsFor, goalsAgainst, upcoming: upcomingMatches.length };
  }, [upcomingMatches]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "short"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const teamOptions = mockTeams
    .filter(t => t.isActive)
    .map(t => ({ value: t.id, label: t.name }));
  
  const typeOptions = Object.entries(matchTypeConfig).map(([value, { label }]) => ({ value, label }));

  const renderMatchCard = (match: typeof matchesWithDetails[0]) => (
    <Card key={match.id} className="hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-center gap-4">
        {/* Match Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${matchTypeConfig[match.matchType].color}`}>
              {matchTypeConfig[match.matchType].label}
            </span>
            <Badge variant={matchStatusConfig[match.status].variant}>
              {matchStatusConfig[match.status].label}
            </Badge>
            {match.competition && (
              <span className="text-xs text-slate-500">{match.competition}</span>
            )}
          </div>
          
          {/* Teams */}
          <div className="flex items-center gap-4">
            <div className={`flex-1 text-right ${match.isHome ? "font-semibold" : ""}`}>
              <p className={`${match.isHome ? "text-slate-800" : "text-slate-600"}`}>
                {match.homeTeam}
              </p>
            </div>
            
            {/* Score */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg min-w-[80px] justify-center">
              {match.status === "completed" ? (
                <span className="text-lg font-bold text-slate-800">
                  {match.homeScore} : {match.awayScore}
                </span>
              ) : (
                <span className="text-sm text-slate-500">
                  {formatTime(match.scheduledAt)}
                </span>
              )}
            </div>
            
            <div className={`flex-1 ${!match.isHome ? "font-semibold" : ""}`}>
              <p className={`${!match.isHome ? "text-slate-800" : "text-slate-600"}`}>
                {match.awayTeam}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(match.scheduledAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{match.location}</span>
            </div>
            {match.matchday && (
              <span>Spieltag {match.matchday}</span>
            )}
          </div>
        </div>
        
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Spielbetrieb</h1>
          <p className="text-slate-500 mt-1">Spiele, Ergebnisse und Trainingseinheiten</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neues Spiel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{stats.upcoming}</p>
            <p className="text-sm text-slate-500">Anstehend</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{stats.wins}</p>
            <p className="text-sm text-slate-500">Siege</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.draws}</p>
            <p className="text-sm text-slate-500">Unentschieden</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-rose-600">{stats.losses}</p>
            <p className="text-sm text-slate-500">Niederlagen</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-sky-600">{stats.goalsFor}</p>
            <p className="text-sm text-slate-500">Tore</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-600">{stats.goalsAgainst}</p>
            <p className="text-sm text-slate-500">Gegentore</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select
              options={teamOptions}
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              placeholder="Alle Teams"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as MatchType | "")}
              placeholder="Alle Typen"
            />
          </div>
        </div>
      </Card>

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Nächste Spiele
          </h2>
          <div className="space-y-4">
            {upcomingMatches.map(match => renderMatchCard(match))}
          </div>
        </div>
      )}

      {/* Completed Matches */}
      {completedMatches.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Ergebnisse</h2>
          <div className="space-y-4">
            {completedMatches.map(match => renderMatchCard(match))}
          </div>
        </div>
      )}

      {/* Training Sessions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          Nächste Trainingseinheiten
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingsWithDetails.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="info">{session.team?.name}</Badge>
                <Badge variant={session.status === "scheduled" ? "success" : "neutral"}>
                  {session.status === "scheduled" ? "Geplant" : session.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-800">{session.title}</h3>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(session.startsAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(session.startsAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4" />
                <span>{session.location}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


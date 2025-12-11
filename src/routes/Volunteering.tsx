import { useMemo } from "react";
import { Plus, Heart, Clock, Users, CheckCircle, Calendar, Award } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  Button, 
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty
} from "../components/ui";
import { mockVolunteerTasks, mockVolunteerLogs } from "../data/mockDfbnet";
import { mockPersons } from "../data/mockPersons";
import type { VolunteerTaskStatus } from "../types/dfbnet";

const taskStatusConfig: Record<VolunteerTaskStatus, { label: string; variant: "success" | "warning" | "info" | "neutral" | "danger" }> = {
  open: { label: "Offen", variant: "warning" },
  assigned: { label: "Besetzt", variant: "info" },
  in_progress: { label: "Läuft", variant: "success" },
  completed: { label: "Abgeschlossen", variant: "neutral" },
  cancelled: { label: "Abgesagt", variant: "danger" }
};

export function Volunteering() {
  const tasksWithDetails = useMemo(() => {
    return mockVolunteerTasks.map(task => {
      const volunteers = task.assignedVolunteers
        .map(id => mockPersons.find(p => p.id === id))
        .filter(Boolean);
      return { ...task, volunteers };
    });
  }, []);

  const logsWithDetails = useMemo(() => {
    return mockVolunteerLogs.map(log => {
      const person = mockPersons.find(p => p.id === log.personId);
      const verifier = log.verifiedBy ? mockPersons.find(p => p.id === log.verifiedBy) : null;
      return { ...log, person, verifier };
    });
  }, []);

  // Calculate volunteer hours per person
  const volunteerStats = useMemo(() => {
    const byPerson: Record<string, { person: typeof mockPersons[0] | undefined; hours: number }> = {};
    
    mockVolunteerLogs.forEach(log => {
      if (!byPerson[log.personId]) {
        byPerson[log.personId] = {
          person: mockPersons.find(p => p.id === log.personId),
          hours: 0
        };
      }
      byPerson[log.personId].hours += log.hours;
    });

    return Object.values(byPerson)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
  }, []);

  const stats = useMemo(() => ({
    totalTasks: mockVolunteerTasks.length,
    openTasks: mockVolunteerTasks.filter(t => t.status === "open").length,
    totalHours: mockVolunteerLogs.reduce((sum, l) => sum + l.hours, 0),
    activeVolunteers: new Set(mockVolunteerLogs.map(l => l.personId)).size
  }), []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const openTasks = tasksWithDetails.filter(t => t.status === "open" || t.status === "assigned");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ehrenamt</h1>
          <p className="text-slate-500 mt-1">Freiwillige Helfer und ehrenamtliche Tätigkeiten</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neue Aufgabe
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100">
              <Heart className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.activeVolunteers}</p>
              <p className="text-sm text-slate-500">Aktive Helfer</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.totalHours}</p>
              <p className="text-sm text-slate-500">Stunden gesamt</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.totalTasks}</p>
              <p className="text-sm text-slate-500">Aufgaben</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Users className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-600">{stats.openTasks}</p>
              <p className="text-sm text-slate-500">Offene Stellen</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Open Tasks */}
          <Card>
            <CardHeader 
              title="Offene Aufgaben" 
              subtitle="Helfer gesucht"
              action={<Badge variant="warning">{openTasks.length} offen</Badge>}
            />
            <div className="space-y-4">
              {openTasks.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Keine offenen Aufgaben</p>
              ) : (
                openTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-800">{task.title}</h3>
                      <Badge variant={taskStatusConfig[task.status].variant}>
                        {taskStatusConfig[task.status].label}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(task.startsAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(task.startsAt)} - {formatTime(task.endsAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{task.assignedVolunteers.length}/{task.requiredVolunteers} Helfer</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{task.hoursAwarded}h</span>
                      </div>
                    </div>
                    {task.volunteers.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-slate-500">Zugewiesen:</span>
                        <div className="flex -space-x-2">
                          {task.volunteers.slice(0, 4).map((v, i) => (
                            <div 
                              key={i}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                            >
                              {v?.firstName[0]}
                            </div>
                          ))}
                          {task.volunteers.length > 4 && (
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium border-2 border-white">
                              +{task.volunteers.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent Hours */}
          <Card padding="none">
            <div className="p-5 border-b border-slate-200">
              <CardHeader title="Letzte Eintragungen" subtitle="Geleistete Ehrenamtsstunden" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Helfer</TableHead>
                  <TableHead>Tätigkeit</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead align="right">Stunden</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsWithDetails.length === 0 ? (
                  <TableEmpty message="Keine Einträge" colSpan={4} />
                ) : (
                  logsWithDetails.slice(0, 5).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-xs font-medium">
                            {log.person?.firstName[0]}{log.person?.lastName[0]}
                          </div>
                          <span className="font-medium text-slate-700">
                            {log.person?.firstName} {log.person?.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{log.description}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-600">{formatDate(log.date)}</span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="font-semibold text-emerald-600">{log.hours}h</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Leaderboard */}
        <div>
          <Card>
            <CardHeader title="Top Ehrenamtler" subtitle="Nach geleisteten Stunden" />
            <div className="space-y-3">
              {volunteerStats.map((stat, index) => (
                <div 
                  key={stat.person?.id || index}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? "bg-amber-100 text-amber-700" :
                    index === 1 ? "bg-slate-200 text-slate-700" :
                    index === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">
                      {stat.person?.firstName} {stat.person?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{stat.hours}h</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Add */}
          <Card className="mt-6">
            <CardHeader title="Stunden eintragen" />
            <Button className="w-full" icon={<Plus className="w-4 h-4" />}>
              Neue Stunden erfassen
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}


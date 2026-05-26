import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronDown, ChevronUp, Calendar, CheckSquare } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useRole } from "../contexts";
import {
  getClubTaskGroups,
  getTaskGroupsByTeam,
  getTasksByGroup,
  type TaskStatus,
  type TaskGroup,
} from "../data/mockTaskGroups";
import { getPersonDisplay, getPersonInitials } from "../data/personHelpers";
import { mockTeams } from "../data/mockTeams";
import { CURRENT_SEASON_ID } from "../data/mockSeasons";

type Tab = "club" | "teams";

const STATUS_COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

const COLUMN_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; dot: string }> = {
  todo: { label: "Offen", bg: "bg-neutral-50", text: "text-neutral-600", dot: "bg-neutral-300" },
  in_progress: { label: "In Bearbeitung", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  done: { label: "Erledigt", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
};

function TaskKanban({ groupId }: { groupId: string }) {
  const tasks = getTasksByGroup(groupId);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
      {STATUS_COLUMNS.map(status => {
        const col = COLUMN_CONFIG[status];
        const colTasks = tasks.filter(t => t.status === status);
        return (
          <div key={status} className={`rounded-lg ${col.bg} p-3`}>
            <div className="flex items-center gap-1.5 mb-3">
              <div className={`w-2 h-2 rounded-full ${col.dot}`} />
              <p className={`text-xs font-semibold ${col.text}`}>{col.label}</p>
              <span className="ml-auto text-xs text-neutral-400">{colTasks.length}</span>
            </div>
            <div className="space-y-2">
              {colTasks.map(task => {
                return (
                  <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <p className={`text-xs font-medium leading-snug mb-1.5 ${
                      task.status === "done" ? "line-through text-neutral-400" : "text-neutral-800"
                    }`}>
                      {task.title}
                    </p>
                    {task.dueDate && task.status !== "done" && (
                      <p className="flex items-center gap-1 text-[10px] text-neutral-400 mb-2">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(task.dueDate + "T00:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                      </p>
                    )}
                    {task.assignedTo.length > 0 && (
                      <div className="flex -space-x-1.5">
                        {task.assignedTo.slice(0, 4).map(pid => {
                          const person = getPersonDisplay(pid);
                          const initials = getPersonInitials(person);
                          return person.avatarUrl ? (
                            <img key={pid} src={person.avatarUrl} alt={person.fullName} title={person.fullName}
                              className="w-5 h-5 rounded-full border border-white object-cover" />
                          ) : (
                            <div key={pid}
                              className="w-5 h-5 rounded-full border border-white bg-teal-100 flex items-center justify-center"
                              title={person.fullName}>
                              <span className="text-[8px] font-bold text-teal-700">{initials}</span>
                            </div>
                          );
                        })}
                        {task.assignedTo.length > 4 && (
                          <div className="w-5 h-5 rounded-full border border-white bg-neutral-100 flex items-center justify-center">
                            <span className="text-[8px] text-neutral-500">+{task.assignedTo.length - 4}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {colTasks.length === 0 && (
                <p className="text-xs text-neutral-300 text-center py-2">Keine Aufgaben</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TaskGroupCard({ group }: { group: TaskGroup }) {
  const [expanded, setExpanded] = useState(true);
  const tasks = getTasksByGroup(group.id);
  const doneCount = tasks.filter(t => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const isPastDue = group.dueDate && group.dueDate < new Date().toISOString().split("T")[0];

  return (
    <Card padding="md">
      <button className="w-full text-left" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900">{group.title}</h3>
            <p className="text-xs text-neutral-500 mt-0.5">{group.description}</p>
            <div className="flex items-center gap-3 mt-2">
              {group.dueDate && (
                <span className={`flex items-center gap-1 text-xs ${isPastDue ? "text-red-500" : "text-neutral-400"}`}>
                  <Calendar className="w-3 h-3" />
                  {new Date(group.dueDate + "T00:00:00").toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                </span>
              )}
              <span className="text-xs text-neutral-400">{doneCount}/{tasks.length} erledigt</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className={`text-sm font-bold ${
                progress === 100 ? "text-emerald-600" : progress > 50 ? "text-amber-600" : "text-neutral-600"
              }`}>{progress}%</p>
              <div className="w-16 h-1.5 bg-neutral-100 rounded-full mt-1">
                <div className={`h-1.5 rounded-full ${
                  progress === 100 ? "bg-emerald-500" : progress > 50 ? "bg-amber-400" : "bg-neutral-300"
                }`} style={{ width: `${progress}%` }} />
              </div>
            </div>
            {expanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </div>
        </div>
      </button>
      {expanded && <TaskKanban groupId={group.id} />}
    </Card>
  );
}

export function ClubTasks() {
  const { activeRole } = useRole();
  const isAdmin = activeRole === "admin";
  const [tab, setTab] = useState<Tab>("club");

  const clubGroups = getClubTaskGroups();

  const teamsWithTasks = mockTeams
    .filter(t => t.isActive)
    .map(team => ({
      team,
      groups: getTaskGroupsByTeam(team.id, CURRENT_SEASON_ID),
    }))
    .filter(({ groups }) => groups.length > 0);

  const totalClubTasks = clubGroups.reduce((acc, g) => acc + getTasksByGroup(g.id).length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Aufgaben</h1>
          <p className="text-neutral-500 mt-1">
            {clubGroups.length} Vereinsgruppen · {totalClubTasks} Aufgaben
          </p>
        </div>
        {isAdmin && tab === "club" && (
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Gruppe erstellen
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {([
          { value: "club" as Tab, label: "Vereinsaufgaben" },
          { value: "teams" as Tab, label: "Alle Teams" },
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
          </button>
        ))}
      </div>

      {/* Club tasks tab */}
      {tab === "club" && (
        clubGroups.length === 0 ? (
          <Card padding="md">
            <div className="text-center py-12">
              <CheckSquare className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-400">Keine Vereinsaufgaben vorhanden</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {clubGroups.map(group => (
              <TaskGroupCard key={group.id} group={group} />
            ))}
          </div>
        )
      )}

      {/* All teams tab */}
      {tab === "teams" && (
        teamsWithTasks.length === 0 ? (
          <Card padding="md">
            <p className="text-sm text-neutral-400 text-center py-12">Keine Team-Aufgaben vorhanden</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {teamsWithTasks.map(({ team, groups }) => {
              const totalTasks = groups.reduce((acc, g) => acc + getTasksByGroup(g.id).length, 0);
              const doneTasks = groups.reduce(
                (acc, g) => acc + getTasksByGroup(g.id).filter(t => t.status === "done").length,
                0
              );
              return (
                <div key={team.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-700 font-bold text-xs">{team.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-900">{team.name}</h2>
                      <p className="text-xs text-neutral-400">
                        {groups.length} Gruppen · {doneTasks}/{totalTasks} erledigt
                      </p>
                    </div>
                    <Link
                      to={`/teams/${team.id}/tasks`}
                      className="ml-auto text-xs text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Öffnen →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groups.map(group => {
                      const tasks = getTasksByGroup(group.id);
                      const done = tasks.filter(t => t.status === "done").length;
                      const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
                      return (
                        <Card key={group.id} padding="md">
                          <h3 className="text-sm font-semibold text-neutral-900 truncate">{group.title}</h3>
                          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{group.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full">
                              <div
                                className={`h-1.5 rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-teal-400"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-neutral-400 flex-shrink-0">{done}/{tasks.length}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

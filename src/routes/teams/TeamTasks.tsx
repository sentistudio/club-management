import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, ChevronDown, ChevronUp, Calendar, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useTeamVisibility } from "../../contexts/TeamVisibilityContext";
import { useRole } from "../../contexts";
import { getTaskGroupsByTeam, getTasksByGroup, type TaskStatus } from "../../data/mockTaskGroups";
import { getPersonDisplay, getPersonInitials } from "../../data/personHelpers";

const STATUS_COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

const COLUMN_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string; dot: string }> = {
  todo: { label: "Offen", bg: "bg-neutral-50", text: "text-neutral-600", dot: "bg-neutral-300" },
  in_progress: { label: "In Bearbeitung", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  done: { label: "Erledigt", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" }
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
              {colTasks.map(task => (
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
                          <img
                            key={pid}
                            src={person.avatarUrl}
                            alt={person.fullName}
                            title={person.fullName}
                            className="w-5 h-5 rounded-full border border-white object-cover"
                          />
                        ) : (
                          <div
                            key={pid}
                            className="w-5 h-5 rounded-full border border-white bg-teal-100 flex items-center justify-center"
                            title={person.fullName}
                          >
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
              ))}
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

function TaskGroupCard({ group }: { group: ReturnType<typeof getTaskGroupsByTeam>[0] }) {
  const [expanded, setExpanded] = useState(true);
  const tasks = getTasksByGroup(group.id);
  const doneCount = tasks.filter(t => t.status === "done").length;
  const progress = tasks.length > 0 ? Math.round(doneCount / tasks.length * 100) : 0;
  const isPastDue = group.dueDate && group.dueDate < new Date().toISOString().split("T")[0];

  return (
    <Card padding="md">
      <button
        className="w-full text-left"
        onClick={() => setExpanded(!expanded)}
      >
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
              <span className="text-xs text-neutral-400">
                {doneCount}/{tasks.length} erledigt
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className={`text-sm font-bold ${
                progress === 100 ? "text-emerald-600" : progress > 50 ? "text-amber-600" : "text-neutral-600"
              }`}>{progress}%</p>
              <div className="w-16 h-1.5 bg-neutral-100 rounded-full mt-1">
                <div
                  className={`h-1.5 rounded-full ${
                    progress === 100 ? "bg-emerald-500" : progress > 50 ? "bg-amber-400" : "bg-neutral-300"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            )}
          </div>
        </div>
      </button>
      {expanded && <TaskKanban groupId={group.id} />}
    </Card>
  );
}

export function TeamTasks() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const { settings: vis } = useTeamVisibility();

  const groups = getTaskGroupsByTeam(teamId!, currentSeason.id);

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Aufgaben</h2>
          <p className="text-sm text-neutral-500">{groups.length} Gruppen</p>
        </div>
        {isCoachOrAdmin && (
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Gruppe erstellen
          </Button>
        )}
      </div>

      {/* Visibility disclaimer */}
      {isCoachOrAdmin && !vis.aufgabenVisible && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <EyeOff className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>Dieser Bereich ist für Spieler <strong>nicht sichtbar</strong>. <Link to="../settings" className="underline font-medium hover:text-amber-900">In Einstellungen aktivieren →</Link></span>
        </div>
      )}

      {groups.length === 0 ? (
        <Card padding="md">
          <div className="text-center py-8">
            <p className="text-sm text-neutral-400">Keine Aufgaben vorhanden</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <TaskGroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

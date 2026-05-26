import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarDays, Dumbbell,
  BookOpen, ListChecks, Layers, Settings
} from "lucide-react";
import { useRole } from "../../contexts";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  coachOnly?: boolean; // hide from members
  adminOrCoach?: boolean; // show only to admin/coach
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "dashboard", icon: LayoutDashboard },
  { label: "Spieler", path: "players", icon: Users },
  { label: "Termine", path: "events", icon: CalendarDays },
  { label: "Übungen", path: "activities", icon: Dumbbell },
  { label: "Wissen", path: "knowledge", icon: BookOpen },
  { label: "Aufgaben", path: "tasks", icon: ListChecks },
  { label: "Aufstellung", path: "lineups", icon: Layers },
  { label: "Einstellungen", path: "settings", icon: Settings, adminOrCoach: true }
];

export function TeamSubNav() {
  const { teamId } = useParams<{ teamId: string }>();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";

  return (
    <div className="bg-white border-b border-neutral-200 px-4 overflow-x-auto">
      <nav className="flex gap-1 min-w-max">
        {NAV_ITEMS.filter(item => !item.adminOrCoach || isCoachOrAdmin).map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={`/teams/${teamId}/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

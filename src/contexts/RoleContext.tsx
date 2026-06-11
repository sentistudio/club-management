import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type UserRole = "admin" | "coach" | "member";

export interface LinkedChild {
  id: string;
  firstName: string;
  avatar?: string;
  team?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  roles: UserRole[];
  linkedChildren?: LinkedChild[];
  team?: string; // User's own team/club role
  // For coach role: which teams they manage
  coachTeamIds?: string[];
}

interface RoleContextType {
  user: User;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  canSwitchRoles: boolean;
  selectedPersons: string[]; // array of "me" | child.id
  setSelectedPersons: (persons: string[]) => void;
  togglePerson: (id: string) => void;
  // User switching
  availableUsers: User[];
  switchUser: (userId: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

// Available demo users
const DEMO_USERS: User[] = [
  {
    id: "patrick_steuble",
    firstName: "Patrick",
    lastName: "Steuble",
    email: "patrick.steuble@sfb.de",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    roles: ["admin", "member"],
    team: "1. Herren"
  },
  {
    id: "thomas_mueller",
    firstName: "Thomas",
    lastName: "Müller",
    email: "thomas.mueller@sfb.de",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    roles: ["coach", "member"],
    team: "1. Herren",
    coachTeamIds: ["team1", "team_u12"]
  },
  {
    id: "lena_schneider",
    firstName: "Lena",
    lastName: "Schneider",
    email: "lena.schneider@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
    roles: ["member"],
    team: "Fitness – Morgengruppe",
    linkedChildren: [
      {
        id: "flurina",
        firstName: "Flurina",
        team: "Volleyball U16 Mädchen",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face"
      },
      {
        id: "max",
        firstName: "Max",
        team: "Fußball U12",
        avatar: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=50&h=50&fit=crop&crop=face"
      }
    ]
  }
];

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  // Current user (load from localStorage or default to Patrick)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem("app-current-user");
    return saved || "patrick_steuble";
  });

  // Active role
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("app-active-role");
    if (saved === "admin" || saved === "member") return saved;
    return "admin";
  });

  // Selected persons (for member view: array of "me" | child.id)
  const [selectedPersons, setSelectedPersonsState] = useState<string[]>(() => {
    const saved = localStorage.getItem("app-selected-persons");
    try {
      return saved ? JSON.parse(saved) : ["me"];
    } catch {
      return ["me"];
    }
  });

  const handleSetSelectedPersons = (persons: string[]) => {
    const next = persons.length === 0 ? ["me"] : persons;
    setSelectedPersonsState(next);
    localStorage.setItem("app-selected-persons", JSON.stringify(next));
  };

  const togglePerson = (id: string) => {
    setSelectedPersonsState(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(p => p !== id);
        if (next.length === 0) next = ["me"]; // always keep at least one
      } else {
        next = [...prev, id];
      }
      localStorage.setItem("app-selected-persons", JSON.stringify(next));
      return next;
    });
  };

  // Get current user object
  const currentUser = DEMO_USERS.find(u => u.id === currentUserId) || DEMO_USERS[0];

  // If user doesn't have the active role, switch to their first available role
  useEffect(() => {
    if (!currentUser.roles.includes(activeRole)) {
      setActiveRole(currentUser.roles[0]);
      localStorage.setItem("app-active-role", currentUser.roles[0]);
    }
  }, [currentUser, activeRole]);

  const handleSetRole = (role: UserRole) => {
    if (currentUser.roles.includes(role)) {
      setActiveRole(role);
      localStorage.setItem("app-active-role", role);
    }
  };

  const switchUser = (userId: string) => {
    const newUser = DEMO_USERS.find(u => u.id === userId);
    if (newUser) {
      setCurrentUserId(userId);
      localStorage.setItem("app-current-user", userId);
      // Set role to user's first available role
      const newRole = newUser.roles[0];
      setActiveRole(newRole);
      localStorage.setItem("app-active-role", newRole);
      // Reset selected persons on user switch
      setSelectedPersonsState(["me"]);
      localStorage.setItem("app-selected-persons", JSON.stringify(["me"]));
    }
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem("app-current-user");
    localStorage.removeItem("app-active-role");
  };

  const value: RoleContextType = {
    user: currentUser,
    activeRole,
    setActiveRole: handleSetRole,
    hasRole: (role: UserRole) => currentUser.roles.includes(role),
    canSwitchRoles: currentUser.roles.length > 1,
    selectedPersons,
    setSelectedPersons: handleSetSelectedPersons,
    togglePerson,
    availableUsers: DEMO_USERS,
    switchUser,
    logout,
    isLoggedIn: currentUserId !== null
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

// Component to sync role with route (auto-switch based on URL)
export function RoleRouteSync() {
  const { setActiveRole, user } = useRole();
  const location = useLocation();

  useEffect(() => {
    const isMemberPortal = location.pathname === "/member" || location.pathname.startsWith("/member/");
    const isTeamSection = location.pathname.startsWith("/teams/");

    if (isMemberPortal) {
      if (user.roles.includes("member")) {
        setActiveRole("member");
      }
    } else if (isTeamSection && user.roles.includes("coach") && !user.roles.includes("admin")) {
      setActiveRole("coach");
    } else if (!isMemberPortal) {
      const adminOrCoach = user.roles.includes("admin")
        ? "admin"
        : user.roles.includes("coach")
        ? "coach"
        : null;
      if (adminOrCoach) setActiveRole(adminOrCoach);
    }
  }, [location.pathname, setActiveRole, user.roles]);

  return null;
}

// Role switcher component for the Topbar
export function RoleSwitcher({ className = "" }: { className?: string }) {
  const { user, activeRole, setActiveRole, canSwitchRoles } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show if user can't switch roles
  if (!canSwitchRoles) {
    // Show a static badge instead
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 ${className}`}>
        <span>👤</span>
        <span className="text-sm font-medium text-neutral-600">Mitglied</span>
      </div>
    );
  }

  // Check if we're in the member portal (not /members which is admin route)
  const isInMemberPortal = location.pathname === "/member" || location.pathname.startsWith("/member/");

  const roleConfig: Record<UserRole, { label: string; icon: string; description: string }> = {
    admin: {
      label: "Administrator",
      icon: "🛡️",
      description: "Vereinsverwaltung & alle Funktionen"
    },
    coach: {
      label: "Trainer",
      icon: "⚽",
      description: "Mannschaftsverwaltung & Training"
    },
    member: {
      label: "Mitglied",
      icon: "👤",
      description: "Persönliche Termine & Nachrichten"
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    setActiveRole(role);
    setIsOpen(false);

    if (role === "member" && !isInMemberPortal) {
      navigate("/member");
    } else if (role === "admin" && isInMemberPortal) {
      navigate("/dashboard");
    } else if (role === "coach" && isInMemberPortal) {
      const firstTeam = user.coachTeamIds?.[0];
      navigate(firstTeam ? `/teams/${firstTeam}/dashboard` : "/teams");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
      >
        <span>{roleConfig[activeRole].icon}</span>
        <span className="text-sm font-medium text-neutral-700">
          {roleConfig[activeRole].label}
        </span>
        <svg className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-[10px] shadow-lg border border-neutral-200 overflow-hidden z-50">
            {/* Header */}
            <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-neutral-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Role Options */}
            <div className="p-2">
              <p className="px-2 py-1.5 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Ansicht wechseln
              </p>
              {(Object.keys(roleConfig) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeRole === role 
                      ? "bg-teal-50 text-teal-700" 
                      : "hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <span className="text-lg">{roleConfig[role].icon}</span>
                  <div className="flex-1">
                    <p className="font-medium">{roleConfig[role].label}</p>
                    <p className="text-xs text-neutral-500">
                      {roleConfig[role].description}
                    </p>
                  </div>
                  {activeRole === role && (
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Info Footer */}
            <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                💡 Als Admin & Mitglied kannst du zwischen beiden Ansichten wechseln.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// User Switcher for the sidebar profile section
export function UserSwitcher({ onClose }: { onClose?: () => void }) {
  const { user, availableUsers, switchUser, logout } = useRole();
  const [showUserList, setShowUserList] = useState(false);
  const navigate = useNavigate();

  const handleSwitchUser = (userId: string) => {
    const newUser = availableUsers.find(u => u.id === userId);
    switchUser(userId);
    setShowUserList(false);
    
    if (newUser) {
      if (newUser.roles.includes("admin")) {
        navigate("/dashboard");
      } else if (newUser.roles.includes("coach")) {
        const firstTeam = newUser.coachTeamIds?.[0];
        navigate(firstTeam ? `/teams/${firstTeam}/dashboard` : "/teams");
      } else {
        navigate("/member");
      }
    }
    
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowUserList(!showUserList)}
        className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
      >
        <img 
          src={user.avatar}
          alt={user.firstName}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-neutral-500">
            {user.roles.includes("admin")
              ? "Administrator"
              : user.roles.includes("coach")
              ? "Trainer"
              : "Mitglied"}
          </p>
        </div>
        <svg className={`w-4 h-4 text-neutral-400 transition-transform ${showUserList ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* User Switch Dropdown */}
      {showUserList && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowUserList(false)} 
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[10px] shadow-lg border border-neutral-200 overflow-hidden z-50">
            <div className="p-2">
              <p className="px-3 py-1.5 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Demo: Benutzer wechseln
              </p>
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSwitchUser(u.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    user.id === u.id 
                      ? "bg-teal-50 text-teal-700" 
                      : "hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <img 
                    src={u.avatar}
                    alt={u.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-neutral-500">
                      {u.roles.includes("admin") && u.roles.includes("member")
                        ? "Admin & Mitglied"
                        : u.roles.includes("admin")
                        ? "Administrator"
                        : u.roles.includes("coach")
                        ? "Trainer"
                        : "Mitglied"
                      }
                    </p>
                  </div>
                  {user.id === u.id && (
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            {/* Logout */}
            <div className="p-2 border-t border-neutral-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Abmelden</span>
              </button>
            </div>
            
            {/* Info */}
            <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                💡 Demo: Wechsle zwischen Benutzern, um unterschiedliche Berechtigungen zu sehen.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

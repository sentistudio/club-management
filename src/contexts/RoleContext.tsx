import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "member";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  roles: UserRole[];
}

interface RoleContextType {
  user: User;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  canSwitchRoles: boolean;
}

// Patrick Steuble - Club Admin who is also a member
const PATRICK_USER: User = {
  id: "patrick_steuble",
  firstName: "Patrick",
  lastName: "Steuble",
  email: "patrick.steuble@sfb.de",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
  roles: ["admin", "member"]
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("app-active-role");
    if (saved === "admin" || saved === "member") return saved;
    return "admin";
  });

  const handleSetRole = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem("app-active-role", role);
  };

  const value: RoleContextType = {
    user: PATRICK_USER,
    activeRole,
    setActiveRole: handleSetRole,
    hasRole: (role: UserRole) => PATRICK_USER.roles.includes(role),
    canSwitchRoles: PATRICK_USER.roles.length > 1
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

// Role switcher component for the Topbar
export function RoleSwitcher({ className = "" }: { className?: string }) {
  const { user, activeRole, setActiveRole, canSwitchRoles } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  if (!canSwitchRoles) return null;

  const roleConfig = {
    admin: { 
      label: "Administrator", 
      labelEn: "Administrator",
      icon: "🛡️",
      color: "bg-teal-600"
    },
    member: { 
      label: "Mitglied", 
      labelEn: "Member",
      icon: "👤",
      color: "bg-violet-600"
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
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50">
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
              <p className="px-2 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Ansicht wechseln
              </p>
              {(Object.keys(roleConfig) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    setIsOpen(false);
                  }}
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
                      {role === "admin" 
                        ? "Vereinsverwaltung & alle Funktionen" 
                        : "Persönliche Termine & Nachrichten"
                      }
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
          </div>
        </>
      )}
    </div>
  );
}

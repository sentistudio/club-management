/**
 * Login Page - Demo User Selection
 * 
 * Simulates a login screen where users can select which demo account to use.
 */

import { useNavigate } from "react-router-dom";
import { useRole } from "../contexts";

export function Login() {
  const { availableUsers, switchUser } = useRole();
  const navigate = useNavigate();

  const handleSelectUser = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId);
    switchUser(userId);
    
    // Navigate based on user's roles
    if (user?.roles.includes("admin")) {
      navigate("/dashboard");
    } else {
      navigate("/member");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl font-bold text-neutral-900">cb</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Coachbetter</h1>
          <p className="text-teal-100 mt-1">Vereinsverwaltung</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 text-center">
              Anmelden
            </h2>
            <p className="text-sm text-neutral-500 text-center mt-1">
              Wähle einen Demo-Benutzer aus
            </p>
          </div>

          {/* User Options */}
          <div className="p-4 space-y-3">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="w-full flex items-center gap-4 p-4 rounded-[10px] border-2 border-neutral-200 hover:border-teal-500 hover:bg-teal-50 transition-all text-left group"
              >
                <img 
                  src={user.avatar}
                  alt={user.firstName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900 group-hover:text-teal-700">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-neutral-500">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    {user.roles.map((role) => (
                      <span 
                        key={role}
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          role === "admin" 
                            ? "bg-teal-100 text-teal-700" 
                            : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {role === "admin" ? "🛡️ Admin" : "👤 Mitglied"}
                      </span>
                    ))}
                  </div>
                </div>
                <svg className="w-5 h-5 text-neutral-300 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
            <p className="text-xs text-neutral-500 text-center">
              💡 <strong>Patrick</strong> kann zwischen Admin- und Mitglied-Ansicht wechseln.<br/>
              <strong>Lena</strong> sieht nur die Mitglied-Ansicht.
            </p>
          </div>
        </div>

        {/* Club Info */}
        <div className="mt-6 text-center">
          <p className="text-teal-100 text-sm">
            Demo: Borussia Dortmund
          </p>
        </div>
      </div>
    </div>
  );
}

// Audience Selector Component
// ==========================================
// Select audience mode and configure target groups

import { useState, useMemo } from "react";
import { Users, Building2, UserPlus, Search, X, Check } from "lucide-react";
import { 
  mockDepartments, 
  mockGroups, 
  mockClubMembers
} from "../../data/mockClubEvents";
import type { AudienceMode } from "../../types/events";

interface AudienceSelectorProps {
  mode: AudienceMode;
  departmentIds: string[];
  groupIds: string[];
  memberIds: string[];
  onModeChange: (mode: AudienceMode) => void;
  onDepartmentIdsChange: (ids: string[]) => void;
  onGroupIdsChange: (ids: string[]) => void;
  onMemberIdsChange: (ids: string[]) => void;
}

export function AudienceSelector({
  mode,
  departmentIds,
  groupIds,
  memberIds,
  onModeChange,
  onDepartmentIdsChange,
  onGroupIdsChange,
  onMemberIdsChange
}: AudienceSelectorProps) {
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate resolved count
  const resolvedCount = useMemo(() => {
    switch (mode) {
      case "all":
        return mockClubMembers.length;
      case "departments":
        if (departmentIds.length === 0) return 0;
        const deptMemberIds = new Set<string>();
        mockClubMembers.forEach(m => {
          if (m.departmentIds.some(dId => departmentIds.includes(dId))) {
            deptMemberIds.add(m.id);
          }
        });
        return deptMemberIds.size;
      case "groups":
        if (groupIds.length === 0) return 0;
        const grpMemberIds = new Set<string>();
        groupIds.forEach(gId => {
          const group = mockGroups.find(g => g.id === gId);
          group?.memberIds.forEach(mId => grpMemberIds.add(mId));
        });
        return grpMemberIds.size;
      case "manual":
        return memberIds.length;
    }
  }, [mode, departmentIds, groupIds, memberIds]);

  const modes: { id: AudienceMode; label: string; icon: typeof Users; description: string }[] = [
    { id: "all", label: "Alle Mitglieder", icon: Users, description: "Gesamter Verein" },
    { id: "departments", label: "Abteilungen", icon: Building2, description: "Nach Abteilung filtern" },
    { id: "groups", label: "Gruppen", icon: Users, description: "Benutzerdefinierte Gruppen" },
    { id: "manual", label: "Manuell", icon: UserPlus, description: "Einzeln auswählen" }
  ];

  const toggleDepartment = (deptId: string) => {
    if (departmentIds.includes(deptId)) {
      onDepartmentIdsChange(departmentIds.filter(id => id !== deptId));
    } else {
      onDepartmentIdsChange([...departmentIds, deptId]);
    }
  };

  const toggleGroup = (grpId: string) => {
    if (groupIds.includes(grpId)) {
      onGroupIdsChange(groupIds.filter(id => id !== grpId));
    } else {
      onGroupIdsChange([...groupIds, grpId]);
    }
  };

  const toggleMember = (memberId: string) => {
    if (memberIds.includes(memberId)) {
      onMemberIdsChange(memberIds.filter(id => id !== memberId));
    } else {
      onMemberIdsChange([...memberIds, memberId]);
    }
  };

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return mockClubMembers;
    const term = searchTerm.toLowerCase();
    return mockClubMembers.filter(m => 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-2">
        {modes.map(m => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              mode === m.id 
                ? "border-[#004941] bg-[#C8F2E0]/30" 
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`p-2 rounded-lg ${mode === m.id ? "bg-[#004941] text-white" : "bg-slate-100 text-slate-600"}`}>
              <m.icon className="w-4 h-4" />
            </div>
            <div>
              <p className={`font-medium text-sm ${mode === m.id ? "text-[#004941]" : "text-slate-800"}`}>
                {m.label}
              </p>
              <p className="text-xs text-slate-500">{m.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Department Selection */}
      {mode === "departments" && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-700">Abteilungen auswählen</p>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
            {mockDepartments.map(dept => (
              <label
                key={dept.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  departmentIds.includes(dept.id) ? "bg-[#C8F2E0]/20" : "hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={departmentIds.includes(dept.id)}
                  onChange={() => toggleDepartment(dept.id)}
                  className="w-4 h-4 rounded border-slate-300 text-[#004941] focus:ring-[#004941]"
                />
                <span className="text-lg">{dept.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{dept.name}</p>
                  <p className="text-xs text-slate-500">{dept.memberCount} Mitglieder</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Group Selection */}
      {mode === "groups" && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-700">Gruppen auswählen</p>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
            {mockGroups.map(grp => (
              <label
                key={grp.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  groupIds.includes(grp.id) ? "bg-[#C8F2E0]/20" : "hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={groupIds.includes(grp.id)}
                  onChange={() => toggleGroup(grp.id)}
                  className="w-4 h-4 rounded border-slate-300 text-[#004941] focus:ring-[#004941]"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{grp.name}</p>
                  <p className="text-xs text-slate-500">{grp.description}</p>
                </div>
                <span className="text-xs text-slate-400">{grp.memberCount}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Manual Member Selection */}
      {mode === "manual" && (
        <div className="space-y-3">
          {/* Selected members */}
          {memberIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {memberIds.map(mId => {
                const member = mockClubMembers.find(m => m.id === mId);
                if (!member) return null;
                return (
                  <span
                    key={mId}
                    className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 bg-[#C8F2E0] text-[#004941] rounded-full text-sm"
                  >
                    {member.firstName} {member.lastName}
                    <button
                      type="button"
                      onClick={() => toggleMember(mId)}
                      className="p-0.5 hover:bg-[#004941]/10 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
          
          <button
            type="button"
            onClick={() => setShowMemberPicker(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-[#004941] hover:text-[#004941] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Mitglieder hinzufügen</span>
          </button>
        </div>
      )}

      {/* Resolved Count Display */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-600">Eingeladene Personen:</span>
        </div>
        <span className="font-semibold text-[#004941]">{resolvedCount}</span>
      </div>

      {/* Preview Button */}
      {resolvedCount > 0 && (
        <button
          type="button"
          onClick={() => setShowMemberPicker(true)}
          className="w-full text-sm text-[#004941] hover:underline"
        >
          Teilnehmerliste anzeigen →
        </button>
      )}

      {/* Member Picker Modal */}
      {showMemberPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                {mode === "manual" ? "Mitglieder auswählen" : "Teilnehmerliste"}
              </h3>
              <button 
                onClick={() => { setShowMemberPicker(false); setSearchTerm(""); }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="px-6 py-3 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Mitglieder suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>Keine Mitglieder gefunden</p>
                </div>
              ) : (
                filteredMembers.map(member => {
                  const isSelected = mode === "manual" 
                    ? memberIds.includes(member.id)
                    : (mode === "departments" && member.departmentIds.some(dId => departmentIds.includes(dId))) ||
                      (mode === "groups" && member.groupIds.some(gId => groupIds.includes(gId))) ||
                      mode === "all";

                  return (
                    <div
                      key={member.id}
                      onClick={() => mode === "manual" && toggleMember(member.id)}
                      className={`flex items-center gap-3 px-6 py-3 border-b border-slate-100 last:border-0 ${
                        mode === "manual" ? "cursor-pointer hover:bg-slate-50" : ""
                      } ${isSelected ? "bg-[#C8F2E0]/20" : ""}`}
                    >
                      {mode === "manual" && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-slate-300 text-[#004941] focus:ring-[#004941]"
                        />
                      )}
                      {member.avatar ? (
                        <img src={member.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004941] to-[#006B5A] flex items-center justify-center text-white font-medium text-sm">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{member.email || "—"}</p>
                      </div>
                      {isSelected && mode !== "manual" && (
                        <Check className="w-4 h-4 text-[#004941]" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-sm text-slate-600">
                {mode === "manual" ? `${memberIds.length} ausgewählt` : `${resolvedCount} Teilnehmer`}
              </span>
              <button
                onClick={() => { setShowMemberPicker(false); setSearchTerm(""); }}
                className="px-4 py-2 bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors"
              >
                {mode === "manual" ? "Übernehmen" : "Schließen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

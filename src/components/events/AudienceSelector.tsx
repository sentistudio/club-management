// Audience Selector Component
// ==========================================
// Multi-source participant selection: combine departments + groups + individuals

import { useState, useMemo } from "react";
import { Users, Building2, UserPlus, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  mockDepartments,
  mockGroups,
  mockClubMembers
} from "../../data/mockClubEvents";

interface AudienceSelectorProps {
  isClubWide: boolean;
  departmentIds: string[];
  groupIds: string[];
  memberIds: string[];
  onIsClubWideChange: (val: boolean) => void;
  onDepartmentIdsChange: (ids: string[]) => void;
  onGroupIdsChange: (ids: string[]) => void;
  onMemberIdsChange: (ids: string[]) => void;
}

type Section = "departments" | "groups" | "members";

export function AudienceSelector({
  isClubWide,
  departmentIds,
  groupIds,
  memberIds,
  onIsClubWideChange,
  onDepartmentIdsChange,
  onGroupIdsChange,
  onMemberIdsChange,
}: AudienceSelectorProps) {
  const [expandedSection, setExpandedSection] = useState<Section | null>(null);
  const [showInviteList, setShowInviteList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const resolvedMembers = useMemo(() => {
    if (isClubWide) return mockClubMembers;
    const ids = new Set<string>();
    mockClubMembers.forEach(m => {
      if (m.departmentIds.some(dId => departmentIds.includes(dId))) ids.add(m.id);
    });
    groupIds.forEach(gId => {
      mockGroups.find(g => g.id === gId)?.memberIds.forEach(mId => ids.add(mId));
    });
    memberIds.forEach(id => ids.add(id));
    return mockClubMembers.filter(m => ids.has(m.id));
  }, [isClubWide, departmentIds, groupIds, memberIds]);

  const resolvedCount = resolvedMembers.length;

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return mockClubMembers;
    const term = searchTerm.toLowerCase();
    return mockClubMembers.filter(m =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const toggleSection = (section: Section) => {
    setExpandedSection(prev => (prev === section ? null : section));
    if (section !== "members") setSearchTerm("");
  };

  const toggleDepartment = (id: string) =>
    onDepartmentIdsChange(departmentIds.includes(id) ? departmentIds.filter(x => x !== id) : [...departmentIds, id]);

  const toggleGroup = (id: string) =>
    onGroupIdsChange(groupIds.includes(id) ? groupIds.filter(x => x !== id) : [...groupIds, id]);

  const toggleMember = (id: string) =>
    onMemberIdsChange(memberIds.includes(id) ? memberIds.filter(x => x !== id) : [...memberIds, id]);

  return (
    <div className="space-y-3">
      {/* Club-wide toggle */}
      <div className={`flex items-center justify-between p-4 rounded-[10px] border-2 transition-all ${
        isClubWide ? "border-[#004941] bg-[#C8F2E0]/20" : "border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isClubWide ? "bg-[#004941] text-white" : "bg-slate-100 text-slate-600"}`}>
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className={`font-medium text-sm ${isClubWide ? "text-[#004941]" : "text-slate-800"}`}>
              Ganzer Verein
            </p>
            <p className="text-xs text-slate-500">{mockClubMembers.length} Mitglieder eingeladen</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input
            type="checkbox"
            checked={isClubWide}
            onChange={(e) => onIsClubWideChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]" />
        </label>
      </div>

      {/* Per-source sections */}
      {!isClubWide && (
        <div className="border border-slate-200 rounded-[10px] overflow-hidden divide-y divide-slate-200">

          {/* Departments */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("departments")}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Abteilungen</span>
                {departmentIds.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#004941] text-white text-xs rounded-full font-medium leading-none">
                    {departmentIds.length}
                  </span>
                )}
              </div>
              {expandedSection === "departments"
                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {expandedSection === "departments" && (
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
                    <span className="text-base">{dept.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-800">{dept.name}</p>
                      <p className="text-xs text-slate-500">{dept.memberCount} Mitglieder</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Groups */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("groups")}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Gruppen</span>
                {groupIds.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#004941] text-white text-xs rounded-full font-medium leading-none">
                    {groupIds.length}
                  </span>
                )}
              </div>
              {expandedSection === "groups"
                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {expandedSection === "groups" && (
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
                      <p className="font-medium text-sm text-slate-800">{grp.name}</p>
                      <p className="text-xs text-slate-500">{grp.description}</p>
                    </div>
                    <span className="text-xs text-slate-400">{grp.memberCount}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Individual members */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("members")}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Einzelpersonen</span>
                {memberIds.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#004941] text-white text-xs rounded-full font-medium leading-none">
                    {memberIds.length}
                  </span>
                )}
              </div>
              {expandedSection === "members"
                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {expandedSection === "members" && (
              <div>
                {/* Selected chips */}
                {memberIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                    {memberIds.map(mId => {
                      const member = mockClubMembers.find(m => m.id === mId);
                      if (!member) return null;
                      return (
                        <span
                          key={mId}
                          className="inline-flex items-center gap-1 pl-2 pr-1 py-1 bg-[#C8F2E0] text-[#004941] rounded-full text-xs"
                        >
                          {member.firstName} {member.lastName}
                          <button
                            type="button"
                            onClick={() => toggleMember(mId)}
                            className="p-0.5 hover:bg-[#004941]/10 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                {/* Search */}
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Suchen..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941]"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {filteredMembers.map(member => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        memberIds.includes(member.id) ? "bg-[#C8F2E0]/20" : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={memberIds.includes(member.id)}
                        onChange={() => toggleMember(member.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#004941] focus:ring-[#004941]"
                      />
                      {member.avatar ? (
                        <img src={member.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#004941] to-[#006B5A] flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                      )}
                      <p className="text-sm font-medium text-slate-800">
                        {member.firstName} {member.lastName}
                      </p>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Combined resolved count — expandable list */}
      <div className="border border-slate-200 rounded-[10px] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowInviteList(v => !v)}
          className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">Eingeladene Personen:</span>
            <span className="font-semibold text-[#004941]">{resolvedCount}</span>
          </div>
          {resolvedCount > 0 && (
            showInviteList
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {showInviteList && resolvedCount > 0 && (
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
            {resolvedMembers.map(member => (
              <div key={member.id} className="flex items-center gap-3 px-4 py-2.5">
                {member.avatar ? (
                  <img src={member.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#004941] to-[#006B5A] flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                )}
                <p className="text-sm text-slate-800">{member.firstName} {member.lastName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

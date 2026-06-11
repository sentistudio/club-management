import { useState, useMemo } from "react";
import { Users, Shield, UserPlus, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { mockTeams } from "../../data/mockTeams";
import { mockGroups, mockClubMembers } from "../../data/mockClubEvents";

interface TeamAudienceSelectorProps {
  teamIds: string[];
  groupIds: string[];
  memberIds: string[];
  primaryTeamId: string; // always included, read-only
  onTeamIdsChange: (ids: string[]) => void;
  onGroupIdsChange: (ids: string[]) => void;
  onMemberIdsChange: (ids: string[]) => void;
}

type Section = "teams" | "groups" | "members";

export function TeamAudienceSelector({
  teamIds,
  groupIds,
  memberIds,
  primaryTeamId,
  onTeamIdsChange,
  onGroupIdsChange,
  onMemberIdsChange,
}: TeamAudienceSelectorProps) {
  const [expandedSection, setExpandedSection] = useState<Section | null>(null);
  const [showInviteList, setShowInviteList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // All selected team ids including primary
  const allTeamIds = useMemo(() => {
    const ids = new Set([primaryTeamId, ...teamIds]);
    return [...ids].filter(Boolean);
  }, [primaryTeamId, teamIds]);

  const totalSelections = allTeamIds.length + groupIds.length + memberIds.length;

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

  const toggleTeam = (id: string) => {
    if (id === primaryTeamId) return; // primary team cannot be deselected
    onTeamIdsChange(teamIds.includes(id) ? teamIds.filter(x => x !== id) : [...teamIds, id]);
  };

  const toggleGroup = (id: string) =>
    onGroupIdsChange(groupIds.includes(id) ? groupIds.filter(x => x !== id) : [...groupIds, id]);

  const toggleMember = (id: string) =>
    onMemberIdsChange(memberIds.includes(id) ? memberIds.filter(x => x !== id) : [...memberIds, id]);

  return (
    <div className="space-y-3">
      <div className="border border-slate-200 rounded-[10px] overflow-hidden divide-y divide-slate-200">

        {/* Teams */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection("teams")}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Mannschaften</span>
              {allTeamIds.length > 0 && (
                <span className="px-1.5 py-0.5 bg-[#004941] text-white text-xs rounded-full font-medium leading-none">
                  {allTeamIds.length}
                </span>
              )}
            </div>
            {expandedSection === "teams"
              ? <ChevronUp className="w-4 h-4 text-slate-400" />
              : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {expandedSection === "teams" && (
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
              {mockTeams.map(team => {
                const isPrimary = team.id === primaryTeamId;
                const isSelected = allTeamIds.includes(team.id);
                return (
                  <label
                    key={team.id}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isPrimary ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    } ${isSelected ? "bg-[#C8F2E0]/20" : "hover:bg-slate-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleTeam(team.id)}
                      disabled={isPrimary}
                      className="w-4 h-4 rounded border-slate-300 text-[#004941] focus:ring-[#004941]"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-800">{team.name}</p>
                      {isPrimary && <p className="text-xs text-[#004941]">Primäre Mannschaft</p>}
                    </div>
                  </label>
                );
              })}
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

      {/* Summary */}
      <button
        type="button"
        onClick={() => setShowInviteList(v => !v)}
        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-[10px] border border-slate-200 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-600">
            {allTeamIds.length} Mannschaft{allTeamIds.length !== 1 ? "en" : ""}
            {groupIds.length > 0 && `, ${groupIds.length} Gruppe${groupIds.length !== 1 ? "n" : ""}`}
            {memberIds.length > 0 && `, ${memberIds.length} Person${memberIds.length !== 1 ? "en" : ""}`}
          </span>
        </div>
        {totalSelections > 0 && (showInviteList
          ? <ChevronUp className="w-4 h-4 text-slate-400" />
          : <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </div>
  );
}

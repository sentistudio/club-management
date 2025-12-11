import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, ChevronRight, Calendar } from "lucide-react";
import { Card, CardHeader, Button, Badge } from "../components/ui";
import { mockCommittees, mockFunctionaryRoles, mockRoleDefinitions } from "../data/mockCommittees";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships } from "../data/mockMemberships";

export function Committees() {
  const navigate = useNavigate();

  const committeesWithOfficials = useMemo(() => {
    return mockCommittees.map(committee => {
      const functionaries = mockFunctionaryRoles
        .filter(fr => fr.committeeId === committee.id)
        .map(fr => {
          const membership = mockClubMemberships.find(m => m.id === fr.clubMembershipId);
          const person = membership ? mockPersons.find(p => p.id === membership.personId) : null;
          const roleDef = mockRoleDefinitions.find(rd => rd.key === fr.roleKey);
          return { ...fr, membership, person, roleDef };
        });
      
      return { ...committee, functionaries };
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  const getRoleDisplayName = (roleKey: string) => {
    const roleLabels: Record<string, string> = {
      "1_vorsitzender": "1. Vorsitzender",
      "2_vorsitzender": "2. Vorsitzender",
      "treasurer": "Kassenwart",
      "secretary": "Schriftführer",
      "board_member": "Mitglied",
      "jugendleiter": "Jugendleiter"
    };
    return roleLabels[roleKey] || roleKey;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gremien</h1>
          <p className="text-slate-500 mt-1">
            {mockCommittees.filter(c => c.isActive).length} aktive Gremien mit {mockFunctionaryRoles.length} Funktionären
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neues Gremium
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-800">{mockCommittees.length}</p>
            <p className="text-sm text-slate-500 mt-1">Gremien</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-sky-600">{mockFunctionaryRoles.length}</p>
            <p className="text-sm text-slate-500 mt-1">Funktionäre</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {new Set(mockFunctionaryRoles.map(fr => fr.clubMembershipId)).size}
            </p>
            <p className="text-sm text-slate-500 mt-1">Aktive Mitglieder</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">
              {mockCommittees.filter(c => c.isActive).length}
            </p>
            <p className="text-sm text-slate-500 mt-1">Aktive Gremien</p>
          </div>
        </Card>
      </div>

      {/* Committees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {committeesWithOfficials.map((committee) => (
          <Card key={committee.id} className={!committee.isActive ? "opacity-60" : ""}>
            <CardHeader 
              title={committee.name}
              subtitle={`${committee.functionaries.length} Mitglieder${!committee.isActive ? " · Inaktiv" : ""}`}
              action={
                <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />}>
                  Hinzufügen
                </Button>
              }
            />
            
            <div className="space-y-3">
              {committee.functionaries.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>Keine Funktionäre zugewiesen</p>
                </div>
              ) : (
                committee.functionaries.map((func) => (
                  <div 
                    key={func.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
                    onClick={() => func.membership && navigate(`/members/${func.membership.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-medium text-sm">
                        {func.person 
                          ? `${func.person.firstName[0]}${func.person.lastName[0]}`
                          : "??"
                        }
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {func.person 
                            ? `${func.person.firstName} ${func.person.lastName}`
                            : "Unbekannt"
                          }
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="info">{getRoleDisplayName(func.roleKey)}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>seit {formatDate(func.startsAt)}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

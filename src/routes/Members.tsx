import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Download, Upload } from "lucide-react";
import { 
  Card, 
  Button,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  MemberStatusBadge as MembershipStatusBadge
} from "../components/ui";
import { SearchInput } from "../components/ui/Input";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships, mockDepartmentMemberships } from "../data/mockMemberships";
import { mockDepartments } from "../data/mockDepartments";
import type { MembershipStatus } from "../types/domain";

export function Members() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<MembershipStatus | "">("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const membersWithDetails = useMemo(() => {
    return mockClubMemberships.map(membership => {
      const person = mockPersons.find(p => p.id === membership.personId);
      const deptMemberships = mockDepartmentMemberships.filter(
        dm => dm.clubMembershipId === membership.id
      );
      const departments = deptMemberships
        .map(dm => mockDepartments.find(d => d.id === dm.departmentId))
        .filter(Boolean);
      
      return { ...membership, person, departments };
    });
  }, []);

  const filteredMembers = useMemo(() => {
    return membersWithDetails
      .filter(m => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          m.person?.firstName.toLowerCase().includes(searchLower) ||
          m.person?.lastName.toLowerCase().includes(searchLower) ||
          m.membershipNumber.includes(searchLower) ||
          m.person?.email?.toLowerCase().includes(searchLower)
        );
      })
      .filter(m => !statusFilter || m.status === statusFilter)
      .filter(m => {
        if (!departmentFilter) return true;
        return m.departments.some(d => d?.id === departmentFilter);
      })
      .sort((a, b) => {
        const nameA = `${a.person?.lastName} ${a.person?.firstName}`;
        const nameB = `${b.person?.lastName} ${b.person?.firstName}`;
        return nameA.localeCompare(nameB);
      });
  }, [membersWithDetails, searchTerm, statusFilter, departmentFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "pending", label: "Ausstehend" },
    { value: "suspended", label: "Gesperrt" },
    { value: "cancelled", label: "Gekündigt" }
  ];

  const departmentOptions = mockDepartments
    .filter(d => d.isActive)
    .map(d => ({ value: d.id, label: d.name }));

  return (
    <div className="space-y-5">
      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <SearchInput
              placeholder="Mitglied suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="w-40">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as MembershipStatus | "")}
                placeholder="Status"
              />
            </div>
            <div className="w-40">
              <Select
                options={departmentOptions}
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                placeholder="Abteilung"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
          </div>
        </div>
      </Card>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {filteredMembers.length} Mitglieder gefunden
        </p>
      </div>

      {/* Members Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mitglied</TableHead>
              <TableHead>Nr.</TableHead>
              <TableHead className="hidden md:table-cell">E-Mail</TableHead>
              <TableHead className="hidden lg:table-cell">Abteilungen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Beitritt</TableHead>
              <TableHead align="right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableEmpty 
                message="Keine Mitglieder gefunden" 
                colSpan={7} 
              />
            ) : (
              filteredMembers.map((member) => (
                <TableRow 
                  key={member.id}
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                        {member.person?.firstName[0]}{member.person?.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {member.person?.firstName} {member.person?.lastName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-neutral-500 font-mono text-sm">
                      {member.membershipNumber}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-neutral-500 text-sm">
                      {member.person?.email || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {member.departments.length === 0 ? (
                        <span className="text-neutral-400 text-sm">—</span>
                      ) : (
                        member.departments.slice(0, 2).map((dept) => (
                          <span 
                            key={dept?.id} 
                            className="px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded"
                          >
                            {dept?.name}
                          </span>
                        ))
                      )}
                      {member.departments.length > 2 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded">
                          +{member.departments.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <MembershipStatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-neutral-500 text-sm">
                      {formatDate(member.startsAt)}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <button 
                      className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Menu action
                      }}
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-400" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

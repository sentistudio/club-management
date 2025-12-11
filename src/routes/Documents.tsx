import { useMemo, useState } from "react";
import { FileText, Download, Eye, Trash2, Upload, FolderOpen, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  Button, 
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  Badge
} from "../components/ui";
import { mockDocuments } from "../data/mockDfbnet";
import { mockPersons } from "../data/mockPersons";
import { mockTeams } from "../data/mockTeams";
import type { DocumentType, DocumentStatus } from "../types/dfbnet";

const documentTypeConfig: Record<DocumentType, { label: string; icon: string }> = {
  contract: { label: "Vertrag", icon: "📄" },
  certificate: { label: "Zertifikat", icon: "🏅" },
  id_document: { label: "Ausweisdokument", icon: "🪪" },
  medical: { label: "Medizinisch", icon: "🏥" },
  insurance: { label: "Versicherung", icon: "🛡️" },
  consent: { label: "Einwilligung", icon: "✅" },
  other: { label: "Sonstiges", icon: "📎" }
};

const documentStatusConfig: Record<DocumentStatus, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
  valid: { label: "Gültig", variant: "success" },
  expired: { label: "Abgelaufen", variant: "danger" },
  pending: { label: "Ausstehend", variant: "warning" },
  rejected: { label: "Abgelehnt", variant: "danger" }
};

export function Documents() {
  const [typeFilter, setTypeFilter] = useState<DocumentType | "">("");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "">("");

  const documentsWithDetails = useMemo(() => {
    return mockDocuments.map(doc => {
      const person = doc.personId ? mockPersons.find(p => p.id === doc.personId) : null;
      const team = doc.teamId ? mockTeams.find(t => t.id === doc.teamId) : null;
      const uploader = mockPersons.find(p => p.id === doc.uploadedBy);
      return { ...doc, person, team, uploader };
    });
  }, []);

  const filteredDocuments = useMemo(() => {
    return documentsWithDetails
      .filter(d => !typeFilter || d.documentType === typeFilter)
      .filter(d => !statusFilter || d.status === statusFilter)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [documentsWithDetails, typeFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: mockDocuments.length,
    valid: mockDocuments.filter(d => d.status === "valid").length,
    expiringSoon: mockDocuments.filter(d => {
      if (!d.validUntil) return false;
      const daysUntilExpiry = (new Date(d.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return d.status === "valid" && daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length,
    pending: mockDocuments.filter(d => d.status === "pending").length
  }), []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const typeOptions = Object.entries(documentTypeConfig).map(([value, { label }]) => ({ value, label }));
  const statusOptions = Object.entries(documentStatusConfig).map(([value, { label }]) => ({ value, label }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dokumente</h1>
          <p className="text-slate-500 mt-1">Verträge, Zertifikate und wichtige Unterlagen</p>
        </div>
        <Button icon={<Upload className="w-4 h-4" />}>
          Dokument hochladen
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <FolderOpen className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">Gesamt</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.valid}</p>
              <p className="text-sm text-slate-500">Gültig</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.expiringSoon}</p>
              <p className="text-sm text-slate-500">Läuft bald ab</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <FileText className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-600">{stats.pending}</p>
              <p className="text-sm text-slate-500">Ausstehend</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocumentType | "")}
              placeholder="Alle Typen"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "")}
              placeholder="Alle Status"
            />
          </div>
        </div>
      </Card>

      {/* Documents Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-200">
          <CardHeader title="Alle Dokumente" subtitle={`${filteredDocuments.length} Dokumente`} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dokument</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead className="hidden md:table-cell">Zugeordnet</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Gültig bis</TableHead>
              <TableHead align="right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length === 0 ? (
              <TableEmpty message="Keine Dokumente gefunden" colSpan={6} />
            ) : (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {documentTypeConfig[doc.documentType].icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{doc.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatFileSize(doc.fileSize)} · {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">
                      {documentTypeConfig[doc.documentType].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {doc.person ? (
                      <span className="text-slate-700">
                        {doc.person.firstName} {doc.person.lastName}
                      </span>
                    ) : doc.team ? (
                      <span className="text-slate-700">{doc.team.name}</span>
                    ) : (
                      <span className="text-slate-400">Verein</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={documentStatusConfig[doc.status].variant}>
                      {documentStatusConfig[doc.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {doc.validUntil ? (
                      <span className={`${
                        (new Date(doc.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 30
                          ? "text-rose-600 font-medium"
                          : "text-slate-600"
                      }`}>
                        {formatDate(doc.validUntil)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Ansehen">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Download">
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Löschen">
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
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


import { useMemo, useState } from "react";
import { Plus, Mail, Send, Clock, CheckCircle, Eye, Copy, Inbox, FileText } from "lucide-react";
import { 
  Card, 
  Button, 
  Select,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanel
} from "../components/ui";
import { mockMessages, mockMessageTemplates } from "../data/mockDfbnet";
import type { MessageStatus } from "../types/dfbnet";

const messageStatusConfig: Record<MessageStatus, { label: string; variant: "success" | "warning" | "neutral" | "danger"; icon: typeof Send }> = {
  draft: { label: "Entwurf", variant: "neutral", icon: FileText },
  scheduled: { label: "Geplant", variant: "warning", icon: Clock },
  sent: { label: "Gesendet", variant: "success", icon: CheckCircle },
  failed: { label: "Fehlgeschlagen", variant: "danger", icon: Mail }
};

export function Communications() {
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "">("");

  const filteredMessages = useMemo(() => {
    return mockMessages
      .filter(m => !statusFilter || m.status === statusFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [statusFilter]);

  const stats = useMemo(() => ({
    total: mockMessages.length,
    sent: mockMessages.filter(m => m.status === "sent").length,
    scheduled: mockMessages.filter(m => m.status === "scheduled").length,
    avgOpenRate: Math.round(
      mockMessages
        .filter(m => m.openRate !== undefined)
        .reduce((sum, m) => sum + (m.openRate || 0), 0) / 
      mockMessages.filter(m => m.openRate !== undefined).length
    )
  }), []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const statusOptions = [
    { value: "draft", label: "Entwurf" },
    { value: "scheduled", label: "Geplant" },
    { value: "sent", label: "Gesendet" },
    { value: "failed", label: "Fehlgeschlagen" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kommunikation</h1>
          <p className="text-slate-500 mt-1">E-Mails, Newsletter und Benachrichtigungen</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neue Nachricht
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <Inbox className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">Nachrichten</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.sent}</p>
              <p className="text-sm text-slate-500">Gesendet</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.scheduled}</p>
              <p className="text-sm text-slate-500">Geplant</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Eye className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-600">{stats.avgOpenRate}%</p>
              <p className="text-sm text-slate-500">Ø Öffnungsrate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultTab="messages">
        <TabList>
          <Tab value="messages" icon={<Mail className="w-4 h-4" />}>Nachrichten</Tab>
          <Tab value="templates" icon={<FileText className="w-4 h-4" />}>Vorlagen</Tab>
        </TabList>

        <TabPanel value="messages">
          {/* Filter */}
          <Card className="mb-6">
            <div className="w-48">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as MessageStatus | "")}
                placeholder="Alle Status"
              />
            </div>
          </Card>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((message) => {
              const StatusIcon = messageStatusConfig[message.status].icon;
              return (
                <Card key={message.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl ${
                      message.status === "sent" ? "bg-emerald-100" :
                      message.status === "scheduled" ? "bg-amber-100" :
                      message.status === "draft" ? "bg-slate-100" :
                      "bg-rose-100"
                    }`}>
                      <StatusIcon className={`w-5 h-5 ${
                        message.status === "sent" ? "text-emerald-600" :
                        message.status === "scheduled" ? "text-amber-600" :
                        message.status === "draft" ? "text-slate-600" :
                        "text-rose-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-800">{message.subject}</h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {message.body.substring(0, 120)}...
                          </p>
                        </div>
                        <Badge variant={messageStatusConfig[message.status].variant}>
                          {messageStatusConfig[message.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <span>
                          {message.status === "sent" && message.sentAt
                            ? `Gesendet: ${formatDate(message.sentAt)}`
                            : message.status === "scheduled" && message.scheduledAt
                              ? `Geplant: ${formatDate(message.scheduledAt)}`
                              : `Erstellt: ${formatDate(message.createdAt)}`
                          }
                        </span>
                        {message.openRate !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {message.openRate}% geöffnet
                          </span>
                        )}
                        <span>
                          An: {message.recipientType === "all" ? "Alle Mitglieder" :
                               message.recipientType === "team" ? "Team" :
                               message.recipientType === "custom" ? `${message.recipientIds.length} Empfänger` :
                               message.recipientType}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabPanel>

        <TabPanel value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMessageTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="info">{template.category}</Badge>
                  {template.isActive ? (
                    <Badge variant="success">Aktiv</Badge>
                  ) : (
                    <Badge variant="neutral">Inaktiv</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{template.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{template.subject}</p>
                <p className="text-xs text-slate-400 line-clamp-3">{template.body}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" icon={<Copy className="w-3 h-3" />}>
                    Verwenden
                  </Button>
                  <Button variant="ghost" size="sm">
                    Bearbeiten
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}


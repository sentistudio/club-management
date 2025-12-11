import { useMemo, useState } from "react";
import { Plus, Calendar, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import { Card, Button, Select, Badge } from "../components/ui";
import { mockEvents, mockEventRegistrations } from "../data/mockDfbnet";
import { mockTeams } from "../data/mockTeams";
import type { EventType, EventStatus } from "../types/dfbnet";

const eventTypeConfig: Record<EventType, { label: string; color: string }> = {
  training: { label: "Training", color: "bg-sky-100 text-sky-700" },
  match: { label: "Spiel", color: "bg-emerald-100 text-emerald-700" },
  meeting: { label: "Sitzung", color: "bg-violet-100 text-violet-700" },
  social: { label: "Gesellig", color: "bg-amber-100 text-amber-700" },
  tournament: { label: "Turnier", color: "bg-rose-100 text-rose-700" },
  camp: { label: "Camp", color: "bg-teal-100 text-teal-700" },
  other: { label: "Sonstiges", color: "bg-slate-100 text-slate-700" }
};

const eventStatusConfig: Record<EventStatus, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
  draft: { label: "Entwurf", variant: "neutral" },
  published: { label: "Veröffentlicht", variant: "success" },
  cancelled: { label: "Abgesagt", variant: "danger" },
  completed: { label: "Abgeschlossen", variant: "neutral" }
};

export function Events() {
  const [typeFilter, setTypeFilter] = useState<EventType | "">("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "">("");

  const eventsWithDetails = useMemo(() => {
    return mockEvents.map(event => {
      const team = event.teamId ? mockTeams.find(t => t.id === event.teamId) : null;
      const registrations = mockEventRegistrations.filter(r => r.eventId === event.id);
      return { ...event, team, registrations, registrationCount: registrations.length };
    });
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsWithDetails
      .filter(e => !typeFilter || e.eventType === typeFilter)
      .filter(e => !statusFilter || e.status === statusFilter)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [eventsWithDetails, typeFilter, statusFilter]);

  const upcomingEvents = filteredEvents.filter(e => new Date(e.startsAt) > new Date() && e.status !== "cancelled");
  const pastEvents = filteredEvents.filter(e => new Date(e.startsAt) <= new Date() || e.status === "completed");

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const typeOptions = Object.entries(eventTypeConfig).map(([value, { label }]) => ({ value, label }));
  const statusOptions = Object.entries(eventStatusConfig).map(([value, { label }]) => ({ value, label }));

  const renderEventCard = (event: typeof eventsWithDetails[0]) => (
    <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-14 text-center">
          <div className="bg-sky-600 text-white rounded-t-lg py-1 text-xs font-medium">
            {new Date(event.startsAt).toLocaleDateString("de-DE", { month: "short" })}
          </div>
          <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg py-2">
            <p className="text-2xl font-bold text-slate-800">
              {new Date(event.startsAt).getDate()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${eventTypeConfig[event.eventType].color}`}>
                  {eventTypeConfig[event.eventType].label}
                </span>
                <Badge variant={eventStatusConfig[event.status].variant}>
                  {eventStatusConfig[event.status].label}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                {event.title}
              </h3>
              {event.team && (
                <p className="text-sm text-slate-500">{event.team.name}</p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(event.startsAt)} - {formatTime(event.endsAt)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.maxParticipants && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{event.registrationCount}/{event.maxParticipants}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Veranstaltungen</h1>
          <p className="text-slate-500 mt-1">Termine, Events und Vereinsaktivitäten</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neue Veranstaltung
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Calendar className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{upcomingEvents.length}</p>
              <p className="text-sm text-slate-500">Anstehend</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {mockEventRegistrations.filter(r => r.status === "registered").length}
              </p>
              <p className="text-sm text-slate-500">Anmeldungen</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {mockEvents.filter(e => e.eventType === "social").length}
              </p>
              <p className="text-sm text-slate-500">Gesellige Events</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-100">
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-600">
                {mockEvents.filter(e => e.eventType === "meeting").length}
              </p>
              <p className="text-sm text-slate-500">Sitzungen</p>
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
              onChange={(e) => setTypeFilter(e.target.value as EventType | "")}
              placeholder="Alle Typen"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatus | "")}
              placeholder="Alle Status"
            />
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Anstehende Veranstaltungen</h2>
          <div className="space-y-4">
            {upcomingEvents.map(renderEventCard)}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Vergangene Veranstaltungen</h2>
          <div className="space-y-4 opacity-75">
            {pastEvents.slice(0, 5).map(renderEventCard)}
          </div>
        </div>
      )}
    </div>
  );
}


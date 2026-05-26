// Event Detail Modal Component
// ==========================================
// View full event details with actions

import { useState } from "react";
import {
  X, Calendar, Clock, MapPin, Users,
  Edit2, Copy, Send, XCircle, RefreshCw, History,
  Check, AlertCircle, AlertTriangle, CheckCircle2, Building2
} from "lucide-react";
import type { ClubEvent } from "../../types/events";
import {
  getAudienceDescription,
  resolveEventAudience,
  getDepartmentById,
  getGroupById
} from "../../data/mockClubEvents";
import { getFieldById, getVenueById } from "../../data/mockFields";
import { fieldIsDivisible } from "../../types/fields";
import { ZoneGrid } from "../fields/ZoneGrid";
import { 
  getStatusLabel, 
  getStatusColor, 
  formatDate,
  formatTime,
  getVisibilityLabel,
  getVisibilityIcon
} from "../../utils/eventUtils";

interface EventDetailDrawerProps {
  event: ClubEvent;
  onClose: () => void;
  onEdit: (event: ClubEvent) => void;
  onDuplicate: (event: ClubEvent) => void;
  onPublish: (event: ClubEvent) => void;
  onCancel: (event: ClubEvent, reason: string) => void;
  onConfirm?: () => void;
}

export function EventDetailDrawer({
  event,
  onClose,
  onEdit,
  onDuplicate,
  onPublish,
  onCancel,
  onConfirm,
}: EventDetailDrawerProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "audience" | "history">("details");

  const statusColors = getStatusColor(event.status);
  const audience = resolveEventAudience(event);
  const field = event.fieldId ? getFieldById(event.fieldId) : null;
  const venue = field ? getVenueById(field.venueId) : null;

  const bookedZones = field && event.bookingScope === "zones" && event.bookedZoneIds?.length
    ? field.zones.filter(z => event.bookedZoneIds!.includes(z.id))
    : [];

  const handleCancel = () => {
    onCancel(event, cancelReason);
    setShowCancelModal(false);
    setCancelReason("");
  };

  const canEdit = event.status === "draft" || event.status === "published";
  const canPublish = event.status === "draft";
  const canCancel = event.status === "draft" || event.status === "published";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Banner Image */}
        {event.bannerImage && (
          <div className="h-40 w-full overflow-hidden flex-shrink-0">
            <img 
              src={event.bannerImage} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Header */}
        <div className={`flex items-start justify-between p-6 border-b border-slate-200 ${event.bannerImage ? "-mt-8 relative z-10 bg-white rounded-t-2xl mx-4 shadow-lg" : ""}`}>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                {getStatusLabel(event.status)}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-sm text-slate-500">
                {getVisibilityIcon(event.visibility)} {getVisibilityLabel(event.visibility)}
              </span>
              {event.isAllDay && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                    Ganztägig
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-800 truncate">{event.title}</h2>
            {event.category && (
              <span className="text-sm text-slate-500">{event.category}</span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: "details", label: "Details", icon: Calendar },
            { id: "audience", label: "Teilnehmer", icon: Users },
            { id: "history", label: "Verlauf", icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-[#004941] border-b-2 border-[#004941]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Date & Time */}
              <div className="flex gap-4">
                <div className="w-14 text-center">
                  <div className="bg-[#004941] text-white rounded-t-lg py-1 text-xs font-medium">
                    {new Date(event.date).toLocaleDateString("de-DE", { month: "short" })}
                  </div>
                  <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg py-2">
                    <p className="text-2xl font-bold text-slate-800">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{formatDate(event.date)}</p>
                  {event.isAllDay ? (
                    <p className="text-amber-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Ganztägig
                    </p>
                  ) : (
                    <p className="text-slate-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </p>
                  )}
                </div>
              </div>

              {/* Location / Field – unified */}
              {(event.location || field) && (
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {field ? (
                      <>
                        {/* Booking status badge */}
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Spielstätte</p>
                          {event.bookingStatus === "not_confirmed" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Nicht bestätigt
                            </span>
                          ) : event.bookingStatus === "confirmed" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Bestätigt
                            </span>
                          ) : null}
                        </div>

                        {/* Conflict reason banner */}
                        {event.bookingStatus === "not_confirmed" && (
                          <div className="mb-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800">
                              Diese Buchung wurde als <strong>nicht bestätigt</strong> gespeichert, da zum Zeitpunkt der Zuweisung ein Zeitkonflikt mit einem anderen Termin oder einer Sperrzeit bestand. Bitte prüfen und manuell bestätigen.
                            </p>
                          </div>
                        )}

                        {/* Venue → Address → Field → Zone breadcrumb */}
                        <div className="space-y-1">
                          {/* Venue */}
                          {venue && (
                            <p className="font-semibold text-slate-800">{venue.name}</p>
                          )}
                          {/* Address */}
                          {(venue?.address || field.address) && (
                            <p className="text-xs text-slate-400">{venue?.address ?? field.address}</p>
                          )}
                          {/* Field */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <p className="text-sm font-medium text-slate-700">{field.name}</p>
                          </div>
                          {/* Zone info */}
                          {event.bookingScope === "zones" && bookedZones.length > 0 && (
                            <p className="text-xs text-slate-500 pl-5">
                              {bookedZones.map(z => z.name).join(", ")}
                            </p>
                          )}
                          {event.bookingScope === "full_field" && (
                            <p className="text-xs text-slate-400 pl-5">Ganzes Feld</p>
                          )}
                        </div>

                        {/* Zone grid visualization */}
                        {fieldIsDivisible(field) && (
                          <div className="mt-3">
                            <ZoneGrid
                              zones={field.zones}
                              ownZones={event.bookingScope === "zones" ? (event.bookedZoneIds ?? []) : []}
                              fullField={event.bookingScope === "full_field"}
                              readOnly
                              compact
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Ort</p>
                        <p className="font-medium text-slate-800">{event.location}</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {event.description && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Beschreibung</p>
                  <p className="text-slate-600 whitespace-pre-wrap">{event.description}</p>
                </div>
              )}

              {/* Audience Summary */}
              <div className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-800">Zielgruppe</span>
                  </div>
                  <span className="text-sm text-slate-500">{event.resolvedMemberCount || audience.length} Personen</span>
                </div>
                <p className="text-sm text-slate-600">{getAudienceDescription(event)}</p>
              </div>

              {/* RSVP Stats */}
              {event.rsvpRequired && event.rsvpStats && (
                <div className="p-4 border border-slate-200 rounded-xl">
                  <p className="font-medium text-slate-800 mb-4">Anmeldestatus</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xl font-bold text-emerald-600">{event.rsvpStats.confirmed}</p>
                      <p className="text-xs text-emerald-600">Zugesagt</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-xl font-bold text-red-600">{event.rsvpStats.declined}</p>
                      <p className="text-xs text-red-600">Abgesagt</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-lg">
                      <p className="text-xl font-bold text-amber-600">{event.rsvpStats.pending}</p>
                      <p className="text-xs text-amber-600">Ausstehend</p>
                    </div>
                    <div className="text-center p-3 bg-slate-100 rounded-lg">
                      <p className="text-xl font-bold text-slate-600">{event.rsvpStats.waitlist}</p>
                      <p className="text-xs text-slate-600">Warteliste</p>
                    </div>
                  </div>
                  {event.rsvpDeadline && (
                    <p className="text-xs text-slate-500 mt-3">
                      Anmeldefrist: {new Date(event.rsvpDeadline).toLocaleString("de-DE")}
                    </p>
                  )}
                  {event.maxParticipants && (
                    <p className="text-xs text-slate-500">
                      Max. Teilnehmer: {event.maxParticipants}
                    </p>
                  )}
                </div>
              )}

              {/* Recurrence */}
              {event.recurrence?.enabled && (
                <div className="flex items-center gap-3 p-4 bg-[#C8F2E0]/30 rounded-xl">
                  <RefreshCw className="w-5 h-5 text-[#004941]" />
                  <div>
                    <p className="font-medium text-[#004941]">Wiederkehrender Termin</p>
                    <p className="text-sm text-slate-600">
                      {event.recurrence.frequency === "daily" && "Täglich"}
                      {event.recurrence.frequency === "weekly" && "Wöchentlich"}
                      {event.recurrence.frequency === "biweekly" && "Alle 2 Wochen"}
                      {event.recurrence.frequency === "monthly" && "Monatlich"}
                      {event.recurrence.until && ` bis ${new Date(event.recurrence.until).toLocaleDateString("de-DE")}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-slate-400 space-y-1">
                <p>Erstellt von {event.createdByName} am {new Date(event.createdAt).toLocaleString("de-DE")}</p>
                <p>Zuletzt bearbeitet: {new Date(event.updatedAt).toLocaleString("de-DE")}</p>
              </div>
            </div>
          )}

          {activeTab === "audience" && (
            <div className="space-y-4">
              {/* Audience Mode Info */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  {event.audience.mode === "all" && <Users className="w-5 h-5 text-slate-600" />}
                  {event.audience.mode === "departments" && <Building2 className="w-5 h-5 text-slate-600" />}
                  {event.audience.mode === "groups" && <Users className="w-5 h-5 text-slate-600" />}
                  {event.audience.mode === "manual" && <Users className="w-5 h-5 text-slate-600" />}
                  <span className="font-medium text-slate-800">
                    {event.audience.mode === "all" && "Alle Mitglieder"}
                    {event.audience.mode === "departments" && "Nach Abteilung"}
                    {event.audience.mode === "groups" && "Nach Gruppe"}
                    {event.audience.mode === "manual" && "Manuell ausgewählt"}
                  </span>
                </div>
                {event.audience.mode === "departments" && event.audience.departmentIds && (
                  <div className="flex flex-wrap gap-2">
                    {event.audience.departmentIds.map(dId => {
                      const dept = getDepartmentById(dId);
                      return dept ? (
                        <span key={dId} className="px-2 py-1 bg-white rounded text-sm">
                          {dept.icon} {dept.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {event.audience.mode === "groups" && event.audience.groupIds && (
                  <div className="flex flex-wrap gap-2">
                    {event.audience.groupIds.map(gId => {
                      const grp = getGroupById(gId);
                      return grp ? (
                        <span key={gId} className="px-2 py-1 bg-white rounded text-sm">
                          {grp.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Member List */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Eingeladene Personen ({audience.length})
                </p>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {audience.map(member => (
                    <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                      {member.avatar ? (
                        <img src={member.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#004941] to-[#006B5A] flex items-center justify-center text-white text-sm font-medium">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{member.email || "—"}</p>
                      </div>
                      {event.rsvpStats && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-700">Statusverlauf</p>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {event.statusHistory.map((entry, i) => {
                    const colors = getStatusColor(entry.status);
                    return (
                      <div key={i} className="relative flex gap-4 pl-10">
                        <div className={`absolute left-2.5 w-3 h-3 rounded-full ${colors.bg} border-2 border-white`} />
                        <div className="flex-1 bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${colors.text}`}>
                              {getStatusLabel(entry.status)}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(entry.timestamp).toLocaleString("de-DE")}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">von {entry.userName}</p>
                          {entry.reason && (
                            <p className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded">
                              Grund: {entry.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <div className="flex items-center gap-3">
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Absagen</span>
              </button>
            )}
            <div className="flex-1" />
            {/* Option B — confirm button in drawer */}
            {event.bookingStatus === "not_confirmed" && onConfirm && (
              <button
                onClick={onConfirm}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Buchung bestätigen</span>
              </button>
            )}
            <button
              onClick={() => onDuplicate(event)}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Duplizieren</span>
            </button>
            {canEdit && (
              <button
                onClick={() => onEdit(event)}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Bearbeiten</span>
              </button>
            )}
            {canPublish && (
              <button
                onClick={() => onPublish(event)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Veröffentlichen</span>
              </button>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Event absagen</h3>
                  <p className="text-sm text-slate-500">{event.title}</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-4">
                Möchtest du dieses Event wirklich absagen? 
                {event.rsvpStats && event.rsvpStats.confirmed > 0 && (
                  <span className="text-red-600"> {event.rsvpStats.confirmed} Teilnehmer haben bereits zugesagt.</span>
                )}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Grund (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="z.B. Wetterbedingungen, Krankheit, ..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCancelModal(false); setCancelReason(""); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Event absagen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

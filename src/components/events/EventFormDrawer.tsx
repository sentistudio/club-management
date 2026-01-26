// Event Form Modal Component
// ==========================================
// Create/Edit event with Google Calendar UX

import { useState, useEffect, useRef } from "react";
import { 
  X, Calendar, MapPin, FileText, 
  Lock, Globe, Save, Send
} from "lucide-react";
import type { ClubEvent, ClubEventFormData } from "../../types/events";
import { AudienceSelector } from "./AudienceSelector";
import { RecurrenceEditor } from "./RecurrenceEditor";
import { RSVPSection } from "./RSVPSection";
import { ADMIN_USER, mockClubMembers, mockGroups } from "../../data/mockClubEvents";
import { generateEventId, createStatusHistoryEntry } from "../../utils/eventUtils";

interface EventFormDrawerProps {
  event?: ClubEvent | null;
  initialDate?: string; // Pre-fill date when clicking on calendar day
  onClose: () => void;
  onSave: (event: ClubEvent, isDraft: boolean) => void;
}

export function EventFormDrawer({ event, initialDate, onClose, onSave }: EventFormDrawerProps) {
  const isEditing = !!event;
  const titleRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<ClubEventFormData>({
    title: "",
    description: "",
    date: "",
    startTime: "18:00",
    endTime: "20:00",
    location: "",
    audienceMode: "all",
    departmentIds: [],
    groupIds: [],
    memberIds: [],
    visibility: "private",
    rsvpRequired: true,
    rsvpDeadline: "",
    maxParticipants: "",
    recurrenceEnabled: false,
    recurrenceFrequency: "weekly",
    recurrenceWeekdays: [],
    recurrenceUntil: ""
  });

  // Load event data when editing or set initial date
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location || "",
        audienceMode: event.audience.mode,
        departmentIds: event.audience.departmentIds || [],
        groupIds: event.audience.groupIds || [],
        memberIds: event.audience.memberIds || [],
        visibility: event.visibility,
        rsvpRequired: event.rsvpRequired,
        rsvpDeadline: event.rsvpDeadline || "",
        maxParticipants: event.maxParticipants?.toString() || "",
        recurrenceEnabled: event.recurrence?.enabled || false,
        recurrenceFrequency: event.recurrence?.frequency || "weekly",
        recurrenceWeekdays: event.recurrence?.weekdays || [],
        recurrenceUntil: event.recurrence?.until || ""
      });
    } else if (initialDate) {
      setFormData(prev => ({ ...prev, date: initialDate }));
    }
  }, [event, initialDate]);

  // Autofocus title
  useEffect(() => {
    if (!isEditing) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isEditing]);

  // Calculate resolved audience count
  const resolvedCount = (() => {
    switch (formData.audienceMode) {
      case "all":
        return mockClubMembers.length;
      case "departments":
        if (formData.departmentIds.length === 0) return 0;
        const deptMemberIds = new Set<string>();
        mockClubMembers.forEach(m => {
          if (m.departmentIds.some(dId => formData.departmentIds.includes(dId))) {
            deptMemberIds.add(m.id);
          }
        });
        return deptMemberIds.size;
      case "groups":
        if (formData.groupIds.length === 0) return 0;
        const grpMemberIds = new Set<string>();
        formData.groupIds.forEach(gId => {
          const group = mockGroups.find(g => g.id === gId);
          group?.memberIds.forEach(mId => grpMemberIds.add(mId));
        });
        return grpMemberIds.size;
      case "manual":
        return formData.memberIds.length;
    }
  })();

  const handleSubmit = (isDraft: boolean) => {
    const now = new Date().toISOString();
    const status = isDraft ? "draft" : "published";
    
    const newEvent: ClubEvent = {
      id: event?.id || generateEventId(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location.trim() || undefined,
      audience: {
        mode: formData.audienceMode,
        departmentIds: formData.audienceMode === "departments" ? formData.departmentIds : undefined,
        groupIds: formData.audienceMode === "groups" ? formData.groupIds : undefined,
        memberIds: formData.audienceMode === "manual" ? formData.memberIds : undefined
      },
      resolvedMemberCount: resolvedCount,
      visibility: formData.visibility,
      rsvpRequired: formData.rsvpRequired,
      rsvpDeadline: formData.rsvpRequired && formData.rsvpDeadline ? formData.rsvpDeadline : undefined,
      maxParticipants: formData.rsvpRequired && formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      rsvpStats: event?.rsvpStats || {
        invited: resolvedCount,
        confirmed: 0,
        declined: 0,
        pending: resolvedCount,
        waitlist: 0
      },
      recurrence: formData.recurrenceEnabled ? {
        enabled: true,
        frequency: formData.recurrenceFrequency,
        weekdays: formData.recurrenceFrequency === "weekly" ? formData.recurrenceWeekdays : undefined,
        until: formData.recurrenceUntil || undefined
      } : undefined,
      status: status,
      statusHistory: event?.statusHistory 
        ? [...event.statusHistory, createStatusHistoryEntry(status, ADMIN_USER.id, ADMIN_USER.name)]
        : [createStatusHistoryEntry(status, ADMIN_USER.id, ADMIN_USER.name)],
      createdAt: event?.createdAt || now,
      createdBy: event?.createdBy || ADMIN_USER.id,
      createdByName: event?.createdByName || ADMIN_USER.name,
      updatedAt: now
    };

    onSave(newEvent, isDraft);
  };

  const isValid = formData.title.trim() && formData.date && formData.startTime && formData.endTime;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? "Event bearbeiten" : "Neues Event"}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Title - Primary Focus */}
            <div>
              <input
                ref={titleRef}
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Titel hinzufügen"
                className="w-full text-2xl font-semibold text-slate-800 placeholder-slate-400 border-0 border-b-2 border-transparent focus:border-[#004941] focus:outline-none pb-2 transition-colors"
              />
            </div>

            {/* Date & Time Row */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 mt-1 bg-slate-100 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Beginn</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Ende</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 mt-1 bg-slate-100 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-600" />
              </div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ort hinzufügen"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
              />
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 mt-1 bg-slate-100 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschreibung hinzufügen"
                rows={4}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941] resize-none"
              />
            </div>

            {/* Divider */}
            <hr className="border-slate-200" />

            {/* Audience Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                Teilnehmer
              </h3>
              <AudienceSelector
                mode={formData.audienceMode}
                departmentIds={formData.departmentIds}
                groupIds={formData.groupIds}
                memberIds={formData.memberIds}
                onModeChange={(mode) => setFormData({ ...formData, audienceMode: mode })}
                onDepartmentIdsChange={(ids) => setFormData({ ...formData, departmentIds: ids })}
                onGroupIdsChange={(ids) => setFormData({ ...formData, groupIds: ids })}
                onMemberIdsChange={(ids) => setFormData({ ...formData, memberIds: ids })}
              />
            </div>

            {/* Divider */}
            <hr className="border-slate-200" />

            {/* Visibility Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                Sichtbarkeit
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: "private" })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    formData.visibility === "private"
                      ? "border-[#004941] bg-[#C8F2E0]/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Lock className={`w-5 h-5 ${formData.visibility === "private" ? "text-[#004941]" : "text-slate-400"}`} />
                  <div>
                    <p className={`font-medium ${formData.visibility === "private" ? "text-[#004941]" : "text-slate-800"}`}>
                      Privat
                    </p>
                    <p className="text-xs text-slate-500">Nur im "Mein Kalender"</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: "public" })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    formData.visibility === "public"
                      ? "border-[#004941] bg-[#C8F2E0]/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Globe className={`w-5 h-5 ${formData.visibility === "public" ? "text-[#004941]" : "text-slate-400"}`} />
                  <div>
                    <p className={`font-medium ${formData.visibility === "public" ? "text-[#004941]" : "text-slate-800"}`}>
                      Öffentlich
                    </p>
                    <p className="text-xs text-slate-500">Im Club-Kalender sichtbar</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-slate-200" />

            {/* RSVP Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                Anmeldung
              </h3>
              <RSVPSection
                required={formData.rsvpRequired}
                deadline={formData.rsvpDeadline}
                maxParticipants={formData.maxParticipants}
                onRequiredChange={(val) => setFormData({ ...formData, rsvpRequired: val })}
                onDeadlineChange={(val) => setFormData({ ...formData, rsvpDeadline: val })}
                onMaxParticipantsChange={(val) => setFormData({ ...formData, maxParticipants: val })}
                eventDate={formData.date}
              />
            </div>

            {/* Divider */}
            <hr className="border-slate-200" />

            {/* Recurrence Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                Wiederholung
              </h3>
              <RecurrenceEditor
                enabled={formData.recurrenceEnabled}
                frequency={formData.recurrenceFrequency}
                weekdays={formData.recurrenceWeekdays}
                until={formData.recurrenceUntil}
                startDate={formData.date}
                startTime={formData.startTime}
                endTime={formData.endTime}
                onEnabledChange={(val) => setFormData({ ...formData, recurrenceEnabled: val })}
                onFrequencyChange={(val) => setFormData({ ...formData, recurrenceFrequency: val })}
                onWeekdaysChange={(val) => setFormData({ ...formData, recurrenceWeekdays: val })}
                onUntilChange={(val) => setFormData({ ...formData, recurrenceUntil: val })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={!isValid}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>Als Entwurf speichern</span>
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!isValid}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>Veröffentlichen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

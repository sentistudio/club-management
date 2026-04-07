// Event Form Modal Component
// ==========================================
// Create/Edit event with Google Calendar UX

import { useState, useEffect, useRef } from "react";
import {
  X, Calendar, MapPin, FileText,
  Lock, Globe, Save, Send, Image, Upload, Check
} from "lucide-react";
import type { ClubEvent, ClubEventFormData } from "../../types/events";
import { DEFAULT_BANNERS } from "../../types/events";
import { AudienceSelector } from "./AudienceSelector";
import { RecurrenceEditor } from "./RecurrenceEditor";
import { RSVPSection } from "./RSVPSection";
import { ResourcePickerPanel } from "../fields/ResourcePickerPanel";
import { getFieldById, checkConflict } from "../../data/mockFields";
import { ADMIN_USER, mockClubMembers, mockGroups, mockClubEvents } from "../../data/mockClubEvents";
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
    isAllDay: false,
    startTime: "18:00",
    endTime: "20:00",
    location: "",
    bannerImage: "",
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
    recurrenceUntil: "",
    fieldId: "",
    bookingScope: "full_field",
    bookedZoneIds: [],
  });
  
  const [showBannerPicker, setShowBannerPicker] = useState(false);
  const [locationType, setLocationType] = useState<"address" | "field">("address");

  // Load event data when editing or set initial date
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: event.date,
        isAllDay: event.isAllDay || false,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location || "",
        bannerImage: event.bannerImage || "",
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
        recurrenceUntil: event.recurrence?.until || "",
        fieldId: event.fieldId || "",
        bookingScope: event.bookingScope || "full_field",
        bookedZoneIds: event.bookedZoneIds || [],
      });
      setLocationType(event.fieldId ? "field" : "address");
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
    
    // Determine booking status: check for conflicts at save time
    const computedBookingStatus: "confirmed" | "not_confirmed" | undefined = (() => {
      if (!formData.fieldId) return undefined;
      const conflicts = checkConflict(
        mockClubEvents,
        formData.fieldId,
        formData.bookingScope,
        formData.bookedZoneIds,
        formData.date,
        formData.isAllDay ? "00:00" : formData.startTime,
        formData.isAllDay ? "23:59" : formData.endTime,
        event?.id
      );
      return conflicts.length > 0 ? "not_confirmed" : "confirmed";
    })();

    const newEvent: ClubEvent = {
      id: event?.id || generateEventId(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      date: formData.date,
      isAllDay: formData.isAllDay,
      startTime: formData.isAllDay ? "00:00" : formData.startTime,
      endTime: formData.isAllDay ? "23:59" : formData.endTime,
      location: formData.location.trim() || undefined,
      bannerImage: formData.bannerImage || undefined,
      fieldId: formData.fieldId || undefined,
      bookingScope: formData.fieldId ? formData.bookingScope : undefined,
      bookedZoneIds: formData.fieldId && formData.bookingScope === "zones" ? formData.bookedZoneIds : undefined,
      bookingStatus: computedBookingStatus,
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

  const isValid = formData.title.trim() && formData.date && (formData.isAllDay || (formData.startTime && formData.endTime));

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
          
          {/* Banner Image - At top like final display */}
          {formData.bannerImage ? (
            <div className="relative h-36 overflow-hidden">
              <img 
                src={formData.bannerImage} 
                alt="Event Banner" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bannerImage: "" })}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowBannerPicker(true)}
                className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white text-sm flex items-center gap-1.5"
              >
                <Image className="w-4 h-4" />
                Ändern
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowBannerPicker(true)}
              className="w-full h-24 flex items-center justify-center gap-2 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <Image className="w-5 h-5" />
              <span>Banner hinzufügen</span>
            </button>
          )}
          
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
                <div className="flex items-center gap-4">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
                  />
                  {/* All Day Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={formData.isAllDay}
                      onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-[#004941] focus:ring-[#004941]"
                    />
                    <span className="text-sm text-slate-600">Ganztägig</span>
                  </label>
                </div>
                {!formData.isAllDay && (
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
                )}
                
                {/* Recurrence - Right after date/time for better context */}
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

            {/* Location – unified section with shared icon */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 mt-1 bg-slate-100 rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 space-y-3">
                {/* Free-text address (only when not using a venue) */}
                {locationType === "address" && (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ort hinzufügen"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
                  />
                )}

                {/* Venue resource toggle */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-800">Vereinsplatz</p>
                    <p className="text-xs text-slate-500">Ressource aus dem Verein buchen</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={locationType === "field"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, location: "" }));
                          setLocationType("field");
                        } else {
                          const fieldAddr = formData.fieldId ? getFieldById(formData.fieldId)?.address : undefined;
                          setFormData(prev => ({
                            ...prev,
                            fieldId: "",
                            bookingScope: "full_field" as const,
                            bookedZoneIds: [],
                            location: fieldAddr || prev.location,
                          }));
                          setLocationType("address");
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]"></div>
                  </label>
                </div>

                {/* Resource / zone picker */}
                {locationType === "field" && (
                  <ResourcePickerPanel
                    fieldId={formData.fieldId}
                    bookingScope={formData.bookingScope}
                    bookedZoneIds={formData.bookedZoneIds}
                    date={formData.date}
                    startTime={formData.startTime}
                    endTime={formData.endTime}
                    excludeEventId={event?.id}
                    onChange={patch => setFormData(prev => {
                      const next = { ...prev, ...patch };
                      if (patch.fieldId !== undefined) {
                        if (patch.fieldId) {
                          const f = getFieldById(patch.fieldId);
                          if (f?.address) {
                            const prevFieldAddr = prev.fieldId ? getFieldById(prev.fieldId)?.address : undefined;
                            if (!prev.location || prev.location === prevFieldAddr) {
                              next.location = f.address;
                            }
                          }
                        } else {
                          const prevFieldAddr = prev.fieldId ? getFieldById(prev.fieldId)?.address : undefined;
                          if (prevFieldAddr && prev.location === prevFieldAddr) {
                            next.location = "";
                          }
                        }
                      }
                      return next;
                    })}
                  />
                )}
              </div>
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

      {/* Banner Picker Modal */}
      {showBannerPicker && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Banner auswählen</h3>
              <button 
                onClick={() => setShowBannerPicker(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Upload Custom */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 mb-3">Eigenes Bild hochladen</p>
                <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-[#004941] hover:text-[#004941] cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Bild auswählen (JPG, PNG)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setFormData({ ...formData, bannerImage: ev.target?.result as string });
                          setShowBannerPicker(false);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              
              {/* Default Banners */}
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Oder Vorlage wählen</p>
                <div className="grid grid-cols-2 gap-3">
                  {DEFAULT_BANNERS.map(banner => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, bannerImage: banner.url });
                        setShowBannerPicker(false);
                      }}
                      className={`relative rounded-xl overflow-hidden h-24 group ${
                        formData.bannerImage === banner.url ? "ring-2 ring-[#004941]" : ""
                      }`}
                    >
                      <img 
                        src={banner.url} 
                        alt={banner.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{banner.label}</span>
                      </div>
                      {formData.bannerImage === banner.url && (
                        <div className="absolute top-2 right-2 p-1 bg-[#004941] rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setShowBannerPicker(false)}
                className="w-full px-4 py-2.5 bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
import { TeamAudienceSelector } from "./TeamAudienceSelector";
import { RecurrenceEditor } from "./RecurrenceEditor";
import { RSVPSection } from "./RSVPSection";
import { ResourcePickerPanel } from "../fields/ResourcePickerPanel";
import { getFieldById, checkConflict } from "../../data/mockFields";
import { ADMIN_USER, mockClubMembers, mockGroups, mockClubEvents } from "../../data/mockClubEvents";
import { generateEventId, createStatusHistoryEntry } from "../../utils/eventUtils";
import type { TeamEvent, TeamEventType, TeamEventVisibility, MatchType } from "../../data/mockTeamEvents";
import { mockTeams } from "../../data/mockTeams";

interface EventFormDrawerProps {
  event?: ClubEvent | null;
  initialDate?: string; // Pre-fill date when clicking on calendar day
  onClose: () => void;
  onSave: (event: ClubEvent, isDraft: boolean) => void;
  onSaveTeam?: (event: TeamEvent) => void;
}

export function EventFormDrawer({ event, initialDate, onClose, onSave, onSaveTeam }: EventFormDrawerProps) {
  const isEditing = !!event;
  const titleRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<ClubEventFormData>({
    title: "",
    description: "",
    date: "",
    endDate: "",
    isAllDay: false,
    startTime: "18:00",
    endTime: "20:00",
    location: "",
    bannerImage: "",
    isClubWide: true,
    departmentIds: [],
    groupIds: [],
    memberIds: [],
    visibility: "private",
    rsvpRequired: true,
    rsvpHoursBefore: 24,
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
  const [eventScope, setEventScope] = useState<"club" | "team">("club");
  const [teamForm, setTeamForm] = useState<{
    teamId: string;
    type: TeamEventType;
    opponent: string;
    isHome: boolean;
    matchType: MatchType;
    visibility: TeamEventVisibility;
    audienceTeamIds: string[];
    audienceGroupIds: string[];
    audienceMemberIds: string[];
  }>({ teamId: "", type: "training", opponent: "", isHome: true, matchType: "league", visibility: "team_only", audienceTeamIds: [], audienceGroupIds: [], audienceMemberIds: [] });

  const TEAM_SEASON: Record<string, string> = {
    team_u12: "s2024_u12", team1: "s2024_team1",
    team_volleyball_u16: "s2024_vu16", team_frauen_ue40: "s2024_frauen", team_fitness: "s2024_fitness",
  };

  // Load event data when editing or set initial date
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || "",
        date: event.date,
        endDate: event.endDate || "",
        isAllDay: event.isAllDay || false,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location || "",
        bannerImage: event.bannerImage || "",
        isClubWide: event.audience.isClubWide ?? event.audience.mode === "all",
        departmentIds: event.audience.departmentIds || [],
        groupIds: event.audience.groupIds || [],
        memberIds: event.audience.memberIds || [],
        visibility: event.visibility,
        rsvpRequired: event.rsvpRequired,
        rsvpHoursBefore: event.rsvpHoursBefore ?? 24,
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

  // Calculate resolved audience count (multi-source, combined)
  const resolvedCount = (() => {
    if (formData.isClubWide) return mockClubMembers.length;
    const ids = new Set<string>();
    mockClubMembers.forEach(m => {
      if (m.departmentIds.some(dId => formData.departmentIds.includes(dId))) ids.add(m.id);
    });
    formData.groupIds.forEach(gId => {
      mockGroups.find(g => g.id === gId)?.memberIds.forEach(mId => ids.add(mId));
    });
    formData.memberIds.forEach(id => ids.add(id));
    return ids.size;
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
        mode: formData.isClubWide ? "all" : "manual",
        isClubWide: formData.isClubWide,
        departmentIds: !formData.isClubWide && formData.departmentIds.length ? formData.departmentIds : undefined,
        groupIds: !formData.isClubWide && formData.groupIds.length ? formData.groupIds : undefined,
        memberIds: !formData.isClubWide && formData.memberIds.length ? formData.memberIds : undefined,
      },
      resolvedMemberCount: resolvedCount,
      visibility: formData.visibility,
      rsvpRequired: formData.rsvpRequired,
      rsvpHoursBefore: formData.rsvpRequired ? formData.rsvpHoursBefore : undefined,
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

  const handleSaveTeamEvent = () => {
    const te: TeamEvent = {
      id: `te_admin_${Date.now()}`,
      teamId: teamForm.teamId,
      seasonId: TEAM_SEASON[teamForm.teamId] ?? "s2024",
      type: teamForm.type,
      title: teamForm.type === "match"
        ? `vs. ${teamForm.opponent}`
        : formData.title.trim() || (teamForm.type === "training" ? "Training" : "Allgemein"),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location.trim() || undefined,
      description: formData.description.trim() || undefined,
      visibility: teamForm.visibility,
      opponent: teamForm.type === "match" ? teamForm.opponent : undefined,
      isHome: teamForm.type === "match" ? teamForm.isHome : undefined,
      matchType: teamForm.type === "match" ? teamForm.matchType : undefined,
      audienceTeamIds: teamForm.audienceTeamIds.length ? teamForm.audienceTeamIds : undefined,
      audienceGroupIds: teamForm.audienceGroupIds.length ? teamForm.audienceGroupIds : undefined,
      audienceMemberIds: teamForm.audienceMemberIds.length ? teamForm.audienceMemberIds : undefined,
      recurrence: formData.recurrenceEnabled ? {
        frequency: formData.recurrenceFrequency === "biweekly" ? "biweekly" : "weekly",
        weekdays: formData.recurrenceWeekdays,
        until: formData.recurrenceUntil || "",
      } : undefined,
      isRecurring: formData.recurrenceEnabled,
      rsvpRequired: formData.rsvpRequired || undefined,
      rsvpHoursBefore: formData.rsvpRequired ? formData.rsvpHoursBefore : undefined,
      maxParticipants: formData.rsvpRequired && formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      attendanceList: [],
      status: "scheduled",
      createdBy: ADMIN_USER.id,
    };
    onSaveTeam?.(te);
    onClose();
  };

  const isTeamValid = !!(teamForm.teamId && formData.date && formData.startTime && formData.endTime
    && (teamForm.type !== "match" || teamForm.opponent.trim()));
  const isValid = eventScope === "team" ? isTeamValid
    : !!(formData.title.trim() && formData.date && (formData.isAllDay || (formData.startTime && formData.endTime)));

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

          {/* Scope Toggle – only for new events */}
          {!isEditing && (
            <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
                <button type="button" onClick={() => setEventScope("club")}
                  className={`flex-1 py-2 font-medium transition-colors ${eventScope === "club" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  Vereinstermin
                </button>
                <button type="button" onClick={() => setEventScope("team")}
                  className={`flex-1 py-2 font-medium transition-colors ${eventScope === "team" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  Mannschaftstermin
                </button>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto">

          {/* Banner Image - shown for both scopes */}
          {(formData.bannerImage ? (
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
          ))}
          
          <div className="p-6 space-y-6">

            {/* Title - always first */}
            {(eventScope === "club" || teamForm.type !== "match") && (
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
            )}

            {/* Team event fields: Mannschaft + Terminart + Match details */}
            {eventScope === "team" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Mannschaft</label>
                  <select
                    value={teamForm.teamId}
                    onChange={e => setTeamForm(p => ({ ...p, teamId: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm bg-white"
                  >
                    <option value="">Mannschaft auswählen…</option>
                    {mockTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Terminart</label>
                  <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
                    {(["training", "match", "general"] as TeamEventType[]).map(type => (
                      <button key={type} type="button"
                        onClick={() => setTeamForm(p => ({ ...p, type }))}
                        className={`flex-1 py-2 font-medium transition-colors ${teamForm.type === type ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                        {type === "training" ? "Training" : type === "match" ? "Spiel" : "Allgemein"}
                      </button>
                    ))}
                  </div>
                </div>
                {teamForm.type === "match" && (
                  <div className="space-y-3 p-4 bg-emerald-50 rounded-[10px]">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Spieldetails</p>
                    <input
                      type="text"
                      placeholder="Gegner (z.B. TV Lich U12)"
                      value={teamForm.opponent}
                      onChange={e => setTeamForm(p => ({ ...p, opponent: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-emerald-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-white"
                    />
                    <div className="flex gap-2">
                      <div className="flex rounded-lg border border-emerald-200 overflow-hidden text-sm flex-1">
                        <button type="button" onClick={() => setTeamForm(p => ({ ...p, isHome: true }))}
                          className={`flex-1 py-2 ${teamForm.isHome ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}>Heim</button>
                        <button type="button" onClick={() => setTeamForm(p => ({ ...p, isHome: false }))}
                          className={`flex-1 py-2 ${!teamForm.isHome ? "bg-emerald-600 text-white" : "bg-white text-slate-600"}`}>Auswärts</button>
                      </div>
                      <select
                        value={teamForm.matchType}
                        onChange={e => setTeamForm(p => ({ ...p, matchType: e.target.value as MatchType }))}
                        className="flex-1 px-3 py-2 border border-emerald-200 rounded-[10px] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        <option value="league">Liga</option>
                        <option value="cup">Pokal</option>
                        <option value="friendly">Freundschaftsspiel</option>
                        <option value="tournament">Turnier</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Date & Time – iOS Calendar style */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 mt-1 bg-slate-100 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 space-y-3">
                {/* Start row */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Beginn</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => {
                        const d = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          date: d,
                          endDate: prev.endDate && prev.endDate >= d ? prev.endDate : "",
                        }));
                      }}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                    />
                  </div>
                  {!formData.isAllDay && (
                    <div className="w-28">
                      <label className="block text-xs text-slate-500 mb-1">Uhrzeit</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* End row */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Ende</label>
                    <input
                      type="date"
                      value={formData.endDate || formData.date}
                      min={formData.date}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                    />
                  </div>
                  {!formData.isAllDay && (
                    <div className="w-28">
                      <label className="block text-xs text-slate-500 mb-1">Uhrzeit</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* All Day Toggle – below the date rows */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <span className="text-sm text-slate-600">Ganztägig</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAllDay}
                      onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]" />
                  </label>
                </div>

                {/* Multi-day indicator */}
                {formData.endDate && formData.endDate > formData.date && (
                  <div className="flex items-center gap-2 text-xs text-[#004941] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004941] flex-shrink-0" />
                    Mehrtägiges Event
                  </div>
                )}
                
                {/* Recurrence */}
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
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941]"
                  />
                )}

                {/* Venue resource toggle */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-[10px]">
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
                className="flex-1 px-4 py-3 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941] resize-none"
              />
            </div>

            {/* Divider */}
            <hr className="border-slate-200" />

            {/* Audience Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                Teilnehmer
              </h3>
              {eventScope === "club" ? (
                <AudienceSelector
                  isClubWide={formData.isClubWide}
                  departmentIds={formData.departmentIds}
                  groupIds={formData.groupIds}
                  memberIds={formData.memberIds}
                  onIsClubWideChange={(val) => setFormData({ ...formData, isClubWide: val })}
                  onDepartmentIdsChange={(ids) => setFormData({ ...formData, departmentIds: ids })}
                  onGroupIdsChange={(ids) => setFormData({ ...formData, groupIds: ids })}
                  onMemberIdsChange={(ids) => setFormData({ ...formData, memberIds: ids })}
                />
              ) : (
                <TeamAudienceSelector
                  teamIds={teamForm.audienceTeamIds}
                  groupIds={teamForm.audienceGroupIds}
                  memberIds={teamForm.audienceMemberIds}
                  primaryTeamId={teamForm.teamId}
                  onTeamIdsChange={(ids) => setTeamForm(p => ({ ...p, audienceTeamIds: ids }))}
                  onGroupIdsChange={(ids) => setTeamForm(p => ({ ...p, audienceGroupIds: ids }))}
                  onMemberIdsChange={(ids) => setTeamForm(p => ({ ...p, audienceMemberIds: ids }))}
                />
              )}
            </div>

            {/* Divider */}
            <hr className="border-slate-200" />

            {/* Visibility Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-4">
                Sichtbarkeit
              </h3>
              {eventScope === "club" ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visibility: "private" })}
                  className={`flex items-center gap-3 p-4 rounded-[10px] border-2 text-left transition-all ${
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
                  className={`flex items-center gap-3 p-4 rounded-[10px] border-2 text-left transition-all ${
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
              ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTeamForm(p => ({ ...p, visibility: "team_only" }))}
                  className={`flex items-center gap-3 p-4 rounded-[10px] border-2 text-left transition-all ${
                    teamForm.visibility === "team_only"
                      ? "border-[#004941] bg-[#C8F2E0]/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Lock className={`w-5 h-5 ${teamForm.visibility === "team_only" ? "text-[#004941]" : "text-slate-400"}`} />
                  <div>
                    <p className={`font-medium ${teamForm.visibility === "team_only" ? "text-[#004941]" : "text-slate-800"}`}>Nur Team</p>
                    <p className="text-xs text-slate-500">Team + Vereinsadmins</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTeamForm(p => ({ ...p, visibility: "public" }))}
                  className={`flex items-center gap-3 p-4 rounded-[10px] border-2 text-left transition-all ${
                    teamForm.visibility === "public"
                      ? "border-[#004941] bg-[#C8F2E0]/30"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Globe className={`w-5 h-5 ${teamForm.visibility === "public" ? "text-[#004941]" : "text-slate-400"}`} />
                  <div>
                    <p className={`font-medium ${teamForm.visibility === "public" ? "text-[#004941]" : "text-slate-800"}`}>Öffentlich</p>
                    <p className="text-xs text-slate-500">Im Vereinskalender</p>
                  </div>
                </button>
              </div>
              )}
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
                hoursBefore={formData.rsvpHoursBefore}
                maxParticipants={formData.maxParticipants}
                onRequiredChange={(val) => setFormData({ ...formData, rsvpRequired: val })}
                onHoursBeforeChange={(val) => setFormData({ ...formData, rsvpHoursBefore: val })}
                onMaxParticipantsChange={(val) => setFormData({ ...formData, maxParticipants: val })}
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
              {eventScope === "club" ? (
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
              ) : (
              <button
                onClick={handleSaveTeamEvent}
                disabled={!isValid}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Termin speichern</span>
              </button>
              )}
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
                <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-300 rounded-[10px] text-slate-600 hover:border-[#004941] hover:text-[#004941] cursor-pointer transition-colors">
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
                      className={`relative rounded-[10px] overflow-hidden h-24 group ${
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

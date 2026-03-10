// Simple i18n system for the portals

export type Language = "de" | "en";

export const translations = {
  // ==========================================
  // COMMON
  // ==========================================
  common: {
    search: { de: "Suchen", en: "Search" },
    searchPlaceholder: { de: "Suchen...", en: "Search..." },
    cancel: { de: "Abbrechen", en: "Cancel" },
    save: { de: "Speichern", en: "Save" },
    delete: { de: "Löschen", en: "Delete" },
    edit: { de: "Bearbeiten", en: "Edit" },
    close: { de: "Schließen", en: "Close" },
    back: { de: "Zurück", en: "Back" },
    next: { de: "Weiter", en: "Next" },
    all: { de: "Alle", en: "All" },
    today: { de: "Heute", en: "Today" },
    tomorrow: { de: "Morgen", en: "Tomorrow" },
    thisWeek: { de: "Diese Woche", en: "This Week" },
    thisMonth: { de: "Diesen Monat", en: "This Month" },
    later: { de: "Später", en: "Later" },
    past: { de: "Vergangen", en: "Past" },
    noResults: { de: "Keine Ergebnisse", en: "No results" },
    loading: { de: "Laden...", en: "Loading..." },
    yes: { de: "Ja", en: "Yes" },
    no: { de: "Nein", en: "No" },
    confirm: { de: "Bestätigen", en: "Confirm" },
    details: { de: "Details", en: "Details" },
    showAll: { de: "Alle anzeigen", en: "Show all" },
    allDay: { de: "Ganztägig", en: "All day" },
    confirmed: { de: "bestätigt", en: "confirmed" },
    participants: { de: "Teilnehmer", en: "Participants" },
  },

  // ==========================================
  // NAVIGATION
  // ==========================================
  nav: {
    home: { de: "Startseite", en: "Home" },
    // Shared between admin and member - use consistent labels
    events: { de: "Veranstaltungen", en: "Events" }, // Admin: "Veranstaltungen", Member: same
    calendar: { de: "Veranstaltungen", en: "Events" }, // Alias for events (calendar view)
    chats: { de: "Nachrichten", en: "Messages" },
    news: { de: "Club News", en: "Club News" }, // Admin: "Club News", Member: same
    profile: { de: "Mein Profil", en: "My Profile" },
    settings: { de: "Einstellungen", en: "Settings" },
    logout: { de: "Abmelden", en: "Logout" },
    members: { de: "Mitglieder", en: "Members" },
    teams: { de: "Teams", en: "Teams" },
    inbox: { de: "Postfach", en: "Inbox" },
    clubEvents: { de: "Veranstaltungen", en: "Events" },
    memberApp: { de: "Mobile App", en: "Mobile App" },
    memberPortal: { de: "Mitglieder-Portal", en: "Member Portal" },
  },

  // ==========================================
  // EVENTS
  // ==========================================
  events: {
    title: { de: "Titel", en: "Title" },
    titlePlaceholder: { de: "Event-Titel eingeben...", en: "Enter event title..." },
    description: { de: "Beschreibung", en: "Description" },
    descriptionPlaceholder: { de: "Beschreibung hinzufügen...", en: "Add description..." },
    location: { de: "Ort", en: "Location" },
    locationPlaceholder: { de: "Ort hinzufügen...", en: "Add location..." },
    date: { de: "Datum", en: "Date" },
    time: { de: "Zeit", en: "Time" },
    startTime: { de: "Startzeit", en: "Start time" },
    endTime: { de: "Endzeit", en: "End time" },
    newEvent: { de: "Neue Veranstaltung", en: "New Event" },
    editEvent: { de: "Event bearbeiten", en: "Edit Event" },
    createEvent: { de: "Event erstellen", en: "Create Event" },
    eventDetails: { de: "Event Details", en: "Event Details" },
    noEvents: { de: "Keine Termine", en: "No events" },
    noEventsDesc: { de: "Deine Termine erscheinen hier", en: "Your events will appear here" },
    noEventsOnDay: { de: "Keine Termine an diesem Tag", en: "No events on this day" },
    selectAnotherDay: { de: "Wähle einen anderen Tag", en: "Select another day" },
    upcoming: { de: "Anstehend", en: "Upcoming" },
    drafts: { de: "Entwürfe", en: "Drafts" },
    total: { de: "Gesamt", en: "Total" },
    
    // Status
    status: { de: "Status", en: "Status" },
    allStatus: { de: "Alle Status", en: "All Status" },
    draft: { de: "Entwurf", en: "Draft" },
    published: { de: "Veröffentlicht", en: "Published" },
    cancelled: { de: "Abgesagt", en: "Cancelled" },
    completed: { de: "Abgeschlossen", en: "Completed" },
    
    // Visibility
    visibility: { de: "Sichtbarkeit", en: "Visibility" },
    allVisibility: { de: "Sichtbarkeit", en: "Visibility" },
    public: { de: "Öffentlich", en: "Public" },
    private: { de: "Privat", en: "Private" },
    publicDesc: { de: "Für alle Mitglieder sichtbar", en: "Visible to all members" },
    privateDesc: { de: "Nur für eingeladene Personen sichtbar", en: "Only visible to invited people" },
    
    // Audience
    audience: { de: "Zielgruppe", en: "Audience" },
    audienceAll: { de: "Alle Mitglieder", en: "All members" },
    audienceDepartments: { de: "Abteilungen", en: "Departments" },
    audienceGroups: { de: "Gruppen", en: "Groups" },
    audienceManual: { de: "Manuell", en: "Manual" },
    invitedMembers: { de: "eingeladene Mitglieder", en: "invited members" },
    showParticipants: { de: "Teilnehmer anzeigen", en: "Show participants" },
    
    // RSVP
    rsvp: { de: "Zu-/Absage", en: "RSVP" },
    rsvpRequired: { de: "Rückmeldung erforderlich", en: "RSVP required" },
    rsvpDeadline: { de: "Anmeldefrist", en: "Registration deadline" },
    maxParticipants: { de: "Max. Teilnehmer", en: "Max. participants" },
    rsvpStats: { de: "Rückmeldungen", en: "Responses" },
    
    // Recurrence
    recurrence: { de: "Wiederholung", en: "Recurrence" },
    recurring: { de: "Wiederkehrend", en: "Recurring" },
    noRecurrence: { de: "Keine Wiederholung", en: "No recurrence" },
    daily: { de: "Täglich", en: "Daily" },
    weekly: { de: "Wöchentlich", en: "Weekly" },
    biweekly: { de: "Alle 2 Wochen", en: "Biweekly" },
    monthly: { de: "Monatlich", en: "Monthly" },
    until: { de: "Bis", en: "Until" },
    nextOccurrences: { de: "Nächste Termine", en: "Next occurrences" },
    
    // Actions
    publish: { de: "Veröffentlichen", en: "Publish" },
    saveAsDraft: { de: "Als Entwurf speichern", en: "Save as Draft" },
    duplicate: { de: "Duplizieren", en: "Duplicate" },
    cancelEvent: { de: "Absagen", en: "Cancel Event" },
    cancelReason: { de: "Grund für Absage (optional)", en: "Cancellation reason (optional)" },
    confirmCancel: { de: "Event wirklich absagen?", en: "Really cancel this event?" },
    
    // Event types
    type: { de: "Typ", en: "Type" },
    meeting: { de: "Sitzung", en: "Meeting" },
    assembly: { de: "Versammlung", en: "Assembly" },
    workshop: { de: "Workshop", en: "Workshop" },
    social: { de: "Gesellig", en: "Social" },
    other: { de: "Sonstiges", en: "Other" },
    
    // Banner
    banner: { de: "Banner", en: "Banner" },
    selectBanner: { de: "Banner auswählen", en: "Select banner" },
    uploadBanner: { de: "Banner hochladen", en: "Upload banner" },
    removeBanner: { de: "Banner entfernen", en: "Remove banner" },
    
    // Status history
    statusHistory: { de: "Status-Verlauf", en: "Status History" },
    createdBy: { de: "Erstellt von", en: "Created by" },
    publishedBy: { de: "Veröffentlicht von", en: "Published by" },
    cancelledBy: { de: "Abgesagt von", en: "Cancelled by" },
  },

  // ==========================================
  // VIEWS
  // ==========================================
  views: {
    list: { de: "Liste", en: "List" },
    calendar: { de: "Kalender", en: "Calendar" },
    day: { de: "Tag", en: "Day" },
    week: { de: "Woche", en: "Week" },
    month: { de: "Monat", en: "Month" },
  },

  // ==========================================
  // MEMBER PORTAL
  // ==========================================
  memberPortal: {
    welcome: { de: "Willkommen", en: "Welcome" },
    upcomingEvents: { de: "Nächste Termine", en: "Upcoming Events" },
    quickActions: { de: "Schnellzugriff", en: "Quick Actions" },
    recentNews: { de: "Neuigkeiten", en: "Recent News" },
    myTeams: { de: "Meine Teams", en: "My Teams" },
    myProfile: { de: "Mein Profil", en: "My Profile" },
    backToCalendar: { de: "Zurück zum Kalender", en: "Back to Calendar" },
    noChats: { de: "Keine Nachrichten", en: "No messages" },
    noChatsDesc: { de: "Deine Nachrichten erscheinen hier", en: "Your messages will appear here" },
    announcements: { de: "Ankündigungen", en: "Announcements" },
    teamChats: { de: "Team-Chats", en: "Team Chats" },
    directMessages: { de: "Direktnachrichten", en: "Direct Messages" },
    requests: { de: "Anfragen", en: "Requests" },
    newRequest: { de: "Neue Anfrage", en: "New Request" },
    memberCard: { de: "Mitgliedsausweis", en: "Member Card" },
    billing: { de: "Rechnungen", en: "Billing" },
    documents: { de: "Dokumente", en: "Documents" },
  },

  // ==========================================
  // ADMIN PORTAL
  // ==========================================
  adminPortal: {
    dashboard: { de: "Übersicht", en: "Dashboard" },
    memberManagement: { de: "Mitgliederverwaltung", en: "Member Management" },
    teamManagement: { de: "Teamverwaltung", en: "Team Management" },
    eventManagement: { de: "Terminverwaltung", en: "Event Management" },
    chatModeration: { de: "Chat-Moderation", en: "Chat Moderation" },
    reports: { de: "Berichte", en: "Reports" },
    settings: { de: "Einstellungen", en: "Settings" },
  },

  // ==========================================
  // FIELD BOOKING (Platzbelegung)
  // ==========================================
  fields: {
    title: { de: "Platzbelegung", en: "Field Booking" },
    activeFields: { de: "aktive Felder", en: "active fields" },
    total: { de: "gesamt", en: "total" },
    addField: { de: "Feld hinzufügen", en: "Add Field" },
    fieldsTab: { de: "Felder", en: "Fields" },
    occupancyTab: { de: "Belegung", en: "Occupancy" },
    today: { de: "Heute", en: "Today" },
    jumpToDate: { de: "Datum auswählen", en: "Jump to date" },
    free: { de: "Frei", en: "Free" },
    noBookings: { de: "Keine Buchungen an diesem Tag.", en: "No bookings on this day." },
    training: { de: "Training", en: "Training" },
    match: { de: "Spiel", en: "Match" },
    event: { de: "Veranstaltung", en: "Event" },
    fullField: { de: "Ganzes Feld", en: "Full field" },
    zonesCount: { de: "Zonen", en: "Zones" },
    indoor: { de: "Halle", en: "Indoor" },
    outdoor: { de: "Outdoor", en: "Outdoor" },
    inactive: { de: "Inaktiv", en: "Inactive" },
    imported: { de: "Importiert", en: "Imported" },
    futureBookings: { de: "Hat zukünftige Buchungen", en: "Has future bookings" },
    noFutureBookings: { de: "Keine zukünftigen Buchungen", en: "No future bookings" },
    deleteBlocked: { de: "Löschen nicht möglich", en: "Cannot delete" },
    deleteBlockedDesc: { de: "hat noch zukünftige Buchungen. Bitte diese zuerst entfernen.", en: "has future bookings. Please remove them first." },
    deleteConfirm: { de: "Feld wirklich löschen?", en: "Really delete this field?" },
    deleteDesc: { de: "Diese Aktion kann nicht rückgängig gemacht werden.", en: "This action cannot be undone." },
    // Form
    newField: { de: "Neues Feld", en: "New Field" },
    editField: { de: "Feld bearbeiten", en: "Edit Field" },
    fieldName: { de: "Name", en: "Name" },
    namePlaceholder: { de: "z.B. Hauptplatz", en: "e.g. Main pitch" },
    fieldType: { de: "Typ", en: "Type" },
    fieldLocation: { de: "Standort", en: "Location" },
    divisible: { de: "In 6 Zonen teilbar", en: "Divisible into 6 zones" },
    divisibleDesc: { de: "Erlaubt es, Trainings auf einzelnen Zonen zu buchen und das Feld mehrfach gleichzeitig zu nutzen.", en: "Allows booking individual zones and using the field for multiple sessions simultaneously." },
    divisibleError: { de: "Nicht möglich: Dieses Feld hat noch zukünftige Zonen-Buchungen. Bitte erst diese entfernen.", en: "Not possible: This field has future zone bookings. Please remove them first." },
    address: { de: "Adresse / Lage", en: "Address / Location" },
    addressPlaceholder: { de: "z.B. Sportanlage Burkhardsfelden, Platz 1", en: "e.g. Sports facility, Pitch 1" },
    active: { de: "Aktiv", en: "Active" },
    activeDesc: { de: "Inaktive Felder können nicht gebucht werden.", en: "Inactive fields cannot be booked." },
    expandZones: { de: "Zonen", en: "Zones" },
    openingHours: { de: "Öffnungszeiten", en: "Opening Hours" },
    open: { de: "Geöffnet", en: "Open" },
    closed: { de: "Geschlossen", en: "Closed" },
    from: { de: "Von", en: "From" },
    to: { de: "Bis", en: "To" },
    detailsTab: { de: "Details", en: "Details" },
    bookingsTab: { de: "Buchungen", en: "Bookings" },
    noFutureBookingsList: { de: "Keine zukünftigen Buchungen.", en: "No future bookings." },
    recurringEvent: { de: "Wiederkehrend", en: "Recurring" },
    maintenance: { de: "Sperre", en: "Maintenance" },
    addMaintenance: { de: "+ Sperre", en: "+ Block" },
    maintenanceTitle: { de: "Titel der Sperre", en: "Block title" },
    maintenanceNote: { de: "Notiz (optional)", en: "Note (optional)" },
    unassignedEvents: { de: "Ohne Feld", en: "Unassigned" },
    unassignedEventsTitle: { de: "Veranstaltungen ohne Feldzuweisung", en: "Events without field assignment" },
    noUnassignedEvents: { de: "Keine unzugewiesenen Veranstaltungen an diesem Tag.", en: "No unassigned events on this day." },
    selectFieldPlaceholder: { de: "Feld wählen...", en: "Select field..." },
    assignField: { de: "Zuweisen", en: "Assign" },
    removeBooking: { de: "Feldzuweisung entfernen", en: "Remove field assignment" },
    // FieldDetailModal
    fieldDescription: { de: "Beschreibung", en: "Description" },
    zonePreview: { de: "Zonen-Vorschau", en: "Zone Preview" },
    maintenanceDeleteTitle: { de: "Sperre löschen", en: "Delete block" },
    // FieldFormDrawer
    fieldDescriptionPlaceholder: { de: "Optionale Zusatzinfos (Kapazität, Flutlicht, etc.)", en: "Optional details (capacity, floodlights, etc.)" },
    indoorLabel: { de: "🏟️ Halle", en: "🏟️ Indoor" },
    outdoorLabel: { de: "🌿 Outdoor", en: "🌿 Outdoor" },
    // FieldPicker
    fieldPickerLabel: { de: "Feld / Anlage", en: "Field / Facility" },
    noFieldOption: { de: "– Kein Feld –", en: "– No Field –" },
    zonesCount6Suffix: { de: "(6 Zonen)", en: "(6 Zones)" },
    halleSuffix: { de: "Halle", en: "Indoor" },
    removeField: { de: "Feld entfernen", en: "Remove field" },
    fullFieldScope: { de: "Ganzes Feld", en: "Full Field" },
    selectZones: { de: "Zonen wählen", en: "Select Zones" },
    zonesHint: { de: "Zonen auswählen (amber = bereits belegt):", en: "Select zones (amber = already booked):" },
    minOneZone: { de: "Mindestens eine Zone auswählen.", en: "Select at least one zone." },
    matchFullFieldInfo: { de: "Spiele buchen immer das gesamte Feld.", en: "Matches always book the entire field." },
    conflictHeader: { de: "Buchungskonflikt", en: "Booking Conflict" },
    // MaintenanceBlockForm
    maintenanceFormTitle: { de: "Sperre hinzufügen", en: "Add Block" },
    maintenanceFieldLabel: { de: "Feld", en: "Field" },
    maintenanceDateLabel: { de: "Datum", en: "Date" },
    maintenanceTitleLabel: { de: "Titel", en: "Title" },
    maintenanceTitlePlaceholder: { de: "z.B. Rasenpflege", en: "e.g. Lawn care" },
    maintenanceNotePlaceholder: { de: "Zusätzliche Informationen...", en: "Additional information..." },
    maintenanceSaveButton: { de: "Sperre speichern", en: "Save Block" },
    maintenanceTitleRequired: { de: "Bitte gib einen Titel ein.", en: "Please enter a title." },
    maintenanceDateRequired: { de: "Bitte wähle ein Datum.", en: "Please select a date." },
    maintenanceTimeError: { de: "Die Endzeit muss nach der Startzeit liegen.", en: "End time must be after start time." },
    // ZoneGrid
    zoneOccupied: { de: "Belegt", en: "Occupied" },
    zoneOccupiedByPrefix: { de: "Belegt:", en: "Occupied by:" },
    // Timeline
    addMaintenanceTitle: { de: "Sperre hinzufügen", en: "Add block" },
  },

  // ==========================================
  // WEEKDAYS
  // ==========================================
  weekdays: {
    monday: { de: "Montag", en: "Monday" },
    tuesday: { de: "Dienstag", en: "Tuesday" },
    wednesday: { de: "Mittwoch", en: "Wednesday" },
    thursday: { de: "Donnerstag", en: "Thursday" },
    friday: { de: "Freitag", en: "Friday" },
    saturday: { de: "Samstag", en: "Saturday" },
    sunday: { de: "Sonntag", en: "Sunday" },
    mon: { de: "Mo", en: "Mon" },
    tue: { de: "Di", en: "Tue" },
    wed: { de: "Mi", en: "Wed" },
    thu: { de: "Do", en: "Thu" },
    fri: { de: "Fr", en: "Fri" },
    sat: { de: "Sa", en: "Sat" },
    sun: { de: "So", en: "Sun" },
  },

  // ==========================================
  // MONTHS (short)
  // ==========================================
  months: {
    jan: { de: "Jan", en: "Jan" },
    feb: { de: "Feb", en: "Feb" },
    mar: { de: "Mär", en: "Mar" },
    apr: { de: "Apr", en: "Apr" },
    may: { de: "Mai", en: "May" },
    jun: { de: "Jun", en: "Jun" },
    jul: { de: "Jul", en: "Jul" },
    aug: { de: "Aug", en: "Aug" },
    sep: { de: "Sep", en: "Sep" },
    oct: { de: "Okt", en: "Oct" },
    nov: { de: "Nov", en: "Nov" },
    dec: { de: "Dez", en: "Dec" },
  },
} as const;

// Type-safe translation getter
export function t(
  key: string, 
  lang: Language
): string {
  const keys = key.split(".");
  let value: unknown = translations;
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  if (value && typeof value === "object" && lang in value) {
    return (value as Record<Language, string>)[lang];
  }
  
  console.warn(`Translation not found for key: ${key}, lang: ${lang}`);
  return key;
}

// Format date according to language
export function formatDateLocalized(date: Date, lang: Language, options?: Intl.DateTimeFormatOptions): string {
  const locale = lang === "de" ? "de-DE" : "en-US";
  return date.toLocaleDateString(locale, options);
}

// Format time according to language
export function formatTimeLocalized(date: Date, lang: Language): string {
  const locale = lang === "de" ? "de-DE" : "en-US";
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

// Get short weekday
export function getShortWeekday(date: Date, lang: Language): string {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayKey = days[date.getDay()];
  return t(`weekdays.${dayKey}`, lang);
}

// Get short month
export function getShortMonth(date: Date, lang: Language): string {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const monthKey = months[date.getMonth()];
  return t(`months.${monthKey}`, lang);
}

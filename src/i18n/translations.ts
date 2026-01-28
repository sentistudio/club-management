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

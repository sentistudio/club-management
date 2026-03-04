import { useState, createContext, useContext, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MessageSquare,
  Plus,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Paperclip,
  Home,
  User,
  Calendar,
  Search,
  Users,
  File,
  X,
  Download,
  Image,
  Bell,
  CreditCard,
  Globe,
  QrCode,
  MapPin,
  Eye,
  MessageCircle,
  Heart,
  MoreVertical,
  Check,
  Sun,
  Leaf,
  Megaphone,
  Shield,
  Lock,
  Flag
} from "lucide-react";
import { mockTicketForms, getTicketMessages } from "../../data/mockInbox";
import { 
  getChatMessages, 
  mockChats,
  REPORT_CATEGORIES
} from "../../data/mockChats";
import type { Ticket, TicketCategory, TicketStatus } from "../../types/inbox";
import type { Chat, UserRole } from "../../data/mockChats";

// Current member ID (simulating logged-in member)
const CURRENT_MEMBER_ID = "p11";

// Theme Types
type ThemeMode = "light" | "dfb";

interface Theme {
  mode: ThemeMode;
  // Backgrounds
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  // Navigation
  navBg: string;
  navActiveBg: string;
  navInactiveColor: string;
  navPlusBg: string;
  // Text (following DFB neutral scale)
  textPrimary: string;    // neutral-900
  textSecondary: string;  // neutral-700
  textMuted: string;      // neutral-500
  // Accents
  accent: string;         // primary-700
  accentHover: string;    // primary-600
  accentLight: string;    // primary-200
  accentText: string;
  // Special accents
  limeAccent: string;     // lime-500 for LIVE badges
  violetAccent: string;   // violet-600 for editorial
  // Inputs
  inputBg: string;
  inputBorder: string;
  // Status bar (for phone frame)
  statusBarText: string;
  // Buttons
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  buttonSecondaryBorder: string;
  // Alerts / Status
  alertBg: string;
  alertText: string;
  alertIcon: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  infoColor: string;
  // Messages
  messageSentBg: string;
  messageSentText: string;
  messageReceivedBg: string;
  messageReceivedBorder: string;
  // Cards
  cardRadius: string;
  cardShadow: string;
  // Dividers
  dividerColor: string;
  // Chips
  chipBg: string;
  chipBorder: string;
  chipSelectedBg: string;
  chipSelectedText: string;
}

// Light Theme (current design)
const lightTheme: Theme = {
  mode: "light",
  pageBg: "#FAFAFA",
  cardBg: "#FFFFFF",
  cardBorder: "#F5F5F5",
  navBg: "#C8F2E0",
  navActiveBg: "#FFFFFF",
  navInactiveColor: "#525252",
  navPlusBg: "#C8F2E0",
  textPrimary: "#171717",
  textSecondary: "#525252",
  textMuted: "#A3A3A3",
  accent: "#004941",
  accentHover: "#00594d",
  accentLight: "#C8F2E0",
  accentText: "#004941",
  limeAccent: "#B7F000",
  violetAccent: "#4B3F72",
  inputBg: "#FFFFFF",
  inputBorder: "#E5E5E5",
  statusBarText: "#171717",
  buttonPrimaryBg: "#004941",
  buttonPrimaryText: "#FFFFFF",
  buttonSecondaryBg: "#FFFFFF",
  buttonSecondaryText: "#004941",
  buttonSecondaryBorder: "#C8F2E0",
  alertBg: "#FFF7ED",
  alertText: "#EA580C",
  alertIcon: "#FFEDD5",
  successColor: "#2E7D63",
  warningColor: "#E6A700",
  errorColor: "#C6362B",
  infoColor: "#4B3F72",
  messageSentBg: "#004941",
  messageSentText: "#FFFFFF",
  messageReceivedBg: "#FFFFFF",
  messageReceivedBorder: "#E5E5E5",
  cardRadius: "12px",
  cardShadow: "0 4px 16px rgba(0,0,0,0.06)",
  dividerColor: "#E5E5E5",
  chipBg: "#FFFFFF",
  chipBorder: "#E5E5E5",
  chipSelectedBg: "#C8F2E0",
  chipSelectedText: "#004941",
};

// DFB Theme - Following DFB Design System v1.0
// Visual metaphor: "Football pitch in daylight"
// Calm, authoritative, editorial sports identity
const dfbTheme: Theme = {
  mode: "dfb",
  // Primary Background - DFB Design System light surface
  pageBg: "#C8F2D3", // Light mint - DFB light mode primary surface
  // Cards
  cardBg: "#FFFFFF", // neutral-0 - Cards, modals
  cardBorder: "#B8E8C4", // Slightly tinted border
  // Navigation - Bottom Tab Bar
  navBg: "#FFFFFF",
  navActiveBg: "#BBFD00", // DFB Lime - primary active state per design system
  navInactiveColor: "#5F7F73",
  navPlusBg: "#FFFFFF",
  // Text - Neutral Colors
  textPrimary: "#0F1F1A",
  textSecondary: "#2F4A41",
  textMuted: "#5F7F73",
  // Brand Green (used for text/icon contexts)
  accent: "#1F5F4A", // dark green - used where lime has poor contrast (text on white)
  accentHover: "#2E7D63",
  accentLight: "#DFFDE8", // Light lime tint for subtle fills
  accentText: "#0A1F0A", // Very dark for text ON lime backgrounds
  // Accent Colors - DFB Official
  limeAccent: "#BBFD00", // DFB Lime - primary CTA / action color
  violetAccent: "#6100FF", // DFB Purple
  // Inputs
  inputBg: "#FFFFFF",
  inputBorder: "#B8E8C4",
  // Status bar
  statusBarText: "#0F1F1A",
  // Buttons - DFB Design System: neon lime primary
  buttonPrimaryBg: "#BBFD00", // DFB Lime - primary CTA
  buttonPrimaryText: "#0A1F0A", // Very dark text for contrast on lime
  buttonSecondaryBg: "#FFFFFF",
  buttonSecondaryText: "#1F5F4A",
  buttonSecondaryBorder: "#B8E8C4",
  // Alerts / Status Colors
  alertBg: "#EEFAF3",
  alertText: "#0F1F1A",
  alertIcon: "#B8E8C4",
  successColor: "#2E7D63",
  warningColor: "#E6A700",
  errorColor: "#C6362B",
  infoColor: "#4B3F72",
  // Messages
  messageSentBg: "#BBFD00", // DFB Lime for sent messages
  messageSentText: "#0A1F0A",
  messageReceivedBg: "#FFFFFF",
  messageReceivedBorder: "#B8E8C4",
  // Cards
  cardRadius: "12px",
  cardShadow: "0 4px 16px rgba(0,0,0,0.06)",
  // Dividers
  dividerColor: "#B8E8C4",
  // Chips / Filters - lime for selected state
  chipBg: "#FFFFFF",
  chipBorder: "#B8E8C4",
  chipSelectedBg: "#BBFD00", // DFB Lime
  chipSelectedText: "#0A1F0A",
};

// Theme context (for future use if needed)
const ThemeContext = createContext<{
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
}>({
  theme: lightTheme,
  setThemeMode: () => {},
});

// Export for potential use in child components
export const useTheme = () => useContext(ThemeContext);

// DFB Design System Color Tokens
const COLORS = {
  // Primary Background
  bgPrimary: "#A6CABA",
  // Neutral Scale
  neutral900: "#0F1F1A", // Primary text
  neutral700: "#2F4A41", // Secondary text
  neutral500: "#5F7F73", // Metadata, labels
  neutral300: "#C7DCD3", // Dividers, borders
  neutral100: "#EEF5F2", // Subtle surfaces
  neutral0: "#FFFFFF",   // Cards, modals
  // Brand Green (Primary Interactive)
  primary700: "#1F5F4A", // Primary buttons, active states
  primary600: "#2E7D63", // Hover, focus
  primary200: "#CFE6DD", // Selected states, fills
  // Accent Colors
  lime500: "#BBFD00",    // DFB Lime - LIVE, highlights, urgency (updated to match DFB official)
  violet600: "#6100FF",  // DFB Purple/Violet - Official accent from dfb.de
  // Status Colors
  success: "#2E7D63",
  warning: "#E6A700",
  error: "#C6362B",
  info: "#6100FF",       // Using DFB violet for info
  // Legacy aliases for backward compatibility
  primary: "#1F5F4A",
  primaryLight: "#2E7D63",
  primaryDark: "#0F1F1A",
  mint: "#CFE6DD",
  mintLight: "#EEF5F2",
  mintDark: "#A6CABA"
};

// DFB Official Graphics
const DFB_ASSETS = {
  // Official DFB Logo (2025 Rebranding)
  logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38.4545 37.3432L39.9445 38.7205C37.631 41.2242 34.7382 43.1847 31.4788 44.3889L30.7764 42.4849C33.7326 41.3925 36.3564 39.6142 38.4545 37.3432ZM23.9171 43.7061C22.0573 43.7061 20.2572 43.4495 18.5506 42.9697L17.9997 44.9229C19.8814 45.4522 21.8662 45.7351 23.9171 45.7351C25.9732 45.7351 27.963 45.4506 29.8491 44.9189L29.2982 42.9655C27.5874 43.4481 25.7823 43.7061 23.9171 43.7061ZM9.38844 37.3527L7.89851 38.73C10.2138 41.2328 13.1084 43.1919 16.3694 44.3942L17.0719 42.4902C14.1141 41.3997 11.4886 39.6228 9.38844 37.3527ZM41.0572 37.418C43.9865 33.704 45.7346 29.0149 45.7346 23.9176C45.7346 11.8681 35.9666 2.1001 23.9171 2.1001C11.8676 2.1001 2.09961 11.8681 2.09961 23.9176C2.09961 29.0194 3.85071 33.7121 6.78466 37.4277L8.37797 36.1712C5.71687 32.8012 4.12864 28.5449 4.12864 23.9176C4.12864 12.9887 12.9882 4.12913 23.9171 4.12913C34.846 4.12913 43.7056 12.9887 43.7056 23.9176C43.7056 28.5405 42.1203 32.7932 39.4638 36.1617L41.0572 37.418ZM37.5926 26.2842V29.364L24.4669 36.9421V33.8626L34.926 27.8241L30.8259 25.4569L21.8 30.668L21.8 38.4818L19.1332 36.9421V32.2077L15.0331 34.5749L12.3652 33.0346V14.7997L15.033 13.2594L19.1332 15.6266V10.8922L21.8 9.35248L27.1338 12.4319V15.5114L21.8 12.4319V17.1663L27.1338 20.2458V23.3252L21.8 20.2458V27.5886L34.9261 20.0102L29.8007 17.0511V13.9717L37.5926 18.4703V21.5502L33.4928 23.9172L37.5926 26.2842ZM19.1332 18.7061L15.0321 16.3383V31.496L19.1332 29.1283V18.7061Z" fill="currentColor"/></svg>`,
  // Playground curve graphic (lime green)
  playgroundCurve: `data:image/svg+xml,%3Csvg%20width=%27576%27%20height=%2743%27%20fill=%27none%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg%20clip-path=%27url%28%23a%29%27%3E%3Cpath%20fill-rule=%27evenodd%27%20clip-rule=%27evenodd%27%20d=%27M0%2037.191h214.298C231.462%2014.82%20258.346.396%20288.575.396c30.23%200%2057.115%2014.423%2074.278%2036.795H576V43H0v-5.809ZM288.575%206.396c26.594%200%2050.436%2011.928%2066.559%2030.795H222.017c16.124-18.867%2039.965-30.795%2066.558-30.795Z%27%20fill=%27%23bbfd00%27/%3E%3C/g%3E%3Cdefs%3E%3CclipPath%20id=%27a%27%3E%3Cpath%20fill=%27%23fff%27%20d=%27M0%200h576v43H0z%27/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E`,
  // Background pattern (geometric DFB pattern)
  backgroundPattern: `data:image/svg+xml,%3Csvg%20width=%271872%27%20height=%272280%27%20viewBox=%270%200%201872%202280%27%20fill=%27none%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath%20d=%27M1519.37%20659.997L1185.11%20467.024V82.966L1768.67%20419.892C1814.48%20446.342%201814.48%20489.623%201768.67%20516.071L1519.37%20659.997ZM260.825%201456.77L66.7413%201568.82V1856.63C66.7413%201909.53%20104.23%201931.18%20150.05%201904.74L260.825%201840.83V2031.87C260.825%202062.72%20282.691%202100.59%20309.414%202116.02L593.449%202280L593.452%20863.856L260.825%20671.823L260.825%201456.77ZM-237.409%20323.25L932.637%20998.742V614.682L593.452%20418.898V185.61L344.121%2041.665C298.308%2015.2165%20260.825%2036.8561%20260.825%2089.7533V226.9L95.295%20131.35C68.568%20115.924%2024.8377%20115.925%20-1.88715%20131.354L-326%20318.472V318.864C-313.909%20313.841%20-299.569%20311.704%20-285.261%20311.772C-267.91%20311.854%20-250.603%20315.679%20-237.409%20323.25ZM349.332%20-15.4917L992.751%20355.968V-28.0894L682.112%20-207.429C655.388%20-222.857%20611.656%20-222.857%20584.933%20-207.429L260.743%20-20.2677V-19.8754C272.834%20-24.8987%20287.174%20-27.0359%20301.482%20-26.9682C318.831%20-26.886%20336.136%20-23.061%20349.332%20-15.4917ZM20.6123%201932.47C12.0071%201917.4%206.6666%201900.5%206.62683%201885.28V525.32L-252.547%20375.465C-285.189%20356.523%20-326%20379.739%20-326%20417.751V1693.08C-326%201723.94%20-304.133%201761.81%20-277.408%201777.24L46.7852%201964.4L47.1254%201964.2C36.7289%201956.24%2027.7085%201944.9%2020.6123%201932.47ZM1857.43%201196.34C1848.68%201211.33%201836.72%201224.4%201823.56%201232.04L785.816%201831.16V2215.21L1823.41%201616.19C1850.13%201600.76%201872%201562.89%201872%201532.03V1157.71L1871.66%201157.51C1869.96%201170.5%201864.65%201183.98%201857.43%201196.34ZM1871.66%20479.261C1869.97%20492.244%201864.65%20505.73%201857.43%20518.087C1848.69%20533.074%201836.72%20546.149%201823.56%20553.791L653.567%201229.25V1613.31L1324.69%201225.86L1519.37%201338.25L1768.67%201194.32C1814.48%201167.87%201814.49%201124.59%201768.68%201098.14L1657.31%201033.83L1823.41%20937.937C1850.14%20922.509%201872%20884.64%201872%20853.783V479.458L1871.66%20479.261Z%27%20fill=%27%23C8F2E0%27/%3E%3C/svg%3E%0A`,
};

// ==========================================
// TRANSLATIONS
// ==========================================
type Language = "de" | "en";

const translations = {
  de: {
    // Navigation
    home: "Home",
    calendar: "Kalender",
    chats: "Chats",
    news: "News",
    profile: "Profil",
    
    // Home Screen
    welcome: "Willkommen",
    managedBy: "verwaltet von",
    openInvoice: "offene Rechnung",
    openInvoices: "offene Rechnungen",
    appointments: "Termine",
    messages: "Nachrichten",
    nextAppointment: "NÄCHSTER TERMIN",
    allAppointments: "Alle Termine",
    freeSpots: "FREIE PLÄTZE",
    allCourses: "Alle Kurse",
    moreAppointments: "WEITERE TERMINE",
    today: "Heute",
    tomorrow: "Morgen",
    
    // Calendar
    myAppointments: "Meine Termine",
    laterThisWeek: "SPÄTER DIE WOCHE",
    training: "Training",
    match: "Spiel",
    course: "Kurs",
    event: "Event",
    confirmed: "Bestätigt",
    unconfirmed: "Unbestätigt",
    booked: "Gebucht",
    freeSpotsBadge: "Freie Plätze",
    
    // Calendar Views (Simplified)
    myCalendar: "Mein Kalender",
    clubCalendar: "Club Kalender",
    
    // Event Management
    createEvent: "Termin erstellen",
    editEvent: "Termin bearbeiten",
    eventDetails: "Termindetails",
    eventScope: "Geltungsbereich",
    eventType: "Terminart",
    eventVisibility: "Sichtbarkeit",
    participants: "Teilnehmer",
    rsvp: "Teilnahme",
    rsvpConfirmed: "Zugesagt",
    rsvpDeclined: "Abgesagt",
    rsvpPending: "Ausstehend",
    rsvpDeadline: "Anmeldefrist",
    confirmAttendance: "Zusagen",
    declineAttendance: "Absagen",
    maybeAttendance: "Vielleicht",
    organizer: "Organisator",
    eventDescription: "Beschreibung",
    eventAttachments: "Anhänge",
    eventNotes: "Notizen",
    eventResources: "Ressourcen",
    recurring: "Wiederkehrend",
    oneTime: "Einmalig",
    saveEvent: "Speichern",
    cancelEvent: "Abbrechen",
    deleteEvent: "Löschen",
    
    // Event Scopes
    scopeTeam: "Team-Termin",
    scopeDepartment: "Abteilungs-Termin",
    scopeClub: "Vereins-Termin",
    
    // Event Types
    typeTraining: "Training",
    typeMatch: "Spiel/Wettkampf",
    typeTeamActivity: "Team-Aktivität",
    typeDepartmentMeeting: "Abteilungsversammlung",
    typeClubEvent: "Vereinsveranstaltung",
    typeDfbMatch: "DFB/SpielPlus",
    
    // Visibility Options
    visibilityAll: "Alle Mitglieder",
    visibilityPlayers: "Nur Spieler",
    visibilityParents: "Nur Eltern",
    visibilityCoaches: "Nur Trainer",
    visibilityBoard: "Nur Vorstand",
    
    // Messages/Chats
    mitteilungen: "Mitteilungen",
    for: "für",
    childProfileRestricted: "Kinderprofil - Eingeschränkte Kommunikation",
    onlyTeamAndCoach: "Nur Teamchat und Coach-Kontakt verfügbar",
    teamAndCoach: "TEAM & COACH",
    requests: "ANFRAGEN",
    search: "Suche",
    groupChat: "Gruppenchat",
    directMessage: "Direktnachricht",
    writeMessage: "Nachricht schreiben...",
    
    // New Chat Types
    announcements: "ANKÜNDIGUNGEN",
    teamChats: "TEAM-CHATS",
    directMessages: "DIREKTNACHRICHTEN",
    oneWayChannel: "Nur-Lese-Kanal",
    parentCanSee: "Eltern haben Einblick",
    minorProtection: "Minderjährigen-Schutz aktiv",
    messageLogged: "Nachrichten werden protokolliert",
    noRepliesAllowed: "Keine Antworten möglich",
    reactionsOnly: "Nur Reaktionen",
    parentRequired: "Elternteil erforderlich",
    dmNotAllowed: "Direktnachrichten nicht erlaubt",
    viewingAsParent: "Ansicht als Elternteil",
    onBehalfOf: "für",
    parentAutoIncluded: "Elternteil automatisch einbezogen",
    
    // News
    clubNews: "Vereins-News",
    department: "Abteilung",
    topic: "Thema",
    views: "Aufrufe",
    comments: "Kommentare",
    likes: "Gefällt mir",
    readMore: "Weiterlesen",
    
    // Profile
    membership: "Mitgliedschaft",
    memberSince: "Mitglied seit",
    memberId: "Mitgliedsnummer",
    teams: "Teams",
    active: "Aktiv",
    payments: "Zahlungen",
    nextPayment: "Nächste Zahlung",
    documents: "Dokumente",
    downloadAll: "Alle herunterladen",
    settings: "Einstellungen",
    language: "Sprache",
    german: "Deutsch",
    english: "English (US)",
    theme: "Darstellung",
    lightMode: "Light",
    dfbMode: "DFB Mode",
    notifications: "Benachrichtigungen",
    help: "Hilfe & Support",
    logout: "Abmelden",
    
    // Profile Switcher
    selectPerson: "Person wählen",
    otherClubs: "ANDERE VEREINE",
    years: "Jahre",
    
    // Request Form
    newRequest: "Neue Anfrage",
    selectCategory: "Kategorie wählen",
    selectDepartment: "Abteilung wählen",
    subject: "Betreff",
    message: "Nachricht",
    attachments: "Anhänge",
    addAttachment: "Anhang hinzufügen",
    send: "Absenden",
    back: "Zurück",
    
    // Categories
    categoryGeneral: "Allgemeine Anfrage",
    categoryBilling: "Beitragsfragen",
    categoryDocuments: "Dokumente",
    categoryMembership: "Mitgliedschaft",
    categoryEvents: "Veranstaltungen",
    
    // Days
    monday: "Mo.",
    tuesday: "Di.",
    wednesday: "Mi.",
    thursday: "Do.",
    friday: "Fr.",
    saturday: "Sa.",
    sunday: "So.",
    jan: "Jan.",
  },
  en: {
    // Navigation
    home: "Home",
    calendar: "Calendar",
    chats: "Chats",
    news: "News",
    profile: "Profile",
    
    // Home Screen
    welcome: "Welcome",
    managedBy: "managed by",
    openInvoice: "open invoice",
    openInvoices: "open invoices",
    appointments: "Events",
    messages: "Messages",
    nextAppointment: "NEXT EVENT",
    allAppointments: "All Events",
    freeSpots: "AVAILABLE SPOTS",
    allCourses: "All Courses",
    moreAppointments: "MORE EVENTS",
    today: "Today",
    tomorrow: "Tomorrow",
    
    // Calendar
    myAppointments: "My Events",
    laterThisWeek: "LATER THIS WEEK",
    training: "Training",
    match: "Match",
    course: "Course",
    event: "Event",
    confirmed: "Confirmed",
    unconfirmed: "Unconfirmed",
    booked: "Booked",
    freeSpotsBadge: "Available",
    
    // Calendar Views (Simplified)
    myCalendar: "My Calendar",
    clubCalendar: "Club Calendar",
    
    // Event Management
    createEvent: "Create Event",
    editEvent: "Edit Event",
    eventDetails: "Event Details",
    eventScope: "Scope",
    eventType: "Event Type",
    eventVisibility: "Visibility",
    participants: "Participants",
    rsvp: "RSVP",
    rsvpConfirmed: "Confirmed",
    rsvpDeclined: "Declined",
    rsvpPending: "Pending",
    rsvpDeadline: "RSVP Deadline",
    confirmAttendance: "Confirm",
    declineAttendance: "Decline",
    maybeAttendance: "Maybe",
    organizer: "Organizer",
    eventDescription: "Description",
    eventAttachments: "Attachments",
    eventNotes: "Notes",
    eventResources: "Resources",
    recurring: "Recurring",
    oneTime: "One-time",
    saveEvent: "Save",
    cancelEvent: "Cancel",
    deleteEvent: "Delete",
    
    // Event Scopes
    scopeTeam: "Team Event",
    scopeDepartment: "Department Event",
    scopeClub: "Club Event",
    
    // Event Types
    typeTraining: "Training",
    typeMatch: "Match/Competition",
    typeTeamActivity: "Team Activity",
    typeDepartmentMeeting: "Department Meeting",
    typeClubEvent: "Club Event",
    typeDfbMatch: "DFB/SpielPlus",
    
    // Visibility Options
    visibilityAll: "All Members",
    visibilityPlayers: "Players Only",
    visibilityParents: "Parents Only",
    visibilityCoaches: "Coaches Only",
    visibilityBoard: "Board Only",
    
    // Messages/Chats
    mitteilungen: "Messages",
    for: "for",
    childProfileRestricted: "Child Profile - Restricted Communication",
    onlyTeamAndCoach: "Only team chat and coach contact available",
    teamAndCoach: "TEAM & COACH",
    requests: "REQUESTS",
    search: "Search",
    groupChat: "Group Chat",
    directMessage: "Direct Message",
    writeMessage: "Write a message...",
    
    // New Chat Types
    announcements: "ANNOUNCEMENTS",
    teamChats: "TEAM CHATS",
    directMessages: "DIRECT MESSAGES",
    oneWayChannel: "Read-only channel",
    parentCanSee: "Parents can see",
    minorProtection: "Minor protection active",
    messageLogged: "Messages are logged",
    noRepliesAllowed: "No replies allowed",
    reactionsOnly: "Reactions only",
    parentRequired: "Parent required",
    dmNotAllowed: "Direct messages not allowed",
    viewingAsParent: "Viewing as parent",
    onBehalfOf: "for",
    parentAutoIncluded: "Parent auto-included",
    
    // News
    clubNews: "Club News",
    department: "Department",
    topic: "Topic",
    views: "Views",
    comments: "Comments",
    likes: "Likes",
    readMore: "Read more",
    
    // Profile
    membership: "Membership",
    memberSince: "Member since",
    memberId: "Member ID",
    teams: "Teams",
    active: "Active",
    payments: "Payments",
    nextPayment: "Next payment",
    documents: "Documents",
    downloadAll: "Download all",
    settings: "Settings",
    language: "Language",
    german: "Deutsch",
    english: "English (US)",
    theme: "Appearance",
    lightMode: "Light",
    dfbMode: "DFB Mode",
    notifications: "Notifications",
    help: "Help & Support",
    logout: "Log out",
    
    // Profile Switcher
    selectPerson: "Select Person",
    otherClubs: "OTHER CLUBS",
    years: "years",
    
    // Request Form
    newRequest: "New Request",
    selectCategory: "Select category",
    selectDepartment: "Select department",
    subject: "Subject",
    message: "Message",
    attachments: "Attachments",
    addAttachment: "Add attachment",
    send: "Send",
    back: "Back",
    
    // Categories
    categoryGeneral: "General Inquiry",
    categoryBilling: "Billing Questions",
    categoryDocuments: "Documents",
    categoryMembership: "Membership",
    categoryEvents: "Events",
    
    // Days
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
    jan: "Jan",
  }
};

// Profile type
interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  isChild?: boolean;
  parentId?: string;
  birthDate?: string;
  clubId: string;
  clubName: string;
  memberships: Array<{
    departmentId: string;
    departmentName: string;
    role: "active" | "passive";
    teamName: string;
    icon: string;
    coachName?: string;
    coachAvatar?: string;
  }>;
  stats: {
    termine: number;
    nachrichten: number;
    news: number;
    offeneRechnungen: number;
    offenerBetrag: string;
  };
  nextEvent?: {
    title: string;
    dayNumber: string;
    dayName: string;
    time: string;
    location: string;
  };
  events: Array<{
    id: string;
    title: string;
    date: string;
    dayName: string;
    dayNumber: string;
    time: string;
    location: string;
    type: "training" | "match" | "event" | "course";
    team?: string;
    teamAvatar?: string;
    status: "confirmed" | "unconfirmed" | "booked" | "free_spots";
    isToday?: boolean;
    isTomorrow?: boolean;
  }>;
  chats: Array<{
    id: string;
    name: string;
    avatar: string | null;
    lastMessage: string;
    time: string;
    unread: number;
    type: string;
    isClub?: boolean;
    isRequest?: boolean;
  }>;
  chatHistory: Record<string, Array<{
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
    isOnBehalf?: boolean;
  }>>;
  news: Array<{
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    image: string;
    views: number;
    comments: number;
    likes: number;
  }>;
  freeSpots?: Array<{
    id: string;
    title: string;
    date: string;
    dateShort: string;
    time: string;
    image: string;
  }>;
}

// ==========================================
// LENA SCHNEIDER - Mother (Fitness & Ü40 Fußball)
// ==========================================
const LENA_PROFILE: MemberProfile = {
  id: "p11",
  firstName: "Lena",
  lastName: "Schneider",
  email: "lena.schneider@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  clubId: "sfb",
  clubName: "Sportfreunde Burkhardsfelden",
  memberships: [
    { 
      departmentId: "dept_fitness", 
      departmentName: "Fitness", 
      role: "active" as const, 
      teamName: "Fitness – Morgengruppe", 
      icon: "💪",
      coachName: "Trainerin Sandra",
      coachAvatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=50&h=50&fit=crop&crop=face"
    },
    { 
      departmentId: "dept_football", 
      departmentName: "Fußball", 
      role: "active" as const, 
      teamName: "Frauen Ü40", 
      icon: "⚽",
      coachName: "Trainer Bernd",
      coachAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face"
    }
  ],
  stats: {
    termine: 4,
    nachrichten: 8,
    news: 5,
    offeneRechnungen: 1,
    offenerBetrag: "95,00 €"
  },
  nextEvent: {
    title: "Fitness Morgengruppe",
    dayNumber: "24.",
    dayName: "Fr.",
    time: "07:00 - 60 min.",
    location: "Fitness Studio"
  },
  events: [
    {
      id: "lena_evt1",
      title: "Fitness Morgengruppe",
      date: "2026-01-24",
      dayName: "Fr.",
      dayNumber: "24.",
      time: "07:00 - 60 min.",
      location: "Fitness Studio",
      type: "course",
      team: "Fitness",
      teamAvatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=40&h=40&fit=crop",
      status: "confirmed",
      isToday: true
    },
    {
      id: "lena_evt2",
      title: "Frauen Ü40 Training",
      date: "2026-01-25",
      dayName: "Sa.",
      dayNumber: "25.",
      time: "10:00 - 90 min.",
      location: "Kunstrasenplatz",
      type: "training",
      team: "Frauen Ü40",
      teamAvatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=40&h=40&fit=crop",
      status: "confirmed",
      isTomorrow: true
    },
    {
      id: "lena_evt3",
      title: "Freundschaftsspiel vs. SV Grünberg Ü40",
      date: "2026-01-26",
      dayName: "So.",
      dayNumber: "26.",
      time: "11:00 - 90 min.",
      location: "Sportplatz Grünberg",
      type: "match",
      team: "Frauen Ü40",
      teamAvatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=40&h=40&fit=crop",
      status: "unconfirmed"
    },
    {
      id: "lena_evt4",
      title: "Fitness Morgengruppe",
      date: "2026-01-27",
      dayName: "Mo.",
      dayNumber: "27.",
      time: "07:00 - 60 min.",
      location: "Fitness Studio",
      type: "course",
      team: "Fitness",
      teamAvatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=40&h=40&fit=crop",
      status: "booked"
    }
  ],
  chats: [
    {
      id: "lena_chat1",
      name: "Fitness – Morgengruppe",
      avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=50&h=50&fit=crop",
      lastMessage: "Sandra: Denkt an eure Matten für morgen! 🧘‍♀️",
      time: "18:45",
      unread: 2,
      type: "team"
    },
    {
      id: "lena_chat2",
      name: "Frauen Ü40 – Fußball",
      avatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=50&h=50&fit=crop",
      lastMessage: "Bernd: Auswärtsspiel am Sonntag - wer fährt mit?",
      time: "16:20",
      unread: 3,
      type: "team"
    },
    {
      id: "lena_chat3",
      name: "Sportfreunde Burkhardsfelden",
      avatar: null,
      isClub: true,
      lastMessage: "Verein: Einladung zur Jahreshauptversammlung am 15.02.",
      time: "23.04.2026",
      unread: 1,
      type: "club"
    },
    {
      id: "lena_chat4",
      name: "Elterngruppe Volleyball U16",
      avatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=50&h=50&fit=crop",
      lastMessage: "Martina: Wer bringt die Getränke zum Turnier?",
      time: "14:30",
      unread: 0,
      type: "group"
    },
    {
      id: "lena_chat5",
      name: "Trainerin Sandra",
      avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=50&h=50&fit=crop&crop=face",
      lastMessage: "Du: Danke für den tollen Kurs heute!",
      time: "Gestern",
      unread: 0,
      type: "direct"
    },
    {
      id: "lena_chat6",
      name: "An: Mitgliederverwaltung",
      avatar: null,
      isRequest: true,
      lastMessage: "Frage zur Familienermäßigung",
      time: "22.04.2026",
      unread: 1,
      type: "request"
    }
  ],
  chatHistory: {
    "lena_chat1": [
      { id: "lc1_1", senderId: "sandra", senderName: "Trainerin Sandra", content: "Guten Morgen zusammen! 🌅", createdAt: "2026-01-24T06:00:00" },
      { id: "lc1_2", senderId: "sandra", senderName: "Trainerin Sandra", content: "Heute machen wir einen intensiven Core-Workout. Bringt gute Laune mit!", createdAt: "2026-01-24T06:05:00" },
      { id: "lc1_3", senderId: "p11", senderName: "Lena Schneider", content: "Super, ich freu mich! Bis gleich 💪", createdAt: "2026-01-24T06:30:00" },
      { id: "lc1_4", senderId: "member2", senderName: "Petra Müller", content: "Bin auch dabei!", createdAt: "2026-01-24T06:32:00" },
      { id: "lc1_5", senderId: "sandra", senderName: "Trainerin Sandra", content: "Denkt an eure Matten für morgen! 🧘‍♀️", createdAt: "2026-01-24T18:45:00" }
    ],
    "lena_chat2": [
      { id: "lc2_1", senderId: "bernd", senderName: "Trainer Bernd", content: "Damen, tolles Training gestern! Ihr werdet immer besser ⚽", createdAt: "2026-01-23T19:00:00" },
      { id: "lc2_2", senderId: "p11", senderName: "Lena Schneider", content: "Danke Bernd! Hat richtig Spaß gemacht.", createdAt: "2026-01-23T19:15:00" },
      { id: "lc2_3", senderId: "bernd", senderName: "Trainer Bernd", content: "Auswärtsspiel am Sonntag - wer fährt mit?", createdAt: "2026-01-24T16:20:00" },
      { id: "lc2_4", senderId: "member3", senderName: "Claudia Weber", content: "Ich kann fahren, habe Platz für 3 weitere", createdAt: "2026-01-24T16:25:00" },
      { id: "lc2_5", senderId: "member4", senderName: "Sabine Koch", content: "Super Claudia! Ich fahre mit dir.", createdAt: "2026-01-24T16:30:00" }
    ],
    "lena_chat5": [
      { id: "lc5_1", senderId: "sandra", senderName: "Trainerin Sandra", content: "Hallo Lena! Wie geht es deinem Rücken nach dem letzten Training?", createdAt: "2026-01-22T10:00:00" },
      { id: "lc5_2", senderId: "p11", senderName: "Lena Schneider", content: "Viel besser, danke der Nachfrage! Die Übungen haben wirklich geholfen.", createdAt: "2026-01-22T10:30:00" },
      { id: "lc5_3", senderId: "sandra", senderName: "Trainerin Sandra", content: "Das freut mich! Mach weiter so mit den Dehnübungen zu Hause 🙏", createdAt: "2026-01-22T10:35:00" },
      { id: "lc5_4", senderId: "p11", senderName: "Lena Schneider", content: "Danke für den tollen Kurs heute!", createdAt: "2026-01-23T08:30:00" }
    ]
  },
  news: [
    {
      id: "lena_news1",
      title: "Frauen Ü40 gewinnt erstes Hallenturnier",
      excerpt: "Unsere Damenmannschaft konnte beim Hallenturnier in Gießen den ersten Platz belegen. Ein toller Erfolg für das Team um Trainer Bernd!",
      author: "Abteilung Fußball",
      date: "23.01.2026 - 14:30",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
      views: 156,
      comments: 8,
      likes: 34
    },
    {
      id: "lena_news2",
      title: "Neue Fitnessgeräte eingetroffen",
      excerpt: "Ab sofort stehen im Fitness Studio neue Geräte zur Verfügung. Trainerin Sandra gibt Einweisungen nach Vereinbarung.",
      author: "Abteilung Fitness",
      date: "22.01.2026 - 09:00",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop",
      views: 89,
      comments: 3,
      likes: 21
    }
  ],
  freeSpots: [
    {
      id: "lena_fs1",
      title: "Yoga für Frühaufsteher",
      date: "Freitag",
      dateShort: "24. Jan.",
      time: "06:30 - 30 min.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop"
    },
    {
      id: "lena_fs2",
      title: "50K lockere Bummel Tour",
      date: "Sonntag",
      dateShort: "26. Jan.",
      time: "09:30 - 120 min.",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&h=200&fit=crop"
    },
    {
      id: "lena_fs3",
      title: "40K Feierabend Runde",
      date: "Montag",
      dateShort: "27. Jan.",
      time: "18:00 - 90 min.",
      image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=200&h=200&fit=crop"
    }
  ]
};

// ==========================================
// FLURINA SCHNEIDER - Daughter (Volleyball U16)
// ==========================================
const FLURINA_PROFILE: MemberProfile = {
  id: "p12",
  firstName: "Flurina",
  lastName: "Schneider",
  email: "lena.schneider@example.com",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  isChild: true,
  parentId: "p11",
  birthDate: "2010-05-12",
  clubId: "sfb",
  clubName: "Sportfreunde Burkhardsfelden",
  memberships: [
    { 
      departmentId: "dept_volleyball", 
      departmentName: "Volleyball", 
      role: "active" as const, 
      teamName: "Volleyball U16 Mädchen", 
      icon: "🏐",
      coachName: "Trainerin Katja",
      coachAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face"
    }
  ],
  stats: {
    termine: 3,
    nachrichten: 4,
    news: 3,
    offeneRechnungen: 0,
    offenerBetrag: "0,00 €"
  },
  nextEvent: {
    title: "Volleyball U16 Training",
    dayNumber: "24.",
    dayName: "Fr.",
    time: "17:00 - 90 min.",
    location: "Sporthalle 2"
  },
  events: [
    {
      id: "flu_evt1",
      title: "Volleyball U16 Training",
      date: "2026-01-24",
      dayName: "Fr.",
      dayNumber: "24.",
      time: "17:00 - 90 min.",
      location: "Sporthalle 2",
      type: "training",
      team: "Volleyball U16",
      teamAvatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=40&h=40&fit=crop",
      status: "confirmed",
      isToday: true
    },
    {
      id: "flu_evt2",
      title: "Punktspiel vs. TV Lich U16",
      date: "2026-01-25",
      dayName: "Sa.",
      dayNumber: "25.",
      time: "14:00 - 120 min.",
      location: "Sporthalle Lich",
      type: "match",
      team: "Volleyball U16",
      teamAvatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=40&h=40&fit=crop",
      status: "confirmed",
      isTomorrow: true
    },
    {
      id: "flu_evt3",
      title: "Volleyball U16 Training",
      date: "2026-01-28",
      dayName: "Di.",
      dayNumber: "28.",
      time: "17:00 - 90 min.",
      location: "Sporthalle 2",
      type: "training",
      team: "Volleyball U16",
      teamAvatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=40&h=40&fit=crop",
      status: "booked"
    }
  ],
  chats: [
    {
      id: "flu_chat1",
      name: "Volleyball U16 Mädchen",
      avatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=50&h=50&fit=crop",
      lastMessage: "Katja: Morgen bitte alle in Vereinstrikot! 🏐",
      time: "19:30",
      unread: 1,
      type: "team"
    },
    {
      id: "flu_chat2",
      name: "Trainerin Katja",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face",
      lastMessage: "Du (Lena): Vielen Dank! Flurina hat sich sehr gefreut.",
      time: "Gestern",
      unread: 0,
      type: "direct"
    },
    {
      id: "flu_chat3",
      name: "An: Abteilungsleitung",
      avatar: null,
      isRequest: true,
      lastMessage: "Anfrage für Trainingsanzug Größe M",
      time: "20.01.2026",
      unread: 0,
      type: "request"
    }
  ],
  chatHistory: {
    "flu_chat1": [
      { id: "fc1_1", senderId: "katja", senderName: "Trainerin Katja", content: "Super Leistung heute Mädels! 🌟", createdAt: "2026-01-23T19:00:00" },
      { id: "fc1_2", senderId: "teammate1", senderName: "Petra für Sophie", content: "Sophie war auch begeistert! Das war ein tolles Training!", createdAt: "2026-01-23T19:05:00", isOnBehalf: true },
      { id: "fc1_3", senderId: "p12", senderName: "Lena für Flurina", content: "Flurina hat es auch sehr gefallen! Sie übt fleißig weiter 🏐", createdAt: "2026-01-23T19:10:00", isOnBehalf: true },
      { id: "fc1_4", senderId: "katja", senderName: "Trainerin Katja", content: "Morgen bitte alle in Vereinstrikot zum Spiel! 🏐", createdAt: "2026-01-24T19:30:00" },
      { id: "fc1_5", senderId: "teammate2", senderName: "Andrea für Emma", content: "Emma ist dabei und hat schon alles gepackt! Sie ist so aufgeregt 😊", createdAt: "2026-01-24T19:35:00", isOnBehalf: true },
      { id: "fc1_6", senderId: "teammate3", senderName: "Martina für Leonie", content: "Leonie auch! Können wir Fahrgemeinschaft machen?", createdAt: "2026-01-24T19:40:00", isOnBehalf: true }
    ],
    "flu_chat2": [
      { id: "fc2_1", senderId: "katja", senderName: "Trainerin Katja", content: "Hallo! Wie geht es Flurinas Knie?", createdAt: "2026-01-21T15:00:00" },
      { id: "fc2_2", senderId: "p12", senderName: "Lena für Flurina", content: "Hallo Frau Katja, hier schreibt Lena (Flurinas Mutter). Dem Knie geht es viel besser, sie kann morgen wieder voll trainieren.", createdAt: "2026-01-21T15:30:00", isOnBehalf: true },
      { id: "fc2_3", senderId: "katja", senderName: "Trainerin Katja", content: "Das freut mich zu hören! Danke für die Rückmeldung. Dann sehen wir Flurina morgen. Sie soll weiterhin die Übungen machen.", createdAt: "2026-01-21T15:35:00" },
      { id: "fc2_4", senderId: "katja", senderName: "Trainerin Katja", content: "Gut gemacht beim letzten Training, Flurina! Bitte richten Sie ihr das aus 😊", createdAt: "2026-01-23T19:30:00" },
      { id: "fc2_5", senderId: "p12", senderName: "Lena für Flurina", content: "Vielen Dank! Flurina hat sich sehr über das Lob gefreut. Wir sehen uns morgen beim Spiel!", createdAt: "2026-01-23T19:45:00", isOnBehalf: true }
    ]
  },
  news: [
    {
      id: "flu_news1",
      title: "Volleyball U16 startet in die Rückrunde",
      excerpt: "Nach einer erfolgreichen Hinrunde geht es für unsere U16 Mädchen am Samstag gegen TV Lich in die Rückrunde.",
      author: "Abteilung Volleyball",
      date: "23.01.2026 - 10:00",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=200&fit=crop",
      views: 78,
      comments: 5,
      likes: 24
    }
  ],
  freeSpots: [
    {
      id: "flu_fs1",
      title: "Beach-Volleyball Schnupperkurs",
      date: "Samstag",
      dateShort: "25. Jan.",
      time: "14:00 - 90 min.",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200&h=200&fit=crop"
    },
    {
      id: "flu_fs2",
      title: "Athletik Workshop U14-U18",
      date: "Sonntag",
      dateShort: "26. Jan.",
      time: "10:00 - 60 min.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop"
    },
    {
      id: "flu_fs3",
      title: "Volleyball Feriencamp",
      date: "Mo.-Fr.",
      dateShort: "3.-7. Feb.",
      time: "09:00 - 15:00",
      image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=200&h=200&fit=crop"
    }
  ]
};

// ==========================================
// ANNA BERGER - Minor WITHOUT Guardian (Volleyball U16)
// ==========================================
// Anna is on the same team as Flurina, but has NO parent/guardian linked
// This triggers special restrictions:
// - ✅ Can see team announcements
// - ✅ Can see and post in team group chat
// - ❌ NO direct messages allowed (coach cannot DM minor without parent)
// - ⚠️ Should see warning about missing guardian
const ANNA_PROFILE: MemberProfile = {
  id: "p14",
  firstName: "Anna",
  lastName: "Berger",
  email: "anna.berger@example.com",
  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",  // Young girl photo
  isChild: true,
  parentId: undefined,  // NO GUARDIAN LINKED!
  birthDate: "2011-09-15", // 14 years old
  clubId: "sfb",
  clubName: "Sportfreunde Burkhardsfelden",
  memberships: [
    { 
      departmentId: "dept_volleyball", 
      departmentName: "Volleyball", 
      role: "active" as const, 
      teamName: "Volleyball U16 Mädchen", 
      icon: "🏐",
      coachName: "Trainerin Katja",
      coachAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face"
    }
  ],
  stats: {
    termine: 3,
    nachrichten: 2,  // Only team chats, no DMs
    news: 3,
    offeneRechnungen: 0,
    offenerBetrag: "0,00 €"
  },
  nextEvent: {
    title: "Volleyball U16 Training",
    dayNumber: "24.",
    dayName: "Fr.",
    time: "17:00 - 90 min.",
    location: "Sporthalle 2"
  },
  events: [
    {
      id: "anna_evt1",
      title: "Volleyball U16 Training",
      date: "2026-01-24",
      dayName: "Fr.",
      dayNumber: "24.",
      time: "17:00 - 90 min.",
      location: "Sporthalle 2",
      type: "training",
      team: "Volleyball U16",
      teamAvatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=40&h=40&fit=crop",
      status: "confirmed",
      isToday: true
    },
    {
      id: "anna_evt2",
      title: "Punktspiel vs. TV Lich U16",
      date: "2026-01-25",
      dayName: "Sa.",
      dayNumber: "25.",
      time: "14:00 - 120 min.",
      location: "Sporthalle Lich",
      type: "match",
      team: "Volleyball U16",
      teamAvatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=40&h=40&fit=crop",
      status: "unconfirmed",  // Anna hasn't confirmed yet
      isTomorrow: true
    },
    {
      id: "anna_evt3",
      title: "Volleyball U16 Training",
      date: "2026-01-28",
      dayName: "Di.",
      dayNumber: "28.",
      time: "17:00 - 90 min.",
      location: "Sporthalle 2",
      type: "training",
      team: "Volleyball U16",
      teamAvatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=40&h=40&fit=crop",
      status: "booked"
    }
  ],
  chats: [
    // Anna only has team chat access - NO direct messages allowed!
    {
      id: "anna_chat1",
      name: "Volleyball U16 Mädchen",
      avatar: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=50&h=50&fit=crop",
      lastMessage: "Du: Danke Trainerin! 🥹",
      time: "19:44",
      unread: 0,
      type: "team"
    }
  ],
  chatHistory: {
    "anna_chat1": [
      { id: "ac1_1", senderId: "katja", senderName: "Trainerin Katja", content: "Super Leistung heute Mädels! 🌟", createdAt: "2026-01-23T19:00:00" },
      { id: "ac1_2", senderId: "flurina_parent", senderName: "Lena für Flurina", content: "Flurina hat es auch sehr gefallen! Sie übt fleißig weiter 🏐", createdAt: "2026-01-23T19:10:00", isOnBehalf: true },
      { id: "ac1_3", senderId: "p14", senderName: "Anna", content: "Das Aufschlagtraining war echt cool!", createdAt: "2026-01-23T19:12:00" },
      { id: "ac1_4", senderId: "katja", senderName: "Trainerin Katja", content: "Morgen bitte alle in Vereinstrikot zum Spiel! 🏐", createdAt: "2026-01-24T19:30:00" },
      { id: "ac1_5", senderId: "emma_parent", senderName: "Andrea für Emma", content: "Emma ist dabei und hat schon alles gepackt! 😊", createdAt: "2026-01-24T19:35:00", isOnBehalf: true },
      { id: "ac1_6", senderId: "p12", senderName: "Flurina", content: "Ich freu mich so aufs Spiel morgen! 🏐💪", createdAt: "2026-01-24T19:40:00" },
      { id: "ac1_7", senderId: "p14", senderName: "Anna", content: "Ich bin auch mega aufgeregt! Mein erstes Punktspiel 😬🏐", createdAt: "2026-01-24T19:42:00" },
      { id: "ac1_8", senderId: "katja", senderName: "Trainerin Katja", content: "@Anna Das wird super! Du hast so gut trainiert 💪", createdAt: "2026-01-24T19:43:00" },
      { id: "ac1_9", senderId: "p14", senderName: "Anna", content: "Danke Trainerin! 🥹", createdAt: "2026-01-24T19:44:00" }
    ]
  },
  news: [
    {
      id: "anna_news1",
      title: "Volleyball U16 startet in die Rückrunde",
      excerpt: "Nach einer erfolgreichen Hinrunde geht es für unsere U16 Mädchen am Samstag gegen TV Lich in die Rückrunde.",
      author: "Abteilung Volleyball",
      date: "23.01.2026 - 10:00",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=200&fit=crop",
      views: 78,
      comments: 5,
      likes: 24
    }
  ],
  freeSpots: [
    {
      id: "anna_fs1",
      title: "Beach-Volleyball Schnupperkurs",
      date: "Samstag",
      dateShort: "25. Jan.",
      time: "14:00 - 90 min.",
      image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=200&h=200&fit=crop"
    },
    {
      id: "anna_fs2",
      title: "Athletik Workshop U14-U18",
      date: "Sonntag",
      dateShort: "26. Jan.",
      time: "10:00 - 60 min.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop"
    }
  ]
};

// ==========================================
// MAX SCHNEIDER - Son (Football U12 @ SfB + TuS Makkabi)
// ==========================================
const MAX_PROFILE: MemberProfile = {
  id: "p13",
  firstName: "Max",
  lastName: "Schneider",
  email: "lena.schneider@example.com",
  avatar: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=150&h=150&fit=crop&crop=face",
  isChild: true,
  parentId: "p11",
  birthDate: "2014-08-03",
  clubId: "sfb",
  clubName: "Sportfreunde Burkhardsfelden",
  memberships: [
    { 
      departmentId: "dept_football", 
      departmentName: "Fußball", 
      role: "active" as const, 
      teamName: "Fußball U12", 
      icon: "⚽",
      coachName: "Trainer Marco",
      coachAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    }
  ],
  stats: {
    termine: 4,
    nachrichten: 5,
    news: 4,
    offeneRechnungen: 0,
    offenerBetrag: "0,00 €"
  },
  nextEvent: {
    title: "Fußball U12 Training",
    dayNumber: "24.",
    dayName: "Fr.",
    time: "16:00 - 75 min.",
    location: "Platz 3"
  },
  events: [
    {
      id: "max_evt1",
      title: "Fußball U12 Training",
      date: "2026-01-24",
      dayName: "Fr.",
      dayNumber: "24.",
      time: "16:00 - 75 min.",
      location: "Platz 3",
      type: "training",
      team: "Fußball U12",
      teamAvatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=40&h=40&fit=crop",
      status: "confirmed",
      isToday: true
    },
    {
      id: "max_evt2",
      title: "Ligaspiel vs. JSG Laubach U12",
      date: "2026-01-25",
      dayName: "Sa.",
      dayNumber: "25.",
      time: "10:30 - 60 min.",
      location: "Sportplatz SfB",
      type: "match",
      team: "Fußball U12",
      teamAvatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=40&h=40&fit=crop",
      status: "confirmed",
      isTomorrow: true
    },
    {
      id: "max_evt3",
      title: "Fußball U12 Training",
      date: "2026-01-27",
      dayName: "Mo.",
      dayNumber: "27.",
      time: "16:00 - 75 min.",
      location: "Platz 3",
      type: "training",
      team: "Fußball U12",
      teamAvatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=40&h=40&fit=crop",
      status: "booked"
    },
    {
      id: "max_evt4",
      title: "Rising Stars Training (TuS Makkabi)",
      date: "2026-01-28",
      dayName: "Di.",
      dayNumber: "28.",
      time: "17:30 - 75 min.",
      location: "Sportpark Makkabi",
      type: "training",
      team: "Rising Stars U12",
      teamAvatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=40&h=40&fit=crop",
      status: "booked"
    }
  ],
  chats: [
    {
      id: "max_chat1",
      name: "Fußball U12 – SfB",
      avatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=50&h=50&fit=crop",
      lastMessage: "Du (Lena): Max ist dabei! Wir sind pünktlich da 👍",
      time: "18:20",
      unread: 0,
      type: "team"
    },
    {
      id: "max_chat2",
      name: "Trainer Marco",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      lastMessage: "Du (Lena): Danke! Max strahlt über beide Ohren 😊",
      time: "Gestern",
      unread: 0,
      type: "direct"
    },
    {
      id: "max_chat3",
      name: "An: Abteilungsleitung",
      avatar: null,
      isRequest: true,
      lastMessage: "Frage zum Spielerpass",
      time: "18.01.2026",
      unread: 0,
      type: "request"
    }
  ],
  chatHistory: {
    "max_chat1": [
      { id: "mc1_1", senderId: "marco", senderName: "Trainer Marco", content: "Jungs, tolles Spiel am Wochenende! 3:1 gewonnen! 🎉", createdAt: "2026-01-20T18:00:00" },
      { id: "mc1_2", senderId: "teammate1", senderName: "Thomas für Leon", content: "Leon ist überglücklich! Das war ein super Spiel!", createdAt: "2026-01-20T18:05:00", isOnBehalf: true },
      { id: "mc1_3", senderId: "p13", senderName: "Lena für Max", content: "Max ist total happy über den Sieg! Er freut sich schon aufs nächste Training ⚽", createdAt: "2026-01-20T18:10:00", isOnBehalf: true },
      { id: "mc1_4", senderId: "teammate3", senderName: "Stefan für Paul", content: "Paul hat das ganze Wochenende davon erzählt! 😄", createdAt: "2026-01-20T18:15:00", isOnBehalf: true },
      { id: "mc1_5", senderId: "marco", senderName: "Trainer Marco", content: "Morgen Heimspiel - alle bitte pünktlich um 10:00! ⚽", createdAt: "2026-01-24T18:00:00" },
      { id: "mc1_6", senderId: "teammate2", senderName: "Kathrin für Tim", content: "Tim ist dabei! Wir bringen Orangenscheiben mit 🍊", createdAt: "2026-01-24T18:15:00", isOnBehalf: true },
      { id: "mc1_7", senderId: "p13", senderName: "Lena für Max", content: "Max ist dabei! Wir sind pünktlich um 10:00 da 👍", createdAt: "2026-01-24T18:20:00", isOnBehalf: true },
      { id: "mc1_8", senderId: "teammate1", senderName: "Thomas für Leon", content: "Leon auch! Kann jemand Fahrgemeinschaft ab Sportplatz?", createdAt: "2026-01-24T18:25:00", isOnBehalf: true }
    ],
    "max_chat2": [
      { id: "mc2_1", senderId: "marco", senderName: "Trainer Marco", content: "Hallo! Wie geht es Max nach dem Training gestern?", createdAt: "2026-01-22T14:00:00" },
      { id: "mc2_2", senderId: "p13", senderName: "Lena für Max", content: "Hallo Herr Marco, hier ist Lena (Max' Mama). Ihm geht es super! Er übt jeden Tag Dribbeln im Garten 😊", createdAt: "2026-01-22T14:30:00", isOnBehalf: true },
      { id: "mc2_3", senderId: "marco", senderName: "Trainer Marco", content: "Das freut mich zu hören! Das sieht man auch im Training - er macht tolle Fortschritte. Weiter so! 🌟", createdAt: "2026-01-22T14:35:00" },
      { id: "mc2_4", senderId: "marco", senderName: "Trainer Marco", content: "Max hat heute wieder toll gespielt! Bitte richten Sie ihm ein großes Lob aus 👍", createdAt: "2026-01-23T17:30:00" },
      { id: "mc2_5", senderId: "p13", senderName: "Lena für Max", content: "Danke für die Rückmeldung! Max strahlt über beide Ohren. Er freut sich schon auf morgen!", createdAt: "2026-01-23T17:45:00", isOnBehalf: true }
    ]
  },
  news: [
    {
      id: "max_news1",
      title: "U12 gewinnt Heimspiel deutlich",
      excerpt: "Mit einem klaren 3:1 Sieg gegen FC Wettenberg startet unsere U12 erfolgreich ins neue Jahr. Max Schneider mit einem Tor!",
      author: "Abteilung Jugendfußball",
      date: "20.01.2026 - 19:00",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=200&fit=crop",
      views: 124,
      comments: 12,
      likes: 45
    },
    {
      id: "max_news2",
      title: "Hallenturnier für U12 angekündigt",
      excerpt: "Am 15. Februar findet das traditionelle Hallenturnier in der Großsporthalle statt. Alle U12 Teams sind eingeladen!",
      author: "Vereinsvorstand",
      date: "18.01.2026 - 10:00",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
      views: 89,
      comments: 6,
      likes: 28
    }
  ],
  freeSpots: [
    {
      id: "max_fs1",
      title: "Fußball Technik Camp",
      date: "Samstag",
      dateShort: "25. Jan.",
      time: "10:00 - 120 min.",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=200&h=200&fit=crop"
    },
    {
      id: "max_fs2",
      title: "Torwart Workshop U10-U14",
      date: "Sonntag",
      dateShort: "26. Jan.",
      time: "09:00 - 90 min.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop"
    },
    {
      id: "max_fs3",
      title: "Fußball Ostercamp",
      date: "Mo.-Fr.",
      dateShort: "14.-18. Apr.",
      time: "09:00 - 15:00",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop"
    }
  ]
};

// Max's profile at TuS Makkabi Frankfurt (second club)
const MAX_MAKKABI_PROFILE: MemberProfile = {
  id: "p13_makkabi",
  firstName: "Max",
  lastName: "Schneider",
  email: "lena.schneider@example.com",
  avatar: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=150&h=150&fit=crop&crop=face",
  isChild: true,
  parentId: "p11",
  birthDate: "2014-08-03",
  clubId: "makkabi",
  clubName: "TuS Makkabi Frankfurt",
  memberships: [
    { 
      departmentId: "dept_football_mak", 
      departmentName: "Fußball", 
      role: "active" as const, 
      teamName: "Rising Stars U12", 
      icon: "⚽",
      coachName: "Coach David",
      coachAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    }
  ],
  stats: {
    termine: 2,
    nachrichten: 3,
    news: 2,
    offeneRechnungen: 0,
    offenerBetrag: "0,00 €"
  },
  nextEvent: {
    title: "Rising Stars Training",
    dayNumber: "28.",
    dayName: "Di.",
    time: "17:30 - 75 min.",
    location: "Sportpark Makkabi"
  },
  events: [
    {
      id: "mak_evt1",
      title: "Rising Stars Training",
      date: "2026-01-28",
      dayName: "Di.",
      dayNumber: "28.",
      time: "17:30 - 75 min.",
      location: "Sportpark Makkabi",
      type: "training",
      team: "Rising Stars U12",
      teamAvatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=40&h=40&fit=crop",
      status: "booked"
    },
    {
      id: "mak_evt2",
      title: "Freundschaftsspiel vs. Eintracht Frankfurt U12",
      date: "2026-02-01",
      dayName: "Sa.",
      dayNumber: "01.",
      time: "11:00 - 60 min.",
      location: "Sportpark Makkabi",
      type: "match",
      team: "Rising Stars U12",
      teamAvatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=40&h=40&fit=crop",
      status: "unconfirmed"
    }
  ],
  chats: [
    {
      id: "mak_chat1",
      name: "Rising Stars U12",
      avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=50&h=50&fit=crop",
      lastMessage: "Du (Lena): Alles klar! Max packt warme Sachen ein 👍",
      time: "Gestern",
      unread: 0,
      type: "team"
    },
    {
      id: "mak_chat2",
      name: "Coach David",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      lastMessage: "Du (Lena): Max ist begeistert vom Team!",
      time: "15.01.2026",
      unread: 0,
      type: "direct"
    },
    {
      id: "mak_chat3",
      name: "An: Mitgliederverwaltung",
      avatar: null,
      isRequest: true,
      lastMessage: "Anmeldung zum Sommercamp",
      time: "16.01.2026",
      unread: 0,
      type: "request"
    }
  ],
  chatHistory: {
    "mak_chat1": [
      { id: "mkc1_1", senderId: "david", senderName: "Coach David", content: "Willkommen im Team, Max! Wir freuen uns auf dich! 🌟", createdAt: "2026-01-15T17:00:00" },
      { id: "mkc1_2", senderId: "teammate1", senderName: "Daniel für Noah", content: "Noah freut sich auch! Willkommen im Team, Max! 🙌", createdAt: "2026-01-15T17:10:00", isOnBehalf: true },
      { id: "mkc1_3", senderId: "p13_makkabi", senderName: "Lena für Max", content: "Vielen Dank für den herzlichen Empfang! Max freut sich sehr, Teil des Teams zu sein ⚽", createdAt: "2026-01-15T17:15:00", isOnBehalf: true },
      { id: "mkc1_4", senderId: "teammate2", senderName: "Sarah für Ben", content: "Ben sagt auch Willkommen! Er kennt Max vom Schulhof 😊", createdAt: "2026-01-15T17:20:00", isOnBehalf: true },
      { id: "mkc1_5", senderId: "david", senderName: "Coach David", content: "Training am Dienstag wie gewohnt. Bringt warme Kleidung!", createdAt: "2026-01-23T18:00:00" },
      { id: "mkc1_6", senderId: "teammate1", senderName: "Daniel für Noah", content: "Noah packt die Winterjacke ein! ❄️", createdAt: "2026-01-23T18:10:00", isOnBehalf: true },
      { id: "mkc1_7", senderId: "p13_makkabi", senderName: "Lena für Max", content: "Alles klar! Max packt schon seine warmen Sachen ein 👍", createdAt: "2026-01-23T18:15:00", isOnBehalf: true }
    ],
    "mak_chat2": [
      { id: "mkc2_1", senderId: "david", senderName: "Coach David", content: "Hallo! Ich bin Coach David, Max' neuer Trainer bei den Rising Stars.", createdAt: "2026-01-14T10:00:00" },
      { id: "mkc2_2", senderId: "p13_makkabi", senderName: "Lena für Max", content: "Hallo Coach David! Hier ist Lena, Max' Mama. Er freut sich riesig auf das Training bei den Rising Stars!", createdAt: "2026-01-14T10:30:00", isOnBehalf: true },
      { id: "mkc2_3", senderId: "david", senderName: "Coach David", content: "Schön, Sie kennenzulernen! Willkommen bei den Rising Stars. Max wird sich hier wohlfühlen!", createdAt: "2026-01-15T09:00:00" },
      { id: "mkc2_4", senderId: "p13_makkabi", senderName: "Lena für Max", content: "Danke! Max hat nach dem ersten Training nur Positives erzählt. Er ist begeistert vom Team!", createdAt: "2026-01-15T18:00:00", isOnBehalf: true }
    ]
  },
  news: [
    {
      id: "mak_news1",
      title: "Rising Stars begrüßt neue Spieler",
      excerpt: "Wir freuen uns, drei neue Talente in unserem U12 Team begrüßen zu dürfen. Willkommen Max, Ben und Elias!",
      author: "Jugendabteilung",
      date: "16.01.2026 - 12:00",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
      views: 67,
      comments: 4,
      likes: 19
    }
  ],
  freeSpots: [
    {
      id: "mak_fs1",
      title: "Makkabi Fußball Camp",
      date: "Samstag",
      dateShort: "1. Feb.",
      time: "10:00 - 180 min.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=200&fit=crop"
    },
    {
      id: "mak_fs2",
      title: "Skills & Tricks Workshop",
      date: "Sonntag",
      dateShort: "2. Feb.",
      time: "14:00 - 90 min.",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop"
    },
    {
      id: "mak_fs3",
      title: "Makkabi Sommercamp 2026",
      date: "Mo.-Fr.",
      dateShort: "6.-10. Jul.",
      time: "09:00 - 16:00",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=200&h=200&fit=crop"
    }
  ]
};

// All family profiles (SfB club)
const FAMILY_PROFILES = [LENA_PROFILE, FLURINA_PROFILE, MAX_PROFILE];

// Person label colors - each family member gets a distinct color
const PERSON_COLORS: Record<string, { bg: string; text: string }> = {
  "p11": { bg: "#C8F2E0", text: "#004941" },  // Lena - green
  "p12": { bg: "#EDE9FE", text: "#5B21B6" },  // Flurina - purple
  "p13": { bg: "#DBEAFE", text: "#1D4ED8" },  // Max - blue
  "p14": { bg: "#FEF3C7", text: "#92400E" },  // Anna - amber
};

// Other clubs - for profile switcher
const OTHER_CLUBS = [
  {
    id: "makkabi",
    name: "TuS Makkabi Frankfurt",
    shortName: "TuS",
    location: "Frankfurt am Main",
    logo: null, // Will use text-based logo instead
    profiles: [MAX_MAKKABI_PROFILE] // Max has a profile here
  }
];

// Mock club data
const CLUB_DATA = {
  name: "Sportfreunde Burkhardsfelden",
  shortName: "SfB",
  logo: null
};

// Mock Enhanced Events based on Unified Event Model
const MOCK_ENHANCED_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_team_1",
    title: "Fußball U12 Training",
    description: "Reguläres Mannschaftstraining mit Fokus auf Passübungen und Spieltaktik.",
    date: "2026-01-27",
    startTime: "16:00",
    endTime: "17:15",
    location: "Platz 3",
    scope: "team",
    type: "training",
    visibility: ["all"],
    team: "Fußball U12",
    organizer: "Trainer Marco",
    organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    participants: { confirmed: 12, pending: 3, declined: 1 },
    rsvpRequired: true,
    rsvpDeadline: "2026-01-27T12:00",
    myRsvp: "confirmed",
    resources: ["Platz 3", "Trainingsleibchen"],
    isRecurring: true,
    recurringPattern: "Jeden Dienstag",
    bannerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop"
  },
  {
    id: "evt_team_2",
    title: "Ligaspiel vs. JSG Laubach U12",
    description: "Heimspiel in der Kreisliga. Treffpunkt 30 Minuten vor Spielbeginn.",
    date: "2026-01-28",
    startTime: "10:30",
    endTime: "11:30",
    location: "Sportplatz SfB",
    scope: "team",
    type: "match",
    visibility: ["all"],
    team: "Fußball U12",
    organizer: "Trainer Marco",
    organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    participants: { confirmed: 14, pending: 1, declined: 0 },
    rsvpRequired: true,
    rsvpDeadline: "2026-01-27T18:00",
    myRsvp: "confirmed",
    resources: ["Hauptplatz", "Kabine 1"],
    notes: "Bitte alle in Vereinstrikot erscheinen!",
    dfbReference: "SP-2026-00123",
    bannerImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=400&fit=crop"
  },
  {
    id: "evt_club_info",
    title: "Elternabend - Jugendfußball",
    description: "Informationsabend für alle Eltern der Jugendmannschaften. Themen: Saisonplanung, Trainingscamp, Elternmitarbeit.",
    date: "2026-01-30",
    startTime: "19:00",
    endTime: "21:00",
    location: "Vereinsheim - großer Saal",
    scope: "club",
    type: "general",
    visibility: ["parents", "coaches"],
    organizer: "Jugendleiter Thomas",
    organizerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
    participants: { confirmed: 28, pending: 12, declined: 5 },
    rsvpRequired: true,
    rsvpDeadline: "2026-01-28T23:59",
    myRsvp: "pending",
    resources: ["Großer Saal", "Beamer"]
  },
  {
    id: "evt_club_1",
    title: "Jahreshauptversammlung 2026",
    description: "Ordentliche Mitgliederversammlung mit Vorstandswahlen und Jahresrückblick.",
    date: "2026-02-15",
    startTime: "18:00",
    endTime: "21:00",
    location: "Vereinsheim - großer Saal",
    scope: "club",
    type: "general",
    visibility: ["all"],
    organizer: "Vorstand",
    participants: { confirmed: 67, pending: 34, declined: 12 },
    rsvpRequired: true,
    rsvpDeadline: "2026-02-10T23:59",
    myRsvp: null,
    attachments: [
      { name: "Einladung_JHV_2026.pdf", type: "pdf" },
      { name: "Tagesordnung.pdf", type: "pdf" }
    ],
    resources: ["Großer Saal", "Mikrofon", "Beamer"],
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop"
  },
  {
    id: "evt_club_fasching",
    title: "Vereinsfasching 2026",
    description: "Großer Vereinsfasching für die ganze Familie! Mit DJ, Kinderprogramm, Tombola und Buffet. Kostüme erwünscht! 🎭🎉",
    date: "2026-02-22",
    startTime: "15:00",
    endTime: "22:00",
    location: "Vereinsheim - Großer Saal",
    scope: "club",
    type: "general",
    visibility: ["all"],
    organizer: "Patrick Steuble",
    organizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    participants: { confirmed: 89, pending: 260, declined: 45 },
    rsvpRequired: true,
    rsvpDeadline: "2026-02-18T23:59",
    myRsvp: null,
    bannerImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop"
  },
  {
    id: "evt_club_2",
    title: "Sommerfest 2026",
    description: "Großes Vereinsfest für alle Mitglieder und Familien. Mit Spielen, Tombola und Livemusik.",
    date: "2026-06-21",
    startTime: "14:00",
    endTime: "22:00",
    location: "Vereinsgelände",
    scope: "club",
    type: "general",
    visibility: ["all"],
    organizer: "Festausschuss",
    participants: { confirmed: 156, pending: 89, declined: 23 },
    rsvpRequired: false,
    myRsvp: null,
    notes: "Helfer für Auf- und Abbau gesucht!",
    isAllDay: true,
    bannerImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop"
  },
  // --- Public club matches (other teams) ---
  {
    id: "evt_pub_match_1",
    title: "1. Mannschaft – Ligaspiel vs. SV Lollar",
    description: "Heimspiel der 1. Mannschaft in der Kreisliga A. Kommt zahlreich und unterstützt unsere Jungs!",
    date: "2026-03-07",
    startTime: "15:00",
    endTime: "16:30",
    location: "Sportplatz SfB – Hauptplatz",
    scope: "club",
    type: "match",
    visibility: ["all"],
    team: "1. Mannschaft",
    organizer: "Abteilung Fußball",
    participants: { confirmed: 0, pending: 0, declined: 0 },
    rsvpRequired: false,
    myRsvp: null,
    dfbReference: "SP-2026-00201",
    bannerImage: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800&h=400&fit=crop"
  },
  {
    id: "evt_pub_match_2",
    title: "2. Mannschaft – Auswärtsspiel bei TSV Grünberg",
    description: "Auswärtsspiel der 2. Mannschaft. Anpfiff um 14 Uhr, Treffpunkt beim Vereinsheim um 12:45 Uhr zur Abfahrt.",
    date: "2026-03-08",
    startTime: "14:00",
    endTime: "15:30",
    location: "Sportplatz TSV Grünberg",
    scope: "club",
    type: "match",
    visibility: ["all"],
    team: "2. Mannschaft",
    organizer: "Abteilung Fußball",
    participants: { confirmed: 0, pending: 0, declined: 0 },
    rsvpRequired: false,
    myRsvp: null,
    dfbReference: "SP-2026-00202"
  },
  {
    id: "evt_pub_match_3",
    title: "A-Jugend (U19) – Ligaspiel vs. FC Lich",
    description: "Heimspiel der A-Jugend in der Gruppenliga Mittelhessen. Anfeuerung erwünscht!",
    date: "2026-03-14",
    startTime: "11:00",
    endTime: "12:30",
    location: "Sportplatz SfB – Platz 2",
    scope: "club",
    type: "match",
    visibility: ["all"],
    team: "A-Jugend (U19)",
    organizer: "Jugendobmann",
    participants: { confirmed: 0, pending: 0, declined: 0 },
    rsvpRequired: false,
    myRsvp: null,
    dfbReference: "SP-2026-00210",
    bannerImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=400&fit=crop"
  },
  {
    id: "evt_pub_match_4",
    title: "Frauen – Ligaspiel vs. SV Fernwald",
    description: "Heimspiel unserer Frauenmannschaft. Zeigt euren Support und kommt vorbei!",
    date: "2026-03-15",
    startTime: "13:00",
    endTime: "14:30",
    location: "Sportplatz SfB – Hauptplatz",
    scope: "club",
    type: "match",
    visibility: ["all"],
    team: "Frauenmannschaft",
    organizer: "Abteilung Fußball",
    participants: { confirmed: 0, pending: 0, declined: 0 },
    rsvpRequired: false,
    myRsvp: null,
    dfbReference: "SP-2026-00215",
    bannerImage: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=400&fit=crop"
  },
  {
    id: "evt_pub_match_5",
    title: "1. Mannschaft – Auswärtsspiel bei FC Reiskirchen",
    description: "Auswärtsspiel in der Kreisliga A. Wer mitfahren möchte, meldet sich bitte bei der Abteilungsleitung.",
    date: "2026-03-21",
    startTime: "15:30",
    endTime: "17:00",
    location: "Sportplatz FC Reiskirchen",
    scope: "club",
    type: "match",
    visibility: ["all"],
    team: "1. Mannschaft",
    organizer: "Abteilung Fußball",
    participants: { confirmed: 0, pending: 0, declined: 0 },
    rsvpRequired: false,
    myRsvp: null,
    dfbReference: "SP-2026-00220"
  },
  {
    id: "evt_pub_match_6",
    title: "B-Jugend (U17) – Kreispokal-Halbfinale",
    description: "Unser B-Jugend-Team steht im Halbfinale des Kreispokals! Kommt und unterstützt die Mannschaft.",
    date: "2026-03-28",
    startTime: "10:00",
    endTime: "11:30",
    location: "Sportplatz SfB – Platz 2",
    scope: "club",
    type: "match",
    visibility: ["all"],
    team: "B-Jugend (U17)",
    organizer: "Jugendobmann",
    participants: { confirmed: 0, pending: 0, declined: 0 },
    rsvpRequired: false,
    myRsvp: null,
    dfbReference: "SP-2026-KP-07",
    bannerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop"
  },
  // --- Public club events (general) ---
  {
    id: "evt_pub_hallenturnier",
    title: "Jugend-Hallenturnier SfB",
    description: "Unser jährliches Hallenfußballturnier für alle Jugendmannschaften des Vereins. Spannende Spiele, Siegerehrung und Verpflegung vor Ort.",
    date: "2026-03-22",
    startTime: "09:00",
    endTime: "17:00",
    location: "Sporthalle Burkhardsfelden",
    scope: "club",
    type: "general",
    visibility: ["all"],
    organizer: "Jugendausschuss",
    participants: { confirmed: 84, pending: 30, declined: 6 },
    rsvpRequired: false,
    myRsvp: null,
    notes: "Helfer für Auf- und Abbau gesucht – bitte bei Thomas melden.",
    isAllDay: true,
    bannerImage: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&h=400&fit=crop"
  },
  {
    id: "evt_pub_fruehjahrsputz",
    title: "Frühjahrsputz am Sportgelände",
    description: "Gemeinsamer Frühjahrsputz auf unserem Vereinsgelände. Alle Mitglieder sind eingeladen zu helfen – Essen & Getränke werden gestellt.",
    date: "2026-04-11",
    startTime: "09:00",
    endTime: "13:00",
    location: "Vereinsgelände SfB",
    scope: "club",
    type: "general",
    visibility: ["all"],
    organizer: "Vorstand",
    participants: { confirmed: 23, pending: 41, declined: 4 },
    rsvpRequired: true,
    rsvpDeadline: "2026-04-08T23:59",
    myRsvp: null,
    notes: "Bitte Arbeitskleidung und Gartengeräte mitbringen."
  },
  {
    id: "evt_pub_ehrungsabend",
    title: "Vereinsabend & Ehrung 2026",
    description: "Jährlicher Vereinsabend mit Ehrungen für langjährige Mitglieder, Jahresrückblick und gemütlichem Beisammensein. Einlass ab 18:30 Uhr.",
    date: "2026-04-25",
    startTime: "19:00",
    endTime: "23:00",
    location: "Vereinsheim – Großer Saal",
    scope: "club",
    type: "general",
    visibility: ["all"],
    organizer: "Vereinsvorstand",
    organizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    participants: { confirmed: 112, pending: 78, declined: 18 },
    rsvpRequired: true,
    rsvpDeadline: "2026-04-20T23:59",
    myRsvp: null,
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
  },
  {
    id: "evt_team_3",
    title: "Fitness - Morgengruppe",
    description: "Core-Training und Stretching für einen guten Start in den Tag.",
    date: "2026-01-27",
    startTime: "07:00",
    endTime: "08:00",
    location: "Fitness Studio",
    scope: "team",
    type: "training",
    visibility: ["all"],
    team: "Fitness – Morgengruppe",
    organizer: "Trainerin Sandra",
    organizerAvatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=50&h=50&fit=crop&crop=face",
    participants: { confirmed: 8, pending: 2, declined: 1 },
    rsvpRequired: false,
    myRsvp: "confirmed",
    isRecurring: true,
    recurringPattern: "Mo, Mi, Fr",
    bannerImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop"
  }
];

// Mock news
const MOCK_NEWS = [
  {
    id: "news1",
    title: "Erfolgreicher Saisonstart der Fußballabteilung",
    excerpt: "Unsere Fußballmannschaften sind erfolgreich in die neue Saison gestartet. Besonders die Erste Mannschaft überzeugte mit starkem Teamgeist und...",
    author: "Vorstand Sport",
    authorAvatar: null,
    date: "23.04.2026 - 16:28",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=200&fit=crop",
    views: 328,
    comments: 12,
    likes: 12
  },
  {
    id: "news2",
    title: "Neue Yoga-Kurse ab Oktober",
    excerpt: "Ab Oktober erweitern wir unser Yoga-Angebot um zusätzliche Abendkurse. Sowohl Anfänger als auch Fortgeschrittene sind herzlich willkommen.",
    author: "Abteilung Yoga",
    authorAvatar: null,
    date: "22.04.2026 - 07:12",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop",
    views: 328,
    comments: 12,
    likes: 12
  },
  {
    id: "news3",
    title: "Einladung zur Jahreshauptversammlung",
    excerpt: "Wir laden alle Mitglieder herzlich zur diesjährigen Jahreshauptversammlung ein. Neben einem Rückblick auf das vergangene Jahr stehen auch Ne...",
    author: "Vereinsvorstand",
    authorAvatar: null,
    date: "21.04.2026 - 19:42",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    views: 328,
    comments: 12,
    likes: 12
  }
];

// Mock chat messages with avatars
const MOCK_MESSAGES = [
  {
    id: "msg1",
    name: "1. Mannschaft – Fußball",
    avatar: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=50&h=50&fit=crop",
    lastMessage: "Trainer: Training morgen fällt aus, wir treffen uns am Freitag wieder.",
    time: "18:32",
    unread: 0,
    type: "team"
  },
  {
    id: "msg2",
    name: "Yoga – Fortgeschrittenen Kurs",
    avatar: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=50&h=50&fit=crop",
    lastMessage: "Du: Danke für die tolle Stunde heute 🙏",
    time: "23.04.2026",
    unread: 0,
    type: "team"
  },
  {
    id: "msg3",
    name: "Sportfreunde Burkhardsfelden",
    avatar: null,
    isClub: true,
    lastMessage: "Verein: Die Mitgliederversammlung findet am 15.06. statt.",
    time: "23.04.2026",
    unread: 2,
    type: "club"
  },
  {
    id: "msg4",
    name: "Eltern U10",
    avatar: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=50&h=50&fit=crop",
    lastMessage: "Sabine: Fahrgemeinschaft fürs Auswärtsspiel organisiert 🚗",
    time: "23.04.2026",
    unread: 0,
    type: "group"
  },
  {
    id: "msg5",
    name: "An: Abteilungsleitung",
    avatar: null,
    isRequest: true,
    lastMessage: "Frage zur Beitragsrechnung Januar",
    time: "23.04.2026",
    unread: 0,
    type: "request"
  },
  {
    id: "msg6",
    name: "Yoga – Morgenkurs",
    avatar: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=50&h=50&fit=crop",
    lastMessage: '5 Reaktionen: 🙏 auf "Danke für die entspannte Einheit"',
    time: "23.04.2026",
    unread: 0,
    type: "team"
  },
  {
    id: "msg7",
    name: "Flyer & Design Team",
    avatar: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=50&h=50&fit=crop",
    lastMessage: "Lisa: Entwurf ist fertig, Feedback gern bis morgen.",
    time: "23.04.2026",
    unread: 0,
    type: "group"
  },
  {
    id: "msg8",
    name: "Markus Becker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
    lastMessage: "Du: Alles klar, danke für die Info!",
    time: "23.04.2026",
    unread: 0,
    type: "direct"
  },
  {
    id: "msg9",
    name: "Vereinsfest – Helfergruppe",
    avatar: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=50&h=50&fit=crop",
    lastMessage: "Max: Ich kann beim Aufbau ab 14 Uhr helfen 👍",
    time: "23.04.2026",
    unread: 1,
    type: "group"
  },
  {
    id: "msg10",
    name: "Justine Müller",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    lastMessage: "Justine: Passt für mich, danke dir!",
    time: "23.04.2026",
    unread: 0,
    type: "direct"
  }
];

// Pinned/important messages - Not used in enhanced chat view
// const PINNED_MESSAGES = [
//   { id: "pin1", name: "Eltern U12", avatar: "...", preview: "...", unread: 2 },
//   { id: "pin2", name: "Vorstand & A...", avatar: "...", preview: "...", unread: 1 },
//   { id: "pin3", name: "Schiedsrichte...", avatar: "...", preview: "...", unread: 0 }
// ];

// Status config
const statusConfig: Record<TicketStatus, { label: string; color: string; textColor: string; icon: typeof Clock }> = {
  open: { label: "Offen", color: "bg-blue-100", textColor: "text-blue-600", icon: AlertCircle },
  pending: { label: "In Bearbeitung", color: "bg-amber-100", textColor: "text-amber-600", icon: Clock },
  resolved: { label: "Erledigt", color: "bg-green-100", textColor: "text-green-600", icon: CheckCircle },
  closed: { label: "Geschlossen", color: "bg-neutral-100", textColor: "text-neutral-600", icon: CheckCircle }
};

// Category config
const categoryConfig: Record<TicketCategory, { label: string; emoji: string }> = {
  fee_question: { label: "Beitragsfrage", emoji: "💰" },
  membership: { label: "Mitgliedschaft", emoji: "👤" },
  documents: { label: "Dokumente", emoji: "📄" },
  registration: { label: "Anmeldung", emoji: "📝" },
  technical: { label: "Technisch", emoji: "🔧" },
  general: { label: "Allgemein", emoji: "💬" },
  complaint: { label: "Beschwerde", emoji: "⚠️" },
  suggestion: { label: "Vorschlag", emoji: "💡" },
  absence: { label: "Abwesenheit", emoji: "🏖️" },
  equipment: { label: "Ausrüstung", emoji: "👕" },
  organization: { label: "Organisation", emoji: "📋" },
  report: { label: "Nachricht melden", emoji: "🚨" }
};

type ViewState = "home" | "kalender" | "chats" | "news" | "profile" | "message-detail" | "chat-detail" | "new-request" | "request-form" | "event-detail";

// Event types based on Unified Event Model (simplified for Pilot/MVP)
// Note: "department" scope is a future extension
type EventScope = "team" | "club";
type EventType = "general" | "training" | "match" | "friendly";
type EventVisibility = "all" | "players" | "parents" | "coaches" | "board";

// Enhanced Event interface
interface EnhancedEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  scope: EventScope;
  type: EventType;
  visibility: EventVisibility[];
  team?: string;
  department?: string;
  organizer: string;
  organizerAvatar?: string;
  participants?: { confirmed: number; pending: number; declined: number };
  rsvpRequired: boolean;
  rsvpDeadline?: string;
  myRsvp?: "confirmed" | "pending" | "declined" | null;
  attachments?: { name: string; type: string }[];
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  resources?: string[];
  dfbReference?: string; // For DFB/SpielPlus integration
  bannerImage?: string;
  isAllDay?: boolean;
}

// Mock attachment type
interface Attachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "doc" | "other";
  size: string;
  url: string;
}

// Profile slug mapping
const PROFILE_MAP: Record<string, MemberProfile> = {
  "lena": LENA_PROFILE,
  "flurina": FLURINA_PROFILE,
  "max": MAX_PROFILE,
  "anna": ANNA_PROFILE  // Minor WITHOUT guardian - special restricted view
};

// Get profile by ID (for future use)
// const getProfileById = (id: string): MemberProfile | undefined => {
//   return FAMILY_PROFILES.find(p => p.id === id);
// };

export function PilotMemberPortal() {
  // URL routing
  const { profileSlug } = useParams<{ profileSlug: string }>();
  const navigate = useNavigate();
  
  const [view, setView] = useState<ViewState>("home");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedForm, setSelectedForm] = useState<typeof mockTicketForms[0] | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [calendarWeekOffset, setCalendarWeekOffset] = useState(0);
  const [calendarViewMode, setCalendarViewMode] = useState<"my" | "club">("my");
  const [chatTab, setChatTab] = useState<"announcements" | "team" | "direct" | "requests">("announcements");
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [language, setLanguage] = useState<Language>("de");
  
  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<{ id: string; content: string; senderName: string } | null>(null);
  const [reportCategory, setReportCategory] = useState<string>("");
  const [reportDescription, setReportDescription] = useState("");
  
  // Determine the viewing mode based on URL
  // profileSlug determines WHO is logged in (lena = adult, flurina/max = child view)
  const urlProfile = profileSlug ? PROFILE_MAP[profileSlug.toLowerCase()] : LENA_PROFILE;
  
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  // The "logged in" profile (from URL) - this determines permissions
  const loggedInProfile = urlProfile || LENA_PROFILE;

  // Is this a kid's direct view (restricted mode)?
  const isKidDirectView = loggedInProfile.isChild === true;

  // For the header/greeting, always show the logged-in user
  const activeProfile = loggedInProfile;

  // Multi-profile enabled state - which family members to show in the global view
  // Default: all family profiles enabled (for Lena), or just self (for kids)
  const [enabledProfileIds, setEnabledProfileIds] = useState<Set<string>>(
    () => new Set(isKidDirectView ? [loggedInProfile.id] : FAMILY_PROFILES.map(p => p.id))
  );

  // Enabled profiles for the global view
  const enabledProfiles = isKidDirectView
    ? [loggedInProfile]
    : FAMILY_PROFILES.filter(p => enabledProfileIds.has(p.id));

  // Toggle a profile's visibility in the global view
  const toggleProfile = (profileId: string) => {
    setEnabledProfileIds(prev => {
      if (prev.size <= 1 && prev.has(profileId)) return prev; // Can't disable the last one
      const next = new Set(prev);
      if (next.has(profileId)) {
        next.delete(profileId);
      } else {
        next.add(profileId);
      }
      return next;
    });
  };

  void navigate; // Suppress unused warning for now

  // Get current theme based on mode
  const theme = useMemo(() => themeMode === "dfb" ? dfbTheme : lightTheme, [themeMode]);

  // Get translations based on language
  const t = useMemo(() => translations[language], [language]);

  // Merged events from all enabled profiles (sorted by date)
  const mergedEvents = useMemo(() =>
    enabledProfiles
      .flatMap(p => p.events.map(e => ({
        ...e,
        personId: p.id,
        personName: p.firstName,
        personColor: PERSON_COLORS[p.id] ?? { bg: "#F5F5F5", text: "#525252" },
      })))
      .sort((a, b) => a.date.localeCompare(b.date)),
    [enabledProfiles]
  );

  // Merged chats from all enabled profiles (unique by id, preserving first occurrence)
  const mergedChats = useMemo(() => {
    const seen = new Set<string>();
    return enabledProfiles
      .flatMap(p => p.chats.map(c => ({
        ...c,
        personId: p.id,
        personName: p.firstName,
        personColor: PERSON_COLORS[p.id] ?? { bg: "#F5F5F5", text: "#525252" },
      })))
      .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });
  }, [enabledProfiles]);

  // Aggregated stats from all enabled profiles
  const mergedStats = useMemo(() => ({
    termine: enabledProfiles.reduce((s, p) => s + p.stats.termine, 0),
    nachrichten: enabledProfiles.reduce((s, p) => s + p.stats.nachrichten, 0),
    news: enabledProfiles.reduce((s, p) => s + p.stats.news, 0),
    offeneRechnungen: enabledProfiles.reduce((s, p) => s + p.stats.offeneRechnungen, 0),
    offenerBetrag: enabledProfiles.find(p => p.stats.offeneRechnungen > 0)?.stats.offenerBetrag ?? "0,00 €",
  }), [enabledProfiles]);

  // Merged free spots (unique by id)
  const mergedFreeSpots = useMemo(() => {
    const seen = new Set<string>();
    return enabledProfiles
      .flatMap(p => p.freeSpots ?? [])
      .filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });
  }, [enabledProfiles]);

  // All memberships across enabled profiles (for sport icon lookup)
  const allMemberships = useMemo(
    () => enabledProfiles.flatMap(p => p.memberships),
    [enabledProfiles]
  );
  
  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Mock attachments for messages
  const getMockAttachments = (messageId: string): Attachment[] => {
    if (messageId === "msg_1_1") {
      return [
        { id: "att1", name: "Rechnung_Januar.pdf", type: "pdf", size: "245 KB", url: "#" }
      ];
    }
    return [];
  };

  const getAttachmentIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image": return Image;
      case "pdf": return File;
      default: return File;
    }
  };

  // Selected chat message for detail view (supports both old and new chat types)
  const [selectedChatMessage, setSelectedChatMessage] = useState<typeof MOCK_MESSAGES[0] | Chat | null>(null);

  const goBack = () => {
    if (view === "message-detail" || view === "chat-detail") {
      setView("chats");
      setSelectedTicket(null);
      setSelectedChat(null);
      setSelectedChatMessage(null);
    } else if (view === "request-form") {
      setView("new-request");
      setSelectedForm(null);
    } else if (view === "new-request") {
      setView("chats");
    } else {
      setView("home");
    }
  };

  // Generic message type for flexibility
  type ChatMessage = {
    id: string;
    name: string;
    avatar: string | null;
    lastMessage: string;
    time: string;
    unread: number;
    type: string;
    isClub?: boolean;
    isRequest?: boolean;
  };

  const handleOpenChat = (msg: ChatMessage) => {
    setSelectedChatMessage(msg as typeof MOCK_MESSAGES[0]);
    if (msg.isRequest) {
      // For request messages, we could show the ticket detail
      // For now, just show the chat detail
      setView("chat-detail");
    } else {
      setView("chat-detail");
    }
  };

  const openForm = (form: typeof mockTicketForms[0]) => {
    setSelectedForm(form);
    setView("request-form");
  };

  // Club Logo Component - matching design with dark green border
  const ClubLogo = ({ size = "md", clubName = "SfB" }: { size?: "sm" | "md" | "lg"; clubName?: string }) => {
    const sizes = {
      sm: "w-8 h-8 text-[10px]",
      md: "w-12 h-12 text-sm",
      lg: "w-16 h-16 text-lg"
    };
    return (
      <div 
        className={`${sizes[size]} rounded-full border-2 flex items-center justify-center bg-white font-bold`}
        style={{ borderColor: COLORS.primary, color: COLORS.primary }}
      >
        {clubName}
      </div>
    );
  };

  // Event Status Badge
  const EventStatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, { label: string; bg: string; text: string; icon?: typeof Check }> = {
      confirmed: { label: "Bestätigt", bg: COLORS.mint, text: COLORS.primary, icon: Check },
      booked: { label: "Gebucht", bg: COLORS.mint, text: COLORS.primary, icon: Check },
      free_spots: { label: "Freie Plätze", bg: "#C3F73A", text: "#3d4a0a" },
      unconfirmed: { label: "Unbestätigt", bg: "#E5E5E5", text: "#525252", icon: X }
    };
    const config = configs[status] || configs.confirmed;
    
    return (
      <span 
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: config.bg, color: config.text }}
      >
        {config.icon && <config.icon className="w-3 h-3" />}
        {config.label}
      </span>
    );
  };

  // People Manager Modal - enable/disable whose view appears in the global feed
  const ProfileSwitcherModal = () => {
    if (!showProfileSwitcher) return null;

    const calculateAge = (birthDate: string) => {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 z-50 backdrop-blur-sm rounded-[42px]"
          onClick={() => setShowProfileSwitcher(false)}
        />
        {/* Sheet */}
        <div
          className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] shadow-2xl max-h-[82%] overflow-y-auto"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 pb-4 border-b border-neutral-100">
            <h2 className="text-lg font-semibold text-center" style={{ color: theme.textPrimary }}>
              {language === "de" ? "Personen anzeigen" : "Show people"}
            </h2>
            <p className="text-xs text-center mt-1" style={{ color: theme.textMuted }}>
              {language === "de"
                ? "Aktiviere oder deaktiviere, wessen Inhalte du siehst"
                : "Enable or disable whose content you see"}
            </p>
          </div>

          {/* Profiles List with Toggles */}
          <div className="px-5 py-4 space-y-3">
            {!isKidDirectView && (
              <div className="mb-1 pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
                <p className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                  {language === "de" ? "DIESES KONTO · SfB" : "THIS ACCOUNT · SfB"}
                </p>
              </div>
            )}

            {FAMILY_PROFILES.map((profile) => {
              if (isKidDirectView && profile.id !== loggedInProfile.id) return null;

              const isEnabled = enabledProfileIds.has(profile.id);
              const isLast = enabledProfileIds.size <= 1 && isEnabled;
              const age = profile.birthDate ? calculateAge(profile.birthDate) : null;
              const personColor = PERSON_COLORS[profile.id] ?? { bg: "#F5F5F5", text: "#525252" };

              return (
                <div
                  key={profile.id}
                  className="rounded-2xl p-4 transition-all"
                  style={{
                    backgroundColor: isEnabled ? personColor.bg + "55" : theme.cardBg,
                    border: `1.5px solid ${isEnabled ? personColor.text + "50" : theme.cardBorder}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar with person-color ring */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={profile.avatar}
                        alt={profile.firstName}
                        className="w-14 h-14 rounded-full object-cover transition-opacity"
                        style={{
                          border: `2.5px solid ${isEnabled ? personColor.text : theme.cardBorder}`,
                          opacity: isEnabled ? 1 : 0.45,
                        }}
                      />
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: personColor.text }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            className="font-semibold truncate"
                            style={{ color: isEnabled ? theme.textPrimary : theme.textMuted }}
                          >
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ backgroundColor: personColor.bg, color: personColor.text }}
                            >
                              {profile.isChild
                                ? (language === "de" ? "Kind" : "Child")
                                : (language === "de" ? "Erwachsen" : "Adult")}
                            </span>
                            {age && (
                              <span className="text-xs" style={{ color: theme.textMuted }}>
                                {age} {t.years}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Toggle switch */}
                        {!isKidDirectView && (
                          <button
                            onClick={() => toggleProfile(profile.id)}
                            disabled={isLast}
                            className="relative inline-flex items-center rounded-full flex-shrink-0 transition-colors"
                            style={{
                              width: 48,
                              height: 28,
                              backgroundColor: isEnabled ? personColor.text : "#D1D5DB",
                              opacity: isLast ? 0.5 : 1,
                            }}
                            title={isLast
                              ? (language === "de" ? "Mindestens eine Person muss aktiv sein" : "At least one person must be active")
                              : undefined}
                          >
                            <span
                              className="inline-block w-5 h-5 rounded-full bg-white shadow-md transition-transform"
                              style={{ transform: isEnabled ? "translateX(24px)" : "translateX(4px)" }}
                            />
                          </button>
                        )}
                      </div>

                      {/* Teams (only when enabled) */}
                      {isEnabled && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {profile.memberships.map((m, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-lg flex items-center gap-1"
                              style={{ backgroundColor: personColor.bg, color: personColor.text }}
                            >
                              <span>{m.icon}</span>
                              {m.teamName}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Next event preview (only when enabled) */}
                      {isEnabled && profile.nextEvent && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: theme.textMuted }}>
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {profile.nextEvent.dayName} {profile.nextEvent.dayNumber.replace(".", "")}. — {profile.nextEvent.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Other Clubs Section – club context switch (not profile toggle) */}
          {!isKidDirectView && (
            <div className="px-5 pb-6">
              <p className="text-xs font-semibold tracking-wider mb-1" style={{ color: theme.textMuted }}>
                {t.otherClubs}
              </p>
              <p className="text-xs mb-3" style={{ color: theme.textMuted }}>
                {language === "de"
                  ? "Für andere Vereine den Vereinskontext wechseln"
                  : "Switch club context for other clubs"}
              </p>
              {OTHER_CLUBS.map(club => (
                <button
                  key={club.id}
                  onClick={() => setShowProfileSwitcher(false)}
                  className="w-full text-left"
                >
                  <div
                    className="p-4 rounded-2xl transition-all hover:shadow-md"
                    style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{club.shortName}</span>
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: theme.textPrimary }}>{club.name}</p>
                          <p className="text-sm" style={{ color: theme.textMuted }}>{club.location}</p>
                          {club.profiles && club.profiles.length > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              {club.profiles.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: COLORS.mint, color: COLORS.primary }}
                                >
                                  {p.memberships[0]?.icon} {p.firstName}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5" style={{ color: theme.textMuted }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  // Report Modal - for reporting chat messages
  const ReportModal = () => {
    if (!showReportModal || !reportingMessage) return null;

    const handleSubmitReport = () => {
      // In real app, this would send the report to the backend
      console.log("Report submitted:", {
        message: reportingMessage,
        category: reportCategory,
        description: reportDescription,
        reportedBy: activeProfile.id,
        reportedByName: `${activeProfile.firstName} ${activeProfile.lastName}`
      });
      
      // Reset and close modal
      setShowReportModal(false);
      setReportingMessage(null);
      setReportCategory("");
      setReportDescription("");
      
      // Show confirmation (in real app, would use a toast notification)
      alert("Meldung gesendet! Ein Admin wird sich darum kümmern.");
    };

    return (
      <>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 z-50 backdrop-blur-sm rounded-[42px]"
          onClick={() => {
            setShowReportModal(false);
            setReportingMessage(null);
            setReportCategory("");
            setReportDescription("");
          }}
        />
        {/* Modal */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] shadow-2xl max-h-[85%] overflow-y-auto"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="px-5 pb-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: theme.textPrimary }}>
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Nachricht melden
            </h2>
            <button 
              onClick={() => {
                setShowReportModal(false);
                setReportingMessage(null);
                setReportCategory("");
                setReportDescription("");
              }}
              className="p-2 rounded-full"
              style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.1)" : "#F5F5F5" }}
            >
              <X className="w-5 h-5" style={{ color: theme.textMuted }} />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-4 space-y-4">
            {/* Reported message preview */}
            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: "#FEF3C7", border: "1px solid #F59E0B" }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: "#92400E" }}>
                Gemeldete Nachricht:
              </p>
              <p className="text-sm italic" style={{ color: "#78350F" }}>
                "{reportingMessage.content}"
              </p>
              <p className="text-xs mt-2" style={{ color: "#B45309" }}>
                — {reportingMessage.senderName}
              </p>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-sm font-semibold block mb-2" style={{ color: theme.textPrimary }}>
                Art der Meldung *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setReportCategory(cat.value)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      reportCategory === cat.value ? "ring-2 ring-orange-500" : ""
                    }`}
                    style={{ 
                      backgroundColor: reportCategory === cat.value ? "#FEF3C7" : theme.cardBg,
                      border: `1px solid ${reportCategory === cat.value ? "#F59E0B" : theme.cardBorder}`
                    }}
                  >
                    <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                      {cat.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                      {cat.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold block mb-2" style={{ color: theme.textPrimary }}>
                Beschreibung *
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Beschreiben Sie den Vorfall genauer..."
                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                style={{ 
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.cardBorder}`,
                  color: theme.textPrimary
                }}
                rows={4}
              />
            </div>

            {/* Privacy notice */}
            <div 
              className="p-3 rounded-xl flex items-start gap-2"
              style={{ backgroundColor: "#EFF6FF", border: "1px solid #3B82F6" }}
            >
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold" style={{ color: "#1E40AF" }}>
                  Datenschutz-Hinweis
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#3B82F6" }}>
                  Ihre Meldung wird vertraulich behandelt und nur vom Vereinsvorstand geprüft.
                </p>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmitReport}
              disabled={!reportCategory || !reportDescription.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                reportCategory && reportDescription.trim() 
                  ? "bg-orange-500 hover:bg-orange-600" 
                  : "bg-neutral-300 cursor-not-allowed"
              }`}
            >
              🚨 Meldung absenden
            </button>
          </div>
        </div>
      </>
    );
  };

  // Bottom Navigation Content - Apple Liquid Glass Style (content only, no positioning)
  const renderBottomNavContent = () => {
    const navItems = [
      { id: "home", icon: Home, label: t.home },
      { id: "kalender", icon: Calendar, label: t.calendar },
      { id: "chats", icon: MessageSquare, label: t.chats, badge: mergedStats.nachrichten },
      { id: "news", icon: Bell, label: t.news },
      { id: "profile", icon: User, label: t.profile }
    ];

    // Hide plus button for minors without guardian (they can't create requests)
    const isMinorWithoutGuardian = loggedInProfile.isChild && !loggedInProfile.parentId;
    const showPlusButton = !isMinorWithoutGuardian && (view === "chats" || view === "news" || 
      ["message-detail", "chat-detail", "new-request", "request-form"].includes(view));

    const isDfb = theme.mode === "dfb";

    // DFB Design System - Bottom Tab Bar styles
    // DFB Mode now uses liquid glass too for consistency with iOS design
    const glassStyles = isDfb ? {
      // DFB Mode - Liquid glass with DFB accent colors
      background: "rgba(255, 255, 255, 0.75)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      shadow: "0 8px 32px rgba(0, 73, 65, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
      activeBackground: COLORS.lime500, // #BBFD00 - DFB Lime for active state
      activeText: "#0A1F0A", // Very dark for contrast on lime
      inactiveText: "#2F4A41", // neutral-700 for better contrast on glass
      badgeBg: COLORS.lime500, // #BBFD00 for badges
      badgeText: "#0A1F0A", // Dark text on lime
    } : {
      // Light Mode - true frosted glass effect
      background: "rgba(245, 245, 245, 0.65)",
      border: "1px solid rgba(255, 255, 255, 0.6)",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      activeBackground: "rgba(255, 255, 255, 0.95)",
      activeText: "#004941",
      inactiveText: "#525252",
      badgeBg: "#004941",
      badgeText: "#FFFFFF",
    };

    return (
      <div className="flex items-center gap-2">
        {/* Liquid Glass Tab Bar */}
        <div 
          className="flex items-center justify-center gap-0.5 px-2 py-2 rounded-[26px] backdrop-blur-2xl"
          style={{ 
            background: glassStyles.background,
            border: glassStyles.border,
            boxShadow: glassStyles.shadow,
          }}
        >
          {navItems.map((item) => {
            const isActive = view === item.id || 
              (item.id === "chats" && ["chats", "message-detail", "chat-detail", "new-request", "request-form"].includes(view));
            
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as ViewState)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-[20px] transition-all duration-300 ease-out relative ${
                  isActive ? "shadow-md" : "hover:bg-black/5"
                }`}
                style={{ 
                  background: isActive ? glassStyles.activeBackground : "transparent",
                  color: isActive ? glassStyles.activeText : glassStyles.inactiveText,
                }}
              >
                <div className="relative">
                  <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-105" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                  {/* Badge indicator dot for inactive state */}
                  {item.badge && item.badge > 0 && !isActive && (
                    <span 
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: glassStyles.badgeBg }}
                    />
                  )}
                </div>
                {/* Show label when active - no badge since user is already on this screen */}
                {isActive && (
                  <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Plus button - Liquid Glass style */}
        {showPlusButton && (
          <button
            onClick={() => setView("new-request")}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-2xl"
            style={{ 
              background: "rgba(0, 73, 65, 0.92)",
              boxShadow: "0 4px 16px rgba(0, 73, 65, 0.25)",
            }}
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        )}
      </div>
    );
  };

  // Bottom Navigation with positioning (for desktop/iPhone frame)
  const renderBottomNav = () => {
    return (
      <div className="absolute bottom-6 left-3 right-3 z-40 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          {renderBottomNavContent()}
        </div>
      </div>
    );
  };

  // Home View - matching the design
  const renderHome = () => {
    const isDfb = theme.mode === "dfb";
    
    return (
    <div className="min-h-full pb-24" style={{ backgroundColor: 'transparent' }}>
      {/* Header with DFB styling */}
      <div className="relative" style={{ backgroundColor: theme.cardBg }}>
        <div className="px-5 pt-4 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[28px] font-bold leading-tight" style={{ color: theme.textPrimary }}>{t.welcome}</h1>
              <h2 className="text-[28px] font-bold" style={{ color: theme.textPrimary }}>{activeProfile.firstName}</h2>
              {/* Ansicht für label */}
              {!isKidDirectView && (
                <p className="text-sm mt-1 flex items-center gap-1" style={{ color: theme.textMuted }}>
                  <Eye className="w-3.5 h-3.5" />
                  {enabledProfiles.length > 1
                    ? `Ansicht für ${enabledProfiles.map(p => p.firstName).join(", ")}`
                    : `Ansicht für ${loggedInProfile.firstName}`
                  }
                </p>
              )}
            </div>
            {/* Clickable Avatar stack - Opens People Manager */}
            <button
              onClick={() => setShowProfileSwitcher(true)}
              className="relative flex flex-col items-center gap-1"
            >
              {/* Main avatar - logged-in profile */}
              <img
                src={loggedInProfile.avatar}
                alt={loggedInProfile.firstName}
                className="rounded-full object-cover border-2 shadow-sm"
                style={{ width: 52, height: 52, borderColor: PERSON_COLORS[loggedInProfile.id]?.bg ?? theme.cardBg }}
              />
              {/* Row of secondary avatars for other enabled profiles */}
              {!isKidDirectView && enabledProfiles.filter(p => p.id !== loggedInProfile.id).length > 0 && (
                <div className="flex -space-x-1.5">
                  {enabledProfiles.filter(p => p.id !== loggedInProfile.id).slice(0, 3).map(p => (
                    <img
                      key={p.id}
                      src={p.avatar}
                      alt={p.firstName}
                      className="rounded-full object-cover border-2"
                      style={{ width: 22, height: 22, borderColor: theme.cardBg }}
                    />
                  ))}
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* DFB Playground Curve - at bottom of header */}
        {isDfb && (
          <div 
            className="w-full h-[32px]"
            style={{
              backgroundImage: `url("${DFB_ASSETS.playgroundCurve}")`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              marginBottom: '-1px',
            }}
          />
        )}
      </div>

      {/* Club Card */}
      <div className="px-5 -mt-2">
        <div 
          className="rounded-2xl shadow-sm p-4"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
        >
          <div className="flex items-center gap-3 mb-4">
            <ClubLogo size="md" />
            <span className="font-semibold" style={{ color: theme.textPrimary }}>{activeProfile.clubName || CLUB_DATA.name}</span>
          </div>
          
          {/* Alert Banner */}
          {mergedStats.offeneRechnungen > 0 && (
            <div
              className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
              style={{ backgroundColor: theme.alertBg }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: theme.alertIcon }}
              >
                <Bell className="w-4 h-4" style={{ color: theme.alertText }} />
              </div>
              <span className="font-semibold" style={{ color: theme.alertText }}>
                {mergedStats.offeneRechnungen} {mergedStats.offeneRechnungen === 1 ? t.openInvoice : t.openInvoices}
              </span>
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-around pt-2">
            <button onClick={() => setView("kalender")} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                <Calendar className="w-5 h-5" />
                <span className="text-lg font-bold">{mergedStats.termine}</span>
              </div>
              <span className="text-xs" style={{ color: theme.textMuted }}>{t.appointments}</span>
            </button>
            <button onClick={() => setView("chats")} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                <MessageSquare className="w-5 h-5" />
                <span className="text-lg font-bold">{mergedStats.nachrichten}</span>
              </div>
              <span className="text-xs" style={{ color: theme.textMuted }}>{t.messages}</span>
            </button>
            <button onClick={() => setView("news")} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
                <Bell className="w-5 h-5" />
                <span className="text-lg font-bold">{mergedStats.news}</span>
              </div>
              <span className="text-xs" style={{ color: theme.textMuted }}>{t.news}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Next Appointment - Merged from all enabled profiles */}
      {mergedEvents.length > 0 && (
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider" style={{ color: isDfb ? COLORS.neutral900 : theme.textMuted }}>{t.nextAppointment}</span>
            <button
              onClick={() => setView("kalender")}
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: isDfb ? COLORS.primary700 : theme.accent }}
            >
              {t.allAppointments} <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div
            className="rounded-2xl shadow-sm p-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-start gap-4">
              <div className="text-center min-w-[40px]">
                <span className="text-2xl font-bold" style={{ color: theme.textPrimary }}>{mergedEvents[0].dayNumber}</span>
                <span className="text-sm block" style={{ color: theme.textMuted }}>{mergedEvents[0].dayName}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xl">{allMemberships.find(m => m.teamName === mergedEvents[0].team)?.icon || "📅"}</span>
                  <h3 className="font-semibold" style={{ color: theme.textPrimary }}>{mergedEvents[0].title}</h3>
                  {/* Person label – only shown when multiple profiles enabled */}
                  {enabledProfiles.length > 1 && (
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: mergedEvents[0].personColor.bg, color: mergedEvents[0].personColor.text }}
                    >
                      {mergedEvents[0].personName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm mt-1" style={{ color: theme.textMuted }}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mergedEvents[0].time}</span>
                </div>
                <div className="flex items-center gap-1 text-sm mt-0.5" style={{ color: theme.textMuted }}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{mergedEvents[0].location}</span>
                </div>
                {mergedEvents[0].isToday && (
                  <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.mint, color: COLORS.primary }}>
                    {t.today}
                  </span>
                )}
                {mergedEvents[0].isTomorrow && (
                  <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FFF3CD", color: "#856404" }}>
                    {t.tomorrow}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Spots - Merged from enabled profiles */}
      {mergedFreeSpots.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between px-5 mb-3">
            <span className="text-xs font-semibold tracking-wider" style={{ color: isDfb ? COLORS.neutral900 : theme.textMuted }}>{t.freeSpots}</span>
            <button className="text-xs font-medium flex items-center gap-1" style={{ color: isDfb ? COLORS.primary700 : theme.accent }}>
              {t.allCourses} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-5 pb-2">
              {mergedFreeSpots.map(spot => (
                <div 
                  key={spot.id} 
                  className="flex-shrink-0 w-40 rounded-2xl shadow-sm overflow-hidden"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
                >
                  <div className="relative h-24">
                    <img src={spot.image} alt={spot.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white">
                      <span className="text-sm font-bold">{spot.date}</span>
                      <span className="text-xs block opacity-90">{spot.dateShort}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight" style={{ color: theme.textPrimary }}>{spot.title}</h4>
                    <div className="flex items-center gap-1 text-xs mt-1.5" style={{ color: theme.textMuted }}>
                      <Clock className="w-3 h-3" />
                      <span>{spot.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More Appointments - Merged from enabled profiles */}
      {mergedEvents.length > 1 && (
        <div className="px-5 mt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider" style={{ color: isDfb ? COLORS.neutral900 : theme.textMuted }}>{t.moreAppointments}</span>
            <button
              onClick={() => setView("kalender")}
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: isDfb ? COLORS.primary700 : theme.accent }}
            >
              {t.allAppointments} <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {mergedEvents.slice(1, 3).map(event => (
              <div
                key={event.id}
                className="rounded-2xl shadow-sm p-4"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm font-medium" style={{ color: theme.textMuted }}>{event.dayName}</span>
                  <span className="text-lg font-bold" style={{ color: theme.textPrimary }}>{event.dayNumber.replace(".", "")}. Jan.</span>
                </div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm">{allMemberships.find(m => m.teamName === event.team)?.icon || "📅"}</span>
                  <h4 className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{event.title}</h4>
                </div>
                {/* Person label pill */}
                {enabledProfiles.length > 1 && (
                  <span
                    className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mb-1"
                    style={{ backgroundColor: event.personColor.bg, color: event.personColor.text }}
                  >
                    {event.personName}
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: theme.textMuted }}>
                  <Clock className="w-3 h-3" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: theme.textMuted }}>
                  <MapPin className="w-3 h-3" />
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  };

  // Helper to open event detail
  const handleEventClick = (profileEvent: typeof activeProfile.events[0]) => {
    // Try to find enhanced event, otherwise create one from profile event
    const enhanced = MOCK_ENHANCED_EVENTS.find(e => e.title === profileEvent.title) || {
      id: profileEvent.id,
      title: profileEvent.title,
      date: profileEvent.date,
      startTime: profileEvent.time.split(" - ")[0],
      endTime: profileEvent.time.split(" - ")[1]?.replace(" min.", "") || "",
      location: profileEvent.location,
      scope: "team" as EventScope,
      type: profileEvent.type as EventType,
      visibility: ["all"] as EventVisibility[],
      team: profileEvent.team,
      organizer: activeProfile.memberships[0]?.coachName || "Trainer",
      organizerAvatar: activeProfile.memberships[0]?.coachAvatar,
      participants: { confirmed: 12, pending: 3, declined: 1 },
      rsvpRequired: true,
      myRsvp: profileEvent.status === "confirmed" ? "confirmed" as const : null,
    };
    setSelectedEvent(enhanced);
    setView("event-detail");
  };

  // Calendar View with Unified Event Model
  const renderKalender = () => {
    const weekDays = language === "de" ? ["MO", "DI", "MI", "DO", "FR", "SA", "SO"] : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1 + (calendarWeekOffset * 7));
    
    const dates = weekDays.map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    // Calendar View filters - simplified to My Calendar (private events) and Club Calendar (public events)
    const viewFilters = [
      { id: "my", label: t.myCalendar, icon: "👤" },
      { id: "club", label: t.clubCalendar, icon: "🏟️" }
    ];

    return (
      <div className="min-h-full pb-24" style={{ backgroundColor: theme.pageBg }}>
        {/* Header */}
        <div style={{ backgroundColor: theme.cardBg, borderBottom: `1px solid ${theme.cardBorder}` }}>
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <button onClick={() => setCalendarWeekOffset(prev => prev - 1)}>
              <ChevronLeft className="w-5 h-5" style={{ color: theme.textSecondary }} />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: theme.textPrimary }}>
                {language === "de" ? "Januar" : "January"} {dates[0].getDate()} - {dates[6].getDate()}
              </span>
              <Calendar className="w-4 h-4" style={{ color: theme.textMuted }} />
            </div>
            <button onClick={() => setCalendarWeekOffset(prev => prev + 1)}>
              <ChevronRight className="w-5 h-5" style={{ color: theme.textSecondary }} />
            </button>
          </div>
          
          {/* Week days */}
          <div className="flex justify-around px-2 pb-3">
            {weekDays.map((day, i) => {
              const date = dates[i];
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = i === 4; // Friday selected
              const hasEvent = i === 4 || i === 5 || i === 6;
              
              return (
                <button
                  key={day}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-xs" style={{ color: theme.textMuted }}>{day}</span>
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isSelected ? theme.accent : hasEvent ? theme.accentLight : "transparent",
                      color: isSelected ? "white" : hasEvent ? theme.accent : isToday ? theme.accent : theme.textSecondary,
                      border: isToday && !isSelected && !hasEvent ? `2px solid ${theme.accent}` : "none"
                    }}
                  >
                    {date.getDate()}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar View Filters - DFB Chip Style */}
          <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide">
            {viewFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setCalendarViewMode(filter.id as typeof calendarViewMode)}
                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5"
                style={{
                  backgroundColor: calendarViewMode === filter.id ? theme.chipSelectedBg : theme.chipBg,
                  color: calendarViewMode === filter.id ? theme.chipSelectedText : theme.textSecondary,
                  border: `1px solid ${calendarViewMode === filter.id ? theme.chipSelectedBg : theme.chipBorder}`
                }}
              >
                <span>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events List - Merged from all enabled profiles */}
        <div className="px-5 py-4 space-y-4">
          {/* Helper to render a single event card with person label */}
          {(() => {
            const renderEventCard = (event: typeof mergedEvents[0]) => (
              <button
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="rounded-2xl shadow-sm p-4 w-full text-left hover:shadow-md transition-shadow"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-center min-w-[40px]">
                    <span className="text-2xl font-bold" style={{ color: theme.textPrimary }}>{event.dayNumber}</span>
                    <span className="text-sm block" style={{ color: theme.textMuted }}>{event.dayName}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{allMemberships.find(m => m.teamName === event.team)?.icon || "📅"}</span>
                      <h3 className="font-semibold" style={{ color: theme.textPrimary }}>{event.title}</h3>
                      {/* Person label – only when multiple profiles enabled */}
                      {enabledProfiles.length > 1 && (
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: event.personColor.bg, color: event.personColor.text }}
                        >
                          {event.personName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm mt-1" style={{ color: theme.textMuted }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm mt-0.5" style={{ color: theme.textMuted }}>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <EventStatusBadge status={event.status} />
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.1)" : "#F5F5F5" }}
                      >
                        {event.teamAvatar && <img src={event.teamAvatar} className="w-4 h-4 rounded-full" alt="" />}
                        <span className="text-xs" style={{ color: theme.textSecondary }}>
                          {event.type === "match" ? t.match : event.type === "training" ? t.training : t.course}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto" style={{ color: theme.textMuted }} />
                    </div>
                  </div>
                </div>
              </button>
            );

            const todayEvents = mergedEvents.filter(e => e.isToday);
            const tomorrowEvents = mergedEvents.filter(e => e.isTomorrow);
            const laterEvents = mergedEvents.filter(e => !e.isToday && !e.isTomorrow);

            return (
              <>
                {todayEvents.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold tracking-wider" style={{ color: theme.textMuted }}>
                      {language === "de" ? "HEUTE" : "TODAY"}
                    </span>
                    <div className="mt-2 space-y-3">{todayEvents.map(renderEventCard)}</div>
                  </div>
                )}
                {tomorrowEvents.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold tracking-wider" style={{ color: theme.textMuted }}>
                      {language === "de" ? "MORGEN" : "TOMORROW"}
                    </span>
                    <div className="mt-2 space-y-3">{tomorrowEvents.map(renderEventCard)}</div>
                  </div>
                )}
                {laterEvents.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold tracking-wider" style={{ color: theme.textMuted }}>
                      {t.laterThisWeek}
                    </span>
                    <div className="mt-2 space-y-3">{laterEvents.map(renderEventCard)}</div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Club Events (when viewing club calendar) */}
          {calendarViewMode === "club" && (
            <div>
              <span className="text-xs font-semibold tracking-wider" style={{ color: theme.textMuted }}>
                {language === "de" ? "VEREINSTERMINE" : "CLUB EVENTS"}
              </span>
              <div className="mt-2 space-y-3">
                {MOCK_ENHANCED_EVENTS
                  .filter(e => e.scope === "club")
                  .map(event => (
                  <button 
                    key={event.id}
                    onClick={() => { setSelectedEvent(event); setView("event-detail"); }}
                    className="rounded-2xl shadow-sm overflow-hidden w-full text-left hover:shadow-md transition-shadow"
                    style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
                  >
                    {/* Banner Image */}
                    {event.bannerImage && (
                      <div className="h-24 w-full overflow-hidden">
                        <img 
                          src={event.bannerImage} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-center min-w-[40px]">
                          <span className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
                            {event.date.split("-")[2]}
                          </span>
                          <span className="text-sm block" style={{ color: theme.textMuted }}>
                            {new Date(event.date).toLocaleDateString(language === "de" ? "de-DE" : "en-US", { weekday: "short" })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏟️</span>
                            <h3 className="font-semibold" style={{ color: theme.textPrimary }}>{event.title}</h3>
                          </div>
                          <div className="flex items-center gap-1 text-sm mt-1" style={{ color: theme.textMuted }}>
                            <Clock className="w-3.5 h-3.5" />
                            {event.isAllDay ? (
                              <span className="text-amber-600">Ganztägig</span>
                            ) : (
                              <span>{event.startTime} - {event.endTime}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm mt-0.5" style={{ color: theme.textMuted }}>
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            {/* Scope badge */}
                            <span 
                              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                              style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}
                            >
                              {t.scopeClub}
                            </span>
                            {event.isAllDay && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
                                Ganztag
                              </span>
                            )}
                            {/* Participant count - subtle */}
                            {event.participants && (
                              <span className="text-[10px]" style={{ color: theme.textMuted }}>
                                {event.participants.confirmed}/{event.participants.confirmed + event.participants.pending + event.participants.declined}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 ml-auto" style={{ color: theme.textMuted }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Legacy Message type - replaced by Chat type from mockChats
  // type Message = { id, name, avatar, lastMessage, time, unread, type, isClub?, isRequest? };
  // const getMessagesForProfile = (): Message[] => { ... };

  // Chats/Messages View - Enhanced with Chat Types (Announcement, Team Group, Direct)
  const renderChats = () => {
    // isChildProfile is true only if a kid is viewing DIRECTLY (not parent viewing child)
    const isChildProfile = isKidDirectView;
    
    // Get chats visible to ANY enabled profile (merged global view)
    const seen = new Set<string>();
    const profileChats = mockChats
      .filter(c => enabledProfiles.some(p => c.visibleToProfiles.includes(p.id)))
      .filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });

    // For each chat, determine which enabled profile(s) own it (for labels)
    const chatPersonLabels = (chat: Chat): Array<{ name: string; color: { bg: string; text: string } }> => {
      if (enabledProfiles.length <= 1) return [];
      return enabledProfiles
        .filter(p => chat.visibleToProfiles.includes(p.id))
        .map(p => ({ name: p.firstName, color: PERSON_COLORS[p.id] ?? { bg: "#F5F5F5", text: "#525252" } }));
    };

    // Determine user role for permission checks
    const _profileRole: UserRole = isKidDirectView ? "minor" : "adult_player";
    void _profileRole;

    // Filter by chat type
    const announcements = profileChats.filter(c => c.type === "announcement");
    const teamChats = profileChats.filter(c => c.type === "team_group");
    const directChats = profileChats.filter(c => c.type === "direct");
    
    // MINOR INTERACTION RULES:
    // - If parent linked (Flurina, Max): can interact with chats
    // - If NO parent linked (Anna): VIEW ONLY mode
    const isMinorWithoutGuardian = isKidDirectView && !activeProfile.parentId;

    // Chat item renderer with optional person labels
    const renderChatItem = (chat: Chat) => {
      const isAnnouncement = chat.type === "announcement";
      const personLabels = chatPersonLabels(chat);
      
      return (
        <button
          key={chat.id}
          onClick={() => {
            setSelectedChatMessage(chat);
            setView("chat-detail");
          }}
          className="w-full flex items-center gap-3 px-5 py-3 transition-colors active:bg-black/5"
          style={{ borderBottomWidth: 1, borderBottomColor: theme.cardBorder }}
        >
          {/* Avatar with type indicator */}
          <div className="relative flex-shrink-0">
            {isAnnouncement ? (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                <Megaphone className="w-5 h-5" style={{ color: "#92400E" }} />
              </div>
            ) : chat.type === "team_group" ? (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#D1FAE5" }}
              >
                <Users className="w-5 h-5" style={{ color: "#065F46" }} />
              </div>
            ) : (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#DBEAFE" }}
              >
                <MessageSquare className="w-5 h-5" style={{ color: "#1E40AF" }} />
              </div>
            )}
            {chat.unreadCount > 0 && (
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2"
                style={{ backgroundColor: theme.accent, borderColor: theme.cardBg }}
              >
                {chat.unreadCount}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 text-left">
            {/* Line 1: Chat name */}
            <p
              className="font-semibold text-sm truncate mb-0.5"
              style={{ color: chat.unreadCount > 0 ? theme.textPrimary : theme.textSecondary }}
            >
              {chat.name}
            </p>
            {/* Line 2: person labels + team tag + message preview */}
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              {personLabels.map(pl => (
                <span
                  key={pl.name}
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: pl.color.bg, color: pl.color.text }}
                >
                  {pl.name}
                </span>
              ))}
              {chat.teamName && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.1)" : "#F3F4F6", color: theme.textMuted }}
                >
                  {chat.teamName}
                </span>
              )}
              {chat.lastMessage && (
                <p
                  className="text-xs truncate min-w-0"
                  style={{ color: chat.unreadCount > 0 ? theme.textSecondary : theme.textMuted }}
                >
                  {chat.lastMessage.content}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs" style={{ color: theme.textMuted }}>
              {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : ""}
            </span>
            <ChevronRight className="w-4 h-4" style={{ color: theme.textMuted }} />
          </div>
        </button>
      );
    };

    // Tab configuration with counts - Short labels for Airbnb-style compact pills
    // For minors without guardian: hide DMs tab entirely, requests shows 0 (read-only broadcasts only)
    const tabs = [
      { id: "announcements" as const, label: "Infos", icon: Megaphone, count: announcements.length, color: "#92400E", bgColor: "#FEF3C7" },
      { id: "team" as const, label: "Teams", icon: Users, count: teamChats.length, color: "#065F46", bgColor: "#D1FAE5" },
      { id: "direct" as const, label: "DMs", icon: MessageSquare, count: directChats.length, color: "#1E40AF", bgColor: "#DBEAFE", disabled: isChildProfile, hidden: isMinorWithoutGuardian },
      { id: "requests" as const, label: "Anfragen", icon: File, count: isMinorWithoutGuardian ? 0 : mergedChats.filter(c => c.isRequest).length, color: "#7C3AED", bgColor: "#F3E8FF" }
    ];

    return (
      <div className="min-h-full pb-24" style={{ backgroundColor: theme.cardBg }}>
        {/* Header */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-bold" style={{ color: theme.textPrimary }}>{t.mitteilungen}</h1>
              {/* Show viewing mode */}
              {isKidDirectView ? (
                <p className="text-sm flex items-center gap-1" style={{ color: "#DC2626" }}>
                  <Shield className="w-3 h-3" />
                  {activeProfile.firstName} (Kind)
                </p>
              ) : (
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {loggedInProfile.firstName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Global Search - Above pills */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.textMuted }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.search}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: theme.inputBg, 
                borderColor: theme.inputBorder, 
                borderWidth: 1,
                color: theme.textPrimary,
                ["--tw-ring-color" as string]: theme.accent 
              }}
            />
          </div>
        </div>

        {/* === AIRBNB-STYLE SEGMENTED CONTROL === */}
        <div className="px-5 pb-4">
          <div 
            className="flex p-1 rounded-xl"
            style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.08)" : "#F3F4F6" }}
          >
            {tabs.map(tab => {
              const isActive = chatTab === tab.id;
              const isDisabled = tab.disabled;
              
              // Skip hidden tabs (DMs for kids and minors without guardian)
              if (tab.hidden || (tab.id === "direct" && isChildProfile)) return null;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setChatTab(tab.id)}
                  disabled={isDisabled}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isDisabled ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                  style={{ 
                    backgroundColor: isActive ? theme.cardBg : "transparent",
                    color: isActive ? theme.textPrimary : theme.textMuted,
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span 
                      className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{ 
                        backgroundColor: isActive ? theme.accent : theme.textMuted,
                        color: "white"
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* === WARNING BANNERS === */}
        {/* Minor WITHOUT guardian - Critical warning */}
        {isMinorWithoutGuardian && (
          <div 
            className="mx-5 mb-4 px-4 py-3 rounded-xl flex items-start gap-3"
            style={{ backgroundColor: "#FEF3C7", border: "2px solid #F59E0B" }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#B45309" }} />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: "#92400E" }}>
                ⚠️ Kein Erziehungsberechtigter verknüpft
              </p>
              <p className="text-xs mt-1" style={{ color: "#B45309" }}>
                Du kannst Nachrichten nur lesen. Bitte sag deinen Eltern, dass sie sich beim Verein melden sollen, um als Erziehungsberechtigte hinterlegt zu werden.
              </p>
            </div>
          </div>
        )}


        {/* Minor with guardian - Restriction notice */}
        {isKidDirectView && activeProfile.parentId && (
          <div 
            className="mx-5 mb-4 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: "#FEE2E2" }}
          >
            <Shield className="w-5 h-5" style={{ color: "#DC2626" }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#991B1B" }}>
                Kinderansicht – Direktnachrichten über Elternteil
              </p>
              <p className="text-xs" style={{ color: "#B91C1C" }}>
                Du siehst Team-Chats und kannst dort schreiben. DMs gehen über deine Eltern.
              </p>
            </div>
          </div>
        )}

        {/* === TAB CONTENT === */}
        
        {/* ANNOUNCEMENTS TAB */}
        {chatTab === "announcements" && (
          <div>
            {announcements.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Megaphone className="w-12 h-12 mx-auto mb-3" style={{ color: theme.textMuted }} />
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Keine Ankündigungen</p>
                <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                  Ankündigungen deiner Teams erscheinen hier
                </p>
              </div>
            ) : (
              announcements.map(chat => renderChatItem(chat))
            )}
          </div>
        )}

        {/* TEAM CHATS TAB */}
        {chatTab === "team" && (
          <div>
            {teamChats.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-3" style={{ color: theme.textMuted }} />
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Keine Team-Chats</p>
                <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                  Du bist noch keinem Team zugeordnet
                </p>
              </div>
            ) : (
              <>
                {/* Read-only notice for Anna */}
                {isMinorWithoutGuardian && (
                  <div className="px-5 pb-3">
                    <div 
                      className="px-3 py-2 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: "#FEF3C7" }}
                    >
                      <Eye className="w-4 h-4" style={{ color: "#B45309" }} />
                      <p className="text-xs font-medium" style={{ color: "#92400E" }}>
                        Nur-Lese-Modus – Du kannst Nachrichten lesen, aber nicht antworten
                      </p>
                    </div>
                  </div>
                )}
                {teamChats.map(chat => renderChatItem(chat))}
              </>
            )}
          </div>
        )}

        {/* DIRECT MESSAGES TAB */}
        {chatTab === "direct" && !isChildProfile && (
          <div>
            {directChats.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: theme.textMuted }} />
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Keine Direktnachrichten</p>
                <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                  Private Unterhaltungen mit Trainern
                </p>
              </div>
            ) : (
              <>
                <div className="px-5 pb-2">
                  <p className="text-xs" style={{ color: theme.textMuted }}>
                    Private Unterhaltungen
                  </p>
                </div>
                {directChats.map(chat => renderChatItem(chat))}
              </>
            )}
          </div>
        )}

        {/* REQUESTS TAB */}
        {chatTab === "requests" && (
          <div>
            {/* Minor without guardian - Can only see broadcasts, not send requests */}
            {isMinorWithoutGuardian ? (
              <div className="px-5 py-8 text-center">
                <File className="w-12 h-12 mx-auto mb-3" style={{ color: theme.textMuted }} />
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Keine Rundschreiben</p>
                <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                  Hier werden Rundschreiben vom Verein angezeigt.
                </p>
                <div 
                  className="mt-4 px-3 py-2 rounded-lg mx-auto inline-block"
                  style={{ backgroundColor: "#FEF3C7" }}
                >
                  <p className="text-xs" style={{ color: "#92400E" }}>
                    Du kannst keine Anfragen senden, bis ein Erziehungsberechtigter verknüpft ist.
                  </p>
                </div>
              </div>
            ) : (!mergedChats.some(c => c.isRequest)) ? (
              <div className="px-5 py-8 text-center">
                <File className="w-12 h-12 mx-auto mb-3" style={{ color: theme.textMuted }} />
                <p className="text-sm font-medium" style={{ color: theme.textSecondary }}>Keine Anfragen</p>
                <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                  Nutze den + Button oben für neue Anfragen
                </p>
              </div>
            ) : (
              <>
                <div className="px-5 pb-2">
                  <p className="text-xs" style={{ color: theme.textMuted }}>
                    Anfragen an den Verein
                  </p>
                </div>
                {mergedChats.filter(c => c.isRequest).map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => handleOpenChat(chat)}
                    className="w-full flex items-center gap-3 px-5 py-3 transition-colors active:bg-black/5"
                    style={{ borderBottomWidth: 1, borderBottomColor: theme.cardBorder }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#F3E8FF" }}
                    >
                      <File className="w-5 h-5" style={{ color: "#7C3AED" }} />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-sm truncate" style={{ color: theme.textPrimary }}>{chat.name}</p>
                      <p className="text-sm truncate mt-0.5" style={{ color: theme.textMuted }}>{chat.lastMessage}</p>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: theme.textMuted }} />
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // News View - matching the design
  const renderNews = () => (
    <div className="min-h-full pb-24" style={{ backgroundColor: theme.pageBg }}>
      {/* Header - Liquid Glass for DFB */}
      <div 
        className="px-5 pt-4 pb-4 backdrop-blur-xl"
        style={{ 
          backgroundColor: theme.mode === "dfb" ? "rgba(255,255,255,0.8)" : theme.cardBg,
          borderBottom: `1px solid ${theme.cardBorder}`,
        }}
      >
        <h1 className="text-[28px] font-bold mb-4" style={{ color: theme.textPrimary }}>{t.clubNews}</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: theme.textMuted }} />
          <input
            type="text"
            placeholder={t.search}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              borderWidth: 1,
              color: theme.textPrimary,
              ["--tw-ring-color" as string]: theme.accent 
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-6">
          <button className="text-sm flex items-center gap-1" style={{ color: theme.textSecondary }}>
            {t.department} <ChevronRight className="w-3 h-3 -rotate-90" />
          </button>
          <button className="text-sm flex items-center gap-1" style={{ color: theme.textSecondary }}>
            {t.topic} <ChevronRight className="w-3 h-3 -rotate-90" />
          </button>
        </div>
      </div>

      {/* News List - Profile-specific news first, then general */}
      <div className="px-5 py-4 space-y-6">
        {[...(activeProfile.news || []), ...MOCK_NEWS.slice(0, 2)].map(news => (
          <div 
            key={news.id} 
            className="rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.mode === "dfb" ? "rgba(255,255,255,0.85)" : theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
            }}
          >
            {/* Author Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <ClubLogo size="sm" />
                <div>
                  <p className="font-semibold text-sm" style={{ color: theme.textPrimary }}>{news.author}</p>
                  <p className="text-xs" style={{ color: theme.textMuted }}>{news.date}</p>
                </div>
              </div>
              <button>
                <MoreVertical className="w-5 h-5" style={{ color: theme.textMuted }} />
              </button>
            </div>

            {/* Image */}
            <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />

            {/* Stats */}
            <div 
              className="flex items-center gap-4 px-4 py-3"
              style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
            >
              <div className="flex items-center gap-1" style={{ color: theme.textMuted }}>
                <Eye className="w-4 h-4" />
                <span className="text-sm">{news.views}</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: theme.textMuted }}>
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{news.comments}</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: theme.textMuted }}>
                <Heart className="w-4 h-4" />
                <span className="text-sm">{news.likes}</span>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <h3 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>{news.title}</h3>
              <p className="text-sm line-clamp-2" style={{ color: theme.textSecondary }}>{news.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Profile View - one member card per enabled profile
  const renderProfile = () => (
    <div className="min-h-full pb-24" style={{ backgroundColor: theme.pageBg }}>
      {/* Member Cards – one per enabled profile */}
      <div className="px-5 pt-8 pb-2 space-y-4">
        <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>{t.membership}</h2>
        {enabledProfiles.map((profile) => {
          const personColor = PERSON_COLORS[profile.id] ?? { bg: "#F5F5F5", text: "#525252" };
          return (
            <div
              key={profile.id}
              className="rounded-2xl shadow-sm p-5"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                borderWidth: 1,
                borderRadius: theme.cardRadius,
                boxShadow: theme.cardShadow,
                borderLeftWidth: 4,
                borderLeftColor: personColor.text,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt={profile.firstName}
                      className="w-14 h-14 rounded-full object-cover"
                      style={{ border: `2px solid ${personColor.text}` }}
                    />
                    {/* Person color dot */}
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: personColor.text }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color: theme.textPrimary }}>
                      {profile.firstName} {profile.lastName}
                    </p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: personColor.bg, color: personColor.text }}
                    >
                      {profile.isChild
                        ? (language === "de" ? "Kinderprofil" : "Child profile")
                        : (language === "de" ? "Mitglied" : "Member")}
                    </span>
                  </div>
                </div>
                {/* QR Code */}
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.1)" : "#F5F5F5" }}
                >
                  <div className="text-center">
                    <QrCode className="w-6 h-6 mx-auto" style={{ color: theme.textMuted }} />
                    <ClubLogo size="sm" clubName={profile.clubId === "makkabi" ? "TuS" : "SfB"} />
                  </div>
                </div>
              </div>

              {/* Teams/Memberships */}
              <div className="mt-4 pt-3" style={{ borderTopWidth: 1, borderTopColor: theme.cardBorder }}>
                <h3 className="text-xs font-semibold mb-2" style={{ color: theme.textMuted }}>{t.teams.toUpperCase()}</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.memberships.map(m => (
                    <span
                      key={m.departmentId}
                      className="flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-xl"
                      style={{ backgroundColor: personColor.bg, color: personColor.text }}
                    >
                      <span>{m.icon}</span>
                      <span className="font-medium">{m.teamName}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Mini stats row */}
              <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: theme.textMuted }}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {profile.stats.termine}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> {profile.stats.nachrichten}
                </span>
                {profile.stats.offeneRechnungen > 0 && (
                  <span className="flex items-center gap-1 font-medium" style={{ color: "#EA580C" }}>
                    <Bell className="w-3.5 h-3.5" /> {profile.stats.offenerBetrag}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings */}
      <div className="px-5">
        <span className="text-xs font-semibold tracking-wider" style={{ color: theme.textMuted }}>{t.settings.toUpperCase()}</span>
        
        <div className="mt-3 space-y-3">
          {/* Profile */}
          <div 
            className="rounded-2xl shadow-sm p-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: theme.textPrimary }}>{t.profile}</p>
                <p className="text-sm" style={{ color: theme.textMuted }}>{language === "de" ? "Deine Daten" : "Your data"}</p>
              </div>
              <User className="w-6 h-6" style={{ color: theme.accent }} />
            </div>
          </div>

          {/* Design (Theme Toggle) */}
          <div 
            className="rounded-2xl shadow-sm p-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold" style={{ color: theme.textPrimary }}>{t.theme}</p>
                <p className="text-sm" style={{ color: theme.textMuted }}>{language === "de" ? "Wähle dein Erscheinungsbild" : "Choose your appearance"}</p>
              </div>
            </div>
            {/* Theme Toggle Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setThemeMode("light")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  themeMode === "light" ? "ring-2" : ""
                }`}
                style={{ 
                  backgroundColor: themeMode === "light" ? theme.accentLight : (theme.mode === "dfb" ? "rgba(255,255,255,0.5)" : "#F5F5F5"),
                  color: theme.textPrimary,
                  ["--tw-ring-color" as string]: theme.accent
                }}
              >
                <Sun className="w-5 h-5" />
                <span className="font-medium text-sm">Light</span>
              </button>
              <button
                onClick={() => setThemeMode("dfb")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  themeMode === "dfb" ? "ring-2" : ""
                }`}
                style={{ 
                  backgroundColor: themeMode === "dfb" ? theme.accentLight : (theme.mode === "dfb" ? "rgba(255,255,255,0.5)" : "#F5F5F5"),
                  color: theme.textPrimary,
                  ["--tw-ring-color" as string]: theme.accent
                }}
              >
                <Leaf className="w-5 h-5" />
                <span className="font-medium text-sm">DFB</span>
              </button>
            </div>
          </div>

          {/* Language Toggle */}
          <div 
            className="rounded-2xl shadow-sm p-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold" style={{ color: theme.textPrimary }}>{t.language}</p>
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {language === "de" ? t.german : t.english}
                </p>
              </div>
              <Globe className="w-5 h-5" style={{ color: theme.accent }} />
            </div>
            {/* Language Toggle Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("de")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  language === "de" ? "ring-2" : ""
                }`}
                style={{ 
                  backgroundColor: language === "de" ? theme.accentLight : (theme.mode === "dfb" ? "rgba(255,255,255,0.5)" : "#F5F5F5"),
                  color: theme.textPrimary,
                  ["--tw-ring-color" as string]: theme.accent
                }}
              >
                <span className="text-lg">🇩🇪</span>
                <span className="font-medium text-sm">Deutsch</span>
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                  language === "en" ? "ring-2" : ""
                }`}
                style={{ 
                  backgroundColor: language === "en" ? theme.accentLight : (theme.mode === "dfb" ? "rgba(255,255,255,0.5)" : "#F5F5F5"),
                  color: theme.textPrimary,
                  ["--tw-ring-color" as string]: theme.accent
                }}
              >
                <span className="text-lg">🇺🇸</span>
                <span className="font-medium text-sm">English</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Clubs */}
      <div className="px-5 mt-6">
        <span className="text-xs font-semibold tracking-wider" style={{ color: theme.textMuted }}>{t.otherClubs}</span>
        
        <div 
          className="mt-3 rounded-2xl shadow-sm p-4"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">TuS</span>
              </div>
              <div>
                <p className="font-semibold" style={{ color: theme.textPrimary }}>TuS Makkabi Frankfurt</p>
                <p className="text-sm" style={{ color: theme.textMuted }}>Frankfurt am Main</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: theme.textMuted }} />
          </div>
        </div>

        <button 
          className="flex items-center gap-2 font-medium text-sm mt-4 mx-auto"
          style={{ color: theme.accent }}
        >
          <Plus className="w-4 h-4" />
          {language === "de" ? "Verein hinzufügen" : "Add club"}
        </button>
      </div>

      {/* Payments */}
      <div className="px-5 mt-6 pb-4">
        <span className="text-xs font-semibold tracking-wider" style={{ color: theme.textMuted }}>{t.payments.toUpperCase()}</span>
        
        <div 
          className="mt-3 rounded-2xl shadow-sm p-4"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold" style={{ color: theme.textPrimary }}>{t.payments}</p>
              <p className="text-sm" style={{ color: theme.textMuted }}>{language === "de" ? "Übersicht & Historie" : "Overview & History"}</p>
            </div>
            <CreditCard className="w-6 h-6" style={{ color: COLORS.primary }} />
          </div>
        </div>
      </div>
    </div>
  );

  // Message Detail View (Ticket)
  const renderMessageDetail = () => {
    if (!selectedTicket) return null;
    const messages = getTicketMessages(selectedTicket.id);

    return (
      <div className="min-h-full bg-neutral-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-900 truncate">{selectedTicket.subject}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[selectedTicket.status].color} ${statusConfig[selectedTicket.status].textColor}`}>
                  {statusConfig[selectedTicket.status].label}
                </span>
                <span className="text-xs text-neutral-400">
                  {categoryConfig[selectedTicket.category]?.emoji} {categoryConfig[selectedTicket.category]?.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => {
            const isMe = message.senderId === CURRENT_MEMBER_ID;
            const messageAttachments = getMockAttachments(message.id);

            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isMe 
                      ? "text-white rounded-br-md" 
                      : "bg-white border border-neutral-200 rounded-bl-md"
                  }`}
                  style={isMe ? { backgroundColor: COLORS.primary } : {}}
                >
                  {!isMe && (
                    <p className="text-xs text-neutral-500 font-medium mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <p className={`text-sm whitespace-pre-wrap ${isMe ? "text-white" : "text-neutral-700"}`}>
                    {message.content}
                  </p>

                  {/* Attachments */}
                  {messageAttachments.length > 0 && (
                    <div className={`mt-3 pt-3 border-t ${isMe ? "border-white/20" : "border-neutral-100"}`}>
                      <div className="space-y-2">
                        {messageAttachments.map((att) => {
                          const AttIcon = getAttachmentIcon(att.type);
                          return (
                            <div
                              key={att.id}
                              className={`flex items-center gap-2 p-2 rounded-lg ${
                                isMe ? "bg-white/10" : "bg-neutral-50"
                              }`}
                            >
                              <AttIcon className={`w-4 h-4 ${isMe ? "text-white/80" : "text-neutral-500"}`} />
                              <span className={`text-sm flex-1 truncate ${isMe ? "text-white" : "text-neutral-700"}`}>
                                {att.name}
                              </span>
                              <span className={`text-xs ${isMe ? "text-white/60" : "text-neutral-400"}`}>
                                {att.size}
                              </span>
                              <button className={`p-1 rounded hover:bg-black/10 ${isMe ? "text-white" : "text-neutral-500"}`}>
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className={`text-[10px] mt-1 ${isMe ? "text-white/60" : "text-neutral-400"}`}>
                    {formatFullDate(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-4 py-3">
          <div className="flex items-end gap-2">
            <button className="p-2 text-neutral-500 hover:text-neutral-700">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-neutral-100 rounded-2xl px-4 py-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t.writeMessage}
                rows={1}
                className="w-full bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-neutral-900 placeholder-neutral-400 text-sm"
              />
            </div>
            <button
              disabled={!replyText.trim()}
              onClick={() => {
                console.log("Send reply:", replyText);
                setReplyText("");
              }}
              className="p-2 rounded-full text-white disabled:opacity-50"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Get conversation messages based on chat - use profile-specific chat history
  const getMockConversation = (chatId: string) => {
    // First check if the active profile has chat history for this chat
    if (activeProfile.chatHistory && activeProfile.chatHistory[chatId]) {
      return activeProfile.chatHistory[chatId];
    }
    
    // Fallback to default conversations
    const conversations: Record<string, Array<{id: string; senderId: string; senderName: string; content: string; createdAt: string}>> = {
      "msg1": [
        { id: "c1", senderId: "trainer1", senderName: "Trainer Marco", content: "Hallo zusammen! Training morgen fällt leider aus.", createdAt: "2026-04-24T17:30:00" },
        { id: "c2", senderId: "p11", senderName: "Lena Schneider", content: "Schade, aber verstanden!", createdAt: "2026-04-24T17:45:00" },
        { id: "c3", senderId: "trainer1", senderName: "Trainer Marco", content: "Wir treffen uns dann am Freitag wieder. Bitte alle pünktlich um 18:30 da sein.", createdAt: "2026-04-24T18:32:00" },
      ],
      "msg2": [
        { id: "y1", senderId: "yoga_trainer", senderName: "Yoga Lehrerin Anna", content: "Namaste! Tolle Stunde heute 🙏", createdAt: "2026-04-23T09:00:00" },
        { id: "y2", senderId: "p11", senderName: "Lena Schneider", content: "Danke für die tolle Stunde heute 🙏", createdAt: "2026-04-23T09:15:00" },
      ],
      "msg3": [
        { id: "v1", senderId: "verein", senderName: "Vereinsvorstand", content: "Liebe Mitglieder, die Mitgliederversammlung findet am 15.06. um 19:00 Uhr in der Clubaula statt.", createdAt: "2026-04-23T10:00:00" },
        { id: "v2", senderId: "verein", senderName: "Vereinsvorstand", content: "Bitte um Anmeldung bis zum 10.06. per E-Mail.", createdAt: "2026-04-23T10:05:00" },
      ],
      "msg4": [
        { id: "e1", senderId: "sabine", senderName: "Sabine Müller", content: "Hallo zusammen! Wer kann Kinder zum Auswärtsspiel am Samstag mitnehmen?", createdAt: "2026-04-23T08:00:00" },
        { id: "e2", senderId: "peter", senderName: "Peter Schmidt", content: "Ich kann 3 Kinder mitnehmen 🚗", createdAt: "2026-04-23T08:30:00" },
        { id: "e3", senderId: "sabine", senderName: "Sabine Müller", content: "Super! Fahrgemeinschaft fürs Auswärtsspiel organisiert 🚗", createdAt: "2026-04-23T09:00:00" },
        { id: "e4", senderId: "p11", senderName: "Lena Schneider", content: "Perfekt, danke für die Organisation!", createdAt: "2026-04-23T09:30:00" },
      ],
      "msg8": [
        { id: "m1", senderId: "markus", senderName: "Markus Becker", content: "Hey Lena, hast du die Info zum Training bekommen?", createdAt: "2026-04-23T14:00:00" },
        { id: "m2", senderId: "p11", senderName: "Lena Schneider", content: "Ja, danke! Training morgen um 18:30, richtig?", createdAt: "2026-04-23T14:15:00" },
        { id: "m3", senderId: "markus", senderName: "Markus Becker", content: "Genau! Bis dann 👋", createdAt: "2026-04-23T14:20:00" },
        { id: "m4", senderId: "p11", senderName: "Lena Schneider", content: "Alles klar, danke für die Info!", createdAt: "2026-04-23T14:25:00" },
      ],
    };
    return conversations[chatId] || [
      { id: "default1", senderId: "other", senderName: "Mitglied", content: "Hallo! 👋", createdAt: "2026-04-23T10:00:00" },
    ];
  };

  // Chat Detail View
  const renderChatDetail = () => {
    // Support both old selectedChat and new selectedChatMessage (Chat type from mockChats)
    // Type guard to check if it's a new Chat type
    const isEnhancedChat = (data: typeof selectedChatMessage): data is Chat => {
      return data !== null && 'type' in data && (data.type === 'announcement' || data.type === 'team_group' || data.type === 'direct');
    };
    
    // Build a normalized chatData object
    let chatData: {
      id: string;
      name: string;
      avatar: string | null;
      type: string;
      isClub: boolean;
      isRequest: boolean;
      isAnnouncement?: boolean;
      isYouthTeam?: boolean;
      settings?: Chat['settings'];
    } | null = null;
    
    if (selectedChatMessage) {
      if (isEnhancedChat(selectedChatMessage)) {
        // New Chat type from mockChats
        chatData = {
          id: selectedChatMessage.id,
          name: selectedChatMessage.name,
          avatar: null,
          type: selectedChatMessage.type,
          isClub: selectedChatMessage.type === "announcement",
          isRequest: false,
          isAnnouncement: selectedChatMessage.type === "announcement",
          isYouthTeam: selectedChatMessage.teamType === "youth_team",
          settings: selectedChatMessage.settings,
        };
      } else {
        // Old message type
        chatData = {
          id: selectedChatMessage.id,
          name: selectedChatMessage.name,
          avatar: 'avatar' in selectedChatMessage ? selectedChatMessage.avatar : null,
          type: selectedChatMessage.type,
          isClub: 'isClub' in selectedChatMessage ? (selectedChatMessage.isClub || false) : false,
          isRequest: 'isRequest' in selectedChatMessage ? (selectedChatMessage.isRequest || false) : false,
        };
      }
    } else if (selectedChat) {
      chatData = {
        id: selectedChat.id,
        name: selectedChat.name,
        avatar: null,
        type: "team",
        isClub: false,
        isRequest: false,
      };
    }

    if (!chatData) return null;
    
    // Get messages - use enhanced messages if it's a Chat type
    const messages = selectedChat 
      ? getChatMessages(selectedChat.id) 
      : (selectedChatMessage && isEnhancedChat(selectedChatMessage))
        ? getChatMessages(selectedChatMessage.id)
        : getMockConversation(chatData.id);
        
    const isGroupChat = chatData.type === "team" || chatData.type === "group" || chatData.type === "team_group" || chatData.isClub;

    return (
      <div className="min-h-full flex flex-col" style={{ backgroundColor: theme.pageBg }}>
        {/* Header - Liquid Glass style */}
        <div 
          className="sticky top-0 px-4 py-3 z-10 backdrop-blur-xl"
          style={{ 
            backgroundColor: theme.mode === "dfb" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.9)",
            borderBottom: `1px solid ${theme.cardBorder}`,
          }}
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={goBack} 
              className="p-2 -ml-2 rounded-xl transition-colors"
              style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.1)" : "rgba(0,0,0,0.05)" }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: theme.textPrimary }} />
            </button>
            
            {/* Avatar */}
            {chatData.isClub ? (
              <ClubLogo size="sm" />
            ) : chatData.avatar ? (
              <img src={chatData.avatar} alt={chatData.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${COLORS.primaryLight} 100%)` }}
              >
                {isGroupChat ? (
                  <Users className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ color: theme.textPrimary }}>{chatData.name}</p>
              <p className="text-xs" style={{ color: theme.textMuted }}>
                {isGroupChat ? t.groupChat : t.directMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Youth Team Disclaimer - Eltern haben Einblick */}
        {chatData.isYouthTeam && chatData.settings?.parentVisibility && (
          <div 
            className="mx-4 mt-2 px-3 py-2 rounded-lg flex items-center gap-2"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <Shield className="w-4 h-4" style={{ color: "#B45309" }} />
            <p className="text-xs font-medium" style={{ color: "#92400E" }}>
              Eltern haben Einblick in diesen Chat
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg: { id: string; senderId: string; senderName: string; senderRole?: UserRole; content: string; createdAt: string; onBehalfOf?: { childId: string; childName: string }; visibleToParent?: boolean }) => {
            // Determine if this message is from "me" based on viewing context
            // - Kid direct view (Flurina/Max): Only their own ID is "me"
            // - Lena own view: p11 is "me"  
            // - Lena viewing child context: p11 is still "me" (she wrote on behalf)
            const isFromLoggedInUser = msg.senderId === loggedInProfile.id;
            const isMe = isFromLoggedInUser;
            const isFromActiveChild = false; // No longer using single-child context mode
            
            // Check if this is an "on behalf" message (has onBehalfOf property)
            const isOnBehalfMessage = !!msg.onBehalfOf;
            
            // Get sender display info based on context
            const getSenderDisplay = () => {
              const role = (msg as { senderRole?: UserRole }).senderRole;
              const firstName = msg.senderName.split(" ")[0];
              
              // Is this the logged-in user's message?
              if (isFromLoggedInUser) {
                if (isOnBehalfMessage && msg.onBehalfOf) {
                  // Parent wrote on behalf: "Du für [Child]"
                  return { 
                    label: `Du für ${msg.onBehalfOf.childName}`, 
                    emoji: "👩",
                    bg: "#FEF3C7", 
                    text: "#92400E" 
                  };
                }
                // Own message: "Du"
                return { label: "Du", emoji: "✓", bg: theme.accent, text: "#FFFFFF" };
              }
              
              // Is this the active child's own message (when parent viewing)?
              if (isFromActiveChild && !isOnBehalfMessage) {
                return {
                  label: firstName,
                  emoji: "⚽",
                  bg: "#FEE2E2",
                  text: "#DC2626"
                };
              }
              
              // Other senders based on role
              if (role === "coach") {
                // Strip "Trainer"/"Trainerin" prefix to get the actual first name
                const coachName = msg.senderName.replace(/^Trainer(in)?\s+/i, "").split(" ")[0];
                return { label: coachName, emoji: "🏃", bg: "#DBEAFE", text: "#1E40AF" };
              }
              if (role === "admin") {
                return { label: `👔 ${firstName}`, emoji: "", bg: "#F3E8FF", text: "#7C3AED" };
              }
              if (role === "minor") {
                // Just the first name + player emoji, no "(Kind)" label
                return { label: firstName, emoji: "⚽", bg: "#FEE2E2", text: "#DC2626" };
              }
              if (role === "parent" && isOnBehalfMessage && msg.onBehalfOf) {
                return { 
                  label: `${firstName} für ${msg.onBehalfOf.childName}`, 
                  emoji: "👩",
                  bg: "#FEF3C7", 
                  text: "#92400E" 
                };
              }
              if (role === "parent") {
                return { label: `👩 ${firstName}`, emoji: "", bg: "#FEF3C7", text: "#92400E" };
              }
              if (role === "adult_player") {
                return { label: `⚽ ${firstName}`, emoji: "", bg: "#D1FAE5", text: "#065F46" };
              }
              
              // Default
              return { label: firstName, emoji: "", bg: "#F3F4F6", text: "#374151" };
            };
            
            const senderDisplay = getSenderDisplay();

            // Check if this message is reported
            const isReported = (msg as { isReported?: boolean }).isReported;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
              >
                <div className={`max-w-[80%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {/* Sender badge - shown above every message */}
                  <div className={`flex items-center gap-2 ${isMe ? "justify-end" : "justify-start"} mb-1`}>
                    <span 
                      className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"
                      style={{ backgroundColor: senderDisplay.bg, color: senderDisplay.text }}
                    >
                      {senderDisplay.emoji && <span>{senderDisplay.emoji}</span>}
                      {senderDisplay.label}
                    </span>
                    {/* Report indicator if message is already reported */}
                    {isReported && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium flex items-center gap-1">
                        🚨 Gemeldet
                      </span>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div 
                      className={`rounded-2xl px-4 py-2.5 ${
                        isMe ? "rounded-br-md" : "rounded-bl-md"
                      } ${isReported ? "ring-2 ring-orange-400" : ""}`}
                      style={{
                        backgroundColor: isMe ? theme.messageSentBg : theme.cardBg,
                        color: isMe ? theme.messageSentText : theme.textPrimary,
                        border: isMe ? "none" : `1px solid ${theme.cardBorder}`,
                      }}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p className="text-[10px] mt-1" style={{ color: isMe ? `${theme.messageSentText}99` : theme.textMuted }}>
                        {formatFullDate(msg.createdAt)}
                      </p>
                    </div>
                    
                    {/* Report button - only show for OTHER people's messages, not your own */}
                    {!isMe && !isReported && (
                      <button
                        onClick={() => {
                          setReportingMessage({
                            id: msg.id,
                            content: msg.content,
                            senderName: msg.senderName
                          });
                          setShowReportModal(true);
                        }}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: "#FEF3C7" }}
                        title="Nachricht melden"
                      >
                        <Flag className="w-3.5 h-3.5 text-orange-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box - Conditional based on permissions */}
        {(() => {
          // Check if this is Anna (minor without guardian) - read-only mode
          const isMinorWithoutGuardian = isKidDirectView && !activeProfile.parentId;
          // Announcements are always read-only
          const isReadOnly = chatData.isAnnouncement || isMinorWithoutGuardian;
          
          if (isReadOnly) {
            // Read-only notice
            return (
              <div 
                className="sticky bottom-3 mx-3 rounded-2xl px-4 py-3 backdrop-blur-xl"
                style={{ 
                  backgroundColor: isMinorWithoutGuardian ? "#FEF3C7" : "#F3F4F6",
                  border: `1px solid ${isMinorWithoutGuardian ? "#F59E0B" : theme.cardBorder}`,
                }}
              >
                <div className="flex items-center gap-3">
                  {isMinorWithoutGuardian ? (
                    <AlertCircle className="w-5 h-5" style={{ color: "#B45309" }} />
                  ) : (
                    <Lock className="w-5 h-5" style={{ color: theme.textMuted }} />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: isMinorWithoutGuardian ? "#92400E" : theme.textSecondary }}>
                      {isMinorWithoutGuardian ? "Nur-Lese-Modus" : "Nur-Lese-Kanal"}
                    </p>
                    <p className="text-xs" style={{ color: isMinorWithoutGuardian ? "#B45309" : theme.textMuted }}>
                      {isMinorWithoutGuardian 
                        ? "Deine Eltern müssen sich beim Verein melden"
                        : "Ankündigungen können nicht beantwortet werden"
                      }
                    </p>
                  </div>
                </div>
              </div>
            );
          }
          
          // Regular reply box
          // Determine if parent is writing on behalf of a child in this chat
          const chatProfileIds = (selectedChatMessage && isEnhancedChat(selectedChatMessage))
            ? selectedChatMessage.visibleToProfiles
            : [];
          const childInChat = !isKidDirectView
            ? enabledProfiles.find(p => p.isChild && chatProfileIds.includes(p.id))
            : null;

          return (
            <div
              className="sticky bottom-3 mx-3 rounded-2xl px-3 py-2 backdrop-blur-xl"
              style={{
                backgroundColor: theme.mode === "dfb" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.95)",
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
              }}
            >
              {/* Subtle on-behalf disclaimer for parents writing in youth team chats */}
              {childInChat && (
                <p className="text-[10px] text-center pb-1.5 pt-0.5" style={{ color: theme.textMuted }}>
                  Du schreibst im Namen von {childInChat.firstName}
                </p>
              )}
              <div className="flex items-end gap-2">
                <button 
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: theme.textMuted }}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <div 
                  className="flex-1 rounded-xl px-3 py-2"
                  style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.05)" : "rgba(0,0,0,0.05)" }}
                >
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={t.writeMessage}
                    rows={1}
                    className="w-full bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-sm"
                    style={{ color: theme.textPrimary }}
                  />
                </div>
                <button
                  disabled={!replyText.trim()}
                  onClick={() => {
                    console.log("Send chat message:", replyText);
                    setReplyText("");
                  }}
                  className="p-2.5 rounded-xl disabled:opacity-50 transition-all"
                  style={{ backgroundColor: theme.buttonPrimaryBg, color: theme.buttonPrimaryText }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  // New Request View
  const renderNewRequest = () => (
    <div className="min-h-full bg-white pb-24">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Neue Anfrage</h1>
        </div>
      </div>

      <div className="p-5">
        <p className="text-neutral-600 mb-4">Wählen Sie eine Kategorie für Ihre Anfrage:</p>
        <div className="space-y-3">
          {mockTicketForms.filter(f => f.isActive).map((form) => (
            <button
              key={form.id}
              onClick={() => openForm(form)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-left hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl">
                {categoryConfig[form.category]?.emoji || "📝"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{form.name}</p>
                <p className="text-sm text-neutral-500">{form.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Form View
  const renderRequestForm = () => {
    if (!selectedForm) return null;

    return (
      <div className="min-h-full bg-neutral-100 pb-24">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900">{selectedForm.name}</h1>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Betreff *
              </label>
              <input
                type="text"
                placeholder="Kurze Beschreibung Ihrer Anfrage"
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2"
                style={{ ["--tw-ring-color" as string]: COLORS.primary }}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nachricht *
              </label>
              <textarea
                rows={6}
                placeholder="Beschreiben Sie Ihr Anliegen..."
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 resize-none"
                style={{ ["--tw-ring-color" as string]: COLORS.primary }}
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Anhänge
              </label>
              <button 
                className="flex items-center gap-2 hover:opacity-80"
                style={{ color: COLORS.primary }}
              >
                <Paperclip className="w-4 h-4" />
                <span className="text-sm">Datei hinzufügen</span>
              </button>
            </div>

            {/* Submit */}
            <button 
              className="w-full mt-4 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Send className="w-4 h-4" />
              Anfrage senden
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Event Detail View (Read-only for members - editing is done in admin)
  const renderEventDetail = () => {
    if (!selectedEvent) return null;
    
    const scopeLabels: Record<string, { label: string; icon: string; color: string }> = {
      team: { label: t.scopeTeam, icon: "⚽", color: "#10B981" },
      department: { label: t.scopeDepartment, icon: "🏢", color: "#F59E0B" },
      club: { label: t.scopeClub, icon: "🏟️", color: "#3B82F6" }
    };
    // Safe accessor with fallback to club scope
    const scope = scopeLabels[selectedEvent.scope] || scopeLabels.club;
    
    return (
      <div className="min-h-full pb-24" style={{ backgroundColor: theme.pageBg }}>
        {/* Banner Image */}
        {selectedEvent.bannerImage && (
          <div className="relative h-40 w-full overflow-hidden">
            <img 
              src={selectedEvent.bannerImage} 
              alt="" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* Back button on banner */}
            <button 
              onClick={goBack} 
              className="absolute top-4 left-4 p-2 rounded-full bg-black/30 backdrop-blur-sm"
              style={{ color: "white" }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Header - only show if no banner */}
        {!selectedEvent.bannerImage && (
          <div 
            className="sticky top-0 px-5 py-4 z-10"
            style={{ backgroundColor: theme.cardBg, borderBottom: `1px solid ${theme.cardBorder}` }}
          >
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="p-2 -ml-2 rounded-lg" style={{ color: theme.textSecondary }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold" style={{ color: theme.textPrimary }}>{t.eventDetails}</h1>
            </div>
          </div>
        )}
        
        <div className={`p-5 space-y-4 ${selectedEvent.bannerImage ? "-mt-8 relative z-10" : ""}`}>
          {/* Event Title Card */}
          <div 
            className={`rounded-2xl shadow-sm p-5 ${selectedEvent.bannerImage ? "shadow-lg" : ""}`}
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{scope.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold" style={{ color: theme.textPrimary }}>{selectedEvent.title}</h2>
                  {selectedEvent.isAllDay && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                      Ganztägig
                    </span>
                  )}
                </div>
                <span 
                  className="inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${scope.color}20`, color: scope.color }}
                >
                  {scope.label}
                </span>
              </div>
            </div>
            
            {selectedEvent.description && (
              <p className="mt-4 text-sm" style={{ color: theme.textSecondary }}>{selectedEvent.description}</p>
            )}
          </div>
          
          {/* Date & Time */}
          <div 
            className="rounded-2xl shadow-sm p-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.accentLight }}
              >
                <Calendar className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: theme.textPrimary }}>
                  {new Date(selectedEvent.date).toLocaleDateString(language === "de" ? "de-DE" : "en-US", { 
                    weekday: "long", year: "numeric", month: "long", day: "numeric" 
                  })}
                </p>
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {selectedEvent.startTime} - {selectedEvent.endTime}
                  {selectedEvent.isRecurring && ` • ${selectedEvent.recurringPattern}`}
                </p>
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div 
            className="rounded-2xl shadow-sm p-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.accentLight }}
              >
                <MapPin className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: theme.textPrimary }}>{selectedEvent.location}</p>
                {selectedEvent.resources && selectedEvent.resources.length > 0 && (
                  <p className="text-sm" style={{ color: theme.textMuted }}>
                    {t.eventResources}: {selectedEvent.resources.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Organizer */}
          <div 
            className="rounded-2xl shadow-sm p-4"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
          >
            <div className="flex items-center gap-3">
              {selectedEvent.organizerAvatar ? (
                <img src={selectedEvent.organizerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.accentLight }}
                >
                  <User className="w-5 h-5" style={{ color: theme.accent }} />
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ color: theme.textMuted }}>{t.organizer}</p>
                <p className="font-medium" style={{ color: theme.textPrimary }}>{selectedEvent.organizer}</p>
              </div>
            </div>
          </div>
          
          {/* Participants */}
          {selectedEvent.participants && (
            <div 
              className="rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
            >
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>{t.participants}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: "#10B98115" }}>
                  <p className="text-2xl font-bold" style={{ color: "#10B981" }}>{selectedEvent.participants.confirmed}</p>
                  <p className="text-xs" style={{ color: "#10B981" }}>{t.rsvpConfirmed}</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: "#F59E0B15" }}>
                  <p className="text-2xl font-bold" style={{ color: "#F59E0B" }}>{selectedEvent.participants.pending}</p>
                  <p className="text-xs" style={{ color: "#F59E0B" }}>{t.rsvpPending}</p>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ backgroundColor: "#EF444415" }}>
                  <p className="text-2xl font-bold" style={{ color: "#EF4444" }}>{selectedEvent.participants.declined}</p>
                  <p className="text-xs" style={{ color: "#EF4444" }}>{t.rsvpDeclined}</p>
                </div>
              </div>
              
              {selectedEvent.rsvpDeadline && (
                <p className="text-xs mt-3 text-center" style={{ color: theme.textMuted }}>
                  {t.rsvpDeadline}: {new Date(selectedEvent.rsvpDeadline).toLocaleDateString(language === "de" ? "de-DE" : "en-US")}
                </p>
              )}
            </div>
          )}
          
          {/* Attachments */}
          {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
            <div 
              className="rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
            >
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>{t.eventAttachments}</p>
              <div className="space-y-2">
                {selectedEvent.attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.1)" : "#F5F5F5" }}>
                    <File className="w-4 h-4" style={{ color: theme.accent }} />
                    <span className="text-sm flex-1" style={{ color: theme.textPrimary }}>{att.name}</span>
                    <Download className="w-4 h-4" style={{ color: theme.textMuted }} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Notes */}
          {selectedEvent.notes && (
            <div 
              className="rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: "#FEF3C7", borderColor: "#FDE68A", borderWidth: 1 }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{selectedEvent.notes}</p>
              </div>
            </div>
          )}
          
          {/* DFB Reference */}
          {selectedEvent.dfbReference && (
            <div 
              className="rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: theme.cardRadius, boxShadow: theme.cardShadow }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 font-mono">
                  DFB/SpielPlus: {selectedEvent.dfbReference}
                </span>
              </div>
            </div>
          )}
          
          {/* RSVP Actions */}
          {selectedEvent.rsvpRequired && (
            <div className="pt-4">
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>{t.rsvp}</p>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  className={`py-3 rounded-xl font-medium text-sm transition-all ${selectedEvent.myRsvp === "confirmed" ? "ring-2" : ""}`}
                  style={{ 
                    backgroundColor: selectedEvent.myRsvp === "confirmed" ? "#10B981" : "#10B98120",
                    color: selectedEvent.myRsvp === "confirmed" ? "white" : "#10B981",
                    ["--tw-ring-color" as string]: "#10B981"
                  }}
                >
                  <Check className="w-4 h-4 mx-auto mb-1" />
                  {t.confirmAttendance}
                </button>
                <button 
                  className={`py-3 rounded-xl font-medium text-sm transition-all ${selectedEvent.myRsvp === "pending" ? "ring-2" : ""}`}
                  style={{ 
                    backgroundColor: selectedEvent.myRsvp === "pending" ? "#F59E0B" : "#F59E0B20",
                    color: selectedEvent.myRsvp === "pending" ? "white" : "#F59E0B",
                    ["--tw-ring-color" as string]: "#F59E0B"
                  }}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  {t.maybeAttendance}
                </button>
                <button 
                  className={`py-3 rounded-xl font-medium text-sm transition-all ${selectedEvent.myRsvp === "declined" ? "ring-2" : ""}`}
                  style={{ 
                    backgroundColor: selectedEvent.myRsvp === "declined" ? "#EF4444" : "#EF444420",
                    color: selectedEvent.myRsvp === "declined" ? "white" : "#EF4444",
                    ["--tw-ring-color" as string]: "#EF4444"
                  }}
                >
                  <X className="w-4 h-4 mx-auto mb-1" />
                  {t.declineAttendance}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main pages where bottom nav should be visible
  const mainPages: ViewState[] = ["home", "kalender", "chats", "news", "profile"];
  const isMainPage = mainPages.includes(view);

  // Detect if user is on mobile device
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isSmallScreen = window.innerWidth < 768;
    const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isSmallScreen || isMobileUA;
  });
  
  // Check for mobile on window resize
  useEffect(() => {
    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 768;
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isSmallScreen || isMobileUA);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll position for dynamic status bar color
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Phone Frame Wrapper - matching iOS design with theme support
  // Only shows frame on desktop, mobile gets native full-screen experience
  const PhoneFrame = ({ children }: { children: React.ReactNode }) => {
    const isDfb = theme.mode === "dfb";
    // Dynamic status bar color: white text when on white header, green when scrolled to green bg
    const statusBarColor = isDfb 
      ? (scrolled ? COLORS.primary700 : COLORS.neutral900) // DFB: dark on white header, green on green bg
      : theme.statusBarText;
    
    // Handle scroll detection
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      setScrolled(scrollTop > 80); // Header height threshold
    };
    
    // Mobile: render content directly without frame
    if (isMobile) {
      return (
        <div 
          className="min-h-screen w-full relative transition-colors duration-300"
          style={{ 
            backgroundColor: theme.pageBg,
            // DFB background pattern
            ...(isDfb && {
              backgroundImage: `url("${DFB_ASSETS.backgroundPattern}")`,
              backgroundSize: '80% auto',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }),
            // Support for iOS safe areas
            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
          }}
        >
          {/* Content area - full screen on mobile with extra bottom padding for nav + browser UI */}
          <div 
            className="min-h-screen overflow-y-auto overflow-x-hidden"
            style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom, 20px))' }}
            onScroll={handleScroll}
          >
            {children}
          </div>
          
          {/* Bottom Navigation - only visible on main pages, positioned above browser UI */}
          {isMainPage && (
            <div 
              className="fixed left-0 right-0 z-50 flex justify-center px-4"
              style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 20px))' }}
            >
              {renderBottomNavContent()}
            </div>
          )}
          
          {/* Profile Switcher Modal */}
          <ProfileSwitcherModal />
          
          {/* Report Modal */}
          <ReportModal />
        </div>
      );
    }
    
    // Desktop: render with iPhone frame
    return (
      <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4 sm:p-8">
        <div className="relative">
          {/* Phone bezel */}
          <div className="w-[375px] h-[812px] bg-black rounded-[50px] p-2.5 shadow-2xl ring-1 ring-white/10">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30" />
            
            {/* Screen */}
            <div 
              className="w-full h-full rounded-[42px] overflow-hidden relative transition-colors duration-300"
              style={{ 
                backgroundColor: theme.pageBg,
                // DFB background pattern
                ...(isDfb && {
                  backgroundImage: `url("${DFB_ASSETS.backgroundPattern}")`,
                  backgroundSize: '85% auto',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }),
              }}
            >
              {/* Status bar - color changes based on scroll position */}
              <div 
                className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 z-20 transition-colors duration-300"
                style={{ backgroundColor: 'transparent' }}
              >
                <span className="text-sm font-semibold transition-colors duration-300" style={{ color: statusBarColor }}>9:41</span>
                <div className="flex items-center gap-1.5">
                  {/* Signal bars */}
                  <div className="flex items-end gap-0.5">
                    <div className="w-1 h-1 rounded-sm transition-colors duration-300" style={{ backgroundColor: statusBarColor }} />
                    <div className="w-1 h-2 rounded-sm transition-colors duration-300" style={{ backgroundColor: statusBarColor }} />
                    <div className="w-1 h-3 rounded-sm transition-colors duration-300" style={{ backgroundColor: statusBarColor }} />
                    <div className="w-1 h-4 rounded-sm transition-colors duration-300" style={{ backgroundColor: statusBarColor }} />
                  </div>
                  {/* Wifi */}
                  <svg className="w-4 h-4 transition-colors duration-300" fill={statusBarColor} viewBox="0 0 24 24">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                  </svg>
                  {/* Battery */}
                  <div className="flex items-center">
                    <div className="w-6 h-2.5 rounded-sm relative transition-colors duration-300" style={{ backgroundColor: statusBarColor }}>
                      <div 
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 translate-x-0.5 rounded-r transition-colors duration-300" 
                        style={{ backgroundColor: statusBarColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content area */}
              <div 
                ref={scrollContainerRef}
                className="h-full pt-12 overflow-hidden relative"
                onScroll={handleScroll}
              >
                <div className="h-full overflow-y-auto overflow-x-hidden">
                  {children}
                </div>
              </div>
              
              {/* Bottom Navigation - only visible on main pages */}
              {isMainPage && renderBottomNav()}
              
              {/* Home indicator - inside screen, at bottom */}
              <div 
                className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full z-40" 
                style={{ backgroundColor: theme.mode === "dfb" ? "rgba(0,73,65,0.5)" : "rgba(0,0,0,0.2)" }}
              />
              
              {/* Profile Switcher Modal rendered at screen level for proper overlay */}
              <ProfileSwitcherModal />
              
              {/* Report Modal */}
              <ReportModal />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render based on current view
  const renderContent = () => {
    switch (view) {
      case "home":
        return renderHome();
      case "kalender":
        return renderKalender();
      case "chats":
        return renderChats();
      case "news":
        return renderNews();
      case "profile":
        return renderProfile();
      case "message-detail":
        return renderMessageDetail();
      case "chat-detail":
        return renderChatDetail();
      case "new-request":
        return renderNewRequest();
      case "request-form":
        return renderRequestForm();
      case "event-detail":
        return renderEventDetail();
      default:
        return renderHome();
    }
  };

  return (
    <>
      <PhoneFrame>
        {renderContent()}
      </PhoneFrame>
      {/* CSS animation for modal */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

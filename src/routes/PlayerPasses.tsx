import { useEffect, useMemo, useState } from "react";
import {
  Plus, RefreshCw, Loader2, Code2, Table2, X,
  ArrowRight, ExternalLink, ChevronRight, Search,
  CheckCircle2, AlertCircle, Circle, MinusCircle,
  AlertTriangle, FileText, ChevronDown, ChevronUp, Lock
} from "lucide-react";
import { Card, Badge } from "../components/ui";
import { BVB_DFB_MEMBERS_JSON, mockPassabgleichData } from "../data/mockDfbnet";
import type { PassabgleichEntry, PassabgleichStatus } from "../data/mockDfbnet";
import { MOCK_PERSONS, MOCK_MEMBERSHIPS, MOCK_TEAMS_PEOPLE } from "../data/mockPeople";
import { mockClub } from "../data/mockClub";
import type { PassType } from "../types/dfbnet";

// ── Types ─────────────────────────────────────────────────────────────────────

type DeepLinkAction = "erstausstellung" | "verlängerung" | "vereinswechsel" | "abmeldung" | "ehrungsantrag";
interface DeepLinkPayload {
  action: DeepLinkAction;
  person: { firstName: string; lastName: string; dateOfBirth: string; passNumber?: string; };
}

type RedAction = "import" | "ignore";

interface AbgleichReport {
  id: string;
  runAt: Date;
  summary: { green: number; yellow: number; yellowLinked: number; white: number; red: number; redImported: number; };
  linkedYellow: { dvhName: string; dfbName: string; passNumber: string; note: string; }[];
  importedRed:  { dfbName: string; passNumber: string; }[];
  decisions: { yellowLinks: string[]; yellowIgnores: string[]; redImports: string[]; redIgnores: string[]; };
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTION_LABEL:  Record<DeepLinkAction, string> = { erstausstellung: "Erstausstellung", verlängerung: "Verlängerung", vereinswechsel: "Vereinswechsel", abmeldung: "Abmeldung", ehrungsantrag: "Ehrungsantrag" };
const ACTION_MODULE: Record<DeepLinkAction, string> = { erstausstellung: "DFBnet Pass – Antragstellung", verlängerung: "DFBnet Pass – Verlängerung", vereinswechsel: "DFBnet Pass – Vereinswechsel", abmeldung: "DFBnet Pass – Abmeldung", ehrungsantrag: "DFBnet Verbandsonline – Ehrungen" };
const ACTION_ROLE:   Record<DeepLinkAction, string> = { erstausstellung: "Passbearbeiter (Vereinsebene)", verlängerung: "Passbearbeiter (Vereinsebene)", vereinswechsel: "Passbearbeiter (Vereinsebene)", abmeldung: "Passbearbeiter (Vereinsebene)", ehrungsantrag: "Vereinsadministrator (Verband)" };
const ACTION_DESC:   Record<DeepLinkAction, string> = {
  erstausstellung: "Erstmalige Beantragung eines DFBnet-Passes für Spieler ohne bestehenden Pass.",
  verlängerung:    "Erneuerung eines abgelaufenen Passes. Der bestehende Pass wird verlängert, das Spielrecht wird wiederhergestellt.",
  vereinswechsel:  "Übertragung des aktiven Passes bei Wechsel zu einem anderen Verein. Setzt einen verknüpften, gültigen Pass voraus.",
  abmeldung:       "Passrückgabe und Abmeldung aus dem aktiven Spielbetrieb. Der Spieler scheidet aus dem laufenden Spielrecht aus.",
  ehrungsantrag:   "Einreichung eines Ehrungsantrags über das DFBnet Verbandsonline-Portal.",
};

const PASS_TYPE_CFG: Record<PassType, { label: string; cls: string }> = {
  youth:   { label: "Jugend",  cls: "bg-blue-100 text-blue-700"      },
  amateur: { label: "Amateur", cls: "bg-emerald-100 text-emerald-700" },
  senior:  { label: "Senior",  cls: "bg-slate-100 text-slate-600"     },
};

const GROUP_CFG = {
  green:  { label: "ÜBEREINSTIMMUNG", border: "border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  yellow: { label: "ÄHNLICH",          border: "border-l-amber-400",   bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"   },
  white:  { label: "NUR DVH",          border: "border-l-slate-300",   bg: "bg-slate-50",   text: "text-slate-500",   dot: "bg-slate-300"   },
  red:    { label: "NUR DFBNET",       border: "border-l-red-400",     bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400"     },
} as const;

const ROLE_LABEL: Record<string, string> = { player: "Spieler", coach: "Trainer", assistant_coach: "Co-Trainer", goalkeeper_coach: "Torwarttrainer", admin: "Admin", guardian_contact: "Erziehungsber." };

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildUrl(action: DeepLinkAction, p: DeepLinkPayload["person"], clubId: string): string {
  const q = (s: string) => encodeURIComponent(s);
  if (action === "ehrungsantrag")
    return `https://verbandsonline.dfbnet.de/ehrungen?vorname=${q(p.firstName)}&nachname=${q(p.lastName)}`;
  const base = `https://pass.dfbnet.de/antragstellung/${action}?vorname=${q(p.firstName)}&nachname=${q(p.lastName)}&geburtsdatum=${q(p.dateOfBirth)}&vereinId=${q(clubId)}`;
  return (action === "abmeldung" || action === "verlängerung") && p.passNumber
    ? `${base}&passnummer=${q(p.passNumber)}`
    : base;
}

function passTypeFromDob(dob: string): PassType {
  const age = (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return age < 18 ? "youth" : age >= 40 ? "senior" : "amateur";
}

const fmtDate = (ds?: string) => ds ? new Date(ds).toLocaleDateString("de-DE") : "—";
const fmtTime = (d: Date) => d.toLocaleString("de-DE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const initials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

// ── Component ─────────────────────────────────────────────────────────────────

export function PlayerPasses() {

  // ── Page tab ──────────────────────────────────────────────────────────────
  const [pageTab, setPageTab] = useState<"passes" | "berichte">("passes");

  // ── Passabgleich modal state ───────────────────────────────────────────────
  type AbgleichState = "idle" | "loading" | "loaded";
  type ModalStep = "browse" | "confirm";

  const [abgleichState,     setAbgleichState]     = useState<AbgleichState>("idle");
  const [abgleichModalOpen, setAbgleichModalOpen] = useState(false);
  const [abgleichView,      setAbgleichView]      = useState<"table" | "json">("table");
  const [loadingMsg,        setLoadingMsg]        = useState("Authentifizierung läuft…");
  const [lastSync,          setLastSync]          = useState<Date | null>(null);
  const [modalStep,         setModalStep]         = useState<ModalStep>("browse");

  // ── Decision state (persists across modal open/close) ────────────────────
  type YellowAction = "link" | "ignore";
  const [yellowActions,    setYellowActions]    = useState<Record<string, YellowAction>>({});
  const [redActions,       setRedActions]       = useState<Record<string, RedAction>>({});
  const [importedRedIds,   setImportedRedIds]   = useState<Set<string>>(new Set());
  const [overwrittenYellowIds, setOverwrittenYellowIds] = useState<Set<string>>(new Set());
  const [reusingLastDecisions, setReusingLastDecisions] = useState(false);

  // ── Report history ────────────────────────────────────────────────────────
  const [abgleichHistory, setAbgleichHistory] = useState<AbgleichReport[]>([]);
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());

  // ── Deep-link modal ───────────────────────────────────────────────────────
  const [deepLink, setDeepLink] = useState<DeepLinkPayload | null>(null);

  // ── New pass modal ────────────────────────────────────────────────────────
  type NewPassStep = "select" | "review";
  interface NewPassCandidate { firstName: string; lastName: string; dateOfBirth: string; displayName: string; avatarUrl?: string; hasPass: boolean; abgleichStatus?: PassabgleichStatus; }
  const [newPassOpen,        setNewPassOpen]        = useState(false);
  const [newPassStep,        setNewPassStep]        = useState<NewPassStep>("select");
  const [newPassSearch,      setNewPassSearch]      = useState("");
  const [newPassSelected,    setNewPassSelected]    = useState<NewPassCandidate | null>(null);

  // ── Filter ────────────────────────────────────────────────────────────────
  type StatusFilter = "all" | "linked" | "without_pass" | "expired";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  // ── Football dept members ─────────────────────────────────────────────────
  const footballMembers = useMemo(() => {
    const seen = new Set<string>();
    return MOCK_MEMBERSHIPS
      .filter(m => m.departmentId === "dept_fussball")
      .filter(m => { if (seen.has(m.personId)) return false; seen.add(m.personId); return true; })
      .map(m => ({
        membership: m,
        person: MOCK_PERSONS.find(p => p.id === m.personId)!,
        teamName: MOCK_TEAMS_PEOPLE.find(t => t.id === m.teamId)?.name ?? "—",
      }))
      .filter(r => r.person);
  }, []);

  const grouped = useMemo(() => {
    const g: Record<PassabgleichStatus, PassabgleichEntry[]> = { green: [], yellow: [], white: [], red: [] };
    mockPassabgleichData.forEach(e => g[e.matchStatus].push(e));
    return g;
  }, []);

  // ── Table rows ────────────────────────────────────────────────────────────
  type TableRow = {
    key: string; kind: "dvh" | "dfbnet_only";
    displayName: string; teamName?: string; roleLabel?: string;
    dob?: string; avatarUrl?: string;
    abgleichStatus?: PassabgleichStatus;
    passNumber?: string; passType?: PassType; issueDate?: string;
    memberUntil?: string; isExpired: boolean;
    isLinked: boolean; isOverwritten: boolean; isImported: boolean;
    entryId?: string;
    dvhPerson?: PassabgleichEntry["dvhPerson"];
    dfbMember?: PassabgleichEntry["dfbMember"];
  };

  const today = new Date();
  const isPassExpired = (memberUntil?: string) => !!memberUntil && new Date(memberUntil) < today;

  const tableRows = useMemo((): TableRow[] => {
    const dvhRows: TableRow[] = footballMembers.map(({ membership, person, teamName }) => {
      const entry = abgleichState === "loaded"
        ? mockPassabgleichData.find(e => e.dvhPerson?.id === person.id)
        : undefined;
      const isOverwritten = entry ? overwrittenYellowIds.has(entry.id) : false;
      const isLinked    = entry?.matchStatus === "green" || (entry?.matchStatus === "yellow" && isOverwritten);
      const memberUntil = isLinked ? entry?.dfbMember?.memberUntil : undefined;
      return {
        key: person.id, kind: "dvh",
        displayName: `${person.firstName} ${person.lastName}`,
        teamName, roleLabel: ROLE_LABEL[membership.role] ?? membership.role,
        dob: person.dateOfBirth, avatarUrl: person.avatarUrl,
        abgleichStatus: entry?.matchStatus,
        passNumber: isLinked ? entry?.dfbMember?.idCardNumber : undefined,
        passType: person.dateOfBirth ? passTypeFromDob(person.dateOfBirth) : undefined,
        issueDate: isLinked ? entry?.dfbMember?.issueDate : undefined,
        memberUntil,
        isExpired: isLinked ? isPassExpired(memberUntil) : false,
        isLinked, isOverwritten, isImported: false,
        entryId: entry?.id, dvhPerson: entry?.dvhPerson, dfbMember: entry?.dfbMember,
      };
    });

    // Only imported red entries appear in the main table; unimported ones stay modal-only
    const redRows: TableRow[] = abgleichState === "loaded"
      ? grouped.red
          .filter(e => importedRedIds.has(e.id))
          .map(e => {
            const memberUntil = e.dfbMember!.memberUntil;
            return {
              key: e.id, kind: "dvh" as const,
              displayName: `${e.dfbMember!.firstName} ${e.dfbMember!.lastName}`,
              dob: e.dfbMember!.birthday,
              abgleichStatus: undefined,
              passNumber: e.dfbMember!.idCardNumber,
              passType: passTypeFromDob(e.dfbMember!.birthday),
              issueDate: e.dfbMember!.issueDate,
              memberUntil,
              isExpired: isPassExpired(memberUntil),
              isLinked: false, isOverwritten: false, isImported: true,
              entryId: e.id, dfbMember: e.dfbMember,
            };
          })
      : [];

    return [...dvhRows, ...redRows];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [footballMembers, abgleichState, overwrittenYellowIds, importedRedIds, grouped.red]);

  const filteredRows = useMemo(() => {
    let rows = tableRows.filter(r => !search || r.displayName.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter === "linked")       rows = rows.filter(r => r.isLinked);
    if (statusFilter === "without_pass") rows = rows.filter(r => r.abgleichStatus === "white");
    if (statusFilter === "expired")      rows = rows.filter(r => r.isExpired);
    return rows;
  }, [tableRows, search, statusFilter]);

  // ── New pass candidates ───────────────────────────────────────────────────
  const newPassCandidates = useMemo((): NewPassCandidate[] => {
    return footballMembers
      .map(({ person }) => {
        const entry = abgleichState === "loaded"
          ? mockPassabgleichData.find(e => e.dvhPerson?.id === person.id)
          : undefined;
        const hasPass = entry?.matchStatus === "green" || overwrittenYellowIds.has(entry?.id ?? "");
        return {
          firstName: person.firstName, lastName: person.lastName,
          dateOfBirth: person.dateOfBirth ?? "",
          displayName: `${person.firstName} ${person.lastName}`,
          avatarUrl: person.avatarUrl,
          hasPass, abgleichStatus: entry?.matchStatus,
        };
      })
      // Sort: without-pass first, then unknown (no abgleich), then has-pass last
      .sort((a, b) => {
        const rank = (c: typeof a) => c.hasPass ? 2 : c.abgleichStatus === "white" ? 0 : 1;
        return rank(a) - rank(b);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [footballMembers, abgleichState, overwrittenYellowIds]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const abgleichStats = useMemo(() => ({
    green: grouped.green.length, yellow: grouped.yellow.length,
    white: grouped.white.length, red: grouped.red.length,
  }), [grouped]);

  const metricStats = useMemo(() => {
    if (abgleichState !== "loaded") return null;
    return {
      linked:      tableRows.filter(r => r.isLinked).length,
      withoutPass: tableRows.filter(r => r.abgleichStatus === "white").length,
      expired:     tableRows.filter(r => r.isExpired).length,
    };
  }, [abgleichState, tableRows]);

  // ── Pending actions count ─────────────────────────────────────────────────
  const pendingCount = useMemo(() => {
    const yellows = Object.values(yellowActions).filter(a => a === "link").length;
    const reds    = Object.values(redActions).filter(a => a === "import").length;
    return yellows + reds;
  }, [yellowActions, redActions]);

  // ── Load sequence ─────────────────────────────────────────────────────────
  function startAbgleich() {
    setAbgleichState("loading");
    setLoadingMsg("Authentifizierung läuft…");
    setTimeout(() => setLoadingMsg("Mitgliederdaten werden abgerufen…"), 800);
    setTimeout(() => {
      setAbgleichState("loaded");
      setLastSync(new Date());

      const lastReport = abgleichHistory[0] ?? null;

      if (lastReport) {
        // Rebuild yellow decisions from last report; new entries default to "link"
        const yFromReport: Record<string, YellowAction> = {};
        lastReport.decisions.yellowLinks.forEach(id => { yFromReport[id] = "link"; });
        lastReport.decisions.yellowIgnores.forEach(id => { yFromReport[id] = "ignore"; });
        grouped.yellow.forEach(e => { if (!yFromReport[e.id]) yFromReport[e.id] = "link"; });
        setYellowActions(yFromReport);

        // Rebuild red decisions from last report; new entries default to "ignore"
        const rFromReport: Record<string, RedAction> = {};
        lastReport.decisions.redImports.forEach(id => { rFromReport[id] = "import"; });
        lastReport.decisions.redIgnores.forEach(id => { rFromReport[id] = "ignore"; });
        grouped.red.forEach(e => { if (!rFromReport[e.id]) rFromReport[e.id] = "ignore"; });
        setRedActions(rFromReport);

        setReusingLastDecisions(true);
      } else {
        // First run — yellow defaults to "link", red to "ignore"
        const yDefaults: Record<string, YellowAction> = {};
        grouped.yellow.forEach(e => { yDefaults[e.id] = "link"; });
        setYellowActions(yDefaults);

        const rDefaults: Record<string, RedAction> = {};
        grouped.red.forEach(e => { rDefaults[e.id] = "ignore"; });
        setRedActions(rDefaults);

        setReusingLastDecisions(false);
      }
    }, 1600);
  }

  function handleUebernehmen() {
    if (pendingCount > 0) {
      setModalStep("confirm");
    } else {
      applyAndClose();
    }
  }

  function applyAndClose() {
    // Apply yellow links
    const yellowToLink = grouped.yellow.filter(e => yellowActions[e.id] === "link").map(e => e.id);
    if (yellowToLink.length > 0) {
      setOverwrittenYellowIds(prev => new Set([...prev, ...yellowToLink]));
    }
    // Apply red imports
    const toImport = Object.entries(redActions)
      .filter(([, a]) => a === "import").map(([id]) => id);
    if (toImport.length > 0) {
      setImportedRedIds(prev => new Set([...prev, ...toImport]));
    }

    // Build report
    const linkedYellowEntries = grouped.yellow.filter(e => yellowActions[e.id] === "link");
    const importedRedEntries  = grouped.red.filter(e => redActions[e.id] === "import");
    const report: AbgleichReport = {
      id: `run_${Date.now()}`,
      runAt: lastSync ?? new Date(),
      summary: {
        green: abgleichStats.green, yellow: abgleichStats.yellow,
        yellowLinked: yellowToLink.length, white: abgleichStats.white,
        red: abgleichStats.red, redImported: importedRedEntries.length,
      },
      linkedYellow: linkedYellowEntries.map(e => ({
        dvhName:    `${e.dvhPerson!.firstName} ${e.dvhPerson!.lastName}`,
        dfbName:    `${e.dfbMember!.firstName} ${e.dfbMember!.lastName}`,
        passNumber: e.dfbMember!.idCardNumber ?? "—",
        note:       e.similarityNote ?? "",
      })),
      importedRed: importedRedEntries.map(e => ({
        dfbName:    `${e.dfbMember!.firstName} ${e.dfbMember!.lastName}`,
        passNumber: e.dfbMember!.idCardNumber ?? "—",
      })),
      decisions: {
        yellowLinks:   grouped.yellow.filter(e => yellowActions[e.id] === "link").map(e => e.id),
        yellowIgnores: grouped.yellow.filter(e => yellowActions[e.id] === "ignore").map(e => e.id),
        redImports:    grouped.red.filter(e => redActions[e.id] === "import").map(e => e.id),
        redIgnores:    grouped.red.filter(e => redActions[e.id] !== "import").map(e => e.id),
      },
    };
    setAbgleichHistory(prev => [report, ...prev]);
    setReusingLastDecisions(false);
    setModalStep("browse");
    setAbgleichModalOpen(false);
  }

  function closeModal() {
    setReusingLastDecisions(false);
    setModalStep("browse");
    setAbgleichModalOpen(false);
  }

  function closeNewPass() {
    setNewPassOpen(false);
    setNewPassStep("select");
    setNewPassSearch("");
    setNewPassSelected(null);
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (deepLink) { setDeepLink(null); return; }
      if (newPassOpen) {
        if (newPassStep === "review") { setNewPassStep("select"); setNewPassSelected(null); return; }
        closeNewPass(); return;
      }
      if (modalStep === "confirm") { setModalStep("browse"); return; }
      if (abgleichModalOpen) closeModal();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLink, newPassOpen, newPassStep, abgleichModalOpen, modalStep]);

  // ── Derived for confirm step ───────────────────────────────────────────────
  const confirmYellowEntries = useMemo(
    () => grouped.yellow.filter(e => yellowActions[e.id] === "link"),
    [grouped.yellow, yellowActions]
  );
  const confirmRedEntries = useMemo(
    () => grouped.red.filter(e => redActions[e.id] === "import"),
    [grouped.red, redActions]
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Spielerpässe</h1>
          <p className="text-slate-500 mt-1">Fußball-Abteilung · {footballMembers.length} Mitglieder</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setNewPassOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Neuen Pass beantragen
          </button>
          <button
            onClick={() => setAbgleichModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            DFB Passabgleich
            {abgleichState === "loaded" && <span className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />}
          </button>
        </div>
      </div>

      {/* ── PAGE TABS ───────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200">
        {([["passes", "Spielerpässe"], ["berichte", "Berichte"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setPageTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              pageTab === id ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {id === "berichte" && <FileText className="w-3.5 h-3.5" />}
            {label}
            {id === "berichte" && abgleichHistory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                {abgleichHistory.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── SPIELERPÄSSE TAB ────────────────────────────────────────────── */}
      {pageTab === "passes" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Verknüpft */}
            <button
              onClick={() => setStatusFilter(f => f === "linked" ? "all" : "linked")}
              className={`text-left rounded-2xl border p-4 transition-all ${statusFilter === "linked" ? "ring-2 ring-emerald-500 border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${statusFilter === "linked" ? "bg-emerald-200" : "bg-emerald-100"}`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{metricStats ? metricStats.linked : "—"}</p>
                  <p className="text-sm text-slate-500">Verknüpft</p>
                </div>
              </div>
            </button>

            {/* Ohne Pass */}
            <button
              onClick={() => setStatusFilter(f => f === "without_pass" ? "all" : "without_pass")}
              className={`text-left rounded-2xl border p-4 transition-all ${statusFilter === "without_pass" ? "ring-2 ring-slate-400 border-slate-300 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${statusFilter === "without_pass" ? "bg-slate-200" : "bg-slate-100"}`}>
                  <MinusCircle className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-700">{metricStats ? metricStats.withoutPass : "—"}</p>
                  <p className="text-sm text-slate-500">Ohne Pass</p>
                </div>
              </div>
            </button>

            {/* Abgelaufen */}
            <button
              onClick={() => setStatusFilter(f => f === "expired" ? "all" : "expired")}
              className={`text-left rounded-2xl border p-4 transition-all ${statusFilter === "expired" ? "ring-2 ring-red-400 border-red-200 bg-red-50" : "border-slate-200 bg-white hover:border-red-200 hover:bg-red-50/40"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${statusFilter === "expired" ? "bg-red-200" : "bg-red-100"}`}>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{metricStats ? metricStats.expired : "—"}</p>
                  <p className="text-sm text-slate-500">Abgelaufen</p>
                </div>
              </div>
            </button>

            {/* Zuletzt synchronisiert */}
            <button
              onClick={() => setPageTab("berichte")}
              className="text-left rounded-2xl border border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40 p-4 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-100">
                  <RefreshCw className={`w-5 h-5 text-teal-600 ${abgleichState === "loading" ? "animate-spin" : ""}`} />
                </div>
                <div className="min-w-0">
                  {lastSync ? (
                    <>
                      <p className="text-sm font-semibold text-teal-700 truncate">
                        {lastSync.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-xs text-slate-400">
                        {lastSync.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-slate-400">Kein Abgleich</p>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Active filter pill */}
          {statusFilter !== "all" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter aktiv:</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                statusFilter === "linked" ? "bg-emerald-100 text-emerald-700" :
                statusFilter === "without_pass" ? "bg-slate-100 text-slate-700" :
                "bg-red-100 text-red-700"
              }`}>
                {statusFilter === "linked" ? "Verknüpft" : statusFilter === "without_pass" ? "Ohne Pass" : "Abgelaufen"}
                <button onClick={() => setStatusFilter("all")} className="hover:opacity-70"><X className="w-3 h-3" /></button>
              </span>
            </div>
          )}

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" placeholder="Name suchen…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>

          {/* Table */}
          <Card padding="none">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-slate-800">Alle Spieler &amp; Trainer</p>
                <p className="text-sm text-slate-500 mt-0.5">{filteredRows.length} Einträge</p>
              </div>
              {abgleichState !== "loaded" && (
                <p className="text-xs text-slate-400 italic">DFB Passabgleich starten für Passdaten</p>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Person</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Team / Rolle</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">DFBnet-Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Passnummer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Typ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Gültig bis</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map(row => {
                    const isYellowLinked = row.abgleichStatus === "yellow" && row.isLinked;
                    const statusBadge = (() => {
                      if (!abgleichState || abgleichState !== "loaded" || !row.abgleichStatus) return null;
                      if (row.isImported) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-700"><CheckCircle2 className="w-3 h-3" /> Importiert</span>;
                      if (row.isLinked || row.isOverwritten) {
                        if (row.isExpired) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600"><AlertTriangle className="w-3 h-3" /> Abgelaufen</span>;
                        if (row.isOverwritten) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-700"><CheckCircle2 className="w-3 h-3" /> Aktualisiert</span>;
                        return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Verknüpft</span>;
                      }
                      if (isYellowLinked) return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3" /> Verknüpft</span>;
                      const cfg = { green: "bg-emerald-100 text-emerald-700", yellow: "bg-amber-100 text-amber-700", white: "bg-slate-100 text-slate-600", red: "bg-red-100 text-red-600" };
                      const lbl = { green: "Verknüpft ✓", yellow: "Ähnlich", white: "Ohne Pass", red: "Nur DFBnet" };
                      // DFBnet-only expired: add expiry note
                      if (row.abgleichStatus === "red" && row.isExpired) {
                        return <div className="flex flex-col gap-0.5 items-start"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.red}`}>{lbl.red}</span><span className="text-[10px] text-red-500 flex items-center gap-0.5"><AlertTriangle className="w-2.5 h-2.5" />Abgelaufen</span></div>;
                      }
                      return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg[row.abgleichStatus]}`}>{lbl[row.abgleichStatus]}</span>;
                    })();

                    return (
                      <tr key={row.key} className={`hover:bg-slate-50/60 transition-colors ${row.kind === "dfbnet_only" ? "bg-red-50/30" : ""}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {row.avatarUrl
                              ? <img src={row.avatarUrl} alt={row.displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                              : <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${row.kind === "dfbnet_only" ? "bg-gradient-to-br from-red-300 to-red-500" : "bg-gradient-to-br from-teal-400 to-teal-600"}`}>{initials(row.displayName)}</div>
                            }
                            <div className="min-w-0">
                              <p className={`font-medium truncate ${row.kind === "dfbnet_only" ? "text-slate-500 italic" : "text-slate-800"}`}>{row.displayName}</p>
                              {row.kind === "dfbnet_only" && <p className="text-xs text-red-500">Nicht im DVH</p>}
                              {row.dob && <p className="text-xs text-slate-400">*{fmtDate(row.dob)}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {row.teamName && <p className="text-sm text-slate-700 truncate max-w-[140px]">{row.teamName}</p>}
                          {row.roleLabel && <p className="text-xs text-slate-400">{row.roleLabel}</p>}
                        </td>
                        <td className="px-4 py-3">{statusBadge ?? <span className="text-xs text-slate-300">—</span>}</td>
                        <td className="px-4 py-3">
                          {row.passNumber ? <span className="font-mono text-xs text-slate-700">{row.passNumber}</span> : <span className="text-xs text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {row.passType && row.passNumber
                            ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PASS_TYPE_CFG[row.passType].cls}`}>{PASS_TYPE_CFG[row.passType].label}</span>
                            : <span className="text-xs text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {row.memberUntil ? (
                            <span className={`text-xs font-medium ${row.isExpired ? "text-red-500" : "text-slate-500"}`}>
                              {fmtDate(row.memberUntil)}
                              {row.isExpired && <span className="block text-[10px] text-red-400">abgelaufen</span>}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {abgleichState === "loaded" && row.abgleichStatus && (() => {
                            const st = row.abgleichStatus;
                            if (st === "green" || (st === "yellow" && (isYellowLinked || row.isOverwritten))) {
                              const person = { firstName: row.dvhPerson?.firstName ?? row.dfbMember!.firstName, lastName: row.dvhPerson?.lastName ?? row.dfbMember!.lastName, dateOfBirth: row.dob ?? "", passNumber: row.passNumber };
                              return (
                                <div className="flex items-center justify-end gap-1">
                                  {row.isExpired ? (
                                    <button
                                      onClick={() => setDeepLink({ action: "verlängerung", person })}
                                      className="text-xs px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium transition-colors"
                                    >
                                      Verlängerung
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setDeepLink({ action: "vereinswechsel", person })}
                                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                      Vereinswechsel
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setDeepLink({ action: "abmeldung", person })}
                                    className="text-xs px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    Abmeldung
                                  </button>
                                </div>
                              );
                            }
                            if (st === "yellow" && !isYellowLinked) {
                              return (
                                <button
                                  onClick={() => setAbgleichModalOpen(true)}
                                  className="text-xs px-2.5 py-1 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors"
                                >
                                  Im Abgleich
                                </button>
                              );
                            }
                            if (st === "white") {
                              return (
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => setDeepLink({ action: "erstausstellung", person: { firstName: row.dvhPerson!.firstName, lastName: row.dvhPerson!.lastName, dateOfBirth: row.dob ?? "" } })} className="text-xs px-2.5 py-1 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-50 transition-colors">Erstausstellung</button>
                                  <button onClick={() => setDeepLink({ action: "vereinswechsel", person: { firstName: row.dvhPerson!.firstName, lastName: row.dvhPerson!.lastName, dateOfBirth: row.dob ?? "" } })} className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Vereinswechsel</button>
                                </div>
                              );
                            }
                            if (st === "red" && !row.isImported) {
                              return (
                                <button onClick={() => setDeepLink({ action: "erstausstellung", person: { firstName: row.dfbMember!.firstName, lastName: row.dfbMember!.lastName, dateOfBirth: row.dfbMember!.birthday } })} className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                                  Ins DVH importieren
                                </button>
                              );
                            }
                            return null;
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRows.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">Keine Mitglieder gefunden</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ── BERICHTE TAB ────────────────────────────────────────────────── */}
      {pageTab === "berichte" && (
        <div className="space-y-4">
          {abgleichHistory.length === 0 ? (
            <Card>
              <div className="py-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">Noch keine Berichte vorhanden</p>
                <p className="text-xs text-slate-400 mt-1">Führen Sie einen DFB Passabgleich durch, um einen Bericht zu generieren.</p>
              </div>
            </Card>
          ) : (
            abgleichHistory.map(report => {
              const isExpanded = expandedReports.has(report.id);
              const hasActions = report.linkedYellow.length > 0 || report.importedRed.length > 0;
              return (
                <Card key={report.id} padding="none">
                  <button
                    className="w-full flex items-start justify-between p-5 text-left hover:bg-slate-50/60 transition-colors"
                    onClick={() => setExpandedReports(prev => {
                      const next = new Set(prev);
                      isExpanded ? next.delete(report.id) : next.add(report.id);
                      return next;
                    })}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">Passabgleich – {fmtTime(report.runAt)}</p>
                        {hasActions && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">{report.linkedYellow.length + report.importedRed.length} Aktionen</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          <span className="font-bold">{report.summary.green}</span> Übereinstimmungen
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          <span className="font-bold">{report.summary.yellowLinked}</span>/{report.summary.yellow} Ähnlich verknüpft
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          <span className="font-bold">{report.summary.white}</span> Ohne Pass
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                          <span className="font-bold">{report.summary.redImported}</span>/{report.summary.red} DFBnet importiert
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 px-5 py-4 space-y-4">
                      {report.linkedYellow.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Verknüpfte Ähnlichkeiten</p>
                          <div className="space-y-2">
                            {report.linkedYellow.map((entry, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm p-3 bg-amber-50 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <p className="font-medium text-slate-800">{entry.dvhName} <span className="text-slate-400">→</span> <span className="text-amber-700">{entry.dfbName}</span></p>
                                  <p className="text-xs text-slate-500 font-mono">{entry.passNumber}</p>
                                  {entry.note && <p className="text-xs text-amber-600 mt-0.5">{entry.note}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {report.importedRed.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Importierte DFBnet-Einträge</p>
                          <div className="space-y-2">
                            {report.importedRed.map((entry, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm p-3 bg-red-50 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-slate-800">{entry.dfbName}</p>
                                  <p className="text-xs text-slate-500 font-mono">{entry.passNumber}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {!hasActions && (
                        <p className="text-sm text-slate-400 italic">Keine Aktionen in diesem Lauf durchgeführt.</p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ── PASSABGLEICH MODAL ───────────────────────────────────────────── */}
      {abgleichModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => { if (modalStep === "confirm") setModalStep("browse"); else closeModal(); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {modalStep === "confirm" ? "Änderungen bestätigen" : "DFB Passabgleich"}
                  </h2>
                  {abgleichState === "loaded" && modalStep === "browse" && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {BVB_DFB_MEMBERS_JSON.members.length} Einträge · Abgerufen {lastSync?.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {abgleichState === "loaded" && modalStep === "browse" && (
                    <div className="flex rounded-lg border border-amber-300 overflow-hidden">
                      <button onClick={() => setAbgleichView("table")} className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${abgleichView === "table" ? "bg-amber-500 text-white" : "text-amber-700 hover:bg-amber-50"}`}>
                        <Table2 className="w-3.5 h-3.5" /><span>Abgleich</span>
                      </button>
                      <button onClick={() => setAbgleichView("json")} className={`flex items-center gap-1 px-2.5 py-1.5 text-xs border-l border-amber-300 transition-colors ${abgleichView === "json" ? "bg-amber-500 text-white" : "text-amber-700 hover:bg-amber-50"}`}>
                        <Code2 className="w-3.5 h-3.5" /><span>JSON</span>
                      </button>
                    </div>
                  )}
                  <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto">

                {/* ── IDLE ── */}
                {abgleichState === "idle" && (
                  <div className="px-6 py-5 space-y-5">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Personenabgleich mit DFBnet Pass</p>
                      <p className="text-sm text-slate-500 mt-1">Vergleicht die DVH-Mitgliederliste der Fußball-Abteilung mit den beim DFB registrierten Pässen.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">Abteilung: Fußball</span>
                        <span className="text-xs text-slate-400">{footballMembers.length} DVH · {BVB_DFB_MEMBERS_JSON.members.length} DFBnet</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Authentifizierungsablauf</p>
                      <div className="overflow-x-auto">
                        <div className="flex items-center min-w-[480px]">
                          <div className="rounded-xl border-2 border-teal-600 bg-teal-50 px-4 py-2.5 text-center w-28 flex-shrink-0">
                            <p className="text-xs font-bold text-teal-800">DVH</p>
                            <p className="text-[10px] text-teal-600">Club Mgmt</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center px-2">
                            <p className="text-[10px] text-slate-400 font-mono">CDC Token</p>
                            <div className="w-full flex items-center"><div className="flex-1 h-px bg-slate-300" /><ArrowRight className="w-3 h-3 text-slate-400 -ml-px" /></div>
                          </div>
                          <div className="rounded-xl border-2 border-slate-400 bg-slate-50 px-4 py-2.5 text-center w-28 flex-shrink-0">
                            <p className="text-xs font-bold text-slate-700">Auth-Proxy</p>
                            <p className="text-[10px] text-slate-500">OAuth2/PKCE</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center px-2">
                            <p className="text-[10px] text-slate-400 font-mono">Redirect</p>
                            <div className="w-full flex items-center"><div className="flex-1 h-px bg-slate-300" /><ArrowRight className="w-3 h-3 text-slate-400 -ml-px" /></div>
                          </div>
                          <div className="rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-2.5 text-center w-28 flex-shrink-0">
                            <p className="text-xs font-bold text-amber-800">DFBnet</p>
                            <p className="text-[10px] text-amber-600">Login / API</p>
                          </div>
                        </div>
                        <div className="flex items-center min-w-[480px] mt-2 pl-28 pr-28">
                          <ArrowRight className="w-3 h-3 text-emerald-500 rotate-180 flex-shrink-0" />
                          <div className="flex-1 h-px border-t-2 border-dashed border-emerald-400" />
                        </div>
                        <p className="text-[10px] text-emerald-600 font-mono pl-32 mt-0.5 min-w-[480px]">Bearer Token → GET /club/{"{id}"}/members</p>
                      </div>
                    </div>
                    <button onClick={startAbgleich} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                      Abgleich starten <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ── LOADING ── */}
                {abgleichState === "loading" && (
                  <div className="px-6 py-12 flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700">{loadingMsg}</p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">GET /club/{mockClub.dfbId}/members</p>
                    </div>
                  </div>
                )}

                {/* ── LOADED JSON ── */}
                {abgleichState === "loaded" && modalStep === "browse" && abgleichView === "json" && (
                  <div className="bg-slate-900 overflow-auto">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 sticky top-0">
                      <span className="text-xs text-slate-400 font-mono">GET /club/{mockClub.dfbId}/members</span>
                      <span className="text-xs text-emerald-400">200 OK</span>
                    </div>
                    <pre className="px-4 py-4 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre overflow-x-auto">
                      {JSON.stringify(BVB_DFB_MEMBERS_JSON, null, 2)}
                    </pre>
                  </div>
                )}

                {/* ── LOADED TABLE ── */}
                {abgleichState === "loaded" && modalStep === "browse" && abgleichView === "table" && (
                  <div className="divide-y divide-slate-100">
                    {reusingLastDecisions && (
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-teal-50 border-b border-teal-100">
                        <RefreshCw className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                        <span className="text-xs text-teal-700">Entscheidungen aus dem letzten Abgleich wurden vorausgefüllt</span>
                        <button onClick={() => setReusingLastDecisions(false)} className="ml-auto p-0.5 hover:opacity-70"><X className="w-3 h-3 text-teal-400" /></button>
                      </div>
                    )}
                    {(["green", "yellow", "white", "red"] as const).map(status => {
                      const entries = grouped[status];
                      if (entries.length === 0) return null;
                      const cfg = GROUP_CFG[status];
                      return (
                        <div key={status}>
                          <div className={`px-5 py-2 ${cfg.bg} flex items-center gap-2`}>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.text}`}>{cfg.label} ({entries.length})</span>
                          </div>
                          {entries.map(entry => (
                            <div key={entry.id} className={`flex items-start gap-4 px-5 py-3.5 border-l-4 ${cfg.border} hover:bg-slate-50/60`}>
                              {/* DVH */}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">DVH</p>
                                {entry.dvhPerson
                                  ? <><p className="text-sm font-medium text-slate-800">{entry.dvhPerson.firstName} {entry.dvhPerson.lastName}</p><p className="text-xs text-slate-400">*{fmtDate(entry.dvhPerson.dateOfBirth)}</p></>
                                  : <p className="text-sm text-slate-400 italic">— kein DVH-Eintrag</p>}
                              </div>
                              {/* DFBnet */}
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">DFBnet-Pass</p>
                                {entry.dfbMember
                                  ? (<>
                                      <p className={`text-sm font-medium ${status === "yellow" ? "text-amber-700" : "text-slate-800"}`}>{entry.dfbMember.firstName} {entry.dfbMember.lastName}</p>
                                      <p className="text-xs text-slate-400">*{fmtDate(entry.dfbMember.birthday)} · <span className="font-mono">{entry.dfbMember.idCardNumber}</span></p>
                                      {entry.similarityNote && <p className="text-xs text-amber-600 mt-1">{entry.similarityNote}</p>}
                                    </>)
                                  : <p className="text-sm text-slate-400 italic">— kein DFBnet-Eintrag</p>}
                              </div>
                              {/* Actions per group */}
                              <div className="flex flex-col gap-1.5 items-end flex-shrink-0 min-w-[110px] pt-0.5">
                                {/* GREEN — badge only */}
                                {status === "green" && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Verknüpft ✓</span>
                                )}
                                {/* YELLOW — dropdown (same pattern as red) */}
                                {status === "yellow" && (
                                  <select
                                    value={yellowActions[entry.id] ?? "link"}
                                    onChange={e => setYellowActions(prev => ({ ...prev, [entry.id]: e.target.value as YellowAction }))}
                                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                  >
                                    <option value="link">Verknüpfen</option>
                                    <option value="ignore">Ignorieren</option>
                                  </select>
                                )}
                                {/* WHITE — no action, info only */}
                                {status === "white" && (
                                  <span className="text-xs text-slate-400 italic text-right">Aktion im<br />Hauptmenü</span>
                                )}
                                {/* RED — action selector */}
                                {status === "red" && (
                                  <select
                                    value={redActions[entry.id] ?? "ignore"}
                                    onChange={e => setRedActions(prev => ({ ...prev, [entry.id]: e.target.value as RedAction }))}
                                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                  >
                                    <option value="ignore">Ignorieren</option>
                                    <option value="import">Ins DVH importieren</option>
                                  </select>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── CONFIRM STEP ── */}
                {modalStep === "confirm" && (
                  <div className="px-6 py-5 space-y-5">
                    {/* Warning banner */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Änderungen werden angewendet</p>
                        <p className="text-sm text-amber-700 mt-0.5">
                          {confirmYellowEntries.length > 0 && `${confirmYellowEntries.length} DVH-Einträge werden mit DFBnet-Daten überschrieben. `}
                          {confirmRedEntries.length > 0 && `${confirmRedEntries.length} DFBnet-Einträge werden ins DVH importiert.`}
                        </p>
                      </div>
                    </div>

                    {/* Yellow overwrites detail */}
                    {confirmYellowEntries.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">DVH-Daten werden überschrieben</p>
                        <div className="space-y-3">
                          {confirmYellowEntries.map(entry => (
                            <div key={entry.id} className="border border-amber-200 rounded-xl overflow-hidden">
                              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                                <p className="text-xs font-semibold text-amber-800">
                                  {entry.dvhPerson!.firstName} {entry.dvhPerson!.lastName}
                                </p>
                              </div>
                              <div className="px-4 py-3 grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <p className="font-semibold text-slate-500 mb-1">DVH (aktuell)</p>
                                  <p className="text-slate-700">{entry.dvhPerson!.firstName} {entry.dvhPerson!.lastName}</p>
                                  <p className="text-slate-500">*{fmtDate(entry.dvhPerson!.dateOfBirth)}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-emerald-600 mb-1">DFBnet (neu)</p>
                                  <p className="text-slate-700 font-medium">{entry.dfbMember!.firstName} {entry.dfbMember!.lastName}</p>
                                  <p className="text-slate-500">*{fmtDate(entry.dfbMember!.birthday)}</p>
                                  <p className="font-mono text-slate-400 mt-0.5">{entry.dfbMember!.idCardNumber}</p>
                                </div>
                              </div>
                              {entry.similarityNote && (
                                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                                  <p className="text-xs text-amber-600">{entry.similarityNote}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Red imports detail */}
                    {confirmRedEntries.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Werden ins DVH importiert</p>
                        <div className="space-y-2">
                          {confirmRedEntries.map(entry => (
                            <div key={entry.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {initials(`${entry.dfbMember!.firstName} ${entry.dfbMember!.lastName}`)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{entry.dfbMember!.firstName} {entry.dfbMember!.lastName}</p>
                                <p className="text-xs text-slate-400">*{fmtDate(entry.dfbMember!.birthday)} · <span className="font-mono">{entry.dfbMember!.idCardNumber}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal footer */}
              {abgleichState === "loaded" && (
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
                  {modalStep === "browse" ? (
                    <>
                      <button onClick={closeModal} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Schließen</button>
                      <button
                        onClick={handleUebernehmen}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                      >
                        Übernehmen &amp; Schließen
                        {pendingCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">{pendingCount}</span>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setModalStep("browse")} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Zurück
                      </button>
                      <button onClick={applyAndClose} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                        Bestätigen &amp; Schließen
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── NEW PASS MODAL ──────────────────────────────────────────────── */}
      {newPassOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeNewPass} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Neuen Pass beantragen</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {newPassStep === "select" ? "Mitglied auswählen" : "Erstausstellung · DFBnet"}
                  </p>
                </div>
                <button onClick={closeNewPass} className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Auth notice — always visible */}
              <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 border-b border-amber-100 flex-shrink-0">
                <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-xs text-amber-700">Authentifizierung über OAuth2/PKCE Auth-Proxy · Rolle: Passbearbeiter</span>
              </div>

              {/* ── Step 1: select member ── */}
              {newPassStep === "select" && (
                <>
                  <div className="px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text" placeholder="Mitglied suchen…" value={newPassSearch}
                        onChange={e => setNewPassSearch(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {newPassCandidates
                      .filter(m => !newPassSearch || m.displayName.toLowerCase().includes(newPassSearch.toLowerCase()))
                      .map(m => (
                        <button
                          key={m.displayName}
                          onClick={() => { setNewPassSelected(m); setNewPassStep("review"); }}
                          className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                        >
                          {m.avatarUrl
                            ? <img src={m.avatarUrl} alt={m.displayName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{initials(m.displayName)}</div>
                          }
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800">{m.displayName}</p>
                            {m.dateOfBirth && <p className="text-xs text-slate-400">*{fmtDate(m.dateOfBirth)}</p>}
                          </div>
                          {abgleichState === "loaded" && (
                            m.hasPass
                              ? <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">Hat Pass</span>
                              : m.abgleichStatus === "white"
                                ? <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex-shrink-0">Ohne Pass</span>
                                : null
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        </button>
                      ))}
                  </div>
                </>
              )}

              {/* ── Step 2: review & deep link ── */}
              {newPassStep === "review" && newPassSelected && (
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                  {newPassSelected.hasPass && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">Laut DFBnet-Abgleich hat diese Person bereits einen aktiven Pass. Eine Erstausstellung ist nur für passlose Spieler möglich.</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Personendaten</p>
                    <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Name</span>
                        <span className="font-medium">{newPassSelected.firstName} {newPassSelected.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Geburtsdatum</span>
                        <span className="font-medium">{fmtDate(newPassSelected.dateOfBirth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Verein-ID</span>
                        <span className="font-mono text-xs text-slate-600">{mockClub.dfbId}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">DFBnet-Zielmodul</p>
                    <p className="text-sm font-medium text-slate-700 mb-1">DFBnet Pass – Antragstellung / Erstausstellung</p>
                    <p className="text-xs text-slate-500 mb-3">{ACTION_DESC.erstausstellung}</p>
                    <div className="bg-slate-900 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
                        <span className="text-xs text-slate-400 font-mono">URL-Template</span>
                        <span className="text-xs text-amber-400">Deep Link</span>
                      </div>
                      <pre className="px-3 py-3 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap break-all">
                        {buildUrl("erstausstellung", { firstName: newPassSelected.firstName, lastName: newPassSelected.lastName, dateOfBirth: newPassSelected.dateOfBirth }, mockClub.dfbId)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
                {newPassStep === "select" ? (
                  <button onClick={closeNewPass} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    Schließen
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setNewPassStep("select"); setNewPassSelected(null); }}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Zurück
                    </button>
                    <div className="relative group">
                      <button disabled className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-400 rounded-xl cursor-not-allowed opacity-70">
                        In DFBnet öffnen <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 w-56 px-3 py-2 bg-slate-800 text-xs text-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Demo – in der Live-Version öffnet sich DFBnet mit vorbefüllten Daten.
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── DEEP LINK MODAL ─────────────────────────────────────────────── */}
      {deepLink && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setDeepLink(null)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-base font-bold text-slate-800">{ACTION_LABEL[deepLink.action]}</h2>
                <button onClick={() => setDeepLink(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500" /></button>
              </div>
              <div className="overflow-y-auto px-6 py-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Personendaten</p>
                  <div className="bg-slate-50 rounded-xl px-4 py-3 space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium">{deepLink.person.firstName} {deepLink.person.lastName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Geburtsdatum</span><span className="font-medium">{fmtDate(deepLink.person.dateOfBirth)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Verein-ID</span><span className="font-mono text-xs text-slate-600">{mockClub.dfbId}</span></div>
                    {deepLink.person.passNumber && <div className="flex justify-between"><span className="text-slate-500">Passnummer</span><span className="font-mono text-xs text-slate-600">{deepLink.person.passNumber}</span></div>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">DFBnet-Zielmodul</p>
                  <p className="text-sm font-medium text-slate-700 mb-1">{ACTION_MODULE[deepLink.action]}</p>
                  <p className="text-xs text-slate-500 mb-3">{ACTION_DESC[deepLink.action]}</p>
                  <div className="bg-slate-900 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
                      <span className="text-xs text-slate-400 font-mono">URL-Template</span>
                      <span className="text-xs text-amber-400">Deep Link</span>
                    </div>
                    <pre className="px-3 py-3 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap break-all">
                      {buildUrl(deepLink.action, deepLink.person, mockClub.dfbId)}
                    </pre>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Erforderliche Berechtigung</p>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">{ACTION_ROLE[deepLink.action]}</span>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <button onClick={() => setDeepLink(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Schließen</button>
                <div className="relative group">
                  <button disabled className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-400 rounded-xl cursor-not-allowed opacity-70">
                    In DFBnet öffnen <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 w-56 px-3 py-2 bg-slate-800 text-xs text-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Demo – in der Live-Version öffnet sich DFBnet mit vorbefüllten Daten.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

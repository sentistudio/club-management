import { useState } from "react";
import {
  Save, Building2, MapPin, Globe, Plus, Edit2, X, Check, Download,
  Loader2, CheckCircle2, ChevronDown, ChevronRight, AlertCircle, Code2, List,
} from "lucide-react";
import { Card, CardHeader, Button, Input } from "../components/ui";
import { mockClub } from "../data/mockClub";
import { mockOrganization } from "../data/mockOrganization";
import {
  mockVenues, mockFields,
  BVB_DFB_CATALOG, DFB_PENDING_VENUES, DFB_PENDING_FIELDS,
  BVB_DFB_SPIELSTAETTEN_JSON,
} from "../data/mockFields";
import type { Venue, Field } from "../types/fields";

type VenueForm = { name: string; address: string; description: string };
const EMPTY_VENUE_FORM: VenueForm = { name: "", address: "", description: "" };

export function Settings() {
  const [club, setClub] = useState(mockClub);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
  const [venueForm, setVenueForm] = useState<VenueForm>(EMPTY_VENUE_FORM);

  // DFB import panel state
  const [showDfbImport, setShowDfbImport] = useState(false);
  const [dfbLoading, setDfbLoading] = useState(false);
  const [dfbLoaded, setDfbLoaded] = useState(false);
  const [dfbView, setDfbView] = useState<"list" | "raw">("list");
  const [selectedPitchIds, setSelectedPitchIds] = useState<Set<string>>(new Set());
  const [expandedCatalogVenues, setExpandedCatalogVenues] = useState<Set<string>>(
    new Set(["venue_hohenbuschei"]) // Hohenbuschei expanded by default to show Platz 9
  );

  const handleChange = (field: keyof typeof club, value: string) => {
    setClub(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── DFB import helpers ───────────────────────────────────────────────────

  const openDfbPanel = () => {
    setShowDfbImport(v => !v);
    if (!dfbLoaded) {
      setDfbLoading(true);
      setTimeout(() => {
        setDfbLoading(false);
        setDfbLoaded(true);
      }, 900);
    }
  };

  // Set of externalFieldIds currently in the app
  const importedPitchIds = new Set(
    fields.filter(f => f.externalFieldId).map(f => f.externalFieldId!)
  );
  // Set of venueIds currently in the app
  const importedVenueIds = new Set(venues.map(v => v.id));

  const toggleCatalogVenue = (venueId: string) => {
    setExpandedCatalogVenues(prev => {
      const next = new Set(prev);
      next.has(venueId) ? next.delete(venueId) : next.add(venueId);
      return next;
    });
  };

  const togglePitch = (pitchId: string) => {
    setSelectedPitchIds(prev => {
      const next = new Set(prev);
      next.has(pitchId) ? next.delete(pitchId) : next.add(pitchId);
      return next;
    });
  };

  const toggleAllPitchesForVenue = (_venueId: string, pendingIds: string[]) => {
    const allSelected = pendingIds.every(id => selectedPitchIds.has(id));
    setSelectedPitchIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        pendingIds.forEach(id => next.delete(id));
      } else {
        pendingIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const handleDfbImport = () => {
    const newVenues: Venue[] = [];
    const newFields: Field[] = [];
    const addedVenueIds = new Set<string>();

    for (const pitchId of selectedPitchIds) {
      const pendingField = DFB_PENDING_FIELDS[pitchId];
      if (!pendingField) continue;
      newFields.push(pendingField);

      // Create venue if it doesn't exist yet
      const catalogEntry = BVB_DFB_CATALOG.find(e => e.pitches.some(p => p.id === pitchId));
      if (catalogEntry && !importedVenueIds.has(catalogEntry.venueId) && !addedVenueIds.has(catalogEntry.venueId)) {
        const pendingVenue = DFB_PENDING_VENUES[catalogEntry.venueId];
        if (pendingVenue) {
          newVenues.push(pendingVenue);
          addedVenueIds.add(catalogEntry.venueId);
        }
      }
    }

    // Mutate mock arrays so FieldBooking picks up changes on next navigation
    mockVenues.push(...newVenues);
    mockFields.push(...newFields);

    setVenues(prev => [...prev, ...newVenues]);
    setFields(prev => [...prev, ...newFields]);
    setSelectedPitchIds(new Set());
    setShowDfbImport(false);
    setDfbLoaded(false); // reset so panel refreshes next time
  };

  // Compute catalog status (done here once, used in render)
  const catalogEntries = BVB_DFB_CATALOG.map(entry => {
    const pitchStatuses = entry.pitches.map(p => ({
      ...p,
      isImported: importedPitchIds.has(p.id),
      isPending: !!DFB_PENDING_FIELDS[p.id],
    }));
    const importedCount = pitchStatuses.filter(p => p.isImported).length;
    const totalCount = pitchStatuses.length;
    const pendingCount = pitchStatuses.filter(p => !p.isImported && p.isPending).length;
    const venueImported = importedVenueIds.has(entry.venueId);
    return { ...entry, pitchStatuses, importedCount, totalCount, pendingCount, venueImported };
  });

  const totalPendingPitches = catalogEntries.reduce((sum, e) => sum + e.pendingCount, 0);
  const totalImportedVenues = catalogEntries.filter(e => e.venueImported).length;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Einstellungen</h1>
        <p className="text-slate-500 mt-1">
          Verwalten Sie die Stammdaten Ihres Vereins
        </p>
      </div>

      {/* Organization Info */}
      <Card>
        <CardHeader
          title="Organisation"
          subtitle="Übergeordnete Organisationsstruktur"
        />
        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
          <div className="p-3 rounded-lg bg-violet-100">
            <Globe className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <p className="font-medium text-slate-800">{mockOrganization.name}</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Typ: {mockOrganization.type === "club-group" ? "Vereinsgruppe" : mockOrganization.type}
            </p>
          </div>
        </div>
      </Card>

      {/* Club Profile */}
      <Card>
        <CardHeader
          title="Vereinsprofil"
          subtitle="Grundlegende Informationen zu Ihrem Verein"
        />

        <div className="space-y-6">
          {/* Club Logo + DFB Badge */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={`${club.shortName} Logo`}
                className="w-16 h-16 object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{club.shortName?.slice(0, 3)}</span>
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-800">{club.name}</p>
              {club.dfbNumber && (
                <p className="text-xs text-slate-500 mt-0.5">DFB-Vereinsnummer: {club.dfbNumber}</p>
              )}
              {club.address && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {club.address.street}, {club.address.zipCode} {club.address.city}
                </p>
              )}
              {club.dfbId && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  DFB-Partnerverein
                </span>
              )}
            </div>
          </div>

          {/* Club Info Section */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="p-3 rounded-lg bg-sky-100">
              <Building2 className="w-6 h-6 text-sky-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-800">Vereinsdaten</h3>
              <p className="text-sm text-slate-500 mt-1">Name und Verbandzugehörigkeit</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Vereinsname"
                  value={club.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <Input
                  label="Kurzname"
                  value={club.shortName}
                  onChange={(e) => handleChange("shortName", e.target.value)}
                />
                <Input
                  label="Verband"
                  value={club.association}
                  onChange={(e) => handleChange("association", e.target.value)}
                />
                <Input
                  label="Land"
                  value={club.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="p-3 rounded-lg bg-emerald-100">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-800">Standort</h3>
              <p className="text-sm text-slate-500 mt-1">Stadt des Vereins</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Stadt"
                  value={club.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {saved ? (
              <p className="text-sm text-emerald-600 font-medium">
                ✓ Änderungen gespeichert
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Änderungen werden lokal gespeichert
              </p>
            )}
            <Button
              onClick={handleSave}
              loading={isSaving}
              icon={<Save className="w-4 h-4" />}
            >
              Speichern
            </Button>
          </div>
        </div>
      </Card>

      {/* Venues / Spielstätten */}
      <Card>
        <CardHeader
          title="Spielstätten"
          subtitle="Physische Standorte mit Feldern und Hallen"
          action={
            <button
              onClick={openDfbPanel}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                showDfbImport
                  ? "border-amber-400 text-amber-800 bg-amber-100"
                  : "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Von DFB importieren
              {totalPendingPitches > 0 && !showDfbImport && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-800">
                  {totalPendingPitches}
                </span>
              )}
            </button>
          }
        />

        {/* DFB Import Panel */}
        {showDfbImport && (
          <div className="mb-5 rounded-xl border border-amber-200 overflow-hidden">
            {/* Panel header */}
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900">
                  DFB Spielstätten – Borussia Dortmund
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  DFB-ID: {club.dfbId}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {dfbLoaded && (
                  <p className="text-xs text-amber-600 hidden sm:block">
                    <span className="font-medium">{totalImportedVenues}</span>/{BVB_DFB_CATALOG.length} importiert ·{" "}
                    <span className="font-medium text-amber-800">{totalPendingPitches}</span> ausstehend
                  </p>
                )}
                {/* View toggle */}
                {dfbLoaded && (
                  <div className="flex rounded-lg border border-amber-300 overflow-hidden">
                    <button
                      onClick={() => setDfbView("list")}
                      title="Spielstätten-Ansicht"
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-colors ${
                        dfbView === "list"
                          ? "bg-amber-600 text-white"
                          : "text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Liste</span>
                    </button>
                    <button
                      onClick={() => setDfbView("raw")}
                      title="JSON-Ansicht"
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs border-l border-amber-300 transition-colors ${
                        dfbView === "raw"
                          ? "bg-amber-600 text-white"
                          : "text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">JSON</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Loading state */}
            {dfbLoading && (
              <div className="px-4 py-8 flex flex-col items-center gap-3 bg-white">
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                <p className="text-sm text-slate-500">
                  Spielstätten werden vom DFB abgerufen…
                </p>
                <p className="text-xs text-slate-400">
                  Vereins-ID: {club.dfbId}
                </p>
              </div>
            )}

            {/* Raw JSON view */}
            {dfbLoaded && dfbView === "raw" && (
              <div className="bg-slate-900 overflow-auto max-h-[420px]">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 sticky top-0">
                  <span className="text-xs text-slate-400 font-mono">
                    GET /dfbnet/api/v1/clubs/{club.dfbId}/spielstaetten
                  </span>
                  <span className="text-xs text-emerald-400">200 OK</span>
                </div>
                <pre className="px-4 py-4 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre overflow-x-auto">
                  {JSON.stringify(BVB_DFB_SPIELSTAETTEN_JSON, null, 2)}
                </pre>
              </div>
            )}

            {/* Catalog list */}
            {dfbLoaded && dfbView === "list" && (
              <div className="bg-white divide-y divide-slate-100">
                {catalogEntries.map(entry => {
                  const isExpanded = expandedCatalogVenues.has(entry.venueId);
                  const pendingPitches = entry.pitchStatuses.filter(p => !p.isImported && p.isPending);
                  const allPendingSelected = pendingPitches.length > 0 &&
                    pendingPitches.every(p => selectedPitchIds.has(p.id));
                  const somePendingSelected = pendingPitches.some(p => selectedPitchIds.has(p.id));

                  return (
                    <div key={entry.venueId}>
                      {/* Venue row */}
                      <div
                        className={`flex items-center gap-3 px-4 py-3 ${
                          entry.pendingCount > 0 ? "bg-white" : "bg-slate-50/60"
                        }`}
                      >
                        {/* Checkbox / status icon */}
                        <div className="flex-shrink-0 w-5 flex items-center justify-center">
                          {entry.pendingCount === 0 ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                          ) : entry.importedCount === 0 ? (
                            /* Venue not imported at all — checkbox to select all */
                            <button
                              onClick={() => toggleAllPitchesForVenue(entry.venueId, pendingPitches.map(p => p.id))}
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                allPendingSelected
                                  ? "bg-amber-500 border-amber-500"
                                  : somePendingSelected
                                  ? "bg-amber-200 border-amber-400"
                                  : "border-slate-300 hover:border-amber-400"
                              }`}
                            >
                              {allPendingSelected && <Check className="w-2.5 h-2.5 text-white" />}
                              {somePendingSelected && !allPendingSelected && (
                                <div className="w-2 h-0.5 bg-amber-600 rounded" />
                              )}
                            </button>
                          ) : (
                            /* Partially imported — show alert */
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                          )}
                        </div>

                        {/* Venue info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-medium ${entry.pendingCount === 0 ? "text-slate-500" : "text-slate-800"}`}>
                              {entry.name}
                            </span>
                            {entry.pendingCount === 0 ? (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                                Importiert
                              </span>
                            ) : entry.importedCount > 0 ? (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                                {entry.importedCount}/{entry.totalCount} Plätze
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                                Nicht importiert
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{entry.address}</p>
                        </div>

                        {/* Pitch count + expand toggle */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-slate-400">
                            {entry.totalCount} {entry.totalCount === 1 ? "Platz" : "Plätze"}
                          </span>
                          <button
                            onClick={() => toggleCatalogVenue(entry.venueId)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {isExpanded
                              ? <ChevronDown className="w-4 h-4" />
                              : <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>

                      {/* Pitch list (expanded) */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/40 divide-y divide-slate-100">
                          {entry.pitchStatuses.map(pitch => (
                            <div key={pitch.id} className="flex items-center gap-3 pl-12 pr-4 py-2">
                              {/* Checkbox or check */}
                              <div className="flex-shrink-0 w-4 flex items-center justify-center">
                                {pitch.isImported ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <button
                                    onClick={() => togglePitch(pitch.id)}
                                    className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors ${
                                      selectedPitchIds.has(pitch.id)
                                        ? "bg-amber-500 border-amber-500"
                                        : "border-slate-300 hover:border-amber-400"
                                    }`}
                                  >
                                    {selectedPitchIds.has(pitch.id) && (
                                      <Check className="w-2 h-2 text-white" />
                                    )}
                                  </button>
                                )}
                              </div>

                              <div className="flex-1 min-w-0 flex items-center gap-2">
                                <span className={`text-xs font-medium ${pitch.isImported ? "text-slate-400" : "text-slate-700"}`}>
                                  {pitch.name}
                                </span>
                                <span className="text-xs text-slate-400">·</span>
                                <span className="text-xs text-slate-400">{pitch.typeLabel}</span>
                              </div>

                              {pitch.isImported ? (
                                <span className="text-xs text-emerald-500 flex-shrink-0">Importiert</span>
                              ) : (
                                <span className="text-xs text-amber-600 flex-shrink-0">Ausstehend</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Panel footer */}
            {dfbLoaded && dfbView === "list" && (
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-200 flex items-center justify-between gap-3">
                <p className="text-xs text-amber-700">
                  {selectedPitchIds.size === 0
                    ? "Wählen Sie Spielstätten oder einzelne Plätze zum Importieren aus"
                    : `${selectedPitchIds.size} ${selectedPitchIds.size === 1 ? "Platz" : "Plätze"} zum Importieren ausgewählt`
                  }
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowDfbImport(false); setSelectedPitchIds(new Set()); }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Abbrechen
                  </button>
                  <button
                    onClick={handleDfbImport}
                    disabled={selectedPitchIds.size === 0}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Importieren
                    {selectedPitchIds.size > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs bg-amber-500">
                        {selectedPitchIds.size}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {venues.map(venue => (
            <div key={venue.id}>
              {editingVenueId === venue.id ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <input
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                    placeholder="Name"
                    value={venueForm.name}
                    onChange={e => setVenueForm(f => ({ ...f, name: e.target.value }))}
                    autoFocus
                  />
                  <input
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                    placeholder="Adresse"
                    value={venueForm.address}
                    onChange={e => setVenueForm(f => ({ ...f, address: e.target.value }))}
                  />
                  <input
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                    placeholder="Beschreibung (optional)"
                    value={venueForm.description}
                    onChange={e => setVenueForm(f => ({ ...f, description: e.target.value }))}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingVenueId(null)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Abbrechen
                    </button>
                    <button
                      onClick={() => {
                        if (!venueForm.name.trim()) return;
                        setVenues(prev => prev.map(v => v.id === venue.id
                          ? { ...v, name: venueForm.name.trim(), address: venueForm.address.trim(), description: venueForm.description.trim(), updatedAt: new Date().toISOString() }
                          : v
                        ));
                        setEditingVenueId(null);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Speichern
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="p-2 rounded-lg bg-teal-100 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-slate-800 text-sm">{venue.name}</p>
                      {venue.sourceType === "imported" && venue.externalSource === "dfb" ? (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">DFB</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-500">Manuell</span>
                      )}
                    </div>
                    {venue.address && <p className="text-xs text-slate-500 mt-0.5">{venue.address}</p>}
                    {venue.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{venue.description}</p>}
                  </div>
                  <button
                    onClick={() => { setEditingVenueId(venue.id); setVenueForm({ name: venue.name, address: venue.address ?? "", description: venue.description ?? "" }); }}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add new venue form */}
          {editingVenueId === "new" ? (
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 space-y-3">
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                placeholder="Name *"
                value={venueForm.name}
                onChange={e => setVenueForm(f => ({ ...f, name: e.target.value }))}
                autoFocus
              />
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                placeholder="Adresse"
                value={venueForm.address}
                onChange={e => setVenueForm(f => ({ ...f, address: e.target.value }))}
              />
              <input
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                placeholder="Beschreibung (optional)"
                value={venueForm.description}
                onChange={e => setVenueForm(f => ({ ...f, description: e.target.value }))}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setEditingVenueId(null); setVenueForm(EMPTY_VENUE_FORM); }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Abbrechen
                </button>
                <button
                  onClick={() => {
                    if (!venueForm.name.trim()) return;
                    const id = `venue_${Date.now()}`;
                    setVenues(prev => [...prev, {
                      id, clubId: mockClub.id,
                      name: venueForm.name.trim(),
                      address: venueForm.address.trim(),
                      description: venueForm.description.trim(),
                      isActive: true,
                      sourceType: "manual",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }]);
                    setEditingVenueId(null);
                    setVenueForm(EMPTY_VENUE_FORM);
                  }}
                  disabled={!venueForm.name.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[#004941] text-white rounded-lg hover:bg-[#003830] disabled:opacity-50 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Hinzufügen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setEditingVenueId("new"); setVenueForm(EMPTY_VENUE_FORM); }}
              className="w-full flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-teal-300 hover:text-teal-600 transition-colors"
            >
              <Plus className="w-4 h-4" /> Spielstätte hinzufügen
            </button>
          )}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-200">
        <CardHeader
          title="Gefahrenzone"
          subtitle="Irreversible Aktionen"
        />
        <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
          <p className="text-sm text-rose-700 mb-4">
            Die folgenden Aktionen können nicht rückgängig gemacht werden. Bitte mit Vorsicht verwenden.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-rose-300 text-rose-600 hover:bg-rose-50">
              Alle Daten exportieren
            </Button>
            <Button variant="danger" size="sm" disabled>
              Verein löschen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

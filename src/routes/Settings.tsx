import { useState } from "react";
import { Save, Building2, MapPin, Globe, Plus, Edit2, X, Check, Download } from "lucide-react";
import { Card, CardHeader, Button, Input } from "../components/ui";
import { mockClub } from "../data/mockClub";
import { mockOrganization } from "../data/mockOrganization";
import { mockVenues, BVB_DFB_SPIELSTAETTEN_JSON } from "../data/mockFields";
import type { Venue } from "../types/fields";

type VenueForm = { name: string; address: string; description: string };
const EMPTY_VENUE_FORM: VenueForm = { name: "", address: "", description: "" };

export function Settings() {
  const [club, setClub] = useState(mockClub);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null); // null = none, "new" = add form
  const [venueForm, setVenueForm] = useState<VenueForm>(EMPTY_VENUE_FORM);
  const [showDfbImport, setShowDfbImport] = useState(false);
  const [dfbImported, setDfbImported] = useState(false);

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

  const handleDfbImport = () => {
    // In a real app this would call an API; here we just mark as imported since venues are pre-loaded
    setDfbImported(true);
    setShowDfbImport(false);
  };

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
            dfbImported ? (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                <Check className="w-3 h-3" /> DFB importiert
              </span>
            ) : (
              <button
                onClick={() => setShowDfbImport(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Von DFB importieren
              </button>
            )
          }
        />

        {/* DFB Import Panel */}
        {showDfbImport && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
            <div>
              <p className="text-sm font-medium text-amber-800">DFB Spielstätten importieren</p>
              <p className="text-xs text-amber-600 mt-0.5">
                Die folgenden Spielstätten wurden vom DFB für Ihren Verein bereitgestellt.
                Plätze mit gleicher Adresse wurden automatisch gruppiert.
              </p>
            </div>
            <div className="space-y-2">
              {BVB_DFB_SPIELSTAETTEN_JSON.spielstaetten.map((s, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-amber-100">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-700">{s.name}</p>
                    <p className="text-xs text-slate-400">{s.address.street}, {s.address.zipCode} {s.address.city}</p>
                    <p className="text-xs text-amber-600 mt-0.5">{s.pitches.length} Platz/Plätze</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setShowDfbImport(false)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Abbrechen
              </button>
              <button
                onClick={handleDfbImport}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Importieren
              </button>
            </div>
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
                        setVenues(prev => prev.map(v => v.id === venue.id ? { ...v, name: venueForm.name.trim(), address: venueForm.address.trim(), description: venueForm.description.trim(), updatedAt: new Date().toISOString() } : v));
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
                    <p className="font-medium text-slate-800 text-sm">{venue.name}</p>
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
                    setVenues(prev => [...prev, { id, clubId: mockClub.id, name: venueForm.name.trim(), address: venueForm.address.trim(), description: venueForm.description.trim(), isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
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

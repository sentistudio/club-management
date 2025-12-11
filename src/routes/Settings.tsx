import { useState } from "react";
import { Save, Building2, MapPin, Globe } from "lucide-react";
import { Card, CardHeader, Button, Input } from "../components/ui";
import { mockClub } from "../data/mockClub";
import { mockOrganization } from "../data/mockOrganization";

export function Settings() {
  const [club, setClub] = useState(mockClub);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof typeof club, value: string) => {
    setClub(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

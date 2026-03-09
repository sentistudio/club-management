/**
 * FieldFormDrawer – create / edit a field.
 * Follows the same drawer pattern as EventFormDrawer.
 */

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import type { Field, FieldFormData, FieldType, IndoorOutdoor } from "../../types/fields";
import { DEFAULT_FIELD_FORM, FIELD_TYPE_LABELS, FIELD_TYPE_ICONS } from "../../types/fields";
import { fieldHasFutureZoneBookings } from "../../data/mockFields";
import { mockClubEvents } from "../../data/mockClubEvents";

interface FieldFormDrawerProps {
  field?: Field | null;       // null = create mode
  onClose: () => void;
  onSave: (field: Omit<Field, "id" | "createdAt" | "updatedAt" | "clubId">) => void;
}

const FIELD_TYPES: FieldType[] = ["football", "volleyball", "fitness", "tennis", "swimming", "general"];

export function FieldFormDrawer({ field, onClose, onSave }: FieldFormDrawerProps) {
  const isEdit = !!field;
  const [form, setForm] = useState<FieldFormData>(DEFAULT_FIELD_FORM);
  const [divError, setDivError] = useState(false);

  useEffect(() => {
    if (field) {
      setForm({
        name: field.name,
        type: field.type,
        description: field.description ?? "",
        address: field.address ?? "",
        indoorOutdoor: field.indoorOutdoor,
        isActive: field.isActive,
        isDivisibleInto6: field.isDivisibleInto6,
      });
    }
  }, [field]);

  const set = <K extends keyof FieldFormData>(key: K, val: FieldFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleToggleDivisible = (checked: boolean) => {
    if (!checked && isEdit && field) {
      const hasZoneBookings = fieldHasFutureZoneBookings(mockClubEvents, field.id);
      if (hasZoneBookings) {
        setDivError(true);
        return;
      }
    }
    setDivError(false);
    set("isDivisibleInto6", checked);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    // Build zone stubs
    const zones = form.isDivisibleInto6
      ? ([1, 2, 3, 4, 5, 6] as const).map(n => ({
          id: `field_new_z${n}`,
          fieldId: "field_new",
          zoneNumber: n as 1 | 2 | 3 | 4 | 5 | 6,
          name: `Zone ${n}`,
        }))
      : [];

    onSave({
      name: form.name.trim(),
      type: form.type,
      description: form.description,
      address: form.address,
      indoorOutdoor: form.indoorOutdoor,
      isActive: form.isActive,
      isDivisibleInto6: form.isDivisibleInto6,
      sourceType: "manual",
      zones,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? "Feld bearbeiten" : "Neues Feld"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="z.B. Hauptplatz"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
              autoFocus
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Typ</label>
            <div className="grid grid-cols-3 gap-2">
              {FIELD_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => set("type", type)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    form.type === type
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <span className="text-lg">{FIELD_TYPE_ICONS[type]}</span>
                  {FIELD_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Indoor / Outdoor */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Standort</label>
            <div className="flex gap-2">
              {(["outdoor", "indoor"] as IndoorOutdoor[]).map(io => (
                <button
                  key={io}
                  type="button"
                  onClick={() => set("indoorOutdoor", io)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                    form.indoorOutdoor === io
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  {io === "outdoor" ? "🌿 Outdoor" : "🏟️ Halle"}
                </button>
              ))}
            </div>
          </div>

          {/* Divisible into 6 zones */}
          <div className="flex items-start gap-3 bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <input
              id="divisible"
              type="checkbox"
              checked={form.isDivisibleInto6}
              onChange={e => handleToggleDivisible(e.target.checked)}
              className="mt-0.5 accent-teal-600 w-4 h-4"
            />
            <div className="flex-1">
              <label htmlFor="divisible" className="text-sm font-medium text-neutral-800 cursor-pointer">
                In 6 Zonen teilbar
              </label>
              <p className="text-xs text-neutral-500 mt-0.5">
                Erlaubt es, Trainings auf einzelnen Zonen zu buchen und das Feld mehrfach gleichzeitig zu nutzen.
              </p>
              {divError && (
                <p className="text-xs text-red-600 mt-1">
                  Nicht möglich: Dieses Feld hat noch zukünftige Zonen-Buchungen. Bitte erst diese entfernen.
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Beschreibung</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={2}
              placeholder="Optionale Zusatzinfos (Kapazität, Flutlicht, etc.)"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004941] resize-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse / Lage</label>
            <input
              type="text"
              value={form.address}
              onChange={e => set("address", e.target.value)}
              placeholder="z.B. Sportanlage Burkhardsfelden, Platz 1"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-3 border-t border-neutral-200">
            <div>
              <p className="text-sm font-medium text-neutral-700">Aktiv</p>
              <p className="text-xs text-neutral-400">Inaktive Felder können nicht gebucht werden.</p>
            </div>
            <button
              type="button"
              onClick={() => set("isActive", !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                form.isActive ? "bg-teal-500" : "bg-neutral-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  form.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Speichern
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

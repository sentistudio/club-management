/**
 * FieldFormDrawer – create / edit a field.
 * Follows the same drawer pattern as EventFormDrawer.
 */

import { useState, useEffect, useRef } from "react";
import { X, Save, Upload } from "lucide-react";
import type { Field, FieldFormData, FieldType, IndoorOutdoor, WeekdayKey } from "../../types/fields";
import {
  DEFAULT_FIELD_FORM,
  FIELD_TYPE_LABELS,
  WEEKDAY_KEYS,
  DEFAULT_OPENING_HOURS,
  ZONE_COUNT_PRESETS,
  fieldIsDivisible,
} from "../../types/fields";
import { FIELD_TYPE_IMAGES } from "../../data/fieldTypeImages";
import { fieldHasFutureZoneBookings } from "../../data/mockFields";
import { mockVenues } from "../../data/mockFields";
import { mockClubEvents } from "../../data/mockClubEvents";
import { useLanguage } from "../../i18n";

interface FieldFormDrawerProps {
  field?: Field | null;
  onClose: () => void;
  onSave: (field: Omit<Field, "id" | "createdAt" | "updatedAt" | "clubId">) => void;
}

const FIELD_TYPES: FieldType[] = [
  "grass", "artificial", "hard", "indoor_pitch", "small_pitch",
  "hybrid_grass", "ricoten", "beach_soccer", "sand",
  "concrete", "tartan", "pool", "parquet", "other",
];

export function FieldFormDrawer({ field, onClose, onSave }: FieldFormDrawerProps) {
  const { t, lang } = useLanguage();
  const isEdit = !!field;
  const [form, setForm] = useState<FieldFormData>(DEFAULT_FIELD_FORM);
  const [divError, setDivError] = useState(false);

  useEffect(() => {
    if (field) {
      setForm({
        name: field.name,
        type: field.type,
        customTypeName: field.customTypeName ?? "",
        customTypeEmoji: field.customTypeEmoji ?? "",
        customTypeImage: field.customTypeImage ?? "",
        description: field.description ?? "",
        address: field.address ?? "",
        indoorOutdoor: field.indoorOutdoor,
        isActive: field.isActive,
        venueId: field.venueId,
        zoneCount: field.zoneCount,
        openingHours: field.openingHours ?? DEFAULT_OPENING_HOURS,
      });
    } else {
      // Default to first active venue
      const defaultVenue = mockVenues.find(v => v.isActive);
      setForm(prev => ({ ...prev, venueId: defaultVenue?.id ?? "" }));
    }
  }, [field]);

  const set = <K extends keyof FieldFormData>(key: K, val: FieldFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleZoneCountChange = (newCount: number | null) => {
    // If removing zones on an existing field that has zone bookings, block it
    if (newCount === null && isEdit && field && fieldIsDivisible(field)) {
      const hasZoneBookings = fieldHasFutureZoneBookings(mockClubEvents, field.id);
      if (hasZoneBookings) {
        setDivError(true);
        return;
      }
    }
    setDivError(false);
    set("zoneCount", newCount);
  };

  const setOpeningHoursDay = (day: WeekdayKey, key: "open" | "from" | "to", value: boolean | string) => {
    setForm(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [key]: value },
      },
    }));
  };

  const imageInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("customTypeImage", (ev.target?.result as string) ?? "");
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const count = form.zoneCount;
    const zones = count !== null && count > 0
      ? Array.from({ length: count }, (_, i) => ({
          id: `field_new_z${i + 1}`,
          fieldId: "field_new",
          zoneNumber: i + 1,
          name: `Zone ${i + 1}`,
        }))
      : [];

    onSave({
      venueId: form.venueId,
      name: form.name.trim(),
      type: form.type,
      customTypeName: form.type === "other" ? form.customTypeName.trim() : undefined,
      customTypeEmoji: form.type === "other" ? form.customTypeEmoji.trim() : undefined,
      customTypeImage: form.type === "other" ? form.customTypeImage || undefined : undefined,
      description: form.description,
      address: form.address,
      indoorOutdoor: form.indoorOutdoor,
      isActive: form.isActive,
      zoneCount: form.zoneCount,
      openingHours: form.openingHours,
      sourceType: "manual",
      zones,
    });
  };

  const activeVenues = mockVenues.filter(v => v.isActive);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              {isEdit ? t("fields.editField") : t("fields.newField")}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t("fields.venue")} <span className="text-red-500">*</span>
              </label>
              <select
                value={form.venueId}
                onChange={e => set("venueId", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
              >
                <option value="">{t("fields.selectVenue")}</option>
                {activeVenues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t("fields.fieldName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder={t("fields.namePlaceholder")}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                autoFocus
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("fields.fieldType")}</label>
              <div className="grid grid-cols-4 gap-2">
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
                    <img src={FIELD_TYPE_IMAGES[type]} alt={FIELD_TYPE_LABELS[type]} className="w-8 h-8 rounded object-cover" />
                    {FIELD_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
              {form.type === "other" && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-3">
                    {form.customTypeImage ? (
                      <img src={form.customTypeImage} alt="" className="w-12 h-12 rounded-lg object-cover border border-neutral-200 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center flex-shrink-0">
                        <img src={FIELD_TYPE_IMAGES.other} alt="" className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs text-neutral-600 hover:border-neutral-300 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {form.customTypeImage
                          ? (lang === "de" ? "Ändern" : "Change")
                          : (lang === "de" ? "Bild hochladen" : "Upload image")}
                      </button>
                      {form.customTypeImage && (
                        <button type="button" onClick={() => set("customTypeImage", "")} className="text-xs text-red-500 hover:text-red-700">
                          {lang === "de" ? "Entfernen" : "Remove"}
                        </button>
                      )}
                      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={form.customTypeName}
                    onChange={e => set("customTypeName", e.target.value)}
                    placeholder={lang === "de" ? "Bezeichnung (z.B. Beachvolleyball)" : "Label (e.g. Beach volleyball)"}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
                  />
                </div>
              )}
            </div>

            {/* Indoor / Outdoor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("fields.fieldLocation")}</label>
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
                    {io === "outdoor" ? t("fields.outdoorLabel") : t("fields.indoorLabel")}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone count */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                {t("fields.zoneCountLabel")}
              </label>
              <p className="text-xs text-neutral-500 mb-3">{t("fields.divisibleDesc")}</p>
              <div className="flex flex-wrap gap-2">
                {ZONE_COUNT_PRESETS.map(preset => (
                  <button
                    key={String(preset.value)}
                    type="button"
                    onClick={() => handleZoneCountChange(preset.value)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      form.zoneCount === preset.value
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              {divError && (
                <p className="text-xs text-red-600 mt-2">{t("fields.divisibleError")}</p>
              )}
              {form.zoneCount !== null && form.zoneCount > 0 && (
                <p className="text-xs text-teal-600 mt-2">
                  {lang === "de"
                    ? `Das Feld wird in ${form.zoneCount} Zonen unterteilt.`
                    : `Field will be split into ${form.zoneCount} zones.`}
                </p>
              )}
            </div>

            {/* Opening Hours */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t("fields.openingHours")}</label>
              <div className="border border-neutral-200 rounded-[10px] overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {WEEKDAY_KEYS.map((day, idx) => {
                      const dayData = form.openingHours[day];
                      return (
                        <tr
                          key={day}
                          className={`border-b border-neutral-100 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}
                        >
                          <td className="px-3 py-2 w-10">
                            <input
                              type="checkbox"
                              checked={dayData.open}
                              onChange={e => setOpeningHoursDay(day, "open", e.target.checked)}
                              className="accent-teal-600 w-4 h-4"
                            />
                          </td>
                          <td className="px-1 py-2 w-16">
                            <span className={`text-xs font-medium ${dayData.open ? "text-neutral-700" : "text-neutral-400"}`}>
                              {t(`weekdays.${day}`)}
                            </span>
                          </td>
                          {dayData.open ? (
                            <>
                              <td className="px-1 py-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-neutral-500 w-6">{t("fields.from")}</span>
                                  <input
                                    type="time"
                                    value={dayData.from}
                                    onChange={e => setOpeningHoursDay(day, "from", e.target.value)}
                                    className="px-2 py-1 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  />
                                </div>
                              </td>
                              <td className="px-1 py-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-neutral-500 w-5">{t("fields.to")}</span>
                                  <input
                                    type="time"
                                    value={dayData.to}
                                    onChange={e => setOpeningHoursDay(day, "to", e.target.value)}
                                    className="px-2 py-1 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  />
                                </div>
                              </td>
                            </>
                          ) : (
                            <td colSpan={2} className="px-2 py-2 text-xs text-neutral-400 italic">
                              {t("fields.closed")}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("fields.fieldDescription")}</label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={2}
                placeholder={t("fields.fieldDescriptionPlaceholder")}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#004941] resize-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("fields.address")}</label>
              <input
                type="text"
                value={form.address}
                onChange={e => set("address", e.target.value)}
                placeholder={t("fields.addressPlaceholder")}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between py-3 border-t border-neutral-200">
              <div>
                <p className="text-sm font-medium text-neutral-700">{t("fields.active")}</p>
                <p className="text-xs text-neutral-400">{t("fields.activeDesc")}</p>
              </div>
              <button
                type="button"
                onClick={() => set("isActive", !form.isActive)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? "bg-teal-500" : "bg-neutral-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : "translate-x-0"}`}
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
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#004941] text-white rounded-lg hover:bg-[#003830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

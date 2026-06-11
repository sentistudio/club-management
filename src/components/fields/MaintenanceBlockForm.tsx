/**
 * MaintenanceBlockForm – modal to create a maintenance block (Sperre) for a field.
 */

import { useState } from "react";
import { X, Save, Wrench } from "lucide-react";
import type { Field, MaintenanceBlock } from "../../types/fields";
import { useLanguage } from "../../i18n";

interface MaintenanceBlockFormProps {
  field: Field;
  selectedDate: string;
  onClose: () => void;
  onSave: (block: MaintenanceBlock) => void;
}

export function MaintenanceBlockForm({
  field,
  selectedDate,
  onClose,
  onSave,
}: MaintenanceBlockFormProps) {
  const { t } = useLanguage();
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      setError(t("fields.maintenanceTitleRequired"));
      return;
    }
    if (!date) {
      setError(t("fields.maintenanceDateRequired"));
      return;
    }
    if (startTime >= endTime) {
      setError(t("fields.maintenanceTimeError"));
      return;
    }

    const block: MaintenanceBlock = {
      id: `maint_${Date.now()}`,
      fieldId: field.id,
      date,
      startTime,
      endTime,
      title: title.trim(),
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    onSave(block);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-neutral-900">{t("fields.maintenanceFormTitle")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Field name (read-only) */}
          <div>
            <p className="text-xs font-medium text-neutral-500 mb-1">{t("fields.maintenanceFieldLabel")}</p>
            <p className="text-sm font-medium text-neutral-800">{field.name}</p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {t("fields.maintenanceDateLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Time range */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t("fields.from")} <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                {t("fields.to")} <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {t("fields.maintenanceTitleLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(""); }}
              placeholder={t("fields.maintenanceTitlePlaceholder")}
              autoFocus
              className="w-full px-3 py-2 border border-neutral-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              {t("fields.maintenanceNote")}
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder={t("fields.maintenanceNotePlaceholder")}
              className="w-full px-3 py-2 border border-neutral-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors text-sm"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {t("fields.maintenanceSaveButton")}
          </button>
        </div>
      </div>
    </div>
  );
}

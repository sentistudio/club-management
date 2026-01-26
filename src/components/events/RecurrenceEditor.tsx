// Recurrence Editor Component
// ==========================================
// Configure recurring event patterns with preview

import { useMemo } from "react";
import { RefreshCw, Calendar } from "lucide-react";
import { getOccurrencePreview } from "../../utils/eventUtils";
import type { RecurrenceFrequency } from "../../types/events";

interface RecurrenceEditorProps {
  enabled: boolean;
  frequency: RecurrenceFrequency;
  weekdays: number[];
  until: string;
  startDate: string;
  startTime: string;
  endTime: string;
  onEnabledChange: (enabled: boolean) => void;
  onFrequencyChange: (frequency: RecurrenceFrequency) => void;
  onWeekdaysChange: (weekdays: number[]) => void;
  onUntilChange: (until: string) => void;
}

export function RecurrenceEditor({
  enabled,
  frequency,
  weekdays,
  until,
  startDate,
  startTime,
  endTime,
  onEnabledChange,
  onFrequencyChange,
  onWeekdaysChange,
  onUntilChange
}: RecurrenceEditorProps) {
  
  const weekdayLabels = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  const toggleWeekday = (day: number) => {
    if (weekdays.includes(day)) {
      onWeekdaysChange(weekdays.filter(d => d !== day));
    } else {
      onWeekdaysChange([...weekdays, day].sort());
    }
  };

  // Generate preview occurrences
  const occurrencePreview = useMemo(() => {
    if (!enabled || !startDate) return [];
    return getOccurrencePreview(
      { enabled, frequency, weekdays, until },
      startDate,
      startTime,
      endTime,
      5
    );
  }, [enabled, frequency, weekdays, until, startDate, startTime, endTime]);

  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <RefreshCw className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Wiederkehrend</p>
            <p className="text-xs text-slate-500">Termin regelmäßig wiederholen</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={enabled}
            onChange={(e) => onEnabledChange(e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]"></div>
        </label>
      </div>

      {enabled && (
        <>
          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Wiederholung</label>
            <select
              value={frequency}
              onChange={(e) => onFrequencyChange(e.target.value as RecurrenceFrequency)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
            >
              <option value="daily">Täglich</option>
              <option value="weekly">Wöchentlich</option>
              <option value="biweekly">Alle 2 Wochen</option>
              <option value="monthly">Monatlich</option>
            </select>
          </div>

          {/* Weekday Selection (for weekly) */}
          {frequency === "weekly" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">An welchen Tagen?</label>
              <div className="flex gap-2">
                {weekdayLabels.map((label, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleWeekday(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      weekdays.includes(index)
                        ? "bg-[#004941] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {weekdays.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">Bitte mindestens einen Tag auswählen</p>
              )}
            </div>
          )}

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Wiederholen bis</label>
            <input
              type="date"
              value={until}
              onChange={(e) => onUntilChange(e.target.value)}
              min={startDate}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941]"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leer lassen für unbegrenzte Wiederholung
            </p>
          </div>

          {/* Occurrence Preview */}
          {occurrencePreview.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-slate-500" />
                <p className="text-sm font-medium text-slate-700">Nächste Termine</p>
              </div>
              <ul className="space-y-2">
                {occurrencePreview.map((occ, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#C8F2E0] text-[#004941] flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="text-slate-600">{occ.label}</span>
                    <span className="text-slate-400">{occ.startTime} - {occ.endTime}</span>
                  </li>
                ))}
              </ul>
              {until && (
                <p className="text-xs text-slate-500 mt-3">
                  Serie endet am {new Date(until).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

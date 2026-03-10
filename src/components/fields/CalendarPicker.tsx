/**
 * CalendarPicker – popover month/year/day navigator for the Belegung tab.
 * Clicking the month label drills into a year grid for fast jumping.
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../i18n";

interface CalendarPickerProps {
  selectedDate: string; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
  onClose: () => void;
}

const TODAY = new Date().toISOString().split("T")[0];

export function CalendarPicker({ selectedDate, onSelect, onClose }: CalendarPickerProps) {
  const { lang } = useLanguage();

  const initDate = new Date(selectedDate + "T12:00:00");
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth()); // 0-based
  const [view, setView] = useState<"days" | "years">("days");

  // ── Year grid helpers ──────────────────────────────────────────────────────
  const yearBlockStart = Math.floor(viewYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => yearBlockStart + i);
  const thisYear = new Date().getFullYear();

  // ── Day grid helpers ───────────────────────────────────────────────────────
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  // Monday-first offset (JS Sun=0 → shift so Mon=0)
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Build a flat array of day numbers (null = empty cell before 1st)
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    lang === "de" ? "de-DE" : "en-US",
    { month: "long", year: "numeric" }
  );

  const DAY_LABELS =
    lang === "de"
      ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
      : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    onSelect(d.toISOString().split("T")[0]);
    onClose();
  };

  const handleYearSelect = (y: number) => {
    setViewYear(y);
    setView("days");
  };

  return (
    <>
      {/* Transparent backdrop – click to dismiss */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Picker panel */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white border border-neutral-200 rounded-2xl shadow-xl p-3 w-64"
        onClick={e => e.stopPropagation()}
      >
        {view === "days" ? (
          <>
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-2">
              <button onClick={prevMonth} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-neutral-500" />
              </button>
              <button
                onClick={() => setView("years")}
                className="text-sm font-semibold text-neutral-800 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {monthLabel}
              </button>
              <button onClick={nextMonth} className="p-1 hover:bg-neutral-100 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            {/* Day-of-week header */}
            <div className="grid grid-cols-7 mb-0.5">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-[10px] font-medium text-neutral-400 text-center py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={`e${i}`} />;
                const iso = new Date(viewYear, viewMonth, day).toISOString().split("T")[0];
                const isSelected = iso === selectedDate;
                const isToday = iso === TODAY;
                return (
                  <button
                    key={day}
                    onClick={() => handleDay(day)}
                    className={`w-full aspect-square text-xs font-medium rounded-lg transition-colors ${
                      isSelected
                        ? "bg-[#004941] text-white"
                        : isToday
                        ? "bg-[#C8F2E0] text-[#004941] font-bold"
                        : "hover:bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Year grid */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setViewYear(yearBlockStart - 12)}
                className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-neutral-500" />
              </button>
              <span className="text-sm font-semibold text-neutral-700">
                {yearBlockStart} – {yearBlockStart + 11}
              </span>
              <button
                onClick={() => setViewYear(yearBlockStart + 12)}
                className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => handleYearSelect(y)}
                  className={`py-2 text-xs font-medium rounded-lg transition-colors ${
                    y === viewYear
                      ? "bg-[#004941] text-white"
                      : y === thisYear
                      ? "bg-[#C8F2E0] text-[#004941]"
                      : "hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>

            <button
              onClick={() => setView("days")}
              className="mt-2 w-full text-xs text-neutral-400 hover:text-neutral-600 py-1 transition-colors"
            >
              ← {lang === "de" ? "Zurück" : "Back"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

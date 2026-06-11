import { Check, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface RSVPSectionProps {
  required: boolean;
  hoursBefore: number;
  maxParticipants: string;
  onRequiredChange: (required: boolean) => void;
  onHoursBeforeChange: (hours: number) => void;
  onMaxParticipantsChange: (max: string) => void;
}

const PRESETS = [
  { label: "24 Std", hours: 24 },
  { label: "2 Tage", hours: 48 },
  { label: "3 Tage", hours: 72 },
  { label: "1 Woche", hours: 168 },
];

function hoursToDisplay(hours: number): { value: number; unit: "hours" | "days" } {
  if (hours >= 24 && hours % 24 === 0) return { value: hours / 24, unit: "days" };
  return { value: hours, unit: "hours" };
}

export function RSVPSection({
  required,
  hoursBefore,
  maxParticipants,
  onRequiredChange,
  onHoursBeforeChange,
  onMaxParticipantsChange,
}: RSVPSectionProps) {
  const initial = hoursToDisplay(hoursBefore);
  const [customValue, setCustomValue] = useState(initial.value);
  const [unit, setUnit] = useState<"hours" | "days">(initial.unit);

  // Keep local state in sync when parent value changes (e.g. editing an existing event)
  useEffect(() => {
    const display = hoursToDisplay(hoursBefore);
    // Only sync if it doesn't match current local state (avoids loop)
    const currentHours = unit === "days" ? customValue * 24 : customValue;
    if (currentHours !== hoursBefore) {
      setCustomValue(display.value);
      setUnit(display.unit);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoursBefore]);

  const handlePreset = (hours: number) => {
    const display = hoursToDisplay(hours);
    setCustomValue(display.value);
    setUnit(display.unit);
    onHoursBeforeChange(hours);
  };

  const handleCustomChange = (val: number, u: "hours" | "days") => {
    setCustomValue(val);
    setUnit(u);
    onHoursBeforeChange(u === "days" ? val * 24 : val);
  };

  const activePreset = PRESETS.find(p => p.hours === hoursBefore);

  return (
    <div className="space-y-4">
      {/* RSVP Required Toggle */}
      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-[10px]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Check className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Anmeldung erforderlich</p>
            <p className="text-xs text-slate-500">Teilnehmer müssen zu- oder absagen</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => onRequiredChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]"></div>
        </label>
      </div>

      {required && (
        <div className="space-y-4 pl-4 border-l-2 border-[#C8F2E0]">
          {/* Anmeldefrist */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
              <Clock className="w-4 h-4" />
              Anmeldefrist
            </label>

            {/* Preset chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.hours}
                  type="button"
                  onClick={() => handlePreset(preset.hours)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activePreset?.hours === preset.hours
                      ? "bg-[#004941] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customValue}
                min={1}
                onChange={(e) => handleCustomChange(Math.max(1, parseInt(e.target.value) || 1), unit)}
                className="w-24 px-3 py-2 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#004941]"
              />
              <div className="flex rounded-[10px] border border-slate-200 overflow-hidden text-sm">
                <button
                  type="button"
                  onClick={() => handleCustomChange(customValue, "hours")}
                  className={`px-3 py-2 transition-colors ${
                    unit === "hours" ? "bg-[#004941] text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Stunden
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomChange(customValue, "days")}
                  className={`px-3 py-2 transition-colors ${
                    unit === "days" ? "bg-[#004941] text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Tage
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Anmeldeschluss {unit === "days" ? `${customValue} Tag${customValue !== 1 ? "e" : ""}` : `${customValue} Stunde${customValue !== 1 ? "n" : ""}`} vor Terminbeginn
            </p>
          </div>

          {/* Max Participants */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Users className="w-4 h-4" />
              Maximale Teilnehmerzahl
            </label>
            <input
              type="number"
              value={maxParticipants}
              onChange={(e) => onMaxParticipantsChange(e.target.value)}
              placeholder="Unbegrenzt"
              min="1"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#004941]"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leer lassen für unbegrenzte Teilnehmer. Bei Überschreitung wird Warteliste aktiviert.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

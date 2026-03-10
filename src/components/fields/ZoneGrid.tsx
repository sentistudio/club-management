/**
 * ZoneGrid – 2×3 visual grid for 6-zone field display.
 *
 * Layout:
 *  ┌──────┬──────┬──────┐
 *  │  1   │  2   │  3   │
 *  ├──────┼──────┼──────┤
 *  │  4   │  5   │  6   │
 *  └──────┴──────┴──────┘
 *
 * Props:
 *  zones          – all zone objects for this field
 *  selectedZones  – zone ids currently selected (edit mode)
 *  occupiedZones  – zone ids occupied by OTHER events (shown in amber)
 *  ownZones       – zone ids occupied by THIS event (shown in teal, read-only context)
 *  fullField      – if true, highlight all zones uniformly (full-field mode)
 *  readOnly       – disables interaction
 *  onChange       – callback(newSelectedIds)
 */

import type { FieldZone } from "../../types/fields";
import { useLanguage } from "../../i18n";

interface ZoneGridProps {
  zones: FieldZone[];
  selectedZones?: string[];   // controlled selection
  occupiedZones?: { zoneId: string; label: string }[]; // other bookings
  ownZones?: string[];        // this event's booked zones (read-only highlight)
  fullField?: boolean;        // full-field highlight
  readOnly?: boolean;
  onChange?: (selectedIds: string[]) => void;
  compact?: boolean;
}

export function ZoneGrid({
  zones,
  selectedZones = [],
  occupiedZones = [],
  ownZones = [],
  fullField = false,
  readOnly = false,
  onChange,
  compact = false,
}: ZoneGridProps) {
  const { t } = useLanguage();
  const occupiedMap = new Map(occupiedZones.map(o => [o.zoneId, o.label]));

  const toggle = (zoneId: string) => {
    if (readOnly) return;
    const occupied = occupiedMap.has(zoneId);
    if (occupied) return; // cannot select an occupied zone
    const next = selectedZones.includes(zoneId)
      ? selectedZones.filter(id => id !== zoneId)
      : [...selectedZones, zoneId];
    onChange?.(next);
  };

  const row1 = zones.filter(z => z.zoneNumber <= 3).sort((a, b) => a.zoneNumber - b.zoneNumber);
  const row2 = zones.filter(z => z.zoneNumber > 3).sort((a, b) => a.zoneNumber - b.zoneNumber);

  const cellH = compact ? "h-8" : "h-12";

  const getZoneStyle = (zone: FieldZone) => {
    const id = zone.id;
    const isOccupied = occupiedMap.has(id);
    const isOwn = ownZones.includes(id);
    const isSelected = selectedZones.includes(id);
    const isFullField = fullField;

    if (isOccupied) {
      return "bg-amber-100 border-amber-300 text-amber-700 cursor-not-allowed";
    }
    if (isOwn || isFullField) {
      return "bg-teal-100 border-teal-400 text-teal-700";
    }
    if (isSelected) {
      return "bg-teal-500 border-teal-600 text-white";
    }
    if (readOnly) {
      return "bg-neutral-50 border-neutral-200 text-neutral-400";
    }
    return "bg-white border-neutral-300 text-neutral-600 hover:bg-teal-50 hover:border-teal-300 cursor-pointer";
  };

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200">
      {[row1, row2].map((row, rowIdx) => (
        <div key={rowIdx} className={`flex ${rowIdx === 0 ? "border-b border-neutral-200" : ""}`}>
          {row.map((zone, colIdx) => {
            const occupiedBy = occupiedMap.get(zone.id);
            return (
              <div
                key={zone.id}
                onClick={() => toggle(zone.id)}
                title={occupiedBy ? `${t("fields.zoneOccupiedByPrefix")} ${occupiedBy}` : zone.name}
                className={`
                  flex-1 ${cellH} flex flex-col items-center justify-center
                  border-neutral-200 text-xs font-medium transition-colors select-none
                  ${colIdx < row.length - 1 ? "border-r" : ""}
                  ${getZoneStyle(zone)}
                `}
              >
                <span className="font-bold">{zone.zoneNumber}</span>
                {!compact && (
                  <span className="text-[9px] opacity-70 truncate max-w-[90%] text-center">
                    {occupiedBy ? t("fields.zoneOccupied") : zone.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

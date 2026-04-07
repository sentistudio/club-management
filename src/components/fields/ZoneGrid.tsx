/**
 * ZoneGrid – dynamic visual grid for zone display.
 * Supports 2, 4, 6, 8 (or any count) zones.
 *
 * Layout logic:
 *  ≤2 zones → 1 row × N cols
 *  >2 zones → 2 rows, split at midpoint
 *
 * Examples:
 *  2 zones → 1×2:  [1][2]
 *  4 zones → 2×2:  [1][2] / [3][4]
 *  6 zones → 2×3:  [1][2][3] / [4][5][6]
 *  8 zones → 2×4:  [1][2][3][4] / [5][6][7][8]
 */

import type { FieldZone } from "../../types/fields";
import { useLanguage } from "../../i18n";

interface ZoneGridProps {
  zones: FieldZone[];
  selectedZones?: string[];
  occupiedZones?: { zoneId: string; label: string }[];
  ownZones?: string[];
  fullField?: boolean;
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
    if (occupiedMap.has(zoneId)) return;
    const next = selectedZones.includes(zoneId)
      ? selectedZones.filter(id => id !== zoneId)
      : [...selectedZones, zoneId];
    onChange?.(next);
  };

  // Sort zones by zoneNumber
  const sorted = [...zones].sort((a, b) => a.zoneNumber - b.zoneNumber);

  // Split into rows: 1 row if ≤2 zones, else 2 rows
  let rows: FieldZone[][];
  if (sorted.length <= 2) {
    rows = [sorted];
  } else {
    const mid = Math.ceil(sorted.length / 2);
    rows = [sorted.slice(0, mid), sorted.slice(mid)];
  }

  const cellH = compact ? "h-8" : "h-12";

  const getZoneStyle = (zone: FieldZone) => {
    const id = zone.id;
    const isOccupied = occupiedMap.has(id);
    const isOwn = ownZones.includes(id);
    const isSelected = selectedZones.includes(id);

    if (isOccupied) return "bg-amber-100 border-amber-300 text-amber-700 cursor-not-allowed";
    if (isOwn || fullField) return "bg-teal-100 border-teal-400 text-teal-700";
    if (isSelected) return "bg-teal-500 border-teal-600 text-white";
    if (readOnly) return "bg-neutral-50 border-neutral-200 text-neutral-400";
    return "bg-white border-neutral-300 text-neutral-600 hover:bg-teal-50 hover:border-teal-300 cursor-pointer";
  };

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex ${rowIdx < rows.length - 1 ? "border-b border-neutral-200" : ""}`}
        >
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

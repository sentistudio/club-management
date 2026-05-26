import { useSeason } from "../../contexts/SeasonContext";

export function SeasonSelector() {
  const { seasons, currentSeason, setCurrentSeason } = useSeason();

  return (
    <select
      value={currentSeason.id}
      onChange={e => setCurrentSeason(e.target.value)}
      className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white text-neutral-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
    >
      {seasons.map(s => (
        <option key={s.id} value={s.id}>
          {s.label}{s.isActive ? " (aktiv)" : ""}
        </option>
      ))}
    </select>
  );
}

import type { Hero } from "../hooks/useHeroes";
import { useState } from "react";

interface Props {
  heroes: Hero[];
  teamSlots: (Hero | null)[];
  onPlace: (heroId: string, position: number) => void;
}

export default function PositionGrid({ heroes, teamSlots, onPlace }: Props) {
  const [selectedHero, setSelectedHero] = useState<string>("");

  return (
    <div>
      <div className="mb-4">
        <select
          value={selectedHero}
          onChange={e => setSelectedHero(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">-- select hero to place --</option>
          {heroes.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 40 }).map((_, i) => {
          const h = teamSlots[i];
          return (
            <div
              key={i}
              onClick={() => selectedHero && onPlace(selectedHero, i)}
              className={`h-12 flex items-center justify-center border rounded cursor-pointer
                ${h ? "bg-moss text-white" : "bg-earth/30"}
              `}
            >
              {h ? h.name[0] : i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

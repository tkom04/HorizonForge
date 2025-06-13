import { useState } from "react";
import type { Hero } from "../hooks/useHeroes";
import type { GearPiece } from "../types/gear";

interface Props {
  heroes: Hero[];
  gearMap: Record<string, GearPiece[]>;
  onShare: (payload: string) => void;
}

export default function TeamBuilder({ heroes, gearMap, onShare }: Props) {
  const [team, setTeam] = useState<string[]>(["", "", "", "", ""]);

  const selectHero = (idx: number, id: string) => {
    const next = [...team];
    next[idx] = id;
    setTeam(next);
  };

  const generatePayload = () => {
    return team.map((id, i) => {
      if (!id) return `Slot ${i+1}: (empty)`;
      const hero = heroes.find(h => h.id === id)!;
      const gear = gearMap[id] || [];
      const gearList = gear.map(g => `${g.slot}(${g.rarity})`).join(", ");
      return `Slot ${i+1}: **${hero.name}** [${gearList}]`;
    }).join("\n");
  };

  return (
    <div className="p-4 bg-moss/20 border border-bark rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-3 text-moss">Team Builder</h2>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {team.map((sel, i) => (
          <div key={i} className="border border-bark p-2 rounded-lg bg-earth/30">
            <div className="text-sm font-medium mb-1">Slot {i+1}</div>
            {sel ? (
              <div className="text-sm mb-1">
                {heroes.find(h => h.id === sel)?.name}
              </div>
            ) : (
              <div className="text-xs italic text-gray-600 mb-1">(empty)</div>
            )}
            <select
              value={sel}
              onChange={e => selectHero(i, e.target.value)}
              className="w-full text-xs border border-gray-300 rounded px-1 py-0.5"
            >
              <option value="">-- choose --</option>
              {heroes.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => onShare(generatePayload())}
        className="bg-grass text-bark px-4 py-2 rounded-lg hover:bg-moss transition"
      >
        Copy Build
      </button>
    </div>
  );
}

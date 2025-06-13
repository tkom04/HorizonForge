import { useState } from "react";
import type { GearPiece } from "../types/gear";
import { GEAR_LIBRARY } from "../types/gear";

interface Props {
  heroIds: string[];
  onAdd: (heroId: string, piece: GearPiece) => void;
}

export default function EquipmentPanel({ heroIds, onAdd }: Props) {
  const [heroId, setHeroId] = useState(heroIds[0] || "");
  const [template, setTemplate] = useState<GearPiece | null>(null);
  const [stats, setStats] = useState({
    atk: 0,
    crit: 0,
    atkspd: 0,
    critDmg: 0,
  });

  const handleAdd = () => {
    if (!template) return;
    onAdd(heroId, { ...template, ...stats });
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-brand">
        Add Equipment
      </h2>

      <div className="space-y-3">
        {/* Hero selector */}
        <select
          value={heroId}
          onChange={(e) => setHeroId(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          {heroIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>

        {/* Piece selector */}
        <select
          value={template?.id || ""}
          onChange={(e) => {
            const found =
              GEAR_LIBRARY.find((g) => g.id === e.target.value) || null;
            setTemplate(found);
            setStats({ atk: 0, crit: 0, atkspd: 0, critDmg: 0 });
          }}
          className="w-full border border-gray-300 rounded px-2 py-1"
        >
          <option value="">-- Select piece --</option>
          {GEAR_LIBRARY.map((g) => (
            <option key={g.id} value={g.id}>
              {`${g.slot} (${g.rarity})`}
            </option>
          ))}
        </select>

        {/* Stat inputs */}
        {template && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium">+atk</span>
              <input
                type="number"
                value={stats.atk}
                onChange={(e) =>
                  setStats((s) => ({ ...s, atk: +e.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">+crit</span>
              <input
                type="number"
                step="0.01"
                value={stats.crit}
                onChange={(e) =>
                  setStats((s) => ({ ...s, crit: +e.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">+AS</span>
              <input
                type="number"
                step="0.01"
                value={stats.atkspd}
                onChange={(e) =>
                  setStats((s) => ({ ...s, atkspd: +e.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">+CritDmg</span>
              <input
                type="number"
                step="0.01"
                value={stats.critDmg}
                onChange={(e) =>
                  setStats((s) => ({ ...s, critDmg: +e.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
          </div>
        )}

        <button
          onClick={handleAdd}
          className="w-full mt-4 bg-accent text-white rounded-lg py-2 hover:bg-blue-600 transition"
        >
          Add Piece
        </button>
      </div>
    </div>
  );
}

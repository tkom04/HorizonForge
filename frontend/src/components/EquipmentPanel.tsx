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
  const [stats, setStats] = useState({ atk: 0, crit: 0, atkspd: 0, critDmg: 0 });

  const handleAdd = () => {
    if (!template) return;
    onAdd(heroId, { ...template, ...stats });
  };

  return (
    <div style={{ marginTop: 24, padding: 16, border: "1px solid #888", borderRadius: 6 }}>
      <h2 style={{ marginBottom: 8 }}>Add equipment</h2>

      {/* Hero selector */}
      <select value={heroId} onChange={e => setHeroId(e.target.value)}>
        {heroIds.map(id => <option key={id} value={id}>{id}</option>)}
      </select>

      {/* Piece selector */}
      <select
        value={template?.id || ""}
        onChange={e => {
          const found = GEAR_LIBRARY.find(g => g.id === e.target.value) || null;
          setTemplate(found);
          setStats({ atk: 0, crit: 0, atkspd: 0, critDmg: 0 });
        }}
        style={{ marginLeft: 8 }}
      >
        <option value="">-- Select piece --</option>
        {GEAR_LIBRARY.map(g => (
          <option key={g.id} value={g.id}>
            {`${g.slot} (${g.rarity})`}
          </option>
        ))}
      </select>

      {/* Stat inputs */}
      {template && (
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <label>
            +atk{" "}
            <input
              type="number" value={stats.atk}
              onChange={e => setStats(s => ({ ...s, atk: +e.target.value }))}
              style={{ width: 56 }}
            />
          </label>
          <label>
            +crit{" "}
            <input
              type="number" step="0.01" value={stats.crit}
              onChange={e => setStats(s => ({ ...s, crit: +e.target.value }))}
              style={{ width: 56 }}
            />
          </label>
          <label>
            +AS{" "}
            <input
              type="number" step="0.01" value={stats.atkspd}
              onChange={e => setStats(s => ({ ...s, atkspd: +e.target.value }))}
              style={{ width: 56 }}
            />
          </label>
          <label>
            +CritDmg{" "}
            <input
              type="number" step="0.01" value={stats.critDmg}
              onChange={e => setStats(s => ({ ...s, critDmg: +e.target.value }))}
              style={{ width: 56 }}
            />
          </label>
        </div>
      )}

      <button onClick={handleAdd} style={{ marginTop: 8 }}>
        Add piece
      </button>
    </div>
  );
}

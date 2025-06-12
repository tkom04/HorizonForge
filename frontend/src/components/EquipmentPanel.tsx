import { useState } from "react";
import { GearPiece } from "../types/gear";

interface Props {
  heroIds: string[];
  onAdd: (heroId: string, piece: GearPiece) => void;
}

export default function EquipmentPanel({ heroIds, onAdd }: Props) {
  const [heroId, setHeroId] = useState(heroIds[0] || "");
  const [slot, setSlot] = useState("sword");
  const [rarity, setRarity] = useState("Legendary");
  const [atk, setAtk] = useState(0);
  const [crit, setCrit] = useState(0);
  const [atkspd, setAtkspd] = useState(0);
  const [critDmg, setCritDmg] = useState(0);

  const submit = () => {
    onAdd(heroId, {
      id: crypto.randomUUID(),
      slot,
      rarity,
      atk,
      crit,
      atkspd,
      critDmg,
    });
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        border: "1px solid #888",
        borderRadius: 6,
      }}
    >
      <h2 style={{ marginBottom: ".5rem" }}>Add equipment</h2>

      {/* hero picker */}
      <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
        {heroIds.map((id) => (
          <option key={id}>{id}</option>
        ))}
      </select>

      {/* slot + rarity */}
      <select value={slot} onChange={(e) => setSlot(e.target.value)}>
        {[
          "sword",
          "bow",
          "staff",
          "helmet",
          "chestplate",
          "robe",
          "gloves",
          "boots",
          "ring",
        ].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select value={rarity} onChange={(e) => setRarity(e.target.value)}>
        {["Legendary", "Epic", "Rare", "Uncommon", "Common"].map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      {/* stat inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
        <input
          type="number"
          value={atk}
          onChange={(e) => setAtk(Number(e.target.value))}
          placeholder="+ATK"
        />
        <input
          type="number"
          value={crit}
          step="0.01"
          onChange={(e) => setCrit(Number(e.target.value))}
          placeholder="+Crit"
        />
        <input
          type="number"
          value={atkspd}
          step="0.01"
          onChange={(e) => setAtkspd(Number(e.target.value))}
          placeholder="+AS"
        />
        <input
          type="number"
          value={critDmg}
          step="0.01"
          onChange={(e) => setCritDmg(Number(e.target.value))}
          placeholder="+CritDmg"
        />
      </div>

      <button onClick={submit} style={{ marginTop: ".5rem" }}>
        Add piece
      </button>
    </div>
  );
}

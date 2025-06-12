import { useState } from "react";
import type { GearPiece, GearSlot } from "../types/gear";
import { GEAR_LIBRARY } from "../types/gear";

interface Props {
  heroIds: string[];
  onAdd: (heroId: string, piece: GearPiece) => void;
}

export default function EquipmentPanel({ heroIds, onAdd }: Props) {
  const [heroId, setHeroId] = useState(heroIds[0] || "");
  const [selectedTemplate, setSelectedTemplate] = useState<GearPiece | null>(null);
  const [statInputs, setStatInputs] = useState<Partial<GearPiece>>({});

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tpl = GEAR_LIBRARY.find((g) => g.id === e.target.value) || null;
    setSelectedTemplate(tpl);
    if (tpl) {
      setStatInputs({ ...tpl });
    }
  };

  const handleStatChange = (field: keyof GearPiece) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setStatInputs((prev) => ({ ...prev, [field]: val }));
  };

  const submit = () => {
    if (!selectedTemplate) return;
    onAdd(heroId, {
      ...selectedTemplate,
      ...statInputs,
    } as GearPiece);
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #888", borderRadius: 6 }}>
      <h2 style={{ marginBottom: ".5rem" }}>Add equipment</h2>

      <select value={heroId} onChange={(e) => setHeroId(e.target.value)}>
        {heroIds.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>

      <select value={selectedTemplate?.id || ""} onChange={handleTemplateChange} style={{ marginLeft: "1rem" }}>
        <option value="" disabled>
          -- Select piece --
        </option>
        {GEAR_LIBRARY.map((g) => (
          <option key={g.id} value={g.id}>
            {`${g.slot} (${g.rarity})`}
          </option>
        ))}
      </select>

      {selectedTemplate && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: "1rem" }}>
          {(["atk", "crit", "atkspd", "critDmg", "hp", "armor", "resist", "mvspd"] as (keyof GearPiece)[])
            .filter((field) => field in selectedTemplate)
            .map((field) => (
              <div key={field} style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", textTransform: "capitalize" }}>{field}</label>
                <input
                  type="number"
                  value={(statInputs[field] as number) || 0}
                  onChange={handleStatChange(field)}
                />
              </div>
            ))}
        </div>
      )}

      <button onClick={submit} style={{ marginTop: "1rem" }}>
        Add piece
      </button>
    </div>
  );
}

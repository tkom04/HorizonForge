import { useEffect, useState } from "react";
import init, { damage_after_reduction } from "engine";
import { useHeroes } from "./hooks/useHeroes";
import { useGear } from "./hooks/useGear";
import EquipmentPanel from "./components/EquipmentPanel";

export default function App() {
  const heroes = useHeroes();
  // Destructure both addPiece and removePiece from the gear hook
  const { gearMap, addPiece, removePiece } = useGear();

  const [wasmReady, setWasmReady] = useState(false);
  const [armor, setArmor] = useState(10_000);
  const [penPct, setPenPct] = useState(0);

  useEffect(() => {
    init().then(() => setWasmReady(true));
  }, []);

  if (!wasmReady) {
    return <p style={{ padding: "1rem" }}>Loading engine...</p>;
  }

  const effectiveArmor = Math.max(0, armor * (1 - penPct / 100));
  const drMul = damage_after_reduction(effectiveArmor);

  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>
        HorizonForge MVP
      </h1>

      {/* Sliders */}
      <label style={{ display: "block", marginBottom: ".5rem" }}>
        Enemy armour: <strong>{armor.toLocaleString()}</strong>
      </label>
      <input
        type="range"
        min={0}
        max={2_500_000}
        step={50_000}
        value={armor}
        onChange={(e) => setArmor(Number(e.target.value))}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label style={{ display: "block", marginBottom: ".5rem" }}>
        Penetration: <strong>{penPct}%</strong>
      </label>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={penPct}
        onChange={(e) => setPenPct(Number(e.target.value))}
        style={{ width: "100%", marginBottom: "1.5rem" }}
      />

      {/* Hero Table */}
      <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Hero</th>
            <th>ATK</th>
            <th>Auto DPS<br/>(vs {effectiveArmor.toLocaleString()})</th>
            <th>Burst<br/>(vs {effectiveArmor.toLocaleString()})</th>
            <th>Total DPS / 60s</th>
            <th>Gear</th>
          </tr>
        </thead>
        <tbody>
          {heroes.map((h) => {
            const { atk, spd } = h.base;
            const { chance: critC, damage: critD } = h.crit;

            // Gather equipped pieces
            const pieces = gearMap[h.id] || [];
            // Sum gear bonuses
            const bonusAtk = pieces.reduce((sum, p) => sum + (p.atk || 0), 0);
            const bonusCrit = pieces.reduce((sum, p) => sum + (p.crit || 0), 0);
            const bonusAS = pieces.reduce((sum, p) => sum + (p.atkspd || 0), 0);
            const bonusCritD = pieces.reduce((sum, p) => sum + (p.critDmg || 0), 0);

            const totalAtk = atk + bonusAtk;
            const totalCritC = Math.min(1, critC + bonusCrit);
            const totalCritD = critD + bonusCritD;
            const totalAS = spd + bonusAS;

            const auto =
              totalAS * ((1 - totalCritC) * totalAtk + totalCritC * totalAtk * totalCritD) *
              drMul;
            const s = h.skills[0];
            const raw = totalAtk * s.mult * s.hits;
            const burst =
              (s.canCrit
                ? (1 - totalCritC) * raw + totalCritC * raw * totalCritD
                : raw) * drMul;
            const total = auto * 60 + burst;

            return (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{totalAtk}</td>
                <td>{auto.toFixed(0)}</td>
                <td>{burst.toFixed(0)}</td>
                <td>{total.toFixed(0)}</td>
                <td>
                  {pieces.map((p) => (
                    <div key={p.id} style={{ fontSize: "0.8rem" }}>
                      {p.slot} ({p.rarity})
                      <button onClick={() => removePiece(h.id, p.id)} style={{ marginLeft: "4px" }}>
                        ×
                      </button>
                    </div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Equipment Panel */}
      <EquipmentPanel heroIds={heroes.map((h) => h.id)} onAdd={addPiece} />
    </main>
  );
}

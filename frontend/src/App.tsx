import { useEffect, useState } from "react";
import init, { damage_after_reduction } from "engine";
import { useHeroes } from "./hooks/useHeroes";
import { useGear } from "./hooks/useGear";          // NEW
import EquipmentPanel from "./components/EquipmentPanel"; // NEW

export default function App() {
  const heroes = useHeroes();
  const [wasmReady, setWasmReady] = useState(false);

  // sliders
  const [armor, setArmor] = useState(10_000);
  const [penPct, setPenPct] = useState(0);       // 0 – 100 %

  useEffect(() => {
    init().then(() => setWasmReady(true));
  }, []);

  if (!wasmReady) return <p style={{ padding: "1rem" }}>Loading engine …</p>;

  const effectiveArmor = Math.max(
    0,
    armor * (1 - penPct / 100)               // apply penetration %
  );

  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem" }}>
        HorizonForge MVP
      </h1>

      {/* Armour slider */}
      <label style={{ display: "block", marginBottom: ".5rem" }}>
        Enemy armour: <strong>{armor.toLocaleString()}</strong>
      </label>
      <input
        type="range"
        min={0}
        max={2_500_000}        // your new max
        step={10_000}
        value={armor}
        onChange={(e) => setArmor(Number(e.target.value))}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      {/* Penetration slider */}
      <label style={{ display: "block", marginBottom: ".5rem" }}>
        Armour / Resist penetration: <strong>{penPct}%</strong>
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

      <table border={1} cellPadding={6} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Hero</th>
            <th>ATK</th>
            <th>Auto DPS<br />(vs {effectiveArmor.toLocaleString()})</th>
            <th>Burst<br />(vs {effectiveArmor.toLocaleString()})</th>
            <th>Total DPS / 60 s</th>
          </tr>
        </thead>
        <tbody>
          {heroes.map((h) => {
            const { atk, spd } = h.base;
            const { chance: critC, damage: critD } = h.crit;

            const drMul = damage_after_reduction(effectiveArmor);

            const auto =
              spd *
              ((1 - critC) * atk + critC * atk * critD) *
              drMul;

            const s = h.skills[0];
            const raw = atk * s.mult * s.hits;
            const burst =
              (s.canCrit
                ? (1 - critC) * raw + critC * raw * critD
                : raw) * drMul;

            const total = auto * 60 + burst;

            return (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{atk}</td>
                <td>{auto.toFixed(0)}</td>
                <td>{burst.toFixed(0)}</td>
                <td>{total.toFixed(0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
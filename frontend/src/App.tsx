import { useEffect, useState } from "react";
import init, { damage_after_reduction } from "engine";
import { useHeroes } from "./hooks/useHeroes";

export default function App() {
  const heroes = useHeroes();
  const [wasmLoaded, setWasmLoaded] = useState(false);

  // initialise the WASM module once
  useEffect(() => {
    init().then(() => setWasmLoaded(true));
  }, []);

  if (!wasmLoaded) {
    return <p style={{ padding: "1rem" }}>Loading damage engine …</p>;
  }

  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700 }}>HorizonForge MVP</h1>

      <table border={1} cellPadding={6} style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Hero</th>
            <th>ATK</th>
            <th>Auto DPS<br />(vs 10 k Armor)</th>
            <th>Ability Burst<br />(vs 10 k Armor)</th>
          </tr>
        </thead>
        <tbody>
          {heroes.map((h) => {
            const { atk, spd } = h.base;
            const { chance: critC, damage: critD } = h.crit;

            // auto-attack DPS
            const auto =
              spd *
              ((1 - critC) * atk + critC * atk * critD) *
              damage_after_reduction(10_000);

            // first skill burst (single cast placeholder)
            const s = h.skills[0];
            const raw = atk * s.mult * s.hits;
            const burst =
              (s.canCrit
                ? (1 - critC) * raw + critC * raw * critD
                : raw) * damage_after_reduction(10_000);

            return (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{atk}</td>
                <td>{auto.toFixed(0)}</td>
                <td>{burst.toFixed(0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
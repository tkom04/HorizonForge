import { useEffect, useState } from "react";
import init, { damage_after_reduction } from "engine";
import { useHeroes } from "./hooks/useHeroes";
import { useGear } from "./hooks/useGear";
import type { GearPiece } from "./types/gear";
import EquipmentPanel from "./components/EquipmentPanel";

export default function App() {
  const heroes = useHeroes();
  const { gearMap, addPiece } = useGear();

  const [wasmReady, setWasmReady] = useState(false);
  const [armor, setArmor]   = useState(10000);
  const [penPct, setPenPct] = useState(0);

  useEffect(() => { init().then(() => setWasmReady(true)); }, []);
  // debug
  useEffect(() => { console.log("GEAR MAP:", gearMap); }, [gearMap]);

  if (!wasmReady) return <p style={{ padding: "1rem" }}>Loading engine…</p>;

  const effectiveArmor = Math.max(0, armor * (1 - penPct / 100));

  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>HorizonForge MVP</h1>

      {/* Armour & Penetration sliders */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ marginRight: 16 }}>
          Armour: <strong>{armor.toLocaleString()}</strong>
        </label>
        <input type="range" min={0} max={2500000} step={10000}
               value={armor} onChange={e => setArmor(+e.target.value)} />
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ marginRight: 16 }}>
          Pen.: <strong>{penPct}%</strong>
        </label>
        <input type="range" min={0} max={100} step={1}
               value={penPct} onChange={e => setPenPct(+e.target.value)} />
      </div>

      {/* DPS table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Hero","ATK",
              `Auto DPS (vs ${effectiveArmor.toLocaleString()})`,
              `Burst (vs ${effectiveArmor.toLocaleString()})`,
              "Total/60s","Gear"
            ].map(h => (
              <th key={h} style={{ border:"1px solid #444", padding:6 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heroes.map(h => {
            const { atk, spd } = h.base;
            const { chance, damage } = h.crit;
            const pieces: GearPiece[] = gearMap[h.id] || [];

            // aggregate gear bonuses
            const gAtk    = pieces.reduce((s,p) => s + p.atk, 0);
            const gCrit   = pieces.reduce((s,p) => s + p.crit, 0);
            const gAS     = pieces.reduce((s,p) => s + p.atkspd, 0);
            const gCritDg = pieces.reduce((s,p) => s + p.critDmg, 0);

            const totalAtk     = atk + gAtk;
            const totalCrit    = Math.min(1, chance + gCrit);
            const totalCritDmg = damage + gCritDg;
            const totalSpd     = spd + gAS;

            const dr           = damage_after_reduction(effectiveArmor);
            const autoDPS      = totalSpd *
              ((1 - totalCrit) * totalAtk + totalCrit * totalAtk * totalCritDmg) * dr;
            const skill        = h.skills[0];
            const rawSkill     = totalAtk * skill.mult * skill.hits;
            const burstDPS     = (skill.canCrit
              ? (1 - totalCrit) * rawSkill + totalCrit * rawSkill * totalCritDmg
              : rawSkill) * dr;
            const totalDPS     = autoDPS * 60 + burstDPS;

            return (
              <tr key={h.id}>
                {[h.name, totalAtk, autoDPS.toFixed(0),
                  burstDPS.toFixed(0), totalDPS.toFixed(0),
                  null
                ].map((c, i) => (
                  <td key={i} style={{ border:"1px solid #444", padding:6 }}>
                    {c}
                  </td>
                ))}
                <td style={{ border:"1px solid #444", padding:6 }}>
                  {pieces.map(p => (
                    <div key={p.id}>{p.slot} ({p.rarity})</div>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <EquipmentPanel heroIds={heroes.map(h => h.id)} onAdd={addPiece} />
    </main>
  );
}

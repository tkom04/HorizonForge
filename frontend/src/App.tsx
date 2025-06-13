import { useEffect, useState } from "react";
import init, { damage_after_reduction } from "engine";
import { useHeroes } from "./hooks/useHeroes";
import { useGear } from "./hooks/useGear";
import type { Hero } from "./hooks/useHeroes";
import type { GearPiece } from "./types/gear";
import EquipmentPanel from "./components/EquipmentPanel";
import TeamBuilder from "./components/TeamBuilder";
import PositionGrid from "./components/PositionGrid";
import TeamLayout from "./components/TeamLayout";
import TeamCard from "./components/TeamCard";


export default function App() {
  const heroes = useHeroes();
  const { gearMap, addPiece } = useGear();
  const [wasmReady, setWasmReady] = useState(false);
  const [armor, setArmor] = useState(10000);
  const [penPct, setPenPct] = useState(0);
  const [showBuilder, setShowBuilder] = useState(true);
  const [positions, setPositions] = useState<(Hero | null)[]>(Array(40).fill(null));
  const [selectedTeam, setSelectedTeam] = useState<string[]>(["", "", "", "", ""]);


  useEffect(() => {
    init().then(() => setWasmReady(true));
  }, []);

  if (!wasmReady) return <p className="p-4">Loading engine…</p>;

  const effectiveArmor = armor * (1 - penPct / 100);
  const headers = [
    "Hero",
    "ATK",
    `Auto DPS (vs ${effectiveArmor.toLocaleString()})`,
    `Burst (vs ${effectiveArmor.toLocaleString()})`,
    "Total/60s",
    "Gear",
  ];

  const handlePlace = (heroId: string, pos: number) => {
    const hero = heroes.find(h => h.id === heroId) || null;
    const next = [...positions];
    next[pos] = hero;
    setPositions(next);
  };

  return (
    <main className="p-4 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">HorizonForge MVP</h1>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="bg-moss text-white px-3 py-1 rounded hover:bg-grass transition"
        >
          {showBuilder ? "Hide" : "Show"} Hero Builder
        </button>
      </div>

      {showBuilder && (
        <>
          <div className="mb-4 flex items-center space-x-4">
            <label className="font-medium">Enemy armour:</label>
            <input 
              type="range" min={0} max={2500000} step={10000}
              value={armor} onChange={e => setArmor(+e.target.value)}
              className="flex-1"
            />
            <span className="w-20 text-right">{armor.toLocaleString()}</span>
          </div>

          <div className="mb-6 flex items-center space-x-4">
            <label className="font-medium">Armour pen.:</label>
            <input 
              type="range" min={0} max={100} step={1}
              value={penPct} onChange={e => setPenPct(+e.target.value)}
              className="flex-1"
            />
            <span className="w-12 text-right">{penPct}%</span>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full table-auto border border-gray-300 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map(h => (
                    <th key={h} className="border px-4 py-2 text-left text-sm font-medium text-gray-700">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heroes.map(h => {
                  const { atk, spd } = h.base;
                  const { chance, damage } = h.crit;
                  const pieces: GearPiece[] = gearMap[h.id] || [];
                  const gAtk = pieces.reduce((s,p) => s + p.atk, 0);
                  const gCrit = pieces.reduce((s,p) => s + p.crit, 0);
                  const gAS = pieces.reduce((s,p) => s + p.atkspd, 0);
                  const gCritD = pieces.reduce((s,p) => s + p.critDmg, 0);

                  const totalAtk = atk + gAtk;
                  const totalCrit = Math.min(1, chance + gCrit);
                  const totalCritDmg = damage + gCritD;
                  const totalSpd = spd + gAS;

                  const dr = damage_after_reduction(effectiveArmor);
                  const autoDPS =
                    totalSpd *
                    ((1 - totalCrit) * totalAtk + totalCrit * totalAtk * totalCritDmg) *
                    dr;
                  const skill = h.skills[0];
                  const rawSkill = totalAtk * skill.mult * skill.hits;
                  const burstDPS = (skill.canCrit
                    ? (1 - totalCrit) * rawSkill + totalCrit * rawSkill * totalCritDmg
                    : rawSkill) *
                    dr;
                  const totalDPS = autoDPS * 60 + burstDPS;

                  return (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{h.name}</td>
                      <td className="border px-4 py-2">{totalAtk}</td>
                      <td className="border px-4 py-2">{autoDPS.toFixed(0)}</td>
                      <td className="border px-4 py-2">{burstDPS.toFixed(0)}</td>
                      <td className="border px-4 py-2">{totalDPS.toFixed(0)}</td>
                      <td className="border px-4 py-2 space-y-1">
                        {pieces.map(p => (
                          <div key={p.id} className="inline-block bg-gray-200 rounded px-2 py-1 text-xs">
                            {p.slot}
                          </div>
                        ))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <EquipmentPanel heroIds={heroes.map(h => h.id)} onAdd={addPiece} />
        </>
      )}

      <TeamBuilder
        heroes={heroes}
        gearMap={gearMap}
        onShare={msg => {
          navigator.clipboard.writeText(msg);
          alert("Build copied to clipboard!");
        }}
      />

<PositionGrid heroes={heroes} teamSlots={positions} onPlace={handlePlace} />

{/* Interactive Team Picker and Display */}
<div className="mt-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Team</h2>

  <div className="grid grid-cols-5 gap-2 mb-4">
    {selectedTeam.map((selectedId, idx) => (
      <div key={idx} className="flex flex-col">
        <select
          className="border p-2 rounded mb-2"
          value={selectedId}
          onChange={(e) => {
            const newTeam = [...selectedTeam];
            newTeam[idx] = e.target.value;
            setSelectedTeam(newTeam);
          }}
        >
          <option value="">Select Hero</option>
          {heroes.map((hero) => (
            <option key={hero.id} value={hero.id}>
              {hero.name}
            </option>
          ))}
        </select>
        
        {selectedId && (
          <TeamCard
            hero={heroes.find((h) => h.id === selectedId)!}
            gear={gearMap[selectedId] || []}
          />
        )}
      </div>
    ))}
  </div>
</div>

</main>
  );
}

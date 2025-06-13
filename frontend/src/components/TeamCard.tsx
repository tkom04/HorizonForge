import type { Hero } from "../hooks/useHeroes";
import type { GearPiece } from "../types/gear";

interface Props {
  hero: Hero;
  gear: GearPiece[];
}

export default function TeamCard({ hero, gear }: Props) {
  return (
    <div className="border border-gray-700 bg-gray-800 rounded-lg p-2 text-center shadow-md">
      <div className="font-bold text-sm text-orange-500">{hero.name.toUpperCase()}</div>
      <div className="text-xs text-gray-300">Level {hero.base.level || "??"}</div>
      <div className="flex justify-center gap-1 mt-1">
        {gear.map((g, i) => (
          <img
            key={i}
            src={`/icons/${g.slot}.png`}
            className="w-5 h-5"
            alt={g.slot}
          />
        ))}
      </div>
    </div>
  );
}

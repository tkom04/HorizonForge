import type { Hero } from "../hooks/useHeroes";
import type { GearPiece } from "../types/gear";
import type { TeamCard } from "./TeamCard";

interface Props {
  team: { hero: Hero; gear: GearPiece[] }[];
}

export default function TeamLayout({ team }: Props) {
  return (
    <div className="flex justify-center items-center gap-3 bg-gray-900 p-3 rounded-lg">
      {team.map((t) => (
        <TeamCard key={t.hero.id} hero={t.hero} gear={t.gear} />
      ))}
    </div>
  );
}

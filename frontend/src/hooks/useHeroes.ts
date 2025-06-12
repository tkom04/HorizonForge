import { useEffect, useState } from "react";

export interface Hero {
  id: string;
  name: string;
  base: { atk: number; hp: number; def: number; spd: number };
  crit: { chance: number; damage: number };
  skills: {
    id: string;
    hits: number;
    mult: number;
    type: string;
    canCrit: boolean;
  }[];
}

export function useHeroes() {
  const [heroes, setHeroes] = useState<Hero[]>([]);

  useEffect(() => {
    // Grab every JSON file in frontend/data/1.0.0
    // Leading “/” → path is resolved from the Vite project root (frontend/)
    const files = import.meta.glob<Promise<Hero>>(
      "/data/1.0.0/*.json"
    );

    Promise.all(Object.values(files).map((load) => load())).then(setHeroes);
  }, []);

  return heroes;
}
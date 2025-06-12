import { useState } from "react";
import { GearPiece } from "../types/gear";

// heroId → GearPiece[]
export function useGear() {
  const [gearMap, setGearMap] = useState<Record<string, GearPiece[]>>({});

  const addPiece = (heroId: string, piece: GearPiece) =>
    setGearMap((m) => ({
      ...m,
      [heroId]: [...(m[heroId] || []), piece],
    }));

  const removePiece = (heroId: string, pieceId: string) =>
    setGearMap((m) => ({
      ...m,
      [heroId]: (m[heroId] || []).filter((p) => p.id !== pieceId),
    }));

  return { gearMap, addPiece, removePiece };
}

import { useState } from "react";
import type { GearPiece } from "../types/gear";

export function useGear() {
  const [gearMap, setGearMap] = useState<Record<string, GearPiece[]>>({});

  const addPiece = (heroId: string, piece: GearPiece) => {
    setGearMap((prev) => {
      const existing = prev[heroId] || [];
      return { ...prev, [heroId]: [...existing, piece] };
    });
  };

  const removePiece = (heroId: string, pieceId: string) => {
    setGearMap((prev) => {
      const existing = prev[heroId] || [];
      return { ...prev, [heroId]: existing.filter((p) => p.id !== pieceId) };
    });
  };

  return { gearMap, addPiece, removePiece };
}

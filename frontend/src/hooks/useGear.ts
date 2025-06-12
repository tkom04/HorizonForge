// src/hooks/useGear.ts

import type { GearPiece } from '../types/gear';  // <-- NO .ts extension

export function useGear() {
  const gearMap: Record<string, GearPiece[]> = {};

  const addPiece = (heroId: string, piece: GearPiece) => {
    // ... your logic to add gear
  };

  return { gearMap, addPiece };
}

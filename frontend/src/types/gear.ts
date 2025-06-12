export interface GearPiece {
  id: string;        // e.g. 'sword_legendary'
  slot: GearSlot;
  rarity: Rarity;
  atk: number;       // flat ATK bonus
  crit: number;      // decimal Crit CHANCE bonus (0.07 = +7%)
  atkspd: number;    // decimal Attack Speed bonus
  critDmg: number;   // decimal Crit DAMAGE bonus (0.25 = +25%)
}

export type GearSlot =
  | "sword" | "bow" | "staff"
  | "helmet" | "chestplate" | "robe"
  | "gloves" | "boots" | "ring";

export type Rarity =
  | "Legendary" | "Epic" | "Rare" | "Uncommon" | "Common";

/** Blank template pieces; users fill in the stats */
function blank(slot: GearSlot, rarity: Rarity): GearPiece {
  return { id: `${slot}_${rarity.toLowerCase()}`, slot, rarity,
    atk: 0, crit: 0, atkspd: 0, critDmg: 0 };
}

const slots: GearSlot[] = [
  "sword","bow","staff","helmet",
  "chestplate","robe","gloves","boots","ring"
];
const rarities: Rarity[] = [
  "Legendary","Epic","Rare","Uncommon","Common"
];

/** 45 placeholders: every slot × every rarity */
export const GEAR_LIBRARY: GearPiece[] =
  slots.flatMap(s => rarities.map(r => blank(s, r)));

export interface GearPiece {
  id: string;         // unique identifier, e.g., 'sword_legendary'
  slot: GearSlot;
  rarity: Rarity;
  atk: number;
  crit: number;       // decimal (0.07 = +7%)
  atkspd: number;     // decimal
  critDmg: number;    // decimal
  hp: number;
  armor: number;
  resist: number;
  mvspd: number;
}

export type GearSlot =
  | "Sword"
  | "Bow"
  | "Staff"
  | "Helmet"
  | "Chestplate"
  | "Robe"
  | "Gloves"
  | "Boots"
  | "Ring";

export type Rarity = "Legendary" | "Epic" | "Rare" | "Uncommon" | "Common";

// Generate placeholder library of gear pieces (ignore levels)
const slots: GearSlot[] = [
  "sword",
  "bow",
  "staff",
  "helmet",
  "chestplate",
  "robe",
  "gloves",
  "boots",
  "ring",
];
const rarities: Rarity[] = ["Legendary", "Epic", "Rare", "Uncommon", "Common"];

export const GEAR_LIBRARY: GearPiece[] = slots.flatMap((slot) =>
  rarities.map((rarity) => ({
    id: `${slot}_${rarity.toLowerCase()}`,
    slot,
    rarity,
    atk: 0,
    crit: 0,
    atkspd: 0,
    critDmg: 0,
    hp: 0,
    armor: 0,
    resist: 0,
    mvspd: 0,
  }))
);

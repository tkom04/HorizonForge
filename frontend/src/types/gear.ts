/* ------------- type definitions ------------- */
export interface GearPiece {
  id: string;         // sword_legendary_1, helmet_common_3, …
  slot: GearSlot;
  rarity: Rarity;
  prestige: number;   // 1 – 10  (common has 3, uncommon 3, ...)
  /* flat boosts */
  atk: number;
  /* percentage boosts expressed as decimals
     e.g. 0.07 = +7 %  */
  crit: number;
  atkspd: number;
  critDmg: number;
  hp: number;
  armor: number;
  resist: number;
  mvspd: number;
}

export type GearSlot =
  | "sword"
  | "bow"
  | "staff"
  | "helmet"
  | "chestplate"
  | "robe"
  | "gloves"
  | "boots"
  | "ring";

export type Rarity = "Legendary" | "Epic" | "Rare" | "Uncommon" | "Common";

/* ------------- helper to create blank pieces ------------- */
function blank(
  slot: GearSlot,
  rarity: Rarity,
  prestige: number
): GearPiece {
  return {
    id: `${slot.toLowerCase()}_${rarity.toLowerCase()}_${prestige}`,
    slot,
    rarity,
    prestige,
    atk: 0,
    crit: 0,
    atkspd: 0,
    critDmg: 0,
    hp: 0,
    armor: 0,
    resist: 0,
    mvspd: 0,
  };
}

/* ------------- generate 90 placeholder items ------------- */
const rarities: Rarity[] = [
  "Legendary",
  "Epic",
  "Rare",
  "Uncommon",
  "Common",
];

// per your note: L-E-R-R-U-U-U-C-C-C  = 10 prestige tiers
const rarityByPrestige = [
  "Legendary",
  "Epic",
  "Rare",
  "Rare",
  "Uncommon",
  "Uncommon",
  "Uncommon",
  "Common",
  "Common",
  "Common",
] as const;

export const GEAR_LIBRARY: GearPiece[] = (() => {
  const list: GearPiece[] = [];
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

  for (const slot of slots) {
    rarityByPrestige.forEach((r, i) => {
      list.push(blank(slot, r, i + 1));
    });
  }
  return list; // 9 slots × 10 = 90
})();

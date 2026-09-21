import { SPLATOON3_WEAPONS, type SubspeciesType, type WeaponCategory, type WeaponInfo } from "../data/weapons";

export interface LotteryWeapon extends WeaponInfo {
  category: WeaponCategory;
}

export const ALL_WEAPONS: LotteryWeapon[] = Object.entries(SPLATOON3_WEAPONS).flatMap(
  ([category, weapons]) =>
    weapons.map((w) => ({
      ...w,
      category: category as WeaponCategory,
    }))
);

interface DrawOptions {
  categories: WeaponCategory[];
  subspecies: SubspeciesType[];
  count: number;
  allowDuplicates: boolean;
}

export function drawWeapons({
  categories,
  subspecies,
  count,
  allowDuplicates,
}: DrawOptions): LotteryWeapon[] {
  const pool = ALL_WEAPONS.filter((w) => {
    if (!categories.includes(w.category)) {
      return false;
    }
    if (w.subspeciesType) {
      return subspecies.includes(w.subspeciesType);
    }
    return true;
  });

  if (pool.length === 0) {
    return [];
  }

  if (allowDuplicates) {
    return Array.from({ length: count }, () => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      return pool[randomIndex];
    })
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}
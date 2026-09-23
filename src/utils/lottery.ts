import {
  SPLATOON3_WEAPONS,
  type SubspeciesType,
  type WeaponCategory,
  type WeaponInfo,
} from "../data/weapons";

export interface LotteryWeapon extends WeaponInfo {
  category: WeaponCategory;
}

export const ALL_WEAPONS: LotteryWeapon[] = Object.entries(
  SPLATOON3_WEAPONS,
).flatMap(([category, weapons]) =>
  weapons.map((w) => ({
    ...w,
    category: category as WeaponCategory,
  })),
);

interface DrawOptions {
  categories: WeaponCategory[];
  subspecies: SubspeciesType[];
  count: number;
  allowDuplicates: boolean;
  rule?: "random" | "categoryRandom" | "variety";
  excludedWeapons?: string[];
}

export function drawWeapons({
  categories,
  subspecies,
  count,
  allowDuplicates,
  rule = "random",
  excludedWeapons = [],
}: DrawOptions): LotteryWeapon[] {
  const pool = ALL_WEAPONS.filter((w) => {
    if (!categories.includes(w.category)) {
      return false;
    }
    if (excludedWeapons.includes(w.name)) return false;
    if (w.subspeciesType) {
      return subspecies.includes(w.subspeciesType);
    }
    return true;
  });

  if (pool.length === 0) {
    return [];
  }

  if (rule === "categoryRandom") {
    const categoriesWithWeapons = [...new Set(pool.map((w) => w.category))];
    const category =
      categoriesWithWeapons[
        Math.floor(Math.random() * categoriesWithWeapons.length)
      ];
    const categoryPool = pool.filter((w) => w.category === category);
    if (allowDuplicates) {
      return Array.from(
        { length: count },
        () => categoryPool[Math.floor(Math.random() * categoryPool.length)],
      );
    }
    return [...categoryPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, categoryPool.length));
  }

  if (rule === "variety") {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const usedCategories = new Set<WeaponCategory>();
    const result: LotteryWeapon[] = [];
    for (const weapon of shuffled) {
      if (usedCategories.has(weapon.category)) continue;
      result.push(weapon);
      usedCategories.add(weapon.category);
      if (result.length === count) break;
    }
    return result;
  }

  if (allowDuplicates) {
    return Array.from({ length: count }, () => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      return pool[randomIndex];
    });
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

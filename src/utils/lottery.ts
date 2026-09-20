import { SPLATOON3_WEAPONS, type WeaponCategory, type WeaponInfo } from "../data/weapons";

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

export function getRandomWeapon(selectedCategories: WeaponCategory[]): LotteryWeapon | null {
  const filteredWeapons = ALL_WEAPONS.filter((w) =>
    selectedCategories.includes(w.category)
  );

  if (filteredWeapons.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * filteredWeapons.length);
  return filteredWeapons[randomIndex];
}
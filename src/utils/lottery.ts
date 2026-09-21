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

export function getRandomWeapon(selectedCategories: WeaponCategory[], selectSubspecies: SubspeciesType[]): LotteryWeapon | null {
  const filteredWeapons = ALL_WEAPONS.filter((w) => {
    if (!selectedCategories.includes(w.category)) {
      return false;
    }

    if (w.subspeciesType) {
      return selectSubspecies.includes(w.subspeciesType);
    }
    return true;
  }
  );

  if (filteredWeapons.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredWeapons.length);
  return filteredWeapons[randomIndex];
}
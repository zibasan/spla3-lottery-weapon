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

export function getRandomWeapon(): LotteryWeapon {
  const randomIndex = Math.floor(Math.random() * ALL_WEAPONS.length);
  return ALL_WEAPONS[randomIndex];
}
/**
 * スプラトゥーン3 ブキ種（カテゴリ）一覧
 */
export const WEAPON_CATEGORIES = [
  "シューター",
  "チャージャー",
  "ブラスター",
  "ローラー",
  "フデ",
  "スロッシャー",
  "スピナー",
  "マニューバー",
  "シェルター",
  "ワイパー",
  "ストリンガー",
] as const;

export const SUBSPECIES_TYPES = [
  "colab&custom",
  "bankara",
  "hero",
  "octo",
  "order",
  "pet",
] as const;
export type SubspeciesType = (typeof SUBSPECIES_TYPES)[number];

export const SUBSPECIES_TYPE_LABELS: Record<SubspeciesType, string> = {
  "colab&custom": "カスタム・コラボ",
  bankara: "バンカラコレクション",
  hero: "ヒーロー",
  octo: "オクタ",
  order: "オーダー",
  pet: "スプラトゥーン レイダース",
};

export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number];

export interface WeaponInfo {
  name: string;
  nameEn?: string;
  subspeciesType?: SubspeciesType;
  ruby?: {
    target: string;
    text: string;
  };
}

/**
 * スプラトゥーン3 ブキ種ごとの全メインブキ一覧
 */
export const SPLATOON3_WEAPONS: Record<WeaponCategory, readonly WeaponInfo[]> =
{
  シューター: [
    { name: "ボールドマーカー", nameEn: "Sploosh-o-matic" },
    { name: "ボールドマーカーネオ", nameEn: "Neo Sploosh-o-matic", subspeciesType: "colab&custom" },
    { name: "わかばシューター", nameEn: "Splattershot Jr." },
    { name: "もみじシューター", nameEn: "Custom Splattershot Jr.", subspeciesType: "colab&custom" },
    { name: "シャープマーカー", nameEn: "Splash-o-matic" },
    { name: "シャープマーカーネオ", nameEn: "Neo Splash-o-matic", subspeciesType: "colab&custom" },
    { name: "シャープマーカーGECK", nameEn: "Splash-o-matic GCK-O", subspeciesType: "bankara" },
    { name: "プロモデラーMG", nameEn: "Aerospray MG" },
    { name: "プロモデラーRG", nameEn: "Aerospray RG", subspeciesType: "colab&custom" },
    {
      name: "プロモデラー彩",
      subspeciesType: "bankara",
      nameEn: "Colorz Aerospray",
      ruby: { target: "彩", text: "サイ" },
    },
    { name: "スプラシューター", nameEn: "Splattershot" },
    { name: "スプラシューターコラボ", nameEn: "Tentatek Splattershot", subspeciesType: "colab&custom" },
    {
      name: "スプラシューター煌",
      nameEn: "Glamorz Splattershot",
      subspeciesType: "bankara",
      ruby: { target: "煌", text: "コウ" },
    },
    { name: "オクタシューターレプリカ", nameEn: "Octo Shot Replica", subspeciesType: "octo" },
    { name: "オーダーシューターレプリカ", nameEn: "Order Shot Replica", subspeciesType: "order" },
    { name: "ヒーローシューターレプリカ", nameEn: "Hero Shot Replica", subspeciesType: "hero" },
    { name: "PETシューターレプリカ", nameEn: "Plastic-Bottle Shot Replica", subspeciesType: "pet" },
    { name: ".52ガロン", nameEn: ".52 Gal" },
    { name: ".52ガロンデコ", nameEn: ".52 Gal Deco", subspeciesType: "colab&custom" },
    { name: ".96ガロン", nameEn: ".96 Gal" },
    { name: ".96ガロンデコ", nameEn: ".96 Gal Deco", subspeciesType: "colab&custom" },
    {
      name: ".96ガロン爪",
      subspeciesType: "bankara",
      nameEn: "Clawz .96 Gal",
      ruby: { target: "爪", text: "ソウ" },
    },
    { name: "N-ZAP85", nameEn: "N-ZAP '85" },
    { name: "N-ZAP89", nameEn: "N-ZAP '89", subspeciesType: "colab&custom" },
    { name: "プライムシューター", nameEn: "Splattershot Pro" },
    { name: "プライムシューターコラボ", nameEn: "Forge Splattershot Pro", subspeciesType: "colab&custom" },
    { name: "プライムシューターFRZN", nameEn: "Splattershot Pro FRZ-N", subspeciesType: "bankara" },
    { name: "ジェットスイーパー", nameEn: "Jet Squelcher" },
    { name: "ジェットスイーパーカスタム", nameEn: "Custom Jet Squelcher", subspeciesType: "colab&custom" },
    { name: "ジェットスイーパーCOBR", nameEn: "Jet Squelcher COB-R", subspeciesType: "bankara" },
    { name: "スペースシューター", nameEn: "Splattershot Nova" },
    { name: "スペースシューターコラボ", nameEn: "Annaki Splattershot Nova", subspeciesType: "colab&custom" },
    { name: "L3リールガン", nameEn: "L-3 Nozzlenose" },
    { name: "L3リールガンD", nameEn: "L-3 Nozzlenose D", subspeciesType: "colab&custom" },
    {
      name: "L3リールガン箔",
      subspeciesType: "bankara",
      nameEn: "Glitterz L-3 Nozzlenose",
      ruby: { target: "箔", text: "ハク" },
    },
    { name: "H3リールガン", nameEn: "H-3 Nozzlenose" },
    { name: "H3リールガンD", nameEn: "H-3 Nozzlenose D", subspeciesType: "colab&custom" },
    { name: "H3リールガンSNAK", nameEn: "H-3 Nozzlenose VIP-R", subspeciesType: "bankara" },
    { name: "ボトルガイザー", nameEn: "Squeezer" },
    { name: "ボトルガイザーフォイル", nameEn: "Foil Squeezer", subspeciesType: "colab&custom" },
  ],
  ローラー: [
    { name: "カーボンローラー", nameEn: "Carbon Roller" },
    { name: "カーボンローラーデコ", nameEn: "Carbon Roller Deco", subspeciesType: "colab&custom" },
    { name: "カーボンローラーANGL", nameEn: "Carbon Roller ANG-L", subspeciesType: "bankara" },
    { name: "スプラローラー", nameEn: "Splat Roller" },
    { name: "スプラローラーコラボ", nameEn: "Krak-On Splat Roller", subspeciesType: "colab&custom" },
    { name: "オーダーローラーレプリカ", nameEn: "Order Roller Replica", subspeciesType: "order" },
    { name: "ヴァリアブルローラー", nameEn: "Flingza Roller" },
    { name: "ヴァリアブルローラーフォイル", nameEn: "Foil Flingza Roller", subspeciesType: "colab&custom" },
    { name: "ダイナモローラー", nameEn: "Dynamo Roller" },
    { name: "ダイナモローラーテスラ", nameEn: "Gold Dynamo Roller", subspeciesType: "colab&custom" },
    {
      name: "ダイナモローラー冥",
      subspeciesType: "bankara",
      nameEn: "Starz Dynamo Roller",
      ruby: { target: "冥", text: "メイ" },
    },
    { name: "ワイドローラー", nameEn: "Big Swig Roller" },
    { name: "ワイドローラーコラボ", nameEn: "Big Swig Roller Express", subspeciesType: "colab&custom" },
    {
      name: "ワイドローラー惑",
      subspeciesType: "bankara",
      nameEn: "Planetz Wide Roller",
      ruby: { target: "惑", text: "ワク" },
    },
  ],
  チャージャー: [
    { name: "スクイックリンα", nameEn: "Classic Squiffer" },
    { name: "スクイックリンβ", nameEn: "New Squiffer", subspeciesType: "colab&custom" },
    { name: "スプラチャージャー", nameEn: "Splat Charger" },
    { name: "オーダーチャージャーレプリカ", nameEn: "Order Charger Replica", subspeciesType: "order" },
    { name: "スプラチャージャーコラボ", nameEn: "Z+F Splat Charger", subspeciesType: "colab&custom" },
    { name: "スプラチャージャーFRST", nameEn: "Splat Charger CAM-O", subspeciesType: "bankara" },
    { name: "スプラスコープ", nameEn: "Splatterscope" },
    { name: "スプラスコープコラボ", nameEn: "Z+F Splatterscope", subspeciesType: "colab&custom" },
    { name: "スプラスコープFRST", nameEn: "Splatterscope CAM-O", subspeciesType: "bankara" },
    { name: "リッター4K", nameEn: "E-liter 4K" },
    { name: "リッター4Kカスタム", nameEn: "Custom E-liter 4K", subspeciesType: "colab&custom" },
    { name: "4Kスコープ", nameEn: "E-liter 4K Scope" },
    { name: "4Kスコープカスタム", nameEn: "Custom E-liter 4K Scope", subspeciesType: "colab&custom" },
    { name: "14式竹筒銃・甲", nameEn: "Bamboozler 14 Mk I", ruby: { target: "14", text: "ヒトヨン" } },
    {
      name: "14式竹筒銃・乙",
      nameEn: "Bamboozler 14 Mk II",
      ruby: { target: "14", text: "ヒトヨン" },
      subspeciesType: "colab&custom",
    },
    { name: "ソイチューバー", nameEn: "Goo Tuber" },
    { name: "ソイチューバーカスタム", nameEn: "Custom Goo Tuber", subspeciesType: "colab&custom" },
    { name: "R-PEN/5H", nameEn: "Snipewriter 5H" },
    { name: "R-PEN/5B", nameEn: "Snipewriter 5B", subspeciesType: "colab&custom" },
  ],
  スロッシャー: [
    { name: "バケットスロッシャー", nameEn: "Slosher" },
    { name: "オーダースロッシャーレプリカ", nameEn: "Order Slosher Replica", subspeciesType: "order" },
    { name: "バケットスロッシャーデコ", nameEn: "Slosher Deco", subspeciesType: "colab&custom" },
    { name: "ヒッセン", nameEn: "Tri-Slosher" },
    { name: "ヒッセンヒュー", nameEn: "Tri-Slosher Nouveau", subspeciesType: "colab&custom" },
    { name: "ヒッセンASH", nameEn: "Tri-Slosher ASH-N", subspeciesType: "bankara" },
    { name: "スクリュースロッシャー", nameEn: "Sloshing Machine" },
    { name: "スクリュースロッシャーネオ", nameEn: "Sloshing Machine Neo", subspeciesType: "colab&custom" },
    { name: "オーバーフロッシャー", nameEn: "Bloblobber" },
    { name: "オーバーフロッシャーデコ", nameEn: "Bloblobber Deco", subspeciesType: "colab&custom" },
    { name: "エクスプロッシャー", nameEn: "Explosher" },
    { name: "エクスプロッシャーカスタム", nameEn: "Custom Explosher", subspeciesType: "colab&custom" },
    { name: "モップリン", nameEn: "Dread Wringer" },
    { name: "モップリンD", nameEn: "Dread Wringer D", subspeciesType: "colab&custom" },
    {
      name: "モップリン角",
      subspeciesType: "bankara",
      nameEn: "Hornz Dread Wringer",
      ruby: { target: "角", text: "カク" },
    },
  ],
  スピナー: [
    { name: "スプラスピナー", nameEn: "Mini Splatling" },
    { name: "スプラスピナーコラボ", nameEn: "Zink Mini Splatling", subspeciesType: "colab&custom" },
    { name: "スプラスピナーPYTN", nameEn: "Mini Splatling RTL-R", subspeciesType: "bankara" },
    { name: "バレルスピナー", nameEn: "Heavy Splatling" },
    { name: "オーダースピナーレプリカ", nameEn: "Order Splatling Replica", subspeciesType: "order" },
    { name: "バレルスピナーデコ", nameEn: "Heavy Splatling Deco", subspeciesType: "colab&custom" },
    { name: "ハイドラント", nameEn: "Hydra Splatling" },
    { name: "ハイドラントカスタム", nameEn: "Custom Hydra Splatling", subspeciesType: "colab&custom" },
    {
      name: "ハイドラント圧",
      subspeciesType: "bankara",
      nameEn: "Torrentz Hydra Splatling",
      ruby: { target: "圧", text: "アツ" },
    },
    { name: "クーゲルシュライバー", nameEn: "Ballpoint Splatling" },
    { name: "クーゲルシュライバーヒュー", nameEn: "Ballpoint Splatling Nouveau", subspeciesType: "colab&custom" },
    { name: "ノーチラス47", nameEn: "Nautilus 47" },
    { name: "ノーチラス79", nameEn: "Nautilus 79", subspeciesType: "colab&custom" },
    { name: "イグザミナー", nameEn: "Heavy Edit Splatling" },
    { name: "イグザミナーヒュー", nameEn: "Heavy Edit Splatling Nouveau", subspeciesType: "colab&custom" },
  ],
  マニューバー: [
    { name: "スパッタリー", nameEn: "Dapple Dualies" },
    { name: "スパッタリーヒュー", nameEn: "Dapple Dualies Nouveau", subspeciesType: "colab&custom" },
    { name: "スパッタリーOWL", nameEn: "Dapple Dualies NOC-T", subspeciesType: "bankara" },
    { name: "スプラマニューバー", nameEn: "Splat Dualies" },
    { name: "オーダーマニューバーレプリカ", nameEn: "Order Dualie Replicas", subspeciesType: "order" },
    { name: "スプラマニューバーコラボ", nameEn: "Enperry Splat Dualies", subspeciesType: "colab&custom" },
    {
      name: "スプラマニューバー耀",
      subspeciesType: "bankara",
      nameEn: "Twinklez Splat Dualies",
      ruby: { target: "耀", text: "ヨウ" },
    },
    { name: "ケルビン525", nameEn: "Glooga Dualies" },
    { name: "ケルビン525デコ", nameEn: "Glooga Dualies Deco", subspeciesType: "colab&custom" },
    { name: "デュアルスイーパー", nameEn: "Dualie Squelchers" },
    { name: "デュアルスイーパーカスタム", nameEn: "Custom Dualie Squelchers", subspeciesType: "colab&custom" },
    {
      name: "デュアルスイーパー蹄",
      subspeciesType: "bankara",
      nameEn: "Hoofz Dualie Squelchers",
      ruby: { target: "蹄", text: "テイ" },
    },
    { name: "クアッドホッパーブラック", nameEn: "Dark Tetra Dualies" },
    { name: "クアッドホッパーホワイト", nameEn: "Light Tetra Dualies", subspeciesType: "colab&custom" },
    { name: "ガエンFF", nameEn: "Douser Dualies FF" },
    { name: "ガエンFFカスタム", nameEn: "Custom Douser Dualies FF", subspeciesType: "bankara" },
  ],
  シェルター: [
    { name: "パラシェルター", nameEn: "Splat Brella" },
    { name: "パラシェルターソレーラ", nameEn: "Sorella Brella", subspeciesType: "colab&custom" },
    { name: "オーダーシェルターレプリカ", nameEn: "Order Brella Replica", subspeciesType: "order" },
    { name: "キャンピングシェルター", nameEn: "Tenta Brella" },
    {
      name: "キャンピングシェルターソレーラ",
      nameEn: "Tenta Sorella Brella",
      subspeciesType: "colab&custom",
    },
    { name: "キャンピングシェルターCREM", nameEn: "Tenta Brella CRE-M", subspeciesType: "bankara" },
    { name: "スパイガジェット", nameEn: "Undercover Brella" },
    { name: "スパイガジェットソレーラ", nameEn: "Undercover Sorella Brella", subspeciesType: "colab&custom" },
    {
      name: "スパイガジェット繚",
      subspeciesType: "bankara",
      nameEn: "Patternz Undercover Brella",
      ruby: { target: "繚", text: "リョウ" },
    },
    { name: "24式張替傘・甲", nameEn: "Recycled Brella 24 Mk I", ruby: { target: "24", text: "フタヨン" } },
    {
      name: "24式張替傘・乙",
      nameEn: "Recycled Brella 24 Mk II",
      subspeciesType: "colab&custom",
      ruby: { target: "24", text: "フタヨン" },
    },
  ],
  ブラスター: [
    { name: "ノヴァブラスター", nameEn: "Luna Blaster" },
    { name: "ノヴァブラスターネオ", nameEn: "Luna Blaster Neo", subspeciesType: "colab&custom" },
    { name: "ホットブラスター", nameEn: "Blaster" },
    { name: "ホットブラスターカスタム", nameEn: "Custom Blaster", subspeciesType: "colab&custom" },
    {
      name: "ホットブラスター艶",
      subspeciesType: "bankara",
      nameEn: "Gleamz Blaster",
      ruby: { target: "艶", text: "エン" },
    },
    { name: "オーダーブラスターレプリカ", nameEn: "Order Blaster Replica", subspeciesType: "order" },
    { name: "ロングブラスター", nameEn: "Range Blaster" },
    { name: "ロングブラスターカスタム", nameEn: "Custom Range Blaster", subspeciesType: "colab&custom" },
    { name: "クラッシュブラスター", nameEn: "Crash Blaster" },
    { name: "クラッシュブラスターネオ", nameEn: "Crash Blaster Neo", subspeciesType: "colab&custom" },
    { name: "ラピッドブラスター", nameEn: "Rapid Blaster" },
    { name: "ラピッドブラスターデコ", nameEn: "Rapid Blaster Deco", subspeciesType: "colab&custom" },
    { name: "Rブラスターエリート", nameEn: "Rapid Blaster Pro" },
    { name: "Rブラスターエリートデコ", nameEn: "Rapid Blaster Deco", subspeciesType: "colab&custom" },
    { name: "RブラスターエリートWNTR", nameEn: "Rapid Blaster Pro WNT-R", subspeciesType: "bankara" },
    { name: "S-BLAST92", nameEn: "S-BLAST '92" },
    { name: "S-BLAST91", nameEn: "S-BLAST '91", subspeciesType: "colab&custom" },
  ],
  フデ: [
    { name: "パブロ", nameEn: "Inkbrush" },
    { name: "パブロヒュー", nameEn: "Inkbrush Nouveau", subspeciesType: "colab&custom" },
    { name: "ホクサイ", nameEn: "Octobrush" },
    { name: "ホクサイヒュー", nameEn: "Octobrush Nouveau", subspeciesType: "colab&custom" },
    {
      name: "ホクサイ彗",
      subspeciesType: "bankara",
      nameEn: "Cometz Octobrush",
      ruby: { target: "彗", text: "スイ" },
    },
    { name: "オーダーブラシレプリカ", nameEn: "Orderbrush Replica", subspeciesType: "order" },
    { name: "フィンセント", nameEn: "Painbrush" },
    { name: "フィンセントヒュー", nameEn: "Painbrush Nouveau", subspeciesType: "colab&custom" },
    { name: "フィンセントBRNZ", nameEn: "Painbrush BRN-Z", subspeciesType: "bankara" },
  ],
  ストリンガー: [
    { name: "トライストリンガー", nameEn: "Tri-Stringer" },
    { name: "トライストリンガーコラボ", nameEn: "Inkline Tri-Stringer", subspeciesType: "colab&custom" },
    {
      name: "トライストリンガー燈",
      subspeciesType: "bankara",
      nameEn: "Bulbz Tri-Stringer",
      ruby: { target: "燈", text: "トウ" },
    },
    { name: "オーダーストリンガーレプリカ", nameEn: "Order Stringer Replica", subspeciesType: "order" },
    { name: "LACT-450", nameEn: "REEF-LUX 450" },
    { name: "LACT-450デコ", nameEn: "REEF-LUX 450 Deco", subspeciesType: "colab&custom" },
    { name: "LACT-450MILK", nameEn: "REEF-LUX 450 MIL-K", subspeciesType: "bankara" },
    { name: "フルイドV", nameEn: "Wellstring V" },
    { name: "フルイドVカスタム", nameEn: "Custom Wellstring V", subspeciesType: "colab&custom" },
  ],
  ワイパー: [
    { name: "ドライブワイパー", nameEn: "Splatana Wiper" },
    { name: "ドライブワイパーデコ", nameEn: "Splatana Wiper Deco", subspeciesType: "colab&custom" },
    { name: "ドライブワイパーRUST", nameEn: "Splatana Wiper RUS-T", subspeciesType: "bankara" },
    { name: "ジムワイパー", nameEn: "Splatana Stamper" },
    { name: "ジムワイパーヒュー", nameEn: "Splatana Stamper Nouveau", subspeciesType: "colab&custom" },
    {
      name: "ジムワイパー封",
      subspeciesType: "bankara",
      nameEn: "Stickerz Splatana Stamper",
      ruby: { target: "封", text: "フウ" },
    },
    { name: "オーダーワイパーレプリカ", nameEn: "Order Splatana Replica", subspeciesType: "order" },
    { name: "デンタルワイパーミント", nameEn: "Mint Decavitator" },
    { name: "デンタルワイパースミ", nameEn: "Charcoal Decavitator", subspeciesType: "colab&custom" },
  ],
};

/**
 * 全ブキのフラットな配列
 */
export const ALL_WEAPONS: readonly WeaponInfo[] =
  Object.values(SPLATOON3_WEAPONS).flat();

/**
 * ブキが除外亜種に含まれているか判定
 */
export function isAllowedWeapon(
  weapon: WeaponInfo,
  excludedTypes: readonly SubspeciesType[] = [],
): boolean {
  if (weapon.subspeciesType && excludedTypes.includes(weapon.subspeciesType)) {
    return false;
  }
  return true;
}

/**
 * 指定したブキ種・除外設定からブキ名リストを取得
 */
export function getWeaponNamesFromCategory(
  category: WeaponCategory,
  excludedTypes: readonly SubspeciesType[] = [],
): string[] {
  const list = SPLATOON3_WEAPONS[category];
  const filtered = list.filter((w) => isAllowedWeapon(w, excludedTypes));
  const pool = filtered.length > 0 ? filtered : list; // 全て除外された場合のフォールバック
  return pool.map((w) => w.name);
}

/**
 * 指定したブキ種の中からランダムにブキを1つ取得
 */
export function getRandomWeaponFromCategory(
  category: WeaponCategory,
  excludedTypes: readonly SubspeciesType[] = [],
): string {
  const names = getWeaponNamesFromCategory(category, excludedTypes);
  const idx = Math.floor(Math.random() * names.length);
  return names[idx];
}

/**
 * 全ブキの中からランダムにブキを1つ取得
 */
export function getRandomWeapon(
  excludedTypes: readonly SubspeciesType[] = [],
): string {
  const filtered = ALL_WEAPONS.filter((w) => isAllowedWeapon(w, excludedTypes));
  const pool = filtered.length > 0 ? filtered : ALL_WEAPONS;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx].name;
}

/**
 * ブキ抽選ルールの定義 (全10種)
 */
export type WeaponLotteryRule =
  | "random_allow_dup" // 完全ランダム (重複あり)
  | "random_no_dup" // 完全ランダム (重複なし)
  | "same_weapon_all" // おそろいブキ (全員)
  | "same_weapon_team" // おそろいブキ (チーム別)
  | "category_fixed_all" // ブキ種固定 (全員)
  | "category_fixed_team" // ブキ種固定 (チーム別)
  | "category_random_all" // ブキ種抽選 (全員)
  | "category_random_team" // ブキ種抽選 (チーム別)
  | "diff_category_team" // チーム内でブキ種被りなし
  | "diff_category_all"; // 全体(8人)でブキ種被りなし

export const WEAPON_LOTTERY_RULE_LABELS: Record<WeaponLotteryRule, string> = {
  random_no_dup: "完全ランダム (重複なし)",
  random_allow_dup: "完全ランダム (重複あり)",
  same_weapon_all: "おそろいブキ (全員)",
  same_weapon_team: "おそろいブキ (チーム別)",
  category_fixed_all: "ブキ種固定 (全員)",
  category_fixed_team: "ブキ種固定 (チーム別)",
  category_random_all: "ブキ種抽選 (全員)",
  category_random_team: "ブキ種抽選 (チーム別)",
  diff_category_team: "バラエティブキ(チーム別)",
  diff_category_all: "バラエティブキ(全員)",
};

export interface WeaponLotteryOptions {
  rule: WeaponLotteryRule;
  fixedCategoryAll?: WeaponCategory; // ブキ種固定(全員)時の指定
  fixedCategoryAlpha?: WeaponCategory; // ブキ種固定(アルファ)時の指定
  fixedCategoryBravo?: WeaponCategory; // ブキ種固定(ブラボー)時の指定
  excludedSubspeciesTypes?: SubspeciesType[]; // 除外する亜種種別
}

export interface WeaponLotteryResult {
  alpha: Record<string, string>; // userId -> weaponName
  bravo: Record<string, string>; // userId -> weaponName
  rule: WeaponLotteryRule;
  description: string;
}

/**
 * 配列をシャッフル（Fisher-Yates）
 */
function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 指定したルールとオプションに基づいてアルファ/ブラボーのブキを抽選
 */
export function generateWeaponsForTeams(
  alphaIds: readonly string[],
  bravoIds: readonly string[],
  options: WeaponLotteryOptions,
): WeaponLotteryResult {
  const alpha: Record<string, string> = {};
  const bravo: Record<string, string> = {};
  let description = "";

  const { rule, excludedSubspeciesTypes = [] } = options;

  switch (rule) {
    case "random_allow_dup": {
      description = "完全ランダム (重複あり)";
      for (const id of alphaIds)
        alpha[id] = getRandomWeapon(excludedSubspeciesTypes);
      for (const id of bravoIds)
        bravo[id] = getRandomWeapon(excludedSubspeciesTypes);
      break;
    }

    case "random_no_dup": {
      description = "完全ランダム (重複なし)";
      const filtered = ALL_WEAPONS.filter((w) =>
        isAllowedWeapon(w, excludedSubspeciesTypes),
      );
      const pool = (
        filtered.length >= alphaIds.length + bravoIds.length
          ? filtered
          : ALL_WEAPONS
      ).map((w) => w.name);
      const shuffled = shuffleArray(pool);
      let idx = 0;
      for (const id of alphaIds) alpha[id] = shuffled[idx++];
      for (const id of bravoIds) bravo[id] = shuffled[idx++];
      break;
    }

    case "same_weapon_all": {
      const chosenWeapon = getRandomWeapon(excludedSubspeciesTypes);
      description = `おそろいブキ [全員: ${chosenWeapon}]`;
      for (const id of alphaIds) alpha[id] = chosenWeapon;
      for (const id of bravoIds) bravo[id] = chosenWeapon;
      break;
    }

    case "same_weapon_team": {
      const filtered = ALL_WEAPONS.filter((w) =>
        isAllowedWeapon(w, excludedSubspeciesTypes),
      );
      const pool = (filtered.length >= 2 ? filtered : ALL_WEAPONS).map(
        (w) => w.name,
      );
      const [weaponAlpha, weaponBravo] = shuffleArray(pool);
      description = `おそろいブキ [アルファ: ${weaponAlpha} / ブラボー: ${weaponBravo}]`;
      for (const id of alphaIds) alpha[id] = weaponAlpha;
      for (const id of bravoIds) bravo[id] = weaponBravo;
      break;
    }

    case "category_fixed_all": {
      const cat = options.fixedCategoryAll ?? "シューター";
      description = `ブキ種固定 [全員: ${cat}]`;
      for (const id of alphaIds)
        alpha[id] = getRandomWeaponFromCategory(cat, excludedSubspeciesTypes);
      for (const id of bravoIds)
        bravo[id] = getRandomWeaponFromCategory(cat, excludedSubspeciesTypes);
      break;
    }

    case "category_fixed_team": {
      const catA = options.fixedCategoryAlpha ?? "シューター";
      const catB = options.fixedCategoryBravo ?? "ローラー";
      description = `ブキ種固定 [アルファ: ${catA} / ブラボー: ${catB}]`;
      for (const id of alphaIds)
        alpha[id] = getRandomWeaponFromCategory(catA, excludedSubspeciesTypes);
      for (const id of bravoIds)
        bravo[id] = getRandomWeaponFromCategory(catB, excludedSubspeciesTypes);
      break;
    }

    case "category_random_all": {
      const randomCat = shuffleArray(WEAPON_CATEGORIES)[0];
      description = `ブキ種抽選 [全員: ${randomCat}]`;
      for (const id of alphaIds)
        alpha[id] = getRandomWeaponFromCategory(
          randomCat,
          excludedSubspeciesTypes,
        );
      for (const id of bravoIds)
        bravo[id] = getRandomWeaponFromCategory(
          randomCat,
          excludedSubspeciesTypes,
        );
      break;
    }

    case "category_random_team": {
      const [catA, catB] = shuffleArray(WEAPON_CATEGORIES);
      description = `ブキ種抽選 [アルファ: ${catA} / ブラボー: ${catB}]`;
      for (const id of alphaIds)
        alpha[id] = getRandomWeaponFromCategory(catA, excludedSubspeciesTypes);
      for (const id of bravoIds)
        bravo[id] = getRandomWeaponFromCategory(catB, excludedSubspeciesTypes);
      break;
    }

    case "diff_category_team": {
      description = "チーム内でブキ種被りなし";
      const assignTeam = (
        ids: readonly string[],
        teamRecord: Record<string, string>,
      ) => {
        const shuffledCats = shuffleArray(WEAPON_CATEGORIES);
        ids.forEach((id, i) => {
          const cat = shuffledCats[i % shuffledCats.length];
          teamRecord[id] = getRandomWeaponFromCategory(
            cat,
            excludedSubspeciesTypes,
          );
        });
      };
      assignTeam(alphaIds, alpha);
      assignTeam(bravoIds, bravo);
      break;
    }

    case "diff_category_all": {
      description = "全体でブキ種被りなし";
      const shuffledCats = shuffleArray(WEAPON_CATEGORIES);
      let catIdx = 0;
      for (const id of alphaIds) {
        const cat = shuffledCats[catIdx++];
        alpha[id] = getRandomWeaponFromCategory(cat, excludedSubspeciesTypes);
      }
      for (const id of bravoIds) {
        const cat = shuffledCats[catIdx++];
        bravo[id] = getRandomWeaponFromCategory(cat, excludedSubspeciesTypes);
      }
      break;
    }
  }

  return { alpha, bravo, rule, description };
}

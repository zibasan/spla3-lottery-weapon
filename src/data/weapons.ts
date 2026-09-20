/**
 * スプラトゥーン3 ブキ種（カテゴリ）一覧
 */
export const WEAPON_CATEGORIES = [
  'シューター',
  'チャージャー',
  'ブラスター',
  'ローラー',
  'フデ',
  'スロッシャー',
  'スピナー',
  'マニューバー',
  'シェルター',
  'ワイパー',
  'ストリンガー',
] as const;

export const SUBSPECIES_TYPES = ['colab&custom', 'bankara', 'hero', 'octo', 'order', 'pet'] as const;
export type SubspeciesType = (typeof SUBSPECIES_TYPES)[number];

export const SUBSPECIES_TYPE_LABELS: Record<SubspeciesType, string> = {
  "colab&custom": 'カスタム・コラボ',
  "bankara": 'バンカラコレクション',
  hero: 'ヒーロー',
  octo: 'オクタ',
  order: 'オーダー',
  pet: 'スプラトゥーン レイダース',
}

export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number];

export interface WeaponInfo {
  name: string;
  subspeciesType?: SubspeciesType;
  ruby?: {
    target: string;
    text: string;
  }
};

/**
 * スプラトゥーン3 ブキ種ごとの全メインブキ一覧
 */
export const SPLATOON3_WEAPONS: Record<WeaponCategory, readonly WeaponInfo[]> = {
  シューター: [
    { name: 'ボールドマーカー' },
    { name: 'ボールドマーカーネオ', subspeciesType: 'colab&custom' },
    { name: 'わかばシューター' },
    { name: 'もみじシューター', subspeciesType: 'colab&custom' },
    { name: 'シャープマーカー' },
    { name: 'シャープマーカーネオ', subspeciesType: 'colab&custom' },
    { name: 'シャープマーカーGECK', subspeciesType: 'bankara' },
    { name: 'プロモデラーMG' },
    { name: 'プロモデラーRG', subspeciesType: 'colab&custom' },
    { name: 'プロモデラー彩', subspeciesType: 'bankara', ruby: { target: '彩', text: 'サイ' } },
    { name: 'スプラシューター' },
    { name: 'スプラシューターコラボ', subspeciesType: 'colab&custom' },
    { name: 'スプラシューター煌', subspeciesType: 'bankara', ruby: { target: '煌', text: 'コウ' } },
    { name: 'オクタシューターレプリカ', subspeciesType: 'octo' },
    { name: 'オーダーシューターレプリカ', subspeciesType: 'order' },
    { name: 'ヒーローシューターレプリカ', subspeciesType: 'hero' },
    { name: 'PETシューターレプリカ', subspeciesType: 'pet' },
    { name: '.52ガロン' },
    { name: '.52ガロンデコ', subspeciesType: 'colab&custom' },
    { name: '.96ガロン' },
    { name: '.96ガロンデコ', subspeciesType: 'colab&custom' },
    { name: '.96ガロン爪', subspeciesType: 'bankara', ruby: { target: '爪', text: 'ソウ' } },
    { name: 'N-ZAP85' },
    { name: 'N-ZAP89', subspeciesType: 'colab&custom' },
    { name: 'プライムシューター' },
    { name: 'プライムシューターコラボ', subspeciesType: 'colab&custom' },
    { name: 'プライムシューターFRZN', subspeciesType: 'bankara' },
    { name: 'ジェットスイーパー' },
    { name: 'ジェットスイーパーカスタム', subspeciesType: 'colab&custom' },
    { name: 'ジェットスイーパーCOBR', subspeciesType: 'bankara' },
    { name: 'スペースシューター' },
    { name: 'スペースシューターコラボ', subspeciesType: 'colab&custom' },
    { name: 'L3リールガン' },
    { name: 'L3リールガンD', subspeciesType: 'colab&custom' },
    { name: 'L3リールガン箔', subspeciesType: 'bankara', ruby: { target: '箔', text: 'ハク' } },
    { name: 'H3リールガン' },
    { name: 'H3リールガンD', subspeciesType: 'colab&custom' },
    { name: 'H3リールガンSNAK', subspeciesType: 'bankara' },
    { name: 'ボトルガイザー' },
    { name: 'ボトルガイザーフォイル', subspeciesType: 'colab&custom' },
  ],
  ローラー: [
    { name: 'カーボンローラー' },
    { name: 'カーボンローラーデコ', subspeciesType: 'colab&custom' },
    { name: 'カーボンローラーANGL', subspeciesType: 'bankara' },
    { name: 'スプラローラー' },
    { name: 'スプラローラーコラボ', subspeciesType: 'colab&custom' },
    { name: 'オーダーローラーレプリカ', subspeciesType: 'order' },
    { name: 'ヴァリアブルローラー' },
    { name: 'ヴァリアブルローラーフォイル', subspeciesType: 'colab&custom' },
    { name: 'ダイナモローラー' },
    { name: 'ダイナモローラーテスラ', subspeciesType: 'colab&custom' },
    { name: 'ダイナモローラー冥', subspeciesType: 'bankara', ruby: { target: '冥', text: 'メイ' } },
    { name: 'ワイドローラー' },
    { name: 'ワイドローラーコラボ', subspeciesType: 'colab&custom' },
    { name: 'ワイドローラー惑', subspeciesType: 'bankara', ruby: { target: '惑', text: 'ワク' } },
  ],
  チャージャー: [
    { name: 'スクイックリンα' },
    { name: 'スクイックリンβ', subspeciesType: 'colab&custom' },
    { name: 'スプラチャージャー' },
    { name: 'オーダーチャージャーレプリカ', subspeciesType: 'order' },
    { name: 'スプラチャージャーコラボ', subspeciesType: 'colab&custom' },
    { name: 'スプラチャージャーFRST', subspeciesType: 'bankara' },
    { name: 'スプラスコープ' },
    { name: 'スプラスコープコラボ', subspeciesType: 'colab&custom' },
    { name: 'スプラスコープFRST', subspeciesType: 'bankara' },
    { name: 'リッター4K' },
    { name: 'リッター4Kカスタム', subspeciesType: 'colab&custom' },
    { name: '4Kスコープ' },
    { name: '4Kスコープカスタム', subspeciesType: 'colab&custom' },
    { name: '14式竹筒銃・甲', ruby: { target: '14', text: 'ヒトヨン' } },
    { name: '14式竹筒銃・乙', ruby: { target: '14', text: 'ヒトヨン' }, subspeciesType: 'colab&custom' },
    { name: 'ソイチューバー' },
    { name: 'ソイチューバーカスタム', subspeciesType: 'colab&custom' },
    { name: 'R-PEN/5H' },
    { name: 'R-PEN/5B', subspeciesType: 'colab&custom' },
  ],
  スロッシャー: [
    { name: 'バケットスロッシャー' },
    { name: 'オーダースロッシャーレプリカ', subspeciesType: 'order' },
    { name: 'バケットスロッシャーデコ', subspeciesType: 'colab&custom' },
    { name: 'ヒッセン' },
    { name: 'ヒッセンヒュー', subspeciesType: 'colab&custom' },
    { name: 'ヒッセンASH', subspeciesType: 'bankara' },
    { name: 'スクリュースロッシャー' },
    { name: 'スクリュースロッシャーネオ', subspeciesType: 'colab&custom' },
    { name: 'オーバーフロッシャー' },
    { name: 'オーバーフロッシャーデコ', subspeciesType: 'colab&custom' },
    { name: 'エクスプロッシャー' },
    { name: 'エクスプロッシャーカスタム', subspeciesType: 'colab&custom' },
    { name: 'モップリン' },
    { name: 'モップリンD', subspeciesType: 'colab&custom' },
    { name: 'モップリン角', subspeciesType: 'bankara', ruby: { target: '角', text: 'カク' } },
  ],
  スピナー: [
    { name: 'スプラスピナー' },
    { name: 'スプラスピナーコラボ', subspeciesType: 'colab&custom' },
    { name: 'スプラスピナーPYTN', subspeciesType: 'bankara' },
    { name: 'バレルスピナー' },
    { name: 'オーダースピナーレプリカ', subspeciesType: 'order' },
    { name: 'バレルスピナーデコ', subspeciesType: 'colab&custom' },
    { name: 'ハイドラント' },
    { name: 'ハイドラントカスタム', subspeciesType: 'colab&custom' },
    { name: 'ハイドラント圧', subspeciesType: 'bankara', ruby: { target: '圧', text: 'アツ' } },
    { name: 'クーゲルシュライバー' },
    { name: 'クーゲルシュライバーヒュー', subspeciesType: 'colab&custom' },
    { name: 'ノーチラス47' },
    { name: 'ノーチラス79', subspeciesType: 'colab&custom' },
    { name: 'イグザミナー' },
    { name: 'イグザミナーヒュー', subspeciesType: 'colab&custom' },
  ],
  マニューバー: [
    { name: 'スパッタリー' },
    { name: 'スパッタリーヒュー', subspeciesType: 'colab&custom' },
    { name: 'スパッタリーOWL', subspeciesType: 'bankara' },
    { name: 'スプラマニューバー' },
    { name: 'オーダーマニューバーレプリカ', subspeciesType: 'order' },
    { name: 'スプラマニューバーコラボ', subspeciesType: 'colab&custom' },
    { name: 'スプラマニューバー耀', subspeciesType: 'bankara', ruby: { target: '耀', text: 'ヨウ' } },
    { name: 'ケルビン525' },
    { name: 'ケルビン525デコ', subspeciesType: 'colab&custom' },
    { name: 'デュアルスイーパー' },
    { name: 'デュアルスイーパーカスタム', subspeciesType: 'colab&custom' },
    { name: 'デュアルスイーパー蹄', subspeciesType: 'bankara', ruby: { target: '蹄', text: 'テイ' } },
    { name: 'クアッドホッパーブラック' },
    { name: 'クアッドホッパーホワイト', subspeciesType: 'colab&custom' },
    { name: 'ガエンFF' },
    { name: 'ガエンFFカスタム', subspeciesType: 'bankara' },
  ],
  シェルター: [
    { name: 'パラシェルター' },
    { name: 'パラシェルターソレーラ', subspeciesType: 'colab&custom' },
    { name: 'オーダーシェルターレプリカ', subspeciesType: 'order' },
    { name: 'キャンピングシェルター' },
    { name: 'キャンピングシェルターソレーラ', subspeciesType: 'colab&custom' },
    { name: 'キャンピングシェルターCREM', subspeciesType: 'bankara' },
    { name: 'スパイガジェット' },
    { name: 'スパイガジェットソレーラ', subspeciesType: 'colab&custom' },
    { name: 'スパイガジェット繚', subspeciesType: 'bankara', ruby: { target: '繚', text: 'リョウ' } },
    { name: '24式張替傘・甲', ruby: { target: '24', text: 'フタヨン' } },
    { name: '24式張替傘・乙', subspeciesType: 'colab&custom', ruby: { target: '24', text: 'フタヨン' } },
  ],
  ブラスター: [
    { name: 'ノヴァブラスター' },
    { name: 'ノヴァブラスターネオ', subspeciesType: 'colab&custom' },
    { name: 'ホットブラスター' },
    { name: 'ホットブラスターカスタム', subspeciesType: 'colab&custom' },
    { name: 'ホットブラスター艶', subspeciesType: 'bankara', ruby: { target: '艶', text: 'エン' } },
    { name: 'オーダーブラスターレプリカ', subspeciesType: 'order' },
    { name: 'ロングブラスター' },
    { name: 'ロングブラスターカスタム', subspeciesType: 'colab&custom' },
    { name: 'クラッシュブラスター' },
    { name: 'クラッシュブラスターネオ', subspeciesType: 'colab&custom' },
    { name: 'ラピッドブラスター' },
    { name: 'ラピッドブラスターデコ', subspeciesType: 'colab&custom' },
    { name: 'Rブラスターエリート' },
    { name: 'Rブラスターエリートデコ', subspeciesType: 'colab&custom' },
    { name: 'RブラスターエリートWNTR', subspeciesType: 'bankara' },
    { name: 'S-BLAST92' },
    { name: 'S-BLAST91', subspeciesType: 'colab&custom' },
  ],
  フデ: [
    { name: 'パブロ' },
    { name: 'パブロヒュー', subspeciesType: 'colab&custom' },
    { name: 'ホクサイ' },
    { name: 'ホクサイヒュー', subspeciesType: 'colab&custom' },
    { name: 'ホクサイ彗', subspeciesType: 'bankara', ruby: { target: '彗', text: 'スイ' } },
    { name: 'オーダーブラシレプリカ', subspeciesType: 'order' },
    { name: 'フィンセント' },
    { name: 'フィンセントヒュー', subspeciesType: 'colab&custom' },
    { name: 'フィンセントBRNZ', subspeciesType: 'bankara' },
  ],
  ストリンガー: [
    { name: 'トライストリンガー' },
    { name: 'トライストリンガーコラボ', subspeciesType: 'colab&custom' },
    { name: 'トライストリンガー燈', subspeciesType: 'bankara', ruby: { target: '燈', text: 'トウ' } },
    { name: 'オーダーストリンガーレプリカ', subspeciesType: 'order' },
    { name: 'LACT-450' },
    { name: 'LACT-450デコ', subspeciesType: 'colab&custom' },
    { name: 'LACT-450MILK', subspeciesType: 'bankara' },
    { name: 'フルイドV' },
    { name: 'フルイドVカスタム', subspeciesType: 'colab&custom' },
  ],
  ワイパー: [
    { name: 'ドライブワイパー' },
    { name: 'ドライブワイパーデコ', subspeciesType: 'colab&custom' },
    { name: 'ドライブワイパーRUST', subspeciesType: 'bankara' },
    { name: 'ジムワイパー' },
    { name: 'ジムワイパーヒュー', subspeciesType: 'colab&custom' },
    { name: 'ジムワイパー封', subspeciesType: 'bankara', ruby: { target: '封', text: 'フウ' } },
    { name: 'オーダーワイパーレプリカ', subspeciesType: 'order' },
    { name: 'デンタルワイパーミント' },
    { name: 'デンタルワイパースミ', subspeciesType: 'colab&custom' },
  ],
};

/**
 * 全ブキのフラットな配列
 */
export const ALL_WEAPONS: readonly WeaponInfo[] = Object.values(SPLATOON3_WEAPONS).flat();

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
export function getRandomWeapon(excludedTypes: readonly SubspeciesType[] = []): string {
  const filtered = ALL_WEAPONS.filter((w) => isAllowedWeapon(w, excludedTypes));
  const pool = filtered.length > 0 ? filtered : ALL_WEAPONS;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx].name;
}

/**
 * ブキ抽選ルールの定義 (全10種)
 */
export type WeaponLotteryRule =
  | 'random_allow_dup' // 完全ランダム (重複あり)
  | 'random_no_dup' // 完全ランダム (重複なし)
  | 'same_weapon_all' // おそろいブキ (全員)
  | 'same_weapon_team' // おそろいブキ (チーム別)
  | 'category_fixed_all' // ブキ種固定 (全員)
  | 'category_fixed_team' // ブキ種固定 (チーム別)
  | 'category_random_all' // ブキ種抽選 (全員)
  | 'category_random_team' // ブキ種抽選 (チーム別)
  | 'diff_category_team' // チーム内でブキ種被りなし
  | 'diff_category_all'; // 全体(8人)でブキ種被りなし

export const WEAPON_LOTTERY_RULE_LABELS: Record<WeaponLotteryRule, string> = {
  random_no_dup: '完全ランダム (重複なし)',
  random_allow_dup: '完全ランダム (重複あり)',
  same_weapon_all: 'おそろいブキ (全員)',
  same_weapon_team: 'おそろいブキ (チーム別)',
  category_fixed_all: 'ブキ種固定 (全員)',
  category_fixed_team: 'ブキ種固定 (チーム別)',
  category_random_all: 'ブキ種抽選 (全員)',
  category_random_team: 'ブキ種抽選 (チーム別)',
  diff_category_team: 'バラエティブキ(チーム別)',
  diff_category_all: 'バラエティブキ(全員)',
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
  let description = '';

  const { rule, excludedSubspeciesTypes = [] } = options;

  switch (rule) {
    case 'random_allow_dup': {
      description = '完全ランダム (重複あり)';
      for (const id of alphaIds) alpha[id] = getRandomWeapon(excludedSubspeciesTypes);
      for (const id of bravoIds) bravo[id] = getRandomWeapon(excludedSubspeciesTypes);
      break;
    }

    case 'random_no_dup': {
      description = '完全ランダム (重複なし)';
      const filtered = ALL_WEAPONS.filter((w) => isAllowedWeapon(w, excludedSubspeciesTypes));
      const pool = (filtered.length >= alphaIds.length + bravoIds.length ? filtered : ALL_WEAPONS).map(
        (w) => w.name,
      );
      const shuffled = shuffleArray(pool);
      let idx = 0;
      for (const id of alphaIds) alpha[id] = shuffled[idx++];
      for (const id of bravoIds) bravo[id] = shuffled[idx++];
      break;
    }

    case 'same_weapon_all': {
      const chosenWeapon = getRandomWeapon(excludedSubspeciesTypes);
      description = `おそろいブキ [全員: ${chosenWeapon}]`;
      for (const id of alphaIds) alpha[id] = chosenWeapon;
      for (const id of bravoIds) bravo[id] = chosenWeapon;
      break;
    }

    case 'same_weapon_team': {
      const filtered = ALL_WEAPONS.filter((w) => isAllowedWeapon(w, excludedSubspeciesTypes));
      const pool = (filtered.length >= 2 ? filtered : ALL_WEAPONS).map((w) => w.name);
      const [weaponAlpha, weaponBravo] = shuffleArray(pool);
      description = `おそろいブキ [アルファ: ${weaponAlpha} / ブラボー: ${weaponBravo}]`;
      for (const id of alphaIds) alpha[id] = weaponAlpha;
      for (const id of bravoIds) bravo[id] = weaponBravo;
      break;
    }

    case 'category_fixed_all': {
      const cat = options.fixedCategoryAll ?? 'シューター';
      description = `ブキ種固定 [全員: ${cat}]`;
      for (const id of alphaIds) alpha[id] = getRandomWeaponFromCategory(cat, excludedSubspeciesTypes);
      for (const id of bravoIds) bravo[id] = getRandomWeaponFromCategory(cat, excludedSubspeciesTypes);
      break;
    }

    case 'category_fixed_team': {
      const catA = options.fixedCategoryAlpha ?? 'シューター';
      const catB = options.fixedCategoryBravo ?? 'ローラー';
      description = `ブキ種固定 [アルファ: ${catA} / ブラボー: ${catB}]`;
      for (const id of alphaIds) alpha[id] = getRandomWeaponFromCategory(catA, excludedSubspeciesTypes);
      for (const id of bravoIds) bravo[id] = getRandomWeaponFromCategory(catB, excludedSubspeciesTypes);
      break;
    }

    case 'category_random_all': {
      const randomCat = shuffleArray(WEAPON_CATEGORIES)[0];
      description = `ブキ種抽選 [全員: ${randomCat}]`;
      for (const id of alphaIds) alpha[id] = getRandomWeaponFromCategory(randomCat, excludedSubspeciesTypes);
      for (const id of bravoIds) bravo[id] = getRandomWeaponFromCategory(randomCat, excludedSubspeciesTypes);
      break;
    }

    case 'category_random_team': {
      const [catA, catB] = shuffleArray(WEAPON_CATEGORIES);
      description = `ブキ種抽選 [アルファ: ${catA} / ブラボー: ${catB}]`;
      for (const id of alphaIds) alpha[id] = getRandomWeaponFromCategory(catA, excludedSubspeciesTypes);
      for (const id of bravoIds) bravo[id] = getRandomWeaponFromCategory(catB, excludedSubspeciesTypes);
      break;
    }

    case 'diff_category_team': {
      description = 'チーム内でブキ種被りなし';
      const assignTeam = (ids: readonly string[], teamRecord: Record<string, string>) => {
        const shuffledCats = shuffleArray(WEAPON_CATEGORIES);
        ids.forEach((id, i) => {
          const cat = shuffledCats[i % shuffledCats.length];
          teamRecord[id] = getRandomWeaponFromCategory(cat, excludedSubspeciesTypes);
        });
      };
      assignTeam(alphaIds, alpha);
      assignTeam(bravoIds, bravo);
      break;
    }

    case 'diff_category_all': {
      description = '全体でブキ種被りなし';
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

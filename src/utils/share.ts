import {
  SUBSPECIES_TYPES,
  type SubspeciesType,
  WEAPON_CATEGORIES,
  type WeaponCategory,
} from "../data/weapons";
import { ALL_WEAPONS, type LotteryWeapon } from "./lottery";

export interface CompactSharePayload {
  r: "r" | "c" | "v"; // rule
  d: 0 | 1; // allowDuplicates
  c: number[]; // categories indices
  s: number[]; // subspecies indices
  p: [string, string][]; // [playerName, weaponName]
  n?: string[]; // player names（resultsと並びが違う場合のみ付与）
  x?: string[]; // excludedWeapons
}

/**
 * 共有リンクに載せる抽選条件と結果。
 * 圧縮トークン（?s=）・旧形式（?share=）の共通形状。
 */
export interface SharePayload {
  categories: WeaponCategory[];
  subspecies: SubspeciesType[];
  allowDuplicates: boolean;
  rule: "random" | "categoryRandom" | "variety";
  players: { id: string; name: string }[];
  results: {
    player: { id: string; name: string };
    weapon: LotteryWeapon | null;
  }[];
  excludedWeapons?: string[];
}

// Base64URL エンコード/デコード
function bufferToBase64Url(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToBuffer(base64url: string): Uint8Array<ArrayBuffer> {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}

// Web標準の CompressionStream による deflate-raw 圧縮
async function compress(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  if (typeof CompressionStream !== "undefined") {
    try {
      const cs = new CompressionStream("deflate-raw");
      const writer = cs.writable.getWriter();
      writer.write(data);
      writer.close();
      const compressedBuffer = await new Response(cs.readable).arrayBuffer();
      return bufferToBase64Url(new Uint8Array(compressedBuffer));
    } catch {
      // フォールバック
    }
  }
  return bufferToBase64Url(data);
}

// Web標準の DecompressionStream による deflate-raw 解凍
async function decompress(base64url: string): Promise<string> {
  const buffer = base64UrlToBuffer(base64url);

  if (typeof DecompressionStream !== "undefined") {
    try {
      const ds = new DecompressionStream("deflate-raw");
      const writer = ds.writable.getWriter();
      writer.write(buffer);
      writer.close();
      const decompressedBuffer = await new Response(ds.readable).arrayBuffer();
      const decoder = new TextDecoder();
      return decoder.decode(decompressedBuffer);
    } catch {
      // 圧縮なしのBase64URLだった場合のフォールバック
      const decoder = new TextDecoder();
      return decoder.decode(buffer);
    }
  }
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

/**
 * 共有データを極小トークン（英数字）に圧縮エンコードする
 */
export async function encodeShareToken(data: SharePayload): Promise<string> {
  const ruleMap = { random: "r", categoryRandom: "c", variety: "v" } as const;

  const resultNames = data.results.map((r) => r.player.name);
  const playerNames = data.players.map((p) => p.name);
  const namesDiffers =
    playerNames.length > 0 &&
    (resultNames.length !== playerNames.length ||
      playerNames.some((name, i) => name !== resultNames[i]));

  const compact: CompactSharePayload = {
    r: ruleMap[data.rule] ?? "r",
    d: data.allowDuplicates ? 1 : 0,
    c: data.categories
      .map((cat) => WEAPON_CATEGORIES.indexOf(cat))
      .filter((i) => i >= 0),
    s: data.subspecies
      .map((sub) => SUBSPECIES_TYPES.indexOf(sub))
      .filter((i) => i >= 0),
    p: data.results.map((r) => [r.player.name, r.weapon?.name ?? ""]),
    n: namesDiffers ? playerNames : undefined,
    x:
      data.excludedWeapons && data.excludedWeapons.length > 0
        ? data.excludedWeapons
        : undefined,
  };

  return await compress(JSON.stringify(compact));
}

/**
 * 圧縮トークン（英数字）から共有データを復元する
 */
export async function decodeShareToken(
  token: string,
): Promise<SharePayload | null> {
  try {
    const jsonStr = await decompress(token);
    const compact = JSON.parse(jsonStr) as CompactSharePayload;

    const ruleReverse = {
      r: "random",
      c: "categoryRandom",
      v: "variety",
    } as const;
    const rule = ruleReverse[compact.r] ?? "random";
    const allowDuplicates = compact.d === 1;

    const categories = Array.isArray(compact.c)
      ? compact.c.map((i) => WEAPON_CATEGORIES[i]).filter(Boolean)
      : [...WEAPON_CATEGORIES];

    const subspecies = Array.isArray(compact.s)
      ? compact.s.map((i) => SUBSPECIES_TYPES[i]).filter(Boolean)
      : [...SUBSPECIES_TYPES];

    const weaponMap = new Map(ALL_WEAPONS.map((w) => [w.name, w]));

    const pairs: [string, string][] = Array.isArray(compact.p)
      ? compact.p.filter(
          (pair): pair is [string, string] =>
            Array.isArray(pair) && pair.length === 2,
        )
      : [];

    const playerNames =
      Array.isArray(compact.n) && compact.n.length > 0
        ? compact.n
        : pairs.map(([playerName]) => playerName);

    const players = playerNames.map((name) => ({
      id: crypto.randomUUID(),
      name,
    }));

    const results = pairs.map(([playerName, weaponName], index) => ({
      player: players[index] ?? { id: crypto.randomUUID(), name: playerName },
      weapon: weaponName ? (weaponMap.get(weaponName) ?? null) : null,
    }));

    return {
      categories: categories.length > 0 ? categories : [...WEAPON_CATEGORIES],
      subspecies: subspecies.length > 0 ? subspecies : [...SUBSPECIES_TYPES],
      allowDuplicates,
      rule,
      players,
      results,
      excludedWeapons: compact.x ?? [],
    };
  } catch {
    return null;
  }
}

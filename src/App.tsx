import * as lucideReact from "lucide-react";
import { useState } from "react";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import {
  SUBSPECIES_TYPE_LABELS,
  SUBSPECIES_TYPES,
  type SubspeciesType,
  WEAPON_CATEGORIES,
  type WeaponCategory,
} from "./data/weapons";
import { ALL_WEAPONS, drawWeapons, type LotteryWeapon } from "./utils/lottery";

function App() {
  interface Player {
    id: string;
    name: string;
  }

  interface PlayerResult {
    player: Player;
    weapon: LotteryWeapon | null;
  }

  const [selectedCategories, setSelectedCategories] = useState<
    WeaponCategory[]
  >([...WEAPON_CATEGORIES]);
  const [selectedSubspecies, setSelectedSubspecies] = useState<
    SubspeciesType[]
  >([...SUBSPECIES_TYPES]);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "プレイヤー1" },
    { id: "2", name: "プレイヤー2" },
  ]);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [shareFormat, setShareFormat] = useState<"markdown" | "plain">(
    "markdown",
  );
  const leftPanelRef = usePanelRef();

  const togglePanel = () => {
    const panel = leftPanelRef.current;
    if (!panel) {
      return;
    }
    if (panel.isCollapsed()) {
      panel.expand();
      setIsCollapsed(false);
    } else {
      panel.collapse();
      setIsCollapsed(true);
    }
  };

  // 条件に合うブキの総数と、不足しているかの判定
  const availableWeaponCount = ALL_WEAPONS.filter((w) => {
    if (!selectedCategories.includes(w.category)) {
      return false;
    }
    if (w.subspeciesType) {
      return selectedSubspecies.includes(w.subspeciesType);
    }
    return true;
  }).length;

  const isShortage = allowDuplicates
    ? availableWeaponCount === 0
    : availableWeaponCount < players.length;

  const addPlayer = () => {
    if (players.length >= 8) {
      return;
    }
    const nextNumber = players.length + 1;
    setPlayers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: `プレイヤー${nextNumber}` },
    ]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) {
      return;
    }
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePlayerName = (id: string, newName: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p)),
    );
  };

  const toggleCategory = (category: WeaponCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleSubspecies = (subspecies: SubspeciesType) => {
    setSelectedSubspecies((prev) =>
      prev.includes(subspecies)
        ? prev.filter((c) => c !== subspecies)
        : [...prev, subspecies],
    );
  };

  const selectAll = () => setSelectedCategories([...WEAPON_CATEGORIES]);
  const clearAll = () => setSelectedCategories([]);

  const handleDraw = () => {
    const drawnWeapons = drawWeapons({
      categories: selectedCategories,
      subspecies: selectedSubspecies,
      count: players.length,
      allowDuplicates,
    });

    const newResults: PlayerResult[] = players.map((player, index) => ({
      player,
      weapon: drawnWeapons[index] ?? null,
    }));

    setResults(newResults);
  };

  // プレイヤーごとの個別再抽選
  const handleRedrawSingle = (playerId: string) => {
    const pool = ALL_WEAPONS.filter((w) => {
      if (!selectedCategories.includes(w.category)) {
        return false;
      }
      if (w.subspeciesType) {
        return selectedSubspecies.includes(w.subspeciesType);
      }
      return true;
    });

    // 被りなし設定の場合は、他のプレイヤーが現在持っているブキを除外
    const otherAssignedNames = allowDuplicates
      ? []
      : results
          .filter((r) => r.player.id !== playerId && r.weapon !== null)
          .map((r) => r.weapon?.name);

    const availablePool = pool.filter(
      (w) => !otherAssignedNames.includes(w.name),
    );
    if (availablePool.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * availablePool.length);
    const newWeapon = availablePool[randomIndex];

    setResults((prev) =>
      prev.map((r) =>
        r.player.id === playerId ? { ...r, weapon: newWeapon } : r,
      ),
    );
  };

  // シェア用テキストの生成
  const generateShareText = () => {
    if (results.length === 0) {
      return "";
    }
    const lines = results.map(({ player, weapon }, index) => {
      const pName = player.name || `プレイヤー${index + 1}`;
      if (!weapon) {
        return shareFormat === "markdown"
          ? `- **${pName}**：なし`
          : `${pName}: なし`;
      }
      const sub = weapon.subspeciesType
        ? `・${SUBSPECIES_TYPE_LABELS[weapon.subspeciesType]}`
        : "";
      return shareFormat === "markdown"
        ? `- **${pName}**：${weapon.name}（${weapon.category}${sub}）`
        : `${pName}: ${weapon.name} (${weapon.category}${sub})`;
    });

    if (shareFormat === "markdown") {
      return `## スプラ3 ブキ抽選結果 \n\n${lines.join("\n")}`;
    }
    return `スプラ3 ブキ抽選結果\n${lines.join("\n")}`;
  };

  // クリップボードへコピー
  const handleCopy = async () => {
    const text = generateShareText();
    if (!text) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // コピー失敗時のフォールバック（何もしない）
    }
  };

  // X（Twitter）でシェア
  const handleShareTwitter = () => {
    const text = generateShareText();
    if (!text) {
      return;
    }
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, "_blank", "noopener,noreferrer");
  };

  // シェアボタングループ
  const renderShareButtons = () => (
    <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 p-1.5">
      <button
        type="button"
        onClick={handleCopy}
        title="結果をクリップボードにコピー"
        className="flex min-w-28 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-black text-slate-300 shadow-sm transition hover:bg-slate-700 active:scale-95 font-button cursor-pointer"
      >
        {isCopied ? (
          <>
            <lucideReact.Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-700">コピー完了！</span>
          </>
        ) : (
          <>
            <lucideReact.Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>結果をコピー</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleShareTwitter}
        title="X (Twitter) でシェア"
        className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white active:scale-95 font-button cursor-pointer"
      >
        <svg
          aria-hidden="true"
          className="w-3 h-3 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>ポスト</span>
      </button>
      <div className="flex shrink-0 items-center rounded-lg bg-slate-800 p-0.5 text-[11px] font-bold font-button">
        {(["markdown", "plain"] as const).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => setShareFormat(format)}
            className={`rounded-md px-2.5 py-1.5 transition cursor-pointer ${
              shareFormat === format
                ? "bg-yellow-400 text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {format === "markdown" ? "Markdown" : "プレーン"}
          </button>
        ))}
      </div>
    </div>
  );

  function WeaponName({ weapon }: { weapon: LotteryWeapon }) {
    if (!weapon.ruby) {
      return <span className="inline-block">{weapon.name}</span>;
    }

    const { target, text } = weapon.ruby;
    const parts = weapon.name.split(target);

    return (
      <span className="inline-block">
        {parts[0]}
        <ruby>
          {target}
          <rt className="text-xs text-yellow-300 font-normal select-none">
            {text}
          </rt>
        </ruby>
        {parts[1]}
      </span>
    );
  }

  // 設定コンポーネント（PC左ペイン・スマホ設定画面・ボトムシートで共通使用）
  const renderSettings = () => (
    <>
      {/* カテゴリ絞り込み */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 lg:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
            <span>ブキ種フィルター</span>
            <span className="text-xs font-normal text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
              {availableWeaponCount}種
            </span>
          </span>
          <div className="space-x-3 text-xs font-button">
            <button
              type="button"
              onClick={selectAll}
              className="text-slate-400 hover:text-yellow-400 underline cursor-pointer"
            >
              全選択
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-slate-400 hover:text-yellow-400 underline cursor-pointer"
            >
              全解除
            </button>
          </div>
        </div>

        {/* カテゴリボタン */}
        <div className="flex flex-wrap gap-2">
          {WEAPON_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer font-button ${
                  isSelected
                    ? "bg-yellow-400 text-slate-900 shadow-sm"
                    : "bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* 亜種フィルター */}
        <div className="mt-5 pt-4 border-t border-slate-700/60">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-300">
              ブキ亜種フィルター
            </span>
            <div className="space-x-3 text-xs font-button">
              <button
                type="button"
                onClick={() => setSelectedSubspecies([...SUBSPECIES_TYPES])}
                className="text-slate-400 hover:text-yellow-400 underline cursor-pointer"
              >
                全選択
              </button>
              <button
                type="button"
                onClick={() => setSelectedSubspecies([])}
                className="text-slate-400 hover:text-yellow-400 underline cursor-pointer"
              >
                全解除
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUBSPECIES_TYPES.map((subspecies) => {
              const isSelected = selectedSubspecies.includes(subspecies);
              return (
                <button
                  key={subspecies}
                  type="button"
                  onClick={() => toggleSubspecies(subspecies)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer font-button ${
                    isSelected
                      ? "bg-yellow-400 text-slate-900 shadow-sm"
                      : "bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  {SUBSPECIES_TYPE_LABELS[subspecies]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* プレイヤー設定エリア */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 lg:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-300">
            抽選するプレイヤー ({players.length}人)
          </span>
          <label className="flex items-center gap-2.5 text-xs text-slate-300 font-bold cursor-pointer select-none">
            <span>ブキ被りを許可</span>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:bg-yellow-400 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4"></div>
            </div>
          </label>
        </div>

        {/* プレイヤー名入力リスト */}
        <div className="space-y-2 max-h-47 overflow-y-auto pr-1.5 custom-scrollbar">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 w-6 text-right font-result">
                #{index + 1}
              </span>
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                placeholder={`プレイヤー${index + 1}`}
                className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-result transition-colors"
              />
              {players.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePlayer(player.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700/60 hover:bg-rose-500/80 text-slate-400 hover:text-white transition cursor-pointer text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* プレイヤー追加ボタン */}
        {players.length < 8 && (
          <button
            type="button"
            onClick={addPlayer}
            className="w-full mt-4 py-2 border-2 border-dashed border-slate-700 hover:border-yellow-400/60 rounded-xl text-xs font-bold text-slate-400 hover:text-yellow-400 transition cursor-pointer font-button"
          >
            ＋ プレイヤー追加
          </button>
        )}
      </section>
    </>
  );

  // 結果カードリスト（個別再抽選ボタン付き）
  const renderResultsList = () => (
    <div className="space-y-3 w-full">
      {results.map(({ player, weapon }, index) => (
        <div
          key={player.id}
          className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 lg:px-6 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 transition hover:border-slate-600 min-h-17"
        >
          {/* 上段（スマホ） / 左側（PC）: プレイヤー名 */}
          <div className="flex items-center justify-between lg:justify-start gap-2.5 shrink-0 min-w-28">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 font-result">
                #{index + 1}
              </span>
              <span className="font-bold text-yellow-400 font-result text-base">
                {player.name || `プレイヤー${index + 1}`}
              </span>
            </div>

            {/* スマホのみ上段右端に再抽選ボタンを配置 */}
            <button
              type="button"
              onClick={() => handleRedrawSingle(player.id)}
              title={`${player.name || `プレイヤー${index + 1}`} のブキを再抽選`}
              className="lg:hidden p-1.5 rounded-xl bg-slate-700/60 hover:bg-yellow-400 hover:text-slate-900 text-slate-300 transition active:scale-90 cursor-pointer shrink-0"
            >
              <lucideReact.RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* 下段（スマホ） / 右側（PC）: ブキ情報 ＆ PC用再抽選ボタン */}
          <div className="flex items-center justify-between lg:justify-end gap-3 flex-1 min-w-0 pt-2 lg:pt-0 border-t border-slate-700/50 lg:border-t-0">
            {weapon ? (
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-x-2.5 gap-y-1 min-w-0 flex-1">
                {/* カテゴリバッジ */}
                <span className="text-[10px] lg:text-[11px] font-semibold px-2 lg:px-2.5 py-0.5 bg-yellow-400/20 text-yellow-300 rounded-full font-result shrink-0">
                  {weapon.category}
                </span>

                {/* ブキ名 */}
                <span className="text-base lg:text-lg font-bold font-result text-white">
                  <WeaponName weapon={weapon} />
                </span>

                {/* 亜種ラベル */}
                {weapon.subspeciesType && (
                  <span className="text-xs text-slate-400 font-result shrink-0">
                    ({SUBSPECIES_TYPE_LABELS[weapon.subspeciesType]})
                  </span>
                )}
              </div>
            ) : (
              <p className="text-rose-400 text-xs py-1 font-result">
                条件に合うブキがありません
              </p>
            )}

            {/* PC専用 再抽選ボタン（右端固定！） */}
            <button
              type="button"
              onClick={() => handleRedrawSingle(player.id)}
              title={`${player.name || `プレイヤー${index + 1}`} のブキを再抽選`}
              className="hidden lg:flex p-2 rounded-xl bg-slate-700/60 hover:bg-yellow-400 hover:text-slate-900 text-slate-300 transition active:scale-90 cursor-pointer shrink-0 ml-2"
            >
              <lucideReact.RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="h-14 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          {/* 左ペイン開閉ボタン */}
          <button
            type="button"
            onClick={togglePanel}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition cursor-pointer"
            title={isCollapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
          >
            {isCollapsed ? (
              <lucideReact.PanelLeftOpen className="w-5 h-5" />
            ) : (
              <lucideReact.PanelLeftClose className="w-5 h-5" />
            )}
          </button>
          <h1 className="text-xl lg:text-2xl font-title tracking-wider text-yellow-400">
            スプラ３ ブキ抽選アプリ
          </h1>
        </div>
      </header>

      {/* 1. PC向けレイアウト（lg以上）：リサイズ可能2ペイン */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <Group orientation="horizontal" className="h-full w-full">
          {/* 左ペイン: フィルター ＆ プレイヤー管理 ＆ 抽選ボタン */}
          <Panel
            panelRef={leftPanelRef}
            defaultSize={450}
            minSize={400}
            collapsible={true}
            collapsedSize={0}
            collapsedThreshold={80}
            onResize={(size) => {
              setIsCollapsed(size.inPixels === 0);
            }}
            className={`h-full custom-scrollbar bg-slate-900/40 ${
              isCollapsed ? "hidden overflow-hidden" : "overflow-y-auto"
            }`}
          >
            {!isCollapsed && (
              <div className="p-6 space-y-6 min-w-95">
                {renderSettings()}

                {/* 抽選ボタン */}
                <button
                  type="button"
                  onClick={handleDraw}
                  disabled={isShortage}
                  className="w-full bg-yellow-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-lg py-4 rounded-2xl shadow-lg transition duration-150 cursor-pointer"
                >
                  {availableWeaponCount === 0
                    ? `条件に合うブキがありません (${availableWeaponCount}ブキ / ${players.length}人)`
                    : isShortage
                      ? `条件に合うブキが足りません (${availableWeaponCount}ブキ / ${players.length}人)`
                      : `${players.length}人のブキを抽選する！`}
                </button>
              </div>
            )}
          </Panel>

          {/* スプリッター（リサイザーハンドル） */}
          <Separator className="w-2 bg-slate-950/40 hover:bg-yellow-400/80 active:bg-yellow-400 transition-colors cursor-col-resize relative flex items-center justify-center group shrink-0">
            <div className="w-0.5 h-8 bg-slate-600 group-hover:bg-slate-900 rounded-full transition-colors" />
          </Separator>

          {/* 右ペイン: 抽選結果 */}
          <Panel
            minSize={590}
            className="h-full overflow-y-auto custom-scrollbar p-6 flex flex-col items-center"
          >
            <div className="w-full max-w-2xl py-2">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
                <span className="text-sm font-bold text-slate-400 font-result">
                  抽選結果 {results.length > 0 && `(${results.length}人分)`}
                </span>
                {results.length > 0 && renderShareButtons()}
              </div>

              {results.length > 0 ? (
                renderResultsList()
              ) : (
                <div className="text-center text-slate-500 font-result py-24">
                  左ペインで条件とプレイヤーを設定して
                  <br />「{players.length}人のブキを抽選する！」を押してね
                </div>
              )}
            </div>
          </Panel>
        </Group>
      </div>

      {/* 2. スマホ・タブレット向けレイアウト（lg未満）：全画面切り替え ＆ ボトムシート */}
      <div className="flex lg:hidden flex-1 overflow-hidden relative flex-col">
        {results.length === 0 ? (
          // 【抽選前】：全面に設定画面を表示
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-28 space-y-4">
            {renderSettings()}
          </div>
        ) : (
          // 【抽選後】：全面に結果リストを表示
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-28">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 font-result">
                抽選結果 ({results.length}人分)
              </span>
              {renderShareButtons()}
            </div>
            {renderResultsList()}
          </div>
        )}

        {/* スマホ専用 固定フッターバー */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800 z-20">
          {results.length === 0 ? (
            // 抽選前：大きな抽選ボタン1個
            <button
              type="button"
              onClick={handleDraw}
              disabled={isShortage}
              className="w-full bg-yellow-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-lg py-3.5 rounded-2xl shadow-lg transition duration-150 cursor-pointer"
            >
              {availableWeaponCount === 0
                ? `条件に合うブキがありません (${availableWeaponCount}ブキ)`
                : isShortage
                  ? `条件に合うブキが足りません (${availableWeaponCount}ブキ / ${players.length}人)`
                  : `${players.length}人のブキを抽選する！`}
            </button>
          ) : (
            // 抽選後：[設定] と [抽選する！] の2分割ボタン
            <div className="relative flex gap-3">
              {/* 抽選ボタンdisabled時の「設定を確認してね」吹き出し */}
              {isShortage && (
                <div className="absolute -top-12 left-4 z-30 animate-bounce pointer-events-none">
                  <div className="relative bg-yellow-400 text-slate-900 text-xs font-bold font-button px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                    <span>設定を確認してね</span>
                    {/* 吹き出しの三角 */}
                    <div className="absolute -bottom-1 left-6 w-2.5 h-2.5 bg-yellow-400 rotate-45" />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsSheetOpen(true)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-white font-bold font-button text-base py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <lucideReact.SlidersHorizontal className="w-5 h-5 text-yellow-400" />
                設定
              </button>
              <button
                type="button"
                onClick={handleDraw}
                disabled={isShortage}
                className="flex-[1.5] bg-yellow-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-base py-3.5 rounded-2xl shadow-lg transition duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                <lucideReact.RotateCcw className="w-5 h-5" />
                抽選する！
              </button>
            </div>
          )}
        </div>

        {/* スマホ専用 ボトムシート（設定モーダル） */}
        {isSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* 背景オーバーレイ */}
            <button
              type="button"
              aria-label="閉じる"
              className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-default"
              onClick={() => setIsSheetOpen(false)}
            />

            {/* シート本体 */}
            <div className="relative bg-slate-900 border-t border-slate-700 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
              {/* ツマミ（ハンドルバー） */}
              <div className="pt-3 pb-1 flex justify-center shrink-0">
                <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
              </div>

              {/* シートヘッダー */}
              <div className="px-6 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
                <span className="font-bold text-slate-200 font-result text-sm">
                  抽選条件・プレイヤー設定
                </span>
                <button
                  type="button"
                  onClick={() => setIsSheetOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <lucideReact.X className="w-5 h-5" />
                </button>
              </div>

              {/* シート内スクロールエリア */}
              <div className="p-4 overflow-y-auto custom-scrollbar space-y-4 flex-1">
                {renderSettings()}
              </div>

              {/* シート内フッター */}
              <div className="p-4 bg-slate-900/95 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSheetOpen(false);
                    handleDraw();
                  }}
                  disabled={isShortage}
                  className="w-full bg-yellow-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-base py-3.5 rounded-2xl shadow-lg transition duration-150 cursor-pointer"
                >
                  {isShortage
                    ? `条件に合うブキが足りません (${availableWeaponCount}ブキ)`
                    : "設定を適用して抽選する！"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

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

  function WeaponName({ weapon }: { weapon: LotteryWeapon }) {
    if (!weapon.ruby) {
      return <span>{weapon.name}</span>;
    }

    const { target, text } = weapon.ruby;
    const parts = weapon.name.split(target);

    return (
      <span className="inline-flex items-baseline">
        {parts[0]}
        <ruby className="leading-none">
          {target}
          <rt className="text-xs text-yellow-300 font-normal leading-none select-none">
            {text}
          </rt>
        </ruby>
        {parts[1]}
      </span>
    );
  }

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="h-14 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePanel}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition cursor-pointer"
            title={isCollapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
          >
            {isCollapsed ? (
              <lucideReact.PanelLeftOpen className="w-5 h-5" />
            ) : (
              <lucideReact.PanelLeftClose className="w-5 h-5" />
            )}
          </button>
          <h1 className="text-xl md:text-2xl font-title tracking-wider text-yellow-400">
            スプラ３ ブキ抽選アプリ
          </h1>
        </div>
      </header>

      {/* 2ペインエリア */}
      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal" className="h-full">
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
                {/* カテゴリ絞り込み */}
                <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-300">
                      ブキ種フィルター
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
                          onClick={() =>
                            setSelectedSubspecies([...SUBSPECIES_TYPES])
                          }
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
                        const isSelected =
                          selectedSubspecies.includes(subspecies);
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
                <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
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
                          onChange={(e) =>
                            updatePlayerName(player.id, e.target.value)
                          }
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

                {/* 抽選ボタン */}
                <button
                  type="button"
                  onClick={handleDraw}
                  disabled={isShortage}
                  className="w-full bg-yellow-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-lg py-4 rounded-2xl shadow-lg transition duration-150 cursor-pointer"
                >
                  {availableWeaponCount === 0
                    ? "条件に合うブキがありません"
                    : isShortage
                      ? `ブキが足りません (${availableWeaponCount} / ${players.length}人)`
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
                <span className="text-sm font-bold text-slate-400">
                  抽選結果 {results.length > 0 && `(${results.length}人分)`}
                </span>
              </div>

              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map(({ player, weapon }, index) => (
                    <div
                      key={player.id}
                      className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 px-6 shadow-md flex items-center justify-between gap-4 transition hover:border-slate-600 min-h-17"
                    >
                      {/* プレイヤー名 */}
                      <div className="flex items-center gap-3 min-w-30">
                        <span className="text-xs font-bold text-slate-500">
                          #{index + 1}
                        </span>
                        <span className="font-bold text-yellow-400 font-result text-base">
                          {player.name || `プレイヤー${index + 1}`}
                        </span>
                      </div>

                      {/* 当たったブキ */}
                      {weapon ? (
                        <div className="flex items-center gap-3 flex-wrap justify-end">
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-yellow-400/20 text-yellow-300 rounded-full font-result">
                            {weapon.category}
                          </span>
                          <span className="text-xl font-bold font-result text-white">
                            <WeaponName weapon={weapon} />
                          </span>
                          {weapon.subspeciesType && (
                            <span className="text-xs text-slate-400 font-result">
                              ({SUBSPECIES_TYPE_LABELS[weapon.subspeciesType]})
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-rose-400 text-xs py-4 font-result">
                          条件に合うブキがありません
                        </p>
                      )}
                    </div>
                  ))}
                </div>
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
    </div>
  );
}

export default App;

import { useState } from "react";
import {
  SUBSPECIES_TYPE_LABELS,
  SUBSPECIES_TYPES,
  type SubspeciesType,
  WEAPON_CATEGORIES,
  type WeaponCategory,
} from "./data/weapons";
import { getRandomWeapon, type LotteryWeapon } from "./utils/lottery";

function App() {
  const [selectedCategories, setSelectedCategories] = useState<
    WeaponCategory[]
  >([...WEAPON_CATEGORIES]);
  const [weapon, setWeapon] = useState<LotteryWeapon | null>(null);
  const [selectedSubspecies, setSelectedSubspecies] = useState<
    SubspeciesType[]
  >([...SUBSPECIES_TYPES]);

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
    setWeapon(getRandomWeapon(selectedCategories, selectedSubspecies));
  };

  function WeaponName({ weapon }: { weapon: LotteryWeapon }) {
    if (!weapon.ruby) {
      return <span>{weapon.name}</span>;
    }

    const { target, text } = weapon.ruby;
    const parts = weapon.name.split(target);

    return (
      <span>
        {parts[0]}
        <ruby>
          {target}
          <rt className="text-xs text-yellow-300">{text}</rt>
        </ruby>
        {parts[1]}
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-title mb-8 tracking-wider">
        スプラ３ ブキ抽選アプリ
      </h1>

      {/* カテゴリ絞り込み */}
      <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 w-full max-w-md mb-6 shadow-xl">
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

      {/* 結果表示 */}
      <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8 w-full max-w-sm text-center mb-8 shadow-xl">
        {weapon ? (
          <div className="font-result">
            <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-400 text-slate-900 rounded-full mb-3 inline-block">
              {weapon.category}
            </span>
            <p className="text-2xl font-bold font-result">
              <WeaponName weapon={weapon} />
            </p>
            {weapon.subspeciesType && (
              <span className="text-xs text-slate-400 mt-1 block">
                {SUBSPECIES_TYPE_LABELS[weapon.subspeciesType]}
              </span>
            )}
          </div>
        ) : (
          <p className="text-slate-400 font-result">
            {selectedCategories.length === 0
              ? "ブキ種を1つ以上選んでください"
              : "「ブキを抽選する」を押してください"}
          </p>
        )}
      </div>

      {/* 抽選ボタン */}
      <button
        type="button"
        onClick={handleDraw}
        disabled={selectedCategories.length === 0}
        className="bg-yellow-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-95 text-slate-900 font-black font-button text-lg px-8 py-4 rounded-full shadow-lg transition duration-150 cursor-pointer"
      >
        {selectedCategories.length === 0
          ? "ブキ種を選んでください"
          : "ブキを抽選する！"}
      </button>
    </main>
  );
}

export default App;

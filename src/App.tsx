import { useState } from "react"
import { getRandomWeapon, type LotteryWeapon } from "./utils/lottery"

function App() {
  const [weapon, setWeapon] = useState<LotteryWeapon | null>(null)

  const handleDraw = () => {
    setWeapon(getRandomWeapon())
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-title mb-8 tracking-wider">
        スプラ３ ブキ抽選アプリ
      </h1>

      {/* 結果表示 */}
      <div className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-8 w-full max-w-sm text-center mb-8 shadow-xl">
        {weapon ? (
          <div className="font-result">
            <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-400 text-slate-900 rounded-full mb-3 inline-block">
              {weapon.category}
            </span>
            <p className="text-2xl font-bold font-result">{weapon.name}</p>
          </div>
        ) : (
          <p className="text-slate-400 font-result">
            「ブキを抽選する」を押してください
          </p>
        )}
      </div>

      {/* 抽選ボタン */}
      <button
        type="button"
        onClick={handleDraw}
        className="bg-yellow-400 hover:bg-amber-300 active:scale-95 text-slate-900 font-black font-button text-lg px-8 py-4 rounded-full shadow-lg transition duration-150 cursor-pointer"
      >
        ブキを抽選する！
      </button>
    </main>
  )
}

export default App

import * as lucideReact from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SiGithub } from "react-icons/si";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import packageJson from "../package.json";
import {
  SUBSPECIES_TYPE_LABELS,
  SUBSPECIES_TYPES,
  type SubspeciesType,
  WEAPON_CATEGORIES,
  type WeaponCategory,
} from "./data/weapons";
import { ALL_WEAPONS, drawWeapons, type LotteryWeapon } from "./utils/lottery";

function App() {
  const { t, i18n } = useTranslation();
  interface Player {
    id: string;
    name: string;
  }

  interface PlayerResult {
    player: Player;
    weapon: LotteryWeapon | null;
  }

  interface PlayerTemplate {
    id: string;
    name: string;
    players: Player[];
  }

  interface LotteryHistory {
    id: string;
    createdAt: string;
    results: PlayerResult[];
    categories: WeaponCategory[];
    subspecies: SubspeciesType[];
    allowDuplicates: boolean;
    rule: "random" | "categoryRandom" | "variety";
  }

  const [selectedCategories, setSelectedCategories] = useState<
    WeaponCategory[]
  >([...WEAPON_CATEGORIES]);
  const [selectedSubspecies, setSelectedSubspecies] = useState<
    SubspeciesType[]
  >([...SUBSPECIES_TYPES]);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: t("player1") },
    { id: "2", name: t("player2") },
  ]);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [lotteryRule, setLotteryRule] = useState<
    "random" | "categoryRandom" | "variety"
  >("random");
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isImageSaving, setIsImageSaving] = useState<boolean>(false);
  const [history, setHistory] = useState<LotteryHistory[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGithubMenuOpen, setIsGithubMenuOpen] = useState<boolean>(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false);
  const [excludedWeapons, setExcludedWeapons] = useState<string[]>([]);
  const [templates, setTemplates] = useState<PlayerTemplate[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [animationEnabled, setAnimationEnabled] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(1200);
  const [isRolling, setIsRolling] = useState(false);
  const [expandedTemplateIds, setExpandedTemplateIds] = useState<string[]>([]);
  const [_editingTemplateId, _setEditingTemplateId] = useState<string | null>(
    null,
  );
  const [detailSection, setDetailSection] = useState<
    "excluded" | "templates" | "animation"
  >("excluded");
  const language = i18n.language === "en" ? "en" : "ja";
  const [shareFormat, setShareFormat] = useState<"markdown" | "plain">(
    "markdown",
  );
  const leftPanelRef = usePanelRef();
  const historyButtonRef = useRef<HTMLButtonElement>(null);
  const historyMenuRef = useRef<HTMLDivElement>(null);
  const historySheetRef = useRef<HTMLDivElement>(null);
  const githubButtonRef = useRef<HTMLDivElement>(null);
  const githubMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const otherMenuRef = useRef<HTMLDivElement>(null);
  const rollingTimerRef = useRef<number | null>(null);
  const detailSettingsLoadedRef = useRef(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("spla3-detail-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings) as Partial<{
          excludedWeapons: string[];
          templates: PlayerTemplate[];
          animationEnabled: boolean;
          animationDuration: number;
        }>;
        setExcludedWeapons(settings.excludedWeapons ?? []);
        setTemplates(settings.templates ?? []);
        setAnimationEnabled(settings.animationEnabled ?? false);
        setAnimationDuration(settings.animationDuration ?? 1200);
      }
      detailSettingsLoadedRef.current = true;
      const saved = localStorage.getItem("spla3-lottery-history");
      if (saved) {
        setHistory(JSON.parse(saved) as LotteryHistory[]);
      }
    } catch {
      // 保存データが壊れていてもアプリはそのまま利用できる
    }
  }, []);

  useEffect(() => {
    if (!detailSettingsLoadedRef.current) return;
    localStorage.setItem(
      "spla3-detail-settings",
      JSON.stringify({
        excludedWeapons,
        templates,
        animationEnabled,
        animationDuration,
      }),
    );
  }, [excludedWeapons, templates, animationEnabled, animationDuration]);

  useEffect(() => {
    if (!isHistoryOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        historyButtonRef.current?.contains(target) ||
        historyMenuRef.current?.contains(target) ||
        historySheetRef.current?.contains(target)
      ) {
        return;
      }
      setIsHistoryOpen(false);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [isHistoryOpen]);

  useEffect(() => {
    if (!isGithubMenuOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        githubButtonRef.current?.contains(target) ||
        githubMenuRef.current?.contains(target)
      ) {
        return;
      }
      setIsGithubMenuOpen(false);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [isGithubMenuOpen]);

  useEffect(() => {
    if (!isLanguageMenuOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        languageButtonRef.current?.contains(target) ||
        languageMenuRef.current?.contains(target)
      ) {
        return;
      }
      setIsLanguageMenuOpen(false);
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [isLanguageMenuOpen]);

  useEffect(() => {
    if (!isOtherMenuOpen) return;
    const handleOutside = (event: PointerEvent) => {
      if (!otherMenuRef.current?.contains(event.target as Node))
        setIsOtherMenuOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isOtherMenuOpen]);

  useEffect(
    () => () => {
      if (rollingTimerRef.current)
        window.clearInterval(rollingTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const saveHistory = useCallback(
    (newResults: PlayerResult[]) => {
      const nextHistory: LotteryHistory[] = [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          results: newResults,
          categories: selectedCategories,
          subspecies: selectedSubspecies,
          allowDuplicates,
          rule: lotteryRule,
        },
        ...history,
      ].slice(0, 10);
      setHistory(nextHistory);
      localStorage.setItem(
        "spla3-lottery-history",
        JSON.stringify(nextHistory),
      );
    },
    [
      allowDuplicates,
      history,
      lotteryRule,
      selectedCategories,
      selectedSubspecies,
    ],
  );

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
    if (excludedWeapons.includes(w.name)) return false;
    if (w.subspeciesType) {
      return selectedSubspecies.includes(w.subspeciesType);
    }
    return true;
  }).length;
  const availableCategoryCount = new Set(
    ALL_WEAPONS.filter((w) => {
      if (!selectedCategories.includes(w.category)) return false;
      if (excludedWeapons.includes(w.name)) return false;
      return !w.subspeciesType || selectedSubspecies.includes(w.subspeciesType);
    }).map((w) => w.category),
  ).size;

  const isShortage =
    lotteryRule === "variety"
      ? availableCategoryCount < players.length
      : allowDuplicates
        ? availableWeaponCount === 0
        : availableWeaponCount < players.length;

  const addPlayer = () => {
    if (players.length >= 8) {
      return;
    }
    const nextNumber = players.length + 1;
    setPlayers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: `${t("player")}${nextNumber}` },
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

  const handleDraw = useCallback(() => {
    if (isRolling) return;
    const makeResults = (): PlayerResult[] => {
      const drawnWeapons = drawWeapons({
        categories: selectedCategories,
        subspecies: selectedSubspecies,
        count: players.length,
        allowDuplicates,
        rule: lotteryRule,
        excludedWeapons,
      });
      return players.map((player, index) => ({
        player,
        weapon: drawnWeapons[index] ?? null,
      }));
    };
    if (!animationEnabled) {
      const newResults = makeResults();
      setResults(newResults);
      saveHistory(newResults);
      return;
    }
    setIsRolling(true);
    rollingTimerRef.current = window.setInterval(
      () => setResults(makeResults()),
      80,
    );
    window.setTimeout(() => {
      if (rollingTimerRef.current)
        window.clearInterval(rollingTimerRef.current);
      rollingTimerRef.current = null;
      const newResults = makeResults();
      setResults(newResults);
      saveHistory(newResults);
      setIsRolling(false);
    }, animationDuration);
  }, [
    allowDuplicates,
    animationDuration,
    animationEnabled,
    excludedWeapons,
    isRolling,
    lotteryRule,
    players,
    saveHistory,
    selectedCategories,
    selectedSubspecies,
  ]);

  const restoreHistory = (item: LotteryHistory) => {
    setResults(item.results);
    setSelectedCategories(item.categories ?? [...WEAPON_CATEGORIES]);
    setSelectedSubspecies(item.subspecies ?? [...SUBSPECIES_TYPES]);
    setAllowDuplicates(item.allowDuplicates ?? false);
    setLotteryRule(item.rule ?? "random");
    setIsHistoryOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("spla3-lottery-history");
  };

  // Enterキーでも抽選できるようにする
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter" ||
        isShortage ||
        event.target instanceof HTMLButtonElement
      ) {
        return;
      }
      event.preventDefault();
      handleDraw();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isShortage, handleDraw]);

  // プレイヤーごとの個別再抽選
  const handleRedrawSingle = (playerId: string) => {
    const pool = ALL_WEAPONS.filter((w) => {
      if (!selectedCategories.includes(w.category)) {
        return false;
      }
      if (excludedWeapons.includes(w.name)) return false;
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
      const pName = player.name || `${t("player")} ${index + 1}`;
      if (!weapon) {
        return shareFormat === "markdown"
          ? `- **${pName}**：${t("none")}`
          : `${pName}: ${t("none")}`;
      }
      const sub = weapon.subspeciesType
        ? `・${SUBSPECIES_TYPE_LABELS[weapon.subspeciesType]}`
        : "";
      return shareFormat === "markdown"
        ? `- **${pName}**：${weapon.name}（${weapon.category}${sub}）`
        : `${pName}: ${weapon.name} (${weapon.category}${sub})`;
    });

    if (shareFormat === "markdown") {
      return `## ${t("resultTitleLong")} \n\n${lines.join("\n")}`;
    }
    return `${t("resultTitleLong")}\n${lines.join("\n")}`;
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

  const handleDownloadImage = () => {
    if (results.length === 0 || isImageSaving) return;
    setIsImageSaving(true);

    const canvas = document.createElement("canvas");
    const scale = 2;
    const width = 900;
    const cardHeight = 92;
    const height = 150 + results.length * cardHeight + 54;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const context = canvas.getContext("2d");
    if (!context) {
      setIsImageSaving(false);
      return;
    }
    context.scale(scale, scale);
    const imageFont = language === "ja" ? "'Zen Kaku Gothic New'" : "Inter";
    context.fillStyle = "#0f172a";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#FEFD4A";
    context.font = `900 34px ${imageFont}, sans-serif`;
    context.fillText(t("resultTitleShort"), 48, 62);
    context.fillStyle = "#94a3b8";
    context.font = `600 16px 'Google Sans Code', sans-serif`;
    context.fillText(new Date().toLocaleString("ja-JP"), 48, 92);

    results.forEach(({ player, weapon }, index) => {
      const y = 124 + index * cardHeight;
      context.fillStyle = "#26105f";
      context.beginPath();
      context.roundRect(40, y, width - 80, 72, 16);
      context.fill();
      context.fillStyle = "#6A46FE";
      context.beginPath();
      context.roundRect(56, y + 12, 270, 48, 12);
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = `700 22px 'Google Sans Code', 'LINE Seed JP', sans-serif`;
      context.fillText(
        `#${index + 1} ${player.name || `${t("player")} ${index + 1}`}`,
        74,
        y + 43,
      );
      context.fillStyle = "#FEFD4A";
      context.font = `700 18px ${imageFont}, sans-serif`;
      context.fillText(weapon?.category ?? t("none"), 350, y + 31);
      context.fillStyle = "#ffffff";
      context.font = `700 24px 'LINE Seed JP', sans-serif`;
      const weaponName = weapon?.name ?? t("noMatchWeapons");
      context.fillText(weaponName, 350, y + 57);
      if (weapon?.ruby) {
        const rubyIndex = weaponName.indexOf(weapon.ruby.target);
        if (rubyIndex >= 0) {
          const prefixWidth = context.measureText(
            weaponName.slice(0, rubyIndex),
          ).width;
          const targetWidth = context.measureText(weapon.ruby.target).width;
          context.font = `600 12px 'LINE Seed JP', sans-serif`;
          context.fillStyle = "#FEFD4A";
          const rubyWidth = context.measureText(weapon.ruby.text).width;
          context.fillText(
            weapon.ruby.text,
            350 + prefixWidth + (targetWidth - rubyWidth) / 2,
            y + 72,
          );
        }
      }
    });

    const link = document.createElement("a");
    link.download = `spla3-lottery-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setIsImageSaving(false);
  };

  // シェアボタングループ
  const renderShareButtons = () => (
    <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 p-1.5 max-lg:grid max-lg:grid-cols-[1fr_auto] max-lg:items-stretch max-lg:gap-x-0 max-lg:gap-y-1">
      <button
        type="button"
        onClick={handleCopy}
        title={t("copyResultDesc")}
        className="order-1 flex min-w-28 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-800 px-4 py-2 text-xs font-black text-slate-300 shadow-sm transition hover:bg-slate-700 active:scale-95 font-button cursor-pointer max-lg:w-fit max-lg:justify-self-end"
      >
        {isCopied ? (
          <>
            <lucideReact.Check className="w-3.5 h-3.5 text-emerald-400" />
            <span
              className={`text-emerald-500 ${language === "ja" ? "font-app-ja" : "font-app-en"}`}
            >
              {t("copied")}
            </span>
          </>
        ) : (
          <>
            <lucideReact.Copy className="w-3.5 h-3.5 text-slate-400" />
            <span className={language === "ja" ? "font-app-ja" : "font-app-ja"}>
              {t("copyResult")}
            </span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleShareTwitter}
        title={t("postDesc")}
        className="order-3 flex w-fit items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white active:scale-95 font-button cursor-pointer max-lg:w-full max-lg:justify-self-end"
      >
        <svg
          aria-hidden="true"
          className="w-3 h-3 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>{t("post")}</span>
      </button>
      <button
        type="button"
        onClick={handleDownloadImage}
        title={t("saveImageDesc")}
        className="flex items-center gap-1.5 rounded-lg bg-[#6A46FE] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#6A46FE] active:scale-95 font-button cursor-pointer max-lg:order-5 max-lg:col-span-2 max-lg:justify-self-end max-lg:hidden"
      >
        <lucideReact.ImageDown className="h-3.5 w-3.5" />
        <span>{isImageSaving ? "Saving…" : t("saveImage")}</span>
      </button>
      <div className="flex shrink-0 items-center rounded-lg bg-slate-800 p-0.5 text-[11px] font-bold font-button max-lg:contents">
        {(["markdown", "plain"] as const).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => setShareFormat(format)}
            className={`w-20 justify-self-end rounded-md px-2.5 py-1.5 transition cursor-pointer ${format === "markdown" ? "max-lg:order-2" : "max-lg:order-4"} ${
              shareFormat === format
                ? "bg-[#FEFD4A] text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {format === "markdown" ? t("markdown") : t("plain")}
          </button>
        ))}
      </div>
    </div>
  );

  const renderHistoryContent = () => (
    <div className="space-y-2">
      {history.length === 0 ? (
        <p className="py-4 text-center text-xs text-slate-500">
          {t("noHistory")}
        </p>
      ) : (
        history.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => restoreHistory(item)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-left transition hover:border-[#6A46FE] hover:bg-[#6A46FE]/20 cursor-pointer"
          >
            <span className="block text-[11px] text-slate-400">
              {new Date(item.createdAt).toLocaleString("ja-JP")}
            </span>
            <span className="block text-[11px] text-[#FEFD4A]">
              {item.rule === "categoryRandom"
                ? t("categoryRandom")
                : item.rule === "variety"
                  ? t("variety")
                  : `${t("random")}${item.allowDuplicates ? t("duplicateOn") : t("duplicateOff")}`}
            </span>
            <span className="block truncate text-xs font-bold text-white">
              {item.results
                .map((result) => result.weapon?.name ?? t("none"))
                .join(" ／ ")}
            </span>
          </button>
        ))
      )}
      {history.length > 0 && (
        <div className="sticky -bottom-4 z-10 -mx-4 -mb-6 mt-3 bg-slate-900 px-4 pb-6 pt-3">
          <button
            type="button"
            onClick={clearHistory}
            className="w-full rounded-2xl bg-[#6A46FE] py-3.5 text-sm font-black text-slate-100 shadow-lg transition hover:bg-rose-400/90 cursor-pointer"
          >
            {t("deleteHistory")}
          </button>
        </div>
      )}
    </div>
  );

  function WeaponName({
    weapon,
    muted = false,
  }: {
    weapon: LotteryWeapon;
    muted?: boolean;
  }) {
    if (!weapon.ruby) {
      return (
        <span className={`inline-block ${muted ? "text-slate-500" : ""}`}>
          {weapon.name}
        </span>
      );
    }

    const { target, text } = weapon.ruby;
    const parts = weapon.name.split(target);

    return (
      <span className={`inline-block ${muted ? "text-slate-500" : ""}`}>
        {parts[0]}
        <ruby>
          {target}
          <rt
            className={`text-xs font-normal select-none ${muted ? "text-slate-500" : "text-[#FEFD4A]"}`}
          >
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
          <span className="text-sm font-bold text-slate-300 flex items-center gap-1.5 select-none">
            <span>{t("categoryFilter")}</span>
            <span className="text-xs font-normal text-[#FEFD4A] bg-[#FEFD4A]/10 px-2 py-0.5 rounded-full">
              {availableWeaponCount}種
            </span>
          </span>
          <div className="space-x-3 text-xs font-button">
            <button
              type="button"
              onClick={selectAll}
              className="text-slate-400 hover:text-[#FEFD4A] enabled:underline cursor-pointer transition disabled:text-slate-600 disabled:cursor-not-allowed"
              disabled={selectedCategories.length === 11}
            >
              {t("selectAll")}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-slate-400 hover:text-[#FEFD4A] enabled:underline cursor-pointer transition disabled:text-slate-600 disabled:cursor-not-allowed"
              disabled={selectedCategories.length === 0}
            >
              {t("clearAll")}
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
                    ? "bg-[#FEFD4A] text-slate-900 shadow-sm"
                    : "bg-[#6A46FE] text-white hover:bg-[#6A46FE] hover:text-white"
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
            <span className="text-xs font-bold text-slate-300 select-none">
              {t("subspeciesFilter")}
            </span>
            <div className="space-x-3 text-xs font-button">
              <button
                type="button"
                onClick={() => setSelectedSubspecies([...SUBSPECIES_TYPES])}
                className="text-slate-400 hover:text-[#FEFD4A] cursor-pointer enabled:underline transition disabled:text-slate-600 disabled:cursor-not-allowed"
                disabled={selectedSubspecies.length === 6}
              >
                {t("selectAll")}
              </button>
              <button
                type="button"
                onClick={() => setSelectedSubspecies([])}
                className="text-slate-400 hover:text-[#FEFD4A] cursor-pointer enabled:underline transition disabled:text-slate-600 disabled:cursor-not-allowed"
                disabled={selectedSubspecies.length === 0}
              >
                {t("clearAll")}
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
                      ? "bg-[#FEFD4A] text-slate-900 shadow-sm"
                      : "bg-[#6A46FE] text-white hover:bg-[#6A46FE] hover:text-white"
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
        <div>
          <span className="text-sm font-bold text-slate-300 select-none">
            {t("drawRule")}
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                ["random", t("random")],
                ["categoryRandom", t("categoryRandom")],
                ["variety", t("variety")],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setLotteryRule(value)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer font-button ${
                  lotteryRule === value
                    ? "bg-[#FEFD4A] text-slate-900 shadow-sm"
                    : "bg-[#6A46FE] text-white hover:bg-[#6A46FE] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {lotteryRule === "categoryRandom"
              ? t("categoryRandomDescription")
              : lotteryRule === "variety"
                ? t("varietyDescription")
                : t("randomDescription")}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-300 select-none">
            {t("players")} ({players.length}
            {t("people")})
          </span>
          <label
            className={`flex items-center gap-2.5 text-xs font-bold select-none ${lotteryRule === "variety" ? "text-slate-600 cursor-not-allowed" : "text-slate-300 cursor-pointer"}`}
          >
            <span>{t("allowDuplicates")}</span>
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                disabled={lotteryRule === "variety"}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:bg-[#FEFD4A] peer-disabled:opacity-40 transition-colors">
                <span
                  className={`absolute top-0.5 left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black leading-none text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.55)] transition-transform ${allowDuplicates ? "translate-x-4" : ""}`}
                >
                  {allowDuplicates ? (
                    <lucideReact.Check
                      className="h-2.5 w-2.5"
                      strokeWidth={3}
                    />
                  ) : (
                    <lucideReact.X className="h-2.5 w-2.5" strokeWidth={3} />
                  )}
                </span>
              </div>
            </div>
          </label>
        </div>

        {/* プレイヤー名入力リスト */}
        <div className="space-y-2 max-h-47 overflow-y-auto pr-1.5 custom-scrollbar">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 w-6 text-right font-number">
                #{index + 1}
              </span>
              <input
                type="text"
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                placeholder={`${t("player")} ${index + 1}`}
                className="min-w-0 flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#FEFD4A] font-result transition-colors"
              />
              {players.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePlayer(player.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-700/60 hover:bg-rose-500/80 text-slate-400 hover:text-white transition cursor-pointer text-xs font-bold"
                >
                  <lucideReact.X className="h-4 w-4" />
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
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-700 py-2 text-xs font-bold text-slate-400 transition hover:border-[#FEFD4A]/60 hover:text-[#FEFD4A] cursor-pointer font-button"
          >
            <lucideReact.Plus className="h-4 w-4" />
            <span>{t("addPlayer").replace(/^[＋+]\s*/, "")}</span>
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
          className="bg-violet-950/95 border border-violet-700/70 rounded-2xl p-3 lg:px-5 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4 transition hover:border-violet-400/80 min-h-17 transform-[perspective(800px)_rotateY(-2deg)_rotateZ(-1deg)]"
        >
          {/* 上段（スマホ） / 左側（PC）: プレイヤー名 */}
          <div className="flex items-center justify-between lg:justify-start gap-2.5 shrink-0 min-w-28">
            <div className="flex items-center gap-2 rounded-xl bg-violet-700/80 border border-violet-400/40 px-3 py-2 shadow-inner">
              <span className="text-ms font-bold text-white font-number">
                #{index + 1}
              </span>
              <span className="font-bold text-white font-result text-base">
                {player.name || `プレイヤー${index + 1}`}
              </span>
            </div>

            {/* スマホのみ上段右端に再抽選ボタンを配置 */}
            <button
              type="button"
              onClick={() => handleRedrawSingle(player.id)}
              disabled={isRolling}
              title={t("redrawWeapon", {
                name: player.name || `プレイヤー${index + 1}`,
              })}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/60 p-2 hover:bg-[#FEFD4A] hover:text-slate-900 text-slate-300 transition active:scale-90 cursor-pointer shrink-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-700/60 disabled:hover:text-slate-300"
            >
              <lucideReact.RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* 下段（スマホ） / 右側（PC）: ブキ情報 ＆ PC用再抽選ボタン */}
          <div className="flex items-center justify-between lg:justify-end gap-3 flex-1 min-w-0 pt-2 lg:pt-0 border-t border-violet-700/50 lg:border-t-0">
            {weapon ? (
              <div className="flex flex-wrap items-center justify-start lg:justify-end gap-x-2.5 gap-y-1 min-w-0 flex-1">
                {/* カテゴリバッジ */}
                <span
                  className={`text-[10px] lg:text-[11px] font-semibold px-2 lg:px-2.5 py-0.5 rounded-full font-result shrink-0 ${isRolling ? "bg-slate-700/50 text-slate-500" : "bg-yellow-400/20 text-yellow-300"}`}
                >
                  {weapon.category}
                </span>

                {/* ブキ名 */}
                <span
                  className={`text-base lg:text-lg font-bold font-result ${isRolling ? "text-slate-500" : "text-white"}`}
                >
                  <WeaponName weapon={weapon} muted={isRolling} />
                </span>

                {/* 亜種ラベル */}
                {weapon.subspeciesType && (
                  <span
                    className={`text-xs font-result shrink-0 ${isRolling ? "text-slate-500" : "text-slate-400"}`}
                  >
                    ({SUBSPECIES_TYPE_LABELS[weapon.subspeciesType]})
                  </span>
                )}
              </div>
            ) : (
              <p className="text-rose-400 text-xs py-1 font-result">
                {t("noWeapon")}
              </p>
            )}

            {/* PCの再抽選ボタン */}
            <button
              type="button"
              onClick={() => handleRedrawSingle(player.id)}
              disabled={isRolling}
              title={t("redrawWeapon", {
                name: player.name || `${t("player")} ${index + 1}`,
              })}
              className="hidden lg:flex p-2 rounded-xl bg-slate-700/60 hover:bg-[#FEFD4A] hover:text-slate-900 text-slate-300 transition active:scale-90 cursor-pointer shrink-0 ml-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-700/60 disabled:hover:text-slate-300"
            >
              <lucideReact.RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const DetailToggle = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <label
      className={`flex items-center gap-2.5 text-xs font-bold select-none ${disabled ? "text-slate-600 cursor-not-allowed" : "text-slate-300 cursor-pointer"}`}
    >
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="relative h-5 w-9 rounded-full bg-slate-700 transition-colors duration-200 peer-checked:bg-[#FEFD4A] peer-focus:outline-none peer-disabled:opacity-40">
          <span
            className={`absolute left-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black leading-none text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.55)] transition-transform duration-200 peer-checked:translate-x-4 ${checked ? "translate-x-4" : ""}`}
          >
            {checked ? (
              <lucideReact.Check className="h-2.5 w-2.5" strokeWidth={3} />
            ) : (
              <lucideReact.X className="h-2.5 w-2.5" strokeWidth={3} />
            )}
          </span>
        </div>
      </div>
    </label>
  );

  const detailsContent = (
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <nav className="hidden w-56 shrink-0 border-r border-slate-800 bg-slate-950/30 p-3 lg:block">
        {[
          ["excluded", t("excludedWeapons")],
          ["templates", t("playerTemplates")],
          ["animation", t("lotteryAnimation")],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              setDetailSection(value as "excluded" | "templates" | "animation")
            }
            className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm font-bold cursor-pointer transition ${detailSection === value ? "bg-[#6A46FE] text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto p-5 custom-scrollbar">
        <section className={detailSection === "excluded" ? "" : "hidden"}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-white">{t("excludedWeapons")}</h3>
            <button
              type="button"
              onClick={() => setExcludedWeapons([])}
              className="text-sm text-[#FEFD4A] transition cursor-pointer disabled:text-slate-500 disabled:cursor-not-allowed enabled:underline"
              disabled={excludedWeapons.length === 0}
            >
              {t("clearExcluded")}
            </button>
          </div>
          <p className="mb-3 text-sm text-slate-400">
            {t("excludedCount", { count: excludedWeapons.length })}
          </p>
          <div className="grid max-h-120 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-slate-700 p-2">
            {ALL_WEAPONS.map((weapon) => {
              const checked = excludedWeapons.includes(weapon.name);
              const limitReached =
                !checked &&
                excludedWeapons.length >= Math.max(0, ALL_WEAPONS.length - 10);
              return (
                <button
                  key={weapon.name}
                  type="button"
                  disabled={limitReached}
                  onClick={() =>
                    setExcludedWeapons((prev) =>
                      checked
                        ? prev.filter((name) => name !== weapon.name)
                        : [...prev, weapon.name],
                    )
                  }
                  className={`flex min-w-0 items-center gap-2 rounded-xl border px-2 py-2 text-left text-xs transition cursor-pointer ${checked ? "border-[#FEFD4A] bg-[#FEFD4A]/15 text-white" : "border-slate-700 bg-slate-800/70 text-slate-300 hover:border-[#6A46FE]"} disabled:cursor-not-allowed disabled:opacity-30`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border ${checked ? "border-[#FEFD4A] bg-[#FEFD4A] text-slate-900" : "border-slate-500"}`}
                  >
                    {checked && (
                      <lucideReact.Check className="h-3 w-3" strokeWidth={3} />
                    )}
                  </span>
                  <span className="max-w-full overflow-x-auto whitespace-normal wrap-break-word lg:truncate">
                    {weapon.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <section className={detailSection === "templates" ? "" : "hidden"}>
          <h3 className="mb-2 font-bold text-white">{t("playerTemplates")}</h3>
          <div className="flex gap-2">
            <input
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder={t("templateNamePlaceholder")}
              className="min-w-0 flex-1 rounded-lg border focus:border-[1.55px] transition border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-[#6A46FE]"
            />
            <button
              type="button"
              onClick={() => {
                const name =
                  templateName.trim() ||
                  `${t("template")} ${templates.length + 1}`;
                setTemplates((prev) =>
                  [
                    ...prev,
                    {
                      id: crypto.randomUUID(),
                      name,
                      players: players.map((player) => ({ ...player })),
                    },
                  ].slice(-10),
                );
                setTemplateName("");
              }}
              className="rounded-lg bg-[#6A46FE] px-3 py-2 text-xs font-bold text-white transition cursor-pointer hover:bg-[#fefd4a] hover:text-slate-800"
            >
              <lucideReact.Save className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {templates.length === 0 ? (
              <p className="text-sm text-slate-400">{t("noTemplates")}</p>
            ) : (
              templates.map((template) => {
                const expanded = expandedTemplateIds.includes(template.id);
                return (
                  <div
                    key={template.id}
                    className="rounded-xl border border-slate-700 bg-slate-800/70 p-2"
                  >
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPlayers(
                            template.players.map((player) => ({ ...player })),
                          );
                          setIsDetailsOpen(false);
                        }}
                        className="min-w-0 flex-1 truncate rounded-lg px-2 py-1 text-left text-sm font-bold text-slate-200 cursor-pointer transition hover:bg-slate-700 hover:text-[#FEFD4A]"
                      >
                        {template.name}
                      </button>
                      <button
                        type="button"
                        title={t("showTemplatePlayers")}
                        onClick={() =>
                          setExpandedTemplateIds((prev) =>
                            expanded
                              ? prev.filter((id) => id !== template.id)
                              : [...prev, template.id],
                          )
                        }
                        className="rounded-lg p-2 transition text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                      >
                        <lucideReact.ChevronDown
                          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        title={t("renameTemplate")}
                        onClick={() => {
                          const nextName = window
                            .prompt(t("templateNamePlaceholder"), template.name)
                            ?.trim();
                          if (nextName)
                            setTemplates((prev) =>
                              prev.map((item) =>
                                item.id === template.id
                                  ? { ...item, name: nextName }
                                  : item,
                              ),
                            );
                        }}
                        className="rounded-lg p-2 transition text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                      >
                        <lucideReact.Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={t("deleteTemplate")}
                        onClick={() =>
                          setTemplates((prev) =>
                            prev.filter((item) => item.id !== template.id),
                          )
                        }
                        className="rounded-lg p-2 transition text-slate-300 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                      >
                        <lucideReact.Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {expanded && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {template.players.map((player) => (
                          <div
                            key={player.id}
                            className="rounded-xl border border-[#6A46FE]/50 bg-[#26105f] px-3 py-3 text-sm font-bold text-white shadow-inner"
                          >
                            {player.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
        <section className={detailSection === "animation" ? "" : "hidden"}>
          <h3 className="mb-2 font-bold text-white">{t("lotteryAnimation")}</h3>
          <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-3 text-sm text-slate-200">
            <span>{t("enableAnimation")}</span>
            <DetailToggle
              checked={animationEnabled}
              onChange={setAnimationEnabled}
            />
          </div>
          <div className="mt-2 rounded-lg bg-slate-800 px-3 py-3">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
              <span
                className={
                  !animationEnabled ? "text-slate-500" : "text-slate-200"
                }
              >
                {t("animationDuration")}
              </span>
              <span
                className={`font-number font-bold ${animationEnabled ? "text-[#FEFD4A]" : "text-slate-500"}`}
              >
                {(animationDuration / 1000).toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="100"
              value={animationDuration}
              disabled={!animationEnabled}
              onChange={(event) =>
                setAnimationDuration(Number(event.target.value))
              }
              className="h-2 w-full cursor-ew-resize appearance-none rounded-full bg-slate-600 accent-[#FEFD4A] disabled:cursor-not-allowed disabled:opacity-40 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900 [&::-webkit-slider-thumb]:bg-[#FEFD4A]"
            />
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <div
      className={`h-screen min-h-0 bg-slate-900 text-white flex flex-col overflow-hidden supports-[height:100dvh]:h-dvh ${language === "ja" ? "font-app-ja" : "font-app-en"}`}
    >
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          {/* 左ペイン開閉ボタン */}
          <button
            type="button"
            onClick={togglePanel}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-[#FEFD4A] transition cursor-pointer"
            title={isCollapsed ? t("expandSidebar") : t("collapseSidebar")}
          >
            {isCollapsed ? (
              <lucideReact.PanelLeftOpen className="w-5 h-5" />
            ) : (
              <lucideReact.PanelLeftClose className="w-5 h-5" />
            )}
          </button>
          <h1
            className={`text-xl lg:text-2xl tracking-wider text-[#FEFD4A] select-none ${
              language === "ja"
                ? "font-title-ja"
                : "font-title-en font-extrabold"
            }`}
          >
            {t("title")}
          </h1>
          <span className="rounded-full border border-[#6A46FE]/60 bg-[#6A46FE]/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#FEFD4A] font-number select-none">
            v{packageJson.version}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            title={t("detailsSettings")}
            className="hidden items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white lg:flex cursor-pointer"
          >
            <lucideReact.Settings2 className="h-5 w-5" />
          </button>
          <div ref={otherMenuRef} className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setIsOtherMenuOpen((open) => !open)}
              title={t("other")}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 p-2 text-xs font-bold text-slate-300"
            >
              <lucideReact.MoreHorizontal className="h-5 w-5" />
            </button>
            {isOtherMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-44 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailsOpen(true);
                    setIsOtherMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-300 hover:bg-[#6A46FE] hover:text-white"
                >
                  <lucideReact.Settings2 className="h-4 w-4" />
                  {t("detailsSettings")}
                </button>
                <a
                  href="https://github.com/zibasan/spla3-lottery-weapon"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-[#6A46FE] hover:text-white"
                >
                  {t("repository")}
                </a>
                <a
                  href="https://github.com/zibasan/spla3-lottery-weapon/issues/new"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-300 hover:bg-[#6A46FE] hover:text-white"
                >
                  {t("bugReport")}
                </a>
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <div
              ref={githubButtonRef}
              className="relative rounded-xl border border-slate-700 bg-slate-800"
            >
              <div className="flex items-stretch overflow-hidden rounded-xl">
                <button
                  type="button"
                  title={t("openRepo")}
                  onClick={() =>
                    window.open(
                      "https://github.com/zibasan/spla3-lottery-weapon",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="flex items-center rounded-l-xl p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <SiGithub className="h-5 w-5" />
                  <span className="sr-only">{t("openRepo")}</span>
                </button>
                <button
                  type="button"
                  title={t("openRepoMenu")}
                  aria-expanded={isGithubMenuOpen}
                  onClick={() => setIsGithubMenuOpen((open) => !open)}
                  className="flex items-center rounded-r-xl border-l border-slate-700 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <lucideReact.ChevronDown className="h-4 w-4" />
                  <span className="sr-only">{t("openRepoMenu")}</span>
                </button>
              </div>
              {isGithubMenuOpen && (
                <div
                  ref={githubMenuRef}
                  className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl"
                >
                  <a
                    href="https://github.com/zibasan/spla3-lottery-weapon"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-[#6A46FE] hover:text-white"
                  >
                    {t("repository")}
                  </a>
                  <a
                    href="https://github.com/zibasan/spla3-lottery-weapon/issues/new"
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-[#6A46FE] hover:text-white"
                  >
                    {t("bugReport")}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div
            ref={languageButtonRef}
            className="relative rounded-xl border border-slate-700 bg-slate-800"
          >
            <button
              type="button"
              aria-expanded={isLanguageMenuOpen}
              onClick={() => setIsLanguageMenuOpen((open) => !open)}
              className="flex items-center gap-1 rounded-xl p-2 text-xs font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white cursor-pointer font-button"
            >
              <lucideReact.Globe2 className="h-5 w-5 lg:hidden" />
              <span className="hidden lg:inline">
                {language === "ja" ? t("japanese") : t("english")}
              </span>
              <lucideReact.ChevronDown className="hidden h-4 w-4 lg:block" />
              <span className="sr-only">言語を選択</span>
            </button>
            {isLanguageMenuOpen && (
              <div
                ref={languageMenuRef}
                className="absolute right-0 top-11 z-50 w-36 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl"
              >
                {(
                  [
                    ["ja", t("japanese")],
                    ["en", t("english")],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      i18n.changeLanguage(value);
                      localStorage.setItem("spla3-language", value);
                      setIsLanguageMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-[#6A46FE] hover:text-white cursor-pointer"
                  >
                    {label}
                    {language === value && (
                      <lucideReact.Check className="h-4 w-4 text-[#FEFD4A]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={results.length === 0 || isImageSaving}
            title={t("saveImageDesc")}
            className="flex items-center rounded-xl border border-slate-700 bg-[#6A46FE] p-2 text-white transition hover:bg-[#6A46FE] disabled:cursor-not-allowed disabled:opacity-40 font-button lg:hidden"
          >
            <lucideReact.ImageDown className="h-5 w-5" />
            <span className="sr-only">画像保存</span>
          </button>
          <div className="relative">
            <button
              type="button"
              ref={historyButtonRef}
              onClick={() => setIsHistoryOpen((open) => !open)}
              className="relative rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 transition hover:border-[#6A46FE] hover:text-white font-button cursor-pointer"
            >
              <lucideReact.History className="h-5 w-5" />
              {history.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FEFD4A] px-1 text-[10px] font-black text-slate-900">
                  {history.length}
                </span>
              )}
            </button>
            {isHistoryOpen && (
              <div
                ref={historyMenuRef}
                className="custom-scrollbar absolute right-0 top-11 z-40 hidden max-h-[calc(100vh-5rem)] w-80 overflow-x-hidden overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-2xl lg:block"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {t("history")}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {t("max10")}
                  </span>
                </div>
                {renderHistoryContent()}
              </div>
            )}
          </div>
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
            className={`h-full flex flex-col bg-slate-900/40 ${
              isCollapsed ? "hidden overflow-hidden" : "overflow-hidden"
            }`}
          >
            {!isCollapsed && (
              <div className="flex h-full min-w-95 flex-col">
                <div className="custom-scrollbar flex-1 overflow-y-auto p-6 space-y-6">
                  {renderSettings()}
                </div>

                {/* 抽選ボタン */}
                <div className="shrink-0 border-t border-slate-800 bg-slate-900/95 p-6 backdrop-blur">
                  <button
                    type="button"
                    onClick={handleDraw}
                    disabled={isShortage || isRolling}
                    className="w-full bg-[#FEFD4A] hover:bg-[#FEFD4A] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-lg py-4 rounded-2xl shadow-lg transition duration-150 cursor-pointer"
                  >
                    {isRolling
                      ? t("rolling")
                      : availableWeaponCount === 0
                        ? `${t("noWeapon")} (${availableWeaponCount}${language === "ja" ? "ブキ / " : " weapons / "}${players.length}${t("people")})`
                        : isShortage
                          ? `${t("notEnoughWeapons")} (${availableWeaponCount}${language === "ja" ? "ブキ / " : " weapons / "}${players.length}${t("people")})`
                          : `${t("draw", { count: players.length })}`}
                  </button>
                </div>
              </div>
            )}
          </Panel>

          {/* スプリッター（リサイザーハンドル） */}
          <Separator className="w-2 bg-slate-950/40 hover:bg-[#FEFD4A]/80 active:bg-[#FEFD4A] transition-colors cursor-col-resize relative flex items-center justify-center group shrink-0">
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
                  {t("drawResults")}{" "}
                  {results.length > 0 &&
                    `(${results.length}${language === "ja" ? "人分" : t("people")})`}
                </span>
                {results.length > 0 && renderShareButtons()}
              </div>

              {results.length > 0 ? (
                renderResultsList()
              ) : (
                <div className="text-center text-slate-500 font-result py-24 select-none">
                  {t("drawPrompt", { count: players.length })
                    .split("\n")
                    .map((line) => (
                      <span className="block" key={line}>
                        {line}
                      </span>
                    ))}
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
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-4 pb-40 space-y-4">
            {renderSettings()}
          </div>
        ) : (
          // 【抽選後】：全面に結果リストを表示
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-4 pb-40">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 font-result">
                {t("drawResults")} ({results.length}
                {t("people")})
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
              disabled={isShortage || isRolling}
              className="w-full bg-[#FEFD4A] hover:bg-[#FEFD4A] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-lg py-3.5 rounded-2xl shadow-lg transition duration-150 cursor-pointer"
            >
              {isRolling
                ? t("rolling")
                : availableWeaponCount === 0
                  ? `${t("noWeapon")} (${availableWeaponCount}${language === "ja" ? "ブキ" : " weapons"})`
                  : isShortage
                    ? `${t("notEnoughWeapons")} (${availableWeaponCount}${language === "ja" ? "ブキ / " : " weapons / "}${players.length}${t("people")})`
                    : `${t("draw", { count: players.length })}`}
            </button>
          ) : (
            // 抽選後：[設定] と [抽選する！] の2分割ボタン
            <div className="relative flex gap-3">
              {/* 抽選ボタンdisabled時の「設定を確認してね」吹き出し */}
              {isShortage && (
                <div className="absolute -top-12 left-4 z-30 animate-bounce pointer-events-none">
                  <div className="relative bg-[#FEFD4A] text-slate-900 text-xs font-bold font-button px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                    <span>{t("checkSettings")}</span>
                    {/* 吹き出しの三角 */}
                    <div className="absolute -bottom-1 left-6 w-2.5 h-2.5 bg-[#FEFD4A] rotate-45" />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsSheetOpen(true)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] border border-slate-700 text-white font-bold font-button text-base py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <lucideReact.SlidersHorizontal className="w-5 h-5 text-[#FEFD4A]" />
                {t("settings")}
              </button>
              <button
                type="button"
                onClick={handleDraw}
                disabled={isShortage || isRolling}
                className="flex-[1.5] bg-[#FEFD4A] hover:bg-[#FEFD4A] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-base py-3.5 rounded-2xl shadow-lg transition duration-150 cursor-pointer flex items-center justify-center gap-2"
              >
                <lucideReact.RotateCcw className="w-5 h-5" />
                {isRolling ? t("rolling") : t("drawShort")}
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
              aria-label={t("closeMenu")}
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
                  disabled={isShortage || isRolling}
                  className="w-full bg-[#FEFD4A] hover:bg-[#FEFD4A] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed active:scale-[0.98] text-slate-900 font-black font-button text-base py-3.5 rounded-2xl shadow-lg transition duration-150 cursor-pointer"
                >
                  {isRolling
                    ? t("rolling")
                    : isShortage
                      ? `${t("notEnoughWeapons")} (${availableWeaponCount}${language === "ja" ? "ブキ" : " weapons"})`
                      : t("applyAndDraw")}
                </button>
              </div>
            </div>
          </div>
        )}

        {isHistoryOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
            <button
              type="button"
              aria-label={t("closeHistory")}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setIsHistoryOpen(false)}
            />
            <div
              ref={historySheetRef}
              className="relative z-10 flex max-h-[75vh] min-h-0 flex-col rounded-t-3xl border-t border-slate-700 bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <span className="text-sm font-bold text-white">
                  {t("history")}
                </span>
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(false)}
                  className="text-xs text-slate-400"
                >
                  {t("close")}
                </button>
              </div>
              <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4">
                {renderHistoryContent()}
              </div>
            </div>
          </div>
        )}
      </div>

      {isDetailsOpen && (
        <div className="fixed inset-0 z-70 flex items-end justify-center lg:items-center lg:p-8 animate-in fade-in duration-150">
          <button
            type="button"
            aria-label={t("closeMenu")}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsDetailsOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-3xl border-t border-slate-700 bg-slate-900 shadow-2xl animate-in slide-in-from-bottom duration-200 lg:h-[min(720px,90vh)] lg:max-h-[90vh] lg:max-w-4xl lg:rounded-3xl lg:border lg:slide-in-from-bottom-0 lg:zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="truncate font-bold text-white">
                  {t("detailsSettings")}
                </h2>
                <select
                  aria-label={t("detailsSettings")}
                  value={detailSection}
                  onChange={(event) =>
                    setDetailSection(
                      event.target.value as
                        | "excluded"
                        | "templates"
                        | "animation",
                    )
                  }
                  className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 outline-none lg:hidden"
                >
                  <option value="excluded">{t("excludedWeapons")}</option>
                  <option value="templates">{t("playerTemplates")}</option>
                  <option value="animation">{t("lotteryAnimation")}</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                title={t("closeMenu")}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer transition"
              >
                <lucideReact.X className="h-6 w-6" />
              </button>
            </div>
            {detailsContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

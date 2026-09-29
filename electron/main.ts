import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { autoUpdater } from "electron-updater";
import { t } from "i18next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

// preload スクリプトのパス解決（mjs または js）
function getPreloadPath(): string {
  const mjsPath = path.join(__dirname, "preload.mjs");
  if (fs.existsSync(mjsPath)) {
    return mjsPath;
  }
  return path.join(__dirname, "preload.js");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, "../public/favicon.png"),
    title: t("title"),
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0f172b",
      symbolColor: "#ffffff",
      height: 50,
    },
    autoHideMenuBar: true,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ----------------------------------------------------
// autoUpdater の設定とイベント配信
// ----------------------------------------------------
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// 開発環境でもテストしやすいようロガーや動作を考慮
if (isDev) {
  autoUpdater.forceDevUpdateConfig = true;
}

autoUpdater.on("checking-for-update", () => {
  mainWindow?.webContents.send("checking-for-update");
});

autoUpdater.on("update-available", (info) => {
  mainWindow?.webContents.send("update-available", {
    version: info.version,
    releaseNotes: typeof info.releaseNotes === "string" ? info.releaseNotes : undefined,
  });
});

autoUpdater.on("update-not-available", () => {
  mainWindow?.webContents.send("update-not-available");
});

autoUpdater.on("download-progress", (progressObj) => {
  mainWindow?.webContents.send("download-progress", {
    percent: progressObj.percent,
    bytesPerSecond: progressObj.bytesPerSecond,
    transferred: progressObj.transferred,
    total: progressObj.total,
  });
});

autoUpdater.on("update-downloaded", (info) => {
  mainWindow?.webContents.send("update-downloaded", {
    version: info.version,
  });
});

autoUpdater.on("error", (err) => {
  mainWindow?.webContents.send("update-error", err?.message ?? "Update error occurred");
});

// ----------------------------------------------------
// シミュレーション（開発用テスト）
// ----------------------------------------------------
let isSimulating = false;

function simulateDownload() {
  const steps = [10, 28, 48, 68, 85, 96, 100];
  let index = 0;
  const interval = setInterval(() => {
    if (!mainWindow) {
      clearInterval(interval);
      return;
    }
    const percent = steps[index];
    mainWindow.webContents.send("download-progress", {
      percent,
      bytesPerSecond: 1024 * 1024 * 3.2,
      transferred: (1024 * 1024 * 45 * percent) / 100,
      total: 1024 * 1024 * 45,
    });
    index++;
    if (index >= steps.length) {
      clearInterval(interval);
      setTimeout(() => {
        mainWindow?.webContents.send("update-downloaded", {
          version: "0.15.0",
        });
      }, 500);
    }
  }, 350);
}

// ----------------------------------------------------
// IPC ハンドラー
// ----------------------------------------------------
ipcMain.handle("check-for-updates", async () => {
  try {
    await autoUpdater.checkForUpdates();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    mainWindow?.webContents.send("update-error", errorMsg);
  }
});

ipcMain.handle("simulate-update", () => {
  if (!mainWindow) return;
  isSimulating = true;
  mainWindow.webContents.send("checking-for-update");

  setTimeout(() => {
    mainWindow?.webContents.send("update-available", {
      version: "0.15.0",
      releaseNotes: "新機能テスト・バグ修正が含まれるアップデートです。",
    });

    if (autoUpdater.autoDownload) {
      setTimeout(() => {
        simulateDownload();
      }, 800);
    }
  }, 600);
});

ipcMain.handle("start-download", async () => {
  if (isSimulating) {
    simulateDownload();
    return;
  }
  try {
    await autoUpdater.downloadUpdate();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    mainWindow?.webContents.send("update-error", errorMsg);
  }
});

ipcMain.handle("quit-and-install", () => {
  if (isSimulating) {
    app.relaunch();
    app.exit(0);
    return;
  }
  autoUpdater.quitAndInstall();
});

ipcMain.handle("set-auto-download", (_event, enabled: boolean) => {
  autoUpdater.autoDownload = enabled;
});

// ----------------------------------------------------
// アプリライフサイクル
// ----------------------------------------------------
app.whenReady().then(() => {
  createWindow();

  // 起動時に自動で更新を確認（本番環境または dev）
  if (!isDev) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(() => {});
    }, 3000);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

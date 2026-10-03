import { contextBridge, ipcRenderer } from "electron";

export interface UpdateProgress {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

export interface UpdateInfo {
  version: string;
  releaseNotes?: string;
}

export interface ElectronAPI {
  checkForUpdates: () => Promise<void>;
  startDownload: () => Promise<void>;
  quitAndInstall: () => Promise<void>;
  setAutoDownload: (enabled: boolean) => Promise<void>;
  setCheckInterval: (hours: number) => Promise<void>;
  simulateUpdate?: () => Promise<void>;
  onCheckingForUpdate: (callback: () => void) => () => void;
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => () => void;
  onUpdateNotAvailable: (callback: () => void) => () => void;
  onDownloadProgress: (callback: (progress: UpdateProgress) => void) => () => void;
  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => () => void;
  onUpdateError: (callback: (error: string) => void) => () => void;
}

const electronAPI: ElectronAPI = {
  checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
  startDownload: () => ipcRenderer.invoke("start-download"),
  quitAndInstall: () => ipcRenderer.invoke("quit-and-install"),
  setAutoDownload: (enabled: boolean) => ipcRenderer.invoke("set-auto-download", enabled),
  setCheckInterval: (hours: number) => ipcRenderer.invoke("set-check-interval", hours),
  simulateUpdate: () => ipcRenderer.invoke("simulate-update"),

  onCheckingForUpdate: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("checking-for-update", listener);
    return () => ipcRenderer.removeListener("checking-for-update", listener);
  },
  onUpdateAvailable: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, info: UpdateInfo) => callback(info);
    ipcRenderer.on("update-available", listener);
    return () => ipcRenderer.removeListener("update-available", listener);
  },
  onUpdateNotAvailable: (callback) => {
    const listener = () => callback();
    ipcRenderer.on("update-not-available", listener);
    return () => ipcRenderer.removeListener("update-not-available", listener);
  },
  onDownloadProgress: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, progress: UpdateProgress) => callback(progress);
    ipcRenderer.on("download-progress", listener);
    return () => ipcRenderer.removeListener("download-progress", listener);
  },
  onUpdateDownloaded: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, info: UpdateInfo) => callback(info);
    ipcRenderer.on("update-downloaded", listener);
    return () => ipcRenderer.removeListener("update-downloaded", listener);
  },
  onUpdateError: (callback) => {
    const listener = (_event: Electron.IpcRendererEvent, error: string) => callback(error);
    ipcRenderer.on("update-error", listener);
    return () => ipcRenderer.removeListener("update-error", listener);
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

const isPortable = Boolean(process.env.PORTABLE_EXECUTABLE_FILE);
contextBridge.exposeInMainWorld("electron", {
  isPortable,
})

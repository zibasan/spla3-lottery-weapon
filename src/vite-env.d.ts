/// <reference types="vite/client" />

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

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    electron: {
      isPortable: boolean;
    }
  }
}

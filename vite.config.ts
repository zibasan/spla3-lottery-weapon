import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron/simple";

const isElectron = process.env.ELECTRON === 'true';

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    ...(isElectron ?
      [
        electron({
          main: {
            entry: "electron/main.ts",
          },
          preload: {
            input: "electron/preload.ts",
          },
        })
      ] : []),
  ],
});

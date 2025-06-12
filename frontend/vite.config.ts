import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  // lets “import … from 'engine'” point to ../engine/pkg
  resolve: {
    alias: {
      engine: resolve(__dirname, "../engine/pkg"),
    },
  },

  server: {
    fs: {
      // Vite may serve files one level up (..), the WASM folder,
      // and the data folder with your hero JSON
      allow: ["..", "../engine/pkg", "../data"],
    },
  },
});

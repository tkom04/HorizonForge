import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // add the engine/pkg folder to Vite’s allow-list
      allow: ["..", "c:/horizonforge/horizonforge/engine/pkg"],
    },
  },
});

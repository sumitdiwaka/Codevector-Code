import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In local dev, /api calls go to your backend
      "/api": "http://localhost:5000",
    },
  },
});
import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/.next/**", "tests/e2e/**"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@/app": path.resolve(__dirname, "src/app"),
      "@/views": path.resolve(__dirname, "src/views"),
      "@/widgets": path.resolve(__dirname, "src/widgets"),
      "@/features": path.resolve(__dirname, "src/features"),
      "@/entities": path.resolve(__dirname, "src/entities"),
      "@/shared": path.resolve(__dirname, "src/shared"),
      "next/navigation": path.resolve(__dirname, "node_modules/next/navigation.js"),
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: {
      resolveDependencies(_filename, deps) {
        return deps.filter(
          (dep) =>
            !dep.includes("Dashboard-") && !dep.includes("charts-") && !dep.includes("realtime-")
        );
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll("\\", "/");

          if (
            normalizedId.includes("/node_modules/react/") ||
            normalizedId.includes("/node_modules/react-dom/") ||
            normalizedId.includes("/node_modules/scheduler/") ||
            normalizedId.includes("/node_modules/@tanstack/")
          ) {
            return "query";
          }

          if (normalizedId.includes("/node_modules/lucide-react/")) {
            return "icons";
          }

          if (
            normalizedId.includes("/node_modules/socket.io-client/") ||
            normalizedId.includes("/node_modules/engine.io-client/") ||
            normalizedId.includes("/node_modules/@socket.io/")
          ) {
            return "realtime";
          }

          if (
            normalizedId.includes("/node_modules/recharts/") ||
            normalizedId.includes("/node_modules/d3-") ||
            normalizedId.includes("/node_modules/victory-vendor/")
          ) {
            return "charts";
          }
        }
      }
    }
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3000,
    host: "0.0.0.0"
  }
});

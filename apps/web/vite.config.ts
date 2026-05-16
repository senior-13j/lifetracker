import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          icons: ["lucide-react"],
          query: ["@tanstack/react-query"],
          realtime: ["socket.io-client"]
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

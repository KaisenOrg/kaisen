import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env": {
      DFX_NETWORK: process.env.DFX_NETWORK,
      VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:3000",
        changeOrigin: true,
        rewrite: path => path,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

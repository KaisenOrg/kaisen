import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dotenv from "dotenv"

dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env": {
      DFX_NETWORK: process.env.DFX_NETWORK,
      CANISTER_ID_KAI_BACKEND: process.env.CANISTER_ID_KAI_BACKEND,
      CANISTER_ID_TRACKS_BACKEND: process.env.CANISTER_ID_TRACKS_BACKEND,
      CANISTER_ID_CHATS_BACKEND: process.env.CANISTER_ID_CHATS_BACKEND,
      CANISTER_ID_USERS_BACKEND: process.env.CANISTER_ID_USERS_BACKEND,
      CANISTER_ID_ICRC1_LEDGER: process.env.CANISTER_ID_ICRC1_LEDGER,
      CANISTER_ID_NFT_CERTIFICATES: process.env.CANISTER_ID_NFT_CERTIFICATES,
    },
  },
  server: {
    proxy: {
      '/api/v2': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
        rewrite: path => path, // mantém /api/v2/...
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
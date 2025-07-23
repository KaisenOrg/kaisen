import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env": {
      DFX_NETWORK: JSON.stringify(process.env.DFX_NETWORK),
      CANISTER_ID_KAI_BACKEND: JSON.stringify(process.env.CANISTER_ID_KAI_BACKEND),
      CANISTER_ID_TRACKS_BACKEND: JSON.stringify(process.env.CANISTER_ID_TRACKS_BACKEND),
      CANISTER_ID_CHATS_BACKEND: JSON.stringify(process.env.CANISTER_ID_CHATS_BACKEND),
      CANISTER_ID_USERS_BACKEND: JSON.stringify(process.env.CANISTER_ID_USERS_BACKEND),
      CANISTER_ID_ICRC1_LEDGER: JSON.stringify(process.env.CANISTER_ID_ICRC1_LEDGER),
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
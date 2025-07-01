import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_CANISTER_ID_KAI_BACKEND: process.env.CANISTER_ID_KAI_BACKEND,
  }
};

export default nextConfig;

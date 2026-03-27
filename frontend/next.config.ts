import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mysten/sui", "@mysten/dapp-kit"],
};

export default nextConfig;

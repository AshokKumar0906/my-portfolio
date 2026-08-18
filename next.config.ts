import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The built-in /_next/image optimizer isn't reliably wired up under
    // Vercel Services (see vercel.json) — serve the source file directly.
    unoptimized: true,
  },
};

export default nextConfig;

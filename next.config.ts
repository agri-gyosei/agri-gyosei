import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/cron/generate-article': ['./lib/agents/prompts/**'],
    '/api/cron/generate-dacha-article': ['./lib/agents/prompts/**'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
};

export default nextConfig;

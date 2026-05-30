import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function getAllowedDevOrigins() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return [];

  try {
    return [new URL(appUrl).hostname];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
  serverExternalPackages: ["@supabase/supabase-js"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

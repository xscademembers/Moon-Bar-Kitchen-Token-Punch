import { headers } from "next/headers";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function isLocalOrPrivateAppUrl(url: string) {
  return (
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes("192.168.") ||
    url.includes("10.0.") ||
    url.includes("10.1.") ||
    /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./.test(url)
  );
}

export async function getAppBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const configuredUrl = configured ? normalizeBaseUrl(configured) : null;

  // On Vercel, never use a local network URL from env — phones cannot reach it.
  if (process.env.VERCEL_URL) {
    if (configuredUrl && !isLocalOrPrivateAppUrl(configuredUrl)) {
      return configuredUrl;
    }
    return `https://${normalizeBaseUrl(process.env.VERCEL_URL)}`;
  }

  if (configuredUrl) {
    return configuredUrl;
  }

  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return "http://localhost:3000";

  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

export function isLocalDevAppUrl(url: string) {
  return isLocalOrPrivateAppUrl(url);
}

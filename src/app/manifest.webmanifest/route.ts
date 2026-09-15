import type { MetadataRoute } from "next";
import { emojiFaviconDataUrl, rgbToHex } from "../../../config/brand";
import { getRuntimeBrand } from "@/lib/white-label/settings";

export async function GET() {
  const brand = await getRuntimeBrand();
  const fallbackIcon = brand.logoSrc ?? emojiFaviconDataUrl(brand.logoEmoji);
  const manifest: MetadataRoute.Manifest = {
    id: "/",
    name: brand.name,
    short_name: brand.name,
    description: `${brand.tagline} ${brand.subtagline}`,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: rgbToHex(brand.colors.surface),
    theme_color: rgbToHex(brand.colors.primary),
    lang: brand.defaultLocale,
    categories: ["education", "kids", "books"],
    icons: [
      { src: "/icons/icon-192.png?v=4", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png?v=4", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: fallbackIcon,
        sizes: "any",
        type: brand.logoSrc
          ? brand.logoSrc.endsWith(".svg")
            ? "image/svg+xml"
            : brand.logoSrc.endsWith(".jpg") || brand.logoSrc.endsWith(".jpeg")
              ? "image/jpeg"
              : "image/png"
          : "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Buat Cerita",
        short_name: "Buat",
        description: "Buat cerita personal baru",
        url: "/create",
        icons: [{ src: "/icons/icon-192.png?v=4", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Koleksi Cerita",
        short_name: "Koleksi",
        description: "Buka koleksi cerita",
        url: "/collection",
        icons: [{ src: "/icons/icon-192.png?v=4", sizes: "192x192", type: "image/png" }],
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

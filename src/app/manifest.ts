import type { MetadataRoute } from "next";
import { emojiFaviconDataUrl, rgbToHex } from "../../config/brand";
import { getRuntimeBrand } from "@/lib/white-label/settings";

/**
 * PWA manifest generated from the white-label brand config, so a rebranded
 * build is installable to a phone home screen with the buyer's own name,
 * colors, and icon — no extra files to edit.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const brand = await getRuntimeBrand();
  const fallbackIcon = brand.logoSrc ?? emojiFaviconDataUrl(brand.logoEmoji);

  return {
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
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
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
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Koleksi Cerita",
        short_name: "Koleksi",
        description: "Buka koleksi cerita",
        url: "/collection",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}

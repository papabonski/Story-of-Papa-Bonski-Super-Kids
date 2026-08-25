import type { Metadata, Viewport } from "next";
import "./globals.css";
import { brand, brandCssVars, emojiFaviconDataUrl, rgbToHex } from "../../config/brand";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import PwaRegister from "@/components/pwa/PwaRegister";
import SetupBanner from "@/components/setup/SetupBanner";

export async function generateMetadata(): Promise<Metadata> {
  const runtimeBrand = await getRuntimeBrand();
  return {
    title: `${runtimeBrand.name} — Cerita Personal untuk Si Kecil`,
    description: `${runtimeBrand.tagline} ${runtimeBrand.subtagline}`,
    applicationName: runtimeBrand.name,
    appleWebApp: {
      capable: true,
      title: runtimeBrand.name,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: runtimeBrand.logoSrc ?? emojiFaviconDataUrl(runtimeBrand.logoEmoji),
      apple: "/icons/icon-192.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: rgbToHex(brand.colors.surface),
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const runtimeBrand = await getRuntimeBrand();
  const brandVars = `:root{${brandCssVars(runtimeBrand)}}`;

  return (
    <html lang={runtimeBrand.defaultLocale} suppressHydrationWarning>
      <head>
        <style
          id="white-label-brand-vars"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: brandVars }}
        />
        {/* Kid-friendly display + body fonts. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SetupBanner />
        <PwaRegister />
      </body>
    </html>
  );
}

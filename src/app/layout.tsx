import type { Metadata, Viewport } from "next";
import "./globals.css";
import { brand, brandCssVars, emojiFaviconDataUrl, rgbToHex } from "../../config/brand";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import PwaRegister from "@/components/pwa/PwaRegister";
import Script from "next/script";

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
        {process.env.NEXT_PUBLIC_META_PIXEL_ID ? <>
          <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{__html:`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${process.env.NEXT_PUBLIC_META_PIXEL_ID}');fbq('track','PageView');`}} />
        </> : null}
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}

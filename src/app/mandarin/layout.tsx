import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Papa Bonski Mandarin — Belajar Mandarin untuk Anak",
  description: "Belajar Mandarin melalui 18 mini-game interaktif untuk anak.",
  applicationName: "Papa Bonski Mandarin",
  manifest: "/mandarin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Papa Bonski Mandarin",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/mandarin-game/assets/papa-bonski-logo.png",
    shortcut: "/mandarin-game/assets/papa-bonski-logo.png",
    apple: "/mandarin-game/assets/papa-bonski-logo-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b827c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function MandarinLayout({ children }: { children: React.ReactNode }) {
  return children;
}

const manifest = {
  id: "/mandarin",
  name: "Papa Bonski Mandarin",
  short_name: "Papa Bonski Mandarin",
  description: "Belajar Mandarin melalui 18 mini-game interaktif untuk anak.",
  start_url: "/mandarin",
  scope: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: "#fffaf0",
  theme_color: "#1b827c",
  lang: "id",
  categories: ["education", "kids", "games"],
  icons: [
    {
      src: "/mandarin-game/assets/papa-bonski-logo-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/mandarin-game/assets/papa-bonski-logo.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ],
};

export function GET() {
  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

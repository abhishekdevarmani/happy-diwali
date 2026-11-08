import { ImageResponse } from "next/og";

export const alt = "Happy Diwali — The Fun Way";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// No emoji here on purpose: they'd need a network fetch at build time.
export default function OpenGraphImage() {
  const sparkles = [
    { x: 150, y: 120, s: 10 },
    { x: 1040, y: 150, s: 14 },
    { x: 260, y: 470, s: 8 },
    { x: 960, y: 440, s: 10 },
    { x: 90, y: 330, s: 6 },
    { x: 1110, y: 340, s: 8 },
    { x: 380, y: 90, s: 6 },
    { x: 820, y: 80, s: 8 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background:
            "linear-gradient(180deg, #0c0a1c 0%, #1b0f2b 70%, #3a1708 100%)",
        }}
      >
        {sparkles.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              borderRadius: 999,
              background: "#ffd166",
              boxShadow: "0 0 10px 3px rgba(255,170,50,0.7)",
            }}
          />
        ))}

        {/* Diya */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 96,
              borderRadius: "50% 50% 50% 50% / 72% 72% 28% 28%",
              background: "linear-gradient(180deg, #fff6c8 0%, #ffd166 45%, #ff7a1a 100%)",
              boxShadow: "0 0 60px 24px rgba(255,150,30,0.45)",
            }}
          />
          <div
            style={{
              marginTop: -6,
              width: 240,
              height: 70,
              borderRadius: "10px 10px 120px 120px / 10px 10px 70px 70px",
              background: "linear-gradient(180deg, #ffd166 0%, #c2561a 100%)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 118,
            fontWeight: 800,
            letterSpacing: 6,
            color: "#ffd166",
            display: "flex",
          }}
        >
          HAPPY DIWALI
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 38,
            color: "#f6dca5",
            display: "flex",
          }}
        >
          A little happiness. A lot of fireworks. Too many jokes.
        </div>
      </div>
    ),
    { ...size },
  );
}

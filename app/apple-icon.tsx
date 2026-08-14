import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "radial-gradient(circle at 30% 30%, #1e1b4b 0%, #090d16 60%, #020617 100%)",
          borderRadius: "40px",
          border: "4px solid rgba(56, 189, 248, 0.6)",
          boxShadow: "0 0 30px rgba(56, 189, 248, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background tech grid accents */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#38bdf8",
            }}
          />
        </div>

        {/* Central Monogram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "82px",
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-2px",
          }}
        >
          <span style={{ color: "#38bdf8" }}>C</span>
          <span style={{ color: "#c084fc", marginLeft: "-4px" }}>M</span>
        </div>

        {/* Subtitle tag */}
        <div
          style={{
            color: "#94a3b8",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginTop: "-6px",
            fontFamily: "monospace",
          }}
        >
          ChirayuOS
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

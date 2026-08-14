import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0f172a 100%)",
          borderRadius: "8px",
          border: "1.5px solid rgba(56, 189, 248, 0.7)",
          boxShadow: "0 0 10px rgba(56, 189, 248, 0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow backdrop dot */}
        <div
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#10b981",
            opacity: 0.8,
          }}
        />
        {/* Monogram / Terminal Glyph */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#38bdf8",
            fontSize: "15px",
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          <span style={{ color: "#38bdf8" }}>C</span>
          <span style={{ color: "#a855f7", marginLeft: "-1px" }}>M</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

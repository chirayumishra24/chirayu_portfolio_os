import { ImageResponse } from "next/og";
import { profile, projects } from "../data/portfolio";

export const runtime = "edge";
export const alt = `${profile.name} portfolio preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  const flagshipProject = projects[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "radial-gradient(circle at 20% 20%, #312e81 0%, #0f172a 45%, #020617 100%)",
          color: "#f8fafc",
          padding: "72px",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "780px" }}>
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                border: "1px solid rgba(122, 162, 247, 0.4)",
                borderRadius: "999px",
                padding: "10px 18px",
                color: "#93c5fd",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ChirayuOS Portfolio
            </div>
            <h1 style={{ margin: 0, fontSize: "72px", lineHeight: 1, fontWeight: 800 }}>{profile.name}</h1>
            <p style={{ margin: 0, fontSize: "34px", color: "#bfdbfe", fontWeight: 700 }}>{profile.role}</p>
            <p style={{ margin: 0, fontSize: "26px", lineHeight: 1.35, color: "#cbd5e1" }}>{profile.recruiterSummary}</p>
          </div>

          <div
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #7aa2f7, #a855f7)",
              color: "#020617",
              fontSize: "56px",
              fontWeight: 900,
              boxShadow: "0 24px 70px rgba(122, 162, 247, 0.3)",
            }}
          >
            {profile.initials}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px" }}>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", maxWidth: "760px" }}>
            {profile.focusTags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid rgba(148, 163, 184, 0.25)",
                  borderRadius: "14px",
                  padding: "10px 14px",
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#e2e8f0",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "right" }}>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "22px", fontWeight: 700 }}>Flagship project</p>
            <p style={{ margin: 0, color: "#f8fafc", fontSize: "28px", fontWeight: 800 }}>{flagshipProject.name}</p>
          </div>
        </div>
      </div>
    ),
    size
  );
}

import { ImageResponse } from "next/og";
import { profile, stats } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#7d95ff",
              marginBottom: 24,
            }}
          >
            {profile.title} · {profile.location}
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              color: "#9a9a9a",
              maxWidth: 900,
            }}
          >
            Agentic AI · RAG Systems · LLM Fine-tuning · Production AI Automation
          </div>
        </div>
        <div style={{ display: "flex", gap: 56, borderTop: "1px solid #262626", paddingTop: 40 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#7d95ff" }}>
                {stat.value}
              </div>
              <div style={{ display: "flex", fontSize: 18, color: "#9a9a9a", marginTop: 6 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

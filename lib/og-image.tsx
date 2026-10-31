import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };

/** The shared look of every OG image: eyebrow, large title, optional footer line. */
export function renderOgImage({
  eyebrow,
  title,
  footer,
}: {
  eyebrow: string;
  title: string;
  footer?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <div style={{ fontSize: 28, color: "#7aa2f7" }}>{eyebrow}</div>
      <div
        style={{
          fontSize: title.length > 60 ? 56 : 72,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: -2,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 28, color: "#a3a3a3" }}>{footer ?? ""}</div>
    </div>,
    ogImageSize,
  );
}

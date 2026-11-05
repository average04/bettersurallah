import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The link preview shown when the site is shared (Facebook, Messenger, X...).
// Background: AI-generated landscape (GPT Image via Higgsfield), no people in it.
// The logo and text are drawn here so the branding stays exact.

export const dynamic = "force-static";
export const alt = "BetterSurallah — See how Surallah works";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function dataUri(path: string, mime: string) {
  const file = await readFile(join(process.cwd(), path));
  return `data:${mime};base64,${file.toString("base64")}`;
}

export default async function OpengraphImage() {
  const [background, logo] = await Promise.all([
    dataUri("assets/og-background.jpg", "image/jpeg"),
    dataUri("public/logo.png", "image/png"),
  ]);

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={background} width={1200} height={630} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 10, background: "#0035ad" }} />
        <div
          style={{
            position: "absolute",
            top: 58,
            left: 56,
            bottom: 48,
            width: 640,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 52px",
            borderRadius: 28,
            background: "rgba(255, 255, 255, 0.96)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={370} height={113} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05, letterSpacing: -1.5, color: "#0e0f12" }}>
              See how Surallah
            </div>
            <div style={{ display: "flex", fontSize: 64, lineHeight: 1.1, letterSpacing: -1.5, color: "#0035ad" }}>
              works.
            </div>
            <div style={{ display: "flex", marginTop: 22, fontSize: 25, lineHeight: 1.4, color: "#575d6b" }}>
              Government services, public documents, projects and officials of the
              Municipality of Surallah, South Cotabato.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

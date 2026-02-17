import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function loadLocalFont(path: string): Promise<ArrayBuffer> {
  const data = await readFile(path);
  return data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength
  ) as ArrayBuffer;
}

async function loadGoogleFont(
  font: string,
  text: string,
  weight: number
): Promise<ArrayBuffer> {
  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;

  const css = await (
    await fetch(API, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2|woff)'\)/);

  if (!resource) throw new Error("Failed to download dynamic font");

  const res = await fetch(resource[1]);

  if (!res.ok) {
    throw new Error(`Failed to download dynamic font. Status: ${res.status}`);
  }

  return res.arrayBuffer();
}

async function loadFonts(
  text: string
): Promise<Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>> {
  const localFonts = [
    {
      name: "Atkinson",
      path: resolve(process.cwd(), "public/fonts/atkinson-regular.woff"),
      weight: 400,
      style: "normal",
    },
    {
      name: "Atkinson",
      path: resolve(process.cwd(), "public/fonts/atkinson-bold.woff"),
      weight: 700,
      style: "normal",
    },
  ] as const;

  try {
    return await Promise.all(
      localFonts.map(async ({ name, path, weight, style }) => ({
        name,
        data: await loadLocalFont(path),
        weight,
        style,
      }))
    );
  } catch {
    const googleFonts = [
      {
        name: "IBM Plex Mono",
        font: "IBM+Plex+Mono",
        weight: 400,
        style: "normal",
      },
      {
        name: "IBM Plex Mono",
        font: "IBM+Plex+Mono",
        weight: 700,
        style: "bold",
      },
    ] as const;

    return Promise.all(
      googleFonts.map(async ({ name, font, weight, style }) => {
        const data = await loadGoogleFont(font, text, weight);
        return { name, data, weight, style };
      })
    );
  }
}

export default loadFonts;

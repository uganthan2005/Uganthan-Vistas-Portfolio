import { stat } from "fs/promises";
import path from "path";

import Desktop from "@/components/Desktop";

export default async function Home() {
  const wallpaperPath = path.join(process.cwd(), "public", "wallpaper.png");
  const wallpaperVersion = (await stat(wallpaperPath)).mtimeMs;

  return <Desktop wallpaperVersion={wallpaperVersion} />;
}

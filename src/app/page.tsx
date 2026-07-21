import { stat } from "fs/promises";
import path from "path";

import Desktop from "@/components/Desktop";
import StartupSequence from "@/components/startup/StartupSequence";

export default async function Home() {
  const wallpaperPath = path.join(process.cwd(), "public", "wallpaper.png");
  const wallpaperVersion = (await stat(wallpaperPath)).mtimeMs;

  return (
    <StartupSequence>
      <Desktop wallpaperVersion={wallpaperVersion} />
    </StartupSequence>
  );
}

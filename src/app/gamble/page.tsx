import MainClient from "@/components/MainClient";
import LEDNavbar from "@/components/LEDNavbar";
import dataJson from "../../../public/data.json";
import { MediaItem } from "@/types";

export default function GamblePage() {
  const allMedia = dataJson as MediaItem[];

  return (
    <main className="w-full h-screen pt-20 overflow-hidden">
      <LEDNavbar />
      <MainClient initialData={allMedia} mode="roulette" />
    </main>
  );
}

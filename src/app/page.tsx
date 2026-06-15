import MainClient from "@/components/MainClient";
import LEDNavbar from "@/components/LEDNavbar";
import dataJson from "../../public/data.json";
import { MediaItem } from "@/types";

export default function Home() {
  const allMedia = dataJson as MediaItem[];

  return (
    <main className="w-full h-[100dvh] pt-20 overflow-hidden relative border-b border-white/10">
      <LEDNavbar />
      <MainClient initialData={allMedia} mode="wizard" />
    </main>
  );
}

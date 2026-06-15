import MainClient from "@/components/MainClient";
import LEDNavbar from "@/components/LEDNavbar";

export default function Home() {
  return (
    <main className="w-full h-[100dvh] pt-20 overflow-hidden relative border-b border-white/10">
      <LEDNavbar />
      <MainClient mode="wizard" />
    </main>
  );
}

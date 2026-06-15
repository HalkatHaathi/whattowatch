import MainClient from "@/components/MainClient";
import LEDNavbar from "@/components/LEDNavbar";

export default function GamblePage() {
  return (
    <main className="w-full h-screen pt-20 overflow-hidden">
      <LEDNavbar />
      <MainClient mode="roulette" />
    </main>
  );
}

import MainClient from "@/components/MainClient";
import LEDNavbar from "@/components/LEDNavbar";

export default function SavedPage() {
  return (
    <main className="w-full h-screen pt-20 overflow-hidden">
      <LEDNavbar />
      <MainClient mode="saved" />
    </main>
  );
}

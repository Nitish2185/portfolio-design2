import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <div className="h-[150vh]" />
    </main>
  );
}

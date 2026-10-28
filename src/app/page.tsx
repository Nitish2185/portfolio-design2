import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <div className="h-[100vh]" />
    </main>
  );
}

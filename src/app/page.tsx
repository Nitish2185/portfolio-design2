import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Work />
      <Services />
      <Experience />
      <Skills />
      <div className="h-[100vh]" />
    </main>
  );
}

import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <main className="relative z-10 bg-ink">
      <Hero />
      <Marquee />
      <About />
      <Work />
      <Services />
      <Experience />
      <Skills />
      <Testimonials />
      <Contact />
    </main>
  );
}

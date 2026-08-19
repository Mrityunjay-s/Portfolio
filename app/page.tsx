import Hero from "@/components/hero";
import About from "@/components/about";
import Skills from "@/components/skills";
import { Projects } from "@/components/work";
import Contact from "@/components/contact";
import HomeShell from "@/components/home-shell";

export default function Home() {
  return (
    <HomeShell>
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </HomeShell>
  );
}

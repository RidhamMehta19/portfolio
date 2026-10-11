"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/hooks";
import { ScrollProvider } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Contact, { Footer } from "./sections/Contact";

/** Adds `.is-in` once to every `.rv` / `.rv-mask` as it enters the viewport. */
function useRevealObserver(): void {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".rv, .rv-mask");
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useRevealObserver();
  return (
    <ScrollProvider>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </ScrollProvider>
  );
}

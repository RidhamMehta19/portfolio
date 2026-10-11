"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let instance: Lenis | null = null;

export function scrollToTarget(target: string | HTMLElement, offset = 0): void {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.2 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function lockScroll(locked: boolean): void {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function ScrollProvider({ children }: { readonly children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    instance = lenis;
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return <>{children}</>;
}

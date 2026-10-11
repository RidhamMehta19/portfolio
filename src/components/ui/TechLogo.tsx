import Image from "next/image";
import type { ReactNode } from "react";

interface Brand {
  readonly src: string;
  /** Official brand colour, used only for the soft glow behind the logo. */
  readonly tint: string;
}

export const BRAND: Readonly<Record<string, Brand>> = {
  Java: { src: "/logos/java.svg", tint: "#e76f00" },
  Kotlin: { src: "/logos/kotlin.svg", tint: "#7f52ff" },
  TypeScript: { src: "/logos/typescript.svg", tint: "#3178c6" },
  JavaScript: { src: "/logos/javascript.svg", tint: "#f0db4f" },
  Angular: { src: "/logos/angular.svg", tint: "#dd0031" },
  HTML: { src: "/logos/html5.svg", tint: "#e34f26" },
  CSS: { src: "/logos/css3.svg", tint: "#1572b6" },
  "Spring Boot": { src: "/logos/spring.svg", tint: "#6db33f" },
  PostgreSQL: { src: "/logos/postgresql.svg", tint: "#336791" },
  Git: { src: "/logos/git.svg", tint: "#f05032" },
  "GitLab CI/CD": { src: "/logos/gitlab.svg", tint: "#fc6d26" },
};

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const CONCEPT: Readonly<Record<string, ReactNode>> = {
  "Dynamic Forms": (
    <g {...line}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h4" />
      <path d="m15 15 3 3" />
    </g>
  ),
  "Service Workflows": (
    <g {...line}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="5" cy="18" r="2" />
      <path d="M7 6h6a3 3 0 0 1 3 3v1M7 18h6a3 3 0 0 0 3-3v-1" />
    </g>
  ),
  "Payment Integrations": (
    <g {...line}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </g>
  ),
  "Device Integrations": (
    <g {...line}>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </g>
  ),
  WebSocket: (
    <g {...line}>
      <path d="M4 9h13l-3-3M20 15H7l3 3" />
    </g>
  ),
  Webhooks: (
    <g {...line}>
      <circle cx="12" cy="6" r="2.6" />
      <circle cx="6" cy="17" r="2.6" />
      <circle cx="18" cy="17" r="2.6" />
      <path d="m11 8.4-3.6 6M13 8.4l3.6 6M8.6 17h6.8" />
    </g>
  ),
};

export const isBrand = (name: string): boolean => name in BRAND;
export const isConcept = (name: string): boolean => name in CONCEPT;
export const hasLogo = (name: string): boolean => isBrand(name) || isConcept(name);

interface Props {
  readonly name: string;
  readonly size?: number;
  readonly glow?: boolean;
}

export default function TechLogo({ name, size = 24, glow = false }: Props) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <span
        className="tl"
        style={{
          width: size,
          height: size,
          ...(glow ? { filter: `drop-shadow(0 0 ${size * 0.28}px ${brand.tint}38)` } : null),
        }}
      >
        <Image src={brand.src} alt="" width={size} height={size} unoptimized style={{ width: size, height: size }} />
      </span>
    );
  }
  const concept = CONCEPT[name];
  if (!concept) return null;
  return (
    <svg className="tl" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ strokeWidth: size > 60 ? 0.6 : 1 }}>
      {concept}
    </svg>
  );
}

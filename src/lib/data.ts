/**
 * Single source of truth for every piece of copy on the site.
 * Everything here is taken from the résumé (03_Ridham_Mehta_Full_Stack.pdf).
 */

export interface Profile {
  readonly name: string;
  readonly shortName: string;
  readonly firstName: string;
  readonly initials: string;
  readonly role: string;
  readonly stackLine: string;
  readonly email: string;
  readonly phone: string;
  readonly phoneHref: string;
  readonly location: string;
  readonly summary: string;
  readonly github: string;
  readonly linkedin: string;
  readonly resume: string;
}

export const PROFILE: Profile = {
  name: "Ridham Mayank Mehta",
  shortName: "Ridham Mehta",
  firstName: "Ridham",
  initials: "RM",
  role: "Full-Stack Software Engineer",
  stackLine: "Java + Angular",
  email: "ridhammehta940@gmail.com",
  phone: "+91 7600637636",
  phoneHref: "tel:+917600637636",
  location: "Surat, Gujarat, India",
  summary:
    "Full-Stack Software Engineer with approximately 2.9 years delivering end-to-end features with Java/Kotlin, Spring Boot, Angular, TypeScript/JavaScript, and PostgreSQL. Builds user workflows through backend integration for payment, industrial, and government systems; delivered products supporting 150+ franchise operators and 10,000+ residents while leading a 4-engineer team on PartsPlex.",
  github: "https://github.com/RidhamMehta19",
  linkedin: "https://www.linkedin.com/in/ridham-mehta-977a7b216/",
  resume: "/resume.pdf",
};

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

export const NAV: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/* ----------------------------------------------------------------- Skills */

export interface SkillSeed {
  readonly name: string;
  readonly symbol: string;
}
export interface SkillGroup {
  readonly family: string;
  readonly skills: readonly SkillSeed[];
}
export interface Skill extends SkillSeed {
  readonly family: string;
  readonly number: number;
}

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      { name: "Java", symbol: "Ja" },
      { name: "Kotlin", symbol: "Kt" },
      { name: "TypeScript", symbol: "Ts" },
      { name: "JavaScript", symbol: "Js" },
    ],
  },
  {
    family: "Frontend",
    skills: [
      { name: "Angular", symbol: "Ng" },
      { name: "HTML", symbol: "Ht" },
      { name: "CSS", symbol: "Cs" },
    ],
  },
  { family: "Backend", skills: [{ name: "Spring Boot", symbol: "Sb" }] },
  { family: "Data", skills: [{ name: "PostgreSQL", symbol: "Pg" }] },
  {
    family: "Delivery",
    skills: [
      { name: "Dynamic Forms", symbol: "Df" },
      { name: "Service Workflows", symbol: "Sw" },
      { name: "Payment Integrations", symbol: "Pi" },
      { name: "Device Integrations", symbol: "Di" },
    ],
  },
  {
    family: "Engineering",
    skills: [
      { name: "WebSocket", symbol: "Ws" },
      { name: "Webhooks", symbol: "Wh" },
      { name: "GitLab CI/CD", symbol: "Ci" },
      { name: "Git", symbol: "Gt" },
    ],
  },
];

export const FAMILIES: readonly string[] = SKILL_GROUPS.map((g) => g.family);

export const SKILLS: readonly Skill[] = SKILL_GROUPS.flatMap((g) =>
  g.skills.map((s) => ({ ...s, family: g.family })),
).map((s, i) => ({ ...s, number: i + 1 }));

/* ------------------------------------------------------------- Experience */

export interface Role {
  readonly id: string;
  readonly title: string;
  readonly org: string;
  readonly place: string;
  readonly period: string;
  readonly summary: string;
  readonly stack: readonly string[];
}

const PGS_STACK = ["Angular", "Java", "Kotlin", "Spring Boot", "PostgreSQL"] as const;

export const EXPERIENCE: readonly Role[] = [
  {
    id: "se",
    title: "Software Engineer",
    org: "Potent Global Solutions",
    place: "Bardoli, Gujarat",
    period: "Aug 2023 – Present",
    summary:
      "Delivering end-to-end features across payment, industrial, and government systems, and leading a 4-engineer team on PartsPlex.",
    stack: PGS_STACK,
  },
  {
    id: "pc",
    title: "Project Coordinator",
    org: "AlphaBI",
    place: "India",
    period: "Jan 2023 – May 2023",
    summary:
      "Coordinated 5 concurrent full-stack projects through QA checkpoints and weekly status reporting; built and deployed a consultancy web application on Netlify.",
    stack: [],
  },
  {
    id: "fe",
    title: "Frontend Development Intern",
    org: "AlphaBI",
    place: "India",
    period: "May 2022 – Jun 2022",
    summary:
      "Built responsive UI components and fixed 20+ defects during testing and debugging, partnering with design on implementation.",
    stack: ["HTML", "CSS", "JavaScript"],
  },
];

export interface Education {
  readonly degree: string;
  readonly school: string;
  readonly period: string;
}

export const EDUCATION: readonly Education[] = [
  {
    degree: "B.E. Computer Science and Engineering",
    school: "Gujarat Technological University, Ahmedabad",
    period: "2019 – 2023",
  },
];

export interface TimelineStop {
  readonly id: string;
  readonly kind: "Education" | "Experience";
  readonly when: string;
  readonly title: string;
  readonly place: string;
  readonly detail: string;
  readonly stack: readonly string[];
}

/** Chronological by start date. */
export const TIMELINE: readonly TimelineStop[] = [
  {
    id: "edu",
    kind: "Education",
    when: "2019",
    title: EDUCATION[0]!.degree,
    place: EDUCATION[0]!.school,
    detail: `${EDUCATION[0]!.period}`,
    stack: [],
  },
  ...[...EXPERIENCE].reverse().map<TimelineStop>((r) => ({
    id: r.id,
    kind: "Experience",
    when: r.period.split(" – ")[0] ?? r.period,
    title: r.title,
    place: `${r.org} — ${r.place} · ${r.period}`,
    detail: r.summary,
    stack: r.stack,
  })),
];

/* --------------------------------------------------------------- Projects */

export type MiniKind =
  | "forms"
  | "commerce"
  | "chat"
  | "schedule"
  | "monitor"
  | "invoice"
  | "rental";

export interface Project {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly kicker: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly tech: readonly string[];
  readonly ui: MiniKind;
  readonly github?: string;
}

const PGS = "Potent Global Solutions";

export const PROJECTS: readonly Project[] = [
  {
    id: "cfc",
    index: "01",
    title: "CFC Platform",
    kicker: PGS,
    description:
      "Delivered end to end with Angular and backend workflows: dynamic forms/arrays, franchise wallet, operator assignment, and PAN/ITR/Aadhaar/Insurance service requests for 150+ operators.",
    features: [
      "Dynamic forms and arrays",
      "Franchise wallet",
      "Operator assignment",
      "PAN / ITR / Aadhaar / Insurance requests",
      "150+ franchise operators",
    ],
    tech: [...PGS_STACK, "Dynamic Forms", "Service Workflows"],
    ui: "forms",
  },
  {
    id: "partsplex",
    index: "02",
    title: "PartsPlex",
    kicker: `${PGS} · Canada`,
    description:
      "Led a 4-engineer team connecting commerce workflows to Moneris payments, tiered discounts, and post-payment inventory validation for 500+ orders/month.",
    features: [
      "Moneris payments",
      "Tiered discounts",
      "Post-payment inventory validation",
      "500+ orders per month",
      "4-engineer team lead",
    ],
    tech: [...PGS_STACK, "Payment Integrations"],
    ui: "commerce",
  },
  {
    id: "pgsconnect",
    index: "03",
    title: "PGSConnect",
    kicker: PGS,
    description:
      "Workflows from Excel bill extraction and upload through WebSocket/webhook chat and PayU/BillDesk payments, digitizing tax payments for 10,000+ residents and removing door-to-door collection.",
    features: [
      "Excel bill extraction and upload",
      "WebSocket / webhook chat",
      "PayU / BillDesk payments",
      "10,000+ residents",
      "No door-to-door collection",
    ],
    tech: [...PGS_STACK, "WebSocket", "Webhooks", "Payment Integrations"],
    ui: "chat",
  },
  {
    id: "punch",
    index: "04",
    title: "Scheduling & Operator Punch",
    kicker: PGS,
    description:
      "Scheduling and Operator Punch workflows with date-independent shifts, overlap validation, dynamic filtering, schedule copying, auto shift detection, and DOB-based authentication; cut manual scheduling time by 35%.",
    features: [
      "Date-independent shifts",
      "Overlap validation",
      "Dynamic filtering",
      "Schedule copying",
      "Auto shift detection",
      "DOB-based authentication",
    ],
    tech: [...PGS_STACK],
    ui: "schedule",
  },
  {
    id: "watchtower",
    index: "05",
    title: "WatchTower",
    kicker: PGS,
    description:
      "Connectivity and monitoring workflow around OPC DA/UA, Modbus, and Siemens S7 sources, with Tag Management and Data Storage Mapping for 50+ SCADA/PLC devices.",
    features: [
      "OPC DA / UA",
      "Modbus",
      "Siemens S7",
      "Tag Management",
      "Data Storage Mapping",
      "50+ SCADA/PLC devices",
    ],
    tech: [...PGS_STACK, "Device Integrations"],
    ui: "monitor",
  },
  {
    id: "invoice",
    index: "06",
    title: "AI Invoice Parsing",
    kicker: PGS,
    description:
      "An AI-assisted invoice-parsing workflow using prompt engineering and structured extraction across 15+ formats, improving accuracy by 25%.",
    features: [
      "Prompt engineering",
      "Structured extraction",
      "15+ invoice formats",
      "25% accuracy improvement",
    ],
    tech: [...PGS_STACK],
    ui: "invoice",
  },
  {
    id: "adala",
    index: "07",
    title: "Adala Badali",
    kicker: "Clothing Rental App · New Zealand client",
    description:
      "Built an end-to-end rental workflow for listings, availability, rental duration, and returns for a New Zealand client.",
    features: ["Listings", "Availability", "Rental duration", "Returns"],
    tech: ["Spring Boot", "PostgreSQL"],
    ui: "rental",
  },
];

/** Where a skill shows up, derived from the data above (no hand-maintained duplicates). */
export function usedIn(skill: string): string[] {
  const fromProjects = PROJECTS.filter((p) => p.tech.includes(skill)).map((p) => p.title);
  const fromRoles = EXPERIENCE.filter((r) => r.stack.includes(skill) && r.id !== "se").map(
    (r) => `${r.title}, ${r.org}`,
  );
  return [...fromProjects, ...fromRoles];
}

/**
 * All placeholder content for the portfolio lives here.
 * Replace the lorem ipsum with your own details when you're ready.
 */

export const site = {
  name: "Lorem Ipsum",
  firstName: "Lorem",
  lastName: "Ipsum",
  monogram: "L/I",
  role: "Lorem ipsum dolor sit amet",
  tagline:
    "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  email: "hello@example.com",
  location: "Lorem City",
  timeZone: "UTC",
  availability: "Lorem ipsum — available for dolor 2027",
  resume: "/resume.pdf",
  year: 2026,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placeholder portfolio built with Next.js, GSAP, Motion, Lenis and Three.js.",
};

export const navLinks = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export const socials = [
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Instagram", href: "#" },
];

export const marqueeWords = [
  "Lorem ipsum",
  "Dolor sit",
  "Amet consectetur",
  "Adipiscing elit",
  "Sed do eiusmod",
  "Tempor",
];

export const about = {
  heading: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  details: [
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  ],
  stats: [
    { value: 12, suffix: "+", label: "Lorem ipsum" },
    { value: 140, suffix: "", label: "Dolor sit amet" },
    { value: 24, suffix: "", label: "Consectetur" },
    { value: 98, suffix: "%", label: "Adipiscing elit" },
  ],
};

export type Service = {
  title: string;
  description: string;
  tags: string[];
  theme: "coal" | "acid" | "volt" | "bone";
  glyph: "star" | "orbit" | "grid" | "wave";
};

export const services: Service[] = [
  {
    title: "Lorem Design",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tags: ["Lorem", "Ipsum", "Dolor", "Sit amet"],
    theme: "coal",
    glyph: "star",
  },
  {
    title: "Ipsum Code",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    tags: ["Consectetur", "Adipiscing", "Elit", "Sed do"],
    theme: "acid",
    glyph: "grid",
  },
  {
    title: "Dolor Motion",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    tags: ["Eiusmod", "Tempor", "Incididunt", "Labore"],
    theme: "volt",
    glyph: "orbit",
  },
  {
    title: "Amet Strategy",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tags: ["Magna", "Aliqua", "Veniam", "Nostrud"],
    theme: "bone",
    glyph: "wave",
  },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  client: string;
  role: string;
  tags: string[];
  summary: string;
  palette: [string, string, string];
  pattern: "rings" | "grid" | "blob" | "stripes" | "orbit";
};

export const projects: Project[] = [
  {
    slug: "lorem-nebula",
    title: "Lorem Nebula",
    category: "Lorem ipsum dolor",
    year: "2026",
    client: "Nebula Dolor Co.",
    role: "Lorem & Ipsum",
    tags: ["Lorem", "Ipsum", "Dolor"],
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    palette: ["#4d5bff", "#cbff3c", "#08080a"],
    pattern: "blob",
  },
  {
    slug: "ipsum-vortex",
    title: "Ipsum Vortex",
    category: "Consectetur elit",
    year: "2025",
    client: "Vortex Amet Ltd.",
    role: "Dolor sit amet",
    tags: ["Sit", "Amet", "Elit"],
    summary:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    palette: ["#ff4d6d", "#ffb84d", "#120a12"],
    pattern: "rings",
  },
  {
    slug: "dolor-prism",
    title: "Dolor Prism",
    category: "Sed do eiusmod",
    year: "2025",
    client: "Prism Tempor Inc.",
    role: "Tempor & Incididunt",
    tags: ["Tempor", "Labore", "Magna"],
    summary:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    palette: ["#cbff3c", "#1b1b20", "#ecebe6"],
    pattern: "grid",
  },
  {
    slug: "amet-orbit",
    title: "Amet Orbit",
    category: "Ut labore et dolore",
    year: "2024",
    client: "Orbit Magna Group",
    role: "Aliqua & Veniam",
    tags: ["Aliqua", "Veniam", "Nostrud"],
    summary:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    palette: ["#9b6bff", "#4dffd2", "#0a0814"],
    pattern: "orbit",
  },
  {
    slug: "tempor-mono",
    title: "Tempor Mono",
    category: "Quis nostrud",
    year: "2024",
    client: "Mono Exercitation",
    role: "Ullamco & Laboris",
    tags: ["Ullamco", "Laboris", "Nisi"],
    summary:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    palette: ["#ecebe6", "#ff4d6d", "#08080a"],
    pattern: "stripes",
  },
];

export const experience = [
  {
    role: "Lorem Ipsum Lead",
    company: "Consectetur Studio",
    period: "2024 — Now",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
  },
  {
    role: "Senior Dolor Sit",
    company: "Adipiscing Labs",
    period: "2021 — 2024",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
  },
  {
    role: "Amet Developer",
    company: "Elit & Partners",
    period: "2019 — 2021",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
  },
  {
    role: "Junior Tempor",
    company: "Eiusmod Agency",
    period: "2017 — 2019",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
  },
];

export const skills = [
  "Lorem",
  "Ipsum",
  "Dolor",
  "Sit amet",
  "Consectetur",
  "Adipiscing",
  "Elit",
  "Sed do",
  "Eiusmod",
  "Tempor",
  "Incididunt",
  "Labore",
  "Magna",
  "Aliqua",
];

export const testimonials = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    name: "Lorem Dolor",
    title: "Founder, Ipsum Co.",
  },
  {
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
    name: "Amet Consectetur",
    title: "Creative Director, Elit Studio",
  },
  {
    quote:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed ut.",
    name: "Tempor Magna",
    title: "Head of Product, Aliqua Labs",
  },
];

export const clients = [
  "Lorem",
  "Ipsum&Co",
  "DOLOR",
  "sit.amet",
  "Consect",
  "ELIT/",
  "Tempor",
  "Magna",
];

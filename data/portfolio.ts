export type ProjectLanguage = "typescript" | "javascript" | "go" | "rust" | "python";

export interface SocialLink {
  label: string;
  href?: string;
  kind: "github" | "linkedin" | "x" | "calendar" | "email";
  visible: boolean;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface ProfileSummary {
  name: string;
  initials: string;
  role: string;
  location: string;
  email: string;
  githubUrl: string;
  flagshipRepoUrl: string;
  education: string;
  cgpa: string;
  headline: string;
  bio: string[];
  focusTags: string[];
  stats: ProfileStat[];
}

export interface PortfolioProject {
  file: string;
  name: string;
  language: ProjectLanguage;
  description: string;
  metrics?: string[];
  challenges: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  codeSnippet: string;
}

export interface ExperienceEntry {
  hash: string;
  branch: "master" | "develop" | "feature";
  company: string;
  role: string;
  duration: string;
  bullets: string[];
  tech: string[];
}

export interface ResumeMetadata {
  fileName: string;
  downloadName: string;
  publicPath: string;
}

export const profile: ProfileSummary = {
  name: "Chirayu Mishra",
  initials: "CM",
  role: "Full-Stack Developer & Product Associate",
  location: "India",
  email: "chirayumishra24@gmail.com",
  githubUrl: "https://github.com/chirayumishra24",
  flagshipRepoUrl: "https://github.com/chirayumishra24/chirayu_portfolio_os",
  education: "B.Tech",
  cgpa: "7.5",
  headline: "Building practical full-stack products with an interactive, product-minded approach.",
  bio: [
    "I work across full-stack development and product execution, with a focus on turning requirements into usable web experiences.",
    "My current stack includes React, Next.js, TypeScript, Node.js, Express, Prisma, PostgreSQL, MongoDB, Firebase, and Tailwind CSS.",
    "I am interested in developer tools, AI-assisted workflows, user research, PRD writing, and clean handoff between design, engineering, and product teams.",
  ],
  focusTags: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "Product Discovery",
    "PRD Writing",
    "UX Thinking",
  ],
  stats: [
    { label: "Education", value: "B.Tech" },
    { label: "CGPA", value: "7.5" },
    { label: "Flagship Build", value: "ChirayuOS" },
    { label: "Core Stack", value: "MERN + Next" },
  ],
};

export const socialLinks: SocialLink[] = [
  { label: "GitHub Profile", href: profile.githubUrl, kind: "github", visible: true },
  { label: "Email Chirayu", href: `mailto:${profile.email}`, kind: "email", visible: true },
  { label: "LinkedIn Profile", kind: "linkedin", visible: false },
  { label: "X / Twitter", kind: "x", visible: false },
  { label: "Book Calendar", kind: "calendar", visible: false },
];

export const resume: ResumeMetadata = {
  fileName: "Chirayu_Mishra_Resume.pdf",
  downloadName: "Chirayu_Mishra_Resume.pdf",
  publicPath: "/resume.pdf",
};

export const projects: PortfolioProject[] = [
  {
    file: "chirayu_portfolio_os.tsx",
    name: "ChirayuOS Portfolio",
    language: "typescript",
    description:
      "An interactive desktop-style portfolio built with Next.js. It presents profile, projects, skills, resume, contact, GitHub, terminal, settings, media, and mini-app experiences inside a browser-based OS shell.",
    metrics: [
      "Next.js 14 app with a production build route size of 94.6 kB and 182 kB first-load JS at review time.",
      "Includes draggable/resizable windows, persisted Zustand preferences, command palette, terminal commands, achievements, and 17 theme options.",
      "Uses server routes for contact handling, GitHub profile data, source browsing, and AI assistant responses.",
    ],
    challenges:
      "The main engineering challenge is keeping a playful OS metaphor usable: windows, keyboard shortcuts, persisted settings, app state, and responsive layouts need to feel coherent without hiding core portfolio content.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "Prisma"],
    githubUrl: profile.flagshipRepoUrl,
    codeSnippet: `type PortfolioApp = {
  id: string;
  title: string;
  trustedContent: boolean;
};

const chirayuOS: PortfolioApp[] = [
  { id: "about", title: "Profile Highlights", trustedContent: true },
  { id: "projects", title: "Verified Projects", trustedContent: true },
  { id: "resume", title: "Resume Viewer", trustedContent: true },
];`,
  },
];

export const experienceEntries: ExperienceEntry[] = [
  {
    hash: "a4f89d2",
    branch: "master",
    company: "SkilliZee",
    role: "Product Associate",
    duration: "Nov 2025 - Present",
    bullets: [
      "Coordinate between engineering, UI/UX, and business stakeholders to convert product goals into scoped implementation tasks.",
      "Support sprint planning, backlog grooming, QA review, and product documentation for web product improvements.",
      "Use user research and usability feedback to identify friction points and define clearer product flows.",
    ],
    tech: ["Product Roadmapping", "User Flows", "User Research", "Agile Sprints", "Backlog Prioritization", "QA Testing"],
  },
  {
    hash: "b7e2c91",
    branch: "develop",
    company: "SkilliZee",
    role: "Product Associate Intern",
    duration: "Sep 2025 - Nov 2025",
    bullets: [
      "Prepared PRDs, user flows, and product discovery notes for web feature planning.",
      "Compared market and competitor patterns to identify practical product improvement opportunities.",
    ],
    tech: ["PRD Documentation", "Product Discovery", "Competitive Benchmarking", "User Flows", "Market Research"],
  },
  {
    hash: "c6d1a5f",
    branch: "feature",
    company: "Speech-to-Text Project",
    role: "Backend Engineering Intern",
    duration: "Jan 2025 - Jul 2025",
    bullets: [
      "Worked on a real-time speech-to-text transcription backend using Node.js and WebSocket-based audio streaming.",
      "Integrated transcription workflow components and handled backend-side streaming logic for audio input.",
    ],
    tech: ["Node.js", "WebSockets", "Audio Streaming", "JavaScript", "Backend APIs"],
  },
];

export const aiAssistantContext = `
ABOUT:
- Name: ${profile.name}
- Role: ${profile.role}
- Education: ${profile.education}, CGPA ${profile.cgpa}
- Location: ${profile.location}

FOCUS:
- Full-stack web development with React, Next.js, TypeScript, Node.js, Express, Prisma, PostgreSQL, MongoDB, Firebase, and Tailwind CSS.
- Product execution: PRDs, user flows, backlog grooming, QA review, and product discovery.
- Developer tools, AI-assisted workflows, and interactive portfolio experiences.

PROJECTS:
- ChirayuOS Portfolio: interactive browser-based portfolio OS with draggable windows, command palette, terminal, resume viewer, contact form, GitHub data, settings, achievements, and themes.

CONTACT:
- Email: ${profile.email}
- GitHub: ${profile.githubUrl}
`;

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
  siteUrl?: string;
  education: string;
  cgpa: string;
  headline: string;
  bio: string[];
  focusTags: string[];
  stats: ProfileStat[];
  recruiterSummary: string;
  strengths: string[];
}

export interface PortfolioProject {
  file: string;
  name: string;
  language: ProjectLanguage;
  description: string;
  problem: string;
  role: string;
  architecture: string[];
  outcomes: string[];
  learnings: string[];
  nextSteps: string[];
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
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
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
  recruiterSummary:
    "Full-stack developer and product associate who can build polished web interfaces, wire backend workflows, write product documentation, and communicate clearly across engineering and product teams.",
  strengths: [
    "Comfortable moving from product requirements to working React/Next.js interfaces.",
    "Understands both implementation details and product workflow: PRDs, user flows, QA review, and backlog grooming.",
    "Prefers verified portfolio content, clear tradeoffs, and maintainable code over inflated claims.",
    "Can work across frontend, backend APIs, database-backed features, and user-facing polish.",
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
    problem:
      "Traditional portfolio pages are often static and forgettable. This project explores whether a recruiter can review a developer profile through a memorable OS-style interface without losing access to core information.",
    role:
      "Designed and built the full product experience, typed content layer, app shell, desktop window system, app modules, API routes, and responsive behavior.",
    architecture: [
      "Next.js App Router handles the portfolio shell, API routes, metadata, and production build pipeline.",
      "Zustand stores OS state such as active windows, themes, achievements, notifications, sound preferences, and media state.",
      "Typed portfolio data in `data/portfolio.ts` drives profile, project, resume, social, AI assistant, and recruiter-facing content.",
      "WindowFrame abstracts desktop window behavior while switching to full-screen mobile panels below 768px.",
      "Server routes handle contact persistence, GitHub data, source browsing, and AI assistant responses with conservative fallbacks.",
    ],
    metrics: [
      "Next.js 14 app with a production build route size of 94.6 kB and 182 kB first-load JS at review time.",
      "Includes draggable/resizable windows, persisted Zustand preferences, command palette, terminal commands, achievements, and 17 theme options.",
      "Uses server routes for contact handling, GitHub profile data, source browsing, and AI assistant responses.",
    ],
    outcomes: [
      "Creates a distinct first impression while preserving direct recruiter actions for projects, resume, GitHub, and contact.",
      "Replaced placeholder-style claims with conservative, typed, reusable portfolio content.",
      "Improved mobile behavior with full-screen app panels, safe-area sizing, touch-safe dock actions, and internal scrolling.",
      "Build validation runs with TypeScript and ESLint checks enabled.",
    ],
    learnings: [
      "A playful concept needs a clear recruiter path; visual novelty cannot replace fast access to proof.",
      "Responsive OS interfaces work better when mobile is treated as app panels instead of draggable desktop windows.",
      "Typed content makes it easier to remove fake links, soften unverifiable claims, and keep all apps consistent.",
    ],
    nextSteps: [
      "Add real screenshots and a short demo recording when available.",
      "Add verified live deployment URL after production deployment.",
      "Continue reducing first-load JavaScript by lazy-loading heavier apps and media surfaces.",
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

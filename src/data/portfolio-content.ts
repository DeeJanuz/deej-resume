import type {
  DesktopItemDefinition,
  PortfolioSection,
  PortfolioSectionId,
  SiteProfile,
} from "@/types";

export const siteProfile: SiteProfile = {
  name: "Daenon Janis",
  title: "Builder, operator, and product-minded engineer",
  location: "Denver, Colorado",
  availability: "Open to standout product, platform, and founder-led opportunities",
  summary:
    "This desktop-style resume is designed to showcase employment history, businesses, and projects through a polished interface rather than a single scrolling page.",
};

export const portfolioSections: readonly PortfolioSection[] = [
  {
    id: "resume",
    title: "Resume Snapshot",
    windowTitle: "Resume.pdf",
    eyebrow: "Core Story",
    intro:
      "Use this window for the strongest high-level version of your professional story: who you are, what you build, and why hiring you is a high-upside bet.",
    summary:
      "This is the anchor file. It should quickly answer role fit, experience level, and proof of execution before visitors explore the rest of the desktop.",
    sidebarNote:
      "Treat this as the fastest path for recruiters who want a sharp summary before diving into the rest of the work.",
    accent: "#2f6b73",
    heroGradient:
      "linear-gradient(135deg, rgba(47, 107, 115, 0.20) 0%, rgba(173, 217, 216, 0.82) 100%)",
    metrics: [
      { value: "01", label: "Primary hire-me artifact" },
      { value: "03", label: "Core proof points to feature" },
      { value: "90s", label: "Ideal skim time" },
    ],
    cards: [
      {
        title: "Positioning statement",
        eyebrow: "Headline",
        description:
          "Replace this with a two-to-three sentence summary of your edge: domain depth, technical range, leadership style, and the kinds of problems you solve well.",
        tags: ["Who you are", "What you do", "Why you stand out"],
      },
      {
        title: "Selected outcomes",
        eyebrow: "Impact",
        description:
          "List the short version of your best results here. Use real numbers, shipped products, revenue influence, team scope, or technical wins that make a recruiter keep reading.",
        bullets: [
          "Outcome 01 placeholder with a measurable result.",
          "Outcome 02 placeholder tied to scale, speed, or quality.",
          "Outcome 03 placeholder showing leadership or ownership.",
        ],
      },
      {
        title: "Preferred opportunities",
        eyebrow: "Target roles",
        description:
          "Clarify what you want next so the site attracts the right conversations instead of generic outreach.",
        tags: ["Senior IC", "Tech lead", "Founding engineer", "Product-minded build work"],
      },
    ],
    quickFacts: [
      "Keep this crisp enough to scan in under two minutes.",
      "Link deeper windows from here once real content exists.",
      "Use the same facts here that appear in LinkedIn and PDF resume.",
    ],
    defaultWindow: {
      position: { x: 150, y: 74 },
      size: { width: 760, height: 580 },
    },
  },
  {
    id: "about",
    title: "About Me",
    windowTitle: "About Me",
    eyebrow: "Personal Positioning",
    intro:
      "This window is for the more human version of the resume: how you think, how you work, and the through-line connecting your jobs, ventures, and projects.",
    summary:
      "It should feel confident and personal without becoming autobiographical. Think signal, taste, and direction.",
    sidebarNote:
      "Use this space to explain the connective tissue behind the timeline and why your work history makes sense as a whole.",
    accent: "#9d6335",
    heroGradient:
      "linear-gradient(135deg, rgba(157, 99, 53, 0.18) 0%, rgba(235, 203, 171, 0.86) 100%)",
    metrics: [
      { value: "01", label: "Clear personal story" },
      { value: "03", label: "Values or working principles" },
      { value: "∞", label: "Room for personality" },
    ],
    cards: [
      {
        title: "How you describe yourself",
        eyebrow: "Narrative",
        description:
          "Write the version of your story that makes both employers and clients understand the thread behind your choices.",
        bullets: [
          "What kinds of work energize you.",
          "Where you bring unusual leverage.",
          "What makes your path different from a generic resume.",
        ],
      },
      {
        title: "How you work",
        eyebrow: "Operating style",
        description:
          "Describe your collaboration style, how you handle ownership, and what teammates can rely on you for.",
        tags: ["Ownership", "Systems thinking", "Clarity", "Bias to action"],
      },
      {
        title: "What you want next",
        eyebrow: "Direction",
        description:
          "Use this card to signal whether you want employment, consulting, business partnerships, or a mix.",
      },
    ],
    quickFacts: [
      "Keep tone warm and specific.",
      "Avoid repeating raw resume bullets word-for-word.",
      "Use this section to make the site feel unmistakably yours.",
    ],
    defaultWindow: {
      position: { x: 240, y: 122 },
      size: { width: 700, height: 540 },
    },
  },
  {
    id: "experience",
    title: "Past Work Experience",
    windowTitle: "Past Work Experience",
    eyebrow: "Employment Timeline",
    intro:
      "This window should tell the story of where you've worked, what scope you carried, and how your responsibilities expanded over time.",
    summary:
      "Make each role legible at a glance: company, period, scope, and one clear achievement or responsibility arc.",
    sidebarNote:
      "Think of this as your proof of sustained execution over time rather than a dump of job descriptions.",
    accent: "#3f5f48",
    heroGradient:
      "linear-gradient(135deg, rgba(63, 95, 72, 0.18) 0%, rgba(196, 223, 195, 0.85) 100%)",
    metrics: [
      { value: "03+", label: "Roles to feature" },
      { value: "01", label: "Sentence per role that matters" },
      { value: "100%", label: "Focus on outcomes over duties" },
    ],
    cards: [
      {
        title: "Current or most recent role",
        eyebrow: "YYYY - Now",
        description:
          "Summarize the highest-leverage ownership area, the team or product scope, and the results that are most relevant for future opportunities.",
        tags: ["Team scope", "System ownership", "Business impact"],
      },
      {
        title: "Previous role",
        eyebrow: "YYYY - YYYY",
        description:
          "Capture the inflection point from this chapter: maybe deeper architecture, product influence, leadership, or shipping under ambiguity.",
      },
      {
        title: "Earlier foundation role",
        eyebrow: "YYYY - YYYY",
        description:
          "Use this slot for the role that explains where your fundamentals, instincts, or early wins came from.",
      },
    ],
    quickFacts: [
      "Recruiters should be able to skim this in one pass.",
      "Use measurable results where possible.",
      "Cut anything that sounds like internal performance review language.",
    ],
    defaultWindow: {
      position: { x: 180, y: 94 },
      size: { width: 820, height: 600 },
    },
  },
  {
    id: "projects",
    title: "Projects I've Worked On",
    windowTitle: "Projects",
    eyebrow: "Proof of Build",
    intro:
      "This is where the site earns credibility. Show the products, tools, experiments, or systems you've actually shipped or meaningfully moved forward.",
    summary:
      "Visitors should quickly understand the project, your contribution, and why it matters.",
    sidebarNote:
      "This window is the strongest companion to your resume because it turns claims into visible proof.",
    accent: "#2d5f93",
    heroGradient:
      "linear-gradient(135deg, rgba(45, 95, 147, 0.18) 0%, rgba(183, 213, 239, 0.84) 100%)",
    metrics: [
      { value: "04", label: "Ideal featured projects" },
      { value: "01", label: "Clear takeaway per project" },
      { value: "↑", label: "Emphasize outcomes or learning" },
    ],
    cards: [
      {
        title: "Flagship project",
        eyebrow: "Best showcase",
        description:
          "Lead with the project that most clearly demonstrates your taste, execution, and technical range.",
        bullets: [
          "What it is.",
          "What part you owned.",
          "What changed because it shipped.",
        ],
        tags: ["Product", "Architecture", "Ownership"],
      },
      {
        title: "Collaboration-heavy project",
        eyebrow: "Cross-functional work",
        description:
          "Use one slot for a project that shows you can work across design, product, sales, or operations instead of only coding in isolation.",
      },
      {
        title: "Technical depth project",
        eyebrow: "Systems or platform",
        description:
          "Highlight the project that proves you can design infrastructure, architecture, or developer-facing tooling when needed.",
      },
      {
        title: "Personal or experimental build",
        eyebrow: "Taste and curiosity",
        description:
          "Give space to one self-directed build that reflects your curiosity, ambition, or point of view.",
      },
    ],
    quickFacts: [
      "Add links, screenshots, or demos once real content is ready.",
      "Each project should answer why it mattered.",
      "A smaller number of strong projects beats a giant archive.",
    ],
    defaultWindow: {
      position: { x: 270, y: 138 },
      size: { width: 760, height: 560 },
    },
  },
  {
    id: "skills",
    title: "Skills",
    windowTitle: "Skills",
    eyebrow: "Capability Map",
    intro:
      "This section should organize your skills in a way that feels credible and easy to scan, not like a keyword dump.",
    summary:
      "Group capabilities by how you actually use them: product building, architecture, leadership, operations, writing, or whatever reflects your real range.",
    sidebarNote:
      "The best skills section clarifies your shape, not just your tooling familiarity.",
    accent: "#8b6b2f",
    heroGradient:
      "linear-gradient(135deg, rgba(139, 107, 47, 0.18) 0%, rgba(234, 215, 171, 0.85) 100%)",
    metrics: [
      { value: "04", label: "Capability groups" },
      { value: "0", label: "Fluff words needed" },
      { value: "1x", label: "Keywords with context" },
    ],
    cards: [
      {
        title: "Product and software delivery",
        eyebrow: "Execution",
        description:
          "Group the tools and disciplines you use to ship real work, and keep them attached to the kinds of problems you solve.",
        tags: ["TypeScript", "React", "Next.js", "Systems thinking"],
      },
      {
        title: "Architecture and platform thinking",
        eyebrow: "Technical depth",
        description:
          "Use this card for the capabilities that help you shape systems, not just implement tickets.",
        tags: ["Architecture", "APIs", "Integrations", "Testing strategy"],
      },
      {
        title: "Leadership and operations",
        eyebrow: "Leverage",
        description:
          "Show the non-code skills that make you effective beyond individual implementation.",
        tags: ["Planning", "Communication", "Hiring", "Cross-functional alignment"],
      },
    ],
    quickFacts: [
      "Avoid giant comma-separated tool lists.",
      "Organize skills around outcomes and capability clusters.",
      "If a skill matters, reflect it elsewhere in the site too.",
    ],
    defaultWindow: {
      position: { x: 120, y: 132 },
      size: { width: 700, height: 520 },
    },
  },
  {
    id: "businesses",
    title: "Businesses",
    windowTitle: "Businesses",
    eyebrow: "Founder Work",
    intro:
      "Use this window if you want visitors to understand the ventures, experiments, and operator instincts that sit alongside your employment history.",
    summary:
      "This is especially useful if your business work makes you a stronger hire or a stronger partner.",
    sidebarNote:
      "This window should make founder or operator experience feel concrete rather than vague.",
    accent: "#7b4b45",
    heroGradient:
      "linear-gradient(135deg, rgba(123, 75, 69, 0.18) 0%, rgba(228, 196, 188, 0.84) 100%)",
    metrics: [
      { value: "02", label: "Ventures worth featuring" },
      { value: "01", label: "Operator insight per venture" },
      { value: "↔", label: "Connect to employment story" },
    ],
    cards: [
      {
        title: "Primary business or venture",
        eyebrow: "Flagship company",
        description:
          "Explain the business, the market or problem, and what your role says about your strengths as a founder or operator.",
      },
      {
        title: "Side venture or studio effort",
        eyebrow: "Second chapter",
        description:
          "Use this slot for a smaller venture, consulting model, or productized service that shows range.",
      },
      {
        title: "Key lessons",
        eyebrow: "Operator perspective",
        description:
          "Summarize the lessons from selling, building, serving customers, or managing constraints that shape how you work now.",
        tags: ["Customer empathy", "Decision-making", "Speed", "Trade-offs"],
      },
    ],
    quickFacts: [
      "Show why the business experience is relevant, not just interesting.",
      "Focus on ownership, constraints, and results.",
      "Tie the lessons back to the work you want next.",
    ],
    defaultWindow: {
      position: { x: 220, y: 110 },
      size: { width: 720, height: 540 },
    },
  },
  {
    id: "contact",
    title: "Contact",
    windowTitle: "Contact",
    eyebrow: "Start A Conversation",
    intro:
      "This window should make it obvious how to reach you for hiring, projects, partnerships, or exploratory conversations.",
    summary:
      "Do not make people hunt for a next step. One clean set of contact routes is enough.",
    sidebarNote:
      "Use this window to convert interest into a real next action with the least possible friction.",
    accent: "#4b5563",
    heroGradient:
      "linear-gradient(135deg, rgba(75, 85, 99, 0.18) 0%, rgba(211, 219, 228, 0.84) 100%)",
    metrics: [
      { value: "03", label: "Preferred contact routes" },
      { value: "01", label: "Clear call to action" },
      { value: "<24h", label: "Suggested response expectation" },
    ],
    cards: [
      {
        title: "Email",
        eyebrow: "Primary route",
        description:
          "Replace this with your real professional inbox and a short note about what kinds of outreach belong there.",
        tags: ["hello@yourdomain.com", "Hiring", "Advising"],
      },
      {
        title: "LinkedIn or social proof",
        eyebrow: "Secondary route",
        description:
          "Include the profile that best reinforces your credibility if someone wants to verify background quickly.",
      },
      {
        title: "Project and partnership inquiries",
        eyebrow: "Business route",
        description:
          "If you want consulting, contracting, or founder conversations, spell that out directly so the right people know they should reach out.",
      },
    ],
    quickFacts: [
      "Make contact feel easy and intentional.",
      "Distinguish employment outreach from business outreach if needed.",
      "Add calendar links only if they improve quality, not volume.",
    ],
    defaultWindow: {
      position: { x: 320, y: 152 },
      size: { width: 660, height: 500 },
    },
  },
] as const;

export const portfolioSectionsById = Object.fromEntries(
  portfolioSections.map((section) => [section.id, section])
) as Record<PortfolioSectionId, PortfolioSection>;

export const desktopItems: readonly DesktopItemDefinition[] = [
  {
    id: "resume",
    label: "Resume.pdf",
    iconLabel: "PDF",
    kind: "document",
    accent: "#2f6b73",
    position: { top: "56px", right: "48px" },
  },
  {
    id: "experience",
    label: "Past Work",
    iconLabel: "EXP",
    kind: "folder",
    accent: "#3f5f48",
    position: { top: "166px", right: "36px" },
  },
  {
    id: "projects",
    label: "Projects",
    iconLabel: "PRJ",
    kind: "stack",
    accent: "#2d5f93",
    position: { top: "276px", right: "56px" },
  },
  {
    id: "skills",
    label: "Skills",
    iconLabel: "SKL",
    kind: "document",
    accent: "#8b6b2f",
    position: { top: "102px", left: "38px" },
  },
  {
    id: "about",
    label: "About Me",
    iconLabel: "ME",
    kind: "document",
    accent: "#9d6335",
    position: { top: "214px", left: "28px" },
  },
  {
    id: "businesses",
    label: "Businesses",
    iconLabel: "BIZ",
    kind: "folder",
    accent: "#7b4b45",
    position: { top: "330px", left: "44px" },
  },
  {
    id: "contact",
    label: "Contact.card",
    iconLabel: "CTA",
    kind: "contact",
    accent: "#4b5563",
    position: { top: "434px", right: "62px" },
  },
] as const;

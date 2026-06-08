import type { PortfolioContentSource } from "@/types";

export const contentSource = {
  "siteProfile": {
    "name": "Daenon Janis",
    "title": "Forward-Deployed AI Product Engineer",
    "location": "Ogden, Utah",
    "summary": "I build trusted AI workflow software across product, data, enterprise integrations, and security."
  },
  "resume": {
    "id": "resume",
    "desktopLabel": "Resume",
    "iconLabel": "CV",
    "windowTitle": "Resume",
    "accent": "#2f6b73",
    "executiveSummary": {
      "eyebrow": "Executive Summary",
      "title": "Forward-Deployed AI Product Engineer",
      "intro": "I build trusted AI workflow software across product, data, integrations, and security. I work best where founders and operators need someone to find the real problem, shape the product surface, wire the systems, and mentor non-technical teams into practical AI use.",
      "summary": "I work best where founders and operators need someone to find the real problem, shape the product surface, wire the systems, and mentor non-technical teams into practical AI use.",
      "accent": "#2f6b73",
      "heroGradient": "linear-gradient(135deg, rgba(47, 107, 115, 0.18) 0%, rgba(195, 226, 230, 0.9) 100%)",
      "heroImage": {
        "src": "/images/personal-profile.webp",
        "alt": "Daenon Janis in a flight simulator setup",
        "width": 512,
        "height": 512,
        "objectPosition": "center"
      },
      "metrics": [
        {
          "value": "Security",
          "label": "I've built SOC 2 compliant organizations and software from startup bootstrap through series A"
        },
        {
          "value": "Zero to One",
          "label": "AI and internal tools shipped for operator workflows"
        },
        {
          "value": "Real Solutions",
          "label": "Product proofs: Ludflow, MCPViews, DecidR"
        }
      ],
      "valuePillars": [],
      "quickFacts": [],
      "primaryLinks": [
        {
          "label": "deej@ludflow.com",
          "href": "mailto:deej@ludflow.com"
        }
      ]
    },
    "navigation": [
      {
        "id": "summary",
        "label": "Summary"
      },
      {
        "id": "projects",
        "label": "AI Products"
      },
      {
        "id": "consulting",
        "label": "Consulting"
      },
      {
        "id": "experience",
        "label": "Ivy Impact"
      },
      {
        "id": "skills",
        "label": "Capabilities"
      },
      {
        "id": "about",
        "label": "About"
      },
      {
        "id": "contact",
        "label": "Contact"
      }
    ],
    "sections": [
      {
        "id": "projects",
        "navLabel": "AI Products",
        "eyebrow": "AI Product Proofs",
        "title": "AI Products & Founder Work",
        "intro": "Three product proofs show the through-line: AI becomes useful when it is connected to real context, systems, review, and decisions.",
        "summary": "Ludflow, MCPViews, and DecidR MCP are the clearest signals that I can find the wedge, design the workflow, build the product surface, and keep trust visible as the system becomes real.",
        "accent": "#2d5f93",
        "heroGradient": "linear-gradient(135deg, rgba(45, 95, 147, 0.18) 0%, rgba(183, 213, 239, 0.84) 100%)",
        "metrics": [
          {
            "value": "Ludflow",
            "label": "Commercial product thesis for grounded AI context"
          },
          {
            "value": "MCPViews",
            "label": "Open-source interface layer for agent workflows"
          },
          {
            "value": "DecidR",
            "label": "Decision and workflow layer for AI-native execution"
          }
        ],
        "cards": [
          {
            "title": "Ludflow",
            "eyebrow": "Commercial product thesis",
            "description": "Ludflow is a platform for AI documentation, data governance, and grounded MCP context and provides the document storage to decisions and projects in the DecidR MCP platform.",
            "links": [
              {
                "label": "Visit Ludflow",
                "href": "https://ludflow.com"
              }
            ],
            "tags": [
              "AI documentation",
              "Data governance",
              "Grounded context",
              "Knowledge systems"
            ]
          },
          {
            "title": "MCPViews",
            "eyebrow": "Public technical proof",
            "description": "MCPViews is an open-source desktop companion for agent interfaces, plugin-aware review flows, and richer work surfaces than plain chat while improving token efficiency and providing portable workflows and instructions with token optimized bread crumb rule discovery.",
            "links": [
              {
                "label": "Visit MCPViews",
                "href": "https://mcpviews.com"
              },
              {
                "label": "GitHub Repo",
                "href": "https://github.com/DeeJanuz/mcpviews"
              }
            ],
            "tags": [
              "Open source",
              "Agent UI",
              "Review workflows",
              "Renderer system"
            ]
          },
          {
            "title": "DecidR MCP",
            "eyebrow": "Workflow and decision layer",
            "description": "DecidR MCP is a project management and governance tool for use with AI enabled teams. Built to work and integrate with any AI tools that support MCP, users can work with AI while asynchronously collaborating with their team members. It proves how I think about keeping context, implementation, and stakeholder buy-in connected so AI-assisted execution does not drift away from accountability.",
            "links": [
              {
                "label": "Visit DecidR MCP",
                "href": "https://decidrmcp.com"
              }
            ],
            "tags": [
              "AI-native teams",
              "Decision workflows",
              "Execution context",
              "Approval systems"
            ]
          }
        ],
        "detailSections": [
          {
            "title": "The pattern these products prove",
            "eyebrow": "Product signal",
            "paragraphs": [
              "Across the three products, the theme is not a model wrapper. The work is about giving AI reliable context, explicit review surfaces, and enough product structure that people can trust the result.",
              "That is the kind of role I am aiming at: founder-level product ownership where discovery, interface design, integration plumbing, and trust decisions stay connected."
            ],
            "bullets": [
              "Ludflow connects business knowledge to docs, schemas, code, and AI context.",
              "MCPViews turns agent output into reviewable interfaces instead of only chat text.",
              "DecidR MCP keeps decisions, approvals, implementation context, and execution in the same loop."
            ]
          }
        ],
        "quickFacts": []
      },
      {
        "id": "consulting",
        "navLabel": "Consulting",
        "eyebrow": "Consulting & Mentoring",
        "title": "Technical Guidance for Non-Technical Teams",
        "intro": "I help founders, operators, and domain experts turn early product ideas into buildable, reviewable, reasonably secure software without pretending everyone on the team needs to become an engineer.",
        "summary": "The through-line across BitBooks and No Food Cravings is practical translation: requirements, prototypes, issue reporting, release discipline, documentation, and security choices made legible to teams with limited technical experience.",
        "accent": "#6f5f8f",
        "heroGradient": "linear-gradient(135deg, rgba(111, 95, 143, 0.18) 0%, rgba(211, 203, 232, 0.86) 100%)",
        "metrics": [
          {
            "value": "MVP coaching",
            "label": "Helped non-technical product owners shape safe first versions"
          },
          {
            "value": "Release discipline",
            "label": "Coached dev to staging to production workflows with safeguards"
          },
          {
            "value": "Team fluency",
            "label": "Made requirements, bugs, risks, and tradeoffs understandable"
          }
        ],
        "cards": [
          {
            "title": "No Food Cravings",
            "eyebrow": "Founder coaching",
            "description": "Provided technical guidance and product coaching for a non-technical product manager building an MVP around a health and behavior-change idea. The work focused on making the first version realistic, secure enough for early learning, and understandable to the person responsible for the product.",
            "bullets": [
              "Translated the idea into an MVP scope with clearer product boundaries and implementation priorities.",
              "Coached practical security, account, data, and deployment choices so early experiments did not create avoidable risk.",
              "Helped the product owner evaluate AI-assisted development output, review tradeoffs, and keep momentum without losing control of the product."
            ],
            "links": [
              {
                "label": "Visit No Food Cravings",
                "href": "https://www.nofoodcravings.com/"
              }
            ],
            "tags": [
              "MVP scoping",
              "Founder coaching",
              "Security basics",
              "AI-assisted build review"
            ]
          },
          {
            "title": "BitBooks",
            "eyebrow": "Team enablement",
            "description": "Provided product and technical delivery structure for a team of accountants, Bitcoin-focused stakeholders, and non-technical contributors. The role was to make the work concrete enough that the team could define requirements, inspect prototypes, report issues, and move changes through environments with confidence.",
            "bullets": [
              "Created structure for requirements definition, prototype review, mockup feedback, and issue reporting.",
              "Coached the team through dev, staging, and production release expectations with documentation and checkpoints.",
              "Helped establish safeguards for identifying bugs, regressions, and vulnerabilities despite limited engineering depth on the team."
            ],
            "links": [
              {
                "label": "Visit BitBooks",
                "href": "https://www.bitbooks.com/"
              }
            ],
            "tags": [
              "Requirements shaping",
              "Prototype review",
              "Bug reporting",
              "Release safeguards"
            ]
          }
        ],
        "detailSections": [
          {
            "title": "How I mentor teams into technical work",
            "eyebrow": "Operating style",
            "paragraphs": [
              "A lot of useful software starts with people who understand the domain better than they understand the implementation path. My role in these projects was to make that path visible: what should be built first, what needs review, what can wait, and where security or deployment risk should slow the team down.",
              "I treat mentoring as part of delivery. Requirements, mockups, bug reports, deployment notes, and vulnerability checks are not overhead; they are the shared language that lets non-technical teams participate in building safer software."
            ],
            "bullets": [
              "Turn vague ideas into product slices the team can reason about.",
              "Give non-technical stakeholders enough technical literacy to make better tradeoff decisions.",
              "Use documentation and release checkpoints to keep MVP speed from turning into invisible risk."
            ]
          }
        ],
        "quickFacts": []
      },
      {
        "id": "experience",
        "navLabel": "Ivy Impact",
        "eyebrow": "OPERATING PROOF & CURRENT EMPLOYMENT",
        "title": "Ivy Energy",
        "intro": "I am currently employed at Ivy Energy handling: security, data, integrations, internal tools, and AI adoption work carried through real production constraints.",
        "summary": "My role requires wearing multiple hats, working with stakeholders across the organization, discovering operational needs and designing solutions tailored to those needs. This includes being involved in multiple teams daily standups, training & onboarding internal users on the uses of new tools. As the sole employee at the company responsible for cyber security I have to balance the line between speed and convenience of operations, and security.",
        "accent": "#3f5f48",
        "heroGradient": "linear-gradient(135deg, rgba(63, 95, 72, 0.18) 0%, rgba(196, 223, 195, 0.85) 100%)",
        "metrics": [
          {
            "value": "SOC 2",
            "label": "Security program built from scratch and maintained"
          },
          {
            "value": "Data layer",
            "label": "Core workloads and reporting modernized for downstream use"
          },
          {
            "value": "AI tools",
            "label": "Operational teams coached through secure AI adoption"
          }
        ],
        "cards": [
          {
            "title": "AI mentoring and adoption",
            "eyebrow": "Operator enablement",
            "description": "I have helped non-technical operational teammates use AI in practical ways without treating it as magic. That means teaching where AI is useful, where review is required, what data should not be pasted into tools, and how to turn one-off prompts into repeatable workflows.",
            "bullets": [
              "Coached safe prompting, output review, and sensitive-data handling.",
              "Helped operators turn recurring work into reusable AI-assisted workflows.",
              "Kept adoption tied to real business systems, not isolated demos."
            ],
            "tags": [
              "AI training",
              "Workflow design",
              "Safe adoption"
            ]
          },
          {
            "title": "Operating outcomes",
            "eyebrow": "Impact",
            "description": "The strongest outcomes map directly to trusted AI product work:",
            "bullets": [
              "Built and maintained Ivy Energy's SOC 2 program from a blank slate, including controls, evidence, access review, and process ownership.",
              "Modernized data movement into Snowflake and downstream workflows so operational data could be used reliably.",
              "Integrated Salesforce, Zendesk, Slack, ClickUp, Odoo, Snowflake, and adjacent systems.",
              "Coached non-technical operators on secure AI use, output review, sensitive-data handling, and repeatable workflows."
            ]
          }
        ],
        "detailSections": [
          {
            "title": "Work Experience",
            "eyebrow": "Ivy Energy | 2019 - Present",
            "paragraphs": [
              "I started with Ivy Energy in 2019 as a contractor doing web development work, then grew with the company as its needs changed. The role expanded from building useful web surfaces into IT ownership, Salesforce administration, data engineering, AI enablement, and the organizations cybersecurity program.",
              "That path is the best shorthand for how I work: I find the real operational need, take responsibility for the messy middle, and keep learning the systems required to make the work durable."
            ],
            "bullets": [
              "Started as a web development contractor before moving into broader internal systems work.",
              "Took on IT and Salesforce administration as the company scaled and needed stronger operational infrastructure.",
              "Adopted data engineering, AI enablement, and cybersecurity responsibilities as the trust and workflow surface grew."
            ]
          }
        ],
        "quickFacts": []
      },
      {
        "id": "skills",
        "navLabel": "Capabilities",
        "showHero": false,
        "eyebrow": "Capability Map",
        "title": "Four Leverage Zones",
        "intro": "The useful mix is AI workflow design, data and business-system integration, secure architecture, and operator enablement.",
        "summary": "I am strongest when one builder needs to understand the user, shape the workflow, wire the systems, and keep the trust model visible.",
        "accent": "#8b6b2f",
        "heroGradient": "linear-gradient(135deg, rgba(139, 107, 47, 0.18) 0%, rgba(234, 215, 171, 0.85) 100%)",
        "metrics": [],
        "cards": [
          {
            "title": "AI workflow and product design",
            "eyebrow": "AI product layer",
            "description": "I design AI workflows as products: prompts, context, tools, review, and interfaces built around a real job. The goal is not novelty; it is a workflow a person can understand, inspect, and keep using.",
            "tags": [
              "MCP",
              "Agent interfaces",
              "Human review",
              "Grounded context",
              "Prompt systems"
            ]
          },
          {
            "title": "Data and business-system integration",
            "eyebrow": "Operational layer",
            "description": "I work under the product surface where data movement, APIs, warehouses, CRMs, and ERPs decide whether the workflow actually works. This is where many AI tools either become real software or stay a demo.",
            "tags": [
              "SQL",
              "Snowflake",
              "dbt",
              "Salesforce",
              "Zendesk",
              "Odoo",
              "APIs",
              "ELT"
            ]
          },
          {
            "title": "Secure architecture and compliance",
            "eyebrow": "Trust layer",
            "description": "I think about permissions, controls, auditability, deployment risk, and maintainability while the product is still being shaped. That background matters most when AI touches sensitive workflows or production systems.",
            "tags": [
              "SOC 2",
              "RBAC",
              "Secure delivery",
              "Auditability",
              "Deployment risk"
            ]
          },
          {
            "title": "Product delivery and operator enablement",
            "eyebrow": "Builder layer",
            "description": "I turn vague operator pain into a useful first version, then teach the workflow well enough that a non-technical team can keep using it. I care about the handoff because adoption is part of the product.",
            "tags": [
              "TypeScript",
              "React",
              "Next.js",
              "Requirements shaping",
              "Operator training",
              "Documentation"
            ]
          }
        ],
        "detailSections": [],
        "quickFacts": []
      },
      {
        "id": "about",
        "navLabel": "About",
        "eyebrow": "About Me",
        "title": "Builder Temperament",
        "intro": "I like understanding how things work, taking them apart, rebuilding them, and turning curiosity into something useful.",
        "summary": "That instinct started with hardware and repair work before it became a career in software, security, data, and product systems.",
        "accent": "#9d6335",
        "heroGradient": "linear-gradient(135deg, rgba(157, 99, 53, 0.18) 0%, rgba(235, 203, 171, 0.86) 100%)",
        "heroImage": {
          "src": "/images/family-photo.webp",
          "alt": "Family photo of Daenon Janis, Julie Janis, and their child outdoors",
          "caption": "Family photo from life in Ogden, Utah.",
          "width": 1400,
          "height": 933,
          "objectPosition": "center"
        },
        "metrics": [],
        "cards": [
          {
            "title": "Builder temperament",
            "eyebrow": "Early instincts",
            "description": "I grew up building computers, repairing phones, chasing new gadgets, and wanting to understand the systems underneath the surface.",
            "tags": [
              "Hardware roots",
              "Systems thinking",
              "Practical ownership"
            ]
          },
          {
            "title": "Home life",
            "eyebrow": "Ogden, Utah",
            "description": "I live in Ogden with my wife Julie, a YA fantasy author, and our son Orion. We also have one more child on the way.",
            "tags": [
              "Family life",
              "Creative home",
              "Grounded ambition"
            ]
          },
          {
            "title": "Flight simulation and VR/AR",
            "eyebrow": "Immersive systems",
            "description": "I am interested in flight simulation, VR, and AR because they sit at the edge of software, hardware, spatial interfaces, and embodied learning. They are a fun version of the same thing I like professionally: making complex systems understandable enough to operate.",
            "tags": [
              "Flight simulation",
              "VR / AR",
              "Interface design"
            ]
          },
          {
            "title": "Lake time and efoil tinkering",
            "eyebrow": "Outside projects",
            "description": "I like lake days, efoils, and the practical maintenance side that comes with owning gear that touches water, batteries, firmware, and real-world conditions.",
            "tags": [
              "Efoil",
              "Lake activities",
              "Hands-on repair"
            ]
          },
          {
            "title": "Home lab automation",
            "eyebrow": "House systems",
            "description": "I enjoy home lab automation because it lets me experiment with infrastructure, monitoring, controls, and reliability in a personal environment where the feedback loop is immediate.",
            "tags": [
              "Home lab",
              "Automation",
              "Monitoring"
            ]
          },
          {
            "title": "DIY solar and backup power",
            "eyebrow": "Power projects",
            "description": "I have a strong interest in DIY solar and 120/240v backup systems: practical electrical architecture, resilience, safe wiring patterns, and building systems that keep working when all else fails.",
            "tags": [
              "DIY solar",
              "120/240v backup",
              "Resilience"
            ]
          }
        ],
        "detailSections": [],
        "quickFacts": []
      },
      {
        "id": "contact",
        "navLabel": "Contact",
        "eyebrow": "Start A Conversation",
        "title": "Contact",
        "intro": "For AI product roles, internal platform work, founder-led special projects, or Ludflow/MCP-native conversations, email is the best place to start.",
        "summary": "The best-fit conversations start with messy operational problems that need to become secure, usable software.",
        "accent": "#4b5563",
        "heroGradient": "linear-gradient(135deg, rgba(75, 85, 99, 0.18) 0%, rgba(211, 219, 228, 0.84) 100%)",
        "metrics": [],
        "cards": [
          {
            "title": "Email",
            "eyebrow": "Primary route",
            "description": "Reach out for AI product roles, internal platform work, founder-led special projects, consulting, or conversations around Ludflow and MCP-native tools.",
            "links": [
              {
                "label": "deej@ludflow.com",
                "href": "mailto:deej@ludflow.com"
              }
            ],
            "tags": []
          }
        ],
        "quickFacts": []
      }
    ],
    "defaultWindow": {
      "position": {
        "x": 132,
        "y": 74
      },
      "size": {
        "width": 860,
        "height": 620
      }
    }
  }
} satisfies PortfolioContentSource;

export const siteProfile = contentSource.siteProfile;
export const resume = contentSource.resume;

import type { PortfolioContentSource } from "@/types";

export const contentSource = {
  "siteProfile": {
    "name": "Daenon Janis",
    "title": "Forward-Deployed AI Product Engineer",
    "location": "Ogden, Utah",
    "summary": "I build AI workflow software and the systems around it: data, integrations, and security."
  },
  "resume": {
    "id": "resume",
    "desktopLabel": "Resume",
    "iconLabel": "CV",
    "windowTitle": "Resume",
    "accent": "#2f6b73",
    "executiveSummary": {
      "title": "Forward-Deployed AI Product Engineer",
      "intro": "I build AI workflow software and the systems around it: data, integrations, and security. I'm most useful when a founder or operations team needs one person who can figure out what's broken, build the fix, and teach people to use it safely.",
      "summary": "I build AI workflow software and the systems around it: data, integrations, and security.",
      "heroImage": {
        "src": "/images/personal-profile.webp",
        "alt": "Daenon Janis in a flight simulator setup",
        "width": 512,
        "height": 512,
        "objectPosition": "center"
      },
      "metrics": [
        {
          "value": "Security Aware",
          "label": "Built security programs and compliant software from bootstrap through Series A"
        },
        {
          "value": "AI products",
          "label": "Ludflow, MCPViews, and DecidR MCP"
        },
        {
          "value": "Since 2019",
          "label": "Security, data, integrations, and AI adoption at Ivy Energy"
        }
      ],
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
        "id": "experience",
        "label": "Experience"
      },
      {
        "id": "consulting",
        "label": "Consulting"
      },
      {
        "id": "open-source",
        "label": "Open Source"
      },
      {
        "id": "skills",
        "label": "Skills"
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
        "title": "AI Products",
        "intro": "I've built three AI products. Each one gives AI better context or gives people a clearer way to review and act on what it produces.",
        "summary": "",
        "accent": "#2d5f93",
        "metrics": [],
        "cards": [
          {
            "title": "Ludflow",
            "eyebrow": "Commercial platform",
            "description": "Documentation, data governance, and MCP context for AI tools. Ludflow also stores the documents behind DecidR MCP's decisions and projects.",
            "links": [
              {
                "label": "Visit Ludflow",
                "href": "https://ludflow.com"
              }
            ],
            "tags": [
              "AI documentation",
              "Data governance",
              "MCP"
            ],
            "windowId": "ludflow"
          },
          {
            "title": "MCPViews",
            "eyebrow": "Open source",
            "description": "A desktop companion that shows AI agent output as reviewable interfaces instead of chat text. It carries workflows and instructions between tools and uses breadcrumb-style rule discovery to keep token use low.",
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
              "Agent UI",
              "Review workflows",
              "Token efficiency"
            ],
            "windowId": "mcpviews"
          },
          {
            "title": "DecidR MCP",
            "eyebrow": "Project management for AI teams",
            "description": "Project management and governance for teams that work with AI. It connects to any MCP-capable tool, so people can work with their AI assistants and still collaborate with each other asynchronously. Decisions, approvals, and implementation context stay in one place.",
            "links": [
              {
                "label": "Visit DecidR MCP",
                "href": "https://decidrmcp.com"
              }
            ],
            "tags": [
              "MCP",
              "Decision tracking",
              "Approvals"
            ],
            "windowId": "decidr-mcp"
          }
        ]
      },
      {
        "id": "experience",
        "navLabel": "Experience",
        "title": "Ivy Energy",
        "intro": "I joined Ivy Energy in 2019 as a web development contractor. The job grew into IT, Salesforce administration, data engineering, AI enablement, product R&D, and security.",
        "summary": "I sit in on several teams' daily standups and turn what I hear into tools and training.",
        "accent": "#3f5f48",
        "metrics": [],
        "cards": [
          {
            "title": "Security program",
            "eyebrow": "SOC 2",
            "description": "Built Ivy's SOC 2 program from scratch and still run it, including controls, evidence, access reviews, and process ownership. I'm the only person at the company responsible for cybersecurity, so I weigh every control against how fast the rest of the team needs to move."
          },
          {
            "title": "Data and integrations",
            "eyebrow": "Snowflake, Salesforce, Odoo",
            "description": "Moved core data and reporting into Snowflake so operational data could be used reliably downstream. Connected Salesforce, Zendesk, Slack, ClickUp, Odoo, and Snowflake."
          },
          {
            "title": "AI adoption",
            "eyebrow": "Operations teams",
            "description": "Taught non-technical teammates where AI helps, when its output needs a second look, and what data should never be pasted into it.",
            "bullets": [
              "Coached safe prompting, output review, and sensitive-data handling.",
              "Helped teams turn recurring tasks into repeatable AI-assisted workflows.",
              "Kept the work tied to the systems the company already runs on."
            ]
          },
          {
            "title": "Product R&D",
            "eyebrow": "Forward-deployed engineer",
            "description": "Worked in product R&D as a forward-deployed engineer."
          }
        ]
      },
      {
        "id": "consulting",
        "navLabel": "Consulting",
        "title": "Consulting",
        "intro": "I take on data and AI builds, and I coach founders without a technical background through turning an idea into software they can review, ship, and keep reasonably secure.",
        "summary": "",
        "accent": "#6f5f8f",
        "metrics": [],
        "cards": [
          {
            "title": "Data pipeline and AI reporting",
            "eyebrow": "MLM health company",
            "description": "Built a custom data engineering pipeline for an MLM health company, with AI-enabled reporting that works directly inside ChatGPT.",
            "tags": [
              "Snowflake",
              "dbt",
              "Azure",
              "MCP"
            ]
          },
          {
            "title": "No Food Cravings",
            "eyebrow": "Founder coaching",
            "description": "Coached a non-technical product manager building an MVP for a health and behavior-change idea. The goal was a first version that was realistic, secure enough to learn from, and easy for its owner to understand.",
            "bullets": [
              "Cut the idea down to an MVP with clear boundaries and priorities.",
              "Coached security, account, data, and deployment decisions so early experiments didn't create avoidable risk.",
              "Showed the product owner how to review AI-generated code and weigh tradeoffs without losing control of the product."
            ],
            "links": [
              {
                "label": "Visit No Food Cravings",
                "href": "https://www.nofoodcravings.com/"
              }
            ]
          },
          {
            "title": "BitBooks",
            "eyebrow": "Team enablement",
            "description": "Gave a team of accountants, Bitcoin specialists, and other non-technical contributors a way to define requirements, review prototypes, report issues, and ship changes with confidence.",
            "bullets": [
              "Set up a process for requirements, prototype and mockup review, and issue reporting.",
              "Walked the team through dev, staging, and production releases with documentation and checkpoints.",
              "Put safeguards in place to catch bugs, regressions, and vulnerabilities on a team with little engineering depth."
            ],
            "links": [
              {
                "label": "Visit BitBooks",
                "href": "https://www.bitbooks.com/"
              }
            ]
          }
        ],
        "detailSections": [
          {
            "title": "How I work with non-technical teams",
            "paragraphs": [
              "Good software often starts with people who know the domain better than the build. My job is to show them the path: what to build first, what needs review, what can wait, and where security or deployment risk should slow things down.",
              "Requirements, bug reports, and release notes aren't overhead. They're how a non-technical team takes part in building the product."
            ]
          }
        ]
      },
      {
        "id": "open-source",
        "navLabel": "Open Source",
        "title": "Open Source",
        "intro": "Projects I build in public for the hardware I use: the Valve Steam Frame headset and Even Realities G2 glasses.",
        "summary": "",
        "accent": "#8a3f5b",
        "metrics": [],
        "cards": [
          {
            "title": "Frametop",
            "eyebrow": "VR desktop",
            "description": "A multi-monitor KDE Plasma desktop inside SteamVR on the Valve Steam Frame, plus a 3D mouse pointer that works across all of SteamVR. It installs and runs on the headset itself.",
            "bullets": [
              "A small Wayland compositor gives each screen its own resolution and hands frames to SteamVR as overlays without copying them.",
              "The pointer is anchored in the room and gives the laser back to the controllers when one is picked up.",
              "Bluetooth LE fixes let mice and keyboards like the Swiftpoint Z3 reconnect after they sleep."
            ],
            "tags": [
              "C++",
              "Python",
              "QML",
              "OpenVR",
              "Wayland"
            ],
            "links": [
              {
                "label": "GitHub Repo",
                "href": "https://github.com/DeeJanuz/frametop"
              }
            ],
            "windowId": "frametop",
            "group": "Valve Steam Frame"
          },
          {
            "title": "Frame Voice",
            "eyebrow": "Voice input",
            "description": "Local voice input for the Steam Frame. Speech is transcribed on the headset and typed into whatever app has focus, and a wake word hands spoken commands to scripts. Nothing leaves the headset.",
            "tags": [
              "Python",
              "whisper.cpp",
              "Moonshine"
            ],
            "links": [
              {
                "label": "GitHub Repo",
                "href": "https://github.com/DeeJanuz/frame-voice"
              }
            ],
            "group": "Valve Steam Frame"
          },
          {
            "title": "Faceclaw SDK",
            "eyebrow": "Android app SDK",
            "description": "An SDK in my fork of Faceclaw, the unofficial Even Realities G2 interface, that lets ordinary Android apps draw their own screens on the glasses. Each app keeps its own permissions and data, and the user approves which features it can use.",
            "tags": [
              "Java",
              "Kotlin",
              "Android"
            ],
            "links": [
              {
                "label": "SDK source",
                "href": "https://github.com/DeeJanuz/faceclaw/tree/fix/apk-platform-readiness/android-sdk"
              }
            ],
            "group": "Even Realities G2 glasses"
          },
          {
            "title": "T3 Code bridge",
            "eyebrow": "Glasses app and computer bridge",
            "description": "Runs T3 Code on the glasses. The glasses app reads and continues agent conversations, starts sessions, and takes dictated replies for review. The computer bridge connects to T3 Code and transcribes speech locally with Whisper.",
            "tags": [
              "TypeScript",
              "Java",
              "Tailscale",
              "whisper.cpp"
            ],
            "links": [
              {
                "label": "Bridge",
                "href": "https://github.com/DeeJanuz/faceclaw-t3-bridge"
              },
              {
                "label": "Glasses app",
                "href": "https://github.com/DeeJanuz/faceclaw-t3-app"
              },
              {
                "label": "Even Hub version",
                "href": "https://github.com/DeeJanuz/t3-code-assistant-bridge"
              }
            ],
            "group": "Even Realities G2 glasses"
          },
          {
            "title": "Messages for Faceclaw",
            "eyebrow": "Signal and SMS",
            "description": "A glasses inbox for Signal and SMS. Signal connects straight from the phone as a linked device, and T3 agents can draft replies that are reviewed and sent from the glasses.",
            "tags": [
              "Kotlin",
              "libsignal",
              "SQLCipher"
            ],
            "links": [
              {
                "label": "GitHub Repo",
                "href": "https://github.com/DeeJanuz/deej-faceclaw-messenger"
              }
            ],
            "group": "Even Realities G2 glasses"
          }
        ]
      },
      {
        "id": "skills",
        "navLabel": "Skills",
        "title": "Skills",
        "intro": "",
        "summary": "",
        "accent": "#8b6b2f",
        "metrics": [],
        "cards": [
          {
            "title": "AI product design",
            "description": "Prompts, context, tools, review steps, and interfaces built around a real job, so people can check the output and keep using it.",
            "tags": [
              "MCP",
              "Agent interfaces",
              "Prompt design",
              "Human review"
            ]
          },
          {
            "title": "Data and integrations",
            "description": "Pipelines, APIs, warehouses, CRMs, and ERPs. This is the layer that decides whether an AI tool works in production or stays a demo.",
            "tags": [
              "SQL",
              "Snowflake",
              "dbt",
              "Salesforce",
              "Zendesk",
              "Odoo",
              "APIs"
            ]
          },
          {
            "title": "Security and compliance",
            "description": "Permissions, controls, audit trails, and deployment risk, handled while the product is still taking shape.",
            "tags": [
              "SOC 2",
              "RBAC",
              "Access reviews",
              "Secure delivery"
            ]
          },
          {
            "title": "Delivery and training",
            "description": "Turning a team's problem into a working first version, then teaching them to run it without me.",
            "tags": [
              "TypeScript",
              "React",
              "Next.js",
              "Requirements",
              "Documentation",
              "Training"
            ]
          }
        ]
      },
      {
        "id": "about",
        "navLabel": "About",
        "title": "About",
        "intro": "I've always wanted to know how things work. I grew up building computers and repairing phones, and that curiosity turned into a career in software, security, and data.",
        "summary": "",
        "accent": "#9d6335",
        "heroImage": {
          "src": "/images/family-photo.webp",
          "alt": "Family photo of Daenon Janis, Julie Janis, and their child outdoors",
          "caption": "With Julie and Orion in Ogden.",
          "width": 1400,
          "height": 933,
          "objectPosition": "center"
        },
        "metrics": [],
        "cards": [
          {
            "title": "Family",
            "description": "I live in Ogden with my wife Julie, a YA fantasy author, and our son Orion. Another child is on the way."
          },
          {
            "title": "Flight sim and VR",
            "description": "Flight simulation, VR, and AR mix software, hardware, and interface design, which makes them the fun version of my day job."
          },
          {
            "title": "Efoiling",
            "description": "Lake days on an efoil, plus the maintenance that comes with gear that mixes water, batteries, and firmware."
          },
          {
            "title": "Home lab and power",
            "description": "A home lab for trying out infrastructure, monitoring, and automation, and an interest in DIY solar and 120/240V backup power."
          }
        ]
      },
      {
        "id": "contact",
        "navLabel": "Contact",
        "title": "Contact",
        "intro": "",
        "summary": "",
        "accent": "#4b5563",
        "metrics": [],
        "cards": [
          {
            "title": "Email",
            "description": "For AI product roles, founder-led projects, internal platform work, consulting, or anything Ludflow and MCP.",
            "links": [
              {
                "label": "deej@ludflow.com",
                "href": "mailto:deej@ludflow.com"
              }
            ]
          }
        ]
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

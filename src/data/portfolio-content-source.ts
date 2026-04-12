import type { PortfolioContentSource } from "@/types";

export const contentSource = {
  "siteProfile": {
    "name": "Daenon Janis",
    "title": "AI product builder with secure systems depth",
    "location": "Ogden, Utah",
    "summary": "I help teams turn messy operations, data movement, and AI ideas into secure software people can actually use."
  },
  "portfolioSections": [
    {
      "id": "experience",
      "title": "Past Work",
      "windowTitle": "Past Work",
      "eyebrow": "Past Work",
      "intro": "My past work has centered on security, data engineering, systems integration, and internal product delivery. At Ivy Energy I have spent the last several years owning the kinds of cross-functional systems work that keeps a company compliant, modernizes its data layer, and helps teams turn operational pain into working software.",
      "summary": "The background is broad, but the pattern is consistent: I take on important systems problems that sit between departments, carry them through implementation, and make sure the result is something people can actually use and trust.",
      "sidebarNote": "This page should read like the practical work-history version first, with a lighter explanation of where I want that experience to lead next.",
      "accent": "#3f5f48",
      "heroGradient": "linear-gradient(135deg, rgba(63, 95, 72, 0.18) 0%, rgba(196, 223, 195, 0.85) 100%)",
      "metrics": [
        {
          "value": "SOC 2",
          "label": "Built from scratch, maintained through year two"
        },
        {
          "value": "~33%",
          "label": "Lower database spend after migration"
        },
        {
          "value": "0->1",
          "label": "Secure AI tooling for operations teams"
        }
      ],
      "cards": [
        {
          "title": "Current role",
          "eyebrow": "Ivy Energy",
          "description": "I currently work as a Data Engineer and Senior IT Security Solutions Architect. In practice, that means security and compliance ownership, data platform work, systems integrations, and building internal tools that help teams work faster.",
          "tags": [
            "Security",
            "Data engineering",
            "Systems integration",
            "Internal tools"
          ]
        },
        {
          "title": "Selected outcomes",
          "eyebrow": "Impact",
          "description": "At Ivy I manage difficult infrastructure and operations problems while still shipping things that improve how people work.",
          "bullets": [
            "Built Ivy Energy's SOC 2 program from scratch and carried it through year two by putting real controls in place across engineering, operations, and access management.",
            "Optimized costs by migrating core systems and reshaping the surrounding data architecture with minimal downtime.",
            "Help non-engineering teams ship secure AI-assisted tools that automated support, communications, operations, and cross-system workflows."
          ]
        },
        {
          "title": "How it connects to my goals",
          "eyebrow": "Direction",
          "description": "This experience has pushed me toward roles where I can keep combining secure systems thinking with product building. I want to keep moving deeper into AI-native products, internal platforms, and workflow software where range is an advantage.",
          "tags": [
            "AI-native product",
            "Internal platforms",
            "Workflow software",
            "Cross-functional ownership"
          ]
        }
      ],
      "detailSections": [
        {
          "title": "Current work at Ivy Energy",
          "eyebrow": "Data Engineer & Senior IT Security Solutions Architect | 2020 - Present",
          "paragraphs": [
            "My role at Ivy Energy sits at the intersection of data engineering, security architecture, and internal product delivery. I get pulled into the work that spans departments, touches critical systems, and cannot be cleanly owned by a single specialty.",
            "That has meant maintaining compliance and security obligations, modernizing database and analytics infrastructure, building integrations across operational systems, and helping teams outside core engineering ship software that materially improves how they work."
          ]
        },
        {
          "title": "Scope and responsibility",
          "eyebrow": "What I actually own",
          "bullets": [
            "Built Ivy Energy's security posture from the ground up through SOC 2 readiness and then maintained that program through year two with the controls required for a modern software company.",
            "Migrated core workloads off older systems and modernized the data layer so operational and product data could move cleanly into Snowflake for reporting, automation, and downstream use.",
            "Built and maintained integrations across Salesforce, Zendesk, Slack, ClickUp, Odoo, Snowflake, and other business-critical internal systems.",
            "Created secure internal tools and AI-assisted workflows for operations teams that needed working software quickly without creating risk for the core product or deployment environment.",
            "Acted as the translator between technical and non-technical teams so process pain could become deployable software instead of getting stuck as a vague internal request."
          ]
        },
        {
          "title": "How this background connects to where I want to go",
          "eyebrow": "Role direction",
          "paragraphs": [
            "The part of this background I want to keep compounding is the combination of systems depth and product usefulness. I like roles where internal tools matter, where AI can improve how teams actually operate, and where the builder is close enough to the real problem to shape the outcome.",
            "That is why the next step I am most interested in is not a narrower specialty. It is work that lets me keep combining secure architecture, data systems, and practical product delivery in one role."
          ]
        }
      ],
      "quickFacts": [
        "This is the most traditional work-history page on the site.",
        "The emphasis is on real scope, outcomes, and ownership.",
        "The direction section is there to connect the work to where I want to keep growing."
      ],
      "defaultWindow": {
        "position": {
          "x": 150,
          "y": 74
        },
        "size": {
          "width": 760,
          "height": 580
        }
      }
    },
    {
      "id": "about",
      "title": "About Me",
      "windowTitle": "About Me",
      "eyebrow": "ABOUT ME",
      "heroImage": {
        "src": "/images/personal-profile.webp",
        "alt": "Daenon Janis in a flight simulator setup"
      },
      "intro": "I am most useful when a team has a messy operational problem, partial requirements, and no patience for a long handoff chain. I like turning that ambiguity into secure, usable software that people actually adopt.",
      "summary": "This is the more personal version of the work story: how I think, how I work with semi-technical teams, and why my background in security and data makes me unusually effective in fast product environments.",
      "sidebarNote": "The through-line is leverage. I like helping people who are close to the problem get better tools without making the underlying systems harder to trust.",
      "accent": "#9d6335",
      "heroGradient": "linear-gradient(135deg, rgba(157, 99, 53, 0.18) 0%, rgba(235, 203, 171, 0.86) 100%)",
      "metrics": [
        {
          "value": "1st",
          "label": "Bias toward a useful first version"
        },
        {
          "value": "Cross",
          "label": "Between technical and non-technical teams"
        },
        {
          "value": "AI",
          "label": "Used for acceleration, not theater"
        }
      ],
      "cards": [
        {
          "title": "How I help teams move faster",
          "eyebrow": "Narrative",
          "description": "A lot of my work is translating between subject matter experts, operators, and engineers. I take vague workflow pain, tighten the logic, and turn it into software or automation that saves people real time.",
          "bullets": [
            "I am comfortable working with people who do not think of themselves as builders.",
            "I like moving from messy conversation to a first working version quickly.",
            "I care about adoption, not just technical correctness."
          ]
        },
        {
          "title": "How I build",
          "eyebrow": "Operating style",
          "description": "I care about getting to a useful first version quickly, then hardening it so it can survive real production use. Speed matters, but only if the result is something a team can trust and maintain.",
          "tags": [
            "Ownership",
            "Systems thinking",
            "Clarity",
            "Bias to action"
          ]
        },
        {
          "title": "Best-fit environments",
          "eyebrow": "Direction",
          "description": "I tend to be most useful in hands-on, early, or cross-functional environments where a team needs someone who can bridge product thinking, technical execution, and operational reality."
        }
      ],
      "detailSections": [
        {
          "title": "I bridge product speed and operational reality",
          "eyebrow": "Working style",
          "paragraphs": [
            "A lot of my work lives in spaces where traditional teams stall out. Non-technical people know something is broken, engineering does not want vague requirements, and nobody has time for a long discovery cycle. I enjoy stepping into that gap.",
            "I can work closely with people who do not think of themselves as builders, help them articulate what they need, and shape a first version quickly. Then I can help turn that prototype into something with cleaner architecture, better security, and a real path to production."
          ]
        },
        {
          "title": "Why the security and data background matters",
          "eyebrow": "Leverage",
          "paragraphs": [
            "Because I came up through security, data, and operational systems work, I do not treat speed and safety as opposites. I am used to permissions, compliance obligations, data movement, system boundaries, and the reality that someone has to maintain what gets shipped.",
            "That makes me especially effective on internal platforms, AI-enabled workflows, and cross-system tooling, where a flashy demo is easy but a deployable solution is harder."
          ]
        },
        {
          "title": "Where I create the most leverage",
          "eyebrow": "Best-fit environments",
          "paragraphs": [
            "I click best with teams that want someone hands-on, product-minded, and comfortable moving across boundaries. I like early environments where the right builder can still change how a company operates.",
            "In practice, that usually means work where a company needs help translating real operational pain into secure, usable software instead of over-specialized handoffs."
          ]
        }
      ],
      "quickFacts": [
        "This section is intentionally first-person.",
        "It should feel more human than the main work page, not softer.",
        "The point is to explain how I create leverage, not to retell a chronology."
      ],
      "defaultWindow": {
        "position": {
          "x": 240,
          "y": 122
        },
        "size": {
          "width": 700,
          "height": 540
        }
      }
    },
    {
      "id": "personal",
      "title": "Personal Details",
      "windowTitle": "Personal Details",
      "eyebrow": "Who I Am",
      "heroImage": {
        "src": "/images/personal-profile.webp",
        "alt": "Daenon Janis in a flight simulator setup"
      },
      "intro": "I was born in Provo, Utah and grew up across multiple states in the western half of the United States. Long before technology became my career, it was already the thing I gravitated toward: building computers, repairing phones, chasing new gadgets, and trying to understand how the tools around me actually worked.",
      "summary": "This window is the more personal side of the site. It is less about professional positioning and more about the background, instincts, and family life behind the way I build.",
      "sidebarNote": "The goal here is not to sound polished. It is to show the person behind the systems work.",
      "accent": "#8e5f52",
      "heroGradient": "linear-gradient(135deg, rgba(142, 95, 82, 0.18) 0%, rgba(236, 213, 206, 0.86) 100%)",
      "metrics": [
        {
          "value": "Provo",
          "label": "Born in Utah"
        },
        {
          "value": "West",
          "label": "Raised across multiple western states"
        },
        {
          "value": "Ogden",
          "label": "Home now with my growing family"
        }
      ],
      "cards": [
        {
          "title": "From Provo to the mountain west",
          "eyebrow": "Background",
          "description": "I was born in Provo, Utah and grew up moving through multiple states across the western half of the country. That background gave me a mix of independence, adaptability, and curiosity that has stayed with me into adulthood.",
          "tags": [
            "Utah roots",
            "Western U.S.",
            "Adaptable",
            "Curious by default"
          ]
        },
        {
          "title": "Technology was the hobby before it was the career",
          "eyebrow": "Early instincts",
          "description": "I have always been an early adopter and a builder by temperament. As a teenager I was the kind of person who wanted to understand the hardware, fix the broken thing, and figure out how to make enough money to afford the next gadget I wanted to get my hands on.",
          "bullets": [
            "Built my own computers",
            "Did phone repairs",
            "Chased new gadgets early",
            "Found ways to fund the obsession as a teenager"
          ]
        },
        {
          "title": "Home life now",
          "eyebrow": "Family",
          "description": "I currently live in Ogden, Utah with my wife Julie, who is a YA fantasy author, and our son Orion. We also have one more child on the way, so this chapter of life feels full in the best possible way.",
          "tags": [
            "Ogden, Utah",
            "Family life",
            "Julie Janis",
            "Orion"
          ]
        }
      ],
      "detailSections": [
        {
          "title": "Who I am",
          "eyebrow": "Biography",
          "paragraphs": [
            "I was born in Provo, Utah and grew up across multiple states in the western half of the United States. That kind of upbringing leaves you with a strong sense that identity is something you build as much as inherit, and I think that has shaped a lot of how I approach work and life.",
            "Even early on, I was drawn toward technology with the kind of curiosity that went beyond just liking new devices. I wanted to know how the thing worked, how to fix it, and how to make it better or make it mine."
          ]
        },
        {
          "title": "How technology became part of my identity",
          "eyebrow": "Before it was a job",
          "paragraphs": [
            "Growing up, I was always drawn to the newest technology. I was an early adopter by instinct, but I was never satisfied just being a consumer. I liked building my own computer, doing phone repairs, and learning enough about the hardware and software around me to feel like I could actually shape it.",
            "As a teenager, that interest pushed me toward the kind of hustle that will probably feel familiar to anyone who has ever been obsessed with gear: figuring out ways to make money so I could afford the next gadget, the next upgrade, or the next thing I wanted to take apart and understand."
          ],
          "bullets": [
            "DIY computers and hands-on hardware curiosity",
            "Phone repair and practical troubleshooting",
            "Early adopter instinct paired with technical curiosity",
            "Entrepreneurial streak that started with funding new gadgets"
          ]
        },
        {
          "title": "Family and home life",
          "eyebrow": "The chapter I am in now",
          "image": {
            "src": "/images/family-photo.webp",
            "alt": "Family photo of Daenon Janis, Julie Janis, and their child outdoors",
            "caption": "Family photo from life in Ogden, Utah."
          },
          "paragraphs": [
            "I currently live in Ogden, Utah with my wife Julie and our son Orion, with one more child on the way. Family life matters a lot to me, and it has added a different kind of perspective to ambition, work, and how I think about the future.",
            "Julie is a YA fantasy author, which means our home has a fun mix of technology, storytelling, product ideas, and creative work happening under the same roof. It is a good reminder that building things can take a lot of forms, not all of them technical."
          ],
          "links": [
            {
              "label": "Julie Janis Books",
              "href": "https://www.juliejanisbooks.com/"
            }
          ]
        }
      ],
      "quickFacts": [
        "This section is intentionally more biographical than the rest of the site.",
        "Two placeholder images live here for now: one portrait and one family image.",
        "The goal is to show the person behind the work without making the page feel detached from the rest of the site."
      ],
      "defaultWindow": {
        "position": {
          "x": 280,
          "y": 148
        },
        "size": {
          "width": 740,
          "height": 560
        }
      }
    },
    {
      "id": "projects",
      "title": "Featured Projects",
      "windowTitle": "Projects",
      "eyebrow": "Proof of Build",
      "intro": "These are the public proofs that best match how I work professionally. They show the kinds of problems I like to attack: ambiguous workflows, AI-enabled interfaces, documentation, and systems that bridge humans and software.",
      "summary": "I care less about novelty for its own sake and more about building tools that make collaboration clearer, faster, and more durable.",
      "sidebarNote": "If Past Work explains why I am useful, these projects show how that thinking translates into shipped product.",
      "accent": "#2d5f93",
      "heroGradient": "linear-gradient(135deg, rgba(45, 95, 147, 0.18) 0%, rgba(183, 213, 239, 0.84) 100%)",
      "metrics": [
        {
          "value": "02",
          "label": "Featured public proof points"
        },
        {
          "value": "MCP",
          "label": "AI-native interface pattern"
        },
        {
          "value": "Docs",
          "label": "Knowledge made operational"
        }
      ],
      "cards": [
        {
          "title": "MCPViews",
          "eyebrow": "AI interface platform",
          "description": "I built MCPViews to give AI agents a visual, interactive surface instead of forcing every workflow through raw text.",
          "bullets": [
            "Desktop application that lets agents push rich views into a companion window.",
            "Plugins pair MCP tools with custom renderers, so the UI can fetch native data instead of making the agent carry every detail.",
            "Shows how I think about productizing a real pain point in the emerging AI tooling ecosystem."
          ],
          "links": [
            {
              "label": "GitHub Repo",
              "href": "https://github.com/DeeJanuz/mcpviews"
            }
          ],
          "tags": [
            "Tauri",
            "MCP",
            "Plugins",
            "Interactive UI"
          ]
        },
        {
          "title": "Ludflow",
          "eyebrow": "Documentation and governance platform",
          "description": "Ludflow grew out of a recurring problem: non-technical teams had real process needs, but the requirements they handed engineering were too vague to build from.",
          "bullets": [
            "Turns plain-language input into process documentation teams can actually use.",
            "Connects business concepts, underlying data sources, and written operating knowledge.",
            "Includes companion decision tooling through DecidR for collaborative architecture and implementation approvals."
          ],
          "links": [
            {
              "label": "GitHub Repo",
              "href": "https://github.com/DeeJanuz/ludflow"
            }
          ],
          "tags": [
            "AI documentation",
            "Data governance",
            "Knowledge graph",
            "Operations"
          ]
        }
      ],
      "detailSections": [
        {
          "title": "MCPViews",
          "eyebrow": "The problem, the build, and the takeaway",
          "paragraphs": [
            "MCPViews started from a simple frustration: AI tools were getting more capable, but the user experience around them was still fragmented. There was no clean, unified way for MCP-based tools to present rich interfaces without forcing every workflow through text.",
            "I built MCPViews as more than an app wrapper. It is a local rendering layer where agents can request the right view, push only the minimum state, and let the renderer fetch the rest through its own API connections. That creates a new category of software that sits somewhere between AI tooling and traditional SaaS.",
            "The founder takeaway is the part I care about most: I like identifying real-world workflow pain and building a product shape that makes the experience materially better instead of just adding another technical layer."
          ],
          "links": [
            {
              "label": "GitHub Repo",
              "href": "https://github.com/DeeJanuz/mcpviews"
            },
            {
              "label": "Latest Releases",
              "href": "https://github.com/DeeJanuz/mcpviews/releases/latest"
            }
          ]
        },
        {
          "title": "Ludflow",
          "eyebrow": "Documentation, governance, and AI search",
          "paragraphs": [
            "Ludflow came from repeated situations where subject matter experts knew what they needed operationally, but could not produce useful technical requirements. Bad inputs led to bad builds, frustration, and abandoned projects.",
            "I built Ludflow as a platform where non-technical users can describe processes in plain language, generate clearer documentation, and give technical teams something structured enough to implement. It also makes it easier for technical teams to maintain better documentation over time instead of letting knowledge disappear into chats and tribal memory.",
            "The platform connects business concepts to where those concepts live in data and to the written processes that explain how people and systems should interact with them. DecidR extends that model as a companion decision layer so architecture and implementation can evolve collaboratively instead of getting lost across asynchronous conversations.",
            "This is the kind of product I like building: software that reduces ambiguity, compounds organizational knowledge, and makes future work easier instead of harder."
          ],
          "bullets": [
            "Layer 1: business concepts and attributes people work with every day.",
            "Layer 2: the source systems where that information actually lives.",
            "Layer 3: human-readable process documents and diagrams that AI can search and explain."
          ],
          "links": [
            {
              "label": "GitHub Repo",
              "href": "https://github.com/DeeJanuz/ludflow"
            }
          ]
        }
      ],
      "quickFacts": [
        "These two projects are the strongest public proof of how I think and build.",
        "Each one is here because it maps directly to the story told in the Past Work window.",
        "DecidR is intentionally presented as a companion to Ludflow, not a separate third feature."
      ],
      "defaultWindow": {
        "position": {
          "x": 270,
          "y": 138
        },
        "size": {
          "width": 760,
          "height": 560
        }
      }
    },
    {
      "id": "skills",
      "title": "The Capability Mix That Makes Me Useful",
      "windowTitle": "Skills",
      "eyebrow": "Capability Map",
      "intro": "My value is not that I have touched a long list of tools. It is that I can combine product delivery, cloud and data systems, security, business-system administration, and cross-functional translation in the same role when a company has messy operational problems that need to become real software.",
      "summary": "The point of this page is not to prove I know keywords. It is to show the combination that makes me useful: I can help define the problem, build the workflow or product, wire up the CRM, ERP, and data layer underneath it, shape the infrastructure it runs on, and still think seriously about permissions, compliance, AI workflow design, and long-term maintainability.",
      "sidebarNote": "If the rest of the site explains the story, this page makes the shape of the builder legible.",
      "accent": "#8b6b2f",
      "heroGradient": "linear-gradient(135deg, rgba(139, 107, 47, 0.18) 0%, rgba(234, 215, 171, 0.85) 100%)",
      "metrics": [
        {
          "value": "07",
          "label": "Capability lanes I regularly combine"
        },
        {
          "value": "SOC 2",
          "label": "Security depth carried into product work"
        },
        {
          "value": "AWS -> MCP",
          "label": "Range from infrastructure through AI-native tooling"
        }
      ],
      "cards": [
        {
          "title": "Product delivery, stack selection, and internal tooling",
          "eyebrow": "Build and delivery",
          "description": "Every new product delivery starts with understanding the actual use case, constraints, and users, then selecting the right language, framework, runtime, and interface for the job rather than forcing the same stack onto every problem.",
          "tags": [
            "TypeScript",
            "JavaScript",
            "React",
            "Next.js",
            "Node.js",
            "Python",
            "Rust",
            "Go",
            "Java",
            "C#",
            "SQL",
            "Swift / SwiftUI",
            "Kotlin",
            "React Native",
            "Dart / Flutter"
          ]
        },
        {
          "title": "Data engineering and analytics systems",
          "eyebrow": "Data layer",
          "description": "I can move underneath the UI into the pipelines, warehouse models, and database design that make the product and the business actually useful.",
          "tags": [
            "SQL",
            "PostgreSQL",
            "MySQL",
            "SQLite",
            "MongoDB",
            "Redis",
            "DynamoDB",
            "Snowflake",
            "dbt",
            "Vector databases",
            "ETL / ELT"
          ]
        },
        {
          "title": "CRM, ERP, and product operations systems",
          "eyebrow": "Business systems",
          "description": "I am comfortable not just integrating business systems, but administering and operationalizing them so sales, support, and operations teams can actually work through them cleanly.",
          "tags": [
            "Salesforce",
            "HubSpot",
            "Odoo",
            "GoHighLevel",
            "Product ops"
          ]
        },
        {
          "title": "Cloud infrastructure and secure architecture",
          "eyebrow": "Infrastructure",
          "description": "I can work from the application layer down into deployment, networking, and cloud architecture so the system is not just built, but actually runnable and supportable.",
          "tags": [
            "AWS",
            "Kubernetes",
            "ALB / ELB",
            "Security groups",
            "Networking"
          ]
        },
        {
          "title": "Security, compliance, and trust architecture",
          "eyebrow": "Trust layer",
          "description": "Because I came up through security and IT architecture, I naturally think about permissions, controls, and operational risk while things are still being built.",
          "tags": [
            "SOC 2",
            "RBAC",
            "Vulnerability scanning",
            "Secure delivery",
            "IT"
          ]
        },
        {
          "title": "AI systems and agent tooling",
          "eyebrow": "AI-native build layer",
          "description": "I use AI as an execution layer, not a gimmick, and I am especially interested in systems where prompts, context, tools, and interfaces work together as a real product surface.",
          "tags": [
            "MCP",
            "LangChain",
            "LangGraph",
            "Vector databases",
            "Prompt engineering"
          ]
        },
        {
          "title": "Cross-functional leadership and founder range",
          "eyebrow": "How I operate",
          "description": "A lot of my leverage comes from translating between operators, subject matter experts, founders, and engineers so ambiguous work becomes something a team can actually ship and trust.",
          "tags": [
            "Requirements shaping",
            "Documentation",
            "Stakeholder alignment",
            "Founder mindset"
          ]
        }
      ],
      "detailSections": [
        {
          "title": "Product building for messy real-world workflows",
          "eyebrow": "Where I move fastest",
          "paragraphs": [
            "I am not a pure front-end specialist or a pure back-end operator. I am most effective when a workflow is messy, the requirements are incomplete, and the team needs someone who can talk to the people closest to the pain, define a useful first version, and ship it.",
            "Part of that job is evaluating the actual use case and choosing the right language and tools for it. Some products want a web stack, some want a backend-heavy architecture, some want desktop or mobile surfaces, and some need a mix. I care about UI and UX because even strong internal software fails if people do not want to use it."
          ],
          "bullets": [
            "Architecture, language, and tooling selection based on the real use case",
            "Web, backend, desktop, and mobile product thinking in the same delivery loop",
            "Internal tools and operator-facing software",
            "UI / UX decisions that improve adoption instead of just aesthetics",
            "AI-assisted workflows grounded in real system access and permissions",
            "Fast first versions followed by architectural hardening for production use"
          ]
        },
        {
          "title": "Data engineering, AI context systems, and business-system fluency",
          "eyebrow": "The systems underneath the product",
          "paragraphs": [
            "I am comfortable working below the product surface where the real operational complexity usually lives. That includes SQL, database work across relational, document, cache, warehouse, and vector systems, analytics plumbing, dbt-style transformation layers, system migrations, and the integrations that keep teams from re-entering the same information across five tools.",
            "That has meant moving data from Postgres and internal systems into data lakes such as Snowflake, reshaping architecture to lower cost and improve maintainability, and building integrations across Salesforce, Zendesk, Slack, ClickUp, Odoo, and other core business systems. In my founder work, that systems thinking also extends into MCP-based context, AI retrieval, and vector-backed knowledge layers."
          ],
          "bullets": [
            "Database migrations and architecture changes with operational constraints",
            "SQL, warehouse modeling, and downstream reporting for real business use",
            "Relational, document, cache, and vector database patterns",
            "Snowflake and dbt-oriented analytics workflows",
            "Vector databases and structured context layers for AI systems",
            "API integrations and sync workflows across internal and vendor systems"
          ]
        },
        {
          "title": "CRM, ERP, and product operations administration",
          "eyebrow": "Operational systems people actually rely on",
          "paragraphs": [
            "I am comfortable in the systems most companies actually run on: CRM platforms, support systems, ERP flows, and the operational glue between them. That matters because a lot of high-leverage software work starts with cleaning up the systems teams already live in every day.",
            "That includes hands-on work in Salesforce, HubSpot, Odoo, GoHighLevel, Zendesk, Slack, ClickUp, and adjacent business tooling, both from an administration perspective and from the perspective of building automations and integrations around them."
          ],
          "bullets": [
            "CRM and ERP administration tied to real process design",
            "Product operations and revenue operations workflow support",
            "Cross-system automations that reduce manual handoffs and duplicate work"
          ]
        },
        {
          "title": "Cloud infrastructure, networking, and full-stack deployment",
          "eyebrow": "What makes the software actually run",
          "paragraphs": [
            "I can work through the deployment and infrastructure layer rather than handing it off conceptually. That includes AWS, GCP, or Azure architecture, full-stack deployment concerns, networking boundaries, and the operational details that make an environment maintainable.",
            "I am comfortable with the cloud primitives and infrastructure patterns that sit underneath modern product delivery, including Kubernetes, load balancing, security groups, and the kind of environment-level decisions that affect scale, security, and reliability."
          ],
          "bullets": [
            "AWS, GCP, Azure architectures and deployment workflows",
            "Kubernetes-based application deployment",
            "ALB / ELB, security groups, and networking fundamentals",
            "Full-stack deployment thinking from app code to runtime environment"
          ]
        },
        {
          "title": "Security, compliance, and operational hardening",
          "eyebrow": "Why I do not treat speed and safety as opposites",
          "paragraphs": [
            "Because I came up through security and operational systems work, I do not think of security as something you paste on after the product exists. I naturally think about permissions, auditability, control design, and how a team will safely live with a system after the first version ships.",
            "That background is a big reason I am useful in AI-enabled internal tooling. I can help teams move quickly without ignoring the uncomfortable questions about access, data handling, deployment practices, and who is responsible when the workflow becomes business critical. As well as knowing when to ignore false positives."
          ],
          "bullets": [
            "Built and maintained SOC 2 controls across departments for a maturing organization",
            "RBAC, code review, vulnerability scanning, and policy-driven operational controls",
            "Secure delivery patterns for internal tools that touch sensitive product and customer data"
          ]
        },
        {
          "title": "AI-native systems, agent workflows, and prompt design",
          "eyebrow": "Using AI as a real software layer",
          "paragraphs": [
            "I do not think about AI as just calling a model and hoping for the best. The interesting work is designing how prompts, context, retrieval, tool use, human review, and interfaces fit together into something reliable enough to matter. As well as identifying when NOT to use LLM's.",
            "That is where work around MCP, LangChain, LangGraph, vector databases, prompt engineering, and AI-assisted workflow design becomes useful. I care about grounded context, practical evaluation, and shipping AI systems that are actually helpful to the people using them."
          ],
          "bullets": [
            "MCP-native interfaces and tool ecosystems",
            "LangChain and LangGraph style orchestration patterns",
            "Prompt engineering tied to workflow quality, not prompt theater",
            "Human-in-the-loop review patterns for higher-trust AI systems"
          ]
        },
        {
          "title": "Communication, product shaping, and founder usefulness",
          "eyebrow": "The non-code skills that multiply the technical ones",
          "paragraphs": [
            "A lot of my leverage comes from working well with people who are close to the problem but are not traditional software builders. I can pull requirements out of operational conversation, tighten the logic, and create something technical teams can implement without guessing.",
            "That is also why founder and early-stage environments make sense for me. I like owning broad slices of work, writing clearly, shaping product direction, and staying close enough to the details that strategy still turns into shipped systems."
          ],
          "bullets": [
            "Cross-functional communication with semi-technical and non-technical stakeholders",
            "Documentation and system explanation that reduce ambiguity instead of adding more of it",
            "Ownership across discovery, implementation, rollout, and ongoing improvement"
          ]
        }
      ],
      "quickFacts": [
        "The mix matters more than any single tool: product, data, security, and communication in one builder.",
        "Business systems fluency here means both administration and integration work, not just API familiarity.",
        "Cloud, infrastructure, and AI skills are included because I use them as part of real delivery, not as side interests.",
        "Most of the technologies listed here appear elsewhere in the site because I only surface skills I use in real systems.",
        "I am strongest when the work crosses team boundaries and nobody else cleanly owns it."
      ],
      "defaultWindow": {
        "position": {
          "x": 120,
          "y": 132
        },
        "size": {
          "width": 760,
          "height": 560
        }
      }
    },
    {
      "id": "businesses",
      "title": "Founder Work",
      "windowTitle": "Businesses",
      "eyebrow": "Founder Work",
      "intro": "These are the founder-led products I am building outside my day job. They matter because they show more than implementation ability: they show product taste, positioning, and a willingness to turn recurring pain into something real people can use.",
      "summary": "I do not just like building inside existing systems. I like identifying a wedge, shaping a product around it, and building the technical foundation for something that could stand on its own.",
      "sidebarNote": "The distinction from Projects is ownership. These are product bets and platforms I am building with a founder mindset, not just technical proofs.",
      "accent": "#7b4b45",
      "heroGradient": "linear-gradient(135deg, rgba(123, 75, 69, 0.18) 0%, rgba(228, 196, 188, 0.84) 100%)",
      "metrics": [
        {
          "value": "03",
          "label": "Founder-led products in the current orbit"
        },
        {
          "value": "02",
          "label": "Live public product sites"
        },
        {
          "value": "OSS",
          "label": "Open-source distribution paired with private product work"
        }
      ],
      "cards": [
        {
          "title": "Ludflow",
          "eyebrow": "Private company",
          "description": "Ludflow is my privately owned platform for AI documentation, data governance, and MCP-based organizational context. It is built around a simple problem: teams do not trust documentation that drifts away from code, schemas, and operational reality. It also includes the surrounding decision and workflow tooling that I think belongs inside the broader Ludflow ecosystem.",
          "links": [
            {
              "label": "Visit Ludflow",
              "href": "https://ludflow.com"
            }
          ],
          "tags": [
            "Private company",
            "AI documentation",
            "Data governance",
            "MCP ecosystem"
          ]
        },
        {
          "title": "MCPViews",
          "eyebrow": "Open-source product",
          "description": "MCPViews is an open-source desktop companion that gives AI agents a visual interface, plugin system, and a richer interaction model than plain text alone. It is both a usable product and a public bet on where MCP-native software is going.",
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
            "Developer tool",
            "Desktop app",
            "Plugin system"
          ]
        },
        {
          "title": "DecidR MCP",
          "eyebrow": "Product in the Ludflow ecosystem",
          "description": "DecidR MCP is the decision and project-management layer inside the broader Ludflow ecosystem. It reflects how I think AI-native teams should coordinate work, architecture decisions, and stakeholder approval without turning everything into micromanaged tickets.",
          "tags": [
            "Ludflow ecosystem",
            "Decision workflows",
            "AI-native teams",
            "Project coordination"
          ]
        }
      ],
      "detailSections": [
        {
          "title": "Ludflow",
          "eyebrow": "Private product and company",
          "paragraphs": [
            "Ludflow is the clearest example of my founder instincts. The core problem is that most organizations split knowledge across code, schemas, docs, and tribal memory, then expect both humans and AI tools to somehow stitch the truth back together.",
            "The product thesis is that documentation, governance, and AI context should not be separate systems. Ludflow generates documentation from the codebase and schemas, tracks ownership, and gives AI agents grounded context through MCP so the answer is easier to find and easier to trust.",
            "Within that broader Ludflow ecosystem, I am also shaping the decision and workflow layer that helps teams collaborate on architecture, implementation choices, and stakeholder buy-in. I think of that as part of the Ludflow product system rather than a separate public-facing company.",
            "As a founder bet, this shows how I like to work: start with a painful reality, sharpen the market point of view, and build something that unifies fragmented workflows into a clearer operating system."
          ],
          "links": [
            {
              "label": "Visit Ludflow",
              "href": "https://ludflow.com"
            }
          ]
        },
        {
          "title": "MCPViews",
          "eyebrow": "Open-source product and ecosystem wedge",
          "paragraphs": [
            "MCPViews comes from a different founder instinct. Instead of packaging internal knowledge, it creates a better interface layer for AI-native software. The core idea is that agents should not be trapped inside text-only outputs when the underlying workflows clearly want tables, diagrams, reviews, and live interaction.",
            "I positioned MCPViews as an open-source, free-to-use companion with plugins, live API hydration, and review workflows. That makes it both a real tool and a way to explore how MCP-native products can blur the line between AI tooling and traditional SaaS.",
            "The business value for me is not just the code. It is the distribution model, the public proof, and the chance to test product ideas in the open while building trust with technical users."
          ],
          "links": [
            {
              "label": "Visit MCPViews",
              "href": "https://mcpviews.com"
            },
            {
              "label": "GitHub Repo",
              "href": "https://github.com/DeeJanuz/mcpviews"
            }
          ]
        },
        {
          "title": "DecidR MCP",
          "eyebrow": "Decision and workflow layer in the Ludflow ecosystem",
          "paragraphs": [
            "DecidR MCP is its own product concept, but I think of it as part of the broader Ludflow ecosystem rather than a separate standalone company. It focuses on the collaboration layer around initiatives, projects, architecture decisions, and stakeholder buy-in.",
            "The idea is that AI-native teams should be able to work at a higher level than individual tickets. Instead of centering everything around task micromanagement, DecidR helps people own larger slices of work, pass decisions asynchronously, and keep implementation context attached to the actual architecture.",
            "Including it here matters because it shows I am thinking in systems of products. Ludflow handles documentation, governance, and context; DecidR extends that into decision-making and execution."
          ],
          "bullets": [
            "Built for AI-native collaboration rather than traditional ticket-first project management.",
            "Connects decisions, documentation, and implementation context across stakeholders.",
            "Presented as part of the Ludflow ecosystem, which is why it is not framed here as a separate standalone site."
          ]
        }
      ],
      "quickFacts": [
        "Ludflow is the private commercial product in the set.",
        "MCPViews is the open-source public-facing product with its own site and repo.",
        "DecidR MCP is its own entity, but it is intentionally presented as part of the broader Ludflow ecosystem."
      ],
      "defaultWindow": {
        "position": {
          "x": 220,
          "y": 110
        },
        "size": {
          "width": 720,
          "height": 540
        }
      }
    },
    {
      "id": "contact",
      "title": "Contact",
      "windowTitle": "Contact",
      "eyebrow": "Start A Conversation",
      "intro": "If you want to reach me for a role, a project, or a conversation about something I am building, email is the best place to start.",
      "summary": "I do not need a complicated contact page. One clear route is enough.",
      "sidebarNote": "A simple email beats a cluttered contact stack.",
      "accent": "#4b5563",
      "heroGradient": "linear-gradient(135deg, rgba(75, 85, 99, 0.18) 0%, rgba(211, 219, 228, 0.84) 100%)",
      "metrics": [
        {
          "value": "01",
          "label": "Primary contact route"
        },
        {
          "value": "01",
          "label": "Clear call to action"
        },
        {
          "value": "Email",
          "label": "Best way to reach me"
        }
      ],
      "cards": [
        {
          "title": "Email",
          "eyebrow": "Primary route",
          "description": "For projects, partnerships, founder work, consulting, or general outreach, email me directly here.",
          "links": [
            {
              "label": "deej@ludflow.com",
              "href": "mailto:deej@ludflow.com"
            }
          ],
          "tags": [
            "Projects",
            "Consulting",
            "Founder conversations"
          ]
        }
      ],
      "quickFacts": [
        "Email is the only contact route surfaced here on purpose.",
        "This page is intentionally simple.",
        "If someone wants to talk, they should know exactly where to start."
      ],
      "defaultWindow": {
        "position": {
          "x": 320,
          "y": 152
        },
        "size": {
          "width": 660,
          "height": 500
        }
      }
    }
  ]
} satisfies PortfolioContentSource;

export const siteProfile = contentSource.siteProfile;
export const portfolioSections = contentSource.portfolioSections;

# Architecture Decision Records (ADRs)

This document captures the architectural patterns and major technical decisions for the resume site.

---

## How To Use ADRs

When a meaningful architectural decision is made:
1. Add a new entry using the template below.
2. Capture the problem, the decision, and the trade-offs.
3. Mark older decisions as superseded instead of deleting them.

---

## ADR Template

```markdown
## ADR-XXX: [Decision Title]
**Date:** YYYY-MM-DD
**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-YYY]
**Deciders:** [Names or roles]

### Context
[What problem are we solving?]

### Decision
[What did we choose?]

### Rationale
[Why this approach instead of the alternatives?]

### Consequences
**Positive:**
- [Benefits]

**Negative:**
- [Costs or trade-offs]

**Neutral:**
- [Operational implications]
```

---

## Active Decisions

### ADR-001: Present the Site as a Desktop-Style Portfolio Experience
**Date:** 2026-04-09
**Status:** Accepted
**Deciders:** Site Owner, Codex

### Context
This project is a personal resume and portfolio site meant to advertise employment history, businesses, and projects. It needs to stand out from a standard one-column resume page while still staying understandable for recruiters, clients, and collaborators.

The visual direction is similar to `../mcpviews-website`, but the experience does not need the agent/chat metaphor. Instead, the site should feel like a modern macOS desktop where visitors open files and windows to explore the resume.

### Decision
Use a desktop-inspired interaction model on larger screens:
- Render a desktop workspace as the primary landing experience.
- Represent resume content as clickable desktop files, folders, and shortcuts.
- Open focused windows for sections such as Resume, Experience, Businesses, Projects, and Contact.
- Use a simpler mobile presentation rather than forcing full desktop emulation on small screens.

### Rationale
This keeps the site memorable without making the interaction confusing. The desktop metaphor supports exploration, lets us group content naturally, and aligns with the existing `mcpviews-website` interaction patterns we already know how to build.

Alternatives considered:
1. A traditional scrolling portfolio page.
2. A fake operating system recreation across all breakpoints.
3. A chat-driven interface similar to the MCPViews demo.

Why this approach:
- More distinctive than a normal resume page.
- Less gimmicky than a full OS simulation.
- Better aligned with the actual content than an agent demo.

### Consequences
**Positive:**
- Strong visual identity for hiring and business discovery.
- Natural grouping of employment, companies, and project work.
- Reusable desktop and windowing patterns from the reference project.

**Negative:**
- Higher frontend complexity than a static landing page.
- Requires careful accessibility and mobile fallbacks.
- Visual polish matters more because the UI metaphor is prominent.

**Neutral:**
- Content structure must be defined early so files and windows map cleanly to real information.

---

### ADR-002: Adapt SOLID and Hexagonal Principles to a Frontend-First Experience Shell
**Date:** 2026-04-09
**Status:** Accepted
**Deciders:** Site Owner, Codex

### Context
The `../SOLID-Template` promotes strong boundaries, dependency inversion, and testability. This site is primarily a frontend product, so copying a full backend-style hexagonal architecture would add unnecessary ceremony. We still want the same discipline around separation of concerns.

### Decision
Adopt a lightweight layered frontend architecture:
- **Content Layer:** Typed resume, business, and project content definitions.
- **Application Layer:** Window manager, desktop interaction state, deep-link state, and view orchestration.
- **Presentation Layer:** Desktop, dock, icons, windows, and content renderers.
- **Adapter Layer:** Integrations such as analytics, asset loading, markdown/MDX rendering, and external link handling.

Dependencies should point inward:
- Presentation depends on application state and typed content contracts.
- Application depends on content interfaces, not on concrete UI components.
- Adapters sit at the edge and are replaceable.

### Rationale
This preserves the useful parts of the template:
- Single responsibility at the component and hook level.
- Dependency inversion between content contracts and concrete integrations.
- Testable stateful logic outside the UI.

It avoids the cost of inventing backend-style ports that do not meaningfully serve a mostly static marketing site.

### Consequences
**Positive:**
- Cleaner boundaries between UI chrome, interaction logic, and content.
- Easier testing of window behavior and content mapping.
- Keeps future integrations optional instead of coupled into components.

**Negative:**
- Requires discipline to prevent content and UI logic from drifting together.
- Some abstraction may feel heavier at the very beginning of the project.

**Neutral:**
- Directory structure should reinforce these boundaries from the start.

---

### ADR-003: Use Local Typed Content First, with a Replaceable Content Repository Later
**Date:** 2026-04-09
**Status:** Accepted
**Deciders:** Site Owner, Codex

### Context
This site’s content will likely evolve over time, but the initial version does not need a CMS. The project still needs a maintainable way to organize employment history, business ventures, projects, and contact information without baking those decisions directly into UI components.

### Decision
Start with version-controlled local content:
- Store structured content in TypeScript modules and optional MDX documents.
- Normalize shared entities such as roles, businesses, projects, links, and desktop items.
- Introduce a content repository interface so content can later come from a CMS, database, or API without rewriting the UI shell.

### Rationale
Local content is fastest to build, easiest to review, and ideal for a personal site with infrequent edits. A repository boundary keeps the project open to future growth if the site expands into a richer founder or product profile.

Alternatives considered:
1. Start with a headless CMS immediately.
2. Hardcode content inline inside React components.
3. Use only freeform markdown pages with no structured data.

### Consequences
**Positive:**
- Fast initial development.
- Content stays easy to diff and refactor.
- Future migration path remains open.

**Negative:**
- Non-technical content editing is less convenient at first.
- Structured data modeling must be designed intentionally.

**Neutral:**
- Content files become an important part of the public brand system, not just implementation detail.

---

### ADR-004: Build with Next.js App Router, React, TypeScript, and Utility-First Styling
**Date:** 2026-04-09
**Status:** Accepted
**Deciders:** Site Owner, Codex

### Context
We want a modern frontend stack that supports a polished interactive UI, strong typing, simple deployment, and the option to pre-render most of the site for performance and SEO.

### Decision
Use:
- **Next.js App Router** for the application shell and page composition.
- **React** for component-driven UI.
- **TypeScript** in strict mode for content and state contracts.
- **Utility-first styling** for rapid visual iteration and consistent tokens.

### Rationale
This matches the successful reference implementation patterns from `../mcpviews-website` while staying appropriate for a marketing site. It gives us strong typing, component reuse, and a clean path to responsive behavior and route-level metadata.

### Consequences
**Positive:**
- Familiar stack with strong ecosystem support.
- Easy deployment to modern hosting providers.
- Good fit for interactive client-side window management.

**Negative:**
- Requires attention to client/server boundaries.
- Styling can become inconsistent without documented tokens.

**Neutral:**
- Some of the desktop shell will be client-driven even if most content is static.

---

### ADR-005: Treat Accessibility, Deep Linking, and SEO as First-Class Requirements
**Date:** 2026-04-09
**Status:** Accepted
**Deciders:** Site Owner, Codex

### Context
The site’s desktop metaphor should support discoverability, but hiring and business audiences still need to scan content quickly, share specific sections, and consume the site with assistive technologies or reduced motion enabled.

### Decision
Build the immersive UI with guardrails:
- Every desktop action must have keyboard support.
- Important content should be reachable without drag interactions.
- Open windows should map to shareable route or query state where practical.
- Resume and project content should exist in crawlable HTML, not only in canvas-like chrome.
- Reduced-motion and contrast-safe variants should be supported.

### Rationale
A beautiful metaphor should not block comprehension. This decision protects the site from becoming impressive-but-fragile.

### Consequences
**Positive:**
- Better usability for recruiters and clients.
- Easier sharing of specific sections like Projects or Resume.
- Lower risk of accessibility and SEO regressions.

**Negative:**
- Adds implementation overhead to a visually rich interface.
- Requires duplicate thinking: visual metaphor plus semantic fallback.

**Neutral:**
- UX decisions should be evaluated against both delight and clarity.

---

## Superseded Decisions

<!-- Move deprecated or replaced decisions here. -->

---

## Decision Status Definitions

- **Proposed:** Under discussion.
- **Accepted:** Chosen and expected to guide implementation.
- **Deprecated:** No longer recommended but retained for history.
- **Superseded:** Replaced by a newer ADR.

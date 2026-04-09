# Frontend Architecture

This document translates the `../SOLID-Template` patterns into a frontend architecture for a desktop-style resume and portfolio site.

---

## Product Goal

The site should present the owner as:
- A strong hire for employment opportunities.
- A founder or operator with real businesses.
- A builder with credible shipped projects.

The UI should feel like a modern macOS-inspired desktop:
- Visitors click files, folders, and shortcuts.
- Windows open focused content instead of sending users into long scrolling sections.
- The experience feels polished and memorable, but the content stays easy to understand.

---

## Experience Model

### Desktop Breakpoint

On medium and larger screens, the home page acts like a workspace:
- Desktop icons represent primary content entry points.
- Windows can be opened, focused, moved, and closed.
- A dock can surface high-priority shortcuts such as Resume, Projects, Contact, and external links.
- The chrome should feel modern and clean rather than skeuomorphic or novelty-heavy.

Suggested initial desktop items:
- `Resume.pdf`
- `Experience`
- `Businesses`
- `Projects`
- `About Me`
- `Contact`
- `GitHub`
- `LinkedIn`

### Mobile Breakpoint

On smaller screens, do not force a miniature desktop metaphor.

Instead:
- Present the same content as a guided narrative or stacked card interface.
- Keep high-priority calls to action visible.
- Preserve the same content model so desktop and mobile use the same source of truth.

---

## Architecture Shape

The frontend should follow a lightweight layered model inspired by SOLID and ports/adapters principles.

### 1. Content Layer

Purpose:
- Own resume, company, project, and contact data.
- Define the desktop item registry that maps file icons to content windows.

Typical contents:
- `profile`
- `roles`
- `businesses`
- `projects`
- `contactMethods`
- `desktopItems`

Rules:
- No React components in this layer.
- No styling logic.
- Prefer typed data and pure transformers.

### 2. Application Layer

Purpose:
- Manage interactive state and view orchestration.

Responsibilities:
- Window manager reducer and actions.
- Desktop selection state.
- Dock state.
- Deep-link parsing and serialization.
- Analytics event shaping.

Rules:
- State logic should be testable without rendering the full UI.
- Hooks here can depend on content contracts, but not on concrete window visuals.

### 3. Presentation Layer

Purpose:
- Render the immersive UI.

Responsibilities:
- Desktop background and menu bar.
- Desktop icons and folders.
- Window chrome.
- Document views, profile views, project explorer views, and contact views.
- Mobile fallback layouts.

Rules:
- Keep components mostly declarative.
- Push non-trivial state transitions into hooks or reducers.

### 4. Adapter Layer

Purpose:
- Isolate edge integrations.

Examples:
- Markdown or MDX rendering.
- Analytics provider wiring.
- Image optimization helpers.
- External link launch helpers.
- Optional CMS adapter in the future.

---

## Proposed Directory Structure

```text
src/
  app/
    layout.tsx
    page.tsx
  components/
    desktop/
    dock/
    window/
    content/
    mobile/
  hooks/
    useWindowManager.ts
    useDesktopItems.ts
    useRouteState.ts
  content/
    profile.ts
    roles.ts
    businesses.ts
    projects.ts
    desktop-items.ts
  lib/
    content-repository.ts
    analytics.ts
    markdown.ts
  styles/
    tokens.css
  types/
    content.ts
    windows.ts
```

This mirrors the reference app’s desktop/window split, but removes the agent, flow engine, and tool-call concerns that are specific to `../mcpviews-website`.

---

## Core UI Modules

### Desktop Shell

Owns:
- Wallpaper or atmospheric background.
- Menu bar or top chrome.
- Desktop icon layout.
- Dock or quick-launch actions.

Should not own:
- Resume content itself.
- Ad hoc content formatting logic.

### Window Manager

Owns:
- Open/close/focus behavior.
- Z-index ordering.
- Default positions and sizes.
- Optional persistence for recently opened windows.

This is the most reusable behavior to lift from `../mcpviews-website`.

### Content Windows

Recommended initial window types:
- **Document window:** resume PDF-style or markdown-style content.
- **Explorer window:** businesses and projects with cards, filters, or folders.
- **Profile window:** summary, positioning statement, and CTA links.
- **Contact window:** email, social, calendaring, or business inquiry actions.

### Route State

Recommended behavior:
- Support direct links such as a resume window or projects window opening by default.
- Encode open window ids in query params or a compact route state model.
- Keep route syncing optional and resilient so the site still works without it.

---

## Content Modeling Guidance

The content model should separate entities from presentation.

Suggested entities:
- `Profile`
- `EmploymentRole`
- `Business`
- `Project`
- `ContactMethod`
- `DesktopItem`
- `WindowDefinition`

Suggested rule:
- Desktop items reference content by id.
- Window definitions describe how content is rendered.
- Content records remain presentation-agnostic.

This prevents the UI from becoming a pile of one-off hand-authored windows.

---

## Design Principles

### Visual Direction

The site should feel premium and intentional:
- Clean glassy windows.
- Strong typography.
- Layered backgrounds or subtle gradients.
- Motion that supports hierarchy, not novelty.

Avoid:
- Fake terminal-heavy aesthetics.
- Overly literal macOS cloning.
- Decorative complexity that competes with resume readability.

### Interaction Principles

- Opening a window should feel immediate and obvious.
- The default state should showcase the most important content quickly.
- Visitors should never need to drag windows around to understand who the owner is.
- Desktop exploration is a bonus layer over a clear professional narrative.

---

## Accessibility and SEO Requirements

- Desktop items must be reachable by keyboard.
- Window actions must expose accessible labels.
- Reduced-motion mode should tone down transitions.
- Important content must render as semantic HTML.
- Metadata, Open Graph, and structured resume/project content should be added as the site takes shape.
- Mobile and desktop should read from the same content source so accessibility fixes apply everywhere.

---

## Testing Strategy

Map the SOLID testing mindset onto frontend priorities:

- **Unit tests:** reducers, content transformers, route-state parsing.
- **Component tests:** desktop item rendering, window chrome behavior, keyboard interaction.
- **Integration tests:** open-content flows, dock shortcuts, mobile fallback rendering.
- **E2E tests:** critical recruiter journeys such as opening Resume, scanning Projects, and reaching Contact.

Test the application logic first:
- window ordering
- focus behavior
- deep linking
- desktop item to content mapping

---

## Initial Build Sequence

1. Define typed content entities and seed real resume data.
2. Build the window manager and desktop item registry.
3. Create the desktop shell and one polished document window.
4. Add Businesses, Projects, and Contact windows.
5. Add mobile fallback views.
6. Layer in route syncing, motion polish, and analytics.

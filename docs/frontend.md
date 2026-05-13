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
- Hovering or focusing a desktop item can reveal a quick-look preview before opening it.
- Windows open focused content instead of sending users into long scrolling sections.
- Optional media surfaces must stay opt-in, compact, and easy to dismiss.
- The experience feels polished and memorable, but the content stays easy to understand.

---

## Experience Model

### Desktop Breakpoint

On medium and larger screens, the home page acts like a workspace:
- Desktop icons represent primary content entry points.
- Desktop icons can expose non-interactive quick-look previews on hover and keyboard focus.
- Windows can be opened, focused, moved, and closed.
- A dynamic dock shows only open and minimized windows (no static shortcuts).
- Clicking a focused dock icon minimizes that window; clicking a minimized icon restores it.
- The iPod desktop app opens as a floating media surface instead of a standard browser-like window.
- Desktop game apps open in standard windows and mount their Phaser canvases only after the browser client loads them.
- The chrome should feel modern and clean rather than skeuomorphic or novelty-heavy.

Current desktop items (defined in `src/data/portfolio-content.ts`):
- `Resume` (document)
- `iPod` (media)
- `Gabey Bird` (game)
- `Snek` (game)

### Mobile Breakpoint

On smaller screens, do not force a miniature desktop metaphor.

Instead:
- Present the same content as a guided narrative or stacked card interface.
- Keep high-priority calls to action visible.
- Preserve the same content model so desktop and mobile use the same source of truth.

### Local Development Editing

While developing on localhost, `npm run dev` now starts a tiny local save sidecar in front of Next.js.

Current behavior:
- The sidecar listens on `127.0.0.1:4010`.
- The page receives `NEXT_PUBLIC_RESUME_SITE_EDITOR_URL` from the dev launcher.
- A localhost-only toolbar lets the author enable inline edit mode, click visible content text, and save the updated content back to disk.
- The editable source of truth lives in `src/data/portfolio-content-source.ts`.

Guardrails:
- This tool must never render outside localhost.
- Production deploys should continue to treat content as static typed data.
- The local save endpoint should remain tightly scoped to trusted localhost callers only.

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
- Quick-look preview cards and generated visual posters.
- Metric strips and content artwork inside windows.
- Optional floating media app surfaces.
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
    globals.css           # CSS tokens, animations, glass-panel, reduced-motion
    layout.tsx            # Root layout with Fraunces + Manrope fonts
    page.tsx              # Responsive entry: Desktop (md+) or MobileLanding
  components/
    content/
      PortfolioWindowContent.tsx   # Renders section data inside windows
      SectionMetricStrip.tsx       # Compact metric highlights for section heroes
      SectionPoster.tsx            # Image-backed or generated section artwork
      sectionVisualUtils.ts        # Pure color and generated-art helpers
    dev/
      ContentDevContext.tsx # Localhost-only draft state and save workflow
      ContentDevTool.tsx    # Floating toolbar for inline editing
      EditableText.tsx      # ContentEditable wrapper for visible text fields
    desktop/
      GabeyBirdApp.tsx     # Phaser arcade game window inspired by Flappy Bird
      IpodApp.tsx          # Floating iPod-style media app
      SnekApp.tsx          # Phaser snake game window with wrapping board movement
      Desktop.tsx          # Shell: wallpaper, menu bar, desktop files, windows, dock
      DesktopFiles.tsx     # Positioned desktop icons with glyph renderer registry
      DesktopQuickLook.tsx  # Non-interactive hover/focus previews for desktop items
      Dock.tsx             # Dynamic dock showing open/minimized windows (props-based)
      MenuBar.tsx          # Top menu bar chrome
      Wallpaper.tsx        # Animated atmospheric background
      WindowContainer.tsx  # Per-window wrapper with memoized dispatch callbacks
    mobile/
      MobileLanding.tsx   # Stacked card layout for small screens
    window/
      TrafficLights.tsx   # Close / minimize / fullscreen button row
      Window.tsx          # Draggable, resizable window with animations
  data/
    portfolio-content-source.ts # Editable site profile and portfolio section content
    portfolio-content.ts        # Derived exports, registries, and desktop item mapping
  hooks/
    useWindowAnimations.ts # Window open/close/minimize/restore/fullscreen animation state
    useWindowDrag.ts       # Pointer-based window dragging
    useWindowManager.ts    # useReducer-based window state manager
    useWindowResize.ts     # Pointer-based edge/corner resizing
  scripts/
    dev-with-inline-editor.mjs # Starts the localhost save sidecar and Next dev server
  styles/
    STYLE_GUIDE.md        # macOS fidelity design tokens reference
  types/
    index.ts              # WindowState, PortfolioSection, DesktopItem, ResizeDirection, action types
```

---

## Core UI Modules

### Desktop Shell

Owns:
- Wallpaper or atmospheric background.
- Menu bar or top chrome.
- Desktop icon layout.
- Desktop quick-look preview state and placement.
- Dock or quick-launch actions.
- Optional floating media surface mounting.

Should not own:
- Resume content itself.
- Ad hoc content formatting logic.
- Bundled third-party audio assets without tracked source and license terms.

### Media App Surface

Rules:
- Playback must be opt-in, with no autoplay.
- The media surface should open and close through the desktop icon like an app.
- If audio is bundled into `public/`, source and license metadata must be tracked before launch.
- Prefer externally hosted or user-provided media when redistribution rights are unclear.

### Game App Surfaces

Rules:
- Games must stay opt-in through desktop icons and should not autoplay or capture input before opening.
- Phaser should be loaded dynamically inside client-only game components to keep server rendering clean.
- Game windows should preserve the normal desktop lifecycle: focus, close, minimize, restore, resize, and fullscreen.
- Each game should have its own recognizable desktop icon instead of sharing a generic game tile.

### Quick-Look and Poster System

Rules:
- Quick-look previews are informational and should not trap pointer or keyboard focus.
- Generated posters should be pure functions of section content and visual metadata.
- Preview placement should stay clamped inside the visible desktop viewport.

### Window Manager

Owns:
- Open/close/focus/minimize behavior.
- Z-index ordering.
- Default positions and sizes.
- Fullscreen toggle with saved/restored previous position and size.
- Minimize animation toward dock icon and restore animation from it.

Implemented in `src/hooks/useWindowManager.ts` as a `useReducer` with these actions:
`OPEN_WINDOW`, `CLOSE_WINDOW`, `MINIMIZE_WINDOW`, `FOCUS_WINDOW`, `MOVE_WINDOW`, `RESIZE_WINDOW`, `TOGGLE_FULLSCREEN`.

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

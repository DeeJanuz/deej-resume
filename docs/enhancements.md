# Technical Debt & Enhancement Log

This document tracks follow-up work, refactoring ideas, and architecture risks discovered while building the site.

---

## Latest Session Summary

**Last Update:** 2026-04-09
**Last Reviewed Commit:** d5eb170 (initial commit)
**Commit Score:** 72/100 (Good)

**Total Active Issues:** 7
**Resolved This Month:** 2

---

## Open Items

### High

- **[SOLID-SRP] Window.tsx manages animation state, DOM measurement, and rendering** (src/components/window/Window.tsx)
  Window component holds five `useState`/`useRef` values for animation orchestration (isClosing, isMinimizing, isRestoring, isFullScreenTransitioning, skipOpenAnimation), plus the `computeDockOffset` DOM-measurement helper. This is a second responsibility beyond rendering the chrome. Extract a `useWindowAnimations` hook that owns these states and returns the current CSS class and transition style. Severity: High. Added: 2026-04-09 (d5eb170).

- **[SOLID-SRP] Desktop.tsx is the orchestrator AND the renderer** (src/components/desktop/Desktop.tsx)
  Desktop wires every dispatch callback inline, manages dock-minimize state, computes fullscreen dimensions from `globalThis.innerWidth`, and renders windows in a loop. Extracting a thin `useDesktopActions(dispatch)` hook for the callback factories would slim the component and make the logic testable without rendering. Severity: High. Added: 2026-04-09 (d5eb170).

- Decide whether the first public version should treat `Resume.pdf` as a rendered web document, an embedded PDF, or both.
- Finalize the desktop information architecture so each top-level file or folder maps to a single clear user intent.

### Medium

- **[SOLID-OCP] DesktopGlyph uses if/else on `item.kind` to pick icon shape** (src/components/desktop/DesktopFiles.tsx:18)
  Adding a new `DesktopItemKind` (e.g. "link", "image") requires modifying the `DesktopGlyph` function body. A glyph-component registry keyed by `kind` would let new kinds be added without touching existing rendering code. Severity: Medium. Added: 2026-04-09 (d5eb170).

- **[SOLID-DIP] Dock directly imports desktopItems data** (src/components/desktop/Dock.tsx:5)
  The Dock component imports `desktopItems` from the data layer to build `itemDataById` at module scope. This concrete dependency means the Dock cannot be reused or tested with different data. Pass the lookup data through props or context instead. Severity: Medium. Added: 2026-04-09 (d5eb170).

- **[React] Callbacks passed to Window children are recreated every render** (src/components/desktop/Desktop.tsx:83-126)
  Every inline arrow in the `orderedWindows.map` creates new function references on each render, defeating `React.memo` if Window were wrapped. Wrap these in `useCallback` or extract a `WindowContainer` component that receives `windowState` and `dispatch`. Severity: Medium. Added: 2026-04-09 (d5eb170).

- Choose the final content source format for launch: pure TypeScript objects, MDX-backed documents, or a hybrid.
- Define how shareable deep links should work when multiple windows are open.
### Low

- **[Type] `ResizeDirection` is duplicated** (src/components/window/Window.tsx:9, src/hooks/useWindowResize.ts:6)
  The same union type is defined in two files. Move it to `src/types/index.ts` for a single source of truth. Severity: Low. Added: 2026-04-09 (d5eb170).

- Capture analytics events for recruiter and client conversion paths.
- Consider adding `aria-live` region for window open/close announcements.
- Keyboard navigation for traffic lights and window focus cycling.

---

## Resolved Items

- **2026-04-09** — Dock is now dynamic: only shows open/minimized windows, not static shortcuts. (Was medium open item.)
- **2026-04-09** — Design token document added as `src/styles/STYLE_GUIDE.md`. (Was low open item.)

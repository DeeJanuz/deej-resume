# Technical Debt & Enhancement Log

This document tracks follow-up work, refactoring ideas, and architecture risks discovered while building the site.

---

## Latest Session Summary

**Last Update:** 2026-04-09
**Last Reviewed Commit:** 7e0cc7c (Resolve SOLID tech debt: extract hooks, components, and registries)
**Commit Score:** 82/100 (Good)

**Total Active Issues:** 4
**Resolved This Month:** 7

---

## Open Items

### High


- Decide whether the first public version should treat `Resume.pdf` as a rendered web document, an embedded PDF, or both.
- Finalize the desktop information architecture so each top-level file or folder maps to a single clear user intent.

### Medium

- **[DRY] `document`, `stack`, and `contact` glyph renderers are identical** (src/components/desktop/DesktopFiles.tsx:36-80)
  The `glyphRenderers` registry correctly solves the OCP violation, but three of the four entries (`document`, `stack`, `contact`) have byte-identical JSX. Extract a shared `DocumentGlyph` renderer and alias it for the three kinds, or use a `defaultRenderer` fallback with `folder` as the only override. Severity: Medium. Added: 2026-04-09 (7e0cc7c).

- Choose the final content source format for launch: pure TypeScript objects, MDX-backed documents, or a hybrid.
- Define how shareable deep links should work when multiple windows are open.
### Low


- Capture analytics events for recruiter and client conversion paths.
- Consider adding `aria-live` region for window open/close announcements.
- Keyboard navigation for traffic lights and window focus cycling.

---

## Resolved Items

- **2026-04-09** — Dock is now dynamic: only shows open/minimized windows, not static shortcuts. (Was medium open item.)
- **2026-04-09** — Design token document added as `src/styles/STYLE_GUIDE.md`. (Was low open item.)
- **2026-04-09** — Extracted `useWindowAnimations` hook from Window.tsx (was high SRP item).
- **2026-04-09** — Extracted `WindowContainer` component from Desktop.tsx with `useCallback` handlers (was high SRP + medium callback recreation items).
- **2026-04-09** — Replaced if/else branching in DesktopGlyph with `glyphRenderers` registry keyed by kind (was medium OCP item).
- **2026-04-09** — Dock now receives icon data via props instead of importing `desktopItems` directly (was medium DIP item).
- **2026-04-09** — Moved `ResizeDirection` type to `src/types/index.ts` as single source of truth (was low duplication item).

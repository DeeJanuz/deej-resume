# Test Suite Documentation

This index documents the testing strategy and, once tests exist, will map test files to implementation areas.

---

## Current Status

No automated tests exist yet. The sections below describe the first tests that should be added as implementation begins.

---

## Planned Unit Tests

- `useWindowManager` reducer behavior (`src/hooks/useWindowManager.ts`):
  - OPEN_WINDOW: new window, re-opening existing, restoring from minimized
  - CLOSE_WINDOW: marks window not open, clears focus
  - MINIMIZE_WINDOW: marks minimized, clears focus
  - FOCUS_WINDOW: sets focus and bumps z-index
  - MOVE_WINDOW: updates position
  - RESIZE_WINDOW: updates size and optional position
  - TOGGLE_FULLSCREEN: saves/restores pre-fullscreen position and size
  - z-index ordering across all actions
- `useWindowDrag` hook behavior (`src/hooks/useWindowDrag.ts`):
  - pointer-based drag updates position
  - does not fire on non-primary pointer buttons
- `useWindowResize` hook behavior (`src/hooks/useWindowResize.ts`):
  - edge and corner resize from all 8 directions
  - minimum size enforcement
- `useWindowAnimations` hook behavior (`src/hooks/useWindowAnimations.ts`):
  - animation state transitions: open, close, minimize, restore, fullscreen
  - CSS class and inline style derivation from animation state
  - dock offset computation for minimize/restore target
- Route-state parsing and serialization (not yet implemented):
  - default open windows
  - invalid query handling
  - shareable deep-link state
- Content transformers:
  - desktop item to window definition mapping (`Desktop.createWindowPayload`)
  - portfolio section lookup by id
- `ContentDevContext` draft workflow (`src/components/dev/ContentDevContext.tsx`):
  - service health detection for localhost inline save
  - fallback file-handle reconnect path when the save service is absent
  - updateText path writes for nested content fields
  - save/reset state transitions (`isDirty`, `lastSavedAt`, status text)

---

## Planned Component Tests

- Desktop icon rendering, glyph registry dispatch, and keyboard activation (`DesktopFiles`)
- Window chrome: traffic light close, minimize, and fullscreen buttons (`TrafficLights`, `Window`)
- Window animations: open, close, minimize-to-dock, restore-from-dock (`Window`, `useWindowAnimations`)
- WindowContainer: memoized callback props, correct dispatch forwarding (`WindowContainer`)
- Dock: dynamic rendering of open/minimized windows, click-to-minimize/restore/focus (`Dock`)
- Mobile fallback rendering for the same content source (`MobileLanding`)
- Resume window rendering for the primary hire-me flow (`PortfolioWindowContent`)
- Inline editing affordances (`EditableText`, `ContentDevTool`):
  - edit mode only activates on localhost
  - blur commits edited text into draft state
  - toolbar buttons reflect save-service availability and dirty state

---

## Planned Integration Tests

- Clicking a desktop file opens the correct content window
- Dock icon click: minimize focused window, restore minimized window, focus unfocused window
- Minimize animation targets dock icon position; restore animation originates from dock icon
- Fullscreen toggle saves and restores previous window position and size
- Resume window auto-opens on initial desktop mount (320ms delay)
- Query-state hydration opens expected windows on page load (not yet implemented)
- External contact actions route users to the correct destination
- Localhost inline save round-trip updates `src/data/portfolio-content-source.ts` and survives a dev-server restart

---

## Planned E2E Tests

- A recruiter can open the resume and reach contact details
- A client can inspect businesses and projects from the desktop
- A mobile visitor can understand the owner’s story without the desktop shell
- A localhost author can enable edit mode, change visible text, save it, reload, and see the content persist

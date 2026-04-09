# Test Suite Documentation

This index documents the testing strategy and, once tests exist, will map test files to implementation areas.

---

## Current Status

No automated tests exist yet. The sections below describe the first tests that should be added as implementation begins.

---

## Planned Unit Tests

- `useWindowManager` reducer behavior:
  - open, close, focus, move, resize
  - z-index ordering
  - re-opening an existing window
- Route-state parsing and serialization:
  - default open windows
  - invalid query handling
  - shareable deep-link state
- Content transformers:
  - desktop item to window definition mapping
  - project and business grouping helpers

---

## Planned Component Tests

- Desktop icon rendering and keyboard activation
- Window chrome actions and focus changes
- Mobile fallback rendering for the same content source
- Resume window rendering for the primary hire-me flow

---

## Planned Integration Tests

- Clicking a desktop file opens the correct content window
- Dock shortcuts focus or open the right view
- Query-state hydration opens expected windows on page load
- External contact actions route users to the correct destination

---

## Planned E2E Tests

- A recruiter can open the resume and reach contact details
- A client can inspect businesses and projects from the desktop
- A mobile visitor can understand the owner’s story without the desktop shell

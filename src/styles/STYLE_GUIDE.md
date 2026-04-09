# macOS Fidelity Design System

OS chrome is neutral and system-font. Brand personality lives only inside window content areas.

---

## OS Chrome Tokens

| Token | Value |
|-------|-------|
| background | `#f0f0f0` |
| foreground | `#1d1d1f` |
| font-chrome | `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif` |
| selection | `rgba(0, 122, 255, 0.2)` |
| glass-panel bg | `rgba(255, 255, 255, 0.72)` |
| glass-panel border | `1px solid rgba(255, 255, 255, 0.4)` |
| glass-panel blur | `blur(22px)` |
| glass-panel shadow | `0 16px 40px rgba(0, 0, 0, 0.15)` |

## Window Chrome

| Property | Value |
|----------|-------|
| border-radius | `10px` |
| title bar | neutral gradient: `rgba(246,246,246,0.95)` to `rgba(236,236,236,0.95)` |
| title bar height | `44px` (h-11) |
| title font | system-ui, 13px, font-medium, text-neutral-500 |
| title bar border | `1px solid rgba(0, 0, 0, 0.12)` |
| window bg | `rgba(246, 246, 246, 0.97)` with backdrop-blur-2xl |
| shadow | `0 22px 70px rgba(0, 0, 0, 0.18)` |
| border | `1px solid rgba(0, 0, 0, 0.1)` |
| unfocused filter | `brightness(0.97)` |

## Traffic Lights

| Property | Value |
|----------|-------|
| dot size | `12px` (h-3 w-3) |
| gap | `6px` |
| close | `#ff5f57` |
| minimize | `#febc2e` |
| maximize | `#28c840` |
| inner shadow | `inset 0 1px 0 rgba(255, 255, 255, 0.3)` |
| hover | `scale(1.1)` |

## Dock

| Property | Value |
|----------|-------|
| container | glass-panel, rounded-2xl, px-3 py-1.5 |
| icon size | `48px` (h-12 w-12) |
| icon radius | `12px` |
| icon border | `1px solid rgba(255, 255, 255, 0.55)` |
| icon shadow | `0 14px 24px rgba(0, 0, 0, 0.16)` |
| icon gradient | `linear-gradient(180deg, lightenedAccent 0%, accent 100%)` |
| open indicator | 4px neutral-700 dot below icon |
| minimized style | opacity 0.5, brightness(0.85) filter, no dot |
| hover lift | `translateY(-4px) scale(1.08)` |
| tooltip | 10px semibold white on rgba(0,0,0,0.75), rounded-full |
| content rule | only open or minimized windows appear; empty dock renders nothing |

## Desktop Icons

| Property | Value |
|----------|-------|
| width | `w-20` (80px) |
| icon container | rounded-lg with accent gradient |
| label | text-shadow for readability over wallpaper |
| open state | ring indicator |

## Content Area (Inside Windows)

| Property | Value |
|----------|-------|
| heading font | Fraunces (display serif) |
| body font | Manrope (sans-serif) |
| card style | rounded-xl with section accent |
| accent colors | per-section, defined in portfolio-content data |

### Section Accent Palette

| Section | Accent |
|---------|--------|
| Resume | `#2f6b73` |
| Experience | `#3f5f48` |
| Projects | `#2d5f93` |
| Skills | `#8b6b2f` |
| About Me | `#9d6335` |
| Businesses | `#7b4b45` |
| Contact | `#4b5563` |

## Animations

| Animation | Duration | Easing |
|-----------|----------|--------|
| window-open | 200ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| window-close | 150ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| window-minimize | 300ms | `cubic-bezier(0.4, 0, 1, 1)` |
| dock hover | 200ms | default transition |
| reduced-motion | all animations collapse to 0.01ms |

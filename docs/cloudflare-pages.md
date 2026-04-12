# Cloudflare Pages Deployment

This site is already configured for static export through `output: "export"` in `next.config.ts`, which makes it a good fit for a Cloudflare Pages static deployment.

## What is already compatible

- The production build emits static assets into `out/`.
- A top-level `404.html` is generated automatically by Next.js during export.
- Image optimization is disabled in Next.js, which keeps the export compatible with a static host.

## Repository guardrails added for Pages

- `.node-version` pins Node.js `22.16.0` so Cloudflare Pages does not silently drift when build-image defaults change.
- `public/_headers` adds a couple of safe browser security headers and long-lived caching only for immutable hashed Next assets under `/_next/static/*`.

## Cloudflare Pages dashboard settings

For Git-based deployments, use these settings:

- Framework preset: `Next.js (Static HTML Export)`
- Production branch: your production branch, typically `main`
- Build command: `npx next build`
- Build output directory: `out`

## Direct upload or CLI deploy

If you want to create a deployment from local build output instead of Git integration:

```bash
npm run build
npx wrangler pages deploy out
```

## Verification checklist

Before the first deployment, confirm:

- `npm run build` succeeds locally.
- `out/index.html` exists.
- `out/404.html` exists.
- `out/_headers` exists after the build.

## Important limitation

Cloudflare currently recommends Workers for full Next.js features. This project is safe on Pages because it is a static export. If we later add server actions, SSR, route handlers, dynamic rendering, or other server-only Next.js features, we should move the deployment target to Cloudflare Workers instead of continuing with Pages static hosting.

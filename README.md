# sstm117

Personal site of Simon Sainte Mareville — an interactive portfolio for projects, experiments, and the systems thinking behind them.

Production origin: [sstm117.com](https://sstm117.com)

## Public surface

- `/` — INDEX and interactive FIELD
- `/work` — selected projects and production systems
- `/lab` — experiments and exploratory work
- `/notes` — technical notes
- `/frame` — current positions across recurring engineering tensions
- `/about` — professional path, systems thinking, software, and AI

The site is intentionally static and ships no client-side JavaScript. Its accepted visual system and FIELD semantics are treated as frozen product contracts.

## Stack

- Astro 7 and TypeScript
- Archivo Variable and Sometype Mono Variable via Fontsource
- `@astrojs/sitemap`
- Cloudflare Workers Static Assets
- Wrangler

## Local development

```bash
npm ci
npm run dev
```

Validation:

```bash
npm run check
npm run build
```

To exercise the built site through the local Cloudflare runtime:

```bash
npm run build
npx wrangler dev
```

## Production

The canonical origin is `https://sstm117.com`.

Production hosting is configured for Cloudflare Workers Static Assets. `wrangler.jsonc` defines the static asset and custom-domain contract, while `public/_headers` defines the production security headers, CSP, and cache policy.

Automated production deployment is intended to run from the canonical repository through Cloudflare Workers Builds.

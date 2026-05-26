# Emil — Portfolio (Payload CMS)

Personal portfolio and blog powered by [Payload CMS](https://payloadcms.com), Next.js, and MongoDB.

## Stack

- **CMS:** Payload 3 + MongoDB
- **Frontend:** Next.js (Chiri design)
- **Media:** Cloudflare R2 (optional; falls back to local `public/media`)

## Development

```bash
# Start MongoDB (Docker)
docker compose up -d

# Copy env and configure
cp .env.example .env

# Install & run (requires pnpm 9+)
pnpm install
pnpm dev
```

Admin panel: http://localhost:3000/admin

## Seed content

Populates posts, experiences, about section, and homepage from `seed-data/`:

```bash
pnpm seed -- --fresh
```

## Environment variables

See [.env.example](.env.example) for `DATABASE_URL`, `PAYLOAD_SECRET`, R2 credentials, and seed admin credentials.

## Deploy

Configured for Netlify with `@netlify/plugin-nextjs`.

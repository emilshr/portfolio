# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

## Payload conventions

### Public Local API reads

All server-side reads for the public frontend must use `PUBLIC_PAYLOAD_QUERY` from `apps/portfolio/src/utilities/payloadPublicQuery.ts`:

```ts
{ overrideAccess: false, draft: false }
```

Use `getPublicPayload()` instead of calling `getPayload()` directly in public paths.

### Access control helpers

Located in `apps/portfolio/src/access/`:

| Helper | Use when |
|--------|----------|
| `authenticated` | Any logged-in user |
| `authenticatedOrPublished` | Public read of published content; full access when logged in |
| `adminOnly` | Admin-only operations (users CRUD, jobs) |
| `adminOrSelf` | User can access own record; admins access all |
| `anyone` | Intentionally public read (globals, media) |

User `roles` use `saveToJWT: true` — prefer `isAdmin()` from `access/isAdmin.ts` in hooks and config.

### Hook safety

- Pass `req` to nested `req.payload.create/update/delete` calls so transactions stay atomic.
- Use `context.disableRevalidate: true` in seeds and migrations to skip Next.js cache busting.
- Use `context.skipHooks: true` when a hook updates the same document to prevent infinite loops.

### Cache tags

| Tag pattern | Invalidated when |
|-------------|------------------|
| `global_{slug}` | Matching global `afterChange` hook |
| `global_site-settings` | Site settings change |
| `{collection}_{slug}` | Document publish/unpublish/delete |
| `{collection}_id_{id}` | Redirect resolution by ID |
| `redirects` | Redirect plugin changes |
| `pages-sitemap` / `posts-sitemap` | Page/post publish |

Use `revalidateDocumentCacheTags()` from `utilities/revalidateDocumentCache.ts` in collection hooks.

### Production security

- `admin.autoLogin` is development-only.
- `/next/seed` returns 404 in production; dev requires admin role.
- GraphQL is disabled — use REST/Local API only.
- `validateProductionEnv()` runs on Vercel production deploys.

## PR checklist (Payload changes)

- [ ] New Local API calls use `overrideAccess: false` for public paths
- [ ] New collections define access on all operations
- [ ] New hooks pass `req` to nested payload operations
- [ ] Cache tags added and invalidated for new cached queries
- [ ] `pnpm generate:types` run if schema changed
- [ ] Accessibility: alt text, keyboard access, single `<main>` landmark

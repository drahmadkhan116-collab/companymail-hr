# companymail-hr

AI-assisted HR platform. **Next.js 16** (App Router) · **React 19** · **TypeScript** ·
**Prisma 7** / Postgres · **NextAuth 4** · **Tailwind 4** · **Playwright** for E2E.

---

## Current state — read before building

- **No pages exist yet.** `app/page.tsx` redirects to `/dashboard`, and
  `app/dashboard/` does not exist, so the root returns Next's 404. Building
  `app/dashboard/page.tsx` is what unblocks the app.
- **`app/components/index.ts` is broken.** It re-exports `./Sidebar`, `./Header`,
  `./Card`, but only `Button.tsx` exists. `npx tsc --noEmit` fails with 3 errors.
  Anything importing from `@/app/components` will not build. Fix this before
  adding components.
- **`.env` is committed to this public repo.** Rotate `NEXTAUTH_SECRET`, then
  `git rm --cached .env`. Never re-add it. Do not print its values.
- Tests: `npm run test:e2e` (`:ui` to debug, `:report` for the HTML report).
  Two specs are `test.fixme` because of the missing dashboard route — remove the
  `fixme` when the route lands, do not delete the specs.
- `@playwright/test` is pinned to `1.63.0`. To move: `npm i -D @playwright/test@latest
  && npx playwright install`.

## Conventions

- Server Components by default; add `'use client'` only when the component needs
  state, effects or browser APIs.
- Keep DB access in server code. Never import `@prisma/client` into a Client Component.
- Tailwind utility classes over custom CSS. Compose variants with `class-variance-authority`
  (already a dependency), matching `app/components/Button.tsx`.
- Every new route gets at least one Playwright spec in `e2e/`.
- Never commit secrets, `.env`, `data/`, or build output.

---

## Skill routing

This environment has a very large number of installed skills, and many families
overlap — several complete SEO sets, two LinkedIn sets, two job-hunt systems,
multiple memory and video stacks, and ~800 security-operations skills. When more
than one could match, descriptions compete and the wrong one gets picked.

**Precedence, in order:**

1. A skill the user names explicitly wins, always.
2. Skills in this repo's `.claude/skills/` win over identically-named ones from
   other namespaces (for example prefer `li-post` here over `anthropic-skills:li-post`).
3. Prefer the narrowest skill that fits the task over a broad suite.
4. Prefer the canonical source for a tool (for example `remotion-dev-skills:*`
   for Remotion) over third-party wrappers of it.

**Pick one per task. Ignore the alternates unless asked.**

| Task | Use | Not |
|---|---|---|
| Review code / a PR in this repo | `code-reviewer` | `engineering:code-review`, `superpowers-requesting-code-review`, `ecc-*-review` |
| Security review of *this* app | `secure-code-guardian`, then `security-reviewer` | the `datacraft-security-*` sets — those are SOC, pentest and forensics playbooks, not app code review |
| Next.js routing, rendering, server actions | `nextjs-developer` | `ecc-nextjs-turbopack`, `react-expert` |
| React components, hooks, state | `react-expert` | `ecc-react-patterns`, `vue-*`, `angular-*` |
| Types, generics, strictness | `typescript-pro` | `ecc-typescript-patterns` |
| Prisma schema, queries, migrations | `postgres-pro`, `database-optimizer` | `ecc-prisma-patterns`, `ecc-postgres-patterns` |
| Writing or fixing E2E tests | `playwright-expert` | `microsoft-playwright-cli-completion:playwright-cli`, `ecc-e2e-testing` |
| What to test / coverage strategy | `test-master` | `engineering:testing-strategy` |
| Debugging a failure | `debugging-wizard` | `superpowers-systematic-debugging`, `engineering:debug` |
| Auth, sessions, NextAuth | `secure-code-guardian` | the IAM/SSO `datacraft-security-*` skills |
| Accessibility | `design:accessibility-review` | `vectorlab-ux-skills:*`, `ecc-frontend-a11y` |
| UI/visual polish | `frontend-design:frontend-design` | `vectorlab-ux-skills:ux-audit`, `ecc-make-interfaces-feel-better` |
| Diagrams | `artifact-diagramming` | `cathrynlavery-diagram-design:diagram-design`, `figma:figma-generate-diagram` |
| Cold email, outbound sequences | `cold-email-copy` | `marketing:draft-content`, `marketing:email-sequence` |
| Objections, qualifying, closing | `objection-handling`, `lead-qualification`, `offer-strategy` | — |
| LinkedIn posts, DMs, comments | this repo's `li-*` | `anthropic-skills:li-*` (duplicates) |
| SEO | `searchfit-seo:*` | `every-app-open-seo:*`, `brightdata-plugin:seo-audit`, `ecc-seo`, `beyondseo` |
| Remotion / motion work | `remotion-dev-skills:*` | `iart-ai-motion-design-skills:remotion-video`, `ecc-remotion-video-creation`, `remotion-to-hyperframes` |
| Research papers, literature | `Elicit` / `Consensus` / `PubMed` connectors, then `slr-prisma` | the `science-*` duplicates across namespaces |

For anything not in this table, apply the precedence rules above rather than
loading several overlapping skills at once.

### Pruning

Routing rules reduce bad picks; they do not shrink the candidate pool. Reliable
automatic selection needs fewer, more distinct skills. Strong candidates to
uninstall: the duplicated `anthropic-skills:*` entries that shadow dedicated
plugins (`li-*`, `ecc-*`, `science-*`, `replica-*`, `caveman*`), two of the three
SEO sets, one of the two job-hunt systems, and the `datacraft-security-*` sets
unless security operations is actual day-to-day work here.

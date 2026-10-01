# Admin-Editable Portfolio (Projects & Experience) — Design

## Problem

Projects and experience entries currently live as hardcoded arrays inside
`app/page.tsx` (`allProjects`, `experience`) and are duplicated in
`app/(pages)/projects/page.tsx`. Every new project or job requires a direct
code edit and redeploy (visible in git history: "add new project cyber
bullying detection", "add new experience", etc.). The owner wants a
password-protected `/admin` area to add, edit, and delete projects and
experience entries — including image uploads — without touching code.

## Constraints

- The site deploys to Vercel. Vercel's serverless functions have a
  read-only/ephemeral filesystem, so data can't be persisted by writing to a
  local JSON file — a real database is required.
- Single owner/editor only; no multi-user permission system needed.
- Minimize new services/accounts: reuse Supabase, which the owner already
  uses on several other freelance projects.

## Chosen Approach

**Thin API layer + client-side fetch** (see Alternatives Considered). Supabase
(Postgres + Storage) holds the data and images. Next.js API routes are the
only thing that talk to Supabase (using the service-role key, server-side
only). The existing client-rendered `page.tsx` and `(pages)/projects/page.tsx`
fetch from these API routes instead of reading hardcoded arrays. `/admin` is a
password-gated set of pages for CRUD on both tables.

## Data Model (Supabase / Postgres)

### `projects`

| column | type | nullable | notes |
|---|---|---|---|
| `id` | `text` (PK) | no | slug, e.g. `"wingsagrivet"` |
| `title` | `text` | no | |
| `category` | `text[]` | yes | subset of `mobile`, `web`, `automations`, `games` |
| `description` | `text` | yes | |
| `images` | `text[]` | yes | URLs; mix of existing `/imagesv2/...` paths and new Supabase Storage URLs |
| `technology` | `text[]` | yes | |
| `github` | `text` | yes | |
| `demo` | `text` | yes | |
| `video` | `text` | yes | |
| `sort_order` | `int` | no, default `0` | plain numeric field in the admin form (no drag-and-drop) |
| `created_at` | `timestamptz` | no, default `now()` | |

### `experience`

| column | type | nullable | notes |
|---|---|---|---|
| `id` | `uuid` (PK) | no, default `gen_random_uuid()` | |
| `logo` | `text` | yes | image URL |
| `name` | `text` | no | |
| `additional` | `text` | yes | subtitle/role |
| `type` | `text` | yes | one of `Full-time`, `Part-time`, `Internship`, `Contract` — enforced by a `CHECK` constraint; dropdown in the form |
| `year` | `text` | yes | free text, e.g. `"Mar 2025 – Aug 2025"` (ranges are too irregular for real date columns) |
| `duration` | `text` | yes | free text, e.g. `"6 months"` |
| `sort_order` | `int` | no, default `0` | |
| `created_at` | `timestamptz` | no, default `now()` | |

Row Level Security is enabled on both tables with a single policy: public
`SELECT`, no public `INSERT`/`UPDATE`/`DELETE` (those only happen server-side
via the service-role key, which bypasses RLS entirely).

### Storage

A public-read bucket `project-images` holds images uploaded via `/admin`.
Existing images under `public/imagesv2/...` are **not** migrated into this
bucket — their current paths are kept as-is in the `images`/`logo` columns.

## Auth

- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` — server-only env vars (already
  set in `.env.local`, not committed).
- `app/admin/login/page.tsx` — password form, POSTs to
  `app/api/admin/login/route.ts`.
- On a correct password, the login route sets an `httpOnly`, `secure`,
  `sameSite=lax` cookie whose value is `ADMIN_SESSION_SECRET`.
- `middleware.ts` checks that cookie on every `/admin/*` route (except
  `/admin/login`) and every `/api/admin/*` route; redirects to
  `/admin/login` (pages) or returns `401` (API) if missing/wrong.
- A "Log out" action clears the cookie.

## API Routes

**Public (read-only, no auth):**
- `GET /api/projects` — all rows from `projects`, ordered by `sort_order`
- `GET /api/experience` — all rows from `experience`, ordered by `sort_order`

**Admin-only (cookie required):**
- `POST /api/admin/projects`
- `PUT /api/admin/projects/[id]`
- `DELETE /api/admin/projects/[id]`
- `POST /api/admin/experience`
- `PUT /api/admin/experience/[id]`
- `DELETE /api/admin/experience/[id]`
- `POST /api/admin/upload` — accepts one or more image files (multipart),
  uploads each to the `project-images` bucket via the service-role client,
  returns their public URLs

## Admin UI Pages

- `/admin/login` — password form
- `/admin` — dashboard with two tabs, "Projects" and "Experience", each a
  table listing entries with Edit / Delete buttons and an "Add New" button
- `/admin/projects/new`, `/admin/projects/[id]/edit` — form: title, category
  checkboxes, description textarea, multi-image upload (select/drag multiple
  files, reorder, remove before saving), technology (tag input), github/
  demo/video URL fields, sort order. Only `title` is required.
- `/admin/experience/new`, `/admin/experience/[id]/edit` — form: name,
  additional, type dropdown, year, duration, logo upload, sort order. Only
  `name` is required.
- Delete actions require an inline confirm step (destructive).

## Image Upload Flow

1. Admin form collects file(s) via `<input type="file" multiple>` or drag/drop.
2. On save, files are sent as `multipart/form-data` to `/api/admin/upload`.
3. The route (server-side, using the service-role Supabase client) uploads
   each file to the `project-images` bucket and returns their public URLs.
4. Those URLs are included in the `images` array (or `logo` field) sent to
   the create/update endpoint.
5. `next.config.ts` adds a `remotePatterns` entry for
   `https://cyjubfcghvlmxnhmyeqm.supabase.co` so `next/image` can serve
   Storage URLs.

## Migration

A one-off script, `scripts/migrate-to-supabase.mjs`, run manually once:
- Reads the current `allProjects` and `experience` literals (copied into the
  script, not parsed from `page.tsx`, to avoid a fragile AST-parsing step).
- Inserts them into the new Supabase tables via the service-role client,
  preserving existing `/imagesv2/...` image paths unchanged and assigning
  `sort_order` based on current array order.
- Is idempotent-guarded (checks for existing `id`s before inserting) so it
  can be safely re-run if it fails partway.

## Public-Facing Changes

- `app/page.tsx`: the hardcoded `allProjects` and `experience` consts are
  removed. A `useEffect` fetches both from `/api/projects` and
  `/api/experience` on mount into component state. The existing `isMounted`
  gate (which currently shows `PageSkeleton` until the component mounts) is
  extended to also wait for this fetch to resolve before rendering real
  content.
- `app/(pages)/projects/page.tsx`: same fetch-on-mount pattern, replacing its
  hardcoded `p0`–`p6` arrays, rendering the existing `Project` component in a
  loop over the fetched data.

## Error Handling

- If `GET /api/projects` or `/api/experience` fails (Supabase unreachable,
  network error), the public pages render after a failed fetch with an
  inline "Couldn't load projects right now" message instead of crashing or
  hanging on the skeleton forever.
- Admin create/update forms validate required fields client-side before
  submit and surface server-side errors (e.g. duplicate `id`, Supabase error)
  as an inline message rather than a silent failure.
- Delete requires an explicit confirm step before the API call fires.
- `/api/admin/*` routes return `401` for any request missing/failing the
  session cookie check, independent of the UI (so the API can't be driven
  directly without auth even if the middleware were somehow bypassed).

## What's Needed From the Owner

- Supabase project already created and credentials provided (saved to
  `.env.local`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, plus `ADMIN_PASSWORD` and
  `ADMIN_SESSION_SECRET`).
- Running the table/bucket-creation SQL in the Supabase SQL Editor (the
  anon/service-role keys can perform data operations via the REST API but
  cannot run DDL such as `CREATE TABLE`; that requires either the Supabase
  SQL Editor or a database connection string, which hasn't been shared).
- Running `scripts/migrate-to-supabase.mjs` once, after the tables exist.
- When deploying to Vercel: adding all five env vars to the Vercel project
  settings (they only exist in local `.env.local` today).

## Alternatives Considered

- **Server Components + ISR**: better SEO/first-paint, but requires
  splitting the single ~3,600-line client component into server+client
  pieces — a much larger refactor for a page whose content isn't
  SEO-sensitive (single-page animated portfolio, not a blog). Deferred
  unless SEO/perf becomes an actual complaint.
- **Headless CMS** (Sanity/Contentful, etc.): would provide a polished admin
  UI for free, but adds a new third-party account/service and less control
  for only two content types. Doesn't match the explicit ask for an owned
  `/admin` page.

## Out of Scope

- Reordering via drag-and-drop (using a plain `sort_order` number field
  instead).
- Multi-user accounts/roles (single static password only).
- Re-uploading existing `public/imagesv2/...` images into Supabase Storage.
- Editing any other site content (skills, certifications, contact info,
  about-me text) — scoped strictly to projects and experience per the
  original request.

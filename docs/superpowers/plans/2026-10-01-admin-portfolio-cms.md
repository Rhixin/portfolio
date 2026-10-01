# Admin-Editable Portfolio (Projects & Experience) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded `allProjects`/`experience` arrays in `app/page.tsx` with Supabase-backed data, editable through a password-protected `/admin` area (add/edit/delete projects and experience entries, with multi-image upload).

**Architecture:** Next.js API routes are the only thing that talk to Supabase (via the service-role key, server-only). A single random-secret cookie gates `/admin/*` pages and `/api/admin/*` routes via `middleware.ts`. The existing client-rendered `app/page.tsx` and `app/(pages)/projects/page.tsx` fetch from the new public `GET /api/projects` / `GET /api/experience` routes instead of reading literal arrays.

**Tech Stack:** Next.js 15.2.8 (App Router), React 19, TypeScript (strict), Tailwind v4, `@supabase/supabase-js`, Vitest (new — for pure-logic unit tests only).

## Global Constraints

- Next.js 15 dynamic route `params` are `Promise`s: `await params` in server route handlers, `const { id } = use(params)` in client page components.
- `@/*` path alias maps to the repo root (`tsconfig.json`), e.g. `@/lib/validation`.
- `middleware.ts` runs on the Edge runtime — only use `process.env` and plain string/cookie APIs there, no Node-only modules.
- Route handlers (`app/api/**/route.ts`) run in the Node runtime by default — `crypto.randomUUID()` and `Buffer` are available.
- All Supabase writes happen server-side only, via `SUPABASE_SERVICE_ROLE_KEY` (never exposed to the client). RLS on `projects`/`experience` only allows public `SELECT`.
- Credentials already live in `.env.local` (gitignored): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `DATABASE_URL`, `DIRECT_URL`.
- No existing test framework in this repo. Vitest is introduced scoped to pure-logic modules only (`lib/validation.ts`, `lib/adminAuth.ts`). Everything else (API routes, pages, forms) is verified manually via `npm run dev` + `curl` / browser, per each task's verification step.
- Dark theme UI convention already used site-wide: background `#0a0a0f`, accent `#FF6B35`, translucent white borders (`border-white/10`, `bg-white/5`). Match this loosely in admin UI — exact pixel parity not required.
- Use `npm` (there's a committed `package-lock.json`; no yarn/pnpm).
- `node_modules` is not installed yet — Task 1 runs the first `npm install`.

---

## File Structure

**New library/shared code:**
- `lib/types.ts` — `ProjectRecord`, `ExperienceRecord` types
- `lib/validation.ts` — `sanitizeProjectInput`, `sanitizeExperienceInput` (pure, unit-tested)
- `lib/validation.test.ts`
- `lib/adminAuth.ts` — password/cookie check helpers (pure, unit-tested)
- `lib/adminAuth.test.ts`
- `lib/supabaseAdmin.ts` — service-role Supabase client factory

**Routing/middleware:**
- `middleware.ts` (repo root)

**Public API:**
- `app/api/projects/route.ts` — `GET`
- `app/api/experience/route.ts` — `GET`

**Admin API:**
- `app/api/admin/login/route.ts` — `POST`
- `app/api/admin/logout/route.ts` — `POST`
- `app/api/admin/projects/route.ts` — `POST`
- `app/api/admin/projects/[id]/route.ts` — `PUT`, `DELETE`
- `app/api/admin/experience/route.ts` — `POST`
- `app/api/admin/experience/[id]/route.ts` — `PUT`, `DELETE`
- `app/api/admin/upload/route.ts` — `POST`

**Admin UI:**
- `app/admin/login/page.tsx`
- `app/admin/(dashboard)/layout.tsx`
- `app/admin/(dashboard)/page.tsx` — dashboard (list + delete)
- `app/admin/(dashboard)/projects/new/page.tsx`
- `app/admin/(dashboard)/projects/[id]/edit/page.tsx`
- `app/admin/(dashboard)/experience/new/page.tsx`
- `app/admin/(dashboard)/experience/[id]/edit/page.tsx`
- `components/admin/AdminHeader.tsx`
- `components/admin/ImageUploader.tsx`
- `components/admin/ProjectForm.tsx`
- `components/admin/ExperienceForm.tsx`

**Migration & config:**
- `scripts/migrate-to-supabase.mjs`
- `next.config.ts` (modified — `images.remotePatterns`)
- `package.json` (modified — new deps + `test` script)
- `vitest.config.ts`

**Public pages switched to fetch-based data:**
- `app/page.tsx` (modified — remove `allProjects`/`experience`/`projectsData`, fetch instead)
- `app/(pages)/projects/page.tsx` (modified — fetch instead of hardcoded `p0`–`p6`)

---

### Task 1: Install dependencies & set up Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: a working `npm test` command for later tasks' unit tests.

- [ ] **Step 1: Install the new runtime dependency**

Run: `npm install @supabase/supabase-js`

Expected: `package.json` gains `@supabase/supabase-js` under `"dependencies"`, and since `node_modules` doesn't exist yet, this also installs every other dependency already listed in `package.json`. This may take a few minutes.

- [ ] **Step 2: Install Vitest as a dev dependency**

Run: `npm install --save-dev vitest`

Expected: `package.json` gains `vitest` under `"devDependencies"`.

- [ ] **Step 3: Add the test script**

Edit `package.json`'s `"scripts"` block to add a `test` entry:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
```

- [ ] **Step 4: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 5: Verify the test command runs (with zero tests so far)**

Run: `npm test`
Expected: Vitest starts, reports `No test files found` (or similar) and exits — this confirms the toolchain works before any real tests are added in Task 2.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "Add @supabase/supabase-js and vitest for the admin CMS feature"
```

---

### Task 2: Shared types & input validation (TDD)

**Files:**
- Create: `lib/types.ts`
- Create: `lib/validation.ts`
- Create: `lib/validation.test.ts`

**Interfaces:**
- Produces:
  - `ProjectRecord` type: `{ id: string; title: string; category: string[]; description: string | null; images: string[]; technology: string[]; github: string | null; demo: string | null; video: string | null; sort_order: number; created_at: string }`
  - `ExperienceRecord` type: `{ id: string; logo: string | null; name: string; additional: string | null; type: "Full-time" | "Part-time" | "Internship" | "Contract" | null; year: string | null; duration: string | null; sort_order: number; created_at: string }`
  - `ProjectInput = Omit<ProjectRecord, "created_at">`
  - `ExperienceInput = Omit<ExperienceRecord, "created_at" | "id">`
  - `sanitizeProjectInput(body: unknown): { data: ProjectInput; error?: undefined } | { data?: undefined; error: string }`
  - `sanitizeExperienceInput(body: unknown): { data: ExperienceInput; error?: undefined } | { data?: undefined; error: string }`

- [ ] **Step 1: Create the shared types**

Create `lib/types.ts`:

```ts
export interface ProjectRecord {
  id: string;
  title: string;
  category: string[];
  description: string | null;
  images: string[];
  technology: string[];
  github: string | null;
  demo: string | null;
  video: string | null;
  sort_order: number;
  created_at: string;
}

export interface ExperienceRecord {
  id: string;
  logo: string | null;
  name: string;
  additional: string | null;
  type: "Full-time" | "Part-time" | "Internship" | "Contract" | null;
  year: string | null;
  duration: string | null;
  sort_order: number;
  created_at: string;
}
```

- [ ] **Step 2: Write the failing tests**

Create `lib/validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sanitizeExperienceInput, sanitizeProjectInput } from "./validation";

describe("sanitizeProjectInput", () => {
  it("rejects a missing id", () => {
    const result = sanitizeProjectInput({ title: "Test" });
    expect(result.error).toBe("id is required");
  });

  it("rejects a missing title", () => {
    const result = sanitizeProjectInput({ id: "test" });
    expect(result.error).toBe("title is required");
  });

  it("accepts minimal valid input and fills in defaults", () => {
    const result = sanitizeProjectInput({ id: "test", title: "Test" });
    expect(result.data).toEqual({
      id: "test",
      title: "Test",
      category: [],
      description: null,
      images: [],
      technology: [],
      github: null,
      demo: null,
      video: null,
      sort_order: 0,
    });
  });

  it("normalizes full input, trims strings, and drops unknown categories", () => {
    const result = sanitizeProjectInput({
      id: "  test  ",
      title: "  Test  ",
      category: ["web", "not-a-category", "mobile"],
      description: "desc",
      images: ["a.png", "", "b.png"],
      technology: ["React", "Next.js"],
      github: "https://github.com/x",
      demo: "",
      video: "",
      sort_order: 5,
    });
    expect(result.data).toEqual({
      id: "test",
      title: "Test",
      category: ["web", "mobile"],
      description: "desc",
      images: ["a.png", "b.png"],
      technology: ["React", "Next.js"],
      github: "https://github.com/x",
      demo: null,
      video: null,
      sort_order: 5,
    });
  });

  it("rejects a non-object body", () => {
    const result = sanitizeProjectInput(null);
    expect(result.error).toBe("Request body must be an object");
  });
});

describe("sanitizeExperienceInput", () => {
  it("rejects a missing name", () => {
    const result = sanitizeExperienceInput({});
    expect(result.error).toBe("name is required");
  });

  it("accepts minimal valid input and fills in defaults", () => {
    const result = sanitizeExperienceInput({ name: "Acme" });
    expect(result.data).toEqual({
      name: "Acme",
      logo: null,
      additional: null,
      type: null,
      year: null,
      duration: null,
      sort_order: 0,
    });
  });

  it("keeps a valid type value", () => {
    const result = sanitizeExperienceInput({ name: "Acme", type: "Contract" });
    expect(result.data?.type).toBe("Contract");
  });

  it("nulls out an invalid type value instead of rejecting the request", () => {
    const result = sanitizeExperienceInput({ name: "Acme", type: "Freelance" });
    expect(result.data?.type).toBeNull();
  });
});
```

- [ ] **Step 3: Run the tests and verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './validation'` (the module doesn't exist yet).

- [ ] **Step 4: Implement `lib/validation.ts`**

Create `lib/validation.ts`:

```ts
import type { ExperienceRecord, ProjectRecord } from "./types";

const ALLOWED_CATEGORIES = ["mobile", "web", "automations", "games"];
const EXPERIENCE_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

export type ProjectInput = Omit<ProjectRecord, "created_at">;
export type ExperienceInput = Omit<ExperienceRecord, "created_at" | "id">;

type Result<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function sanitizeProjectInput(body: unknown): Result<ProjectInput> {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const id = typeof b.id === "string" ? b.id.trim() : "";
  if (!id) return { error: "id is required" };

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return { error: "title is required" };

  const category = toStringArray(b.category).filter((c) =>
    ALLOWED_CATEGORIES.includes(c)
  );

  return {
    data: {
      id,
      title,
      category,
      description: toNullableString(b.description),
      images: toStringArray(b.images),
      technology: toStringArray(b.technology),
      github: toNullableString(b.github),
      demo: toNullableString(b.demo),
      video: toNullableString(b.video),
      sort_order: typeof b.sort_order === "number" ? b.sort_order : 0,
    },
  };
}

export function sanitizeExperienceInput(body: unknown): Result<ExperienceInput> {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) return { error: "name is required" };

  const rawType = typeof b.type === "string" ? b.type : null;
  const type = EXPERIENCE_TYPES.includes(rawType ?? "")
    ? (rawType as ExperienceInput["type"])
    : null;

  return {
    data: {
      name,
      logo: toNullableString(b.logo),
      additional: toNullableString(b.additional),
      type,
      year: toNullableString(b.year),
      duration: toNullableString(b.duration),
      sort_order: typeof b.sort_order === "number" ? b.sort_order : 0,
    },
  };
}
```

- [ ] **Step 5: Run the tests and verify they pass**

Run: `npm test`
Expected: PASS — all 9 tests green.

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/validation.ts lib/validation.test.ts
git commit -m "Add project/experience types and input validation"
```

---

### Task 3: Admin auth helpers (TDD)

**Files:**
- Create: `lib/adminAuth.ts`
- Create: `lib/adminAuth.test.ts`

**Interfaces:**
- Produces:
  - `getAdminCookieName(): string` → `"admin_session"`
  - `verifyAdminPassword(password: string): boolean`
  - `verifyAdminSessionCookie(cookieValue: string | undefined): boolean`
  - `getAdminSessionSecret(): string` (throws if `ADMIN_SESSION_SECRET` unset)

- [ ] **Step 1: Write the failing tests**

Create `lib/adminAuth.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAdminCookieName,
  getAdminSessionSecret,
  verifyAdminPassword,
  verifyAdminSessionCookie,
} from "./adminAuth";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getAdminCookieName", () => {
  it("returns a stable cookie name", () => {
    expect(getAdminCookieName()).toBe("admin_session");
  });
});

describe("verifyAdminPassword", () => {
  it("returns true for the correct password", () => {
    vi.stubEnv("ADMIN_PASSWORD", "secret123");
    expect(verifyAdminPassword("secret123")).toBe(true);
  });

  it("returns false for the wrong password", () => {
    vi.stubEnv("ADMIN_PASSWORD", "secret123");
    expect(verifyAdminPassword("wrong")).toBe(false);
  });

  it("returns false when ADMIN_PASSWORD is not set", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(verifyAdminPassword("anything")).toBe(false);
  });
});

describe("verifyAdminSessionCookie", () => {
  it("returns true when the cookie matches the secret", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(verifyAdminSessionCookie("topsecret")).toBe(true);
  });

  it("returns false when the cookie is missing", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(verifyAdminSessionCookie(undefined)).toBe(false);
  });

  it("returns false when the cookie doesn't match", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(verifyAdminSessionCookie("wrong")).toBe(false);
  });
});

describe("getAdminSessionSecret", () => {
  it("returns the configured secret", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "topsecret");
    expect(getAdminSessionSecret()).toBe("topsecret");
  });

  it("throws when the secret is not set", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "");
    expect(() => getAdminSessionSecret()).toThrow();
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './adminAuth'`.

- [ ] **Step 3: Implement `lib/adminAuth.ts`**

Create `lib/adminAuth.ts`:

```ts
const COOKIE_NAME = "admin_session";

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export function verifyAdminSessionCookie(cookieValue: string | undefined): boolean {
  const expected = process.env.ADMIN_SESSION_SECRET;
  if (!expected || !cookieValue) return false;
  return cookieValue === expected;
}

export function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return secret;
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test`
Expected: PASS — all tests green (9 from Task 2 + 7 from this task = 16 total).

- [ ] **Step 5: Commit**

```bash
git add lib/adminAuth.ts lib/adminAuth.test.ts
git commit -m "Add admin password/session cookie verification helpers"
```

---

### Task 4: Supabase client + public read API routes

**Files:**
- Create: `lib/supabaseAdmin.ts`
- Create: `app/api/projects/route.ts`
- Create: `app/api/experience/route.ts`

**Interfaces:**
- Consumes: none (first code to touch Supabase)
- Produces:
  - `getSupabaseAdmin(): SupabaseClient` from `lib/supabaseAdmin.ts`
  - `GET /api/projects` → `{ projects: ProjectRecord[] }`
  - `GET /api/experience` → `{ experience: ExperienceRecord[] }`

- [ ] **Step 1: Create the Supabase client factory**

Create `lib/supabaseAdmin.ts`:

```ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
```

- [ ] **Step 2: Create the public projects route**

Create `app/api/projects/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}
```

- [ ] **Step 3: Create the public experience route**

Create `app/api/experience/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ experience: data });
}
```

- [ ] **Step 4: Start the dev server**

Run (in a background/separate terminal): `npm run dev`
Expected: Server starts on `http://localhost:3000` with no compile errors.

- [ ] **Step 5: Verify both routes against the live (currently empty) tables**

Run: `curl -s http://localhost:3000/api/projects`
Expected: `{"projects":[]}`

Run: `curl -s http://localhost:3000/api/experience`
Expected: `{"experience":[]}`

(Empty arrays are correct — the tables exist but haven't been seeded yet; that happens in Task 10.)

- [ ] **Step 6: Commit**

```bash
git add lib/supabaseAdmin.ts app/api/projects/route.ts app/api/experience/route.ts
git commit -m "Add Supabase client and public GET /api/projects, /api/experience routes"
```

---

### Task 5: Admin login/logout routes

**Files:**
- Create: `app/api/admin/login/route.ts`
- Create: `app/api/admin/logout/route.ts`

**Interfaces:**
- Consumes: `verifyAdminPassword`, `getAdminCookieName`, `getAdminSessionSecret` from `lib/adminAuth.ts`
- Produces: `POST /api/admin/login` (sets cookie), `POST /api/admin/logout` (clears cookie)

- [ ] **Step 1: Create the login route**

Create `app/api/admin/login/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminSessionSecret,
  verifyAdminPassword,
} from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), getAdminSessionSecret(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
```

- [ ] **Step 2: Create the logout route**

Create `app/api/admin/logout/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), "", { path: "/", maxAge: 0 });
  return response;
}
```

- [ ] **Step 3: Verify login rejects a wrong password**

With the dev server running, run:
`curl -s -i -X POST http://localhost:3000/api/admin/login -H "Content-Type: application/json" -d "{\"password\":\"wrong\"}"`
Expected: `HTTP/1.1 401` and body `{"error":"Invalid password"}`.

- [ ] **Step 4: Verify login accepts the correct password and sets a cookie**

Run:
`curl -s -i -X POST http://localhost:3000/api/admin/login -H "Content-Type: application/json" -d "{\"password\":\"Dota2islife!\"}"`
Expected: `HTTP/1.1 200`, body `{"ok":true}`, and a `Set-Cookie: admin_session=...` header.

- [ ] **Step 5: Verify logout clears the cookie**

Run: `curl -s -i -X POST http://localhost:3000/api/admin/logout`
Expected: `HTTP/1.1 200` and a `Set-Cookie: admin_session=; ... Max-Age=0` header.

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/login/route.ts app/api/admin/logout/route.ts
git commit -m "Add admin login/logout routes"
```

---

### Task 6: Route protection middleware

**Files:**
- Create: `middleware.ts` (repo root, alongside `app/`)

**Interfaces:**
- Consumes: `verifyAdminSessionCookie`, `getAdminCookieName` from `lib/adminAuth.ts`
- Produces: redirects unauthenticated `/admin/*` page requests to `/admin/login`; returns `401` for unauthenticated `/api/admin/*` requests (except login/logout).

- [ ] **Step 1: Create the middleware**

Create `middleware.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, verifyAdminSessionCookie } from "@/lib/adminAuth";

const PUBLIC_ADMIN_API_PATHS = ["/api/admin/login", "/api/admin/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin") && !PUBLIC_ADMIN_API_PATHS.includes(pathname);

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(getAdminCookieName())?.value;
  const authorized = verifyAdminSessionCookie(cookie);

  if (authorized) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

- [ ] **Step 2: Verify an unauthenticated API request is blocked**

Run: `curl -s -i http://localhost:3000/api/admin/projects`
Expected: `HTTP/1.1 401` and body `{"error":"Unauthorized"}` — note this happens even though `app/api/admin/projects/route.ts` doesn't exist yet (built in Task 7); middleware intercepts before Next's router resolves the path, so a `401` here (not a `404`) proves the middleware ran.

- [ ] **Step 3: Verify an authenticated API request passes through**

First log in and save the cookie to a file, then reuse it:

```bash
curl -s -c /tmp/admin-cookie.txt -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" -d "{\"password\":\"Dota2islife!\"}"
curl -s -i -b /tmp/admin-cookie.txt http://localhost:3000/api/admin/projects
```

Expected: the second call now returns Next's normal `404` (not `401`) for a still-nonexistent route — proving the cookie let the request through the middleware to Next's router.

- [ ] **Step 4: Verify an unauthenticated page request redirects**

Run: `curl -s -i http://localhost:3000/admin`
Expected: `HTTP/1.1 307` (or `308`) with a `Location: /admin/login` header.

- [ ] **Step 5: Commit**

```bash
git add middleware.ts
git commit -m "Add middleware protecting /admin pages and /api/admin routes"
```

---

### Task 7: Admin CRUD routes — projects

**Files:**
- Create: `app/api/admin/projects/route.ts`
- Create: `app/api/admin/projects/[id]/route.ts`

**Interfaces:**
- Consumes: `sanitizeProjectInput` from `lib/validation.ts`, `getSupabaseAdmin` from `lib/supabaseAdmin.ts`
- Produces: `POST /api/admin/projects`, `PUT /api/admin/projects/[id]`, `DELETE /api/admin/projects/[id]`

- [ ] **Step 1: Create the create route**

Create `app/api/admin/projects/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeProjectInput } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = sanitizeProjectInput(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("projects")
    .insert(result.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}
```

- [ ] **Step 2: Create the update/delete route**

Create `app/api/admin/projects/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeProjectInput } from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = sanitizeProjectInput({ ...(typeof body === "object" && body ? body : {}), id });
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { id: _ignoredId, ...updateFields } = result.data;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("projects")
    .update(updateFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify create, read-back, update, and delete end-to-end**

With the dev server running and a valid cookie saved at `/tmp/admin-cookie.txt` (from Task 6, Step 3 — redo that login if the server restarted):

```bash
# Create
curl -s -X POST http://localhost:3000/api/admin/projects -b /tmp/admin-cookie.txt \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"test-project\",\"title\":\"Test Project\",\"category\":[\"web\"]}"
```
Expected: `201` with `{"project":{"id":"test-project","title":"Test Project","category":["web"],...}}`.

```bash
# Read back via the public route
curl -s http://localhost:3000/api/projects
```
Expected: the array now contains the `test-project` entry.

```bash
# Update
curl -s -X PUT http://localhost:3000/api/admin/projects/test-project -b /tmp/admin-cookie.txt \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Updated Title\",\"category\":[\"web\"]}"
```
Expected: `200` with `"title":"Updated Title"`.

```bash
# Delete
curl -s -X DELETE http://localhost:3000/api/admin/projects/test-project -b /tmp/admin-cookie.txt
curl -s http://localhost:3000/api/projects
```
Expected: delete returns `{"ok":true}`; the follow-up `GET` no longer includes `test-project`.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/projects
git commit -m "Add admin create/update/delete routes for projects"
```

---

### Task 8: Admin CRUD routes — experience

**Files:**
- Create: `app/api/admin/experience/route.ts`
- Create: `app/api/admin/experience/[id]/route.ts`

**Interfaces:**
- Consumes: `sanitizeExperienceInput` from `lib/validation.ts`, `getSupabaseAdmin` from `lib/supabaseAdmin.ts`
- Produces: `POST /api/admin/experience`, `PUT /api/admin/experience/[id]`, `DELETE /api/admin/experience/[id]`

- [ ] **Step 1: Create the create route**

Create `app/api/admin/experience/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeExperienceInput } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const result = sanitizeExperienceInput(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("experience")
    .insert(result.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ experience: data }, { status: 201 });
}
```

- [ ] **Step 2: Create the update/delete route**

Create `app/api/admin/experience/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeExperienceInput } from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = sanitizeExperienceInput(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("experience")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ experience: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify create, read-back, update, and delete end-to-end**

```bash
# Create
curl -s -X POST http://localhost:3000/api/admin/experience -b /tmp/admin-cookie.txt \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Co\",\"type\":\"Contract\"}"
```
Expected: `201` with `{"experience":{"id":"<uuid>","name":"Test Co","type":"Contract",...}}`. Note the returned `id` (uuid) for the next steps.

```bash
curl -s http://localhost:3000/api/experience
```
Expected: array now contains the "Test Co" entry.

```bash
# Update (replace <id> with the uuid from Create)
curl -s -X PUT http://localhost:3000/api/admin/experience/<id> -b /tmp/admin-cookie.txt \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Co Updated\"}"
```
Expected: `200` with `"name":"Test Co Updated"`.

```bash
# Delete
curl -s -X DELETE http://localhost:3000/api/admin/experience/<id> -b /tmp/admin-cookie.txt
curl -s http://localhost:3000/api/experience
```
Expected: delete returns `{"ok":true}`; the entry is gone from the follow-up `GET`.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/experience
git commit -m "Add admin create/update/delete routes for experience"
```

---

### Task 9: Admin image upload route

**Files:**
- Create: `app/api/admin/upload/route.ts`

**Interfaces:**
- Consumes: `getSupabaseAdmin` from `lib/supabaseAdmin.ts`
- Produces: `POST /api/admin/upload` (multipart `files` field) → `{ urls: string[] }`

- [ ] **Step 1: Create the upload route**

Create `app/api/admin/upload/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const BUCKET = "project-images";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const urls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
```

- [ ] **Step 2: Verify upload end-to-end with a real file**

Find any small `.png` in the repo to use as a test file, e.g. `public/imagesv2/wingsagrivet/1.png`.

```bash
curl -s -X POST http://localhost:3000/api/admin/upload -b /tmp/admin-cookie.txt \
  -F "files=@public/imagesv2/wingsagrivet/1.png"
```
Expected: `200` with `{"urls":["https://cyjubfcghvlmxnhmyeqm.supabase.co/storage/v1/object/public/project-images/<uuid>.png"]}`.

Then fetch the returned URL directly to confirm it's publicly reachable:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "<paste the returned URL>"
```
Expected: `200`.

- [ ] **Step 3: Verify the no-file-provided error path**

```bash
curl -s -i -X POST http://localhost:3000/api/admin/upload -b /tmp/admin-cookie.txt
```
Expected: `400` with `{"error":"No files provided"}`.

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/upload/route.ts
git commit -m "Add admin image upload route backed by Supabase Storage"
```

---

### Task 10: Migration script — seed Supabase from current hardcoded data

**Files:**
- Create: `scripts/migrate-to-supabase.mjs`

**Interfaces:**
- Consumes: `@supabase/supabase-js` directly (not `lib/supabaseAdmin.ts`, since this is a standalone script, not a Next.js request)
- Produces: populates the `projects` and `experience` tables with the 17 projects and 6 experience entries currently hardcoded in `app/page.tsx`

- [ ] **Step 1: Create the migration script**

Create `scripts/migrate-to-supabase.mjs`:

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Run with: node --env-file=.env.local scripts/migrate-to-supabase.mjs"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const projects = [
  { id: "gesturbee", title: "GesturBee", category: ["mobile", "automations"], description: "A gamified e-learning mobile app designed to make learning Filipino Sign Language (FSL) fun, accessible, and engaging. Features progressive learning stages, mini-games, quizzes, and performance tracking powered by a custom-built AI gesture recognition model built from scratch.", images: ["/imagesv2/gesturbee/1.webp", "/imagesv2/gesturbee/2.webp", "/imagesv2/gesturbee/3.webp", "/imagesv2/gesturbee/4.webp", "/imagesv2/gesturbee/5.webp", "/imagesv2/gesturbee/6.webp", "/imagesv2/gesturbee/7.webp", "/imagesv2/gesturbee/8.webp", "/imagesv2/gesturbee/9.webp", "/imagesv2/gesturbee/10.webp", "/imagesv2/gesturbee/11.webp"], technology: ["React Native", "TypeScript", "Firebase", "Redux"], github: "https://github.com/Rhixin/GesturbeeCamera", demo: "", video: "", sort_order: 0 },
  { id: "wingsagrivet", title: "Wings Agrivet POS & Inventory", category: ["web", "mobile"], description: "An offline-first point-of-sale and inventory management system built for Wings Agrivet & Feed Supply, a veterinary and agricultural feed/medicine retailer. Ships from a single React codebase as both a Windows desktop app and an Android tablet app, with all data stored locally so the store keeps running without internet. Includes a full POS with per-item discounts and split payments, inventory tracked down to pack and base units (e.g. box of tablets vs. loose tablets), customer credit balances, role-based admin access, a full audit log, and sales/inventory analytics with demand forecasting.", images: ["/imagesv2/wingsagrivet/1.png", "/imagesv2/wingsagrivet/2.png", "/imagesv2/wingsagrivet/3.png", "/imagesv2/wingsagrivet/4.png", "/imagesv2/wingsagrivet/5.png", "/imagesv2/wingsagrivet/6.png", "/imagesv2/wingsagrivet/7.png"], technology: ["React", "TypeScript", "Vite", "Electron", "Capacitor", "Tailwind", "Recharts"], github: "", demo: "", video: "", sort_order: 1 },
  { id: "roomradar", title: "RoomRadar", category: ["web"], description: "A web platform that helps users find nearby boarding houses through real-time listings integrated with Google Maps. Landlords post property details while tenants browse, filter by budget and proximity, chat with landlords, and explore through an interactive map-based interface.", images: ["/imagesv2/roomradarweb/1.webp", "/imagesv2/roomradarweb/2.webp", "/imagesv2/roomradarweb/3.webp", "/imagesv2/roomradarweb/4.webp", "/imagesv2/roomradarweb/5.webp", "/imagesv2/roomradarweb/6.webp", "/imagesv2/roomradarweb/7.webp", "/imagesv2/roomradarweb/8.webp"], technology: ["React", "Next.js", "ASP.NET", "MySQL", "Google Maps API", "Bootstrap"], github: "https://github.com/Rhixin/RoomRadarWeb", demo: "", video: "https://drive.google.com/file/d/1DF99Y3fcrSaBvUIVIAv3vX1_3yNsSvDV/view?usp=sharing", sort_order: 2 },
  { id: "sinehan", title: "Sinehan", category: ["web"], description: "An online cinema ticketing system that lets users browse real-time movie schedules, choose screening times, and reserve specific seats through an interactive seating layout. Includes a full admin dashboard for managing movies, schedules, and seat availability.", images: ["/imagesv2/sinehan/1.webp", "/imagesv2/sinehan/2.webp", "/imagesv2/sinehan/3.webp", "/imagesv2/sinehan/4.webp", "/imagesv2/sinehan/5.webp", "/imagesv2/sinehan/6.webp", "/imagesv2/sinehan/7.webp", "/imagesv2/sinehan/8.webp"], technology: ["HTML", "CSS", "JavaScript", "Python Django", "SQLite"], github: "https://github.com/elib00/sinehan", demo: "", video: "https://drive.google.com/file/d/1e6CuNI87NsXNQK-vW9J3zvgkvF6M5bA_/view?usp=sharing", sort_order: 3 },
  { id: "powersystems", title: "Power Systems Inc.", category: ["web"], description: "An internal company website for Power Systems Inc., transitioning paper-based forms to a fully digital system. Centralizes all company forms and workflows, features a searchable data management dashboard, and an integrated AI-powered chatbot for quick data retrieval.", images: ["/imagesv2/powersystemsinc/1.webp", "/imagesv2/powersystemsinc/2.webp", "/imagesv2/powersystemsinc/3.webp", "/imagesv2/powersystemsinc/4.webp", "/imagesv2/powersystemsinc/5.webp", "/imagesv2/powersystemsinc/6.webp", "/imagesv2/powersystemsinc/7.webp", "/imagesv2/powersystemsinc/8.webp", "/imagesv2/powersystemsinc/9.webp"], technology: ["Next.js", "PostgreSQL", "NestJS", "Render", "Tailwind"], github: "https://github.com/Rhixin/powersystemsinc", demo: "", video: "", sort_order: 4 },
  { id: "mnsts-ims", title: "MNSTS IMS", category: ["web"], description: "An Inventory Management System for Medellin National Science and Technology School featuring stock tracking, reporting dashboards, and full administrative tools for managing school resources.", images: ["/imagesv2/ims/1.webp", "/imagesv2/ims/2.webp", "/imagesv2/ims/3.webp", "/imagesv2/ims/4.webp", "/imagesv2/ims/5.webp", "/imagesv2/ims/6.webp", "/imagesv2/ims/7.webp", "/imagesv2/ims/8.webp", "/imagesv2/ims/9.webp", "/imagesv2/ims/10.webp"], technology: ["Next.js", "Tailwind", "MongoDB"], github: "https://github.com/Rhixin/MNSTS-IMS", demo: "", video: "", sort_order: 5 },
  { id: "mnsts-website", title: "MNSTS Website", category: ["web"], description: "Developed and deployed a school website enabling students to access news, announcements, events, organizations, and achievements. Features an admin dashboard and an automated email notification system for subscribed students.", images: ["/imagesv2/mnsts/1.webp", "/imagesv2/mnsts/2.webp", "/imagesv2/mnsts/3.webp", "/imagesv2/mnsts/4.webp", "/imagesv2/mnsts/5.webp", "/imagesv2/mnsts/6.webp", "/imagesv2/mnsts/7.webp"], technology: ["Next.js", "Tailwind", "MongoDB", "Cloudinary"], github: "https://github.com/Rhixin/MNSTS", demo: "https://mnsts.vercel.app/home", video: "https://drive.google.com/file/d/1jUZ5zXoGHEWfjZdQjqx3Bz9p-w/view?usp=sharing", sort_order: 6 },
  { id: "cyberbully", title: "Cyber Bullying Detector Extension", category: ["automations"], description: "A browser extension that detects and covers cyberbullying content in real time. Trained a custom deep learning model using Python and Keras via KGGN on the Hateful Memes dataset to identify both hateful text and hateful images. When harmful content is detected on a webpage, the extension automatically covers it to protect the user.", images: ["/imagesv2/cyber/cyber1.webp", "/imagesv2/cyber/cyber2.webp"], technology: ["JavaScript", "Python", "Keras", "Flask", "Uvicorn"], github: "https://github.com/KennLoyd/Cyberbullying-Detection-on-X", demo: "", video: "https://drive.google.com/file/d/1huReq6k0xBERgOn9wqbckeZC84uuXecF/view", sort_order: 7 },
  { id: "pitchfully", title: "Pitchfully", category: ["automations", "web"], description: "An AI-powered sales and marketing platform for freelancers and agencies. Connects to Meta Ads for full campaign management, Creative & Audience Insights, automated rules, and a leads dashboard. AI generates personalized ad copy and pitch messages, manages follow-ups, and actively controls ad spend. Built on ASP.NET Core with AES-GCM encryption and JWT authentication.", images: ["/imagesv2/pitchfully/pitch1.webp", "/imagesv2/pitchfully/pitch2.webp", "/imagesv2/pitchfully/pitch3.webp", "/imagesv2/pitchfully/pitch4.webp", "/imagesv2/pitchfully/pitch5.webp"], technology: ["ASP.NET Core", "JavaScript", "Meta Ads API", "Azure", "AES-GCM"], github: "https://github.com/Everincrease/pitchai", demo: "https://app-uat.pitchfully.io/pages/sign-in.html", video: "", sort_order: 8 },
  { id: "court-rentals", title: "Court Rentals", category: ["automations", "web"], description: "A fully automated sport court booking platform. Browse real-time court availability, select a schedule, and pay securely via Stripe. Automated booking confirmations are sent instantly. Includes an AI chatbot that answers questions about court availability, rates, and more.", images: ["/imagesv2/sports/sport1.webp", "/imagesv2/sports/sport2.webp", "/imagesv2/sports/sport3.webp", "/imagesv2/sports/sport4.webp", "/imagesv2/sports/sport5.webp", "/imagesv2/sports/sport6.webp", "/imagesv2/sports/sport7.webp", "/imagesv2/sports/sport8.webp"], technology: ["Next.js", "Supabase", "Python", "Stripe"], github: "", demo: "", video: "", sort_order: 9 },
  { id: "jobless", title: "JobLess", category: ["automations", "web"], description: "A platform that automates job hunting by matching your resume against job listings and scoring each one from 1–100. Generates a personalized draft application letter tailored to the job description, lets you edit it, and submits your application with a single click.", images: ["/imagesv2/jobless/jobless1.webp", "/imagesv2/jobless/jobless2.webp", "/imagesv2/jobless/jobless3.webp", "/imagesv2/jobless/jobless4.webp", "/imagesv2/jobless/jobless5.webp", "/imagesv2/jobless/jobless6.webp"], technology: ["Next.js", "Supabase", "Python", "OpenClaw"], github: "https://github.com/ZhaztedValles/ai-job-seeker", demo: "", video: "", sort_order: 10 },
  { id: "leadgen", title: "Lead Gen & Outreach Automation", category: ["automations", "web"], description: "Automates B2B lead generation for wine products by scraping Google Maps and social media data via APIFY to find wine shops and pub bars. Scores each lead with a custom ranking system, generates personalized outreach emails, and manages replies — all in one pipeline.", images: ["/imagesv2/leadgen/lead1.webp", "/imagesv2/leadgen/lead2.webp", "/imagesv2/leadgen/lead3.webp", "/imagesv2/leadgen/lead4.webp", "/imagesv2/leadgen/lead5.webp", "/imagesv2/leadgen/lead6.webp", "/imagesv2/leadgen/lead7.webp"], technology: ["Next.js", "Supabase", "Python", "APIFY"], github: "", demo: "", video: "", sort_order: 11 },
  { id: "rent-collection", title: "Automated Tenant Rent Collection", category: ["automations", "web"], description: "A platform that automates rent collection by sending SMS messages via Twilio to tenants with overdue balances. Negotiates payment plans through automated messaging, detects incoming payments, and escalates unresolved cases to admin with notifications.", images: ["/imagesv2/collections/stanton_1.webp", "/imagesv2/collections/stanton_2.webp", "/imagesv2/collections/stanton_3.webp", "/imagesv2/collections/stanton_4.webp", "/imagesv2/collections/stanton_5.webp", "/imagesv2/collections/stanton_6.webp", "/imagesv2/collections/stanton_7.webp", "/imagesv2/collections/stanton_8.webp"], technology: ["Next.js", "Supabase", "Twilio"], github: "https://github.com/Rhixin/collections_dash_v2", demo: "", video: "", sort_order: 12 },
  { id: "asl", title: "Real-Time Sign Language Recognition", category: ["automations"], description: "A real-time sign language recognition system using computer vision and deep learning, achieving 98.6% accuracy in gesture classification. Uses Flask and Socket.IO for real-time backend communication with a React frontend for live hand tracking and gesture detection.", images: ["/imagesv2/asl/1.webp", "/imagesv2/asl/2.webp", "/imagesv2/asl/3.webp"], technology: ["React", "TensorFlow", "Keras", "Flask", "Socket.IO", "Python", "NumPy"], github: "https://github.com/Rhixin/GesturbeeCamera", demo: "", video: "", sort_order: 13 },
  { id: "disease", title: "Disease Symptoms Analysis", category: ["automations"], description: "Implemented the Apriori algorithm to identify frequent symptom sets and disease associations from a preprocessed dataset. Analyzed disease relationships via shared symptoms and produced visualizations including heatmaps and network graphs.", images: ["/imagesv2/disease/1.webp", "/imagesv2/disease/2.webp", "/imagesv2/disease/3.webp", "/imagesv2/disease/4.webp"], technology: ["Python", "Matplotlib", "Pandas", "Seaborn", "Apriori"], github: "https://github.com/Rhixin/SymptomsDiseaseAnalysis", demo: "", video: "", sort_order: 14 },
  { id: "maze", title: "3D Horror Maze", category: ["games"], description: "A 3D game built from 2D materials using Raycasting — a rendering technique that simulates light rays to create the illusion of depth and perspective. Navigate through dark mazes while avoiding terrifying creatures with atmospheric sound design.", images: ["/imagesv2/maze/1.webp", "/imagesv2/maze/2.webp", "/imagesv2/maze/3.webp", "/imagesv2/maze/4.webp", "/imagesv2/maze/5.webp"], technology: ["Java", "Raycasting", "JavaFX", "JDBC"], github: "https://github.com/Rhixin/EscapeSerato", demo: "", video: "https://drive.google.com/file/d/12972LaKNp6Q0kfXUXT4n-uHyKxs9-N5r/view?usp=sharing", sort_order: 15 },
  { id: "terraria", title: "Terraria Duplicate", category: ["games"], description: "A 2D game inspired by Terraria where players mine resources and craft materials to survive. Independently designed and implemented all game mechanics except graphics. Boss battles are the core mechanic — victory requires defeating the final boss.", images: ["/imagesv2/terraria/1.webp", "/imagesv2/terraria/2.webp", "/imagesv2/terraria/3.webp"], technology: ["Java", "libGDX"], github: "https://github.com/Rhixin/TERRARIA", demo: "", video: "https://drive.google.com/file/d/1tJHA7ckE2qhamNhosbw1WbB9_P3gRNBa/view?usp=sharing", sort_order: 16 },
];

// `type` wasn't tracked before this feature, so every migrated row starts
// as null except where the role is unambiguously an internship. Fill the
// rest in via /admin after migrating.
const experience = [
  { logo: "/imagesv2/experiences/sttp.webp", name: "STTP", additional: "Scholarship Technopreneurship Training Program", type: null, year: "Mar 2025 – Aug 2025", duration: "6 months", sort_order: 0 },
  { logo: "/imagesv2/others/sun.webp", name: "Sun* Inc.", additional: "Full Stack Software Developer Intern", type: "Internship", year: "Mar 2025 – Jun 2025", duration: "4 months", sort_order: 1 },
  { logo: "/imagesv2/others/fullscale.webp", name: "Full Scale Teams Inc.", additional: "Full Stack Software Developer Intern", type: "Internship", year: "Jun 2025 – Sep 2025", duration: "4 months", sort_order: 2 },
  { logo: "/imagesv2/experiences/everincrease.webp", name: "Everincrease LLC", additional: "Automations Engineer", type: null, year: "Feb 2024 – Dec 2025", duration: "1 yr 10 mos", sort_order: 3 },
  { logo: "/imagesv2/experiences/stanton.webp", name: "Stanton Management", additional: "Automations Engineer", type: null, year: "Jan 2025 – Feb 2026", duration: "1 yr 1 mo", sort_order: 4 },
  { logo: "/imagesv2/others/zv2.webp", name: "Freelancing", additional: "Automations & Full Stack Developer", type: null, year: "Jan 2020 – Present", duration: "6+ years", sort_order: 5 },
];

async function run() {
  console.log(`Seeding ${projects.length} projects...`);
  for (const project of projects) {
    const { error } = await supabase.from("projects").upsert(project, { onConflict: "id" });
    if (error) {
      console.error(`  FAILED "${project.id}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`  OK: ${project.id}`);
    }
  }

  console.log(`Seeding ${experience.length} experience entries...`);
  const { data: existing, error: fetchError } = await supabase
    .from("experience")
    .select("name");
  if (fetchError) {
    console.error("Failed to check existing experience rows:", fetchError.message);
    process.exit(1);
  }
  const existingNames = new Set((existing ?? []).map((row) => row.name));

  for (const entry of experience) {
    if (existingNames.has(entry.name)) {
      console.log(`  SKIP (already exists): ${entry.name}`);
      continue;
    }
    const { error } = await supabase.from("experience").insert(entry);
    if (error) {
      console.error(`  FAILED "${entry.name}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`  OK: ${entry.name}`);
    }
  }

  console.log("Done.");
}

run();
```

- [ ] **Step 2: Run the migration**

Run: `node --env-file=.env.local scripts/migrate-to-supabase.mjs`
Expected: 17 `OK:` lines for projects, then 6 `OK:` lines for experience, then `Done.`.

- [ ] **Step 3: Verify the data landed correctly**

Run: `curl -s http://localhost:3000/api/projects | node -e "const d=JSON.parse(require('fs').readFileSync(0)); console.log(d.projects.length)"`
Expected: `17`

Run: `curl -s http://localhost:3000/api/experience | node -e "const d=JSON.parse(require('fs').readFileSync(0)); console.log(d.experience.length)"`
Expected: `6`

- [ ] **Step 4: Verify re-running the script is safe (idempotent)**

Run: `node --env-file=.env.local scripts/migrate-to-supabase.mjs` again.
Expected: 17 `OK:` lines for projects (upsert overwrites with identical data), and 6 `SKIP (already exists):` lines for experience (no duplicates created). Re-run the Step 3 counts to confirm they're unchanged (`17` and `6`).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-to-supabase.mjs
git commit -m "Add one-off migration script seeding Supabase from current portfolio data"
```

---

### Task 11: Supabase image domain config + reusable image uploader

**Files:**
- Modify: `next.config.ts`
- Create: `components/admin/ImageUploader.tsx`

**Interfaces:**
- Consumes: `POST /api/admin/upload` (Task 9)
- Produces: `<ImageUploader images={string[]} onChange={(urls: string[]) => void} multiple?={boolean} />`, reused by `ProjectForm` (Task 12) and `ExperienceForm` (Task 13)

- [ ] **Step 1: Allow next/image to serve Supabase Storage URLs**

Read the current `next.config.ts`, then modify it to add `images.remotePatterns`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Similar to ESLint, this ignores TypeScript errors during build
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cyjubfcghvlmxnhmyeqm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Create the reusable uploader component**

Create `components/admin/ImageUploader.tsx`:

```tsx
"use client";
import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageUploader({
  images,
  onChange,
  multiple = true,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      const newUrls: string[] = json.urls;
      onChange(multiple ? [...images, ...newUrls] : newUrls.slice(0, 1));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="block w-full text-sm text-gray-300 mb-3"
      />
      {uploading && <p className="text-gray-400 text-sm mb-2">Uploading...</p>}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div
            key={url + i}
            className="relative w-24 h-24 rounded-lg overflow-hidden bg-black/40"
          >
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/70 rounded-full text-white text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify (deferred)**

This component has no page rendering it yet — it's exercised visually in Task 12's verification step once `ProjectForm` uses it. No standalone verification needed here beyond confirming it compiles: run `npm run dev` and check the terminal shows no new TypeScript/compile errors.

- [ ] **Step 4: Commit**

```bash
git add next.config.ts components/admin/ImageUploader.tsx
git commit -m "Allow next/image to serve Supabase Storage URLs; add ImageUploader component"
```

---

### Task 12: Project form + add/edit pages

**Files:**
- Create: `components/admin/ProjectForm.tsx`
- Create: `app/admin/(dashboard)/projects/new/page.tsx`
- Create: `app/admin/(dashboard)/projects/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `ImageUploader` (Task 11), `ProjectRecord` type (Task 2), `POST/PUT /api/admin/projects` (Task 7)
- Produces: `<ProjectForm initial?={ProjectRecord} />`

- [ ] **Step 1: Create the project form**

Create `components/admin/ProjectForm.tsx`:

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ProjectRecord } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const CATEGORIES = ["mobile", "web", "automations", "games"] as const;

export default function ProjectForm({ initial }: { initial?: ProjectRecord }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [id, setId] = useState(initial?.id ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<string[]>(initial?.category ?? []);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [technology, setTechnology] = useState((initial?.technology ?? []).join(", "));
  const [github, setGithub] = useState(initial?.github ?? "");
  const [demo, setDemo] = useState(initial?.demo ?? "");
  const [video, setVideo] = useState(initial?.video ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleCategory = (cat: string) => {
    setCategory((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!isEdit && !id.trim()) {
      setError("ID is required");
      return;
    }

    setSaving(true);
    const payload = {
      id,
      title,
      category,
      description,
      images,
      technology: technology.split(",").map((t) => t.trim()).filter(Boolean),
      github,
      demo,
      video,
      sort_order: Number(sortOrder) || 0,
    };

    const url = isEdit ? `/api/admin/projects/${initial!.id}` : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save project");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {error && (
        <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm">
          {error}
        </p>
      )}

      {!isEdit && (
        <div>
          <label className="block text-gray-300 text-sm mb-1">
            ID (slug, lowercase, no spaces) *
          </label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. wingsagrivet"
          />
        </div>
      )}

      <div>
        <label className="block text-gray-300 text-sm mb-1">Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Category</label>
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={category.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Images</label>
        <ImageUploader images={images} onChange={setImages} multiple />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Technology (comma-separated)</label>
        <input
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          placeholder="React, Next.js, Tailwind"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">GitHub URL</label>
        <input
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Demo URL</label>
        <input
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Video URL</label>
        <input
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Sort Order</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 rounded-lg bg-[#FF6B35] text-white font-semibold disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create the "new project" page**

Create `app/admin/(dashboard)/projects/new/page.tsx`:

```tsx
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Add Project</h1>
      <ProjectForm />
    </div>
  );
}
```

- [ ] **Step 3: Create the "edit project" page**

Create `app/admin/(dashboard)/projects/[id]/edit/page.tsx`:

```tsx
"use client";
import { use, useEffect, useState } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import type { ProjectRecord } from "@/lib/types";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((json) => {
        const found = (json.projects as ProjectRecord[]).find((p) => p.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setProject(found);
      });
  }, [id]);

  if (notFound) return <p className="text-gray-400">Project not found.</p>;
  if (!project) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Project</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
```

- [ ] **Step 4: Manually verify in the browser**

With `npm run dev` running:
1. Visit `http://localhost:3000/admin/projects/new` directly — note that without a browser session cookie you'll be redirected to `/admin/login`; this page is fully wired to the dashboard flow in Task 15, so for now just confirm the page **compiles without error** by checking the terminal output has no red TypeScript/React errors when this route is requested (even if it redirects).
2. Full interactive verification (filling the form, uploading an image, submitting, seeing it land in `/api/projects`) happens in Task 15's end-to-end check once login + dashboard navigation exist.

- [ ] **Step 5: Commit**

```bash
git add components/admin/ProjectForm.tsx "app/admin/(dashboard)/projects"
git commit -m "Add project create/edit form and pages"
```

---

### Task 13: Experience form + add/edit pages

**Files:**
- Create: `components/admin/ExperienceForm.tsx`
- Create: `app/admin/(dashboard)/experience/new/page.tsx`
- Create: `app/admin/(dashboard)/experience/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `ImageUploader` (Task 11), `ExperienceRecord` type (Task 2), `POST/PUT /api/admin/experience` (Task 8)
- Produces: `<ExperienceForm initial?={ExperienceRecord} />`

- [ ] **Step 1: Create the experience form**

Create `components/admin/ExperienceForm.tsx`:

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { ExperienceRecord } from "@/lib/types";
import ImageUploader from "./ImageUploader";

const TYPES = ["Full-time", "Part-time", "Internship", "Contract"] as const;

export default function ExperienceForm({ initial }: { initial?: ExperienceRecord }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [additional, setAdditional] = useState(initial?.additional ?? "");
  const [type, setType] = useState<string>(initial?.type ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [logo, setLogo] = useState<string[]>(initial?.logo ? [initial.logo] : []);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    const payload = {
      name,
      additional,
      type: type || null,
      year,
      duration,
      logo: logo[0] ?? null,
      sort_order: Number(sortOrder) || 0,
    };

    const url = isEdit ? `/api/admin/experience/${initial!.id}` : "/api/admin/experience";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save experience");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {error && (
        <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm">
          {error}
        </p>
      )}

      <div>
        <label className="block text-gray-300 text-sm mb-1">Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Additional (role/subtitle)</label>
        <input
          value={additional}
          onChange={(e) => setAdditional(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        >
          <option value="">None</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Year</label>
        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g. Mar 2025 – Aug 2025"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Duration</label>
        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 6 months"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Logo</label>
        <ImageUploader images={logo} onChange={setLogo} multiple={false} />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-1">Sort Order</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 rounded-lg bg-[#FF6B35] text-white font-semibold disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Experience"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create the "new experience" page**

Create `app/admin/(dashboard)/experience/new/page.tsx`:

```tsx
import ExperienceForm from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Add Experience</h1>
      <ExperienceForm />
    </div>
  );
}
```

- [ ] **Step 3: Create the "edit experience" page**

Create `app/admin/(dashboard)/experience/[id]/edit/page.tsx`:

```tsx
"use client";
import { use, useEffect, useState } from "react";
import ExperienceForm from "@/components/admin/ExperienceForm";
import type { ExperienceRecord } from "@/lib/types";

export default function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [entry, setEntry] = useState<ExperienceRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/experience")
      .then((r) => r.json())
      .then((json) => {
        const found = (json.experience as ExperienceRecord[]).find((e) => e.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setEntry(found);
      });
  }, [id]);

  if (notFound) return <p className="text-gray-400">Experience entry not found.</p>;
  if (!entry) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Experience</h1>
      <ExperienceForm initial={entry} />
    </div>
  );
}
```

- [ ] **Step 4: Verify compiles**

Run `npm run dev` and confirm no new TypeScript/compile errors appear in the terminal (full interactive verification happens in Task 15).

- [ ] **Step 5: Commit**

```bash
git add components/admin/ExperienceForm.tsx "app/admin/(dashboard)/experience"
git commit -m "Add experience create/edit form and pages"
```

---

### Task 14: Admin login page

**Files:**
- Create: `app/admin/login/page.tsx`

**Interfaces:**
- Consumes: `POST /api/admin/login` (Task 5)

- [ ] **Step 1: Create the login page**

Create `app/admin/login/page.tsx`:

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 p-8 rounded-2xl bg-white/5 border border-white/10"
      >
        <h1 className="text-xl font-bold text-white mb-2">Admin Login</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[#FF6B35] text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify in the browser**

With `npm run dev` running, visit `http://localhost:3000/admin/login`:
1. Enter an incorrect password → expect the inline "Incorrect password" message, no navigation.
2. Enter `Dota2islife!` → expect redirect to `/admin` (which may still 404 until Task 15 adds the dashboard page — that's expected for now).

- [ ] **Step 3: Commit**

```bash
git add app/admin/login/page.tsx
git commit -m "Add admin login page"
```

---

### Task 15: Admin header, layout, and dashboard (list + delete)

**Files:**
- Create: `components/admin/AdminHeader.tsx`
- Create: `app/admin/(dashboard)/layout.tsx`
- Create: `app/admin/(dashboard)/page.tsx`

**Interfaces:**
- Consumes: `GET /api/projects`, `GET /api/experience`, `DELETE /api/admin/projects/[id]`, `DELETE /api/admin/experience/[id]`, `POST /api/admin/logout`

- [ ] **Step 1: Create the admin header**

Create `components/admin/AdminHeader.tsx`:

```tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0f]">
      <Link href="/admin" className="text-white font-bold text-lg">
        Portfolio Admin
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
      >
        Log out
      </button>
    </header>
  );
}
```

- [ ] **Step 2: Create the dashboard layout**

Create `app/admin/(dashboard)/layout.tsx`:

```tsx
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <AdminHeader />
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Create the dashboard page**

Create `app/admin/(dashboard)/page.tsx`:

```tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ExperienceRecord, ProjectRecord } from "@/lib/types";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<"projects" | "experience">("projects");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [experience, setExperience] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [projectsRes, experienceRes] = await Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
    ]);
    setProjects(projectsRes.projects ?? []);
    setExperience(experienceRes.experience ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    loadData();
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Delete this experience entry? This cannot be undone.")) return;
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("projects")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            tab === "projects" ? "bg-[#FF6B35] text-white" : "bg-white/10 text-gray-300"
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setTab("experience")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
            tab === "experience" ? "bg-[#FF6B35] text-white" : "bg-white/10 text-gray-300"
          }`}
        >
          Experience ({experience.length})
        </button>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && tab === "projects" && (
        <div>
          <Link
            href="/admin/projects/new"
            className="inline-block mb-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold"
          >
            + Add Project
          </Link>
          <div className="flex flex-col gap-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">{p.title}</p>
                  <p className="text-gray-500 text-xs">{p.category.join(", ")}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && tab === "experience" && (
        <div>
          <Link
            href="/admin/experience/new"
            className="inline-block mb-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold"
          >
            + Add Experience
          </Link>
          <div className="flex flex-col gap-2">
            {experience.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">{e.name}</p>
                  <p className="text-gray-500 text-xs">
                    {e.additional} {e.type ? `· ${e.type}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/experience/${e.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteExperience(e.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Full manual end-to-end verification in the browser**

With `npm run dev` running:
1. Visit `http://localhost:3000/admin` while logged out → confirm redirect to `/admin/login`.
2. Log in with `Dota2islife!` → confirm landing on `/admin` showing "Projects (17)" and, on the Experience tab, "Experience (6)".
3. Click "+ Add Project" → fill in an id (`e2e-test`), title (`E2E Test Project`), check the "web" category, upload a real image file, fill in a GitHub URL → submit → confirm redirect back to `/admin` and the new project appears in the list.
4. Click "Edit" on that project → change the title → submit → confirm the updated title shows in the list.
5. Click "Delete" on that project → confirm the browser `confirm()` dialog appears → accept it → confirm the project disappears from the list.
6. Repeat steps 3-5 for the Experience tab (add, edit, delete a test entry).
7. Click "Log out" → confirm redirect to `/admin/login` and that re-visiting `/admin` redirects back to login.

- [ ] **Step 5: Commit**

```bash
git add components/admin/AdminHeader.tsx "app/admin/(dashboard)/layout.tsx" "app/admin/(dashboard)/page.tsx"
git commit -m "Add admin dashboard: project/experience listing, edit links, and delete"
```

---

### Task 16: Switch `app/page.tsx` to fetch-based data

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `GET /api/projects`, `GET /api/experience`, `ProjectRecord`/`ExperienceRecord` types

- [ ] **Step 1: Remove the hardcoded arrays**

In `app/page.tsx`, delete the `websiteProjects` array's sibling hardcoded data that this feature replaces:
- Delete the entire `const allProjects = [ ... ];` block (currently lines 57–394).
- Delete the entire `const projectsData = [ ... ];` block (currently starting at line 1093) — this array is dead code (verified earlier: it has zero references anywhere else in the file).
- Delete the entire `const experience = [ ... ];` block (currently lines 1007–1050).

Leave `websiteProjects` untouched — it's a separate, unrelated data structure out of scope for this feature.

- [ ] **Step 2: Add fetched state and a loading flag**

Near the top of the `Home` component (alongside the existing `useState` declarations), add:

```tsx
  const [allProjects, setAllProjects] = useState<ProjectRecord[]>([]);
  const [experience, setExperience] = useState<ExperienceRecord[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState(false);
```

Add the import at the top of the file alongside the other imports:

```tsx
import type { ProjectRecord, ExperienceRecord } from "@/lib/types";
```

- [ ] **Step 3: Fetch the data on mount**

Add a new `useEffect` near the existing `isMounted`/`isVisible` effect:

```tsx
  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
    ])
      .then(([projectsRes, experienceRes]) => {
        setAllProjects(projectsRes.projects ?? []);
        setExperience(experienceRes.experience ?? []);
        setDataLoaded(true);
      })
      .catch(() => {
        setDataError(true);
        setDataLoaded(true);
      });
  }, []);
```

- [ ] **Step 4: Extend the loading gate**

Find the existing line:

```tsx
  if (!isMounted) return <PageSkeleton />;
```

Replace it with:

```tsx
  if (!isMounted || !dataLoaded) return <PageSkeleton />;

  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <p className="text-gray-400">Couldn&apos;t load projects right now. Please refresh.</p>
      </div>
    );
  }
```

- [ ] **Step 5: Fix up type references the removed arrays affected**

Since `allProjects`/`experience` are now state (typed as `ProjectRecord[]`/`ExperienceRecord[]` from `lib/types.ts` instead of inline literal array types), search the file for every place that used `.category` as a readonly tuple type (the old data used `category: [...] as const`). The filtering code at (originally) line ~2244 and ~2351 already does `(p.category as readonly string[]).includes(...)`, which works unchanged against `string[]` — no change needed there. Confirm this by searching for `as readonly string[]` and leaving those lines as-is.

- [ ] **Step 6: Manually verify in the browser**

With `npm run dev` running (and the Supabase tables seeded from Task 10):
1. Visit `http://localhost:3000/` and confirm the homepage renders exactly as before — hero, skills, experience timeline, project grid with all 17 projects, filterable by category.
2. Open the browser devtools Network tab, confirm two requests fire to `/api/projects` and `/api/experience` on load.
3. Temporarily stop the dev server's connection to Supabase to test the error path: rename `.env.local`'s `SUPABASE_URL` value to something invalid, restart `npm run dev`, reload the page, confirm the "Couldn't load projects right now" message appears instead of a crash — then revert `.env.local` back and restart the dev server.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "Fetch projects/experience from Supabase-backed API instead of hardcoded arrays"
```

---

### Task 17: Switch `app/(pages)/projects/page.tsx` to fetch-based data

**Files:**
- Modify: `app/(pages)/projects/page.tsx`

**Interfaces:**
- Consumes: `GET /api/projects`, `ProjectRecord` type, existing `Project` component (`components/Project.tsx`)

- [ ] **Step 1: Replace the hardcoded project list with a fetch**

Replace the entire contents of `app/(pages)/projects/page.tsx` with:

```tsx
"use client";
import { useEffect, useState } from "react";
import Project from "@/components/Project";
import type { ProjectRecord } from "@/lib/types";

export default function Projects() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((json) => {
        setProjects(json.projects ?? []);
        setLoaded(true);
      })
      .catch(() => {
        setError(true);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Couldn&apos;t load projects right now. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div>
          {projects.map((project) => (
            <Project
              key={project.id}
              title={project.title}
              description={project.description ?? ""}
              images={project.images}
              technology={project.technology}
              weblink={project.demo ?? ""}
              github={project.github ?? ""}
              video={project.video ?? ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

This drops the old hand-picked 7-project subset (`p0`–`p6`) in favor of showing every project from the same Supabase-backed source `app/page.tsx` uses — per the approved spec ("Point it at the same Supabase data").

- [ ] **Step 2: Manually verify in the browser**

With `npm run dev` running, visit `http://localhost:3000/projects` and confirm all 17 projects now render using the existing `Project` card component (title, carousel, tech badges, GitHub/video/link icons).

- [ ] **Step 3: Commit**

```bash
git add "app/(pages)/projects/page.tsx"
git commit -m "Fetch all projects from the Supabase-backed API on the /projects page"
```

---

### Task 18: Final full regression pass

**Files:** none (verification only)

- [ ] **Step 1: Run the automated test suite**

Run: `npm test`
Expected: all 16 tests (Tasks 2 + 3) still pass.

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: build completes (note: `next.config.ts` has `ignoreBuildErrors`/`ignoreDuringBuilds` set, so this mainly confirms there's no hard runtime/bundling failure, not full type-safety).

- [ ] **Step 3: Full click-through regression on the live homepage**

With `npm run dev` running:
1. Homepage (`/`): hero loads, skills marquee animates, experience timeline scroll-driven animation still works, project grid filters by category (mobile/web/automations/games) still work, clicking a project card opens `ProjectModal` with the right images/description, certification lightbox (added earlier this session) still opens on click.
2. `/projects`: all 17 projects render via the `Project` component.
3. `/admin`: log in, confirm dashboard counts match (17 projects, 6 experience), log out.

- [ ] **Step 4: Confirm no secrets are staged**

Run: `git status`
Expected: `.env.local` does not appear (confirms it's still gitignored after all this work).

- [ ] **Step 5: Final commit if anything is outstanding**

If Steps 1-4 required any fixes, commit them now with a message describing what was fixed. If everything already passed with no changes needed, this step is a no-op — nothing to commit.

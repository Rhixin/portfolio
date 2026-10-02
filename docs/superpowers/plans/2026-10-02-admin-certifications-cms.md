# Admin-Editable Certifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing admin CMS (projects/experience) to also manage certifications — add, edit, delete, each with an image, title, and sort order — replacing the 8 hardcoded "picture frame" JSX blocks on the homepage with a data-driven list.

**Architecture:** Identical pattern to projects/experience, already live in this codebase: a Supabase table + RLS, a public `GET` route, admin-only CRUD routes (with `requireAdmin()` from the start — this was a fix applied to projects/experience after the fact, so apply it immediately here), an admin form + dashboard tab, and the homepage switched to fetch-based rendering. Since arbitrary admin-added certifications can't each get a hand-crafted unique frame design (the original 8 did), new certifications cycle through 4 predefined frame color styles by position instead of one unique style per item.

**Tech Stack:** Same as the existing admin CMS — Next.js 15 App Router, Supabase, the existing `ImageUploader`, `lib/types.ts`/`lib/validation.ts` patterns.

## Global Constraints

- Follow the exact same patterns already established and reviewed in `lib/types.ts`, `lib/validation.ts`, `lib/supabaseAdmin.ts`, `lib/adminAuth.ts` (including `requireAdmin()`), `components/admin/ImageUploader.tsx`, and the existing admin CRUD routes for projects/experience — read those files for the conventions before writing new code; don't invent new patterns.
- `requireAdmin(req)` must be the first line of every admin CRUD handler (projects/experience already had to be retrofitted with this after a final-review finding — apply it from the start here).
- TypeScript strict mode; `@/*` path alias maps to repo root; Next.js 15 dynamic route `params` are `Promise`s.
- `.env.local` already has all needed Supabase credentials.
- No automated tests exist for API routes/pages in this codebase — verify via `npm run dev` + curl, following the evidence-integrity rule: paste real, literal command output, never narrated summaries.
- Always check port 3000 is free before/after starting a dev server, with real pasted `netstat` output.

## File Structure

- `supabase/schema.sql` (modified) — add `certifications` table + RLS policy
- `lib/types.ts` (modified) — add `CertificationRecord`
- `lib/validation.ts` (modified) — add `sanitizeCertificationInput`
- `app/api/certifications/route.ts` (new) — public `GET`
- `app/api/admin/certifications/route.ts` (new) — `POST`
- `app/api/admin/certifications/[id]/route.ts` (new) — `PUT`, `DELETE`
- `scripts/migrate-certifications.mjs` (new, one-off, like the original migration script) — seeds the 8 existing hardcoded certifications
- `components/admin/CertificationForm.tsx` (new)
- `app/admin/(dashboard)/certifications/new/page.tsx` (new)
- `app/admin/(dashboard)/certifications/[id]/edit/page.tsx` (new)
- `app/admin/(dashboard)/page.tsx` (modified) — add a third "Certifications" tab
- `app/page.tsx` (modified) — replace the 8 hardcoded frame blocks with one reusable, data-driven frame

---

### Task 1: Database + types + validation

**Files:**
- Modify: `supabase/schema.sql`
- Modify: `lib/types.ts`
- Modify: `lib/validation.ts`

**Interfaces:**
- Produces: `CertificationRecord { id: string; title: string; image: string | null; sort_order: number; created_at: string }`, `CertificationInput = Omit<CertificationRecord, "created_at" | "id">`, `sanitizeCertificationInput(body: unknown): { data: CertificationInput; error?: undefined } | { data?: undefined; error: string }`

- [ ] **Step 1: Add the table to `supabase/schema.sql`**

Add this block (after the `experience` table definition, before the `alter table ... enable row level security` lines — move those two RLS-enable lines and add a third one, and add the policy block alongside the existing two):

```sql
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
```

Add `alter table public.certifications enable row level security;` next to the other two `alter table ... enable row level security` lines, and add:

```sql
drop policy if exists "Public read access" on public.certifications;
create policy "Public read access" on public.certifications for select using (true);
```

next to the other two public-read policies.

- [ ] **Step 2: Apply the schema change to the live database**

Run this SQL directly against the live Supabase database using the same method used earlier in this project (a throwaway Node script with the `pg` package and `DIRECT_URL` from `.env.local`, or any equivalent direct-Postgres-connection method):

```sql
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.certifications enable row level security;
drop policy if exists "Public read access" on public.certifications;
create policy "Public read access" on public.certifications for select using (true);
```

Verify it worked by querying `information_schema.columns` for `public.certifications` and confirming the 5 columns exist.

- [ ] **Step 3: Add the type to `lib/types.ts`**

Add this interface alongside `ProjectRecord`/`ExperienceRecord`:

```ts
export interface CertificationRecord {
  id: string;
  title: string;
  image: string | null;
  sort_order: number;
  created_at: string;
}
```

- [ ] **Step 4: Add the sanitizer to `lib/validation.ts`**

Read the file first to match existing conventions exactly (the `toNullableString` helper and the `Result<T>` discriminated-union pattern with `ok: true`/`ok: false` already exist — reuse them, do not reinvent). Add:

```ts
export type CertificationInput = Omit<CertificationRecord, "created_at" | "id">;

export function sanitizeCertificationInput(body: unknown): Result<CertificationInput> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return { ok: false, error: "title is required" };

  return {
    ok: true,
    data: {
      title,
      image: toNullableString(b.image),
      sort_order: typeof b.sort_order === "number" ? b.sort_order : 0,
    },
  };
}
```

Add `import type { CertificationRecord } from "./types";` to the existing type-only import line at the top of the file (combine with the existing `ExperienceRecord, ProjectRecord` import).

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` — confirm no new errors beyond the known pre-existing baseline (errors in `app/page.tsx`, `components/Lanyard.tsx`, `components/ScrollStack.tsx`).

Run `npm test` — confirm the existing 18 tests still pass unchanged (no test file touches `sanitizeCertificationInput` yet; that's fine, this task doesn't require new tests since it mirrors the untested-at-this-granularity `sanitizeExperienceInput` pattern — the project's existing tests only cover `sanitizeProjectInput`/`sanitizeExperienceInput`/`adminAuth`, and this plan doesn't add new test coverage for the new sanitizer, consistent with how `sanitizeExperienceInput` itself has no "full input" test either).

- [ ] **Step 6: Commit**

```bash
git add supabase/schema.sql lib/types.ts lib/validation.ts
git commit -m "Add certifications table, type, and input validation"
```

---

### Task 2: Public GET route + migration script

**Files:**
- Create: `app/api/certifications/route.ts`
- Create: `scripts/migrate-certifications.mjs`

**Interfaces:**
- Consumes: `getSupabaseAdmin` from `lib/supabaseAdmin.ts`
- Produces: `GET /api/certifications` → `{ certifications: CertificationRecord[] }`

- [ ] **Step 1: Create the public route**

```ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ certifications: data });
}
```

- [ ] **Step 2: Create the migration script**

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Run with: node --env-file=.env.local scripts/migrate-certifications.mjs"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const certifications = [
  { title: "AWS Academy Graduate", image: "/imagesv2/certifications/aws.webp", sort_order: 0 },
  { title: "C Programming", image: "/imagesv2/certifications/c.webp", sort_order: 1 },
  { title: "Java Certification", image: "/imagesv2/certifications/java.webp", sort_order: 2 },
  { title: "JavaScript", image: "/imagesv2/certifications/javascript.webp", sort_order: 3 },
  { title: "PhilNITS Passer", image: "/imagesv2/certifications/philnits.webp", sort_order: 4 },
  { title: "React Certification", image: "/imagesv2/certifications/react.webp", sort_order: 5 },
  { title: "STTP", image: "/imagesv2/certifications/sttp.webp", sort_order: 6 },
  { title: "TopCIT Level III", image: "/imagesv2/certifications/topcit.webp", sort_order: 7 },
];

async function run() {
  const { data: existing, error: fetchError } = await supabase
    .from("certifications")
    .select("title");
  if (fetchError) {
    console.error("Failed to check existing rows:", fetchError.message);
    process.exit(1);
  }
  const existingTitles = new Set((existing ?? []).map((row) => row.title));

  for (const cert of certifications) {
    if (existingTitles.has(cert.title)) {
      console.log(`  SKIP (already exists): ${cert.title}`);
      continue;
    }
    const { error } = await supabase.from("certifications").insert(cert);
    if (error) {
      console.error(`  FAILED "${cert.title}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`  OK: ${cert.title}`);
    }
  }
  console.log("Done.");
}

run();
```

- [ ] **Step 3: Run the migration and verify**

Run: `node --env-file=.env.local scripts/migrate-certifications.mjs` — expect 8 `OK:` lines.

Start the dev server, run `curl -s http://localhost:3000/api/certifications`, confirm it returns 8 entries with the correct titles/images. Kill the dev server, confirm port 3000 free (real pasted output for both the start and kill port-checks).

Run the migration a second time — confirm all 8 now show `SKIP (already exists)` (idempotency check).

- [ ] **Step 4: Commit**

```bash
git add app/api/certifications/route.ts scripts/migrate-certifications.mjs
git commit -m "Add public certifications API route and seed migration script"
```

---

### Task 3: Admin CRUD routes

**Files:**
- Create: `app/api/admin/certifications/route.ts`
- Create: `app/api/admin/certifications/[id]/route.ts`

**Interfaces:**
- Consumes: `sanitizeCertificationInput`, `getSupabaseAdmin`, `requireAdmin` (from `lib/adminAuth.ts` — already exists, added during the projects/experience final-review fix)
- Produces: `POST /api/admin/certifications`, `PUT /api/admin/certifications/[id]`, `DELETE /api/admin/certifications/[id]`

- [ ] **Step 1: Create the create route**

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeCertificationInput } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json().catch(() => null);
  const result = sanitizeCertificationInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("certifications")
    .insert(result.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ certification: data }, { status: 201 });
}
```

- [ ] **Step 2: Create the update/delete route**

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeCertificationInput } from "@/lib/validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = sanitizeCertificationInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("certifications")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ certification: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("certifications").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify end-to-end with auth**

Start the dev server. Confirm port 3000 hygiene (real pasted output before/after). Log in via `POST /api/admin/login` with the real password, save the cookie. Verify:
- Unauthenticated `POST /api/admin/certifications` → 401
- Authenticated create → 201, read back via `GET /api/certifications` shows 9 entries
- Authenticated update → 200 with changed title
- Authenticated delete → `{"ok":true}`, follow-up `GET /api/certifications` back to 8 entries

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/certifications
git commit -m "Add admin create/update/delete routes for certifications"
```

---

### Task 4: Certification form + admin pages

**Files:**
- Create: `components/admin/CertificationForm.tsx`
- Create: `app/admin/(dashboard)/certifications/new/page.tsx`
- Create: `app/admin/(dashboard)/certifications/[id]/edit/page.tsx`

**Interfaces:**
- Consumes: `ImageUploader` (existing), `CertificationRecord` (Task 1), `POST`/`PUT /api/admin/certifications` (Task 3)

- [ ] **Step 1: Create the form**

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CertificationRecord } from "@/lib/types";
import ImageUploader from "./ImageUploader";

export default function CertificationForm({ initial }: { initial?: CertificationRecord }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [image, setImage] = useState<string[]>(initial?.image ? [initial.image] : []);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      image: image[0] ?? null,
      sort_order: Number(sortOrder) || 0,
    };

    const url = isEdit
      ? `/api/admin/certifications/${initial!.id}`
      : "/api/admin/certifications";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to save certification");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error — please try again");
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
        <label className="block text-gray-300 text-sm mb-1">Title *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm mb-2">Certificate Image</label>
        <ImageUploader images={image} onChange={setImage} multiple={false} />
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
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Certification"}
      </button>
    </form>
  );
}
```

(Note: this includes a `catch` around the fetch, unlike the original `ProjectForm`/`ExperienceForm` which were flagged post-hoc for missing one — don't repeat that gap here.)

- [ ] **Step 2: Create the "new" page**

```tsx
import CertificationForm from "@/components/admin/CertificationForm";

export default function NewCertificationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Add Certification</h1>
      <CertificationForm />
    </div>
  );
}
```

- [ ] **Step 3: Create the "edit" page**

```tsx
"use client";
import { use, useEffect, useState } from "react";
import CertificationForm from "@/components/admin/CertificationForm";
import type { CertificationRecord } from "@/lib/types";

export default function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [certification, setCertification] = useState<CertificationRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((json) => {
        const found = (json.certifications as CertificationRecord[]).find((c) => c.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setCertification(found);
      });
  }, [id]);

  if (notFound) return <p className="text-gray-400">Certification not found.</p>;
  if (!certification) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Edit Certification</h1>
      <CertificationForm initial={certification} />
    </div>
  );
}
```

- [ ] **Step 4: Verify compiles**

Run `npx tsc --noEmit` — confirm no new errors in these 3 files beyond the known baseline.

- [ ] **Step 5: Commit**

```bash
git add components/admin/CertificationForm.tsx "app/admin/(dashboard)/certifications"
git commit -m "Add certification create/edit form and pages"
```

---

### Task 5: Dashboard — Certifications tab

**Files:**
- Modify: `app/admin/(dashboard)/page.tsx`

**Interfaces:**
- Consumes: `GET /api/certifications`, `DELETE /api/admin/certifications/[id]`, `CertificationRecord`

- [ ] **Step 1: Read the current dashboard page in full**

It currently has a two-way `tab` state (`"projects" | "experience"`), loads both lists in `Promise.all` inside `loadData`, and renders two tab buttons plus two conditional list sections. Extend this to three, following the exact same pattern for each piece — do not restructure what's already there.

- [ ] **Step 2: Extend the tab type and state**

Change `useState<"projects" | "experience">("projects")` to `useState<"projects" | "experience" | "certifications">("projects")`. Add `const [certifications, setCertifications] = useState<CertificationRecord[]>([]);` alongside the existing `projects`/`experience` state. Import `CertificationRecord` from `@/lib/types` alongside the existing type imports.

- [ ] **Step 3: Extend `loadData`**

Change the `Promise.all` to fetch three endpoints instead of two, and set the third piece of state:

```ts
const loadData = async () => {
  setLoading(true);
  const [projectsRes, experienceRes, certificationsRes] = await Promise.all([
    fetch("/api/projects").then((r) => r.json()),
    fetch("/api/experience").then((r) => r.json()),
    fetch("/api/certifications").then((r) => r.json()),
  ]);
  setProjects(projectsRes.projects ?? []);
  setExperience(experienceRes.experience ?? []);
  setCertifications(certificationsRes.certifications ?? []);
  setLoading(false);
};
```

- [ ] **Step 4: Add a delete handler**

```ts
const handleDeleteCertification = async (id: string) => {
  if (!confirm("Delete this certification? This cannot be undone.")) return;
  await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" });
  loadData();
};
```

- [ ] **Step 5: Add the third tab button**

Alongside the existing "Projects"/"Experience" tab buttons, add a third following the identical className pattern:

```tsx
<button
  onClick={() => setTab("certifications")}
  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
    tab === "certifications" ? "bg-[#FF6B35] text-white" : "bg-white/10 text-gray-300"
  }`}
>
  Certifications ({certifications.length})
</button>
```

- [ ] **Step 6: Add the third tab's list section**

Following the exact same JSX structure as the "projects"/"experience" conditional sections (Add button + list with Edit link + Delete button):

```tsx
{!loading && tab === "certifications" && (
  <div>
    <Link
      href="/admin/certifications/new"
      className="inline-block mb-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold"
    >
      + Add Certification
    </Link>
    <div className="flex flex-col gap-2">
      {certifications.map((c) => (
        <div
          key={c.id}
          className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 border border-white/10"
        >
          <p className="text-white font-medium">{c.title}</p>
          <div className="flex gap-2">
            <Link
              href={`/admin/certifications/${c.id}/edit`}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDeleteCertification(c.id)}
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
```

- [ ] **Step 7: Verify end-to-end**

Start the dev server, confirm port hygiene. Log in, confirm `curl -b <cookie> http://localhost:3000/admin` returns 200 (page still compiles/loads). Confirm `GET /api/certifications` still returns 8 entries (matches what the dashboard will show as the count). Kill the dev server, confirm port 3000 free.

- [ ] **Step 8: Commit**

```bash
git add "app/admin/(dashboard)/page.tsx"
git commit -m "Add Certifications tab to admin dashboard"
```

---

### Task 6: Homepage — data-driven certification frames

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `GET /api/certifications`

- [ ] **Step 1: Add fetched state**

Alongside the existing `allProjects`/`experience`/`dataLoaded`/`dataError` state (added in the original admin CMS work), add:

```ts
const [certifications, setCertifications] = useState<CertificationRecord[]>([]);
```

Import `CertificationRecord` alongside the existing `ProjectRecord, ExperienceRecord` import from `@/lib/types`.

- [ ] **Step 2: Extend the existing data-fetch `useEffect`**

Find the existing `useEffect` that does `Promise.all([fetch("/api/projects")..., fetch("/api/experience")...])` and add a third fetch for certifications to the same `Promise.all`, setting `certifications` from its result the same way the other two are set. Keep the same `r.ok` check pattern already used for the other two fetches (added during the final-review fix — don't reintroduce the old bug of skipping it).

- [ ] **Step 3: Replace the 8 hardcoded frame blocks with one data-driven frame**

Find the "3D Picture Frame Certifications Gallery" section (search for `Certifications Gallery` or `Professional achievements and credentials`). It currently contains 8 nearly-identical `<motion.div>` blocks, each ~80 lines, each hardcoding one image path, alt text, label, and a unique color/rotation style. Replace the entire grid of 8 hardcoded blocks with:

```tsx
{/* Picture Frames Gallery */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
  {certifications.map((cert, index) => {
    const frameStyles = [
      {
        outer: "from-amber-600 via-amber-700 to-amber-900",
        inner: "from-amber-900 to-amber-950",
      },
      {
        outer: "from-slate-300 via-slate-400 to-slate-600",
        inner: "from-slate-700 to-slate-900",
      },
      {
        outer: "from-orange-600 via-orange-700 to-orange-900",
        inner: "from-orange-900 to-orange-950",
      },
      {
        outer: "from-gray-700 via-gray-800 to-black",
        inner: "from-black to-gray-900",
      },
    ];
    const style = frameStyles[index % frameStyles.length];

    return (
      <motion.div
        key={cert.id}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
        viewport={{ once: true }}
        className="group"
      >
        <div className="relative w-full aspect-[4/3] cursor-pointer transition-transform duration-500 group-hover:scale-105">
          <div className={`absolute inset-0 bg-gradient-to-br ${style.outer} rounded-sm`}>
            <div className={`absolute inset-4 bg-gradient-to-br ${style.inner} rounded-sm shadow-lg`}>
              <div className="absolute inset-2 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
                <div
                  className="absolute inset-4 bg-white shadow-2xl shadow-black/40 overflow-hidden"
                  onClick={() =>
                    cert.image &&
                    setSelectedCertification({ src: cert.image, alt: cert.title })
                  }
                >
                  {cert.image && (
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-contain p-3"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-4 text-gray-300 font-medium">{cert.title}</p>
      </motion.div>
    );
  })}
</div>
```

This reuses the EXISTING `selectedCertification` state and lightbox (from the certification-lightbox feature already in this file — do not duplicate or modify that lightbox, only reuse its `setSelectedCertification` setter, which already expects `{ src: string; alt: string }`).

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit` — confirm no new errors beyond the known baseline (the baseline count may shift since you're removing ~600 lines of old frame JSX and adding ~60 new lines — confirm any remaining errors are the same pre-existing ones in `app/page.tsx`, `Lanyard.tsx`, `ScrollStack.tsx`, not new ones).

Start the dev server, confirm port hygiene, curl the homepage (200) and `/api/certifications` (8 entries). Kill the dev server, confirm port 3000 free.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "Replace hardcoded certification frames with data-driven rendering"
```

---

### Task 7: Final verification

**Files:** none (verification only)

- [ ] **Step 1:** Run `npm test` — confirm 18/18 still pass.
- [ ] **Step 2:** Run `npx tsc --noEmit` — confirm only the known pre-existing baseline errors remain (in `app/page.tsx`, `Lanyard.tsx`, `ScrollStack.tsx`), zero new ones.
- [ ] **Step 3:** Full curl regression: log in, create a test certification, confirm it appears in `GET /api/certifications`, edit it, delete it, confirm the count returns to 8. Confirm unauthenticated requests to all 3 admin certification endpoints get 401.
- [ ] **Step 4:** Confirm port 3000 is free at the end (real pasted output).
- [ ] **Step 5:** If anything needed fixing, commit it now with a message describing what was fixed.

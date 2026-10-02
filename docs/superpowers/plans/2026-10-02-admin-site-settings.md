# Admin-Editable Hero Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three hero-section stat badges (years of experience, projects completed, clients satisfied) editable via `/admin`, replacing the hardcoded `"6+"`, `"100+"`, `"40+"` strings in `app/page.tsx` with values fetched from Supabase.

**Architecture:** Unlike projects/experience/certifications (lists with add/edit/delete), this is a single-row settings object — one row, update-only, no create/delete UI needed. A `site_settings` table holds exactly one row. A public `GET /api/settings` reads it; an admin `PUT /api/admin/settings` updates it (upsert, since there's always exactly one row). The admin UI is a single settings form, not a list.

**Tech Stack:** Same as the existing admin CMS.

## Global Constraints

- Follow the exact same code conventions already established: `lib/types.ts`/`lib/validation.ts` patterns (`Result<T>` with `ok` discriminant, `toNullableString` helper), `lib/supabaseAdmin.ts`, `requireAdmin()` from `lib/adminAuth.ts` (must be the first line of the admin PUT handler), the existing admin dashboard's dark theme (`#0a0a0f` background, `#FF6B35` accent, `border-white/10`).
- The three values are stored and displayed as free-text strings (e.g. `"6+"`, `"100+"`, `"40+"`) — not numbers — since the "+" suffix is part of the displayed value and the owner may want to type something like "6+ years" or similar in the future. Keep them as plain text inputs.
- TypeScript strict mode; `@/*` alias; Next.js 15 async route `params` (not needed here since there's no `[id]` route — this feature has exactly one row, addressed without an ID in the URL).
- Evidence integrity: paste real, literal command output in every report, never narrated. Port 3000 hygiene: check before/after every dev server use, with real pasted `netstat` output.

## File Structure

- `supabase/schema.sql` (modified) — add `site_settings` table + RLS + seed row
- `lib/types.ts` (modified) — add `SiteSettings`
- `lib/validation.ts` (modified) — add `sanitizeSiteSettingsInput`
- `app/api/settings/route.ts` (new) — public `GET`
- `app/api/admin/settings/route.ts` (new) — `PUT` (upsert)
- `app/admin/(dashboard)/settings/page.tsx` (new) — the settings form page
- `app/admin/(dashboard)/page.tsx` (modified) — add a link/button to the settings page (not a 4th tab with a list — just a nav link, since there's nothing to list)
- `app/page.tsx` (modified) — fetch settings, replace the 3 hardcoded badge values

---

### Task 1: Database + types + validation + API routes

**Files:**
- Modify: `supabase/schema.sql`
- Modify: `lib/types.ts`
- Modify: `lib/validation.ts`
- Create: `app/api/settings/route.ts`
- Create: `app/api/admin/settings/route.ts`

**Interfaces:**
- Produces: `SiteSettings { id: string; years_experience: string; projects_completed: string; clients_satisfied: string }`, `sanitizeSiteSettingsInput`, `GET /api/settings` → `{ settings: SiteSettings }`, `PUT /api/admin/settings` → `{ settings: SiteSettings }`

- [ ] **Step 1: Add the table to `supabase/schema.sql`** (and apply the same SQL directly to the live database — this table does not exist yet)

```sql
create table if not exists public.site_settings (
  id text primary key,
  years_experience text not null default '',
  projects_completed text not null default '',
  clients_satisfied text not null default ''
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read access" on public.site_settings;
create policy "Public read access" on public.site_settings for select using (true);

insert into public.site_settings (id, years_experience, projects_completed, clients_satisfied)
values ('default', '6+', '100+', '40+')
on conflict (id) do nothing;
```

Add this block to `supabase/schema.sql` alongside the other tables, matching the file's existing style (its own `alter table ... enable row level security` and policy lines, grouped with the others).

- [ ] **Step 2: Add the type to `lib/types.ts`**

```ts
export interface SiteSettings {
  id: string;
  years_experience: string;
  projects_completed: string;
  clients_satisfied: string;
}
```

- [ ] **Step 3: Add the sanitizer to `lib/validation.ts`**

Read the file first to match conventions exactly. Add:

```ts
export type SiteSettingsInput = Omit<SiteSettings, "id">;

export function sanitizeSiteSettingsInput(body: unknown): Result<SiteSettingsInput> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const yearsExperience = typeof b.years_experience === "string" ? b.years_experience.trim() : "";
  const projectsCompleted = typeof b.projects_completed === "string" ? b.projects_completed.trim() : "";
  const clientsSatisfied = typeof b.clients_satisfied === "string" ? b.clients_satisfied.trim() : "";

  return {
    ok: true,
    data: {
      years_experience: yearsExperience,
      projects_completed: projectsCompleted,
      clients_satisfied: clientsSatisfied,
    },
  };
}
```

Add `SiteSettings` to the existing type-only import at the top of the file.

- [ ] **Step 4: Create the public GET route**

```ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}
```

- [ ] **Step 5: Create the admin PUT route**

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sanitizeSiteSettingsInput } from "@/lib/validation";

export async function PUT(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const body = await req.json().catch(() => null);
  const result = sanitizeSiteSettingsInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ id: "default", ...result.data }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}
```

- [ ] **Step 6: Verify**

Run `npx tsc --noEmit` and `npm test` — confirm no new errors, 18/18 tests still pass.

Start the dev server, confirm port hygiene (real pasted output). Curl `GET /api/settings` — expect the seeded `{"settings":{"id":"default","years_experience":"6+","projects_completed":"100+","clients_satisfied":"40+"}}`. Log in, `PUT /api/admin/settings` with `{"years_experience":"7+","projects_completed":"100+","clients_satisfied":"40+"}`, confirm 200 with updated value, confirm `GET /api/settings` reflects it, then `PUT` it back to the original `"6+"` so the live site isn't left with test data. Confirm unauthenticated `PUT` returns 401. Kill the dev server, confirm port 3000 free.

- [ ] **Step 7: Commit**

```bash
git add supabase/schema.sql lib/types.ts lib/validation.ts app/api/settings app/api/admin/settings
git commit -m "Add site_settings table and public/admin settings API routes"
```

---

### Task 2: Admin settings page

**Files:**
- Create: `app/admin/(dashboard)/settings/page.tsx`
- Modify: `app/admin/(dashboard)/page.tsx`

**Interfaces:**
- Consumes: `GET /api/settings`, `PUT /api/admin/settings`

- [ ] **Step 1: Create the settings page**

```tsx
"use client";
import { useEffect, useState, type FormEvent } from "react";
import type { SiteSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [yearsExperience, setYearsExperience] = useState("");
  const [projectsCompleted, setProjectsCompleted] = useState("");
  const [clientsSatisfied, setClientsSatisfied] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        setSettings(json.settings);
        setYearsExperience(json.settings.years_experience);
        setProjectsCompleted(json.settings.projects_completed);
        setClientsSatisfied(json.settings.clients_satisfied);
      });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          years_experience: yearsExperience,
          projects_completed: projectsCompleted,
          clients_satisfied: clientsSatisfied,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to save settings");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Homepage Stats</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
        {error && (
          <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-sm">
            Saved!
          </p>
        )}

        <div>
          <label className="block text-gray-300 text-sm mb-1">Years of Experience</label>
          <input
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. 6+"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Projects Completed</label>
          <input
            value={projectsCompleted}
            onChange={(e) => setProjectsCompleted(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. 100+"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Clients Satisfied</label>
          <input
            value={clientsSatisfied}
            onChange={(e) => setClientsSatisfied(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
            placeholder="e.g. 40+"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-[#FF6B35] text-white font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Add a link to it from the dashboard**

Read the current `app/admin/(dashboard)/page.tsx` in full. Add a link near the top of the page (outside the tab content, visible regardless of which tab is active — e.g. right after the tab buttons row, or in the header area), following the existing visual style:

```tsx
<Link
  href="/admin/settings"
  className="inline-block mb-4 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20"
>
  Edit Homepage Stats
</Link>
```

Place it in a sensible spot relative to the existing tab buttons (e.g. on its own line above or below them) — use your judgment on exact placement, the goal is just that it's visible and doesn't disrupt the existing tab UI.

- [ ] **Step 3: Verify**

Run `npx tsc --noEmit` — confirm no new errors. Start the dev server, confirm port hygiene, log in, curl `/admin/settings` with the cookie (expect 200), curl `/admin` (expect 200, unaffected). Kill the dev server, confirm port 3000 free.

- [ ] **Step 4: Commit**

```bash
git add "app/admin/(dashboard)/settings/page.tsx" "app/admin/(dashboard)/page.tsx"
git commit -m "Add admin settings page for homepage hero stats"
```

---

### Task 3: Homepage — use fetched settings

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `GET /api/settings`

- [ ] **Step 1: Add fetched state**

Alongside the existing `allProjects`/`experience`/`certifications` state, add `const [settings, setSettings] = useState<SiteSettings | null>(null);`. Import `SiteSettings` alongside the existing type imports from `@/lib/types`.

- [ ] **Step 2: Extend the existing fetch `useEffect`**

Add a fourth fetch to the same `Promise.all` (`/api/settings`), with the same `r.ok` check pattern as the other three, setting `settings` from the result (`settingsRes.settings`).

- [ ] **Step 3: Replace the 3 hardcoded badge values**

Locate the three hardcoded stat values (search for `>6+<`, `100+`, and the "40+" inside the "Clients Satisfied" badge — there is a SEPARATE, unrelated `"40+ Clients"` badge inside the experience section that must NOT be changed, that one is about per-item freelance client count tied to one specific experience entry, not this site-wide stat; only change the hero section's three badges near the top of the component, inside the motion.div blocks commented "Experience Badge", "Projects Badge", and "Clients Badge").

Replace each hardcoded string with a value from `settings`, falling back to the original hardcoded default if `settings` is still null (to avoid a flash of empty content before the fetch resolves) — e.g.:
- `6+` → `{settings?.years_experience ?? "6+"}`
- `100+` → `{settings?.projects_completed ?? "100+"}`
- `40+` → `{settings?.clients_satisfied ?? "40+"}`

- [ ] **Step 4: Verify**

Run `npx tsc --noEmit` — confirm no new errors beyond the known baseline. Start the dev server, confirm port hygiene, curl the homepage (200) and `/api/settings` (200, correct seeded values). Kill the dev server, confirm port 3000 free.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "Fetch hero stat badges from site_settings instead of hardcoding them"
```

---

### Task 4: Final verification

- [ ] Run `npm test` (18/18) and `npx tsc --noEmit` (known baseline only).
- [ ] Full regression: unauthenticated `PUT /api/admin/settings` → 401; authenticated update → reflected in `GET /api/settings`; homepage and `/admin/settings` both load (200).
- [ ] Confirm port 3000 free at the end.

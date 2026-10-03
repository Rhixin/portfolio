# Scroll-Synced Experience Detail Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** As the user scrolls through the homepage's platformer-style Experience section, show a panel that slides in from the right with "what I did" + an optional reference contact for whichever experience is currently active, holds while scrolling continues, then slides back out before the next experience's panel takes over.

**Architecture:** 5 new nullable columns on the existing `experience` table (description + 4 reference fields), surfaced through the existing CMS pattern (types/validation/admin form). The existing scroll section (knight sprite walking across a tiled background, driven by one hand-rolled scroll handler using direct `getElementById(...).style...` writes, NOT React state, for performance) is extended — not replaced — to also compute which experience is "active" and how far through its slide-in/pause/slide-out cycle the scroll position is, writing that onto a new panel element the same way the existing handler already writes to the background/exp-bar/sprite elements.

**Tech Stack:** Next.js 15, React 19, Supabase — same as the rest of this codebase's admin CMS.

## Global Constraints

- Follow existing conventions exactly: `lib/types.ts`/`lib/validation.ts`'s `Result<T>` with `ok` discriminant and `toNullableString` helper; `requireAdmin()` as the first line of admin route handlers; the dark theme (`#0a0a0f` background, `#FF6B35` accent).
- `app/page.tsx` is large (3,600+ lines) and has been edited many times this session — **every task touching it must re-locate its target code fresh via Grep/Read before editing, never trust line numbers written in this plan**, which were accurate only at the time this plan was written.
- The existing Experience section's scroll handler uses **direct DOM writes** (`document.getElementById(...).style...`), not React state, for anything that updates on every scroll event — this is deliberate (avoids re-rendering on every scroll tick) and must be followed for the new panel's continuous slide animation too. React state is only appropriate for the (infrequent) content swap between experiences.
- No automated tests exist for scroll-driven animation in this codebase (consistent throughout) — verify the data-layer pieces (schema/API/form) via `npx tsc --noEmit`, `npm test` (18 existing tests must still pass), and curl; the animation itself needs a real browser scroll-through, which the final task explicitly hands back to the user to confirm visually (an agent cannot verify a scroll animation's visual correctness).
- Evidence integrity: every task report must paste real, literal command output — never a narrated summary.
- Port hygiene: every task using the dev server must check port 3000 is free before starting it and after killing it, with real pasted `netstat` output both times.

## File Structure

- `supabase/schema.sql` (modified) — 5 new columns on `experience`
- `lib/types.ts` (modified) — `ExperienceRecord` gains 5 fields
- `lib/validation.ts` (modified) — `sanitizeExperienceInput` gains 5 fields
- `components/admin/ExperienceForm.tsx` (modified) — description textarea + reference fields
- `components/ExperienceDetailPanel.tsx` (new) — the sliding panel, pure presentational
- `app/page.tsx` (modified) — Game Container repositioned to the left, panel mounted on the right, scroll handler extended to drive the panel

---

### Task 1: Database + types + validation

**Files:**
- Modify: `supabase/schema.sql`
- Modify: `lib/types.ts`
- Modify: `lib/validation.ts`

**Interfaces:**
- Produces: `ExperienceRecord` gains `description: string | null`, `reference_name: string | null`, `reference_title: string | null`, `reference_contact: string | null`, `reference_link: string | null`. `sanitizeExperienceInput` accepts and sanitizes all 5 as optional strings.

- [ ] **Step 1: Add the columns to `supabase/schema.sql`**

Find the existing `experience` table definition and add these 5 lines to its column list (matching the file's existing style — these are additional nullable `text` columns, same as `logo`/`additional`/`year`/`duration`/`link`):

```sql
  description text,
  reference_name text,
  reference_title text,
  reference_contact text,
  reference_link text,
```

Also add an idempotent `alter table` block below the `create table` statements (matching the existing pattern already used for the `link` column, which has a comment explaining it was added after initial creation):

```sql
-- Added for the scroll-synced experience detail panel feature.
alter table public.experience add column if not exists description text;
alter table public.experience add column if not exists reference_name text;
alter table public.experience add column if not exists reference_title text;
alter table public.experience add column if not exists reference_contact text;
alter table public.experience add column if not exists reference_link text;
```

- [ ] **Step 2: Apply the schema change to the live database**

Run the 5 `alter table ... add column if not exists ...` statements from Step 1 directly against the live Supabase database (same method used throughout this project: a throwaway Node script with the `pg` package and `DIRECT_URL` from `.env.local`, or any equivalent direct-Postgres-connection method). Verify by querying `information_schema.columns` for `public.experience` and confirming all 5 new columns now exist.

- [ ] **Step 3: Extend `ExperienceRecord` in `lib/types.ts`**

Add these 5 fields to the existing `ExperienceRecord` interface (alongside `link: string | null;`):

```ts
  description: string | null;
  reference_name: string | null;
  reference_title: string | null;
  reference_contact: string | null;
  reference_link: string | null;
```

- [ ] **Step 4: Extend `sanitizeExperienceInput` in `lib/validation.ts`**

Read the function's current body first. Add these 5 lines to the returned `data` object, using the existing `toNullableString` helper (same pattern as `link`):

```ts
      description: toNullableString(b.description),
      reference_name: toNullableString(b.reference_name),
      reference_title: toNullableString(b.reference_title),
      reference_contact: toNullableString(b.reference_contact),
      reference_link: toNullableString(b.reference_link),
```

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` and `npm test` — paste full literal output, confirm no new errors and all 18 existing tests still pass.

Start the dev server (real pasted port-check before/after). Log in, `PUT /api/admin/experience/<any-existing-id>` with a body including `"description":"Test description"` and the 4 reference fields, confirm 200 with those fields populated in the response, confirm `GET /api/experience` reflects it, then PUT the same entry back to `description: null` and the reference fields `null` (or omit them, since `toNullableString` treats a missing/empty field as `null`) so you don't leave test data on a real experience entry. Kill the dev server, confirm port 3000 free.

- [ ] **Step 6: Commit**

```bash
git add supabase/schema.sql lib/types.ts lib/validation.ts
git commit -m "Add description and reference fields to experience records"
```

---

### Task 2: Admin form fields

**Files:**
- Modify: `components/admin/ExperienceForm.tsx`

**Interfaces:**
- Consumes: the 5 new `ExperienceRecord`/payload fields from Task 1.

- [ ] **Step 1: Read the current `ExperienceForm.tsx` in full**

Note its exact state-declaration pattern, payload-construction pattern, and JSX field pattern (label + input, following `year`/`duration`) so the new fields match exactly.

- [ ] **Step 2: Add state for the 5 new fields**

Alongside the existing `useState` calls (e.g. `const [year, setYear] = useState(initial?.year ?? "");`), add:

```ts
  const [description, setDescription] = useState(initial?.description ?? "");
  const [referenceName, setReferenceName] = useState(initial?.reference_name ?? "");
  const [referenceTitle, setReferenceTitle] = useState(initial?.reference_title ?? "");
  const [referenceContact, setReferenceContact] = useState(initial?.reference_contact ?? "");
  const [referenceLink, setReferenceLink] = useState(initial?.reference_link ?? "");
```

- [ ] **Step 3: Add the 5 fields to the submit payload**

In the `payload` object sent to the API, add:

```ts
      description,
      reference_name: referenceName,
      reference_title: referenceTitle,
      reference_contact: referenceContact,
      reference_link: referenceLink,
```

- [ ] **Step 4: Add the JSX fields**

After the existing `duration` field and before the `logo`/`ImageUploader` field, add:

```tsx
      <div>
        <label className="block text-gray-300 text-sm mb-1">
          Description (what you did here)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
        />
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-gray-300 text-sm font-semibold mb-3">Reference (optional)</p>
        <div className="flex flex-col gap-3">
          <input
            value={referenceName}
            onChange={(e) => setReferenceName(e.target.value)}
            placeholder="Name"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            value={referenceTitle}
            onChange={(e) => setReferenceTitle(e.target.value)}
            placeholder="Title / Role"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            value={referenceContact}
            onChange={(e) => setReferenceContact(e.target.value)}
            placeholder="Contact (email or phone)"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
          <input
            value={referenceLink}
            onChange={(e) => setReferenceLink(e.target.value)}
            placeholder="LinkedIn or other link"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          />
        </div>
      </div>
```

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` — paste full literal output, confirm no new errors.

Start the dev server (port-check before/after, real output). Log in via browser-equivalent curl login, then exercise the form's underlying API call directly (same pattern as prior admin-form tasks in this codebase: curl `PUT` with all 5 new fields populated against a real experience id, confirm the response and a follow-up `GET /api/experience` show them, then revert). Kill the dev server, confirm port 3000 free.

- [ ] **Step 6: Commit**

```bash
git add components/admin/ExperienceForm.tsx
git commit -m "Add description and reference fields to the experience admin form"
```

---

### Task 3: Panel component + layout repositioning (static)

**Files:**
- Create: `components/ExperienceDetailPanel.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `<ExperienceDetailPanel experience={ExperienceRecord} />` — pure presentational, renders a `<div id="experience-detail-panel">` whose initial inline `transform`/`opacity` represent the "idle/off-screen" state. Task 4 will drive these via direct DOM writes from the scroll handler; this task does NOT add any scroll logic, only the static structure.
- Consumes: `ExperienceRecord` from `lib/types.ts` (Task 1).

This task is deliberately scoped to layout only — get the panel rendering in the right place with the right idle appearance before Task 4 adds the scroll-driven behavior, so layout mistakes and scroll-logic mistakes don't get tangled into one hard-to-debug diff.

- [ ] **Step 1: Create `components/ExperienceDetailPanel.tsx`**

```tsx
"use client";
import type { ExperienceRecord } from "@/lib/types";

export default function ExperienceDetailPanel({
  experience,
}: {
  experience: ExperienceRecord;
}) {
  const hasReference = Boolean(
    experience.reference_name ||
      experience.reference_title ||
      experience.reference_contact ||
      experience.reference_link
  );

  return (
    <div
      id="experience-detail-panel"
      className="absolute top-1/2 right-8 lg:right-16 w-[85%] max-w-sm bg-[#0d0d14]/95 border border-[#FF6B35]/30 rounded-2xl p-6 backdrop-blur-sm shadow-2xl hidden lg:block"
      style={{
        transform: "translate(100%, -50%)",
        opacity: 0,
      }}
    >
      <h4 className="text-[#FF8C5A] text-sm font-bold uppercase tracking-wider mb-2">
        {experience.name}
      </h4>
      {experience.description ? (
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {experience.description}
        </p>
      ) : (
        <p className="text-gray-500 text-sm italic mb-4">
          {experience.additional} · {experience.year}
        </p>
      )}
      {hasReference && (
        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
            Reference
          </p>
          {experience.reference_name && (
            <p className="text-white text-sm font-semibold">
              {experience.reference_name}
            </p>
          )}
          {experience.reference_title && (
            <p className="text-gray-400 text-xs">{experience.reference_title}</p>
          )}
          {experience.reference_contact && (
            <p className="text-gray-400 text-xs mt-1">
              {experience.reference_contact}
            </p>
          )}
          {experience.reference_link && (
            <a
              href={experience.reference_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 text-xs hover:underline mt-1 inline-block"
            >
              View Profile
            </a>
          )}
        </div>
      )}
    </div>
  );
}
```

Note: `hidden lg:block` — the panel is desktop-only. On smaller screens there isn't room for a side-by-side scene + panel layout; the existing company-info-above-shop text (name/role/year/duration/type, already rendered elsewhere in this section) remains visible at all screen sizes regardless.

- [ ] **Step 2: Add `activeExperienceIndex` state and a stale-closure-safe ref to `experience`**

In `app/page.tsx`, find the `Home` component's existing `useState` declarations (e.g. near `const [currentSection, setCurrentSection] = useState(0);`) and add:

```ts
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);
```

Also add a ref that always holds the current `experience` array, and an effect that keeps it in sync. This is necessary because the Experience section's scroll handler (extended in Task 4) is created once inside a `ref` callback when the section mounts — NOT inside a `useEffect` with `experience` in its dependency array — so it is created once and never recreated. If that handler read `experience` directly, it would permanently see whatever `experience` was at the moment the section first mounted (typically `[]`, since the data hasn't finished fetching yet), not any later value after the fetch resolves. A ref kept in sync via its own small effect sidesteps this: the ref object itself never changes identity, so the handler's closure always sees its latest `.current` value.

```ts
  const experienceRef = useRef<ExperienceRecord[]>([]);
  useEffect(() => {
    experienceRef.current = experience;
  }, [experience]);
```

Add `ExperienceDetailPanel` to the imports at the top of the file:

```ts
import ExperienceDetailPanel from "@/components/ExperienceDetailPanel";
```

- [ ] **Step 3: Reposition the Game Container to the left half**

Locate the comment `{/* Game Container */}` inside the Experience section (search fresh — do not trust any assumed line number). Its current `className` is:

```
"absolute inset-0 flex items-center justify-center overflow-hidden"
```

Change it to:

```
"absolute inset-y-0 left-0 w-full lg:w-1/2 flex items-center justify-center overflow-hidden"
```

This narrows the existing knight/background/platform scene to the left half of the viewport on desktop (full width below the `lg` breakpoint, matching the panel's own `hidden lg:block` — mobile is unaffected by this feature). Do not change anything else about the Game Container's contents — this is a container-sizing change only, the elaborate tile/background rendering inside it is untouched and its internal percentage-based positioning is relative to its own width, not the viewport, so narrowing the container does not require touching that code.

- [ ] **Step 4: Mount the panel**

Still inside the section's `<div className="sticky top-0 h-screen w-full overflow-hidden">` sticky container, as a sibling AFTER the `{/* Game Container */}` `motion.div` closes (find its closing tag fresh), add:

```tsx
          {experience.length > 0 && (
            <ExperienceDetailPanel experience={experience[activeExperienceIndex]} />
          )}
```

- [ ] **Step 5: Verify**

Run `npx tsc --noEmit` — paste full literal output, confirm no new errors.

Start the dev server (port-check before/after, real output). Curl the homepage, confirm 200. This task has no interactive behavior to verify yet (the panel will render in its idle off-screen-right state, invisible due to `opacity: 0` — that's expected; Task 4 makes it move). Kill the dev server, confirm port 3000 free.

- [ ] **Step 6: Commit**

```bash
git add components/ExperienceDetailPanel.tsx app/page.tsx
git commit -m "Add experience detail panel component and reposition scene to the left"
```

---

### Task 4: Scroll-driven panel animation

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `activeExperienceIndex`/`setActiveExperienceIndex`, `experienceRef` (Task 3), `#experience-detail-panel` DOM id (Task 3).

- [ ] **Step 1: Read the current Experience section's scroll handler in full**

It's the function assigned to `handleScroll` inside the `section`'s `ref` callback (search fresh for `Experience Section - Platformer Style`, then the `handleScroll` function within it). Confirm its current end (the closing `};` right before `window.addEventListener("scroll", handleScroll);`).

- [ ] **Step 2: Add a ref to track the active index without stale closures**

`handleScroll` is defined once when the section mounts (inside the `ref` callback, not re-created on re-render), so it cannot read a fresh value of the `activeExperienceIndex` React state directly without going stale — same reasoning as the `experienceRef` added in Task 3. Add a matching ref for the index, alongside the `activeExperienceIndex` state and `experienceRef` added in Task 3:

```ts
  const activeExperienceIndexRef = useRef(0);
```

(`useRef` is already imported at the top of this file from `"react"` — confirm this before adding, it should already be there alongside `useState`/`useEffect`.)

- [ ] **Step 3: Add the panel-driving logic to the end of `handleScroll`**

Add this block immediately before `handleScroll`'s closing `};` (after the existing sprite-switching logic, as the last thing the function does):

```ts
            // Update experience detail panel (slide in / pause / slide out)
            const panelElement = document.getElementById(
              "experience-detail-panel"
            );
            const currentExperience = experienceRef.current;
            if (panelElement && currentExperience.length > 0) {
              const segmentSize = 1 / currentExperience.length;
              const rawIndex = Math.floor(scrollProgress / segmentSize);
              const newActiveIndex = Math.min(
                rawIndex,
                currentExperience.length - 1
              );
              const localProgress = Math.min(
                1,
                Math.max(
                  0,
                  (scrollProgress - newActiveIndex * segmentSize) / segmentSize
                )
              );

              let translateXPercent = 100;
              let opacity = 0;
              if (localProgress <= 0.2) {
                const phase = localProgress / 0.2;
                translateXPercent = 100 - phase * 100;
                opacity = phase;
              } else if (localProgress <= 0.8) {
                translateXPercent = 0;
                opacity = 1;
              } else {
                const phase = (localProgress - 0.8) / 0.2;
                translateXPercent = phase * 100;
                opacity = 1 - phase;
              }

              panelElement.style.transform = `translate(${translateXPercent}%, -50%)`;
              panelElement.style.opacity = String(opacity);

              if (
                opacity === 0 &&
                newActiveIndex !== activeExperienceIndexRef.current
              ) {
                activeExperienceIndexRef.current = newActiveIndex;
                setActiveExperienceIndex(newActiveIndex);
              }
            }
```

This mirrors the existing handler's own style exactly (direct `getElementById(...).style...` writes, same `scrollProgress` variable already computed earlier in the same function). The content-swap (`setActiveExperienceIndex`) only fires at the moment `opacity` is exactly `0` — i.e. the panel is fully off-screen — so React re-rendering `ExperienceDetailPanel` with new content is never visible mid-animation. `segmentSize`/`rawIndex`/`localProgress` implement the spec's N-equal-segments + 3-phase (0–0.2 slide in, 0.2–0.8 pause, 0.8–1.0 slide out) mapping exactly.

- [ ] **Step 4: Verify compiles**

Run `npx tsc --noEmit` — paste full literal output, confirm no new errors beyond the known baseline.

- [ ] **Step 5: Manual browser verification (cannot be curl-tested — flag this clearly in your report)**

Start the dev server (port-check before/after, real output). This step genuinely cannot be verified via curl — a scroll animation's visual correctness requires a real browser. Do what you can: confirm the homepage loads (200) and there's no console/runtime error by checking the dev server's terminal log for errors after the page has been requested. In your report, explicitly state that full visual confirmation (scrolling through the Experience section and watching each panel slide in, pause, and slide out in sync with each experience) has NOT been done and needs a human to check in an actual browser — do not claim this works visually, only that it compiles and the page loads without a server-side error.

Kill the dev server, confirm port 3000 free.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "Drive experience detail panel slide-in/pause/slide-out from scroll position"
```

---

### Task 5: Final verification

**Files:** none (verification only)

- [ ] **Step 1:** Run `npm test` (18/18) and `npx tsc --noEmit` (known baseline only, no new errors).
- [ ] **Step 2:** Full curl regression on the data layer: unauthenticated `PUT /api/admin/experience/<id>` → 401; authenticated update with all 5 new fields → reflected in `GET /api/experience`; homepage and `/admin` both return 200.
- [ ] **Step 3:** Confirm port 3000 free at the end (real pasted output).
- [ ] **Step 4:** Report back to the user explicitly: the data layer (schema, API, admin form) is verified; the scroll animation itself (panel sliding in/pausing/sliding out in sync with each experience, correct on both desktop-width and the `hidden lg:block` mobile fallback) has only been confirmed to compile and load without a server error — it has NOT been visually confirmed in a real browser, and needs the user (or a browser-driving tool) to scroll through the live Experience section and confirm the animation actually looks right before this is considered done.

# Scroll-Synced Experience Detail Panel — Design

## Problem

The homepage's "Experience" section is a scroll-driven platformer-style animation (knight sprite walks across a tiled background as the user scrolls through a 700vh section, with one "shop" tile per experience entry). It currently shows only a logo, name, role, year, duration, type, and link per entry — there's no room to show what the person actually did at that company, or anyone who can vouch for the work.

The owner wants, for each experience entry as its tile becomes active during scroll: a panel that slides in from the right showing what they did there (and optionally who can be contacted as a reference), stays visible while the user keeps scrolling, then slides back out before the next entry's panel takes over.

## Scope

- Add description + reference fields to experience entries (editable via `/admin`, matching the existing projects/experience/certifications CMS pattern already in this codebase).
- Add the scroll-synced sliding panel to the public homepage's experience section.
- Reposition the existing knight/shop scene to the left half of the viewport to make room for the panel on the right.

Out of scope: changing the existing scroll-distance (700vh), level-up mechanic, or background/platform tileset — those are unchanged. No changes to projects or certifications.

## Data Model

5 new nullable `text` columns on the existing `experience` table:

| column | notes |
|---|---|
| `description` | the "what I did" content shown in the panel |
| `reference_name` | optional |
| `reference_title` | optional |
| `reference_contact` | optional, free text (email or phone) |
| `reference_link` | optional, URL (LinkedIn or other) |

All optional, consistent with every other field already on this table (only `name` is required). `ExperienceRecord` (`lib/types.ts`) and `sanitizeExperienceInput` (`lib/validation.ts`) extend to include these 5 fields using the existing `toNullableString` pattern — no new validation logic needed.

## Admin Form

`components/admin/ExperienceForm.tsx` gains:
- A `description` `<textarea>`, styled like the existing `description` textarea in `ProjectForm`.
- Four always-visible (not collapsible), optional text inputs grouped under a "Reference (optional)" label: Name, Title/Role, Contact, Link.

## Scroll Mechanics

The experience section's existing scroll handler already computes one continuous `scrollProgress` (0→1) across the full 700vh section (driving the background `translateX`, the level-up text, and the knight sprite's run/idle state). This design adds a derived calculation in that same handler — not a second, separate scroll listener:

1. Divide `scrollProgress`'s 0→1 range into N equal segments, where N = `experience.length`.
2. For the segment the user is currently in, compute `localProgress` (0→1) = how far through that segment they are.
3. Two different update strategies for two different kinds of change, matching the existing handler's own approach (which already uses direct `getElementById(...).style...` writes for the background/level-bar rather than React state, specifically to avoid a re-render on every scroll event):
   - **`activeExperienceIndex`** (which experience's content to show): held in **React state**. This only changes N times across the whole scroll range (once per segment boundary — e.g. 7 times for 7 entries), so a re-render here is cheap and the simplest way to correctly swap which experience's description/reference text is displayed.
   - **`localProgress`-driven `translateX`/`opacity`** (the continuous slide animation): applied via **direct DOM style writes** (`getElementById("experience-detail-panel").style.transform = ...`), updated on every scroll event, exactly like the existing background-position/exp-bar logic — NOT React state, to avoid re-rendering the panel dozens of times per second during a scroll.

`localProgress` maps to the panel's animation in three phases:
- **0.00–0.20**: slide in — `translateX` from `100%` (off-screen right) to `0`, `opacity` `0→1`, both linearly interpolated from `localProgress / 0.20`.
- **0.20–0.80**: fully visible, static (`translateX: 0`, `opacity: 1`) — this is the "pause."
- **0.80–1.00**: slide out — `translateX` from `0` to `100%`, `opacity` `1→0`, interpolated from `(localProgress - 0.80) / 0.20`.

At the boundary between segments (`localProgress` wrapping from 1.0 of segment N back to 0.0 of segment N+1), the panel's content (which experience it's displaying) swaps to the new `activeExperienceIndex` — this happens at the moment the outgoing panel is fully off-screen (`opacity: 0` at the 1.00 mark), so the content swap itself is invisible to the user.

## Component Structure

A new component, `components/ExperienceDetailPanel.tsx`:

```ts
{
  experience: ExperienceRecord;
}
```

Pure presentational — takes only the active `experience` record (re-rendered via React state when `activeExperienceIndex` changes, per the Scroll Mechanics section above). Renders a wrapper `<div id="experience-detail-panel">` whose `transform`/`opacity` starts at the slide-out-right position (matching the handler's initial/idle state) and is subsequently driven by direct DOM writes from the scroll handler — the component itself does not compute or own the animated transform/opacity values. Inside that wrapper, renders the description paragraph and (conditionally, only for fields that are actually set) the reference block. Instantiated once in the experience section (not once per entry).

## Layout

The existing knight sprite + current shop tile scene, currently centered/full-width within the scrolling section, is repositioned to occupy roughly the left half of the viewport. The right half is reserved space for `ExperienceDetailPanel` at all times (not something that pushes other elements when it appears), avoiding layout shift when the panel slides in/out.

## Error Handling & Edge Cases

- An experience entry with no `description` set: the panel still goes through its full slide-in/pause/slide-out cycle, showing whatever fields ARE set (at minimum name/role/year, already rendered elsewhere in the scene) rather than an empty panel — avoids an inconsistent "some entries get a cool panel, others get nothing" feel.
- Reference block renders only the sub-fields that are actually filled in — no empty "Contact: —" rows for unset fields.
- `N = experience.length` — if there's only 1 experience entry, it occupies the full 0→1 range with its own slide-in/pause/slide-out (no division-by-zero: segment width is `1/N`, well-defined for any `N ≥ 1`).

## Testing

No automated tests for this feature (consistent with the rest of this codebase's scroll-driven animation code, which has no test coverage — this is DOM/scroll-position-driven UI, not practically unit-testable). Verified via: `npm run dev` + manual scroll-through in a real browser, confirming each experience's panel slides in, pauses, slides out, and the next one takes over, for all current experience entries. `npx tsc --noEmit` and `npm test` (existing 18 tests) must show no regressions.

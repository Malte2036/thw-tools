# THW Tools — Design System & Guardrails

The redesign goal: `modern, mobile-first, distinctly THW` — never generic "AI/modern SaaS" clutter.
Professionalism comes from **restraint**: fewer surfaces, fewer colors, purposeful motion.

Applies to all apps in this monorepo. Quiz UI (`apps/thw-tools/src/lib/quiz`) is the first rollout; other screens must adopt the tokens below as they are touched.

---

## 1. Principles

1. **Mobile-first.** One focused screen. Primary actions live in thumb-reach (sticky bottom bar). Respect `safe-area-inset` for notches/home indicator.
2. **THW identity, not "branding by sticker".** Ultramarine blue does the work; yellow is a rare accent (budget: max ~1 per screen). Green/red are semantic only (correct/wrong).
3. **Cards & elevation in layers.** Question and answers are soft cards on a blue-tinted background. Content scrolls _inside_ the frame; the action bar is pinned.
4. **Restraint.** One elevation level, one radius family, one icon family. If a screen "feels too cute", the fix is _subtraction_.
5. **Motion means something.** Shake = wrong, pop = correct, progress fill = navigation, cross-fade = state change. Nothing decorative. All disabled under `prefers-reduced-motion`.
6. **Function over decoration.** High contrast, real hierarchy, micro-labels, proper empty/disabled/loading states.

## 2. Color tokens

| Token                 | Hex                   | Role                                           |
| --------------------- | --------------------- | ---------------------------------------------- |
| `thw` (DEFAULT / 900) | `#120A8F`             | Primary brand — buttons, focus, fills          |
| `thw-50` / `thw-100`  | `#F1F3FD` / `#E2E7FA` | Tinted surfaces, track backgrounds             |
| `accent`              | `#EEE648`             | Rare highlight (progress marker, hero callout) |
| `correct`             | `#24CEA6`             | Semantic — right answer / success              |
| `wrong`               | `#DE5444`             | Semantic — wrong answer / error                |
| `gray`                | Tailwind gray family  | Text, borders, muted UI                        |

Full `thw` scale is the hue-consistent ultramarine ramp in `tailwind.config.cjs` and `web-components/src/colors.ts` (keep in sync).

Rules:

- `bg-thw` / `text-white` for primary actions. No black primary buttons.
- No gradients on cards, no gradient text, no decorative shadows.
- Only one elevation (see §4). Yellow only as accent, ~once per screen.

## 3. Typography

- System font stack (kept in `app.css`); `font-feature-settings` + `-webkit-font-smoothing: antialiased`.
- **Question text:** `text-2xl`/`text-3xl`, `font-bold`, **left-aligned**, `break-words`. Never centered-everything.
- **Micro-labels:** uppercase, `tracking-wide`, `text-xs`, gray — e.g. `FRAGE 12 / 150`.
- Numbers rendered with `tabular-nums` where they change (counters, timers).

## 4. Shape & elevation

- Surfaces: `rounded-2xl` cards. Small controls: `rounded-lg`. Not everything max-radius.
- One shadow token: `shadow-card` (soft, blue-tinted, low opacity) — applied to interactive cards only.
- Touch targets: `min-h-14` (56px) for answer rows, `min-h-12` for buttons, icon buttons `w-10 h-10`.

## 5. Motion

| Moment         | Effect                            | Duration |
| -------------- | --------------------------------- | -------- |
| Select answer  | border/fill tint + scale 1.05 → 1 | 150ms    |
| Progress       | width ease-out                    | 300ms    |
| Reveal correct | pop (scale 1 → 1.02)              | 200ms    |
| Reveal wrong   | shake (translateX ±4px)           | 300ms    |
| Button state   | cross-fade, icon slide            | 150ms    |

Gate: `@media (prefers-reduced-motion: reduce)` kills all animation/transition in `app.css`.

## 6. Icon language

- One open-source family per app (thw-tools uses Font Awesome **Free, solid**) — never mix filled/stroke styles mid-screen.
- Icons inside interactive elements inherit `currentColor`; use `w-4 h-4` inline glyphs.
- Every icon button needs `aria-label`.

## 7. Anti-vibecode guardrails (hard rules)

- **No**: emojis, gradient text/buttons, purple gradients, per-screen shadow/radius whims, secondary text centered for no reason.
- **No**: re-inventing state per page — reuse tokens and the shared `CheckboxAnswer`/`Answers` states.
- **No**: decorative motion. Motion must communicate a state or transition.
- Every new screen: verify at mobile viewport, check contrast (deep blue on white passes AAA/AA), then _cut_ anything that only decorates.

## 8. Layout conventions

- Quiz question page: sticky bottom action bar with `pb-safe`; header holds micro-label + progress; content scrolls above.
- List/start pages: hero header (icon + title + description + stat cards) + primary CTA in blue + number-badged rows.
- Bottom bars: `sticky bottom-0` with a white→transparent fade of `px-4 pt-4 pb-4`.

## 9. Verification

- `pnpm --filter thw-tools test`, `pnpm --filter thw-tools check` (svelte-check), `pnpm lint`.
- Manual pass at 390×844 (iPhone) before considering a screen done.

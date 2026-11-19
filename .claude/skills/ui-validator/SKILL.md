---
name: ui-validator
description: Validate frontend UI code against AppliBoard's theme colors in frontend/src/index.css, contrast rules, dark mode and the React practices in .claude/rules/react.md. Use before delivering any change to frontend components, pages or styles, or when asked to "validate", "check the UI", or "check theme colors".
---

# UI validator

Review frontend changes against the theme and report the results. This is a read-only review: use the Read and Grep tools only, run no shell commands, builds, lint or dev servers, and don't edit files unless the user asks for fixes.

**Scope:** the files changed in the current task. If none are named, ask which files or feature to check. Run the whole-codebase scan only when the user asks for it.

## 1. Load the source of truth

Read `frontend/src/index.css` first. The `@theme` block is the palette, so re-read it on every run in case tokens changed. At the time of writing:

| Token | Value | Tailwind classes |
| --- | --- | --- |
| `--color-brand-primary` | `#6366f1` (indigo-500) | `bg-/text-/border-/ring-brand-primary` |
| `--color-brand-primary-strong` | `#4f46e5` (indigo-600) | `*-brand-primary-strong`: filled buttons, small brand text on light backgrounds |
| `--color-brand-secondary` | `#38bdf8` (sky-400) | `*-brand-secondary` |
| `--color-brand-accent` | `#10b981` (emerald-500) | `*-brand-accent` |
| `--color-dark-background` | `#070a12` | `bg-dark-background`: page background in dark mode |
| `--color-dark-surface` | `#0d111d` | `dark:bg-dark-surface`: cards and panels in dark mode |
| `--chart-grid` | `#e4e4e7` / dark `#3f3f46` | Recharts `stroke="var(--chart-grid)"` |

The `@theme` block is `static`, so every token also exists as a CSS variable. In SVG and Recharts props use `var(--color-brand-*)`, never hex.

Dark mode is class-based (`@custom-variant dark (&:where(.dark, .dark *))`), so every surface, text and border color needs a `dark:` counterpart.

## 2. Contrast limits of the tokens (WCAG AA)

| Token | on white `#fff` | on `#070a12` | Allowed use |
| --- | --- | --- | --- |
| brand-primary | 4.47:1 | 4.43:1 | Fills, borders, focus rings, icons, large text (≥18px or ≥14px bold). **Not** normal-size body or label text: it is just under 4.5:1. |
| brand-secondary | 2.1:1 | 9.2:1 | Text only in dark mode. In light mode only for decoration and fills behind dark text. |
| brand-accent | 2.5:1 | 7.8:1 | Text only in dark mode. In light mode use a darker shade (`emerald-700`) for text. |
| white text on brand-primary | 4.47:1 | — | Large or bold text only. Filled buttons and `text-sm` labels use `bg-brand-primary-strong` (≈ 6.3:1). |
| brand-primary-strong | ≈ 6.3:1 | ≈ 3.1:1 | Light-mode text and fills. In dark mode use `brand-primary` or lighter for text. |

Recompute contrast if the token values in `index.css` changed.

## 3. Checks

Use Grep over the scoped files with these patterns:

| # | Check | Grep pattern | Rule |
| --- | --- | --- | --- |
| C1 | Hard-coded colors | `#[0-9a-fA-F]{3,8}\b` and `\[(#\|rgb\|hsl)` in `.tsx`/`.ts` | No raw hex or arbitrary color values. Use a token or a Tailwind palette class. Recharts `stroke`/`fill` count too: take colors from the tokens (`var(--color-brand-primary)`). |
| C2 | Off-brand hues | `(bg\|text\|border\|ring\|from\|to\|via\|fill\|stroke)-(purple\|violet\|fuchsia\|pink\|blue\|cyan\|teal\|lime)-\d+` | Brand hues are indigo, sky and emerald. Other hues need a semantic reason (status colors). |
| C3 | Raw brand shades | `-(indigo\|sky\|emerald)-(400\|500)\b` | Where a token exists for the same color, use `brand-*` instead of the raw palette class. Darker shades (`-600`/`-700` for light-mode text, `-300` for dark-mode text) are fine for contrast. |
| C4 | Low-contrast brand text | `text-brand-(secondary\|accent)` without a `dark:` prefix; `text-brand-primary` with `text-xs`/`text-sm` | Apply the table in §2. |
| C5 | Missing dark counterpart | `bg-white`, `bg-zinc-50`, `text-zinc-[6-9]00`, `border-zinc-200`, `border-black/` | Each needs a matching `dark:` class on the same element. |
| C6 | Repeated arbitrary surface | `dark:bg-\[#` | Use `dark:bg-dark-surface` for `#0d111d`. Any other repeated arbitrary value means a missing token: propose adding it to `@theme` instead of copying it. |
| C7 | Semantic colors | `red-\|rose-\|amber-\|yellow-\|green-` | Reserve red/rose for destructive and error states, amber/yellow for warnings, green/emerald for success. Always pair with text or an icon, never color alone. |
| C8 | Gradient titles | `bg-clip-text` | Only on prominent titles, with `forced-colors:bg-none forced-colors:text-[CanvasText]` and checked in both themes (see `frontend/AGENTS.md`). |
| C9 | Focus visibility | `focus:outline-none` | Must come with a visible `focus:ring-*` or `focus-visible:ring-*`. |

Then read the changed components themselves for the React checks in `.claude/rules/react.md`:

| # | Check |
| --- | --- |
| R1 | Components have one job and a reasonable size; there are no components defined inside other components. |
| R2 | Repeated or heavy stateful logic is in a custom hook. |
| R3 | Memoization is where it pays (list rows, chart data, props of `memo` children) and absent where it doesn't. |
| R4 | No derived state copied into `useState` or synced with `useEffect`; stable list keys. |

## 4. Report

For each check, report **Pass**, **Needs work** (with `file:line` and a concrete fix) or **Not checked** (with the reason). Group findings by severity:

1. **Blocking:** contrast failures on text, missing dark mode, color as the only signal.
2. **Theme drift:** hard-coded or off-brand colors, raw shades where a token exists, repeated arbitrary values.
3. **React quality:** R1–R4.

End by saying what this review could not verify. It reads source only: real rendered contrast, hover states and both themes in a browser were **not** checked unless the app was opened, which requires the user's approval.

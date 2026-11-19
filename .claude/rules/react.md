---
paths:
  - "frontend/src/**/*.ts"
  - "frontend/src/**/*.tsx"
---

# React best practices (React 19, no React Compiler)

Keep things in proportion. The goal is code that is easy to read and doesn't do wasted work, not the most components or the most hooks.

## Components: modular, but not fragmented

- A page composes sections, handles routing, and coordinates feature state. Move a section into its own component when it has its own behavior or state, is reused, or makes the parent hard to follow (as a rough guide, more than about 150 lines or more than one job).
- Don't wrap every `<div>` in a component. A small piece of markup used once stays inline.
- Put a component next to its feature (`src/features/<feature>/components/`). Move it to `src/shared/ui/` only when two or more features use it and it has no feature-specific logic.
- Never define a component inside another component's body: it remounts on every render.
- Use explicit TypeScript props. Use a `variant` union instead of many boolean flags.
- React 19: `ref` is a normal prop, so new components don't need `forwardRef`. Leave existing `forwardRef` code alone unless you're already changing it.

## Custom hooks

Write a custom hook (`useXxx`, in the feature's `hooks/`) when:
- the same stateful logic appears in two or more components, or
- a component mixes UI with non-trivial logic (data fetching and derived state, URL search params, debouncing, subscriptions, local storage).

Example: `useApplicationsFilters`. Keep TanStack Query calls in a feature hook or API module, not inline in large pages. Don't make a hook just to wrap a single `useState`.

## Memoization: use where it pays, not everywhere

Memoization has a cost (memory, dependency arrays, readability). Add it when one of these applies:

| Tool | Use when |
| --- | --- |
| `useMemo` | Expensive derived data: filtering, sorting or grouping lists, chart data transforms (Recharts `data`), or building an object or array passed to a memoized child or used in a hook dependency. |
| `useCallback` | A function is passed to a `memo` child, used in a `useEffect`/`useMemo` dependency, or returned from a custom hook. |
| `memo()` | A component renders often with the same props and is heavy (list rows such as `ApplicationCard`/`RowCard`, charts, large forms), and its parent re-renders for unrelated reasons. |
| `useDeferredValue` / `useTransition` | Typing in search should stay responsive while a heavy list or chart re-renders. |
| `lazy()` + `Suspense` | Route-level pages and heavy, rarely used parts (charts, CV workspace). |

Don't memoize:
- cheap computations (string concatenation, a `.length`, simple conditionals),
- inline handlers passed to native elements (`<button onClick>`),
- anything whose dependencies change every render anyway. Fix the unstable dependency first.

A `memo()` child only helps if its object, array and function props are stable too. Pair it with `useMemo`/`useCallback` in the parent, or it does nothing.

## State and effects

- Derive values during render instead of copying props into state or syncing state with `useEffect`.
- Keep state as close as possible to where it's used. Lift it only as far as needed.
- `useEffect` is for syncing with external systems (subscriptions, DOM, timers). It is not for data fetching (use TanStack Query) or for reacting to user events (do that in the handler).
- Lists use stable, meaningful keys (`application.id`), never the array index for reorderable data.
- Context: split large contexts and memoize the `value` object so consumers don't all re-render.

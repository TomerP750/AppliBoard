# Frontend UI/UX Guidelines

These instructions apply to all work inside `frontend/`. Build a clear, accessible, professional interface that helps users manage applications and prepare for their next opportunity. Follow the existing React, TypeScript, Tailwind CSS, and feature-based architecture.

## Design decisions

- Start with the user's task: identify the primary action, the information needed to take it, and the expected result.
- Give each screen a clear title, a logical reading order, and a visually dominant primary action. Keep secondary actions quieter.
- Match existing screens and shared components before introducing a new visual pattern. Improve inconsistencies within the scope of the task.
- Use whitespace, typography, and alignment to establish hierarchy. Avoid unnecessary cards, borders, shadows, gradients, and decorative icons.
- Keep copy concise and specific. Use action labels such as "Save application" or "Upload CV" instead of vague labels such as "Submit".
- Make important actions discoverable without hover. Explain restrictions and provide a useful next step when an action cannot proceed.

## Avoid generic AI design

- Make design decisions specific to AppliBoard's users, content, and workflows. Do not default to a generic SaaS landing-page template for every screen.
- Avoid repetitive card grids, oversized hero sections inside task-focused pages, excessive rounded containers, decorative blobs, glass effects, and heavy shadows without a functional reason.
- Use gradients selectively according to the title guidance below. Do not spread purple-to-blue gradients, glow effects, or colorful accents across every heading, icon, and button.
- Let the content determine the layout: use tables for comparing records, lists for scanning activity, and grouped forms for input. Add cards only when they meaningfully group related content.
- Write concrete, domain-specific copy. Avoid generic slogans such as "Unlock your potential", unnecessary AI references, and filler descriptions that do not help users act.
- Use icons to clarify actions or meaning. Avoid adding a sparkle icon to every feature or an icon to every label merely as decoration.
- Create character through intentional typography, proportions, spacing, and useful details while respecting the existing visual system. Avoid arbitrary novelty that makes familiar tasks harder.
- Before delivery, check whether the screen could belong to any unrelated product with only its title changed. If so, improve its content, hierarchy, and task-specific interactions.

## Modular components and architecture

- Keep pages focused on composition, routing, and coordinating feature state. Extract cohesive interface sections into feature components.
- Place feature-specific components, hooks, models, and API functions in the relevant `src/features/` directory.
- Reuse primitives from `src/shared/ui/`, including buttons, inputs, badges, and modals. Extend an existing primitive with a small, typed API when appropriate.
- Promote a component to `shared` when it serves multiple features and has no feature-specific business rules. Keep one-off components near their feature.
- Give each component one clear responsibility. Extract when a section has its own behavior, is reused, or makes its parent hard to understand; avoid splitting every wrapper into a component.
- Use explicit TypeScript props and meaningful variants. Prefer composition over many boolean flags or a single component with unrelated modes.
- Keep API requests in feature API modules and reusable behavior in hooks. Follow existing React Query and form conventions.
- Keep state close to its owner, derive values where possible, and avoid duplicating the same state across components.
- Do not define components inside another component's render function. Use stable, meaningful keys for lists.
- Avoid unrelated refactors and new dependencies when existing tools can solve the task cleanly.

## Descriptive names

- Use `PascalCase` for components and types, `camelCase` for functions and variables, and the `use` prefix for hooks.
- Name components after their purpose: `ApplicationStatusFilter`, `CvUploadCard`, or `DeleteApplicationDialog`.
- Name callbacks and handlers by the action: `onApplicationSelect`, `handleCvUpload`, and `handleSaveApplication`.
- Use readable boolean names such as `isSubmitting`, `hasApplications`, and `canUploadCv`.
- Prefer domain names such as `selectedApplication` and `applicationStatus` over `item`, `data`, `value`, or `flag` when the meaning is known.
- Follow neighboring directory and export conventions. Do not rename unrelated existing files just to enforce a new naming style.

## Visual system and title gradients

- Reuse the brand tokens in `src/index.css`: `brand-primary` (indigo), `brand-secondary` (sky), and `brand-accent` (emerald).
- Keep spacing, corner radii, typography, icon sizes, and surface treatments consistent with the surrounding interface. Prefer existing Tailwind scales over arbitrary values.
- Support light and dark themes deliberately, including surfaces, borders, placeholder text, interactive states, and charts.
- Use a restrained linear color gradient for prominent page or hero titles when it supports the screen's hierarchy. Keep section headings and dense interface labels solid by default.
- Choose colors by context: indigo to sky for the main brand or informational flows; indigo to emerald for progress or opportunity themes when appropriate. Reserve warning and destructive colors for their semantic purpose.
- Apply the gradient to text with `bg-clip-text` and `text-transparent`; use Tailwind v4's `bg-linear-to-r`. Keep it static and use a solid readable fallback for forced-colors mode.
- Example starting point for a prominent title:

  ```tsx
  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
    <span className="bg-linear-to-r from-indigo-700 to-sky-700 bg-clip-text text-transparent dark:from-indigo-300 dark:to-sky-300 forced-colors:bg-none forced-colors:text-[CanvasText]">
      Prepare for your next opportunity
    </span>
  </h1>
  ```

- Check the entire gradient against the actual background in both themes. Adjust stops or use a solid title if any portion becomes difficult to read. The example is a starting point, not a guarantee for every surface.
- Do not use gradient text for body copy, form labels, validation errors, or essential status information. Never rely on color alone to communicate meaning.

## Responsive layout and accessibility

- Design for narrow screens first. Let grids, toolbars, forms, and navigation adapt to available space without clipping or unintended horizontal scrolling.
- Check approximately 320px, 768px, and 1280px widths, plus content-driven breakpoints. Check long titles, long values, and browser zoom.
- Preserve readable text and comfortable touch targets. Aim for 44 by 44 CSS pixels for primary touch controls, including icon buttons.
- Use semantic landmarks and native controls. Provide one clear page-level `h1` and a logical heading hierarchy.
- Use buttons for actions and links for navigation. Give every input a persistent label and every icon-only control an accessible name.
- Keep keyboard focus visible. Ensure menus and dialogs support expected keyboard interaction, including Escape, sensible focus placement, and focus restoration when closed.
- Connect field errors and instructions to their inputs. Use appropriate live announcements for asynchronous results without announcing every render.
- Target WCAG AA contrast: at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for essential control boundaries and indicators against adjacent colors.
- Pair status colors with text or icons. Give charts readable labels and an accessible text summary or equivalent data when needed.
- Respect reduced-motion preferences. Keep animation brief and purposeful; avoid motion that delays interaction.

## Interaction states and feedback

- Design loading, empty, error, success, disabled, hover, focus, and selected states where applicable.
- Distinguish loading from missing data and request failure. Never show an indefinite spinner because a request failed or returned no results.
- Preserve layout during loading when practical. Prevent duplicate submissions and retain a meaningful accessible button label while submitting.
- Make empty states explain what is missing and offer a relevant next action. Distinguish "no applications yet" from "no matching results".
- Show actionable inline form errors and preserve entered values after a failed request. Use toasts for supplementary feedback, not the only explanation of a field error.
- Confirm destructive actions with a clear description of their effect. Provide cancellation and recovery where supported.
- Keep user input, filters, and navigation state stable during background updates when possible.
- Do not present placeholder data or unimplemented actions as working functionality. Make unavailable capabilities clear.

## Validation workflow

- Do **not** run `npm run build` after every write, save, or small edit. Batch related changes and choose checks based on the completed change.
- Documentation-only changes require a content and diff review; they do not require a frontend build.
- For code changes, run the relevant available lint or type checks after a coherent batch. Use a production build when requested, required by CI, or needed to verify bundling, configuration, dependency, or release behavior.
- For visual or interaction changes, inspect the affected flow in the running app when available. Check responsive layouts, both themes, keyboard use, and relevant states.
- Use existing tests and tooling where they provide useful coverage. Do not add a dependency, validator service, or test framework solely to satisfy this checklist.
- If runtime inspection or a check cannot be performed, state the limitation. Never claim visual or accessibility verification based only on reading the source.

## UI/UX validator checklist

Before delivering a UI change, review these items as a lightweight manual validator. Mark each relevant item as **Pass**, **Needs work**, or **Not checked**, with a reason for anything unresolved. This checklist complements automated checks; it is not an automated validator or accessibility certification.

- [ ] **Task clarity:** The purpose, primary action, and next step are immediately understandable.
- [ ] **Architecture:** Components have focused responsibilities, shared primitives are reused, and names describe their purpose.
- [ ] **Hierarchy:** Titles, spacing, typography, and action emphasis guide the reading order consistently.
- [ ] **Title treatment:** Any linear gradient fits the context, remains readable in both themes, and has a forced-colors fallback.
- [ ] **Responsive behavior:** The layout handles narrow and wide screens, long content, and zoom without lost controls or clipped information.
- [ ] **Accessibility:** Semantics, labels, contrast, keyboard access, focus behavior, and reduced motion are addressed.
- [ ] **Interaction feedback:** Loading, empty, error, success, and disabled states provide useful feedback and recovery paths.
- [ ] **Data integrity:** Real, empty, and failed data states are distinct; submissions cannot accidentally repeat.
- [ ] **Consistency:** Colors, icons, copy, controls, and themes follow the existing visual system.
- [ ] **Product identity:** Layout and copy serve AppliBoard's workflows; generic template styling and unnecessary decoration have been removed.
- [ ] **Verification:** Relevant checks were completed, the diff contains only intended changes, and unverified behavior is disclosed.

Fix issues that block the primary task, hide information, or prevent accessible operation before considering the UI complete. In the handoff, briefly report what changed, which checks ran, and any remaining limitations.

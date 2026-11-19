---
paths:
  - "frontend/**"
---

# Frontend rules (React 19, TypeScript, Vite, Tailwind v4)

The full UI/UX, architecture, naming and accessibility guide is `frontend/AGENTS.md`. Follow it. Key points:

- Feature code goes in `src/features/<feature>/` (`api/`, `components/`, `hooks/`, `models/`, `pages/`, `utils/`). Reuse primitives from `src/shared/ui/`. To create a new feature, follow the `new-feature` skill.
- API calls live in the feature's `api/` module as a class with `return (await axios.<method>(...)).data` methods, exported as `const xService = new XService(); export default xService;`. Server state goes through TanStack Query; forms use React Hook Form. For new endpoint work, follow the `api-integration` skill.
- Use the brand tokens in `src/index.css` (no hard-coded hex colors). Support light and dark themes.
- React practices (component size, custom hooks, memoization): `.claude/rules/react.md`.
- Before delivering a UI change, run the `ui-validator` skill on the changed files.
- Don't present dummy data or unimplemented actions as working.
- Don't add or change dependencies in `package.json` unless asked.
- Don't run `npm run lint`, `npm run build` or the dev server unless asked.

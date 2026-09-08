# MUI Frontend Skill

Use this skill for React UI work in this repository.

## Goal

Build and edit UI using the repository's MUI theme and component conventions. Avoid feature-local CSS unless there is already an established exception that must be preserved.

## Workflow

1. Inspect nearby components before editing.
2. Search for existing shared/common components, hooks, utilities, and page patterns before creating new UI pieces.
3. Reuse implemented components and utilities when they cover the need; add new pieces only when the behavior or composition is not already available.
4. Prefer MUI primitives: `Box`, `Stack`, `Typography`, `Button`, `IconButton`, `TextField`, `Select`, `MenuItem`, `FormControl`, `InputAdornment`, `Paper`, `Tooltip`.
5. Style with `sx` and theme callbacks.
6. Use icons from `lucide-react` for compact actions when an existing local icon library pattern exists.
7. Verify layout stability with `minWidth: 0`, `minHeight: 0`, explicit grid/flex tracks, and controlled overflow.
8. Check `package.json` and existing imports before reimplementing generic UI helpers that installed dependencies already cover.
9. Use installed focused utilities for UI-side calculations when they improve correctness or readability.
10. Format changed files using the repository `.prettierrc`.

## Rules

- Do not create CSS modules for new UI work.
- Do not create feature CSS files or global CSS for local component styling.
- Do not write native `button`, `input`, or `select` controls when a MUI component provides the expected behavior.
- Do not use `style` props for visual styling. Use `sx`.
- Use named component exports, including route-level `Entry.tsx` files. Do not default-export components from `Entry.tsx`.
- Keep page-level components aligned with similar existing pages. Match established conventions for layout, headers, filters, tables, tabs, loading states, empty states, error states, and action placement.
- Before inlining helper functions or derived-state logic inside components and hooks, check whether the logic belongs in a local helper, custom hook, existing shared utility, or shared component.
- Split large components, hooks, helper functions, and modules into smaller focused pieces when the file is mixing responsibilities or when parts can be reused cleanly. Split for real maintainability or reuse benefit, not ceremony.
- Do not duplicate common UI behavior that already exists in shared/common components or utilities.
- Use `IconButton` for icon-only actions with `aria-label`.
- Use visible text buttons for primary commands where text improves clarity, for example `Run`.
- Use `Tooltip` or `title` when an icon-only affordance may be unclear.
- Keep cards to real repeated items, dialogs, or framed tools. Do not nest cards inside cards.
- Add comments only for caveats, escape hatches, necessary hacks, vendor/API quirks, compatibility traps, or non-obvious constraints. Do not comment what a component, function, prop, type, JSX section, or obvious block does.
- Prefer clearer component names, prop names, helper extraction, and layout structure over explanatory comments. Remove redundant comments in touched UI files.
- Use theme tokens instead of hard-coded colors:
  - `background.paper`
  - `background.default`
  - `text.primary`
  - `text.secondary`
  - `divider`
  - `primary.main`
  - `error.main`
  - `theme.palette.common.neutral[...]`
  - `alpha(theme.palette.primary.main, opacity)`
- Keep component text sized for its container. Avoid oversized headings in tool panels, sidebars, and dense dashboard surfaces.

## Utility Libraries

- Use `date-fns` for UI date labels, ranges, relative text, and duration formatting instead of string slicing or manual millisecond math.
- Use named imports from `lodash-es` for collection helpers when they make UI state or option derivation clearer, for example `uniq`, `sortBy`, `keyBy`, `groupBy`, `flatMap`, `debounce`, `throttle`, `isEqual`, and `clamp`.
- Do not import all of lodash, and do not replace clear native array/object code unless a library helper reduces real complexity or edge-case risk.

## Common Patterns

Icon action:

```tsx
<IconButton aria-label="Collapse sidebar" onClick={onCollapse} size="small">
  <PanelLeftClose size={16} />
</IconButton>
```

Theme-aware hover:

```tsx
sx={{
  color: 'text.secondary',
  '&:hover': {
    backgroundColor: theme => alpha(theme.palette.primary.main, 0.16),
    color: 'text.primary',
  },
}}
```

Stable app panel:

```tsx
<Box
  sx={{
    display: "grid",
    gridTemplateRows: "auto 1fr",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
  }}
>
  {children}
</Box>
```

## Formatting And Validation

Use the repository `.prettierrc` as the formatter source of truth.

Do not write, add, update, or propose tests unless the user explicitly asks for tests.

Do not run `npm run build` or `npm run lint` after generation unless the user explicitly asks for it.

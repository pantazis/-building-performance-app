# HTML Prototype Extension Rules

## Scope & Safety
- Reuse `building-performance-app/prorotype.html` as the base component source.
- Do not overwrite original files unless explicitly requested.
- Prefer additive, reversible changes.

## New View Location (Mandatory)
- Create all new views/pages inside `/view`.
- Do not place new view files in `building-performance-app/` root unless explicitly requested.



## Component-First Workflow (Mandatory)
- For every new UI task, first check and reuse components from `building-performance-app/prorotype.html`.
- If a required component is missing, add it to `building-performance-app/prorotype.html` first.
- Then build the new `/view` page by composing existing components.
- Prefer reusable components over one-off markup.

## LLM-Discoverable Structure (Mandatory)
- Mark reusable blocks with searchable comments: `<!-- COMPONENT: component-name -->`.
- Use stable, searchable names for classes/IDs (e.g., `.c-card`, `#component-login-form`).
- Keep HTML structure predictable and consistent across pages.
- Group component CSS with matching labels/comments so existence is easy to detect.

## LLM-Discoverable Component Registry (Mandatory)
- Add one compact index near the top of `building-performance-app/prorotype.html`:
  `<!-- COMPONENT-INDEX: c-button-primary, c-card, c-input-text, c-login-form, c-modal, c-toast -->`
- Every reusable component block must start with:
  `<!-- COMPONENT: component-name -->`
- Keep one canonical name across marker + id + class:
  - marker: `component-name`
  - id: `id="component-component-name"`
  - class: `.c-component-name`
- In CSS, group each component under a matching label:
  `/* COMPONENT: component-name */`
- Required lookup order for new tasks:
  1) Check `COMPONENT-INDEX`
  2) Reuse if found
  3) If missing, add component to `prorotype.html`
  4) Then compose the new page inside `/view`

## Canonical Component Fidelity (Mandatory)
- When reusing a component from `building-performance-app/prorotype.html`, copy its **canonical HTML structure** (same wrapper hierarchy and required heading/label elements).
- Reuse must include **both HTML and its paired component CSS**. If the component CSS is not in shared stylesheet(s), copy the full `/* COMPONENT: component-name */` CSS block into the target view.
- Do not create simplified variants of existing components unless explicitly requested.
- For breadcrumbs specifically, reuse the canonical block pattern:
  - `<!-- COMPONENT: breadcrumbs -->`
  - `<article id="component-breadcrumbs" class="card c-breadcrumbs">`
  - `<h2>Breadcrumbs</h2>`
  - `<nav aria-label="Breadcrumb"><ol>...</ol></nav>`
- If a view needs a different breadcrumb text/path, only change the list item content/links, not the component skeleton.

## Component Reuse Verification (Mandatory)
- Before completing any `/view` page, verify each reused component passes all checks:
  1) Canonical marker/id/class match (`<!-- COMPONENT: ... -->`, `id="component-..."`, `.c-...`)
  2) Canonical internal structure is preserved (required headings/labels/wrappers)
  3) Matching `/* COMPONENT: ... */` CSS exists in either global stylesheet or the view file
  4) Quick visual check confirms layout parity with `prorotype.html` at desktop and mobile widths
- If any check fails, fix it before delivery.

## Layout & Responsiveness
- Always use CSS Grid for responsive layout (desktop/tablet/mobile).
- Keep spacing rhythm consistent (padding, margins, gaps, card spacing).
- Preserve clear hierarchy (H1/H2/H3/body/caption).

## Design & CSS Rules
- Reuse existing color palette and visual style.
- Use CSS variables as much as possible (`:root` design tokens).
- Tokenize spacing, typography, radius, shadows, breakpoints, and states.

## Semantic Button Color System (Mandatory)
- Use the prototype semantic button palette across all views for consistency.
- Define and reuse these CSS variables (in shared scope or per-view fallback):
  - `--btn-color-success: #2db34a`
  - `--btn-color-default: #86c440`
  - `--btn-color-warning: #fecf17`
  - `--btn-color-orange: #f47721`
  - `--btn-color-danger: #ef3e23`
- Use Bootstrap-like semantic classes for actions:
  - `.btn-success` (primary positive)
  - `.btn-default` (neutral/default)
  - `.btn-warning` (caution)
  - `.btn-orange` (attention/secondary warning)
  - `.btn-danger` (destructive)
- Keep `.btn-primary` mapped to the same visual token as `.btn-success` unless a task explicitly asks for a different primary color.
- Do not hardcode button hex colors directly in `/view` pages when semantic variables/classes are available.
- When creating/updating any `/view` page, verify button colors match prototype semantic tokens to keep cross-view consistency.

## JS & Behavior
- Keep implementation simple: HTML + CSS + small vanilla JS only.
- Add only necessary behavior (menu toggle, modal, toast, accordion, validation, etc.).
- Do not break existing functionality.

## Accessibility Baseline
- Use semantic HTML.
- Ensure labels for inputs and meaningful alt text.
- Keep keyboard-friendly interaction and visible focus states.

## Delivery Checklist
- Confirm component exists in `prorotype.html`
- Add missing component to `prorotype.html` if needed
- Create/update target view in `/view`
- Reuse tokens, grid, and existing style language
- Add clear comments for new sections/components
# Prototype Component Sync (Git + Markers)

This workflow updates `/view/*.html` components from the canonical source:

- `building-performance-app/prorotype.html`

It relies on markers already used in your project:

- HTML marker: `<!-- COMPONENT: component-name -->`
- CSS marker: `/* COMPONENT: component-name */`

## Script

- `scripts/sync-components.js`

## Usage

### 1) Dry run from git-detected prototype changes

```bash
node scripts/sync-components.js --dry-run
```

Reads `git diff` for `prorotype.html`, detects changed component markers, and reports which `/view` files would be updated.

### 2) Apply git-detected changes

```bash
node scripts/sync-components.js --apply
```

Writes updates to `/view` files for detected components.

### 3) Force one or more components

```bash
node scripts/sync-components.js --dry-run --component breadcrumbs
node scripts/sync-components.js --apply --component breadcrumbs --component login-form
```

### 4) Sync all components from prototype

```bash
node scripts/sync-components.js --dry-run --all-components
node scripts/sync-components.js --apply --all-components
```

## What gets synced

1. **HTML blocks** in each view file where matching marker exists.
2. **Component CSS blocks** are added to the view only if:
   - the prototype contains `/* COMPONENT: name */` block, and
   - the target view has an inline `<style>` tag, and
   - that component CSS marker is missing in the target.

## Recommended flow

1. Edit component in `prorotype.html`.
2. Run dry-run.
3. Run apply.
4. Review changes and commit:

```bash
git add view scripts/sync-components.js scripts/README-sync-components.md
git commit -m "sync components from prototype"
```

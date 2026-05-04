## Data Model Usage (Mandatory)
- Always use `sri_epb_ui_data_model_v2.js` as the default data source when creating or updating new `/view` pages.
- Treat `info.txt` and `plan.mmd` as required companion references to keep data usage aligned with functional intent and UI flow.
- Reuse exported objects/structures from `sri_epb_ui_data_model_v2.js` instead of creating one-off inline mock data in view files.
- Only use a different data source when explicitly requested.

## Mermaid Plan to SVG Conversion (Mandatory)
- Always use this exact command to convert Mermaid plans to SVG:
  `docker run --rm -v "c:/Users/pvast/Documents/OpenBEP$EU:/data" minlag/mermaid-cli -i /data/input.mmd -o /data/output.svg`



## User Journey & Flow Reference (Mandatory)
- Always read `plan.mmd` before creating or editing any `/view` page; use it as the primary source of truth for navigation flow and screen transitions.
- Always read `info.txt` to align page content, actions, and role-based behavior with the documented functional context (General UI, EPB UI, SRI UI).
- Ensure view structure, navigation choices, and behavior remain consistent with both `plan.mmd` and `info.txt`.

## Gauge Component Planning & Usage (Mandatory)
- For tasks involving score visualization, plan usage of the reusable prototype gauge component (`<!-- COMPONENT: gauge-svg-template -->`, `#component-gauge-svg-template`, `#gauge`) before implementing the target `/view` page.
- Use `plan.mmd` + `info.txt` to choose where the gauge is shown first, with this priority:
  1) `SRI Results` (`SRI14`) for final smart-readiness score
  2) `EPB Results / Performance Summary` (`EPB4`) for final energy summary
  3) `Projects Dashboard` (`A`) for compact at-a-glance score cards
- Keep gauge integration component-first: reuse canonical SVG structure from `building-performance-app/prorotype.html`; do not create alternative gauge markup unless explicitly requested.
- When a gauge is added to a view, pair it with a clear text value/label (e.g., `SRI Score 51%`, class/rating) so meaning is accessible and understandable without relying only on graphics.

## List Elements Rule (Mandatory)
- When a `/view` page includes list elements (`ul`/`ol`) or different site components that present lists (e.g., building lists), add at least 4 list items.
- Keep list content meaningful and aligned with the page purpose and user journey.

## View Coverage Check (Mandatory)
- Always check which views are missing before creating or updating `/view` pages.
- Use `plan.mmd` as the source of truth and compare current `/view` files against all flow nodes/screens represented there (e.g., Projects Dashboard, Building Tab, EPB View 1-4, SRI View 1-5, SRI Results, and related navigation branches).
- Use `info.txt` to validate that the derived/missing views also reflect the intended product areas and user actions.
- In every task involving views, explicitly report missing views first, then implement/update pages.

## Building Creation Handoff to Tabs (Mandatory)
- After `B` / `B1` (Add New Building First), all EPB and SRI workflow continues in `I` (Building Tab).
- Treat `I` as the tab entry point before progressing through EPB and SRI view groups.
- `IFC` upload and domain setup are completed in later steps, not at the initial `B` / `B1` stage.

## View Master List + Completion Tracking (Mandatory)
- Maintain and use the full numbered view list below when planning/implementing `/view` pages.
- Track implementation status with markers:
1. [*] `A` - Projects Dashboard
2. [*] `B` - Add New Building First
3. [*] `C` - Open / Edit Building
4. [*] `D` - Duplicate Building
5. [*] `E` - Delete Building
6. [ ] `F` - Global Resource Library
7. [ ] `G` - Language Selection
8. [ ] `H` - User Profile

### Tab Workflow Grouping (after B/B1)
9. [*] `I` - Building Tab

#### EPB Tabs Group
10. [ ] `EPB1` - EPB View 1: Calculation Settings
11. [ ] `EPB2` - EPB View 2: Materials & Constructions
12. [ ] `EPB3` - EPB View 3: Thermal Zones & Envelope Analysis
13. [ ] `EPB4` - EPB Results / Performance Summary

#### SRI Tabs Group
14. [ ] `SRI1` - SRI View 1: Methodology Selection
15. [ ] `SRI2` - SRI Decision: User-defined Weightings
16. [ ] `SRI3` - SRI View 2: Weighting Settings
17. [ ] `SRI4` - SRI View 3: Domain Dashboard
18. [ ] `SRI5` - Heating Tab
19. [ ] `SRI6` - DHW Tab
20. [ ] `SRI7` - Cooling Tab
21. [ ] `SRI8` - Ventilation Tab
22. [ ] `SRI9` - Lighting Tab
23. [ ] `SRI10` - Dynamic Envelope Tab
24. [ ] `SRI11` - Electricity Tab
25. [ ] `SRI12` - EV Charging Tab
26. [ ] `SRI13` - Monitoring & Control Tab
27. [ ] `SRI14` - SRI Results

## Status Presentation Mapping (Mandatory)
- Keep backend/data-model status values unchanged (e.g., `READY_FOR_CALCULATION`, `MISSING_DATA`, `CALCULATION_COMPLETED`).
- Never display raw enum keys directly in UI tables/lists/cards.
- Always map status keys to:
  1) human-readable label
  2) semantic chip class
- Reuse existing chip language from prototype/styles: `.chip`, `.chip--ready`, `.chip--processing`, `.chip--incomplete`.

### Required baseline mappings
- `READY_FOR_CALCULATION` -> label: `Ready`, class: `chip chip--ready`
- `MISSING_DATA` -> label: `Incomplete data`, class: `chip chip--incomplete`
- `IN_PROGRESS` / `PROCESSING` -> label: `Processing`, class: `chip chip--processing`
- `CALCULATION_COMPLETED` -> label: `Calculation completed`, class: `chip chip--ready`

### Fallback behavior (required)
- If a status is unknown:
  - Convert enum to title case label (`SOME_NEW_STATUS` -> `Some new status`)
  - Use neutral class: `chip`

### Reuse rule
- Implement one shared helper per view (e.g., `getStatusPresentation(status)`) and reuse it in all status render points (table rows, list items, cards, badges).
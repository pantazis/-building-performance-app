# Required context files for every UI/navigation task

Before creating or updating any page, always read these files first:

1. `plan_for_app/menu-diagram-example.mmd`
   - Use this as the source of truth for the application menu and page navigation flow.

2. `plan_for_app/userRoles.md`
   - Use this to understand which user roles can access each page or workflow.

3. `data_model/sri_epb_ui_data_model_v2.js`
   - Always keep this UI data model updated when a page, field, workflow, SRI section, EPB section, or navigation item changes.

## Required updates when adding a new page/view

When adding any new page or view:

1. Create the new page in the correct `/view` location unless another rule explicitly says otherwise.
2. Add a link or entry for the new page in the root `index.html` so it can be discovered from the app start page.
3. Add the new page to `plan_for_app/menu-diagram-example.mmd` so the menu/navigation diagram stays current.
4. Add any reverse/back navigation relationship to `plan_for_app/menu-diagram-example.mmd` when the new page needs to link back to a previous page, dashboard, or parent workflow.
5. Update `data_model/sri_epb_ui_data_model_v2.js` with any new page metadata, fields, sections, or workflow data required by the new view.

## General instruction

Keep the plan files, navigation diagram, index page, and UI data model synchronized. Do not create or update a view without checking whether these related files also need updates.
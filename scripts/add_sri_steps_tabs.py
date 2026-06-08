from pathlib import Path


FILES = [
    "SRI5-heating-tab.html",
    "SRI6-dhw-tab.html",
    "SRI7-cooling-tab.html",
    "SRI8-ventilation-tab.html",
    "SRI9-lighting-tab.html",
    "SRI10-dynamic-envelope-tab.html",
    "SRI11-electricity-tab.html",
    "SRI12-ev-charging-tab.html",
    "SRI13-monitoring-control-tab.html",
]

CSS = """

    /* COMPONENT: steps-tabs */
    .c-steps-tabs .steps-header {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: var(--sp-sm);
    }

    .c-steps-tabs .step-item {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: var(--sp-xs);
      text-decoration: none;
      color: var(--muted);
      border: 1px solid var(--line);
      border-radius: var(--r-sm);
      background: #fff;
      padding: 10px 12px;
      transition: .2s ease;
    }

    .c-steps-tabs .step-item:hover {
      color: var(--ink);
      border-color: var(--btn-color-default);
    }

    .c-steps-tabs .step-item.is-active {
      color: var(--ink);
      border-color: var(--btn-color-success);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--btn-color-success) 18%, transparent);
    }

    .c-steps-tabs .step-number {
      display: inline-grid;
      place-items: center;
      min-width: 28px;
      min-height: 28px;
      border-radius: 999px;
      background: #eef5ea;
      color: var(--btn-color-success);
      font-weight: 700;
    }

    .c-steps-tabs .step-title {
      font-weight: 700;
      line-height: 1.2;
    }

    @media (max-width: 980px) {
      .c-steps-tabs .steps-header { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 640px) {
      .c-steps-tabs .steps-header { grid-template-columns: 1fr; }
    }
"""

COMPONENT = """

        <div class="full">
          <!-- COMPONENT: steps-tabs -->
          <article id="component-steps-tabs" class="card c-steps-tabs" aria-label="SRI domain flow tabs">
            <div class="steps-header" role="tablist" aria-label="SRI domain pages"></div>
          </article>
        </div>
"""


def patch_file(path: Path) -> None:
    source = path.read_text(encoding="utf-8")

    if "/* COMPONENT: steps-tabs */" not in source:
        source = source.replace(
            "    /* COMPONENT: setup-help */",
            CSS + "\n    /* COMPONENT: setup-help */",
            1,
        )

    if 'id="component-steps-tabs"' not in source:
        source = source.replace(
            '        <div class="full">\n          <!-- COMPONENT: setup-help -->',
            COMPONENT + '\n        <div class="full">\n          <!-- COMPONENT: setup-help -->',
            1,
        )

    if "./sri-steps-tabs.js" not in source:
        source = source.replace(
            '<script src="../data_model/sri_epb_ui_data_model_v2.js"></script>',
            '<script src="../data_model/sri_epb_ui_data_model_v2.js"></script>\n<script src="./sri-steps-tabs.js"></script>',
            1,
        )

    path.write_text(source, encoding="utf-8")


for file_name in FILES:
    patch_file(Path("view") / file_name)

print(f"Patched {len(FILES)} SRI domain pages")
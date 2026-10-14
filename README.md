# Fabric Implementation Playbooks

A static, vendor-neutral website of practitioner playbooks for implementing Microsoft Fabric: migration from Power BI, medallion architecture, data load strategy, cross-workspace orchestration, control-table-driven pipelines, Delta partitioning, shared libraries, Git/GitHub integration, deployment pipelines, variable libraries, Power BI standards, org apps, paginated report migration, QA validation and tenant settings.

- 17 playbooks, 123 pages, 330+ inline SVG diagrams
- Plain HTML, CSS and JavaScript — no build step, no external dependencies, works offline
- Light and dark themes, client-side search (press `/`), per-page table of contents, copyable code, persistent checklists

## Publish with GitHub Pages

1. Create a repository and push the contents of this folder to the `main` branch (the folder itself is the repository root).
2. In **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site is served at `https://<org>.github.io/<repo>/`. All links are relative, so it works under any sub-path. `.nojekyll` disables Jekyll processing.

Optionally set `"repo": "https://github.com/<org>/<repo>"` in `site.config.json` and re-run the build script to show "Edit this page" links.

## Structure

```
index.html                  home page
playbooks/index.html        catalog
playbooks/<NN-slug>/        one folder per playbook: meta.json + pages
paths.html                  learning paths by role
reference-architecture.html end-to-end architecture tying the playbooks together
glossary.html               A–Z glossary
styleguide.html             authoring guide and component / diagram gallery
assets/css/site.css         the only stylesheet
assets/js/site.js           navigation, search, TOC, theme, code highlighting
assets/js/site-data.js      GENERATED navigation data
assets/js/search-index.js   GENERATED search index
site.config.json            site title and category list
tools/                      build and validation scripts (Python 3 + lxml)
```

## Editing content

Read `styleguide.html` first. After adding or changing pages:

```shell
pip install lxml
python tools/build_site_data.py   # regenerates navigation, search index and catalog cards
python tools/validate_site.py     # links, anchors, headings, SVG diagram checks
```

The validation workflow in `.github/workflows/validate.yml` runs the same checks on every pull request.

## Disclaimer

This is an independent practitioner guide, not affiliated with or endorsed by Microsoft. Microsoft Fabric changes frequently: items flagged "Verify against Microsoft Learn" should be confirmed against current documentation before implementation. Microsoft Fabric, Power BI, OneLake and Azure are trademarks of Microsoft Corporation.

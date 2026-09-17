# FigJam board manifest

Sync manifest for the City Scrapers FigJam board. The `.md` files in this
directory are the source of truth; the board is regenerated from them with
the Figma MCP `generate_diagram` tool (see the figjam-sync skill).

- `figjam_url`: https://www.figma.com/board/0TXHEIqgEG6RWhsOBJ2dt3/meetings-viewer-data-pipeline
- `figjam_file_key`: `0TXHEIqgEG6RWhsOBJ2dt3`
- `plan_key`: `team::976169235833985558` (Code the Dream Team)
- `figma_project`: City Scrapers (`projectId` 654878342)

## Diagrams on the board

| Section                   | Source file           | Diagram name                  |
| ------------------------- | --------------------- | ----------------------------- |
| Pipeline (top)            | `data-pipeline.md`    | meetings-viewer data pipeline |
| MeetingRecord schema      | `meeting-schema.md`   | MeetingRecord schema          |
| Scraper PR review cycle   | `review-cycle.md`     | Scraper PR review cycle       |
| Meeting status lifecycle  | `status-lifecycle.md` | Meeting status lifecycle      |
| Scraper PR lifecycle      | `pr-lifecycle.md`     | Scraper PR lifecycle          |
| App sitemap               | `app-sitemap.md`      | meetings-viewer sitemap       |
| Docs platform automations | `docs-automations.md` | docs platform automations     |

## Non-diagram sections

These sections live on the board but are not mermaid-generated; rebuild them
with `use_figma` + `upload_assets` if removed:

- `App screens` - live captures of the app (desktop/mobile, light/dark),
  screenshotted via Playwright MCP from localhost:3000.
- `Screen wireframes` - simplified mockups drawn with FigJam shapes.

## Re-sync

1. Edit the Mermaid block in the source `.md` file.
2. To replace a diagram, delete its shapes/connectors on the board (or use
   `use_figma` to remove the section's contents), then call
   `generate_diagram` with `fileKey: 0TXHEIqgEG6RWhsOBJ2dt3`, the diagram
   name from the table, and the updated Mermaid source.
3. Re-wrap the new diagram in its section if needed.

No org-specific or personal data on this board, so no template rendering
step is required.

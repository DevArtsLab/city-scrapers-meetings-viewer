ownership: msrezaie
source_owner: Code The Dream
source_url: https://docs.google.com/document/d/1svsB02_nHnnHXde1Y_20vboPY-x9XjRWy9mqJg5dvNQ

## **Meetings Viewer — Technical Specification**

### _Goal: this app’s main purpose is to reduce QA time for our development process, clear out point of confusion between our QA teams when a scraper is functional_

### **1\. Overview**

The Meetings Viewer is a web interface for inspecting the JSON output of city-meeting scrapers. Each scraper is a Scrapy spider that lives in its own city-specific GitHub repository (`city-scrapers-atl`, `city-scrapers-fortx`, etc.) and emits a list of meeting records. The viewer renders those records as a browsable, filterable table.

The application is delivered in two modes:

- **Local mode**, used by developers while building and testing scrapers. Output is read from a designated directory on the developer's machine.
- **Production mode**, used during PR review of a scraper. Output is read from a dedicated GitHub repository (`meetings-viewer-data`) that is populated by GitHub Actions workflows attached to each city scraper repo.

Both modes share the same UI, the same routes, the same page components, and the same data shapes. Only the data source differs.

### **2\. Tech stack**

- **Next.js** (App Router)
- **MUI** for component primitives (Container, Button, Typography, etc.)

No database. No application-managed API server. Data is read either from the local filesystem (local mode) or from public raw GitHub URLs (production mode).

### **3\. Pages**

#### **3.1 `/scrapers` — index**

A table listing every scraper currently available in the active data source.

Columns:

- **Slug/Spider Name** — the scraper's slug, linked to the detail page.
- **Agency** — the human-readable agency name. Empty in local mode; populated in production.
- **Status** — last-run status. Empty in local mode; populated in production.
- **Last Run** — timestamp of the last run. Empty in local mode; populated in production.

The Agency, Status, and Last Run columns render as placeholder cells (`—` or empty) when the underlying value is not provided by the data source. The column headers and table structure are identical between local and production modes.

#### **3.2 `/scrapers/[spider]` — detail**

A view of one scraper's output, consisting of:

- A breadcrumb back to `/scrapers`.
- A page title (the spider slug).
- A stats bar displaying:
  - Total record count.
  - Count of records with status `passed`.
  - Count of records with status `cancelled`.
  - Count of records with status `tentative`.
  - All four are always rendered, including when the count is zero.
- A toolbar with:
  - Free-text search input.
  - Status filter dropdown (All, Passed, Cancelled, Tentative).
- A table of meeting records with columns: Title, Start, End, Location, Type, Status. The table supports per-column sort and reflects the toolbar's search and filter state.

### **4\. Data shapes**

#### **4.1 Meeting record**

Each scraper's output JSON file is an array of meeting records. The schema is defined by the upstream city-scrapers Scrapy framework and is not redefined by this project. Fields are:

| Field            | Type    | Notes                                                   |
| ---------------- | ------- | ------------------------------------------------------- |
| `id`             | string  | Unique identifier, format `{spider}/{timestamp}/{...}`  |
| `title`          | string  |                                                         |
| `description`    | string  |                                                         |
| `classification` | string  | e.g. `"Board"`, `"Committee"`                           |
| `start`          | string  | Naive datetime, format `"YYYY-MM-DD HH:mm:ss"`          |
| `end`            | string  | Naive datetime, format `"YYYY-MM-DD HH:mm:ss"`          |
| `all_day`        | boolean |                                                         |
| `time_notes`     | string  |                                                         |
| `location`       | object  | `{ name: string, address: string }`                     |
| `links`          | array   | `[{ href: string, title: string }, ...]`                |
| `source`         | string  | URL of the page the meeting was scraped from            |
| `status`         | string  | `"passed"`, `"cancelled"`, or `"tentative"` (lowercase) |

#### **4.2 Manifest**

The `/scrapers` index page is populated from a manifest with the following response shape:

json

```json
{
  "spiders": [{ "slug": "atl_council" }, { "slug": "charnc_meck_schools" }]
}
```

In local mode, this shape is the _response_ of the data-source function — it is constructed at request time by listing files in the local data directory, not stored as a file on disk. In production mode, this shape is the contents of a `manifest.json` file in the data repo.

The shape supports adding optional fields (`agency`, `last_run`, `last_run_status`) in production without breaking the local consumer.

### **5\. Local mode**

#### **5.1 Data layout**

```
meetings-viewer/
├── data/
│   └── scrapers/
│       ├── atl_council.json              # raw scrapy output
│       └── charnc_meck_schools.json      # raw scrapy output
└── app/
│   └── scrapers/
│       ├── page.tsx                   # /scrapers
│       └── [spider]/
│           └── page.tsx               # /scrapers/:spider
└── lib/
    └── scrapers.ts                    # data-source module
```

#### **5.2 Data-source module**

A single module, `lib/scrapers.ts`, exposes two async functions:

- `listScrapers(): Promise<{ spiders: { slug: string }[] }>` — returns the manifest shape by listing `*.json` files in `data/scrapers/` and stripping the `.json` extension.
- `getScraperOutput(slug: string): Promise<MeetingRecord[]>` — returns the parsed contents of `data/scrapers/{slug}.json`.

Page components import these functions directly. There is no HTTP API route. Server components call the data-source module in the same process.

When the production data source is introduced, only this module's implementation changes. The page components, route structure, and response shapes remain identical.

#### **5.3 Running a scraper**

Developers run scrapy spiders from within their city scraper repository, directing output to the viewer's data directory:

sh

```shell
scrapy crawl <spider_name> -O /path/to/meetings-viewer/data/scrapers/<spider_name>.json
```

The `-O` flag (capital O) overwrites the file on each run. The lowercase `-o` flag appends to the file and will produce duplicate records on subsequent runs; it must not be used.

The filename (without `.json`) must match the spider's `name` attribute. This filename is used as the slug in the viewer's URL: `<spider_name>.json` becomes `/scrapers/<spider_name>`.

After a scraper run, refreshing the viewer reflects the new data. The Next.js dev server reads the file from disk on each request to the relevant page.

#### **5.4 Local fields explicitly out of scope**

The following fields are deliberately not populated in local mode:

- `agency`
- `last_run`
- `last_run_status`

These are columns on the index page that render as placeholders in local mode and are populated only by the production data source. No local mechanism produces or stores them.

### **6\. Production mode (not yet fully planned)**

#### **6.1 Architecture summary**

Production data lives in a dedicated public GitHub repository, `meetings-viewer-data`. Each city scraper repo has GitHub Actions workflows that manage the lifecycle of that data:

- On PR open or update: a workflow (`run-and-save.yml`) runs the modified scraper and commits its output to the data repo.
- On PR close (merged or unmerged): a workflow (`cleanup-data.yml`) removes the PR's data from the data repo.

The viewer is hosted (Vercel or equivalent) and fetches data from the data repo via `raw.githubusercontent.com` URLs. No backend service, database, or authenticated API is involved on the viewer side.

#### **6.2 Data repo layout**

`meetings-viewer-data` holds a single long-lived branch with one directory per active PR:

```
prs/
  city-scrapers-fortx/
    101/
      manifest.json
      scrapers/
        fortx_council.json
        fortx_planning_comm.json
  city-scrapers-atl/
    214/
      manifest.json
      scrapers/
        atl_council.json
```

The directory key is `{scraper_repo_name}/{pr_number}`. The `manifest.json` file in each PR directory has the same shape as the local manifest, extended with the production-only fields (`agency`, `last_run`, `last_run_status`).

#### **6.3 URL scheme**

Production viewer URLs encode the source PR:

- `/pr/{scraper_repo}/{pr_number}/scrapers` — index
- `/pr/{scraper_repo}/{pr_number}/scrapers/{spider}` — detail

The local routes (`/scrapers` and `/scrapers/{spider}`) remain unchanged; the production routes wrap them in a `[repo]/[pr]/` parent segment.

#### **6.4 Workflow responsibilities**

- `run-and-save.yml` (city scraper repo, trigger: `pull_request: opened, synchronize`): runs the affected scrapers, regenerates the PR's `manifest.json`, commits all changes to `meetings-viewer-data` under `prs/{scraper_repo}/{pr_number}/`.
- `cleanup-data.yml` (city scraper repo, trigger: `pull_request: closed`): deletes `prs/{scraper_repo}/{pr_number}/` from `meetings-viewer-data` regardless of merge state.

Both workflows require a token with `contents: write` permission on `meetings-viewer-data`. The mechanism (PAT vs GitHub App) is not yet decided.

#### **6.5 Items still under decision**

The following production-mode details are documented as open questions and are not yet committed to:

- Token mechanism for cross-repo writes (PAT vs GitHub App).
- Handling of concurrent workflow runs against the data repo (retry-with-rebase loop, queue, or accepted race with periodic sweep).
- Whether merged-PR data is preserved anywhere or deleted along with unmerged-PR data.
- Periodic sweep workflow for orphaned PR directories whose PRs no longer exist on the source repo.

### **7\. Architectural invariants**

These properties hold across both modes and should not be broken without explicit revisit:

- **No application-managed API server.** Pages call data-source functions directly. The production version does not introduce an `/api/` route layer; it replaces the data-source module's implementation.
- **No database.** All data is file-based: filesystem in local mode, Git-tracked files served via CDN in production mode.
- **Identical UI between modes.** Page components, route file structure, column sets, and stats logic do not branch on mode. Mode-specific behavior is confined to `lib/scrapers.ts`.
- **Status values are lowercase.** The viewer normalizes case at render time and does not attempt to mutate or rewrite status values in the underlying data.
- **The spider's `name` attribute is the canonical slug.** Filenames, URL segments, and manifest entries all use this value verbatim.

### **8\. Table implementation**

The desktop table is built with MUI DataGrid (@mui/x-data-grid, Community edition, the free tier). It was picked over the other common React table options for this project's actual needs:

|              Option              |                                                                 Why not chosen instead                                                                  |
| :------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
|         Plain MUI Table          |                               No sorting, pagination, or column resize built in. We would hand-write all three ourselves.                               |
|          TanStack Table          |     "Headless": it only handles logic (sorting, pagination state), it renders zero UI. We would be building the whole table's markup from scratch.      |
|             AG Grid              |  Built for huge, spreadsheet-scale datasets. Its own visual design, not MUI's, and most of its standout features sit behind a paid Enterprise license.  |
| react-window / react-virtualized | Not a table library at all, just a technique for rendering only the rows currently on screen. Useful past 10,000+ rows, not needed at this app's scale. |

DataGrid Community covers sorting, pagination, and resizable columns for free, and already matches the rest of the app's MUI styling, which is why it stayed the choice from ticket CS-77 onward.

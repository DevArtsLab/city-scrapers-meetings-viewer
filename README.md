# Meetings Viewer

A web interface for inspecting the output of city-meeting scrapers. Each
scraper lives in its own repository and emits a list of meeting records;
this app turns that JSON into a browsable, filterable table.

There are two intended modes (not yet fully planned):

- **Local** — used while developing a scraper. The scraper writes its
  output to a designated directory on disk and the viewer renders it,
  refreshing automatically on each run.
- **Production** — used to review a scraper's output during PR review,
  before the scraper is merged. The viewer pulls JSON from a GitHub
  Actions workflow attached to the open PR. No database.

Both modes share the same UI; only the data source differs.

## Pages

- **`/scrapers`** — table listing every scraper currently available, with
  per-scraper summary stats (record count, status breakdown, last run).
- **`/scrapers/:name`** — table of meeting records for one scraper, with
  search, sort by start time, and status filtering. A stats panel above
  the table shows the total record count plus a count for each of the
  three statuses (Passed, Cancelled, Tentative), always rendered even
  when zero.

## Tech stack

- Next.js (App Router)
- MUI for component primitives (Container, Button, Typography, etc.)
- No database. Local mode reads scraper output from disk via a Next API
  route; production mode fetches from GitHub.

## Local Mode

### Requirements

- Node.js 18.18+
- npm

### Setup

```sh
git clone <repo-url> meetings-viewer
cd meetings-viewer
npm install
npm run dev
```

The dev server runs at http://localhost:3000. Opening `/` redirects to
`/scrapers`. With no data loaded, the index page shows an empty table.

### Loading data

The viewer reads scraper output from `data/scrapers/*.json` relative to the
meetings-viewer repo root. To populate it, run a scrapy spider from inside the
city-scrapers repo and direct output to that path using scrapy's `-O` flag:

```sh
cd <path-to-city-scrapers-repo>
scrapy crawl <spider_name> -O <path-to-meetings-viewer>/data/scrapers/<spider_name>.json
```

For example, if both repos are siblings under `~/code/`:

```sh
cd ~/code/city-scrapers-fortx
scrapy crawl fortx_council -O ~/code/meetings-viewer/data/scrapers/fortx_council.json
```

Notes:

- Use the capital `-O` flag, which overwrites the file on each run. The
  lowercase `-o` flag appends and will produce duplicate records on
  subsequent runs.
- The output filename without `.json` must match the spider's `name`
  attribute. It becomes the slug in the viewer's URL: `fortx_council.json`
  becomes `/scrapers/fortx_council`.

### Project structure

```
meetings-viewer/
├── app/
│   └── scrapers/
│       ├── page.tsx               # /scrapers
│       └── [spider]/
│           └── page.tsx           # /scrapers/:spider
├── data/
│   └── scrapers/
│       ├── .gitkeep
│       └── *.json                 # scrapy output, gitignored
└── lib/
    └── scrapers.ts                # data-source module
```

## Data shapes

### Meeting record

Each scraper's output JSON is an array of meeting records:

| Field            | Type    | Notes                                                   |
| ---------------- | ------- | ------------------------------------------------------- |
| `id`             | string  | Format: `{spider}/{timestamp}/{...}`                    |
| `title`          | string  |                                                         |
| `description`    | string  |                                                         |
| `classification` | string  | e.g. `"Board"`, `"Committee"`                           |
| `start`          | string  | `"YYYY-MM-DD HH:mm:ss"`, no timezone                    |
| `end`            | string  | `"YYYY-MM-DD HH:mm:ss"`, no timezone                    |
| `all_day`        | boolean |                                                         |
| `time_notes`     | string  |                                                         |
| `location`       | object  | `{ name: string, address: string }`                     |
| `links`          | array   | `[{ href: string, title: string }, ...]`                |
| `source`         | string  | URL of the page the meeting was scraped from            |
| `status`         | string  | `"passed"`, `"cancelled"`, or `"tentative"` (lowercase) |

### Index response

The `/scrapers` page is populated by the data-source module's
`listScrapers()` function, which returns:

```json
{
  "spiders": [{ "slug": "atl_council" }, { "slug": "charnc_meck_schools" }]
}
```

In local mode this shape is constructed at request time by listing
`data/scrapers/*.json`. There is no manifest file on disk; the directory
listing is the source of truth.

## Production Mode (planned)

When production is built, the viewer will fetch scraper output from a
dedicated public GitHub repository (`meetings-viewer-data`) populated by
GitHub Actions workflows attached to each city-scrapers repo. PR-scoped data
is created when a PR is opened and removed when the PR closes. Implementation
details are tracked in the technical specification and are not part of the
current build.

The production version reuses every component and route from the local
version. Only `lib/scrapers.ts` changes between modes.

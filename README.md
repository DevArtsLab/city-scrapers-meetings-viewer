# Meetings Viewer

A web interface for inspecting the output of city-meeting scrapers. Each
scraper lives in its own repository and emits a list of meeting records;
this app turns that JSON into a browsable, filterable table.

There are two intended modes:

- **Local** — used while developing a scraper. The scraper writes its
  output to a designated directory on disk and the viewer renders it,
  refreshing automatically on each run.
- **Production** — used to review a scraper's output during PR review,
  before the scraper is merged. The viewer pulls JSON from a GitHub
  Actions workflow attached to the open PR. No backend, no database.

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

- React + Vite
- React Router for the two routes
- No backend: the local mode reads from disk via a Vite dev-server
  middleware; the production mode reads from GitHub.

## Local development

### Requirements

- Node.js 18+
- npm

### Setup

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:5173. Opening `/` redirects to
`/scrapers`.

### Connecting a scraper

The viewer watches a directory on disk for scraper output. By default
this is `./scraper-output/` relative to the repo root. To point it at
a different directory — for example, the output folder of a scrapy
project living in another repo — set `SCRAPER_OUTPUT_DIR` when starting
the dev server:

```sh
SCRAPER_OUTPUT_DIR=/path/to/your/scrapy-project/output npm run dev
```

Each `*.json` file in that directory becomes a scraper in the index.
The filename (without `.json`) is used as the scraper name in URLs —
so `atl_council.json` shows up at `/scrapers/atl_council`.

### Typical workflow

1. Start the viewer, pointed at your scraper repo's output directory.
2. In your scraper repo, run the spider with output redirected to that
   directory:

   ```sh
   scrapy crawl atl_council -O /path/to/output/atl_council.json
   ```

3. The viewer detects the new (or updated) file and refreshes the table.

The auto-refresh is driven by Vite's file watcher — there is nothing to
configure beyond pointing the two pieces at the same directory.

## Production mode

Not yet wired up. The plan is to add a second data source implementation
behind the same interface as the local one: when a PR is opened against
a scraper repo, a GitHub Actions workflow runs the scraper and commits
its JSON output to a long-lived `scraper-data` branch under a path keyed
by the PR number. The viewer fetches those files directly from
`raw.githubusercontent.com` — no API server in between. When the PR is
merged or closed, a cleanup workflow removes the file.

The UI does not change between modes. Only `src/data/` is swapped.

## Project structure

```
src/
  main.jsx               entry
  App.jsx                routes + shell
  index.css              base styles
  pages/
    ScrapersIndex.jsx    /scrapers
    ScraperDetail.jsx    /scrapers/:name
  components/
    MeetingsTable.jsx    sortable, filterable, searchable table
    StatsBar.jsx         total + per-status counts
  data/
    dataSource.js        contract + factory
    localDataSource.js   reads from /api/scrapers (Vite middleware)
  hooks/
    useScrapers.js
    useScraperOutput.js
vite.config.js           includes the dev-server middleware
scraper-output/          default directory for local scraper output
                         (gitignored except for .gitkeep)
```

## Meeting record schema

The viewer expects each JSON file to be an array of objects with these
fields. Status values are lowercase.

| Field            | Type                                        |
| ---------------- | ------------------------------------------- |
| `id`             | string                                      |
| `title`          | string                                      |
| `description`    | string                                      |
| `classification` | string                                      |
| `start`          | string, `"YYYY-MM-DD HH:mm:ss"`             |
| `end`            | string, `"YYYY-MM-DD HH:mm:ss"`             |
| `all_day`        | boolean                                     |
| `time_notes`     | string                                      |
| `location`       | `{ name: string, address: string }`         |
| `links`          | `{ href: string, title: string }[]`         |
| `source`         | string (URL)                                |
| `status`         | `"passed"` \| `"cancelled"` \| `"tentative"` |
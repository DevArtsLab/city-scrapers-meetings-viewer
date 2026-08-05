# Implementation Tickets

Unimplemented features from the original README draft and current gaps.

## Local Mode Enhancements

### [L1] Add per-scraper summary stats to `/scrapers` in local mode

**Current state:** The `/scrapers` table has columns for slug, agency, last run status, and last run time. In local mode only the slug column is populated; the other columns show `—` placeholders.

**Desired state:** In local mode, compute and display:

- Record count (total number of meeting records in the JSON file)
- Status breakdown (counts for passed, cancelled, tentative)
- Last run time (derived from file `mtime`)

**Implementation notes:**

- Modify `listScrapers()` in `lib/scrapers.ts` to read each JSON file and compute stats
- Update `SpiderEntry` interface to include these fields (already has optional `agency`, `last_run`, `last_run_status`)
- Consider caching or lazy loading if performance becomes an issue with many scrapers

---

### [L2] Implement auto-refresh on scraper re-run

**Current state:** The viewer only re-reads files at request time (when a page is loaded or refreshed). There is no polling or automatic refresh when a scraper re-writes its output file.

**Desired state:** When a scraper re-runs and overwrites its JSON file, the viewer automatically refreshes to show the new data without requiring a manual page reload.

**Implementation notes:**

- Options to consider:
  - File system watcher (e.g., `chokidar`) to detect changes
  - Polling interval to check for file modifications
  - Server-Sent Events (SSE) or WebSocket to push updates to the client
- Evaluate trade-offs: complexity, resource usage, user experience

---

## Landing Page

### [LP1] Decide on landing page behavior

**Current state:** `/` is a landing page with a “Browse Scrapers” button linking to `/scrapers`.

**Original plan:** Opening `/` redirects to `/scrapers`. With no data loaded, the index page shows an empty table.

**Decision needed:** Keep the current landing page, or implement the original redirect behavior? If keeping the landing page, consider whether it should show any stats or summary information.

---

## Production Mode

### [P1] Implement production mode data fetching

**Current state:** Not implemented. Production mode is explicitly marked as “planned.”

**Desired state:** When production is built, the viewer fetches scraper output from a dedicated public GitHub repository (`meetings-viewer-data`) populated by GitHub Actions workflows attached to each city-scrapers repo. PR-scoped data is created when a PR is opened and removed when the PR closes.

**Implementation notes:**

- Implementation details are tracked in a separate technical specification
- Only `lib/scrapers.ts` needs to change between modes; all components and routes are reused
- Need to handle authentication, rate limiting, and error cases for GitHub API calls

ownership: msrezaie
source_owner: Code The Dream
source_url: https://docs.google.com/document/d/1EW1WqadB_EJig3qAiQkZgOUserl17OmSJST1TcFC5vQ

**![][image1]**

**Code the Dream**

**City Scrapers Development Guidelines**

_Comprehensive reference for building, testing, and contributing scrapers for public meeting data._

Version 1.1 — August 2026

# **1\. Philosophy**

Building a city scraper is a research task before it is a coding task. The mindset to bring is that of a careful analyst: understand the source first, then model the data, and finally write the code to extract it. Scraping without analysis produces brittle spiders that break silently.

## **1.1 Start With the Source, Not the Editor**

Before writing a single line of Python, open the target website in your browser and spend time with the browser's DevTools (**F12**). The goal is to understand how the page delivers its data.

> > - **Network Tab first.** Filter by XHR/Fetch requests and reload the page. Look for API calls that return JSON — these are far more reliable than scraping HTML and should always be preferred when available.
> > - **Identify all endpoints.** Click through meeting listings, detail pages, and archive sections while the Network tab is open. Copy interesting requests and replay them in Postman or curl to understand their structure, parameters, and response shape. If the calendar page returns a suspiciously low number of events — or none at all — the data may not be sourced from the page you are looking at. Check the site's XML sitemap (/sitemap.xml), robots.txt, and any secondary navigation sections (e.g., "Agendas & Minutes", "Public Notices", archived meeting indexes) for alternate data locations. Some organizations maintain their meeting records in a separate subdomain, a document management portal, or a legacy section of the site that is not linked from the main navigation.
> > - **Check authentication requirements.** Some endpoints require credentials, tokens, or session cookies. In Postman, replicate the exact headers the browser sends, including Authorization, Cookie, or custom headers like X-API-Key. Determine if credentials are static (hardcodeable) or dynamic (e.g., a session token that must be obtained by logging in first and extracting from the response).
> > - **Inspect the DOM last.** If there are no useful API endpoints, fall back to CSS selector analysis. Use the Elements tab to identify consistent class names or structural patterns around meeting titles, dates, times, locations, and attachment links.

**📌 TIP**

When testing API endpoints in Postman, try removing headers one by one to discover which are actually required. Many sites send superfluous headers in the browser that are not needed for automated requests.

## **1.2 Understanding the URL Requirements**

When a scraper request comes in, it typically specifies one or more source URLs. Understanding how these relate to each other is critical before starting analysis.

> > - **Primary (dominant) URL:** The main source for meeting data. It provides most fields — title, classification, start date/time, location, and current meeting links. The majority of parsing logic lives here.
> > - **Secondary URL:** An additional source that fills in gaps the primary source does not cover. Common uses are:

- Archived or future meeting dates not visible on the primary source.
- Meeting attachments (agendas, minutes) not linked from the primary source.

Treat the secondary source as supplemental, not authoritative. When data conflicts between sources, the primary source takes precedence unless there is a specific reason to override this. The URL rules and requirements are typically provided with the scraper request — read them carefully before beginning analysis.

## **1.3 Identifying the Spider Pattern Before Coding**

Read the URL requirements carefully before writing any code. The requirements usually tell you:

> > 1. How many agencies or departments the scraper needs to output (one vs. many).
> > 2. Whether those agencies share the same parsing logic or differ meaningfully.
> > 3. What the expected output volume and date range should be.

The answers determine whether you build a singular spider or a spider factory. Getting this decision right before coding saves significant rework.

**📌 NOTE**

The decision on whether the scraper needs to be built as a singular spider or a spider factory is more often than not predetermined by the URL requirements provided with the request. In the rare cases where it isn't clear, discuss it with your team lead before proceeding.

## **1.4 QA Mindset**

Scrapers should never be considered done until the output has been thoroughly reviewed against the source. QA is not a final step — it shapes how you build. At minimum, validate:

> > - All future meeting records visible on the source.
> > - 1–2 weeks of past meeting records (to confirm status logic and attachment links).
> > - At least one cancelled meeting, if the source has any, to confirm cancellation detection is working.
> > - That no field in the schema is accidentally populated with incorrect data (e.g., a title that contains the date, a location with the wrong address).

The QA rubric is covered in detail in Section 2.3.

---

# **2\. Methods**

This section covers the structural patterns available for building scrapers, the two main approaches to data extraction, how to handle bot-protected sites, and the QA rubric for validating output.

## **2.1 Spider Classes**

### **CityScrapersSpider (Standard Spider)**

The default base class for all scrapers. Use this whenever the source is a standard web page or API — no special authentication flow, no Legistar platform.

```
from city_scrapers_core.spiders import CityScrapersSpider
from city_scrapers_core.items import Meeting
from city_scrapers_core.constants import BOARD

class ExampleAgencySpider(CityScrapersSpider):
    name = "example_agency"
    agency = "Example Agency Name"
    timezone = "America/Chicago"
    start_urls = ["https://example.gov/meetings"]

    def parse(self, response):
        for row in response.css("table.meetings tr"):
            meeting = Meeting(
                title=row.css("td.title::text").get("").strip(),
                ...
            )
            meeting["status"] = self._get_status(meeting)
            meeting["id"] = self._get_id(meeting)
            yield meeting
```

### **LegistarSpider**

A specialized base class for scraping agencies that use the Legistar platform — a widely-used legislative management system by Granicus. Legistar exposes both a public web interface and a documented REST API.

> > - **Use the Legistar API when available.** The API endpoint follows a predictable pattern and returns well-structured JSON, making it far more reliable than scraping the HTML interface.
> > - **LegistarSpider handles pagination and detail page traversal** automatically through built-in methods your subclass can override as needed.
> > - Check whether the agency's Legistar client key is documented — it appears in the subdomain of the Legistar URL (e.g., chicago.legistar.com → client key is "chicago").

## **2.2 Spider Architecture Patterns**

### **Singular Spider**

A single spider class that produces output for one agency, or combines all agencies from a shared source into one output stream. This is the most common and simplest pattern.

Use a singular spider when:

> > - The scraper targets a single agency or department, or
> > - Multiple agencies on the same source share identical parsing logic and there is no need to run them independently.

### **Spider Factory**

The factory pattern uses a **mixin** (which contains all shared parsing logic) combined with a spider\_configs list, where each dict in the list defines a distinct spider targeting a specific agency or department on the same source.

The framework reads spider\_configs and generates separate, independently runnable spiders — each with its own name and agency — from a single file.

```
# city_scrapers/spiders/sandie_nationalcity.py

from city_scrapers.mixins import SandieNationalCityMixin

spider_configs = [
    {
        "class_name": "SandieCityCouncilSpider",
        "name": "sandie_national_council_committees",
        "agency": "San Diego National City - City Council",
        "event_type": "City Council",
    },
    {
        "class_name": "SandieBoardsCommissionsSpider",
        "name": "sandie_national_boards_commissions",
        "agency": "San Diego National City - Boards and Commissions",
        "event_type": [
            "Board of Library Trustees",
            "Planning Commission",
            "Civil Service Commission",
            ...
        ],
    },
]
```

The mixin file (e.g., city\_scrapers/mixins/sandie\_nationalcity.py) holds all parsing logic shared across those spiders. The mixin class does not have a name or start\_urls — those come from each config entry.

Use the factory pattern when:

> > - A single source hosts multiple agencies with slightly different filtering criteria (e.g., different event types, categories, or department IDs).
> > - Each agency must be runnable as a distinct spider with its own cron job, output file, and status tracking.
> > - The parsing logic is substantially shared — only the filter criteria differ between agencies.

**📌 NOTE**

The spider factory and mixin pattern means the Airtable spider registry will contain one record per spider\_configs entry, not one per file. Each name value in spider\_configs is a distinct slug.

## **2.3 Extraction Approaches**

### **CSS Selectors**

Used when meeting data is rendered directly in the HTML. The response.css() method accepts standard CSS selector syntax and returns Scrapy SelectorList objects.

```
# Get all text nodes and clean whitespace
title = " ".join(response.css("h2.meeting-title::text").getall()).strip()

# Follow a relative link
yield response.follow(link, callback=self._parse_detail)

# Extract an attribute value
href = item.css("a.agenda::attr(href)").get("")

# Get text from a tag that contains nested child elements (e.g., SVG icons)
location = next(
    (t.strip() for t in item.css("p.meeting__location::text").getall() if t.strip()),
    ""
)
```

### **API Endpoints**

When the source exposes a JSON API, use Scrapy's scrapy.Request with appropriate headers and HTTP method. Always prefer an API over HTML scraping — APIs are more stable, return clean structured data, and are far less likely to break when the site redesigns.

```
def start_requests(self):
    yield scrapy.Request(
        url="https://api.example.gov/meetings",
        method="POST",
        body=json.dumps({"year": 2025}),
        headers={"Content-Type": "application/json"},
        callback=self.parse,
    )

def parse(self, response):
    for item in response.json()["data"]:
        ...
```

### **Hybrid: CSS \+ API**

Some scrapers require both approaches. A common pattern: scrape a listing page with CSS selectors to collect meeting URLs or IDs, then hit an API endpoint with those IDs to fetch full meeting details. Use cb\_kwargs to pass data between the two phases:

```
def parse(self, response):
    for row in response.css("tr.meeting-row"):
        meeting_id = row.css("::attr(data-id)").get()
        yield scrapy.Request(
            url=self.detail_url.format(id=meeting_id),
            callback=self.parse_detail,
            cb_kwargs={"row_data": row},
        )

def parse_detail(self, response, row_data):
    # row_data carries HTML context from the listing page
    # response.json() has the detail API payload
    ...
```

## **2.4 Bypassing Bot Detection with Playwright**

Some source websites use bot detection systems (Akamai, Cloudflare, PerimeterX, etc.) that block standard HTTP requests. In these cases, scrapy-playwright allows Scrapy to drive a real Chromium browser, which passes most detection checks because it behaves like a genuine browser session.

> > - **When to use Playwright:** Only when regular Scrapy requests consistently receive 403 responses, challenge pages, or empty HTML — and the browser loads the page correctly. Always test with standard requests first.
> > - **How it works:** Playwright launches a headless Chromium instance. Scrapy yields requests with meta={"playwright": True} to route them through the browser instead of the standard HTTP client.
> > - **Cookie extraction:** For sites requiring an authenticated session, use Playwright to perform the login flow, capture the resulting session cookies from context.cookies(), convert them to a plain dict, and pass them to subsequent requests.

```
import scrapy

def start_requests(self):
    yield scrapy.Request(
        url=self.start_url,
        meta={"playwright": True, "playwright_include_page": True},
        callback=self.parse,
    )

async def parse(self, response):
    page = response.meta["playwright_page"]
    # Interact with page if needed (e.g., wait for element, click, scroll)
    await page.close()
    # Continue parsing response.text or response.css(...)
```

**⚠️ CAUTION**

Playwright adds significant overhead to scraper run time due to launching a full browser instance. Only use it when bot detection has been confirmed to block standard requests. Cookie extraction pattern: cookies \= {c\["name"\]: c\["value"\] for c in context.cookies()} — Playwright returns a list of dicts, but requests expects a plain dict.

## **2.5 The Meeting Schema — QA Rubric**

Every spider must produce Meeting items that conform to the city-scrapers schema. The following table defines the expected behavior and edge cases for each field. QA every scraper against this rubric before submitting a PR.

| Field          | Expected Behavior                             | Notes / Edge Cases                                                                                                                                                                                                                                    |
| :------------- | :-------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | String only; no date or time embedded         | Normalize if source includes date/time in the title string (e.g., strip "— January 15, 2026 at 6:00 PM")                                                                                                                                              |
| description    | Usually empty string ""                       | Only populate if explicitly provided by the source website. Do not synthesize a description.                                                                                                                                                          |
| classification | BOARD, COMMITTEE, COMMISSION, etc.            | Derive from keywords in the meeting title (e.g., "Board" → BOARD, "Committee" → COMMITTEE). Hardcode if not determinable from the title. Use NOT\_CLASSIFIED as fallback.                                                                             |
| start          | Timezone-naive datetime object                | Always strip tzinfo. Default to datetime(year, month, day, 0, 0\) (midnight) if time is unavailable. The spider's timezone attribute tells the framework the local timezone.                                                                          |
| end            | None in most cases                            | The framework defaults end to start \+ 2 hours when None. Only set explicitly if the source provides a confirmed end time.                                                                                                                            |
| all\_day       | False in nearly all cases                     | Set True only if the source explicitly designates the event as all-day. Default is False.                                                                                                                                                             |
| time\_notes    | Empty string, or a descriptive note           | When start time defaults to midnight (time unavailable), write a helpful note directing users to the meeting agenda attachment for accurate time information. Also use when location is unknown.                                                      |
| location       | {"name": "...", "address": "..."}             | name is the room/floor/building; address is the full street address. Use empty strings if unavailable. Add a time\_notes value directing users to the agenda attachment for location details when unknown.                                            |
| links          | List of {"href": "...", "title": "..."} dicts | Priority order: Agenda PDF \> Minutes PDF \> Video/Recording \> Other attachments. Always prefer PDF format. Include HTML or other formats when PDF is unavailable. The title value describes the document type (e.g., "Agenda", "Minutes", "Video"). |
| source         | URL string                                    | Prefer the meeting's specific detail page URL. The listing page URL is acceptable if no detail page exists.                                                                                                                                           |
| status         | "passed", "tentative", or "cancelled"         | passed \= start is before current datetime; tentative \= start is after current datetime; cancelled \= source explicitly confirms cancellation. A missing meeting is not sufficient evidence to mark cancelled.                                       |

#### **Title**

The title should reflect the name of the meeting body, not a description of the specific session. If the source embeds the date, time, or year in the title string, normalize it out before assigning.

> > - _Bad:_ "Board of Education Meeting \- January 15, 2026 at 6:00 PM"
> > - _Good:_ "Board of Education Meeting"

#### **Start Datetime**

Always produce a timezone-naive datetime object. The timezone attribute on the spider class declares the local timezone for the framework. Never embed tzinfo in the datetime itself.

```
from datetime import datetime

# Correct — naive datetime
start = datetime(2026, 1, 15, 18, 0)  # 6:00 PM local time

# Wrong — aware datetime (do not use)
# start = datetime(2026, 1, 15, 18, 0, tzinfo=pytz.timezone("America/Chicago"))

# When time is unknown: default to midnight and add a time_notes string
start = datetime(2026, 1, 15, 0, 0)
time_notes = "Meeting time not available; see agenda attachment for details."
```

#### **Links**

Links should be ordered by usefulness. The preferred format is always PDF. When PDF is not available, include HTML or other available formats — do not omit a link simply because it is not a PDF. The title field should describe the document type, not repeat the agency name.

> > - "title": "Agenda" — the meeting agenda (PDF preferred)
> > - "title": "Minutes" — the official meeting minutes
> > - "title": "Video" — a recording link (YouTube, Vimeo, etc.)
> > - "title": "Agenda (HTML)" — when only an HTML version is available

#### **Status**

Status is computed by self.\_get\_status(meeting), which compares the meeting's start datetime against the current datetime and returns the appropriate string. Pass the optional text= argument to enable cancellation keyword detection:

```
# Standard — always assign status at the end of your parse method
meeting["status"] = self._get_status(meeting)

# With cancellation detection — scans title_text for keywords like "CANCELLED"
meeting["status"] = self._get_status(meeting, text=title_text)
```

## **2.6 Writing Tests**

Tests are written using pytest in a consistent modular pattern. The primary purpose is functional verification: confirming the spider can parse a saved response file without errors and produces records matching expected values for key fields. Tests are also the mechanism CI uses to detect when a scraper breaks.

### **File Structure**

```
tests/
  files/
    example_agency.html          # saved HTML or JSON from the listing page
    example_agency_detail.html   # saved response from the detail page (if used)
  test_example_agency.py
```

Saved test files are captured from the live source when the spider is known to produce correct output. Commit them to the repository — they serve as the stable fixture for all future test runs.

### **Standard Test Pattern**

```
from os.path import dirname, join
from datetime import datetime

import pytest
from city_scrapers_core.utils import file_response
from freezegun import freeze_time

from city_scrapers.spiders.example_agency import ExampleAgencySpider

# Load saved response files as Scrapy response objects
test_response = file_response(
    join(dirname(__file__), "files", "example_agency.html"),
    url="https://example.gov/meetings",
)

@pytest.fixture
def spider():
    return ExampleAgencySpider()

@pytest.fixture
def parsed_items(spider):
    with freeze_time("2026-04-08"):
        return list(spider.parse(test_response))

def test_count(parsed_items):
    assert len(parsed_items) == 12

def test_title(parsed_items):
    assert parsed_items[0]["title"] == "Board of Education"

def test_start(parsed_items):
    assert parsed_items[0]["start"] == datetime(2026, 3, 10, 18, 0)

def test_status(parsed_items):
    assert parsed_items[0]["status"] == "passed"

def test_location(parsed_items):
    assert parsed_items[0]["location"] == {
        "name": "District Office",
        "address": "1234 Main St, Chicago, IL 60601",
    }
```

### **Two-Phase Test Pattern (Listing Page \+ Detail Page)**

When parse() yields Request objects (rather than Meeting items directly), use cb\_kwargs to pass listing-page data to the detail parser. The fixtures separate the two phases:

```
test_response = file_response(
    join(dirname(__file__), "files", "fortx_boards_listing.json"),
    url="https://example.gov/meetings/list",
)
test_detail = file_response(
    join(dirname(__file__), "files", "fortx_boards_detail.json"),
    url="https://example.gov/meetings/detail",
)

@pytest.fixture
def get_items(spider):
    with freeze_time("2026-03-09"):
        # Extract the cb_kwargs item dict from each yielded Request
        return [req.cb_kwargs["item"] for req in spider.parse(test_response)]

@pytest.fixture
def parsed_items(spider, get_items):
    return list(spider.parse_meeting(test_detail, item=get_items[0]))

def test_request_count(get_items):
    assert len(get_items) == 27  # 27 meetings on the listing page

def test_title(parsed_items):
    assert parsed_items[0]["title"] == "Fort Worth Boards"
```

**📌 NOTE**

Tests cover a representative couple of meeting records, not every field of every record. The goal is functional verification — confirming the spider parses without errors and that key fields (title, start, status, location) match expected values. Use freeze\_time whenever status assertions are involved so that "passed" / "tentative" results are deterministic.

---

# **3\. Contribution**

This section covers environment setup, the development workflow, and all commands used during development and code review.

## **3.1 Repository Setup**

> > 1. **Fork the repository** on GitHub. Every contribution starts from a personal fork — never commit directly to the main repository.
> > 2. **Clone your fork:** git clone https://github.com/\<your-username\>/\<repo-name\>.git
> > 3. **Select "Contribute to the parent project"** when prompted by GitHub after cloning — this ensures your fork tracks the upstream repository correctly.
> > 4. **Create a virtual environment using pipenv:** pipenv shell
> > 5. **Install all dependencies:** pipenv sync \--dev
> > 6. **Verify setup:** Run pipenv run pytest to confirm the existing test suite passes before making any changes.

**📌 NOTE**

Always work in a feature branch, never on main. Branch names should reflect the spider or fix being added (e.g., add-sandie-nationalcity or fix-losca-board-links).

## **3.2 Generating a New Spider**

Use the Scrapy genspider command to scaffold a new spider file with the correct structure:

```
scrapy genspider spider_name "Agency Full Name" https://source-url.gov
```

The generated file will be placed in city\_scrapers/spiders/. The naming convention for the spider file and its name attribute is \<prefix\>\_\<identifier\>, where the prefix is a short code for the jurisdiction or source (e.g., sandie for San Diego, losca for Los Angeles, fortx for Fort Worth).

## **3.3 Running a Spider**

To run a spider and capture its output to a JSON file for inspection:

```
scrapy crawl <spider_name> -O output.json

# Example:
scrapy crawl sandie_national_council_committees -O test.json
```

To suppress Scrapy's verbose INFO output and show only your print() statements:

```
scrapy crawl <spider_name> -O output.json -s LOG_LEVEL=WARNING
```

## **3.4 Validating Output**

The framework ships with a validate command that checks spider output against the Meeting schema:

```
scrapy validate <spider_name>
```

Run this after scrapy crawl to confirm all output items conform to the schema before writing tests.

## **3.5 Code Formatting and Linting**

All code must pass three formatting checks before a PR can be merged.

### **flake8 (Style / Lint)**

```
pipenv run flake8 .
```

### **black (Auto-formatter)**

```
# Check only — no changes written
pipenv run black . --check

# Fix a specific file
black city_scrapers/spiders/example_agency.py
```

### **isort (Import Ordering)**

```
# Check only — no changes written
pipenv run isort . --check

# Fix a specific file
isort city_scrapers/spiders/example_agency.py
```

A common workflow: write code → run black and isort to auto-fix formatting → run flake8 to catch remaining issues → commit.

## **3.6 Running Tests**

```
# Run the full test suite
pytest

# Run tests for one spider only
pytest tests/test_example_agency.py

# Run a specific test method within a file
pytest tests/test_example_agency.py -k test_title

# Run with verbose output
pytest -v
```

## **3.7 Command Reference**

| Command                                                      | Purpose                                    |
| :----------------------------------------------------------- | :----------------------------------------- |
| scrapy genspider name "Agency" URL                           | Scaffold a new spider file                 |
| scrapy crawl \<name\> \-O output.json                        | Run spider, save output to JSON            |
| scrapy crawl \<name\> \-O output.json \-s LOG\_LEVEL=WARNING | Run spider, suppress verbose Scrapy logs   |
| scrapy validate \<name\>                                     | Validate spider output against schema      |
| pipenv run flake8 .                                          | Lint entire project                        |
| pipenv run black . \--check                                  | Check formatting (no changes written)      |
| black \<file\>                                               | Auto-format a specific file                |
| pipenv run isort . \--check                                  | Check import ordering (no changes written) |
| isort \<file\>                                               | Fix import ordering in a specific file     |
| pytest                                                       | Run full test suite                        |
| pytest tests/test\_\<spider\>.py                             | Run tests for one spider                   |
| pytest \-k \<method\_name\>                                  | Run a specific test method                 |
| pytest \-v                                                   | Run tests with verbose output              |

## **3.8 PR Workflow**

When a scraper is ready for review, open a pull request against the main repository's default branch. The PR should include:

> > 1. The spider file in city\_scrapers/spiders/
> > 2. The mixin file in city\_scrapers/mixins/ (spider factory pattern only)
> > 3. Test file in tests/ with saved fixture files in tests/files/
> > 4. A PR description that identifies the spider slug(s), the source URL(s), and any notable implementation decisions

All CI checks (flake8, black, isort, pytest) must pass before the PR will be reviewed.

## **3.9 PR Review Process**

**📌 NOTE**

The steps below reflect the current team workflow. Some statuses, reviewer assignments, and branch names may evolve over time — confirm specifics with your team lead before acting on them.

Although internal process documentation can feel at odds with code documentation, capturing the full PR lifecycle here helps contributors understand what happens after they open a PR and what is expected at each stage. A scraper PR passes through three distinct review phases before it reaches production.

> > 1. **Open as a Draft.** When a scraper is ready for initial review, the PR is opened in **draft** status. This signals that the work is ready for a first pass but not yet for final merge consideration.
> > 2. **CTD-side review.** A developer from the CTD team — typically the team lead — performs the initial review. This review has two components:

- **QA check:** The reviewer runs the spider and verifies that the output data is consistent with the source website, checking it against the field rubric in Section 2.5 (titles, datetimes, links, statuses, location, etc.).
- **Code review:** The reviewer goes through the spider code and leaves feedback on any corrections or improvements needed — logic issues, style, edge case handling, test coverage, etc.

> > 3. **Address feedback and mark ready for review.** Once the contributor has addressed all of the initial feedback, the PR is moved out of draft and marked **Ready for Review**. Developers from the **PDW team** are added as reviewers at this point. The PDW team is primarily responsible for operations on the Documenters side and performs a secondary look at the scraper code along with some minor QA. (_Confirm with your team lead which specific PDW reviewers to add, as this may vary over time._) The corresponding scraper record in the Airtable backlog should also be updated to **"Ready to integrate to staging"** at this stage. (_Confirm the exact status label with your team lead._)
> > 4. **PDW review and merge to staging.** Once the PDW team completes their review, and the contributor addresses all their feedback, the PR is merged into the **staging** branch (done by the PDW team) — but the PR itself remains open. This makes the scraper output available on the staging environment of the Documenters site, where it can be evaluated in context.
> > 5. **CB-side QA on staging.** With the scraper live on staging, the **City Bureau (CB) team** performs a third round of QA, focusing on whether the output data meets the standards expected on the public-facing Documenters site. Because the PR remains open, any feedback from the CB team can be addressed by the contributor directly — new commits are pushed to the PR branch as normal, and the branch can be re-merged to staging as needed.
> > 6. **Sign-off and launch.** Once the CB team is satisfied with the scraper output, the readiness is communicated through the Airtable scrapers backlog with a status update — something like **"Ready for launch"**. (_Confirm the exact label with your team lead._) The PR is then merged into **main** and closed, at which point the scraper is live and its output begins appearing on the public-facing Documenters site.

---

# **4\. CI/CD**

This section covers how scrapers are run in production and how the project's GitHub Actions automation works — both for scheduled scraper runs and for the Airtable sync workflow triggered by new PRs.

## **4.1 System Architecture Overview**

The City Scrapers project fits into the broader Documenters.org infrastructure as the data-gathering layer. Understanding where scrapers sit in the overall system helps clarify why the CI/CD setup is structured the way it is.

> > - **Scrapers** are stored in city-specific GitHub repositories (one repo per geographic area or source cluster).
> > - GitHub **Actions** workflows in each repo run the scrapers on a daily schedule and push the output to **Azure blob storage containers**.
> > - The Azure storage output feeds the **City Scrapers ETL** (Extract, Transform, Load) process, which writes structured meeting data into a central **PostgreSQL database**.
> > - The Django application powering **Documenters.org** reads from that database to serve the public-facing website, the Documenters front-end, and the manager front-end, and to assemble and deliver outgoing notification emails.

In short: scraper output → Azure → ETL → Postgres → Documenters.org.

## **4.2 Scheduled Scraper Runs**

Each city-scrapers repository contains GitHub Actions workflows that run every spider in the repo on a scheduled cron trigger — typically once per day. The key workflow files are:

> > - **cron.yml (or scrape.yml):** The primary scheduled workflow. It iterates over every spider in the repo, runs each one with scrapy crawl, and uploads the JSON output to Azure Blob Storage. Errors are reported to Sentry.
> > - **archive.yml:** A secondary scheduled workflow that runs all scrapers daily and submits scraped URLs to the [Internet Archive's Wayback Machine](https://web.archive.org/), creating a permanent public record of the source pages at the time of scraping.

New spiders added to the city\_scrapers/spiders/ directory are automatically picked up by the scheduled workflow — no changes to the workflow file are required.

## **4.3 Airtable Slug Sync Workflow**

In addition to the scheduled scraper runs, each city-scrapers repository participates in a workflow that automatically registers new spider slugs in the team's Airtable spider registry whenever a PR is opened or updated.

### **Purpose**

QA of every newly added scraper previously required a maintainer to open each spider file by hand, locate the name and agency values — including digging through spider\_configs lists for spider factories — and manually copy them into the designated Airtable table (referred to as the "Slug table" as of the writing of this document). This process was tedious and error-prone: slugs could be mistyped, spiders inside factory configs could be missed entirely, and updates to existing scrapers required a second manual pass to keep Airtable in sync.

This workflow eliminates the manual step by extracting the relevant fields directly from the source of truth (the scraper file itself) and syncing them to Airtable automatically on every PR.

### **Where the Files Live: Core vs. Consumer Repos**

The sync automation follows a **reusable workflow** pattern: the logic lives once in city-scrapers-core, and each city repo contains only a small caller stub that invokes it. This means updates to the workflow or script propagate automatically to all consumer repos — no per-repo changes needed.

#### **city-scrapers-core (the source of truth)**

The core repo holds both the reusable workflow definition and the Python script:

> > - **.github/workflows/sync-airtable.yml** — the reusable workflow, declared with on: workflow\_call. It is never triggered directly; it is called by consumer repos. It handles checking out the consumer repo, detecting changed spider files, installing dependencies via pipenv, and running the sync script.
> > - **scripts/sync\_spiders.py** — the Python script that AST-parses spider files and upserts records to Airtable via pyairtable. At runtime, the reusable workflow checks out city-scrapers-core into a .shared-workflows/ subdirectory on the runner so this script is accessible during consumer repo workflow runs.

#### **Consumer repos (e.g. city-scrapers-colgo, city-scrapers-atl)**

Each city-specific repo contains only thin caller stubs — no copy of the script:

> > - **.github/workflows/parse-spiders.yml** — triggers on pull\_request events touching spider files. Calls the core repo's reusable parse workflow via uses: City-Bureau/city-scrapers-core/.github/workflows/....
> > - **.github/workflows/sync-airtable.yml** — triggers on workflow\_run (when the parse workflow completes). Calls the core repo's reusable sync workflow and passes the three Airtable secrets through.

### **How It Works**

The implementation uses a **two-step process** that separates untrusted code (from the PR) from privileged operations (writing to Airtable). This design is necessary because GitHub withholds repository secrets from workflows triggered by PRs opened from forks — which is how most external contributions arrive.

> > 1. **Step 1 — Parse (unprivileged), parse-spiders.yml:** Triggered by the pull\_request event in the consumer repo. It checks out the PR branch, uses tj-actions/changed-files to identify which spider files were modified, runs scripts/sync\_spiders.py (fetched from city-scrapers-core) to extract spider names and agencies using AST parsing (no code execution), and uploads the result as a JSON artifact. This workflow has no access to secrets.
> > 2. **Step 2 — Sync (privileged), sync-airtable.yml:** Triggered by the workflow\_run event in the consumer repo (fires when Step 1 completes). Because it uses workflow\_run, it always runs in the context of the _base repository's_ default branch — not the PR branch — so it safely has access to secrets. It downloads the JSON artifact from Step 1, validates the data, then writes to Airtable using the PAT stored as a repository secret. The actual logic is defined in city-scrapers-core and called via uses:.

**📌 Why two workflows?**

A single pull\_request\-triggered workflow cannot access repository secrets when the PR comes from a fork. The two-workflow artifact pattern enforces a structural trust boundary: untrusted PR code is only ever read (never executed), and the privileged Airtable write happens in an entirely separate workflow that runs on verified base-branch code.

### **The Sync Script**

The Python script scripts/sync\_spiders.py (in city-scrapers-core) handles both regular scrapers and spider factory files:

> > - **Regular scraper:** Extracts the name and agency class-level attributes from the spider class definition using Python's ast module. Only top-level class body assignments are considered — variables inside methods are ignored.
> > - **Spider factory:** Extracts the name and agency from each dict entry in the spider\_configs list. Each entry becomes a separate Airtable record.

The Airtable lookup uses the **agency name as the key** (the source of truth). For each spider found:

> > - If the agency is not in the table → a new record is created with the slug and agency name.
> > - If the agency is in the table and the slug matches → the record is skipped (no change).
> > - If the agency is in the table but the slug differs → the slug field on the existing record is updated (handles renames).

**⚠️ KNOWN LIMITATION**

If an agency string is ever edited in a spider file (e.g. to fix a typo), the script will treat it as a new agency and create a duplicate Airtable record rather than updating the existing one. The stale record requires manual cleanup. This is an accepted tradeoff — silently overwriting based on slug matching risks clobbering unrelated records, whereas a duplicate is easy to detect and fix.

### **Required Secrets**

Three secrets must be configured in each consumer repo for the sync workflow to function. To avoid per-repo setup, configure them as **organization-level secrets** scoped to the relevant repositories: **GitHub Org → Settings → Secrets and variables → Actions → New organization secret**.

| Secret name        | Value                                                                                                                       |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| AIRTABLE\_PAT      | Personal access token with data.records:read and data.records:write scopes, with access granted to the spider registry base |
| AIRTABLE\_BASE\_ID | The Airtable base ID (app...) containing the spider registry table                                                          |
| AIRTABLE\_TABLE    | The table name or table ID (tbl...) of the spider registry                                                                  |

### **Workflow File Summary**

| File              | Lives in                        | Trigger                   | Has secrets? | What it does                                                                           |
| :---------------- | :------------------------------ | :------------------------ | :----------- | :------------------------------------------------------------------------------------- |
| parse-spiders.yml | Consumer repo (stub calls core) | pull\_request             | No           | Parses changed spider files via sync\_spiders.py; uploads slug/agency JSON as artifact |
| sync-airtable.yml | Consumer repo (stub calls core) | workflow\_run             | Yes          | Downloads artifact; creates or updates Airtable records                                |
| sync\_spiders.py  | city-scrapers-core only         | Called by workflows above | —            | AST-parses spider files; upserts records to Airtable via pyairtable                    |
| cron.yml          | Consumer repo                   | Scheduled (daily cron)    | Yes          | Runs all spiders; uploads JSON output to Azure Blob Storage                            |
| archive.yml       | Consumer repo                   | Scheduled (daily cron)    | Yes          | Runs all spiders; submits scraped URLs to the Wayback Machine                          |

[image1]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAuCAYAAACBHPFSAAACx0lEQVR4Xu2Yv2sUQRzFL6aIv9AEUQR7FSxsUgo2KkhqQUVS2FkJIaliIf4DFjZqJ/hfiIggCAYto4iFaTQKwRttNOZufWN2lndvZ3X3ZvZ2lXvwmnnf3Xmf7N7dbjozx+duwkld7nhk5k8nIbbnSJIkc0c3rcHXBWC3lhrCT0cNsYMhUhAtVdXFELpZm4Tii2OINmgMUYdQwvoulfoE79U5VqsgUOAqlVGv6bxTayCw+QtPcXVfj7NqBQQ2fiVlv8ATaXZKsk3P8c1CYNOXUvK2Z2aKZzx5cxDYcEUAbuiME7IezU1L1gwENlstC2CFfJlmL0g2eghstCQAyzqjwswGzR+WrBGIWdo0uwLdZweP8hyLoT3ZwsghnEz6DWQFgC04seYZKwYogOCZyZFCOKF4zwEoxN8AfKoFAsWepwUvebLsCqQ+5DIFgHPvHz7VBcElr9B6X7IDLlMAt15GdUGsKUhXbiEHYAbv78oAVrVAWKHkeynNvufmzPYjB0Oc5PMUCR2/w7+fraJAYONdumaFsh89APt4BsfeIYDs2+tPQr+L1PVRMAQ2Xi+6Dbr5z4D1eZ2rKvRbpK5hvxMo/lluhSwrAHB+S6eprGgQZvCxwPqcyzwA0/C6rJ3g81VRFAgU/iYAZ13mAdhJmaH1H269qoIhUPirAJxxmZS3nuJj05kVuKfrVRQEgcJvBOC1y1DsnQAs8LExNTSEyf8ozXKO0g8JILuFMHeN52IoBIKvwmPNfWJozUIUAsFXQeOczODrZe58IYoCoZlKgEtBV1EIxE8qdURzp7oBrEIgLnM5za2w3heA/ToTQ0NDWHn+yrfM9v+I+MXdeeBBL6ZCISY9ZXPW42IrCMIJRTe1eOotna1DUSCsUHgPfB/+AD8wJd8FYigaRJMaQ7RFpSHgiRZ7aaYkxL/i/wLiiUIc8wy12vYzwhC/AE+bIyqsachsAAAAAElFTkSuQmCC

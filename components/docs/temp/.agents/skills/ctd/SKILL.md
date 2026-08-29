---
name: ctd
description: CTD guidance for City Scrapers projects
---

<!-- author: Code The Dream | last_updated: 2026-05-21 -->

# CTD Guidance

Use this skill when building, refactoring, or debugging Scrapy spiders for City Scrapers projects.

## Pre-Implementation Checklist

- [ ] Identify data source type (see Spider Types below)
- [ ] Check for existing mixin that can be reused
- [ ] Determine category IDs or agency identifiers
- [ ] Verify if site blocks scrapers (may need custom headers)

## Spider Types & Examples

### 1. GET + CSS Selectors

**Example**: [atconj_County_Commission](https://github.com/City-Bureau/city-scrapers-atconj/blob/main/city_scrapers/spiders/atconj_County_Commission.py)

```python
custom_settings = {"ROBOTSTXT_OBEY": False}

def start_requests(self):
    headers = {
        "User-Agent": "Mozilla/5.0 ...",
        "Sec-Fetch-Dest": "document",
    }
    yield scrapy.Request(url=self.meetings_url, headers=headers, callback=self.parse)
```

### 2. GET + POST Requests

**Example**: [fortx_Fort_Worth_City_Council](https://github.com/City-Bureau/city-scrapers-fortx/blob/main/city_scrapers/spiders/fortx_Fort_Worth_City_Council.py)

```python
yield scrapy.Request(
    url=self.api_url,
    method="POST",
    body=json.dumps(payload),
    headers={"Content-Type": "application/json"},
    callback=self.parse,
)
# Pass data between callbacks
yield scrapy.Request(url, callback=self.parse_detail, cb_kwargs={"item": item})
```

### 3. CSS Selectors Only

**Example**: [wicks_sedgwick_jcab](https://github.com/msrezaie/city-scrapers-wichita/blob/main/city_scrapers/spiders/wicks_sedgwick_jcab.py)

```python
start_urls = ["https://example.org/meetings"]
# Fixed time/location as class attributes
start = time(11, 30)
location = {"name": "Building", "address": "123 Main St"}
```

### 4. GET with Authentication

**Example**: [losca_Public_Works](https://github.com/City-Bureau/city-scrapers-losca/blob/main/city_scrapers/spiders/losca_Public_Works.py)

```python
def _get_access_token(self):
    response = requests.post(
        self.api_access_url,
        headers={"Authorization": self.api_access_token},
        data={"grant_type": "client_credentials"},
    ).json()
    return response.get("access_token")

headers = {"Authorization": f"Bearer {access_token}"}
```

### 5. Legistar Spider (ASP.NET sites)

**Example**: [losca_Metro_Transit](https://github.com/City-Bureau/city-scrapers-losca/blob/main/city_scrapers/spiders/losca_Metro_Transit.py)

```python
from city_scrapers_core.spiders import LegistarSpider

class MySpider(LegistarSpider):
    start_urls = ["https://example.legistar.com/Calendar.aspx"]

    def parse_legistar(self, events):  # NOT parse()
        for event in events:
            start = self.legistar_start(event)
            # ...
```

### 6. Spider Factory Pattern

**Examples**: [city-scrapers-tulsa PR#6](https://github.com/City-Bureau/city-scrapers-tulsa/pull/6), [city-scrapers-colgo PR#6](https://github.com/City-Bureau/city-scrapers-colgo/pull/6), [kancit_wycokck.py](https://github.com/AmirhosseinOlyaei/city-scrapers-kancit/blob/feature/kansascity-bocc/city_scrapers/spiders/kancit_wycokck.py)

When multiple spiders share the same API/source:

1. Create **mixin** in `city_scrapers/mixins/` with validation (`__init_subclass__` or metaclass)
2. Create **spider factory** in `city_scrapers/spiders/` with `spider_configs`
3. Use `type()` to dynamically create classes
4. **Required fields**: `name`, `agency`, `board_id`/`category_ids`, `location`

```python
# Option A: __init_subclass__ validation (preferred)
class MyMixin(CityScrapersSpider):
    _required_vars = ["name", "agency", "agency_id", "classification"]

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        missing = [v for v in cls._required_vars if not getattr(cls, v, None)]
        if missing:
            raise NotImplementedError(f"{cls.__name__} must define: {missing}")

# Option B: Metaclass validation
class MyMixinMeta(type):
    def __init__(cls, name, bases, dct):
        required = ["agency", "name", "board_id", "location"]
        missing = [v for v in required if v not in dct]
        if missing:
            raise NotImplementedError(f"{name} must define: {missing}")

# Spider factory with AGENCY_SUFFIX for consistent naming
AGENCY_SUFFIX = " - Unified Government of Example County"

spider_configs = [
    {"class_name": "MySpider", "name": "my_spider", "agency": "Board" + AGENCY_SUFFIX, ...},
]
def create_spiders():
    for config in spider_configs:
        attrs = {k: v for k, v in config.items() if k != "class_name"}
        globals()[config["class_name"]] = type(config["class_name"], (MyMixin,), attrs)
create_spiders()
```

### 7. Two-Stage Parsing (List → Detail)

**Example**: [white_salmon.py](https://github.com/AmirhosseinOlyaei/city-scrapers-colgo/blob/feature/colgo-white-salmon/city_scrapers/mixins/white_salmon.py)

For sites where calendar lists link to detail pages:

```python
def parse(self, response):
    """Parse calendar page, follow links to detail pages."""
    meeting_links = response.css(".calendar a::attr(href)").getall()
    for link in meeting_links:
        if self.meeting_keyword and self.meeting_keyword not in link:
            continue  # Filter by keyword
        yield scrapy.Request(response.urljoin(link), callback=self.parse_meeting)

def parse_meeting(self, response):
    """Parse individual meeting detail page."""
    meeting = Meeting(
        title=self._parse_title(response),
        # ...
        source=response.url,
    )
    yield meeting
```

## Required Standards

### No Type Hints

Do NOT use type hints in function signatures for Python version compatibility:

```python
# ❌ BAD - Avoid this
def _parse_data(self, response: scrapy.http.Response) -> Dict:

# ✅ GOOD - Use this
def _parse_data(self, response):
```

### End of Implementation

Always run before committing:

```bash
pipenv run black . && pipenv run isort . && pipenv run flake8
```

### Git Workflow

- Never auto-push - wait for user approval
- Commit with descriptive messages after linting passes

### Location/Address Handling

- Leave `name` and `address` empty ("") if not provided by API
- Do NOT hardcode default addresses that may be incorrect

### Title Cleanup

Use stacked regex patterns for robust normalization. Extract raw title at call site, pass to function:

```python
# Call site - extract raw title
raw_title = raw_event.get("eventName") or self.agency
title = self._parse_title(raw_title)

# Function - stacked regex normalization
def _parse_title(self, raw_title):
    """
    Parse or generate meeting title with robust normalization.

    Removes:
    - Any trailing parenthetical content: "Title (anything)" -> "Title"
    - Trailing dates: "Title 01.28.26" -> "Title"
    - Extra whitespace
    """
    title = raw_title
    # Remove any parenthetical content at end of string
    title = re.sub(r"\s*\([^)]*\)\s*$", "", title)
    # Remove trailing dates in various formats (01.28.26, 01/28/2026, etc.)
    title = re.sub(r"\s+\d{1,2}[./]\d{1,2}[./]\d{2,4}\s*$", "", title)
    # Collapse multiple spaces to single space
    title = re.sub(r"\s+", " ", title).strip()
    return title
```

### Classification Logic

Pass combined `title + agency` to catch keywords in either. Order matters - check higher-priority classifications first:

```python
# Call site - pass combined title + agency
classification=self._parse_classification(f"{title} {self.agency}")

# Function - simple single loop
def _parse_classification(self, title):
    """Parse classification from combined title and agency name."""
    classification_map = {
        "commission": COMMISSION,
        "board": BOARD,
        "committee": COMMITTEE,  # Keep last - other types may appear before
    }

    for keyword, classification in classification_map.items():
        if keyword in title.lower():
            return classification

    return NOT_CLASSIFIED
```

### Status Logic

```python
def _get_status(self, meeting, text=""):
    combined = f"{meeting.get('title', '')} {text}".lower()
    if "cancel" in combined:
        return CANCELLED
    return super()._get_status(meeting, text)
```

### Date Range Limits

- **years_back**: 3 (minimum historical data)
- **months_ahead**: 3 (minimum future data)
- Use `relativedelta` from dateutil

### Link Parsing

Standard link titles: `Agenda`, `Agenda Packet`, `Minutes`, `Video`

```python
def _parse_links(self, item):
    links = []
    if item.get("agenda_url"):
        links.append({"href": item["agenda_url"], "title": "Agenda"})
    if item.get("minutes_url"):
        links.append({"href": item["minutes_url"], "title": "Minutes"})
    return links
```

## Testing

1. Create fixture in `tests/files/{spider_name}.json` or `.html`
2. Use `freezegun` for date-based tests
3. Test imports from spider factory: `from city_scrapers.spiders import my_factory`
4. Run: `pipenv run pytest tests/test_{spider_name}.py -v`

## Common API Patterns

### CivicClerk API

- Base: `https://{subdomain}.api.civicclerk.com/v1/Events`
- Portal: `https://{subdomain}.portal.civicclerk.com`
- Filter: `categoryId+in+({ids})`
- Supports OData `$filter`, `$orderby`

### Legistar API

- Base: `https://webapi.legistar.com/v1/{client}`
- Use `LegistarSpider` base class
- Override `parse_legistar(self, events)`

### Tulsa City API

- POST to: `https://www.cityoftulsa.org/umbraco/surface/AgendasByBoard/GetAgendasByBoard/`
- Body: `boardID={id}&subCommitteeID=0`

### Diligent Community API

**Example**: [tulok_boed.py](https://github.com/AmirhosseinOlyaei/city-scrapers-tulsa/blob/tulok_boed/city_scrapers/spiders/tulok_boed.py)

- URL: `https://{org}.diligent.community/Services/MeetingsService.svc/meetings?from={date}&to=9999-12-31`
- Agenda: `https://{org}.diligent.community/Portal/MeetingInformation.aspx?Org=Cal&Id={id}`
- Returns JSON array directly

### Drupal Calendar (White Salmon pattern)

**Example**: [white_salmon.py](https://github.com/AmirhosseinOlyaei/city-scrapers-colgo/blob/feature/colgo-white-salmon/city_scrapers/mixins/white_salmon.py)

- URL: `https://example.gov/calendar/month/{YYYY-MM}?field_microsite_tid=All&field_microsite_tid_1={agency_id}`
- Iterate through months using `relativedelta`
- Use `meeting_keyword` to filter links

## Rate Limiting & Anti-Blocking

### For 429 (Too Many Requests):

```python
custom_settings = {
    "DOWNLOAD_DELAY": 2,  # 2 seconds between requests
    "RANDOMIZE_DOWNLOAD_DELAY": True,  # 0.5x to 1.5x delay
    "CONCURRENT_REQUESTS_PER_DOMAIN": 1,
}
```

### For 403 (Forbidden):

```python
custom_settings = {"ROBOTSTXT_OBEY": False}

headers = {
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36",
}
```

## city-scrapers-minn conventions

- **`agency` vs `dept_name`**: The `agency` spider attribute must exactly match the corresponding record title in the Airtable backlog so the sync workflow can extract slug names correctly. When a single scraper covers multiple department-level bodies (e.g., Ramsey County sub-committees), use a separate `dept_name` attribute for the human-readable department name and keep `agency` set to the Airtable backlog record title (e.g., `"Ramsey County Board"`).

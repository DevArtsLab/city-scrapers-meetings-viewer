---
name: pwd
description: Review code for bugs, style, and improvements
---

## Review Mindset

**Goal**: Improve overall code health, not achieve perfection.

### The Standard

Approve once the change clearly improves the codebase, even if not perfect.
Distinguish "must fix" from "nit" (nice-to-have).

### What to Look For

1. **Design** - Does it fit the system? Is it the right time for this change?
2. **Functionality** - Does it work? For users and developers?
3. **Complexity** - Can others understand it easily? Is it over-engineered?
4. **Tests** - Are they correct, useful, and will they catch real failures?
5. **Naming & Comments** - Clear names? Comments explain "why" not "what"?
6. **Dead/Redundant Code** - Did the change leave behind unused imports, variables, functions, methods, or classes? Are there code paths that can no longer be reached? Is any logic now duplicated or made redundant by the new code?
7. **Conciseness & Maintainability** - Can the changed code be written more concisely without sacrificing readability? Are there opportunities to use Python idioms, reduce nesting, simplify control flow, or improve structure to make it cleaner and easier to maintain?

### How to Review

1. **Understand context** - Why does this change exist?
2. **Verify against reality** - Run it, test it, check live sources
3. **Read every line** - If you can't understand it, others won't either
4. **Challenge assumptions** - What could break? What's assumed but not validated?
5. **Scan the checklist** - Use the Reference Checklist below to catch common issues
6. **Be kind** - Suggest improvements, don't just criticize. Praise what's good.

### Principles

- Solve today's problems, not speculative future ones
- Favor simplicity over cleverness
- Share knowledge - reviews are teaching opportunities

---

## Process

1. **First** - Summarize PR changes and purpose of each changed file. **List all spider names** covered by the PR in a table. **Document the code flow/structure.**
2. **Identify** - Note technologies, libraries, patterns used (e.g., Scrapy, asyncio, REST APIs)
3. **Research** - Search for best practices specific to those technologies. Expand the checklist dynamically with relevant items not listed below.
4. **Investigate** - Apply the mindset above to understand and verify
5. **Check** - Scan both the Reference Checklist AND your researched items
6. **Conclude** - Verdict with clear "must fix" vs "nit" distinction

### Example: Spider Names Table

| Spider Name                        | Agency                         |
| ---------------------------------- | ------------------------------ |
| `colgo_dalles_city_council`        | The Dalles City Council        |
| `colgo_dalles_planning_commission` | The Dalles Planning Commission |

### Example: Code Flow Diagram

Document how the code executes from entry point to output:

```
┌─────────────────────────────────────────────────────────────────┐
│                     MODULE LOAD                                  │
├─────────────────────────────────────────────────────────────────┤
│  spiders/dalles_city.py                                         │
│    └── create_spiders() called at import                        │
│          └── Dynamically creates 5 spider classes               │
│                using spider_configs + DallesCityMixin           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SPIDER EXECUTION                             │
├─────────────────────────────────────────────────────────────────┤
│  1. start_requests()                                            │
│       └── Build API URL with category_id                        │
│       └── Yield Request to API endpoint                         │
│                                                                 │
│  2. parse(response)                                             │
│       └── Parse JSON response                                   │
│       └── For each item in results:                             │
│             └── _parse_title()      → Clean title               │
│             └── _parse_start()      → Unix timestamp → datetime │
│             └── _parse_links()      → Extract video + documents │
│             └── _parse_source()     → Build source URL          │
│             └── Create Meeting item                             │
│             └── yield meeting                                   │
│       └── Handle pagination (if more pages)                     │
│             └── yield Request to next page                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        OUTPUT                                    │
│  Meeting items with: title, start, links, source, status, id    │
└─────────────────────────────────────────────────────────────────┘
```

Key patterns to document:

- **Entry point**: Where does execution start?
- **Data flow**: How does data move through the system?
- **Inheritance**: What classes/mixins are involved?
- **Factory patterns**: Are classes created dynamically?
- **Callbacks**: What is the request/response chain?

### Detailed Logic Flow Documentation

For complex PRs, provide a step-by-step explanation of how the code executes. This helps reviewers and future maintainers understand the system.

#### Step 1: Module Load (Import Time)

Explain what happens when Python imports the module:

```
┌─────────────────────────────────────────────────────────────────┐
│  When Python imports: from city_scrapers.spiders import module │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  What executes at import time?                                  │
│  - Factory functions that create classes                        │
│  - Module-level code (globals, constants)                       │
│  - Metaclass __init__ for validation                           │
│                                                                 │
│  Example: create_spiders() uses type() to dynamically create   │
│  spider classes and registers them in globals()                 │
└─────────────────────────────────────────────────────────────────┘
```

**Document:**

- What classes/functions are created dynamically?
- What validation happens (metaclass checks)?
- What gets registered where (globals, registries)?

#### Step 2: Execution Entry Point

Explain what triggers the main logic:

```
┌─────────────────────────────────────────────────────────────────┐
│  Command: scrapy crawl spider_name                              │
│                                                                 │
│  1. Scrapy finds spider class by name attribute                │
│  2. Instantiates spider                                         │
│  3. Calls start_requests() → yields initial Request(s)         │
└─────────────────────────────────────────────────────────────────┘
```

**Document:**

- How is the entry point discovered/invoked?
- What configuration affects behavior?
- What external dependencies are called?

#### Step 3: Data Transformation

Show how input data becomes output:

```
┌─────────────────────────────────────────────────────────────────┐
│  INPUT (API Response):                                          │
│  {                                                              │
│    "title": "City Council Meeting Jan 12 - Live Stream",       │
│    "date": "1768239000",                                        │
│    "documents": [{"url": "...", "type": "Agenda"}]             │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  TRANSFORMATIONS:                                               │
│  _parse_title()  → Remove "- Live Stream" suffix               │
│  _parse_start()  → Convert unix timestamp to datetime          │
│  _parse_links()  → Extract documents into [{href, title}]      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  OUTPUT (Meeting Item):                                         │
│  {                                                              │
│    "title": "City Council Meeting Jan 12",                     │
│    "start": datetime(2026, 1, 12, 17, 30),                     │
│    "links": [{"href": "...", "title": "Agenda"}]               │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

**Document:**

- What transformations are applied?
- What edge cases exist in parsing?
- What data is discarded or defaulted?

#### Step 4: Iteration & Pagination

Explain loops and recursive patterns:

```
┌─────────────────────────────────────────────────────────────────┐
│  PAGINATION LOGIC:                                              │
│                                                                 │
│  Page 1: start=0, size=100, totalSize=266                      │
│          → yield 100 items                                      │
│          → 0 + 100 < 266? YES → request page 2                 │
│                                                                 │
│  Page 2: start=100, size=100, totalSize=266                    │
│          → yield 100 items                                      │
│          → 100 + 100 < 266? YES → request page 3               │
│                                                                 │
│  Page 3: start=200, size=66, totalSize=266                     │
│          → yield 66 items                                       │
│          → 200 + 66 < 266? NO → done                           │
└─────────────────────────────────────────────────────────────────┘
```

**Document:**

- What triggers the next iteration?
- What's the termination condition?
- What happens if pagination fails mid-way?

#### Step 5: Design Decisions Table

Summarize key architectural choices:

| Decision             | Implementation                 | Why                            |
| -------------------- | ------------------------------ | ------------------------------ |
| Factory pattern      | `type()` creates classes       | Avoid 5 duplicate spider files |
| Metaclass validation | Check required attrs at import | Fail fast, not at runtime      |
| Mixin inheritance    | Shared logic in base class     | DRY - only config differs      |
| Dynamic registration | `globals()[name] = class`      | Make discoverable by Scrapy    |

#### Step 6: Configuration Differences

For factory-created classes, show what varies:

| Instance              | Config A        | Config B     | Config C |
| --------------------- | --------------- | ------------ | -------- |
| `spider_city_council` | category_id=214 | CITY_COUNCIL | -        |
| `spider_planning`     | category_id=216 | COMMISSION   | -        |
| `spider_urban`        | category_id=218 | BOARD        | -        |

### Example: Dynamic Checklist Expansion

If PR uses **datetime/timezone**:

- Research: "Python datetime timezone best practices"
- Add: naive vs aware datetime, timezone handling, `ZoneInfo` usage

If PR uses **regex**:

- Research: "Python regex best practices"
- Add: compiled patterns, catastrophic backtracking, raw strings

If PR uses **external APIs**:

- Research: "API integration best practices"
- Add: timeout handling, retry logic, rate limiting, error responses

## Reference Checklist

Starting point. Expand based on what the PR actually uses.

### Bugs

- Mutable default arguments (`def foo(x=[])` → use `None`)
- Missing null checks before accessing properties
- Dict key access without `.get()` (raises KeyError)
- Index out of bounds on lists
- Modifying list while iterating over it
- Bare `except:` catches KeyboardInterrupt (use `except Exception:`)
- Catching exceptions and silently passing (`except: pass`)
- Wrong division (`//` vs `/`)
- Comparing floats with `==` (use `math.isclose()`)
- Not using `items()` to iterate dict (using `for k in d: d[k]`)
- Assigning to built-in names (`list`, `dict`, `id`, `type`)
- Late binding closures in loops (lambda captures final value)
- Inconsistent return types from function
- Not closing files/resources (use `with` statement)
- Circular references causing memory leaks

### Code Quality

- Unused code (variables, imports, functions, comments)
- Duplicate code → extract to function (DRY)
- Long functions → split by responsibility
- Hardcoded values → use constants
- Poor naming → be descriptive (no single letters)
- Magic numbers without explanation
- Debug prints/breakpoints left in code
- Import order (stdlib → third-party → local)
- Wildcard imports (`from x import *`)
- Java-style getters/setters (just use properties)
- Using `type()` for comparison (use `isinstance()`)
- Comparing to `True`/`False`/`None` with `==` (use `is`)
- Not using unpacking (`a, b = tuple`)
- Not using `zip()` for parallel iteration
- `map()`/`filter()` with lambda → use list comprehension

### Dead/Redundant Code After Change

- Imports that were used by old code but no longer referenced after the change
- Variables or constants assigned but never read after refactoring
- Functions or methods that were called by removed/replaced code and have no other callers
- Helper classes or utilities that are now orphaned by the change
- Code paths (branches, conditions) that can no longer be reached due to new logic
- Duplicated logic where old and new implementations coexist (incomplete replacement)
- Commented-out old code left behind instead of being deleted
- Test helpers, fixtures, or test data files that only served removed functionality
- Configuration entries or settings that no longer have any effect

### Conciseness, Cleanliness & Maintainability

- Verbose conditionals that can be simplified (e.g., `if x is not None: return x` → early return pattern, or `if cond: val = True else: val = False` → `val = cond`)
- Deeply nested `if`/`for`/`try` blocks → flatten with early returns, guard clauses, or `continue`
- Repeated similar code blocks that differ only in one value → use a loop or data-driven approach
- Manual dict/list building that could use a comprehension
- Multiple lines constructing a value that could be a single expression (e.g., conditional assignment → ternary, building a list then joining → f-string)
- Overly defensive code (e.g., checking conditions that are guaranteed by upstream logic)
- Long parameter lists → consider a config dict, dataclass, or named tuple
- Methods doing too many things → extract helpers with clear names (single responsibility)
- Inconsistent patterns across similar code (e.g., one place uses `.get()`, another uses `[]` for the same access pattern)
- String formatting mix (`.format()`, `%`, f-strings) → pick one consistently (prefer f-strings)
- Unnecessary intermediate variables that are used only once and add no clarity
- Boolean logic that can be simplified (e.g., `if not x == y` → `if x != y`, De Morgan's laws)
- Using `if/elif` chains for value mapping → use a dict lookup
- Manually implementing logic that a stdlib or well-known library already provides (e.g., hand-rolling `itertools`, `collections`, `pathlib` equivalents)

### Performance

- List search in loop → use dict/set (O(n) → O(1))
- Repeated API/DB calls in loop → batch or cache
- Building string with `+=` in loop → use `''.join(list)`
- Using `list()` instead of `[]`, `dict()` instead of `{}`
- Unnecessary list comprehension in `all()`/`any()` (use generator)
- Not using `defaultdict` for grouping
- Loading entire file when streaming works

### Security

- Hardcoded secrets/passwords/API keys
- `eval()`/`exec()` with external input
- SQL without parameterized queries
- Unsanitized user input
- Pickle with untrusted data

### Tests

- Empty result not caught (`assert len(items) > 0`)
- Only happy path tested, no edge cases
- No tests for error conditions
- Test fixtures don't match real data
- Tests not isolated (shared state)
- Missing assertions (test does nothing)

### Scrapy Specific

**Spider Design:**

- Returning items instead of yielding (blocks pipeline)
- Not handling pagination or empty results
- Missing `errback` for failed requests
- Using `parse` as callback name in CrawlSpider rules
- Spider arguments not parsed (they're always strings)
- Not using Item classes (using raw dicts instead)

**Selectors:**

- Brittle XPath tightly coupled to DOM structure
- Not using `response.follow()` for relative URLs
- CSS selectors preferred over complex XPath
- Not handling missing elements (returns empty list)

**Performance:**

- No download delay (triggers rate limiting/bans)
- Not blocking unnecessary resources (images, CSS, fonts)
- Fixed `time.sleep()` instead of `DOWNLOAD_DELAY`
- Scraping rendered HTML when JSON API available

**Robustness:**

- No retry middleware for failed requests
- Not handling HTTP 403/429/503 errors
- Hardcoded URLs instead of discovering from sitemap
- Not logging errors for debugging

## Verify Output

Run the spider and validate the output:

```bash
pipenv run scrapy crawl <spider_name> -O output.json
```

### Required Fields Validation

Check each field in the output:

| Field            | Validation                                                    |
| ---------------- | ------------------------------------------------------------- |
| `title`          | Not empty, cleaned (no date prefixes, meeting numbers)        |
| `start`          | Valid datetime, reasonable date range (not year 1900 or 2099) |
| `end`            | None or after start time                                      |
| `timezone`       | Correct for location (e.g., `America/Los_Angeles`)            |
| `location`       | Has `name` and/or `address`, not empty                        |
| `links`          | Array with `href` and `title`, URLs are valid                 |
| `status`         | One of: `tentative`, `passed`, `cancelled`                    |
| `classification` | Valid constant (BOARD, COMMITTEE, COMMISSION, etc.)           |
| `source`         | Valid URL pointing to source page                             |
| `id`             | Unique across all items                                       |

### Data Quality Checks

- [ ] No duplicate IDs
- [ ] All required fields present
- [ ] Dates are reasonable (not in distant past/future unless expected)
- [ ] Links are absolute URLs (not relative)
- [ ] Title matches agency name pattern
- [ ] Location is consistent or correctly varies
- [ ] Compare sample items with source website manually

### Quick Validation Script

```python
import json
data = json.load(open('output.json'))
print(f"Total: {len(data)}, Unique IDs: {len(set(d['id'] for d in data))}")
for d in data[:3]: print(d['title'], d['start'], d['links'])
```

## Output

- Save to `PR<number>_REVIEW.md`

# Data pipeline

How city-scrapers repos feed meeting records into the meetings-viewer app.
Local mode today; production mode planned. Source of truth for the
"meetings-viewer data pipeline" diagram on the City Scrapers FigJam board.

```mermaid
flowchart LR
  subgraph repos["City scraper repos"]
    direction TB
    charnc["city-scrapers-charnc"]
    indy["city-scrapers-indianapolis"]
    minn["city-scrapers-minn"]
    joint["city-scrapers-joint-builds"]
  end

  subgraph scrape["Scrapy run"]
    spider["scrapy crawl spider_name -O output.json"]
  end

  subgraph sources["Data sources"]
    direction TB
    local[("data/scrapers/*.json local mode")]
    datarepo[("meetings-viewer-data repo production mode - planned")]
  end

  subgraph viewer["meetings-viewer Next.js app"]
    datalayer[["lib/scraper-data.ts data layer"]]
    grid["/scrapers meetings table MUI DataGrid"]
    panel["Meeting detail panel"]
    docs["/docs platform Fumadocs"]
  end

  schema{{"MeetingRecord contract: 12 fields, 4 statuses, 8 classifications"}}

  charnc --> spider
  indy --> spider
  minn --> spider
  joint --> spider
  spider -->|"writes JSON"| local
  spider -.->|"PR workflow planned"| datarepo
  local -->|"reads"| datalayer
  datarepo -.->|"fetch via raw.githubusercontent.com"| datalayer
  datalayer --> grid
  datalayer --> panel
  datalayer --> docs
  schema -.->|"contract"| datalayer

  style repos fill:#FFECBD,stroke:#FFC943
  style scrape fill:#DCCCFF,stroke:#874FFF
  style sources fill:#C2E5FF,stroke:#3DADFF
  style viewer fill:#D0F0DB,stroke:#198038
```

Open questions tracked as stickies on the board (from
`content/docs/viewer/architecture.mdx`):

- Token mechanism for cross-repo writes: PAT or GitHub App?
- Concurrent workflow runs on the data repo: retry-with-rebase, a queue, or
  an accepted race?
- Is merged-PR data preserved, or deleted with unmerged-PR data?
- Periodic sweep for orphaned PR directories whose PRs no longer exist?

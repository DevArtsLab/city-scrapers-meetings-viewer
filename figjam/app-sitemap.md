# App sitemap

Route map of the meetings-viewer Next.js app, grouped by layout. Route groups
from `app/`: `(landing)`, `(viewer)`, `(docs)`, `(keystatic)`. Source of truth
for the "meetings-viewer sitemap" diagram on the City Scrapers FigJam board.

```mermaid
flowchart LR
  root(["meetings-viewer"])

  subgraph landing["(landing) route group"]
    home["/ landing page"]
  end

  subgraph viewer["(viewer) route group"]
    index["/scrapers spider index"]
    detail["/scrapers/spider workspace: meetings table + detail panel"]
    spider404["spider not-found"]
    errBoundary["error boundary"]
  end

  subgraph docsgroup["(docs) route group"]
    docs["/docs/... Fumadocs platform"]
  end

  subgraph cms["(keystatic) route group"]
    keystatic["/keystatic/... content admin"]
  end

  global404["global not-found"]

  root --> home
  root --> index
  index -->|"click spider"| detail
  detail -->|"unknown spider"| spider404
  detail -->|"runtime error"| errBoundary
  root --> docs
  root -.->|"dev/local only"| keystatic
  root -->|"unmatched route"| global404
  home -->|"nav"| index
  home -->|"nav"| docs

  style viewer fill:#D0F0DB,stroke:#198038
  style docsgroup fill:#C2E5FF,stroke:#3DADFF
  style cms fill:#DCCCFF,stroke:#874FFF
  style landing fill:#FFECBD,stroke:#FFC943
```

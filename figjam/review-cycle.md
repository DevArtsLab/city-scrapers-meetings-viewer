# Scraper PR review cycle

Sequence view of the QA loop a scraper PR goes through: local run, viewer
check, then the three review phases from
`content/docs/qa/review-process.mdx` (CTD review, PDW review, CB staging QA).

```mermaid
sequenceDiagram
    title Scraper PR review cycle
    participant Contributor
    participant Spider
    participant MeetingsViewer
    participant CTDReview
    participant PDWReview
    participant CBStagingQA

    Contributor->>Spider: scrapy crawl name -O out.json
    Spider-->>Contributor: meeting records JSON
    Contributor->>MeetingsViewer: load data/scrapers
    MeetingsViewer-->>Contributor: table + detail panel
    Contributor->>CTDReview: open PR
    CTDReview->>MeetingsViewer: run spider, compare to rubric
    MeetingsViewer-->>CTDReview: QA result
    CTDReview-->>Contributor: changes or approval
    CTDReview->>PDWReview: hand off
    PDWReview-->>Contributor: secondary review feedback
    PDWReview->>CBStagingQA: merge to staging
    CBStagingQA-->>Contributor: data QA feedback on same PR
    CBStagingQA-->>PDWReview: sign off, ready for launch
```

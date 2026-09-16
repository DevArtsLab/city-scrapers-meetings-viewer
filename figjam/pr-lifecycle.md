# Scraper PR lifecycle

The multi-phase PR lifecycle for a scraper, from draft to launch. Mirrors
`content/docs/qa/review-process.mdx` and the Airtable tracking described in
`content/docs/pipeline/airtable-sync.mdx`.

```mermaid
flowchart LR
    draft(["Draft PR opened"]) --> ctd{"CTD review"}
    ctd -->|"QA + code review approved"| pdw{"PDW review"}
    ctd -->|"changes requested"| fix1["Contributor pushes fixes"]
    fix1 --> ctd
    pdw -->|"approved"| staging["Merge to staging"]
    pdw -->|"changes requested"| fix2["Contributor pushes fixes"]
    fix2 --> pdw
    staging --> cb{"CB staging QA"}
    cb -->|"data QA passes"| launch(["Ready for launch"])
    cb -->|"feedback on same PR"| fix3["Fixes on same branch"]
    fix3 --> staging
    draft -.->|"auto-creates backlog entry"| airtable["Airtable backlog mirrors lifecycle"]

    style airtable fill:#F8F5FF,stroke:#874FFF
```

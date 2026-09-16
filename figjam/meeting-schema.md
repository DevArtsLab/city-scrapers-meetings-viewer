# MeetingRecord schema

ER view of the `MeetingRecord` contract from `lib/scraper-data.ts` plus the
status/classification vocabularies from `docs-platform/generated/
meeting-schema.json`. Regenerate the vocabularies with `npm run docs:schema`.

```mermaid
erDiagram
    direction LR
    MeetingRecord {
        string id PK
        string title
        string description
        string classification FK
        string start "naive datetime YYYY-MM-DD HH:mm:ss"
        string end "defaults to start + 2h"
        boolean all_day
        string time_notes
        string source
        string status FK
    }
    Location {
        string name
        string address
    }
    Link {
        string href
        string title
    }
    StatusVocab["status vocabulary"]
    ClassificationVocab["classification vocabulary"]
    MeetingRecord ||--|| Location : "has one"
    MeetingRecord ||--o{ Link : "priority ordered"
    MeetingRecord }o--|| StatusVocab : "one of 4 values"
    MeetingRecord }o--|| ClassificationVocab : "one of 8 values"
```

Status values: `cancelled`, `tentative`, `confirmed`, `passed`.

Classification values: Advisory Committee, Board, City Council, Commission,
Committee, Forum, Police Beat, Not classified.

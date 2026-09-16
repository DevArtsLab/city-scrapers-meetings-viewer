# Meeting status lifecycle

The four `status` values a meeting record can carry and how a record moves
between them. Derivation lives in the base spider's `_get_status`; see
`content/docs/qa/schema.mdx`.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Tentative: start is in the future
    [*] --> Confirmed: source confirms meeting
    Tentative --> Passed: start passes now
    Confirmed --> Passed: start passes now
    Tentative --> Cancelled: source confirms cancellation
    Confirmed --> Cancelled: source confirms cancellation
    Passed --> [*]
    Cancelled --> [*]
```

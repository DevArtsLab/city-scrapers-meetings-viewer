---
name: global-rules
description: Always-on behavioral constraints for CTD agents covering file operations, commit rules, and punctuation guidelines
---

# CTD Agent Global User Rules

Persisted across all projects for CTD agents.

## File Operations

When moving, renaming, or migrating files and folders, always use git commands (e.g., `git mv`) instead of standard filesystem operations to preserve git history and maintain proper version control tracking.

## Commit Rules

Never stage or commit in any session or chat with any model in any ACP provider, claude code, devin, windsurf, cascade, cursor, or any other chat or code editor without explicit clear request or instruction. If they were already staged or committed, do not undo them.

## Punctuation Guidelines

Use only ASCII-friendly punctuation. Do NOT use em dashes, en dashes, or middle dots. Replace with colons (:), pipes (|), commas (,), semicolons (;), or hyphens (-) depending on context. Non-ASCII characters can be garbled by ATS parsers.

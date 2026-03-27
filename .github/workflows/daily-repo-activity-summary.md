---
name: Daily Repo Activity Summary
description: Generate a daily issue summarizing repository activity in the last 24 hours.
on:
  schedule: daily
permissions:
  contents: read
  issues: read
  pull-requests: read
  metadata: read
safe-outputs:
  create-issue:
    title-prefix: "[daily activity] "
    max: 1
network: {}
tools:
  github:
    toolsets: [repos, issues, pull_requests, search, context]
---

# Daily Repository Activity Summary

You are an automation agent that creates a single GitHub issue summarizing repository activity from the last 24 hours.

## Task

1. Review repository activity for the last 24 hours, focusing on:
   - Issues opened or closed.
   - Pull requests opened, closed, or merged.
   - Notable activity such as high-comment threads, reopened items, or items with high-priority labels.
2. Use GitHub API data to collect details. Only include items that occurred within the last 24 hours.
3. Prepare a concise summary issue using the safe output `create-issue`.

## Output Requirements

- Title should use the configured prefix and be concise (e.g., "[daily activity] 2026-02-04 Repo Summary").
- Body must follow the reporting format guidelines:
  - Use `###` headers or lower.
  - Provide a summary section with key counts.
  - Use `<details>` sections for lists of issues and PRs.
  - Include any interesting activity in its own section.
- Include links to each issue or PR.
- If there is no activity, explicitly say so and still create the issue.

## Data Collection Guidance

- Use ISO timestamps and compare against "now" minus 24 hours.
- Focus on the default branch for PRs unless activity indicates otherwise.
- Use `search` toolset queries to find issues and PRs updated within the time window.
  - Example issue query: `repo:${{ github.repository }} is:issue updated:>=TIMESTAMP`
  - Example PR query: `repo:${{ github.repository }} is:pr updated:>=TIMESTAMP`

## Safety

- Do not include secrets or internal notes.
- Only create one issue per run.

---
emoji: "📱"
name: Multi-Device Site Tester
description: Test the frontend website across mobile, tablet, and desktop resolutions.
on:
  schedule:
    - cron: "0 9 * * 1"
  workflow_dispatch:
    inputs:
      devices:
        description: "Device types to test (comma-separated: mobile,tablet,desktop)"
        required: false
        default: "mobile,tablet,desktop"
permissions:
  contents: read
  issues: read
  pull-requests: read
tracker-id: multi-device-site-tester
max-turns: 70
strict: true
runtimes:
  node:
    version: "24"
tools:
  github:
    mode: gh-proxy
  playwright:
    mode: cli
  bash:
    - "make install*"
    - "make build*"
    - "cd*"
    - "npm run preview*"
    - "nohup*"
    - "curl*"
    - "cat*"
    - "echo*"
    - "sleep*"
    - "playwright-cli*"
safe-outputs:
  create-issue:
    labels: [testing, automated]
network:
  allowed:
    - node
    - chrome
    - playwright
pre-agent-steps:
  - name: Install dependencies
    env:
      EXPR_GITHUB_WORKSPACE: ${{ github.workspace }}
    run: |
      cd "$EXPR_GITHUB_WORKSPACE"
      make install
  - name: Build application
    env:
      EXPR_GITHUB_WORKSPACE: ${{ github.workspace }}
    run: |
      cd "$EXPR_GITHUB_WORKSPACE"
      make build
  - name: Configure Playwright CLI launch options
    env:
      EXPR_GITHUB_WORKSPACE: ${{ github.workspace }}
    run: |
      mkdir -p "$EXPR_GITHUB_WORKSPACE/.playwright"
      cat > "$EXPR_GITHUB_WORKSPACE/.playwright/cli.config.json" <<'EOF'
      {
        "browser": {
          "launchOptions": {
            "chromiumSandbox": false,
            "args": ["--no-sandbox", "--disable-setuid-sandbox"]
          }
        }
      }
      EOF
  - name: Start frontend preview server
    env:
      EXPR_GITHUB_WORKSPACE: ${{ github.workspace }}
    run: |
      mkdir -p /tmp/gh-aw
      cd "$EXPR_GITHUB_WORKSPACE/frontend"
      nohup npm run preview -- --host 0.0.0.0 --port 5137 > /tmp/gh-aw/frontend-preview.log 2>&1 &
  - name: Wait for frontend preview server
    run: |
      MAX_WAIT=120
      WAITED=0
      until curl -sf http://localhost:5137/ > /dev/null 2>&1; do
        WAITED=$((WAITED + 3))
        if [ "$WAITED" -ge "$MAX_WAIT" ]; then
          echo "Server log:" && cat /tmp/gh-aw/frontend-preview.log
          echo "Preview server failed to start after ${MAX_WAIT}s."
          exit 1
        fi
        sleep 3
      done
      echo "Frontend preview is ready."
---

# Multi-Device Website Testing

You are a website testing specialist. Test this repository's frontend website across multiple device resolutions.

## Context

- Repository: `${{ github.repository }}`
- Triggered by: @${{ github.actor }}
- Devices to test: `${{ inputs.devices }}`
- Website URL: `http://localhost:5137/`

**MANDATORY:** Before finishing, you must call either `create-issue` (if problems are found) or `noop` (if all checks pass or testing is blocked).

## Task

The frontend preview server is already running and healthy at `http://localhost:5137/`.
Do not rebuild or restart it unless you determine the site is unavailable, and if infrastructure prevents testing, use `noop` with a concise blocked reason.

1. Use `playwright-cli` with config `${{ github.workspace }}/.playwright/cli.config.json`.
2. Test requested device categories:
   - Mobile: iPhone 12 (390x844), Pixel 5 (393x851), Galaxy S21 (360x800)
   - Tablet: iPad (768x1024), iPad Pro 11 (834x1194)
   - Desktop: 1366x768, 1920x1080, 2560x1440
3. For each tested viewport, verify:
   - Landing page loads without errors.
   - Main navigation and key links/buttons are usable.
   - No major overflow, truncation, or layout breakage.
   - No blocking console errors.
4. Capture concise findings by severity (critical/warning/passed).

## Reporting

- If issues are found, call `create-issue` with:
  - Title: `🔍 Multi-Device Site Testing Report - [Date]`
  - Body including test summary, impacted devices, issue severities, and recommended fixes.
- If no issues are found (or testing is blocked by infrastructure), call `noop` with a concise completion message.

Keep the report concise and actionable.

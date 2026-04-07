---
description: Reads Dependabot alerts and creates a PR with dependency updates to resolve them.
on:
  schedule: weekly
  skip-if-match: 'is:pr is:open in:title "dependabot-remediation"'
permissions:
  contents: read
  issues: read
  pull-requests: read
tools:
  github:
    toolsets: [default]
network:
  allowed:
    - defaults
    - node
steps:
  - name: Fetch Dependabot alerts
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: |
      mkdir -p /tmp/gh-aw/agent
      gh api repos/${{ github.repository }}/dependabot/alerts \
        --jq '[.[] | select(.state == "open") | {number, severity: .security_vulnerability.severity, package: .security_vulnerability.package.name, vulnerable_range: .security_vulnerability.vulnerable_version_range, patched_versions: .security_vulnerability.first_patched_version.identifier, title: .security_advisory.summary, ghsa: .security_advisory.ghsa_id}]' \
        > /tmp/gh-aw/agent/dependabot-alerts.json 2>&1 || true
  - name: Install dependencies
    run: |
      npm ci 2>&1 | tail -50 > /tmp/gh-aw/agent/npm-install.log || true
safe-outputs:
  create-pull-request:
    max: 1
  noop:
---

# Dependabot Remediation

You are an AI agent that resolves open Dependabot security alerts by updating vulnerable dependencies and creating a pull request with the fixes.

## Your Task

1. Read `/tmp/gh-aw/agent/dependabot-alerts.json` to see the current open Dependabot alerts.
2. If there are no open alerts, call the `noop` safe output with a message like "No open Dependabot alerts — nothing to fix." and stop.
3. For each alert, attempt to resolve it by updating the affected package:
   - Run `npm audit fix` first to apply automatic safe fixes.
   - For remaining alerts, try updating specific packages with `npm install <package>@<patched_version>`.
   - If a major version bump is required, evaluate whether it is safe by checking for breaking changes. Only apply major bumps if the changelog indicates backward compatibility or the change is straightforward.
4. After making changes, run `npm audit` to verify which alerts were resolved.
5. Run `npm run build` to confirm the project still builds successfully. If the build fails, revert the change that caused the failure and move on.
6. Create a pull request with all successful updates.

## Pull Request Format

### Title

`fix(deps): dependabot-remediation — resolve security alerts`

### Body

```
### 🔒 Dependabot Remediation

This PR addresses open Dependabot security alerts by updating vulnerable dependencies.

### Changes

| Package | From | To | Severity | Advisory |
|---------|------|----|----------|----------|
| package-name | old-ver | new-ver | critical/high/moderate/low | GHSA-xxxx |

### Verification

- [ ] `npm audit fix` applied
- [ ] `npm run build` passes
- [ ] No breaking changes detected

### Alerts Not Resolved

List any alerts that could not be automatically resolved and why.

> ⚠️ Please review these dependency changes before merging. Automated updates may introduce breaking changes.
```

## Guidelines

- **Never auto-merge.** Always create a PR for human review.
- Be conservative: prefer patch and minor version bumps over major version bumps.
- If `npm audit fix` resolves everything, prefer that over manual package upgrades.
- If a fix introduces build failures, revert it and document why in the PR body.
- Group all fixes into a single PR to minimize review overhead.
- Attribute the work to the humans maintaining the repository — this workflow is a tool to assist them.
- Use `--package-lock-only` if full installation causes issues, then commit the updated `package-lock.json`.
- If there was nothing to fix (no open alerts), call the `noop` safe output instead of creating an empty PR.

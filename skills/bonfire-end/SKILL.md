---
name: bonfire-end
description: End session - update context and sync to Tasks
license: MIT
allowed-tools: Bash(git:*), Bash(gh pr view:*), Bash(gh issue view:*), Read, Write, Glob, Grep, AskUserQuestion
metadata:
  author: vieko
  version: "3.0.0"
---

# End Session

Git root: !`git rev-parse --show-toplevel`

## Step 1: Review Session Work

Review what was accomplished this session by examining:
- Recent git commits
- Files changed
- Conversation context

## Step 2: Update Session Context

Update `<git-root>/.bonfire/index.md`:

1. Update the session entry with:
   - **Accomplished**: List what was completed
   - **Decisions**: Key decisions made and rationale
   - **Files Modified**: Important files changed (if relevant)
   - **Blockers**: Any issues encountered

2. Update "Next Session Priorities" based on remaining work

3. Update "Current State" to reflect new status

## Step 3: Update Codemap

Update the "Codemap" section in `index.md` with files referenced this session:

1. **Identify key files** from this session:
   - Files you read or edited
   - Files mentioned in commits
   - Files central to the work done

2. **Update "This Session's Key Files"**:
   - List up to 10 most relevant files
   - Include brief description of what each does
   - Format: `- \`path/to/file.ts\` - Brief description`

3. **Preserve user-curated sections**:
   - Keep "Entry Points" as-is (user maintains these)
   - Keep "Core Components" as-is (user maintains these)

4. **Keep it concise**:
   - Only include files directly relevant to session work
   - Remove stale entries from previous sessions
   - Max 10 files in "This Session's Key Files"

Example:
```markdown
## Codemap

**Entry Points** (user-curated):
- `src/index.ts` - Main entry

**Core Components** (user-curated):
- `src/commands/` - CLI commands

**This Session's Key Files** (auto-updated):
- `claude/skills/configure/SKILL.md` - Project configuration
- `claude/skills/end/SKILL.md` - Session end workflow
- `.bonfire/specs/feature.md` - Feature specification
```

## Step 4: Sync to Tasks

Sync "Next Session Priorities" to the Tasks system for cross-session persistence:

1. **Convert priorities to tasks**:
   - Each priority in index.md becomes a task
   - Preserve task descriptions and context
   - Mark completed items as done

2. **Task list continuity**:
   - Tasks persist automatically across sessions
   - New session will see these without needing to read index.md
   - index.md provides the "why", Tasks provide the "what"

3. **Keep in sync**:
   - If priority was completed this session, mark task done
   - If new priority emerged, add as new task
   - Don't duplicate existing tasks

**Note**: Tasks complement index.md - they don't replace it. index.md captures decisions, context, and history. Tasks capture actionable work items.

## Step 5: Commit Changes (if tracked)

Read `<git-root>/.bonfire/config.json` to check `gitStrategy`.

**If gitStrategy is "ignore-all"**: Skip committing - nothing is tracked. Tell the user session context was updated locally.

**If gitStrategy is "hybrid" or "commit-all"**:

1. **Check what can be staged**: Run `git status .bonfire/` to see what files are not ignored
2. **NEVER use `git add -f`** - if a file is gitignored, respect that
3. **Stage only unignored files**:
   ```bash
   git add .bonfire/
   ```
4. **Check if anything was staged**: Run `git diff --cached --quiet .bonfire/`
   - If nothing staged (exit code 0), tell user "Session context updated locally (files are gitignored)"
   - If changes staged, commit:
     ```bash
     git commit -m "docs: update session context"
     ```

If the commit fails due to hooks, help resolve the issue (but never bypass hooks with `--no-verify`).

## Step 6: Context Health Check (Background)

Run garbage detection to identify stale references. Do not block session completion.

Tell user: "Running context health check..."

### 6.1 Broken File References

Scan all `.md` files in `.bonfire/` for internal file paths:
- Markdown links: `[text](path/to/file.md)` (excluding http/https URLs)
- Archive links in "Archived Sessions" section
- Codemap entries

For each path found, verify the file exists relative to git root.

**Detection command**:
```bash
# Extract markdown links and check existence
grep -ohE '\[.*?\]\(([^)]+)\)' .bonfire/*.md .bonfire/**/*.md 2>/dev/null | \
  grep -oE '\(([^)]+)\)' | tr -d '()' | grep -v '^http' | sort -u
```

Then check each path with file existence.

### 6.2 Stale External Links

Find GitHub PR/issue references and check their status:

```bash
# Extract GitHub PR/issue URLs
grep -ohE 'github\.com/[^/]+/[^/]+/(pull|issues)/[0-9]+' .bonfire/*.md .bonfire/**/*.md 2>/dev/null | sort -u
```

For each PR/issue found:
```bash
gh pr view [NUMBER] --json state,mergedAt,closedAt 2>/dev/null
gh issue view [NUMBER] --json state,closedAt 2>/dev/null
```

**Stale criteria**: State is MERGED or CLOSED AND older than 30 days.

If `gh` command fails (not installed/authenticated), skip this check and note: "Skipped external link check (gh CLI unavailable)"

### 6.3 Orphaned Specs

Read `specsLocation` from `.bonfire/config.json` (default: `.bonfire/specs/`).

List all spec files and check if each is referenced in `index.md` or `archive/*.md`.

```bash
# List specs
ls -la .bonfire/specs/*.md 2>/dev/null

# Search for references
grep -l "specs/[filename]" .bonfire/index.md .bonfire/archive/*.md 2>/dev/null
```

**Orphaned criteria**: Spec file exists, is older than 30 days, and not referenced anywhere.

### 6.4 Archive Integrity

Extract archive links from index.md "Archived Sessions" section and verify each file exists.

### 6.5 Report Results

Display consolidated report:

```
=== CONTEXT HEALTH CHECK ===

✓ File references: [N] checked, [N] broken
✓ External links: [N] checked, [N] stale
✓ Specs: [N] checked, [N] orphaned
✓ Archive integrity: [N] checked, [N] issues

[If issues found:]
ISSUES FOUND:

BROKEN REFERENCES:
- index.md: Link to `archive/missing.md` (file not found)

STALE EXTERNAL LINKS (closed 30+ days):
- PR #29 (merged 72 days ago)

ORPHANED SPECS:
- .bonfire/specs/unused.md (created 45 days ago, never referenced)

To fix: Review items above and update index.md manually,
or run /bonfire-archive to clean up completed work.
```

If no issues found:
```
=== CONTEXT HEALTH CHECK ===
✓ All clear - no garbage detected
```

## Step 7: Confirm

Summarize:
- What was documented
- Tasks synced for next session
- Next priorities
- Any follow-up needed

Let the user know they can run `/bonfire-archive` when this work is merged and complete.

---
description: End session - update context and commit changes
allowed-tools: Bash(git:*), Bash(rm:*), Bash(mv:*), Bash(mkdir:*), Bash(*/duration.sh:*), Read, Write, Glob, AskUserQuestion
model: haiku
---

# End Session

## Step 1: Find Git Root

Run `git rev-parse --show-toplevel` to locate the repository root.

## Step 1.5: Check Session Duration Tracking

Read `<git-root>/.bonfire/config.json`. If `trackSessionDuration` is `true` and `sessionStartTime` exists:

1. Calculate duration using the helper script:
   ```bash
   <plugin-dir>/scripts/duration.sh "<sessionStartTime>"
   ```
   Output format: "1h 23m" or "45m"
2. Store this duration to include in the session entry header
3. Clear `sessionStartTime` from config.json (set to `null`)

## Step 2: Review Session Work

Review what was accomplished this session by examining:
- Recent git commits
- Files changed
- Conversation context

## Step 3: Update Session Context

Update `<git-root>/.bonfire/index.md`:

1. Update the session entry header. If duration was calculated in Step 1.5, include it:
   ```markdown
   ### Session 15 - 2026-01-06 (1h 23m)
   ```
   If no duration tracking, use the standard format:
   ```markdown
   ### Session 15 - 2026-01-06
   ```

2. Update the session entry with:
   - **Accomplished**: List what was completed
   - **Decisions**: Key decisions made and rationale
   - **Files Modified**: Important files changed (if relevant)
   - **Blockers**: Any issues encountered

3. Update "Next Session Priorities" based on remaining work

4. Update "Current State" to reflect new status

## Step 4: Manage Session Scripts

Check if `<git-root>/.bonfire/scripts/` exists and contains any files.

**If scripts exist**, use AskUserQuestion to ask what to do with each script:

"What should happen to these session scripts?" (Header: "Scripts", multiSelect: false)

For each script found, present options:
- **Keep** - Leave in `.bonfire/scripts/` for next session
- **Move to project** - Move to `<git-root>/scripts/` (create if needed)
- **Delete** - Remove the script

Execute the user's choices:
- **Keep**: No action needed
- **Move to project**: `mkdir -p <git-root>/scripts/ && mv <script> <git-root>/scripts/`
- **Delete**: `rm <script>`

**If no scripts exist**, skip this step.

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

## Step 6: Confirm

Summarize:
- What was documented
- Next priorities
- Any follow-up needed

Let the user know they can run `/bonfire:archive` when this work is merged and complete.

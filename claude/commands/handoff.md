---
description: Hand off session to new Claude instance when approaching context limits
allowed-tools: Bash(git:*), Bash(tmux:*), Read, Write, Glob
model: haiku
---

# Session Handoff

Hand off the current session to a fresh Claude instance, preserving work state.

## Step 1: Verify Environment

Check if running inside tmux:

```bash
[ -n "$TMUX" ] && echo "tmux: yes" || echo "tmux: no"
```

**If not in tmux**: Abort with message:
> "Handoff requires tmux to spawn a new Claude session. Either:
> 1. Start Claude inside tmux and try again
> 2. Manually open a new terminal and paste the handoff context from `.bonfire/handoff/context.md`"

## Step 2: Find Git Root

```bash
git rev-parse --show-toplevel
```

## Step 3: Verify Bonfire Exists

Check if `<git-root>/.bonfire/index.md` exists.

**If not**: Abort with message:
> "No .bonfire/ directory found. Run `/bonfire:start` first to initialize session tracking."

## Step 4: Check for Uncommitted Changes

```bash
git status --porcelain
```

**If uncommitted changes exist**: Warn the user:
> "Note: You have uncommitted changes. The new session will see them. Consider committing or stashing before handoff."

Ask if they want to proceed anyway.

## Step 5: Update index.md

Read `<git-root>/.bonfire/index.md` and update the current session entry:

1. **Add HANDOFF marker** to session title:
   ```markdown
   ### Session N - DATE (HANDOFF)
   ```

2. **Add "In Progress at Handoff"** section:
   ```markdown
   **In Progress at Handoff**:
   - [What was actively being worked on]
   - [Current state of that work]
   ```

3. **Add handoff metadata**:
   ```markdown
   **Handoff Reason**: Approaching context limit
   **Continued In**: Next session
   ```

4. **Update "Next Session Priorities"** with the immediate work that needs to continue.

5. **Update Codemap** "This Session's Key Files" with files relevant to current work.

## Step 6: Generate Handoff Context

Create `<git-root>/.bonfire/handoff/` directory if it doesn't exist.

Write `<git-root>/.bonfire/handoff/context.md` with minimal context (~1K tokens max):

```markdown
# Session Handoff Context

**Date**: [CURRENT_DATE]
**Branch**: [current git branch]
**Repository**: [repo name from package.json or directory name]

## Current Task

[1-2 sentences describing what was actively being worked on when handoff triggered]

## Immediate Next Steps

1. [First priority - most urgent continuation]
2. [Second priority]
3. [Third priority if applicable]

## Key Context

- [Critical decision or constraint affecting the work]
- [Important file or component being modified]
- [Any blockers or considerations for new session]

## Uncommitted Changes

[List modified files from git status, or "None" if clean]

---

**Instructions for new session**: Run `/bonfire:start` to load full session context from `.bonfire/index.md`.
```

Keep this file under 1000 tokens. Focus on what's needed to continue immediately, not history.

## Step 7: Add handoff/ to .gitignore

Read `<git-root>/.bonfire/.gitignore` and add `handoff/` if not present:

```
handoff/
```

Handoff context is transient and should not be committed.

## Step 8: Spawn New Claude Session

Run the tmux command to spawn a new pane (horizontal split):

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
tmux split-window -h -c "$REPO_ROOT" \
  "claude --append-system-prompt \"\$(cat $REPO_ROOT/.bonfire/handoff/context.md)\" 'Continuing from session handoff. Please run /bonfire:start to load the full session context.'"
```

This creates a new pane to the right of the current pane, keeping both sessions visible during handoff.

## Step 9: Confirm Handoff

Tell the user:

> **Handoff complete.**
>
> - Session state saved to `.bonfire/index.md`
> - Handoff context written to `.bonfire/handoff/context.md`
> - New Claude session spawned in adjacent pane
>
> The new session will run `/bonfire:start` to load your full session history.
>
> You can close this pane when ready, or keep both visible during transition.

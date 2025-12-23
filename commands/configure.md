---
description: Change project settings (models, git strategy)
allowed-tools: Bash(git:*), Read, Write, AskUserQuestion
model: haiku
---

# Configure Sessions

## Step 1: Find Git Root

Run `git rev-parse --show-toplevel` to locate the repository root.

## Step 2: Check for Sessions Directory

If `<git-root>/.sessions/` does not exist, tell the user to run `/sessions:start` first.

## Step 3: Read Current Config

Read `<git-root>/.sessions/config.json` to show current settings.

If config.json doesn't exist, use defaults:
```json
{
  "models": {
    "plan": "inherit",
    "document": "inherit",
    "review": "inherit"
  },
  "gitStrategy": "ignore-all"
}
```

## Step 4: Ask Configuration Questions

Use the AskUserQuestion tool to ask ALL configuration questions at once:

```
Question 1: "Which model for /sessions:plan?"
Header: "Plan"
Options:
- inherit (Recommended) - Use conversation model
- opus - Deep architectural reasoning
- sonnet - Balanced speed/quality
- haiku - Fast, lightweight

Question 2: "Which model for /sessions:document?"
Header: "Document"
Options: (same as above)

Question 3: "Which model for /sessions:review?"
Header: "Review"
Options: (same as above)

Question 4: "Which git strategy for .sessions/?"
Header: "Git"
Options:
- Ignore all (Recommended) - Keep sessions completely local, private
- Hybrid - Commit docs/plans, keep working notes private
- Commit all - Share everything with team
```

## Step 5: Update Config

Write the updated `<git-root>/.sessions/config.json`:
```json
{
  "models": {
    "plan": "<user-answer>",
    "document": "<user-answer>",
    "review": "<user-answer>"
  },
  "gitStrategy": "<user-answer>"
}
```

## Step 6: Update Git Strategy

If git strategy changed, update `<git-root>/.sessions/.gitignore`:

**Ignore all**:
```
*
!.gitignore
```

**Hybrid**:
```
*
!.gitignore
!docs/
!docs/**
!plans/
!plans/**
```

**Commit all**:
```
data/
scratch/
```

If switching FROM commit/hybrid TO ignore:
- Warn user that existing tracked files will remain tracked
- Offer to run: `git rm -r --cached .sessions/`

## Step 7: Confirm

Report:
- Settings updated
- Any manual steps needed (git cleanup)
- New configuration summary

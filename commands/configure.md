---
description: Change plugin settings (models, per-project options)
allowed-tools: Bash(git:*), Read, Write, Glob, AskUserQuestion
model: haiku
---

# Configure Sessions

## Step 1: Determine Scope

Based on $ARGUMENTS:
- No args or `--global`: Configure global model settings
- `--project`: Configure per-project settings only
- `--all`: Configure both global and project settings

## Step 2: Global Configuration (Models)

Use the AskUserQuestion tool to ask all three model preferences at once:

```
Question 1: "Which model for /sessions:plan?"
Header: "Plan Model"
Options:
- inherit (Recommended) - Use conversation model
- opus - Deep architectural reasoning
- sonnet - Balanced speed/quality
- haiku - Fast, lightweight

Question 2: "Which model for /sessions:document?"
Header: "Document Model"
Options: (same as above)

Question 3: "Which model for /sessions:review?"
Header: "Review Model"
Options: (same as above)
```

After receiving answers, run the configure script to update command frontmatter:
```bash
"<plugin-root>/scripts/configure.sh" "<plan-model>" "<document-model>" "<review-model>"
```

Note: Find plugin root by locating this command file's directory, then go up one level.

## Step 3: Per-Project Configuration

If `--project` or `--all`, and `.sessions/` exists in current project:

Use the AskUserQuestion tool to ask per-project settings:

```
Question 1: "Which git strategy for .sessions/?"
Header: "Git Strategy"
Options:
- Ignore all (Recommended) - Keep sessions completely local, private
- Hybrid - Commit docs/plans, keep working notes private
- Commit all - Share everything with team

Question 2: "Where should docs be stored?"
Header: "Docs Location"
Options:
- .sessions/docs/ (Recommended) - Keep docs with session context
- docs/ (root level) - Share docs with team, separate from sessions

Question 3: "Enable scripts lifecycle tracking?"
Header: "Scripts"
Options:
- Disabled (Recommended) - No script lifecycle tracking
- Enabled - Track agent-generated scripts with frontmatter
```

After receiving answers, update `<git-root>/.sessions/config.json`:
```json
{
  "docsLocation": ".sessions/docs",
  "scriptsTracking": false
}
```

Update `<git-root>/.sessions/.gitignore` based on git strategy choice.

If docs location changed:
- Move existing docs to new location
- Update any references in index.md

## Step 4: Scripts Tracking Setup

If scripts tracking is enabled:

1. Create `.sessions/scripts.md` to track script inventory:
   ```markdown
   # Script Inventory

   Scripts are tracked with frontmatter for lifecycle management.

   ## Script Frontmatter Standard

   Add this to the top of agent-generated scripts:

   ```typescript
   /**
    * @session-script
    * @purpose Brief description of what this script does
    * @issue ISSUE-123 (optional)
    * @lifecycle permanent | temporary | deprecated
    * @created YYYY-MM-DD
    * @expires YYYY-MM-DD (for temporary scripts)
    */
   ```

   ## Active Scripts

   | Script | Purpose | Lifecycle | Issue |
   |--------|---------|-----------|-------|
   | [Will be populated by /sessions:review] |

   ## Deprecated Scripts

   [Scripts marked for removal]
   ```

2. Inform user that `/sessions:review` will now scan for scripts and suggest cleanup.

## Step 5: Confirm

Report:
- Global settings updated (if changed)
- Project settings updated (if changed)
- Any files moved or created
- Next steps if any

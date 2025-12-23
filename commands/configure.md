---
description: Change plugin settings (models, per-project options)
allowed-tools: Bash(git:*), Read, Write, Glob
model: haiku
---

# Configure Sessions

## Step 1: Determine Scope

Based on $ARGUMENTS:
- No args or `--global`: Configure global model settings
- `--project`: Configure per-project settings only
- `--all`: Configure both global and project settings

## Step 2: Global Configuration (Models)

Ask model preferences:

1. "What model should be used for `/sessions:plan`?"
   - **inherit** (recommended) - Use conversation model
   - **opus** - Deep architectural reasoning
   - **sonnet** - Balanced speed/quality
   - **haiku** - Fast, lightweight

2. "What model should be used for `/sessions:document`?"
   - Same options as above

3. "What model should be used for `/sessions:review`?"
   - Same options as above

Run the configure script to update command frontmatter:
```bash
"<plugin-root>/scripts/configure.sh" "<plan-model>" "<document-model>" "<review-model>"
```

Note: Find plugin root by locating this command file's directory, then go up one level.

## Step 3: Per-Project Configuration

If `--project` or `--all`, and `.sessions/` exists in current project:

Ask per-project settings:

**Git strategy:**
- **Ignore all** - Keep sessions completely local, private by default
- **Hybrid** - Commit docs/plans, keep working notes private
- **Commit all** - Share everything with team

**Docs location:**
- **.sessions/docs/** - Keep docs with session context
- **docs/** (root level) - Share docs with team, separate from sessions

**Scripts tracking:**
- **Disabled** - No script lifecycle tracking
- **Enabled** - Track agent-generated scripts with frontmatter

Update `<git-root>/.sessions/config.json`:
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

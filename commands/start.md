---
description: Start a new session - reads context and scaffolds .sessions/ if needed
allowed-tools: Bash(git:*), Bash(gh:*), Bash(mkdir:*), Read, Write, Glob
model: haiku
---

# Start Session

## Step 1: Find Git Root

Run `git rev-parse --show-toplevel` to locate the repository root. All session files live at `<git-root>/.sessions/`.

## Step 2: Check Global Configuration

Check if the plugin has been configured by looking for a marker.

**If first time using plugin globally**, ask model preferences:

1. "What model should be used for `/sessions:plan`?"
   - **inherit** (recommended) - Use conversation model
   - **opus** - Deep architectural reasoning
   - **sonnet** - Balanced speed/quality
   - **haiku** - Fast, lightweight

2. "What model should be used for `/sessions:document`?"
   - Same options as above

3. "What model should be used for `/sessions:review`?"
   - Same options as above

Run `<plugin-root>/scripts/configure.sh <plan-model> <document-model> <review-model>` to update command frontmatter.

## Step 3: Check for Sessions Directory

Check if `<git-root>/.sessions/index.md` exists.

**If .sessions/ does NOT exist**, scaffold it:

1. Tell the user: "No sessions directory found. Let me set that up for you."

2. Ask per-project settings:

   **Git strategy:**
   - **Ignore all** (recommended) - Keep sessions completely local, private by default
   - **Hybrid** - Commit docs/plans, keep working notes private
   - **Commit all** - Share everything with team

   **Docs location:**
   - **.sessions/docs/** (recommended) - Keep docs with session context
   - **docs/** (root level) - Share docs with team, separate from sessions

   **Scripts tracking:**
   - **Disabled** (recommended) - No script lifecycle tracking
   - **Enabled** - Track agent-generated scripts with frontmatter

3. Create the directory structure:
   ```
   .sessions/
   ├── index.md
   ├── config.json      # Per-project settings
   ├── archive/
   ├── plans/
   ├── docs/            # If docs location is .sessions/docs/
   └── .gitignore
   ```

   If docs location is root level, create `<git-root>/docs/` instead.

4. Detect project name from: package.json name → git remote → directory name

5. Create `config.json` with project settings:
   ```json
   {
     "docsLocation": ".sessions/docs",
     "scriptsTracking": false
   }
   ```

6. Create `index.md` with template:
   ```markdown
   # Session Context: [PROJECT_NAME]

   **Date**: [CURRENT_DATE]
   **Status**: Active
   **Branch**: main

   ---

   ## Current State

   [Describe what you're working on]

   ---

   ## Recent Sessions

   ### Session 1 - [CURRENT_DATE]

   **Goal**: [What you want to accomplish]

   **Accomplished**:
   - [List completed items]

   **Decisions**:
   - [Key decisions made]

   **Blockers**: None

   ---

   ## Next Session Priorities

   1. [Priority items]

   ---

   ## Key Resources

   **Code References**:
   - [Component/feature]: `path/to/file.ts`

   **External Links**:
   - [Issue Tracker](url)

   ---

   ## Archived Sessions

   [Links to archived sessions will appear here]

   ---

   ## Notes

   [Any additional context]
   ```

7. Create `.gitignore` based on chosen strategy:

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

**If .sessions/ EXISTS**, proceed to Step 4.

## Step 4: Check/Update CLAUDE.md

Check if `<git-root>/CLAUDE.md` exists.

**If CLAUDE.md does NOT exist**, create it:
```markdown
# [PROJECT_NAME]

## Quick Context

Read `.sessions/index.md` for current project state, recent work, and priorities.

## Session Commands

- `/sessions:start` - Start a session (reads context)
- `/sessions:end` - End session (updates context)
- `/sessions:plan` - Create implementation plan
- `/sessions:document <topic>` - Document a topic
- `/sessions:review` - Review work for blindspots and improvements
- `/sessions:archive` - Archive completed work
- `/sessions:configure` - Change plugin settings
```

**If CLAUDE.md EXISTS**, check if it references `.sessions/index.md`. If not, append:
```markdown

## Session Context

Read `.sessions/index.md` for current project state, recent work, and priorities.
```

## Step 5: Read Session Context

Read `<git-root>/.sessions/index.md` and report when ready.

Summarize:
- Current state
- Recent work
- Next priorities

Then ask: "What do you want to work on this session?"

## Step 6: Fetch External Context (Optional)

**Only fetch if user provides a new URL or issue ID:**

If user provides a GitHub/Linear URL or issue ID:
- **GitHub**: `gh pr view [URL] --json title,body,state,labels`
- **GitHub**: `gh issue view [URL] --json title,body,state,labels`
- **Linear**: If Linear MCP is configured, use available Linear tools to fetch issue
- Summarize the fetched context
- Add reference to index.md under Current State

Otherwise (continuing work, ad-hoc task, etc.):
- Proceed with existing session context
- Session notes are the source of truth for ongoing work

Confirm understanding and ask how to proceed.

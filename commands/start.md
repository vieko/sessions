---
description: Start a new session - reads context and scaffolds .sessions/ if needed
allowed-tools: Bash(git:*), Bash(gh:*), Bash(mkdir:*), Read, Write, Glob, AskUserQuestion, mcp__linear__*
model: haiku
---

# Start Session

## Step 1: Find Git Root

Run `git rev-parse --show-toplevel` to locate the repository root. All session files live at `<git-root>/.sessions/`.

## Step 2: Check for Sessions Directory

Check if `<git-root>/.sessions/index.md` exists.

**If .sessions/ does NOT exist**, scaffold it:

1. Tell the user: "No sessions directory found. Let me set that up for you."

2. Use AskUserQuestion to ask setup questions (4 questions, one round):

   1. "Where should specs be saved?" (Header: "Specs")
      - .sessions/specs/ (Recommended) - Keep with session context
      - specs/ - Project root level

   2. "Where should docs be saved?" (Header: "Docs")
      - .sessions/docs/ (Recommended) - Keep with session context
      - docs/ - Project root level

   3. "How should `.sessions/` be handled in git?" (Header: "Git")
      - ignore-all (Recommended) - Keep sessions private/local
      - hybrid - Commit docs/specs, keep notes private
      - commit-all - Share everything with team

   4. "Enable Linear MCP integration?" (Header: "Linear")
      - No (Recommended) - Skip Linear integration
      - Yes - Fetch/create Linear issues (requires Linear MCP)

3. Create the directory structure based on user choices:

   **Always create in .sessions/**:
   ```
   .sessions/
   ├── index.md
   ├── config.json
   ├── archive/
   ├── scripts/
   └── .gitignore
   ```

   **If specsLocation is `.sessions/specs/`**: create `.sessions/specs/`
   **If specsLocation is `specs/`**: create `<git-root>/specs/`

   **If docsLocation is `.sessions/docs/`**: create `.sessions/docs/`
   **If docsLocation is `docs/`**: create `<git-root>/docs/`

4. Detect project name from: package.json name → git remote → directory name

5. Create `config.json` with user's answers:
   ```json
   {
     "specsLocation": "<user-answer>",
     "docsLocation": "<user-answer>",
     "gitStrategy": "<user-answer>",
     "linearEnabled": <true-or-false>
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

7. Create `.gitignore` based on chosen strategy and locations:

   **Ignore all**:
   ```
   *
   !.gitignore
   ```

   **Hybrid** (only include dirs that are inside .sessions/):
   ```
   *
   !.gitignore
   ```
   If docsLocation is `.sessions/docs/`, add:
   ```
   !docs/
   !docs/**
   ```
   If specsLocation is `.sessions/specs/`, add:
   ```
   !specs/
   !specs/**
   ```

   **Commit all**:
   ```
   data/
   scratch/
   scripts/
   ```

**If .sessions/ EXISTS**, proceed to Step 3.

## Step 3: Check/Update CLAUDE.md

Check if `<git-root>/CLAUDE.md` exists.

**If CLAUDE.md does NOT exist**, create it:
```markdown
# [PROJECT_NAME]

## Quick Context

Read `.sessions/index.md` for current project state, recent work, and priorities.

## Session Commands

- `/sessions:start` - Start a session (reads context)
- `/sessions:end` - End session (updates context)
- `/sessions:spec` - Create implementation spec
- `/sessions:document <topic>` - Document a topic
- `/sessions:review` - Review work for blindspots and improvements
- `/sessions:archive` - Archive completed work
- `/sessions:configure` - Change project settings
```

**If CLAUDE.md EXISTS**, check if it references `.sessions/index.md`. If not, append:
```markdown

## Session Context

Read `.sessions/index.md` for current project state, recent work, and priorities.
```

## Step 4: Read Session Context

Read `<git-root>/.sessions/index.md` and report when ready.

Summarize:
- Current state
- Recent work
- Next priorities

Then ask: "What do you want to work on this session?"

## Step 5: Fetch External Context (Optional)

**Only fetch if user provides a new URL or issue ID:**

### Detecting Issue Type

- **GitHub**: Starts with `#`, contains `github.com`, or doesn't match Linear pattern
- **Linear**: Matches `[A-Z]+-[0-9]+` pattern (e.g., `ENG-123`, `ABC-456`) or contains `linear.app`

### GitHub Issues/PRs

Use `gh` CLI:
- `gh pr view [URL] --json title,body,state,labels`
- `gh issue view [URL] --json title,body,state,labels`

### Linear Issues

First, read `<git-root>/.sessions/config.json` and check `linearEnabled`.

**If `linearEnabled` is false or not set**: Skip Linear, treat as ad-hoc task.

**If `linearEnabled` is true**:
1. Use Linear MCP `linear_search_issues` tool to find the issue by ID (e.g., `ENG-123`)
2. Extract: title, description, state, priority, labels, assignee
3. On success: Summarize the issue context
4. On failure: Warn user - "Couldn't fetch Linear issue. Linear MCP may not be configured. Continue without issue context?"

Note: Tool names may vary by Linear MCP implementation. Common tools: `linear_search_issues`, `linear_create_issue`, `linear_update_issue`.

### Update Session Context

If issue was fetched successfully:
- Add reference to `index.md` under Current State
- Include issue ID, title, and link
- Note the issue tracker type (GitHub/Linear)

### Fallback

If no URL/issue ID provided (continuing work, ad-hoc task):
- Proceed with existing session context
- Session notes are the source of truth for ongoing work

Confirm understanding and ask how to proceed.

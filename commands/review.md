---
description: Review work for blindspots, gaps, and improvements
allowed-tools: Bash(git:*), Bash(gh:*), Read, Glob, Grep, Write
---

# Review Work

## Step 1: Determine Scope

Based on $ARGUMENTS:
- No args: Review current branch vs base
- `--session`: Review work captured in current session context
- Topic/area: Focus review on specific aspect

## Step 2: Gather Context

- Read session context from `<git-root>/.sessions/index.md`
- Get branch diff: `git diff main...HEAD` (or appropriate base)
- Read relevant plans/docs from `.sessions/`
- Understand intent: what were we trying to accomplish?

## Step 3: Check Project Config

Read `<git-root>/.sessions/config.json` if it exists.

**Model preference**: If `models.review` is set to something other than "inherit":
- If "opus": Be thorough, find subtle issues, architectural concerns
- If "sonnet": Balance depth with efficiency
- If "haiku": Focus on obvious issues, be quick

If "inherit" or not set, proceed with current conversation model.

**Scripts tracking**: If `scriptsTracking` is true, include scripts in review (Step 5).

## Step 4: Strategic Review

Analyze the work asking:

**Blindspots**: What are we not seeing?
- Edge cases not handled
- Error scenarios not considered
- User flows not covered
- Dependencies not accounted for

**Gaps**: What's incomplete?
- Missing tests
- Missing documentation
- Incomplete implementations
- TODOs left unaddressed

**Quick Wins**: What small improvements would add significant value?
- Easy refactors
- Low-hanging performance gains
- Simple UX improvements

**Best Practices**: Are we following conventions?
- Project patterns
- Language/framework idioms
- Security practices
- Accessibility standards

**Maintainability**: Will future-us thank present-us?
- Clear naming and structure
- Appropriate abstractions
- Technical debt introduced

## Step 5: Scripts Review (if tracking enabled)

If `scriptsTracking` is true in config, scan for scripts:

1. Find scripts directories: `<git-root>/scripts/`, `<git-root>/*/scripts/`
2. For each script, check for `@session-script` frontmatter
3. Identify:
   - **Untracked scripts**: No frontmatter, should be categorized
   - **Expired scripts**: `@expires` date has passed
   - **Deprecated scripts**: `@lifecycle deprecated`
   - **Orphaned scripts**: Reference issues that are closed

Report:
```
### Scripts Status

**Untracked** (need frontmatter):
- scripts/test-api.ts
- scripts/seed-data.ts

**Expired** (past expiration date):
- scripts/temp-migration.ts (@expires 2025-12-01)

**Deprecated** (marked for removal):
- scripts/store-prompt-v1.ts

**Orphaned** (issue closed):
- scripts/GTMENG-350-debug.ts (issue closed 2025-12-10)
```

## Step 6: Categorize Findings

For each finding, determine:
- **Severity**: blocking | important | nice-to-have
- **Effort**: trivial | small | medium | large
- **Action**: fix-now | plan | create-issue

## Step 7: Present and Act

Present findings grouped by recommended action:

### Fix Now (trivial effort)
[List items that can be fixed immediately]

→ Ask: "Want me to fix these now?"

### Plan (small/medium effort, important)
[List items worth addressing this session]

→ Ask: "Want me to create an implementation plan?"

### Create Issues (large effort or nice-to-have)
[List items for future sessions]

→ Ask: "Want me to create GitHub/Linear issues?"

## Step 8: Execute Chosen Action

Based on user choice:
- **Fix now**: Make the changes directly
- **Plan**: Run `/sessions:plan` with findings
- **Create issues**: Use `gh issue create` or Linear MCP if available

## Step 9: Update Session Context

Add review outcomes to `<git-root>/.sessions/index.md`:
- Key findings noted
- Issues created (with links)
- Work deferred to future sessions

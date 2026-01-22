---
description: Review a GitHub pull request and post inline comments
allowed-tools: Bash(git:*), Bash(gh:*), Bash(tmux:*), Read, Write, Task, AskUserQuestion
---

# Review Pull Request

Review a GitHub PR in an isolated worktree, then post inline comments on findings.

## Step 1: Parse Arguments

Extract PR number from `$ARGUMENTS`:
- `333` or `#333` → PR number 333
- Empty → Show usage and abort

**Usage**: `/bonfire:review-pr <pr-number>`

If no PR number provided:
> "Usage: `/bonfire:review-pr <pr-number>`
>
> Example: `/bonfire:review-pr 333`"

## Step 2: Verify Environment

Check if running inside tmux:

```bash
[ -n "$TMUX" ] && echo "tmux: yes" || echo "tmux: no"
```

**If not in tmux**: Provide manual instructions and abort:

> "PR review with inline comments requires tmux for worktree isolation.
>
> **Manual alternative:**
> 1. Create worktree: `git worktree add ../pr-<number>-review origin/<branch>`
> 2. Open new terminal in that directory
> 3. Run: `claude 'Review this PR and help me post comments'`
> 4. Clean up when done: `git worktree remove ../pr-<number>-review`"

## Step 3: Fetch PR Metadata

Get PR details:

```bash
gh pr view <number> --json number,title,headRefName,baseRefName,headRefOid,url,body,files
```

**If PR not found**: Abort with "PR #<number> not found in this repository."

Extract and store:
- `headRefName` - PR branch name
- `baseRefName` - Target branch (usually main)
- `headRefOid` - Commit SHA for inline comments
- `title` - PR title
- `url` - PR URL
- `files` - Changed files list

## Step 4: Find Git Root and Compute Paths

```bash
git rev-parse --show-toplevel
```

Compute worktree path: `<git-root>/../<repo-name>-pr-<number>-review`

Example: `/Users/vieko/dev/gtm` → `/Users/vieko/dev/gtm-pr-333-review`

## Step 5: Create Worktree

Create isolated worktree for PR branch:

```bash
git fetch origin <headRefName>
git worktree add <worktree-path> origin/<headRefName>
```

**On failure** (branch conflict, dirty state, etc.):

1. Check error message
2. If worktree already exists: Ask user "Worktree already exists. Remove and recreate?"
   - Yes: `git worktree remove <worktree-path> --force` then retry
   - No: Abort
3. If other error: Report error and abort with suggestion to check `git worktree list`

## Step 6: Get PR Diff Summary

Get the diff for context:

```bash
cd <worktree-path> && git diff origin/<baseRefName>...HEAD --stat
```

Get changed files:

```bash
cd <worktree-path> && git diff origin/<baseRefName>...HEAD --name-only
```

## Step 7: Generate Review Context

Create context document for spawned session.

Write to `<worktree-path>/.bonfire-pr-review-context.md`:

```markdown
# PR Review Context

**PR**: #<number> - <title>
**URL**: <url>
**Branch**: <headRefName> → <baseRefName>
**Commit**: <headRefOid>

## Changed Files

<list of changed files>

## PR Description

<body from PR>

---

## Instructions

You are reviewing PR #<number> in an isolated worktree.

### Step 1: Run Review

Use the Task tool to invoke the **work-reviewer** subagent:

```
Review this pull request for blindspots, gaps, and improvements.

**Scope**: PR #<number> - <title>

**Files changed**:
<list of changed files>

**PR Description**:
<body>

Return categorized findings with severity, effort, and specific file:line references.
```

### Step 2: Present Findings

After review completes, present findings grouped by severity.

For each finding, note:
- File and line number (if applicable)
- Severity (critical/moderate/minor)
- Description

### Step 3: Batch Comment Selection

Ask user: "Which findings should I post as PR comments?"

Options:
1. List findings by number, let user select (e.g., "1, 3, 5")
2. "All" - post all findings
3. "None" - skip commenting

### Step 4: Post Inline Comments

For each selected finding with a file:line reference, post an inline comment:

```bash
gh api repos/{owner}/{repo}/pulls/<number>/comments \
  -f body="**Review Finding**

<finding description>

*Severity: <severity> | Effort: <effort>*" \
  -f commit_id="<headRefOid>" \
  -f path="<file-path>" \
  -f line=<line-number>
```

For findings without line numbers, post as general PR comment:

```bash
gh pr comment <number> --body "**Review Finding**

<finding description>

*Severity: <severity> | Effort: <effort>*"
```

**Note**: GitHub only allows inline comments on files that are part of the PR diff. If a finding references a file not in the diff (e.g., missing config in turbo.json when turbo.json wasn't changed), post it as a general PR comment instead.

### Step 5: Offer Cleanup

After commenting, ask: "Review complete. Remove worktree?"

If yes:
```bash
cd <original-git-root>
git worktree remove <worktree-path>
```

Report: "Worktree cleaned up. PR review complete."
```

## Step 8: Spawn Review Session

Spawn a new Claude session in the worktree:

```bash
WORKTREE_PATH="<computed-worktree-path>"
CONTEXT="$(cat "$WORKTREE_PATH/.bonfire-pr-review-context.md")"
tmux split-window -h -c "$WORKTREE_PATH" \
  "claude --append-system-prompt '$CONTEXT' 'Ready to review PR #<number>. Starting work-reviewer subagent...'"
```

**Verify spawn succeeded**: If tmux fails (terminal too small), warn user and provide manual instructions.

## Step 9: Confirm

Tell the user:

> **PR review session spawned.**
>
> - Worktree created at `<worktree-path>`
> - Review session opened in adjacent pane
> - The new session will run work-reviewer and help you post comments
>
> When done, the review session will offer to clean up the worktree.
>
> You can continue working here - your current branch is unchanged.

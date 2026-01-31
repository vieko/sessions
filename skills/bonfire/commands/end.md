# End Session

## Outcome

Session work is captured in index.md, context is healthy.

## Acceptance Criteria

- `index.md` reflects what was accomplished this session
- Next priorities are documented
- Garbage is detected and cleanup is offered

## Constraints

- Read current session summary from `~/.claude/projects` if available (same patterns as start.md)
  - **Directory naming**: Replace `/` with `-` in absolute project path (e.g., `/Users/vieko/dev/bonfire` → `-Users-vieko-dev-bonfire`)
  - **Index location**: `~/.claude/projects/<project-dir>/sessions-index.json`
  - **Structure**: `{ "version": 1, "entries": [...] }` where each entry contains:
    - `gitBranch` (string): git branch name
    - `modified` (string): ISO 8601 timestamp of last modification
    - `summary` (string): AI-generated session summary
    - `messageCount` (number): number of messages in session
    - `created` (string): ISO 8601 timestamp of session creation
    - `sessionId` (string): UUID
    - `firstPrompt` (string): First user message
    - `prNumber`, `prUrl` (optional): Associated PR if available
  - **Session matching**: Find entry with most recent `modified` timestamp within last 30 minutes on current branch
  - **Baseline extraction**: Get `summary`, `messageCount`, `firstPrompt` (truncate if >100 chars)
  - **Enrichment**: Combine baseline with git commits since session start, PRs (via `gh` if available), Linear issues (if `linear: true`), file changes
  - **Session note format**: Use summary as title, add decision paragraph with enriched context, bullet points for commits/PRs/file changes, session metadata line
  - **Graceful fallback**: Use manual synthesis (git commits + conversation) if sessions-index.json not found or no matching session
  - **Avoid**: Don't use jq date parsing (v4.3.1 lesson), validate timestamps with bash instead
- Update context based on git commits, files changed, conversation
- Detect stale references: broken links, orphaned specs >7 days, closed PRs >30 days
- Move completed work to "Recent Sessions" section with concise summary
- Commit changes only if `gitStrategy` is "hybrid" or "commit-all"

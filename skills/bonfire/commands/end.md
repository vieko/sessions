# End Session

## Outcome

Session work is captured in index.md, context is healthy.

## Acceptance Criteria

- `index.md` reflects what was accomplished this session
- Next priorities are documented
- Garbage is detected and cleanup is offered

## Constraints

- Update context based on git commits, files changed, conversation
- Detect stale references: broken links, orphaned specs >7 days, closed PRs >30 days
- Move completed work to "Recent Sessions" section with concise summary
- Commit changes only if `gitStrategy` is "hybrid" or "commit-all"

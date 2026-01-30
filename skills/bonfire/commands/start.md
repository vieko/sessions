# Start Session

## Outcome

Session is started, context is loaded, user knows what to work on.

## Acceptance Criteria

- `.bonfire/` directory exists with valid structure
- `index.md` exists with config and session context
- Context is read and summarized to user
- Recent Claude sessions on current branch are noted (if any)
- User is asked what to work on this session

## Constraints

- Scaffold new projects using [templates/](../templates/) with sensible defaults
- Ask user for preferences on first run (specs location, docs location, git strategy, Linear)
- Warn if context exceeds 20K tokens (suggest cleanup)
- Check `~/.claude/projects` for recent sessions on current branch (last 7 days max)
  - Read sessions-index.json for session summaries
  - Show relevant sessions if found (max 3-5)
  - Display as contextual information, don't block workflow
  - Skip if no relevant sessions or file not found
- Fetch external context (GitHub via `gh`, Linear via `Skill(linear-cli)`) only if user provides URL or issue ID
- Use `Skill(linear-cli)` for all Linear operations when `linear: true` in frontmatter

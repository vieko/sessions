# Start Session

## Outcome

Session is started, context is loaded, user knows what to work on.

## Acceptance Criteria

- `.bonfire/` directory exists with valid structure
- `index.md` exists with config and session context
- Context is read and summarized to user
- User is asked what to work on this session

## Constraints

- Scaffold new projects using [templates/](../templates/) with sensible defaults
- Ask user for preferences on first run (specs location, docs location, git strategy, Linear)
- Warn if context exceeds 20K tokens (suggest cleanup)
- Fetch external context (GitHub via `gh`, Linear via `Skill(linear-cli)`) only if user provides URL or issue ID
- Use `Skill(linear-cli)` for all Linear operations when `linear: true` in frontmatter

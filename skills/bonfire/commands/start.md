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
  - **Directory naming**: Replace `/` with `-` in absolute project path (e.g., `/Users/vieko/dev/gtm` → `-Users-vieko-dev-gtm`, `/Users/vieko/.dotfiles` → `-Users-vieko--dotfiles`)
  - **Index location**: `~/.claude/projects/<project-dir>/sessions-index.json`
  - **Structure**: `{ "version": 1, "entries": [...] }` where each entry contains:
    - `gitBranch` (string): git branch name
    - `modified` (string): ISO 8601 timestamp of last modification
    - `summary` (string): AI-generated session summary
    - `messageCount` (number): number of messages in session
    - `created` (string): ISO 8601 timestamp of session creation
    - `sessionId` (string): UUID
  - **Filtering**: `gitBranch` matches current branch AND `modified` >= 7 days ago
  - **Display**: Show max 3-5 sessions, sorted by `modified` descending, format as contextual information
  - **Graceful degradation**: Skip if directory doesn't exist or sessions-index.json not found
  - Never block workflow on failures
- Fetch external context (GitHub via `gh`, Linear via `Skill(linear-cli)`) only if user provides URL or issue ID
- Use `Skill(linear-cli)` for all Linear operations when `linear: true` in frontmatter

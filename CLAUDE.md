# Sessions Plugin

Claude Code plugin for the Sessions Directory Pattern - maintaining context across AI coding sessions.

## Project Structure

```
sessions/
├── commands/             # Slash commands (/sessions:*)
│   ├── start.md          # Begin session, scaffold if needed (haiku)
│   ├── end.md            # Update context, commit (haiku)
│   ├── plan.md           # Create implementation plan (inherit)
│   ├── document.md       # Document a topic (inherit)
│   ├── review.md         # Strategic work review (inherit)
│   ├── archive.md        # Archive completed work (haiku)
│   ├── configure.md      # Change plugin settings (haiku)
│   └── git-strategy.md   # Change git handling (haiku)
├── skills/               # Passive context skills
│   ├── session-context/  # Auto-reads .sessions/index.md
│   └── archive-session/  # Suggests archiving on completion
├── scripts/
│   └── configure.sh      # Updates command frontmatter
├── CLAUDE.md             # This file
└── README.md             # User-facing documentation
```

## How It Works

The plugin provides commands that manage a `.sessions/` directory in user projects:

```
.sessions/
├── index.md      # Living context document (read at start, updated at end)
├── config.json   # Per-project settings (docs location, scripts tracking)
├── archive/      # Completed work (YYYY-MM-DD-<issue>-<topic>.md)
├── plans/        # Implementation plans (<issue>-<topic>.md)
├── docs/         # Reference documentation (<topic>.md)
└── .gitignore    # Based on chosen strategy
```

## Configuration

**Global settings** (model preferences):
- Stored via frontmatter in command files
- Updated by `scripts/configure.sh`
- Apply to all projects

**Per-project settings** (git strategy, docs location, scripts tracking):
- Stored in `.sessions/config.json`
- Set on first `/sessions:start` in each project

## Development Notes

- Commands use `$ARGUMENTS` for user input
- All commands start with `git rev-parse --show-toplevel` to find project root
- Skills have trigger patterns in SKILL.md that Claude matches automatically
- Mechanical commands use `model: haiku` for speed
- Thinking commands inherit model for flexibility
- Skills cannot specify models (always inherit)
- Version: 0.4.0 (continuing from create-sessions-dir 0.3.x)

## Testing Changes

1. Make edits to command/skill files
2. Test in a separate project with the plugin installed
3. Run `/sessions:start` to verify scaffolding
4. Run `/sessions:configure` to verify global settings
5. Run other commands to verify behavior

## Related

- Blog post: https://vieko.dev/sessions
- Original npx package: create-sessions-dir
- GTM project: Real-world usage reference (~/dev/gtm)

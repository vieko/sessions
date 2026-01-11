# Bonfire for OpenCode

Session persistence for AI coding - save your progress at the bonfire.

## Installation

**Project install:**

```bash
bunx opencode-bonfire install
```

**Global install** (available in all projects):

```bash
bunx opencode-bonfire install --global
```

## What's Included

| Component | Description |
|-----------|-------------|
| **8 Commands** | `/bonfire-start`, `/bonfire-end`, `/bonfire-spec`, etc. |
| **4 Agents** | `codebase-explorer`, `spec-writer`, `doc-writer`, `work-reviewer` |
| **1 Skill** | `bonfire-context` for loading session context |
| **1 Plugin** | Archive suggestions + compaction context preservation |
| **1 Tool** | `bonfire` for structured session data |

## Configuration

The `opencode.json` configures automatic context loading:

```json
{
  "instructions": ["CLAUDE.md", ".bonfire/index.md"]
}
```

Plugins and tools are auto-discovered from `.opencode/plugin/` and `.opencode/tool/` directories.

## Plugin Features

**Archive Suggestions**: After `gh pr merge` or `gh pr close`, suggests running `/bonfire-archive`.

**Compaction Hook**: When OpenCode compacts context, automatically injects `.bonfire/index.md` to preserve session continuity.

**Custom Tool**: `bonfire` returns structured JSON:
```json
{
  "exists": true,
  "project": "my-project",
  "status": "In Progress",
  "branch": "feature/xyz",
  "priorities": ["Complete API", "Add tests"],
  "recentSession": { "number": 5, "date": "2026-01-10", "goal": "..." }
}
```

## Usage

```
/bonfire-start              # Start session, scaffold if needed
/bonfire-end                # Update context, commit changes
/bonfire-spec <topic>       # Create implementation spec
/bonfire-document <topic>   # Document a codebase topic
/bonfire-review             # Find blindspots and gaps
/bonfire-archive            # Archive completed work
/bonfire-configure          # Change project settings
```

## Compatibility

Bonfire uses the same `CLAUDE.md` and `.bonfire/` directory format as the Claude Code version. You can switch between platforms freely.

## Learn More

- [Main README](https://github.com/vieko/bonfire)
- [Blog post](https://vieko.dev/bonfire)

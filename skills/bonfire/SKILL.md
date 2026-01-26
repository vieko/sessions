---
name: bonfire
description: Session context persistence for AI coding - save your progress at the bonfire. Use this skill when the user asks about bonfire, wants to see available commands, or needs help getting started.
license: MIT
allowed-tools: Read
metadata:
  author: vieko
  version: "3.0.0"
---

# Bonfire

Session context persistence for AI coding. Save your progress at the bonfire.

## Quick Start

```
/bonfire-start    Start a session (reads context, sets up if needed)
/bonfire-end      End session (updates context, runs health check)
```

## All Commands

| Command | Description |
|---------|-------------|
| `/bonfire-start` | Start a session - reads context, scaffolds `.bonfire/` if needed |
| `/bonfire-end` | End session - updates context, syncs tasks, runs garbage detection |
| `/bonfire-spec <topic>` | Create an implementation spec for a feature |
| `/bonfire-document <topic>` | Create reference documentation |
| `/bonfire-review` | Review current work for blindspots and improvements |
| `/bonfire-review-pr <number>` | Review a GitHub PR and post inline comments |
| `/bonfire-archive` | Archive completed work to reduce context size |
| `/bonfire-configure` | Change project settings (locations, git strategy, Linear) |
| `/bonfire-strategic <type> <topic>` | Create RFC, PRD, or POC documents |

## Passive Triggers

These skills activate automatically based on context:

| Skill | Triggers When |
|-------|---------------|
| `bonfire-context` | User asks about previous sessions, decisions, or "what we did last time" |
| `bonfire-archive-suggest` | PR is merged or work is completed |

## Session Workflow

```
┌─────────────────┐
│ /bonfire-start  │  Read context, understand state
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Do work...    │  Code, spec, review, document
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  /bonfire-end   │  Save progress, update context
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ /bonfire-archive│  (When work is merged/complete)
└─────────────────┘
```

## Installation

```bash
npx skills add vieko/bonfire --all
```

## Session Context

All context is stored in `.bonfire/` at your project root:

```
.bonfire/
├── index.md      # Main session context
├── config.json   # Settings
├── specs/        # Implementation specs
├── docs/         # Documentation
└── archive/      # Completed sessions
```

## Getting Started

Run `/bonfire-start` to begin. If `.bonfire/` doesn't exist, it will guide you through setup.

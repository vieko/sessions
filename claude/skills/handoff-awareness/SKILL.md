---
description: Suggest session handoff when approaching context limits. Triggers on phrases like "running out of context", "context is getting long", "should we start fresh", "conversation is large", "losing context", or when user notices degraded responses.
allowed-tools: Read, Glob
---

# Handoff Awareness

This skill detects when a session handoff may be beneficial and suggests the appropriate action.

## When to Trigger

Activate when user mentions:
- Context concerns: "running out of context", "context limit", "context window"
- Length concerns: "conversation is getting long", "too much context", "large conversation"
- Fresh start: "should we start fresh?", "new session?", "hand off?", "start over?"
- Degraded quality: "you're losing context", "you forgot", "we already discussed this"
- Explicit ask: "can you hand off?", "transfer to new session"

## Instructions

1. **Check for .bonfire/ directory**:
   ```bash
   git rev-parse --show-toplevel
   ```
   Then check if `.bonfire/index.md` exists.

2. **If .bonfire/ exists**, suggest handoff:

   > "I can hand off this session to a fresh Claude instance while preserving your work.
   >
   > Run `/bonfire:handoff` to:
   > 1. Save current progress to `.bonfire/index.md`
   > 2. Generate minimal handoff context
   > 3. Spawn a new Claude session in a new tmux window
   >
   > The new session will have access to your full session history via `/bonfire:start`."

3. **If .bonfire/ doesn't exist**, suggest initialization:

   > "To enable session handoff, first run `/bonfire:start` to initialize session tracking.
   > This creates a `.bonfire/` directory that preserves context across sessions."

4. **If not in tmux**, mention the limitation:

   > "Note: Automatic session spawning requires tmux. If you're not in tmux, you can still
   > run `/bonfire:handoff` to generate the handoff context, then manually start a new
   > Claude session and paste the context."

## Important

- This skill **suggests** handoff, it does NOT trigger it automatically
- User must explicitly run `/bonfire:handoff` to perform the handoff
- Don't suggest handoff for short conversations or early in a session
- If user is mid-task, suggest completing the current atomic unit first
- Handoff is specifically for context limit concerns, not for switching topics

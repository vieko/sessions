/**
 * Bonfire Plugin for OpenCode
 *
 * Provides event hooks for:
 * - Suggesting archive after PR merge
 * - Auto-loading context on session start (future)
 */

import type { Plugin } from "@opencode-ai/plugin"
import { existsSync } from "fs"
import { join } from "path"

export const BonfirePlugin: Plugin = async ({ project, directory }) => {
  // Use directory (cwd) if project.path is not available
  const rootPath = project?.path || directory
  const bonfirePath = join(rootPath, ".bonfire")
  const indexPath = join(bonfirePath, "index.md")

  return {
    /**
     * After tool execution - detect PR merges and suggest archiving
     */
    "tool.execute.after": async (input, output) => {
      // Only check bash commands
      if (input.tool !== "bash") return

      const command = input.args?.command as string | undefined
      if (!command) return

      // Detect successful PR merge
      const isPrMerge =
        command.includes("gh pr merge") ||
        command.includes("gh pr close") ||
        (command.includes("git merge") && command.includes("pr"))

      // Check if command succeeded (no error in output)
      const succeeded = !output.error && output.result

      if (isPrMerge && succeeded) {
        // Check if bonfire context exists
        if (existsSync(indexPath)) {
          return {
            // This message will be shown to the user
            message: `PR merged! This session's work looks complete.

Run \`/bonfire-archive\` to:
- Move completed work to archive
- Clean up any finished specs
- Update Linear issues (if enabled)
- Keep your session context clean for next time`,
          }
        }
      }

      // Detect mentions of shipping/completion in echo/printf commands
      const completionPhrases = [
        "ship it",
        "shipped",
        "done with",
        "finished",
        "merged to main",
      ]
      const mentionsCompletion = completionPhrases.some((phrase) =>
        command.toLowerCase().includes(phrase)
      )

      if (mentionsCompletion && existsSync(indexPath)) {
        return {
          message: `Work completed? Consider running \`/bonfire-archive\` to archive this session.`,
        }
      }
    },

    /**
     * General event handler for session events
     */
    event: async ({ event }) => {
      // Handle session.created - could auto-load context
      if (event.type === "session.created") {
        // Future: Could automatically suggest running /bonfire-start
        // if .bonfire/index.md exists but hasn't been loaded
        // For now, the instructions config handles passive context loading
      }

      // Handle session.idle - remind about ending session
      if (event.type === "session.idle") {
        // Future: Could remind user to run /bonfire-end
        // if they've been idle for a while
        // This would require tracking session state
      }
    },
  }
}

export default BonfirePlugin

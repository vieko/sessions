/**
 * Bonfire Plugin for OpenCode
 *
 * Provides event hooks for:
 * - Suggesting archive after PR merge (backup to skill-based detection)
 * - Preserving session context during compaction
 * 
 * Note: Archive suggestion also handled by archive-bonfire-awareness skill
 * for better reliability across different OpenCode versions.
 */

import type { Plugin } from "@opencode-ai/plugin"
import { existsSync, readFileSync } from "fs"
import { join } from "path"

export const BonfirePlugin: Plugin = async ({ directory }) => {
  const bonfirePath = join(directory, ".bonfire")
  const indexPath = join(bonfirePath, "index.md")

  return {
    /**
     * After tool execution - detect PR merges and suggest archiving
     */
    "tool.execute.after": async (input, output) => {
      if (input.tool !== "bash") return

      const command = input.args?.command as string | undefined
      if (!command) return

      const isPrMerge =
        command.includes("gh pr merge") || command.includes("gh pr close")

      const succeeded = !output.error && output.result

      if (isPrMerge && succeeded && existsSync(indexPath)) {
        // Log for debugging - remove this once hook display is confirmed working
        console.log("[Bonfire] PR merge detected, suggesting archive")
        
        return {
          message: `PR merged! Run \`/bonfire-archive\` to archive this session.`,
        }
      }
    },

    /**
     * Preserve bonfire context during session compaction
     */
    "experimental.session.compacting": async (_input, output) => {
      if (existsSync(indexPath)) {
        const content = readFileSync(indexPath, "utf-8")
        output.context.push(`## Bonfire Session Context\n\n${content}`)
      }
    },
  }
}

// Plugin auto-discovered by filename - no default export needed

/**
 * Bonfire Status Tool
 *
 * Returns structured session context for programmatic access.
 */

import { tool } from "@opencode-ai/plugin"
import { existsSync, readFileSync } from "fs"

interface BonfireStatus {
  exists: boolean
  project?: string
  status?: string
  branch?: string
  currentState?: string
  priorities?: string[]
  recentSession?: {
    number: number
    date: string
    goal: string
  }
}

function extractSection(content: string, header: string): string | undefined {
  const regex = new RegExp(`## ${header}\\n\\n([\\s\\S]*?)(?=\\n## |$)`, "i")
  const match = content.match(regex)
  return match ? match[1].trim() : undefined
}

function extractPriorities(content: string): string[] {
  const section = extractSection(content, "Next Session Priorities")
  if (!section) return []
  const lines = section.split("\n")
  return lines
    .filter((line) => line.match(/^\d+\./))
    .map((line) =>
      line
        .replace(/^\d+\.\s*\*\*/, "")
        .replace(/\*\*.*$/, "")
        .trim()
    )
    .slice(0, 5)
}

function extractMetadata(content: string): {
  project?: string
  status?: string
  branch?: string
} {
  const projectMatch = content.match(/# Session Context: (.+)/)
  const statusMatch = content.match(/\*\*Status\*\*: (.+)/)
  const branchMatch = content.match(/\*\*Branch\*\*: `?([^`\n]+)`?/)
  return {
    project: projectMatch?.[1],
    status: statusMatch?.[1],
    branch: branchMatch?.[1],
  }
}

function extractRecentSession(
  content: string
): { number: number; date: string; goal: string } | undefined {
  const match = content.match(
    /### Session (\d+) - ([\d-]+)[^\n]*\n\n\*\*Goal\*\*: (.+)/
  )
  if (!match) return undefined
  return {
    number: parseInt(match[1]),
    date: match[2],
    goal: match[3],
  }
}

export default tool({
  description:
    "Get bonfire session status with structured context summary. Returns project info, current state, priorities, and recent session details.",
  args: {},
  async execute() {
    const indexPath = ".bonfire/index.md"

    if (!existsSync(indexPath)) {
      const result: BonfireStatus = {
        exists: false,
      }
      return JSON.stringify(result, null, 2)
    }

    const content = readFileSync(indexPath, "utf-8")
    const metadata = extractMetadata(content)

    const result: BonfireStatus = {
      exists: true,
      project: metadata.project,
      status: metadata.status,
      branch: metadata.branch,
      currentState: extractSection(content, "Current State"),
      priorities: extractPriorities(content),
      recentSession: extractRecentSession(content),
    }

    return JSON.stringify(result, null, 2)
  },
})

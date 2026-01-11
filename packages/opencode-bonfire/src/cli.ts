#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync, readdirSync, rmSync, rmdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { homedir } from "os"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const FILES_DIR = join(__dirname, "..", "files")

function printHelp() {
  console.log(`
opencode-bonfire - Session persistence for AI coding

Usage:
  opencode-bonfire install [--global]    Install Bonfire to .opencode/
  opencode-bonfire uninstall [--global]  Remove Bonfire files
  opencode-bonfire --help                Show this help

Options:
  --global    Install to ~/.config/opencode/ instead of .opencode/

Examples:
  bunx opencode-bonfire install          # Project install
  bunx opencode-bonfire install --global # Global install
`)
}

function getTargetDir(global: boolean): string {
  if (global) {
    return join(homedir(), ".config", "opencode")
  }
  return join(process.cwd(), ".opencode")
}

function install(global: boolean) {
  const targetDir = getTargetDir(global)
  const scope = global ? "global" : "project"

  console.log(`Installing Bonfire (${scope})...`)
  console.log(`Target: ${targetDir}\n`)

  // Create target directory if it doesn't exist
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
    console.log(`Created ${targetDir}`)
  }

  // Copy all directories from files/
  const dirs = ["agent", "command", "plugin", "skill", "tool"]
  for (const dir of dirs) {
    const src = join(FILES_DIR, dir)
    const dest = join(targetDir, dir)

    if (existsSync(src)) {
      cpSync(src, dest, { recursive: true })
      const count = countFiles(src)
      console.log(`  Copied ${dir}/ (${count} files)`)
    }
  }

  // Copy config files
  const configFiles = ["opencode.json", "package.json"]
  for (const file of configFiles) {
    const src = join(FILES_DIR, file)
    const dest = join(targetDir, file)

    if (existsSync(src)) {
      // Don't overwrite existing config
      if (existsSync(dest)) {
        console.log(`  Skipped ${file} (already exists)`)
      } else {
        cpSync(src, dest)
        console.log(`  Copied ${file}`)
      }
    }
  }

  console.log(`
Bonfire installed successfully!

Commands available:
  /bonfire-start     Start a session (reads context)
  /bonfire-end       End session (updates context)
  /bonfire-spec      Create implementation spec
  /bonfire-document  Document a codebase topic
  /bonfire-review    Review work for blindspots
  /bonfire-archive   Archive completed work
  /bonfire-configure Change project settings

Run 'opencode' and try '/bonfire-start' to begin.
`)
}

function uninstall(global: boolean) {
  const targetDir = getTargetDir(global)
  const scope = global ? "global" : "project"

  console.log(`Uninstalling Bonfire (${scope})...`)
  console.log(`Target: ${targetDir}\n`)

  const filesToRemove = [
    // Agents
    "agent/codebase-explorer.md",
    "agent/doc-writer.md",
    "agent/spec-writer.md",
    "agent/work-reviewer.md",
    // Commands
    "command/bonfire-archive.md",
    "command/bonfire-configure.md",
    "command/bonfire-document.md",
    "command/bonfire-end.md",
    "command/bonfire-git-strategy.md",
    "command/bonfire-review.md",
    "command/bonfire-spec.md",
    "command/bonfire-start.md",
    // Plugin
    "plugin/bonfire-hooks.ts",
    // Skill
    "skill/bonfire-context/SKILL.md",
    // Tool
    "tool/bonfire.ts",
  ]

  let removed = 0
  for (const file of filesToRemove) {
    const path = join(targetDir, file)
    if (existsSync(path)) {
      rmSync(path)
      removed++
    }
  }

  // Try to remove empty skill directory
  const skillDir = join(targetDir, "skill", "bonfire-context")
  if (existsSync(skillDir)) {
    try {
      rmdirSync(skillDir)
    } catch {}
  }

  console.log(`Removed ${removed} Bonfire files.`)
  console.log(`
Note: opencode.json and package.json were not removed.
      .bonfire/ directory (your session data) was preserved.
`)
}

function countFiles(dir: string): number {
  let count = 0
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isFile()) {
      count++
    } else if (entry.isDirectory()) {
      count += countFiles(join(dir, entry.name))
    }
  }
  return count
}

// Main
const args = process.argv.slice(2)
const command = args[0]
const global = args.includes("--global")

switch (command) {
  case "install":
    install(global)
    break
  case "uninstall":
    uninstall(global)
    break
  case "--help":
  case "-h":
  case undefined:
    printHelp()
    break
  default:
    console.error(`Unknown command: ${command}`)
    printHelp()
    process.exit(1)
}

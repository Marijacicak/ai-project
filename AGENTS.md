# Agents — Source of Truth

This file is the single source of truth for agent behaviour, conventions, and skill discovery in this repository. All agent-specific instruction files (for Copilot, Claude, Codex, or others) MUST consult and follow this document first.

Rules

- Single source: `AGENTS.md` is authoritative. Do not prefer other repo-level instruction files over this file.
- Skills: Read all skill definitions under `.agents/skills/`. Skill files are the canonical place for focused behavior (modes, review rules, UI conventions, etc.).
- Updates: When adding or changing a skill, update the corresponding `SKILL.md` under `.agents/skills/` and add a short line in this file describing the skill.
- Claude wrappers: Each skill has a thin entry point at `.claude/skills/<name>/SKILL.md` that copies the frontmatter and points to the canonical file. When adding, renaming, or removing a skill, or changing its description, update its wrapper too.

Skills

- `caveman`: Ultra-compressed replies (lite, full, ultra modes) when the user asks for brevity.
- `grill-me`: One-question-at-a-time interview that stress-tests a plan until shared understanding.
- `improve-codebase-architecture`: Finds shallow modules, reports them as HTML, then grills through the one the user picks. Manual only.
- `mui-frontend`: React UI work using the repo's MUI theme, `sx` styling, and component conventions.
- `write-a-prd`: Interviews the user, then drafts a Product Requirements Document.

# Project instructions

Stack: React, TypeScript, FastAPI, Python.

- Keep changes minimal and focused.
- Follow existing architecture and patterns.
- Avoid unnecessary dependencies and abstractions.
- Read only relevant files.
- Use concise responses.
- Never skip tests for changed behavior.
- Do not modify unrelated code.
- Use skills only when relevant to the task.
- Prefer JEV output where supported and useful.

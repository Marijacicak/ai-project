# Agents — Source of Truth

This file is the single source of truth for agent behaviour, conventions, and skill discovery in this repository. All agent-specific instruction files (for Copilot, Claude, Codex, or others) MUST consult and follow this document first.

Rules

- Single source: `AGENTS.md` is authoritative. Do not prefer other repo-level instruction files over this file.
- Skills: Read all skill definitions under `.agents/skills/`. Skill files are the canonical place for focused behavior (modes, review rules, UI conventions, etc.).
- Updates: When adding or changing a skill, update the corresponding `SKILL.md` under `.agents/skills/` and add a short line in this file describing the skill.

Known skills

- Caveman — ultra-compressed communication mode: `.agents/skills/caveman/SKILL.md`
- MUI Frontend — React + MUI UI conventions: `.agents/skills/mui-frontend/SKILL.md`
- PR Review — local PR review guidance: `.agents/skills/pr-review/SKILL.md`

How agents should use this file

1. Read `AGENTS.md` fully.
2. Read every `SKILL.md` referenced under `.agents/skills/` and follow their rules when that skill applies.
3. When responding, prefer instructions here over other documentation unless the user explicitly asks to consult another file.

If you are an assistant runtime that supports skill invocation, treat each `SKILL.md` as a separate, permissioned behavior module and only apply skills explicitly invoked by the user or by repository conventions documented here.

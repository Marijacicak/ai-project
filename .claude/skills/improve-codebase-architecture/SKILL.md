---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one the user picks. Use when the user says "improve architecture", "find refactoring opportunities", "where is the codebase shallow", or invokes /improve-codebase-architecture. Read-only until the user picks a candidate and agrees to the grilling session.
disable-model-invocation: true
---

# Improve Codebase Architecture (Claude entry point)

This is a thin wrapper. The canonical skill lives at
`.agents/skills/improve-codebase-architecture/SKILL.md` (see `AGENTS.md`).

Before starting, read `.agents/skills/improve-codebase-architecture/SKILL.md` in
full and follow its rules exactly. If that file cannot be read, stop and tell
the user rather than improvising the session from memory.

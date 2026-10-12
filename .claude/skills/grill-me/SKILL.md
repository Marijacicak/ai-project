---
name: grill-me
description: Relentlessly interview the user about a plan, design, or idea until a shared understanding is reached. Use when the user says "grill me", "interview me", "stress-test this plan", or invokes /grill-me. Asks one question at a time, walks each branch of the decision tree, gives a recommended answer for every question, and explores the codebase instead of asking for facts it can look up. Does not act on the plan until the user confirms shared understanding.
---

# Grill Me (Claude entry point)

This is a thin wrapper. The canonical skill lives at
`.agents/skills/grill-me/SKILL.md` (see `AGENTS.md`).

Before starting, read `.agents/skills/grill-me/SKILL.md` in full and follow its
rules exactly. If that file cannot be read, stop and tell the user rather than
improvising the session from memory.

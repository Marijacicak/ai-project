This repository uses `AGENTS.md` as the single source of truth for agent behaviour and skill discovery.

Guidelines

- Source of truth: Read and follow [AGENTS.md](../AGENTS.md) only. Do not consult other guidance files as authoritative.
- Skills: When the agent needs skill-specific behavior, read the appropriate skill file listed in `AGENTS.md` under `.agents/skills/`.
- Read-only: Do not assume implicit permissions beyond what `AGENTS.md` and the skill files state.

If you need to surface additional guidance for another assistant (Claude, Codex, etc.), create or consult the companion instruction file in `.github/` which will redirect to `AGENTS.md`.

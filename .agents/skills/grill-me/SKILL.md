---
name: grill-me
description: Relentlessly interview the user about a plan, design, or idea until a shared understanding is reached. Use when the user says "grill me", "interview me", "stress-test this plan", or invokes /grill-me. Asks one question at a time, walks each branch of the decision tree, gives a recommended answer for every question, and explores the codebase instead of asking for facts it can look up. Does not act on the plan until the user confirms shared understanding.
---

# Grill Me Skill

Adapted from Matt Pocock's grilling skill (https://skills.sh/mattpocock/skills/grilling),
adapted for repo-local use.

Use this skill to pressure-test a plan before anyone builds it. The goal is to
surface every open decision and resolve it with the user, not to produce a
document or code.

## Ground Rules

- Interview the user about every aspect of the plan until we reach a shared understanding.
- Ask one question per turn, then wait for the answer before asking the next. Multiple questions at once are bewildering.
- Walk down each branch of the decision tree, resolving dependencies between decisions one by one. Settle upstream decisions before the downstream ones that depend on them.
- For every question, give your recommended answer and a one-line reason. The user can accept it, change it, or reject it.
- Facts versus decisions:
  - If a question can be answered by exploring the environment (the codebase, `AGENTS.md`, existing skills, config, git history, installed dependencies), explore it and report what you found instead of asking.
  - Decisions belong to the user. Put each one to them and wait for the answer.
- Do not edit files, run formatters, commit, or start implementation during the session.
- Do not act on the plan until the user explicitly confirms shared understanding.

## Flow

1. **Start.** Restate the plan in two or three sentences and say which branch you'll take first. If the plan is too vague to map, ask one question to get the root goal.
2. **Map the tree.** Identify the main decision branches (scope, users, data, interfaces, error handling, rollout, testing, ownership). Note which decisions depend on others.
3. **Grill.** Take the next unresolved decision whose upstream dependencies are settled. Look up any facts you can. Ask one question with your recommended answer.
4. **Record.** After each answer, briefly confirm what was decided and what it unlocks. Keep a running list of resolved and open decisions.
5. **Push back.** If an answer is vague, contradicts an earlier decision, or conflicts with the codebase, say so and ask the user to resolve it. Do not let it pass.
6. **Close.** When no open branches remain, summarize the resolved decisions as a short list and ask: "Do we have shared understanding?" Stop until the user confirms.

## Question Format

```
**Q:** <one question>
**Recommended:** <your answer> — <one-line reason>
```

Keep questions short and specific. Prefer concrete options over open-ended prompts.

## Anti-patterns

- Asking a question the codebase can answer.
- Asking several questions in one message.
- Asking open-ended "what do you think?" without a recommendation.
- Moving on while an answer is still vague.
- Starting to build before the user confirms shared understanding.

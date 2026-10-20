---
name: improve-codebase-architecture
description: Scan a codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one the user picks. Use when the user says "improve architecture", "find refactoring opportunities", "where is the codebase shallow", or invokes /improve-codebase-architecture. Read-only until the user picks a candidate and agrees to the grilling session.
disable-model-invocation: true
---

# Improve Codebase Architecture

Adapted from Matt Pocock's `improve-codebase-architecture` skill
(https://github.com/mattpocock/skills), adapted for repo-local use. Its
companion skills (`grilling`, `domain-modeling`, `codebase-design`) are not
installed here, so the equivalent rules are inlined below. `grill-me`
(`.agents/skills/grill-me/SKILL.md`) is the repo's grilling skill and is the
reference for the grilling phase.

The goal is to find **deepening opportunities**: places where a shallow module
(an interface nearly as complex as its implementation) can become a deep one
(a small interface hiding a lot of behaviour). Deeper modules are easier to
test and easier for an AI agent to navigate.

## Ground Rules

- Phase 1 and 2 are read-only with respect to the codebase. Do not edit source
  files, run formatters, commit, or start refactoring.
- Phase 2 writes exactly one artifact: the HTML report, in the OS temp
  directory. Do not write it into the repo.
- Do not propose concrete interfaces in the report. Interface design happens
  only after the user picks a candidate, during the grilling phase.
- Ask one question per turn, each with a recommended answer, as in `grill-me`.
- Facts versus decisions: explore the codebase, `AGENTS.md`, git history, and
  config for facts. Decisions belong to the user.

## Vocabulary

Use these terms consistently in the report and in the grilling:

- **Module**: anything with an interface and an implementation (a function, class, package, or service).
- **Interface**: everything a caller must know to use the module: signatures, invariants, ordering, error modes, configuration.
- **Depth**: behaviour behind the interface, relative to the interface's size. Deep = much behaviour, small interface. Shallow = interface almost as complex as what it hides.
- **Seam**: a place where behaviour can be altered without editing the code in place.
- **Adapter**: an implementation that satisfies a seam.
- **Leverage**: what callers gain from a module's depth.
- **Locality**: what maintainers gain from concentrating change, bugs, and knowledge in one place.

Principles:

- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through and is shallow. If complexity reappears across many callers, it was earning its keep.
- **One adapter = hypothetical seam; two adapters = real seam.** Don't recommend a seam with a single implementation unless the report says why it will get a second.

## Phase 1: Explore

1. **Decide where to look.** If the user named an area, start there. Otherwise favour recently changed areas: run `git log --since="3 months ago" --name-only --pretty=format:` and count which files churn most. Churn plus friction is the strongest signal.
2. **Read context if it exists.** Check for `CONTEXT.md` (domain language) and `docs/adr/` (past decisions). This repo does not have these yet; if they are missing, say so in the report and continue. Don't create them in this phase.
3. **Walk the code** for:
   - Shallow modules: thin wrappers, pass-through layers, interfaces that mirror their implementation.
   - Friction between concepts: one feature spread across many files, or one file doing several unrelated jobs.
   - Poorly tested code: behaviour that is hard to test because it is tangled with I/O, globals, or construction.
   - Leaky seams: callers that must know internal ordering, state, or error details.
   - Hard-coded dependencies that should go through a seam.
4. **Apply the deletion test** to every suspected shallow module before listing it.
5. **Drop weak candidates.** Keep only those with a concrete, citable problem.

For a large repo, you may fan out read-only searches with the Explore agent. Each search must return conclusions and file:line references, not file dumps.

## Phase 2: Report

Write a self-contained HTML report to the OS temp directory (on this machine,
`%TEMP%`), open it in the default browser (`start "" "<path>"` on Windows,
`open` on macOS, `xdg-open` on Linux), and give the user the full path. If
opening fails, the path alone is enough. Do not put the report in the repo.

Each candidate is a card containing:

- **Title** and **strength badge**: `Strong`, `Worth exploring`, or `Speculative`.
- **Files**: repo-relative paths with line references.
- **Problem**: what is shallow or tangled, and what it costs (testing, navigation, change risk). Cite evidence such as churn counts or the deletion-test result.
- **Solution direction**: a one-sentence direction only. No interfaces.
- **Benefits**: locality and leverage gained.
- **Before/after diagram**: a simple Mermaid or ASCII diagram of the module graph.

The report ends with:

- A **top recommendation** with a one-line reason.
- Any **ADR conflicts**, flagged only when the friction is strong enough to justify reopening a past decision.

Keep the HTML self-contained: inline CSS, and any diagram library loaded from
cdnjs.cloudflare.com only. Then ask the user which candidate to explore. Stop
until they answer.

## Phase 3: Grill

Once the user picks a candidate, run the grilling session using the rules in
`.agents/skills/grill-me/SKILL.md`: one question at a time, a recommended answer
for each, and walking the decision tree in dependency order. Cover:

- **Constraints**: what must not change (public API, data formats, deployment, performance).
- **Dependencies**: what calls this module, and what it calls.
- **Tests**: what would prove the deepened module behaves the same.
- **Interface design**: only now, and only if the user asks. When there are multiple plausible interfaces, sketch two or three in parallel and let the user choose (the "design it twice" pattern).

Terms used in the session: when a term is sharpened or a new one is agreed,
offer to add it to `CONTEXT.md`. Create the file only after the user agrees.

Offer an ADR only when the user rejects a candidate for a lasting reason that
future reviews should respect. Create it under `docs/adr/` only after the user
agrees.

Do not implement the refactor during this skill. When the user confirms
shared understanding, summarise the decisions and stop. Implementation is a
separate request.

## Anti-patterns

- Proposing interfaces in the report.
- Recommending a seam with one adapter and no stated second adapter.
- Listing a shallow module without applying the deletion test.
- Writing the report into the repo instead of the OS temp directory.
- Refactoring code during exploration or grilling.
- Asking the codebase's facts instead of looking them up.
- Asking several questions in one message.

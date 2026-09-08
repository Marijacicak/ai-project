---
name: pr-review
description: Review local PR, branch, staged, or working-tree changes against origin/dev and this repository's conventions. Use only when explicitly invoked with $pr-review or when the user asks to use the pr-review skill. Produces read-only, copy-pasteable PR comments with exact file and line references; never edits files, runs formatters, commits, or posts comments automatically.
---

# PR Review Skill

Use this skill for local, manual PR review. The goal is to inspect the current
implementation and changed code, then return high-signal review comments that a
human can paste into a PR.

## Ground Rules

- Stay read-only during review.
- Do not edit files, format code, create commits, stage files, or post comments.
- Do not run tests, lint, build, or validation commands unless the user explicitly asks.
- Do not generate or propose test files unless the user explicitly asks.
- Default compare target is `origin/main`.
- Include committed changes, staged changes, and unstaged changes in the review scope.
- Treat external skills and generic code-review advice as inspiration only. This repo's files are authoritative.

## Required Context

Read these sources before judging conventions:

- `AGENTS.md`
- `agents/skills/mui-frontend/SKILL.md`

Read `agents/skills/caveman/SKILL.md` only when the user invokes caveman mode.

## Review Setup

Use read-only inspection commands to determine every diff bucket:

```bash
git status --short --branch
git diff --stat origin/main...HEAD
git diff --name-status origin/main...HEAD
git diff origin/main...HEAD
git diff --staged
git diff
```

If `origin/main` is unavailable, say so clearly and stop unless the user provides
a different base.

If `origin/main...HEAD`, staged changes, and unstaged changes are all empty, say
there are no changes to review and stop. Do not stop only because the committed
branch diff is empty; staged or unstaged work still belongs to the review scope.

For changed files, inspect affected call sites and nearby patterns with `rg`.
Prefer focused searches over broad guessing, for example:

```bash
rg -n "ComponentName|hookName|modelName|apiName" src
rg -n "fetch\\(|XMLHttpRequest|getOidc" src/pages src/shared
rg -n "column_name|database_id|query_id|active_tab|selected_columns" src
```

## Review Lanes

Review every material change through these lanes:

- Correctness and regressions: runtime bugs, broken state or data flow, stale assumptions, missing loading/error/empty handling, changed call-site impact, and user-visible breakage.
- Architecture: ownership, reuse, module boundaries, oversized or mixed-responsibility files, duplicated abstractions, misplaced helpers, and unclear future edit paths.
- Repo conventions: `AGENTS.md`, MUI usage, RTK Query data-access boundaries, DTO-to-model normalization, Superset proxy routing, TypeScript conventions, comments, and formatting expectations.
- PR comments: only comments that are worth a human reviewer leaving on the PR.

Skip issues handled entirely by the compiler, formatter, or linter unless the
diff shows a likely runtime or architectural consequence.

## Evidence Standard

Do not report a finding unless it has concrete evidence:

- a changed file and exact line;
- the relevant convention, nearby pattern, or current implementation behavior;
- the likely affected user/app surface.

If expected behavior is unclear, label the item as an open question or
no-comment observation instead of presenting it as a defect.

## Severity

- `P0`: blocking crash, data loss, security issue, or production-breaking regression.
- `P1`: likely bug/regression or broken repo convention with behavior risk.
- `P2`: maintainability, architecture, or convention issue worth a PR comment.
- `P3`: optional polish. Exclude by default unless the user asks for exhaustive notes.

Prefer fewer, stronger findings over broad commentary.

## Output Format

Return Markdown with exactly these top-level sections:

```markdown
## Review Scope

- Base: `origin/main`
- Covered: committed branch diff; staged changes; unstaged changes
- Changed areas: agents/skills/pr-review/SKILL.md; AGENTS.md

## Findings

[P1] `agents/skills/pr-review/SKILL.md:45`

Suggested PR comment:
This review exits when the committed branch diff is empty, but the skill also says staged and unstaged changes are in scope. A WIP-only review would stop before inspecting the local changes it promised to cover.

Evidence:
Line 19 includes committed, staged, and unstaged changes in the review scope, while line 45 treats an empty committed diff as sufficient reason to stop.

Affected surface:
Manual `$pr-review` runs for staged or unstaged local work.

Confidence: High

## No-Comment Observations

- None

## Review Coverage

- Inspected: agents/skills/pr-review/SKILL.md; AGENTS.md; relevant local skill files; adapter files.
- Blind spots: tests, lint, build, and runtime behavior were not checked because the review was read-only.
```

The fenced block above is a completed example, not reusable review content. Use
its structure only. In the real response, every path, line, comment, evidence
statement, affected surface, confidence value, changed area, inspected item, and
blind spot must come from the current review.

Before responding, check the final Markdown against these quality gates:

- Do not include placeholder text, fake paths, fake line numbers, ellipses, or
  template-only sentences.
- Use `None` for empty no-comment observations or empty blind spots.
- If there are no findings, write `No findings worth PR comments.` under
  `## Findings`.
- Every finding must include `Suggested PR comment`, `Evidence`,
  `Affected surface`, and `Confidence`.
- Every suggested PR comment must be directly pasteable into a PR without
  editing.

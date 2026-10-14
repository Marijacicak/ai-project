---
name: write-a-prd
description: Write a Product Requirements Document by grilling the user on product vision, success metrics, features, and timelines. Use when the user says "write a prd", "create a prd", "help me write a prd", or invokes /write-a-prd. Builds shared understanding of the product before drafting the final document.
---

# Write a PRD Skill

Adapted from Matt Pocock's PRD writing skill.

Use this skill to create a comprehensive Product Requirements Document that aligns stakeholders on vision, scope, and success criteria. The goal is to create clarity before building, not to produce busywork.

## Ground Rules

- Interview the user about product goals, users, success metrics, features, and constraints using one question at a time.
- Explore the codebase and existing documentation to understand context instead of asking for facts you can look up.
- Settle product vision and user problems before discussing features.
- Identify and document success metrics and acceptance criteria early.
- Walk through feature scope, priorities, and dependencies systematically.
- Clarify timelines, milestones, and rollout strategy.
- Surface and resolve risks, dependencies, and blockers.
- Do not draft the final PRD until the user confirms shared understanding of the complete picture.
- Do not start implementation or design work during the PRD session.

## PRD Sections to Cover

The final PRD will include these sections, but only grill what is needed:

1. **Overview**
   - Product name and vision statement
   - Problem statement
   - Target users and personas
   - High-level value proposition

2. **Goals & Success Metrics**
   - Business goals
   - User goals
   - Key success metrics (measurable)
   - Acceptance criteria

3. **Scope & Features**
   - Features included (MVP vs. phase 2+)
   - Features explicitly NOT included
   - Feature priorities and dependencies
   - User workflows and journeys

4. **Timeline & Milestones**
   - Project phases and milestones
   - Dependency chain
   - Go-live date and rollout plan
   - Launch criteria

5. **Risks & Constraints**
   - Technical risks
   - Dependencies on other teams
   - Resource constraints
   - Known unknowns

6. **Success & Approval**
   - Stakeholders and sign-off requirements
   - Review and feedback process
   - Success celebration criteria

## Flow

1. **Start.** State the product goal in two sentences. Ask which area the user wants to nail down first: vision, users, success metrics, features, timeline, or risks.

2. **Grill by Section.** For each chosen section, identify key questions and decision points. Use `grill-me` style one-per-turn questioning to resolve each.

3. **Look Up Context.** Before asking a fact question, search the codebase, git history, and existing docs (AGENTS.md, README, design specs) for relevant context.

4. **Clarify Ambiguity.** If an answer is vague, contradicts earlier decisions, or leaves scope undefined, push back with specific questions. Do not let hand-waving pass.

5. **Record Decisions.** After each answer, confirm what was decided and how it affects related decisions. Keep a running summary.

6. **Check Completeness.** When you've covered all major sections, ask: "Do we have a complete picture of the product?" Wait for confirmation before drafting.

7. **Draft PRD.** Once shared understanding is confirmed, create a clean, well-structured PRD document (as a Markdown file or artifact) ready for stakeholder review.

## Question Format

```
**Q:** <one specific question>
**Recommended:** <your answer> — <one-line reason>
```

Keep questions concrete and answerable. Offer options where helpful.

## Anti-patterns

- Asking questions the codebase or existing docs can answer.
- Asking multiple questions in one turn.
- Letting scope remain fuzzy ("we'll figure it out in build").
- Skipping success metrics in favor of rushing to features.
- Forgetting to document what is NOT included.
- Starting a draft before the user confirms shared understanding.

## After PRD Approval

Once the user confirms shared understanding:
- Generate a clean, stakeholder-ready PRD document.
- Offer to create supporting artifacts: wireframes, success dashboards, risk register, or rollout plan.
- Provide the PRD in a format ready for distribution (Markdown, PDF, or artifact link).

---
name: consultation-pattern
description: The generic agent-to-agent knowledge-exchange mechanic (specialist determines need → requests explicitly and stops → Main orchestrates only → specialist retains full responsibility). Load when an agent file's own consultation triggers fire, or when defining a new consultative relationship. Canonical source: company/CLAUDE.md's "Consultation Pattern" section — this Skill exists so consuming agents don't have to restate the mechanic inline.
---

# Consultation Pattern

A standard shape for any agent-to-agent knowledge exchange that must never turn into one agent doing another's job. Originated with `architect` (the first consultable specialist), generalized when `knowledge-mentor` was created, and now the shared rule any future consultative agent follows.

**The rule:**
1. **The specialist determines the need.** Consultation triggers are objective conditions defined in the specialist's own agent file — properties of the task at hand, never a vague "if unsure." Only the specialist, evaluating its own in-progress reasoning, is positioned to know whether one is met. Main does not pre-judge this on the specialist's behalf.
2. **The specialist requests, explicitly, and stops.** When a trigger is met, the specialist states the specific question it needs answered and stops there rather than guessing past it.
3. **Main orchestrates only.** Main dispatches the consulted agent with exactly the question asked, and relays the returned evidence back to the requesting specialist. Main does not assess whether the consultation was warranted, does not editorialize on the evidence, and does not decide anything on the specialist's behalf.
4. **The specialist retains full responsibility.** Consulted evidence is input to the specialist's own reasoning, never a substitute for it. The specialist's final judgment, conclusions, recommendations, and deliverables are entirely its own — a consultation never shifts accountability to the consulted agent, which by design produces evidence, not decisions.

**Why this shape, specifically:** it keeps three distinct responsibilities from ever blurring into each other — the specialist's domain judgment, Main's orchestration, and the consulted agent's evidence-gathering. A consulted agent that started making decisions would collapse into a reviewer or a second specialist; a Main that started deciding when consultations are needed would collapse into the specialist it's supposed to be dispatching, not supervising.

This pattern applies to any consultative relationship, not just `knowledge-mentor` — e.g. `brand-guardian` consulting `knowledge-mentor` on brand-strategy theory, `architect` consulting `knowledge-mentor` on software-architecture precedent. Each agent file states its own specific triggers (when it consults whom, about what); this Skill covers only the mechanic all of them share.

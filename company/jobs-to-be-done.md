# Jobs To Be Done — Nahui / Ana

Prepared by: Market Validation & Go-to-Market (`marketing` agent), persisted by Main, 2026-08-07.

**Purpose.** This is a synthesized, evidence-based understanding of the job the merchant is hiring Nahui to do — the durable analytical foundation future positioning, messaging, and go-to-market work builds on. It is explicitly not positioning or messaging itself, and contains none.

**Relationship to other artifacts** (per `company/CLAUDE.md`'s "Relationship between artifacts" discipline — this doc has one job, doesn't duplicate another's):
- `company/market-validation.md` — the ICP hypothesis-testing package (H1-H6) and its validation-activity plan. This document explains *why* those hypotheses matter (the underlying job the ICP is being screened against); it doesn't replace or re-run that testing plan. One specific relationship is called out explicitly below (Open Hypotheses, item 1); a second, narrower cross-reference lives in Friction tier 2 below (§3).
- `company/CLAUDE.md`'s Core Thesis — the primary source for the one validated merchant interview this analysis is grounded in.
- `product/00-foundation/vision.md`, `domain-model.md`, `decision-log.md` — architectural grounding for the functional job statement and the explicit non-goals.
- The Merchant Experience Kit (FigJam, see `company/active-artifacts.md`) — the team's persona/empathy-map/journey artifact. This document is a complementary, text-based, JTBD-specific lens on the same merchant — not a duplicate, and not a replacement for it.

**Evidentiary tiers used throughout, per explicit Product Owner instruction:**
- **Validated Findings** — backed by two or more independent, converging sources, or direct, load-bearing architectural grounding (a decision-log entry or domain-model structure built specifically around the claim).
- **Supported Evidence** — grounded in a real source (the interview, a decision-log entry, competitive research), but single-sourced or partly inferred rather than independently corroborated. Strong working knowledge, not yet fact.
- **Open Hypotheses** — explicitly not validated. Named as hypotheses pending further merchant research, never to be read or cited as settled findings.

---

## Validated Findings

### 1. The core functional Job To Be Done

*When a customer is standing in front of her, ready to buy, capture that sale as a permanent record in a few seconds or less — fast enough that doing so never costs her the next customer, who may approach at any unpredictable moment.*

A specific job-in-context, not "track sales" as an abstraction: a specific moment (mid-transaction, customer present), a specific constraint (unpredictable arrival of the next customer), a specific failure mode (the record is lost, not delayed).

**Sources:** `company/CLAUDE.md` Core Thesis, verbatim — "her top-priority friction is sale registration — customer flow is unpredictable, so any registration step over a few seconds competes with attending the next customer, and she loses the sale record." Independently corroborated by field observation: "Attention returns to customers immediately whenever someone approaches — this observed behavior directly corroborates the already-validated top friction... with an independent observational source, not just Ana's own self-report" (`company/market-validation.md` §1a). Architecturally load-bearing, not just descriptive: `decision-log.md` D7 makes Sale its own aggregate root specifically so "Sale writes don't contend on a shared Session lock" for this exact speed requirement; D6 keeps Session-opening free of any Event dependency "so as not to add a step in front of the exact friction point... already validated as the top priority."

### 2. What Nahui is explicitly NOT being hired for

- **Payment processing.** `vision.md`: "Nahui is not a payment application." `company/CLAUDE.md` Non-goals: "Payments/checkout — out of scope, do not build."
- **Bazaar-selection guidance** (foot-traffic/weather planning). A real, validated friction (see Supported Evidence, tier 2) but explicitly parked: `market-validation.md` H4 — "not started, no multi-vendor data exists, do not build... listening-only."
- **Customer segmentation as a standalone job.** Deliberately sequenced *after* registration: "Paid tier: customer segmentation... available once user has own sales history" (`company/CLAUDE.md`); `market-validation.md` H3 — "Segmentation readiness follows registration, doesn't precede it."
- **General bookkeeping/accounting** and **inventory management as an end in itself.** The Lot/InventoryUnit traceability chain (`domain-model.md`) exists to let the platform allocate sales correctly and preserve history — instrumental to the registration job (D2, D3), not a job the merchant hires the app for on its own.

### 3. The highest-friction moment of the bazaar day

The live sale-registration moment, inside "Sell Products" in `vision.md`'s workflow chain, during unpredictable customer flow. This is the only moment in the entire day with two independent, converging sources (the Ana interview and the separate field observation cited above) — every other moment in the chain (receiving merchandise, registering a Lot, tagging, closing a Session, reviewing results) has no friction evidence recorded in any source reviewed.

---

## Supported Evidence

### 1. Competing alternatives, mapped to the specific job each actually performs

Not a feature comparison — each alternative mapped to which job it satisfies, since several satisfy a *different* job that looks adjacent on the surface.

| Alternative | Job it actually satisfies | Evidence basis |
|---|---|---|
| Libreta/notebook | The registration job directly — same moment, same intent. The direct behavioral incumbent for the core job. | Competitive/behavioral landscape research, 2026-08-07 (real content-genre prevalence; zero cost/connectivity dependency; full trust) |
| Payment-terminal POS (Clip, Mercado Pago Point, SumUp) | A different job: card-payment acceptance. Registration only happens as a byproduct of a card transaction; cash sales get no benefit. | Same research pass — Clip's own page states it needs constant internet; commission-based (3.5%+), conflicting with the validated rejection of fee-based models (`company/CLAUDE.md`) |
| Loyverse | The registration job, functionally (free, offline-capable) — but no evidence it's actually being *hired* by this specific ICP. | Same research pass — "zero evidence of Mexico-bazaar-specific adoption." A capable-in-theory alternative with unproven fit, not a proven failure. |
| WhatsApp Business / Instagram | The relationship/recognition job (see friction tier 3 below) — not a registration competitor at all. | `company/CLAUDE.md`: "they follow her organically via IG/WhatsApp." Confirmed live and used in the competitive research; a network-level switching barrier since customers, not just the merchant, are already there. |
| Spreadsheets | End-of-day reconciliation — a different moment than live capture during a sale. | Competitive research — "confirmed real and marketed to this segment, but more an end-of-day reconciliation tool than live registration." |
| Memory / calculator | Possibly the registration job, as a fallback — but the evidence is thin. | Only the Ana interview itself supports this ("she loses the sale record"); no independent corroboration found. |

**Where each alternative specifically underserves the job** (not a blanket "everything is underserved" claim): the notebook fails at reliability under unpredictable flow, the exact condition defining the job. Payment-terminal POS fails structurally on cash sales, not just imperfectly. Loyverse's gap is evidentiary (unproven fit for this ICP), not a demonstrated functional failure. WhatsApp/Instagram were never attempting this job, so aren't "failing" at it — but they do underserve the adjacent relationship job on the specific thing Ana has named wanting (telling apart a high-volume-occasional buyer from a small-but-every-bazaar one — presence on IG/WhatsApp shows visibility, not purchase pattern).

### 2. Emotional jobs (evidence-backed, narrower than the functional job)

- **Wanting to feel in control**, avoiding the anxiety of not knowing her own numbers. Directly evidenced by a real behavioral adaptation, not just a stated preference: "She caps her own catalog size to keep mental control... which caps growth" (`company/CLAUDE.md`). She pays a real cost (limited growth) specifically to preserve this feeling — strong evidence of a genuine emotional job.
- **Avoiding the specific cost of a dropped sale record.** Implied directly by "she loses the sale record" being named as the friction's consequence — read as an emotional cost (frustration, a sense of money she was owed) rather than only a data-completeness problem, though the source describes the event, not a directly quoted feeling; this is a reasonable inference from the interview, not an independent confirmation of Ana's own words about how it feels.
- **Not wanting technology to get in her way mid-sale.** Consistent with — but derived from — the product team's own UX philosophy ("Technology should disappear," `global-principles.md`), which is itself a design response to Ana's validated friction, not a separate emotional statement from Ana herself.
- **Explicitly not included, for lack of evidence:** "embarrassment in front of a customer" is a commonly-assumed emotional job for this kind of friction, but no source reviewed supports it. Named here to record that it was considered and excluded, not overlooked.

### 3. Friction tier 2 — bazaar-selection

Validated as real ("choosing which bazaar to attend, with no data on foot traffic/weather," `company/CLAUDE.md`), but single-sourced to the original interview (no independent field-observation corroboration the way tier-1 friction has), and deliberately lower-urgency by nature — a planning decision made with time to deliberate, not a split-second cost. Explicitly parked per `market-validation.md` H4.

**Update, 2026-08-08:** a new, informal field observation adds a concrete facet to this friction that wasn't previously recorded anywhere — a real, known cost differential across venues (roughly $2,500 to $7,000 per event, plus a variable staffing cost when she pays someone else to operate her stand) that Ana weighs as a real input to her decisions. This is distinct from, but related to, the foot-traffic/weather uncertainty described above — a cost-side facet of "which bazares are worth it," not a demand-side one. Sourced to the same informal, unprompted, direct conversation as the pricing-structure refinement recorded in `company/market-validation.md` §1c's H6a — first-hand and real, but a single informal exchange, not a structured interview, so this stays tagged **Supported Evidence** (not promoted to Validated Finding) and does not change this friction's parked, listening-only status under H4. Full record, including the specific figures and their relationship to Ana's per-event pricing behavior: `company/market-validation.md` §1d.

### 4. Friction tier 3 — customer segmentation

Validated as real (`company/CLAUDE.md`'s third friction), single-sourced to the interview, and structurally different in kind from tier 1 — an ongoing, background frustration rather than a moment tied to a specific point in the day's workflow chain. Doesn't block a transaction in real time the way tier 1 does.

---

## Open Hypotheses — not validated, pending further merchant research

**1. The Unserved-Job Hypothesis:** the core registration job may currently be *unserved* — not merely underserved — by any real alternative under actual customer-flow pressure. Sourced from the competitive/behavioral landscape research's own stated open finding: "no confirmed instance found of any alternative being used for live sale registration specifically under real customer-flow pressure." This is a materially stronger, more falsifiable claim than "underserved," and is explicitly **not promoted to fact** here.

*Relationship to `market-validation.md`'s existing H1 ("Registration-friction generalization"), named explicitly to avoid an ambiguous cross-document label collision — this is a related but distinct claim, not the same hypothesis under a different name:* H1 asks whether *other vendors beyond Ana* share the friction at all (a prevalence question). The Unserved-Job Hypothesis asks whether, *for vendors who do have the friction*, any existing alternative actually solves it (a competitive-adequacy question). Both remain open. `market-validation.md`'s own Section 6 already defines H1's learning objective and evidence-expected criteria — this new hypothesis has no such testing plan yet and would need one before it can be evaluated, not before it's named as an open question.

**2. Social jobs.** The evidentiary base here is close to empty — no source reviewed contains any direct statement about how Ana wants to be seen by customers, other vendors, or family. A plausible-sounding hypothesis exists (e.g., "wants to be seen by other vendors/customers as running a real, growing business, not an informal side hustle") but it is not constructed here from the available evidence — it would need direct testing, not inference layered on inference.

**3. Bazaar connectivity reliability.** Inferred only from Clip's own stated requirement ("needs constant internet") as a *risk* to that specific alternative's usability in a bazaar setting — not confirmed by any direct field evidence that connectivity is actually unreliable at Ana's bazares specifically.

---

## Sources

- `company/CLAUDE.md` (Core Thesis, Business model, Non-goals)
- `company/market-validation.md` (§1a field observations; §1c/§1d pricing-structure and bazaar-event-cost field observations, 2026-08-08; H1-H6 hypotheses, esp. H1, H3, H4, H6)
- `product/00-foundation/vision.md`
- `product/00-foundation/domain-model.md`
- `product/00-foundation/decision-log.md` (D2, D3, D6, D7, D11, D19–D27)
- `product/00-foundation/global-principles.md`
- Competitive/behavioral alternatives landscape research (`marketing` agent, 2026-08-07, this session — not yet separately persisted as its own artifact; the specific findings it contributes are captured inline above where cited)

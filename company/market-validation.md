# Market Validation Package — v1

Prepared by: Market Validation & Go-to-Market (marketing agent)
Date: 2026-08-02
Stage: MVP — validation and go-to-market **preparation**, not advertising. Nothing here has been published or sent.

Context anchor: we already have one validated merchant, Ana (itinerant clothing vendor, private bazares, Estado de México — see `company/CLAUDE.md`). Everything below exists to find out whether Ana's frictions generalize to a wider ICP, and to identify real pilot candidates beyond her — not to launch or promote anything yet.

**Update, 2026-08-02 (same day):** Product Owner reviewed this package and gave scoped approval to proceed with exactly the "Can start now, no approval needed" list in Section 5 — community research, ICP refinement, candidate identification, passive observation, interview/survey preparation. Nothing beyond that list is authorized (no posting, no outreach, no live survey/landing page). This pass adds that work below, plus a full rationale for Section 6's numeric thresholds in the new Section 7, per the Product Owner's direct request. Section 6 itself is left untouched — any proposed revisions live in Section 7 pending sign-off.

**Update, 2026-08-02 (later same day):** Product Owner reviewed Section 7's threshold accounting and gave a directional correction: don't over-engineer validation at this stage — treat thresholds as directional hypotheses, not decision gates, since the objective right now is learning, not statistical proof. Section 6 is revised below to replace the "Validated if X% / Invalidated if Y%" framing with a learning objective and the evidence expected for each hypothesis, for each of H1-H5. Quantitative acceptance criteria return before the pilot phase, once there's a broader market understanding and a real acquisition channel. This is purely a reframing of what "success" means and how evidence gets read — Section 3's channel/activity recommendations are unchanged, and Section 5's approval gate is unchanged: nothing about what's authorized to run is affected by this update.

**Update, 2026-08-04:** Section 2.1's verification pass was run for the first time this session (live `WebSearch`/`WebFetch` access was available). It found real, URL-verified Facebook Groups/Pages and Instagram accounts — organizer/community channels, not individual merchant names. Full findings, the verification table applied per-channel, and an honest account of what's still unresolved live in `company/usability-testing-plan.md` §7.3 (written there because that document's Section 8 checklist was the concrete blocker this pass exists to unblock) — Section 2.1 below is left as the original verification-criteria table (still the right rubric to apply) with a short status pointer added rather than duplicating the results in two places.

**Update, 2026-08-05:** Product Owner provided direct field-observation data — Ana's age and a full bazaar-day workflow, from personally accompanying her at multiple bazares — for the Merchant Experience Kit (the new persona/empathy-map/journey FigJam artifact, see `product/02-ux/` era work). Recorded in new Section 1a below, sourced and dated, per this document's own citation discipline. This is genuinely new confirmed data, not a re-derivation from anything already written here — it upgrades two items that were previously open gaps (no age, no day-in-the-life timeline existed anywhere in the project) to Observed status. Per the Product Owner's explicit framing: this data describes *observed patterns*, contributing to a synthesized Primary Merchant Persona archetype, not biographical facts unique to one identifiable individual — the Merchant Experience Kit should present it accordingly (representative age range, not an exact figure, unless a design decision genuinely needs precision; workflow phases as patterns, not a diary entry).

**Update, 2026-08-08:** A Product Discovery thread (Product Owner + `architect` + `ux-designer`) investigating a "Day 0" merchant-onboarding gap confirmed the domain model currently has no price field anywhere on Product/SaleItem — a real, confirmed gap. In discussing how to resolve it, the Product Owner proposed a specific operating-model hypothesis for how Ana likely prices what she sells (a default price per selling group, overridden only when a specific variant's price meaningfully diverges), and was explicit that this is not something observed directly with Ana — it's a hypothesis, to stay classified as one until validated with her or other merchants. Recorded below as new Section 1c, tiered against what's actually validated (catalog-capping behavior, catalog size, category names) versus what's new and unvalidated (the price-per-group/split-on-divergence mechanic itself), with a corresponding validation-channel recommendation (new H6 in Section 3) and a new interview-guide probe (Section 4.6, C2). **This document makes no recommendation about where price should live in the domain model** — that question stays on hold per the Product Owner's own sequencing instruction, unaffected by this update.

**Update, 2026-08-08 (later same day):** A new field observation came in directly from Ana — informal (a natural conversation between friends, not a structured interview), but first-hand and unprompted-in-content: the Product Owner asked an open question (is pricing a pain point for her, or does she keep a small set of fixed prices) and Ana's answer went beyond what was asked. She described varying her prices by bazaar/event — not only by selling group — naming specific venues (El Libanés, Parques Polanco, Centro Cívico) where she charges differently, with event cost (roughly $7,000 for some events, $2,500 for others, plus sometimes paying someone else to operate her stand on weekdays) as a real input to that decision — while still keeping a simple mental model: a small set of selling groups at normal/default prices, occasionally adjusted per bazaar, not a per-customer or per-unit negotiation model. This **refines, rather than confirms or refutes,** Section 1c's H6: the "default price per selling group" half of that hypothesis moves from Product hypothesis to Supported Evidence, but the override *mechanism* turns out to include a second, event-driven axis the original framing didn't have. Recorded below as new subsection **H6a**, inside Section 1c — the original H6 text is preserved verbatim and marked refined/superseded-in-part, per this document's non-deletion convention, not deleted or silently overwritten. The bazaar-event-cost fact is also logged independently in new **Section 1d**, since it's evidence in its own right (event cost as a real input to Ana's business decisions) — related to, but separable from, the pricing-structure question, and cross-referenced from `company/jobs-to-be-done.md`'s existing bazaar-selection friction (tier 2). Both new items are tagged explicitly as **Supported Evidence with informal sourcing** — real, first-hand, unprompted content, but a single informal conversation, not the planned structured H6 interview (Section 4.6, C2), which still has not been conducted.

---

## 1a. Field observations — Primary Merchant Persona (2026-08-05)

Source: Product Owner, direct field observation, accompanying Ana at multiple bazares (in-person, not a document/survey/interview transcript). Distinct sourcing category from the "confirmed via interview with Ana" facts already in `company/CLAUDE.md` and above — those are Ana's own stated words; this is what was directly observed of her working pattern. Both are first-party, high-confidence sources; neither is a market-wide hypothesis (H1-H5 above) until tested against other vendors.

**Age:** 44. Recorded here as the precise data point for traceability, but the Product Owner has explicitly directed that the Merchant Experience Kit present this as a representative range ("early-to-mid 40s" / "40-45"), not the exact figure, unless a specific design decision requires precision — consistent with treating the Kit as a synthesized archetype rather than one individual's biography.

**Typical bazaar workflow (observed pattern, not unique to one bazaar):**

*Pre-bazaar:*
- Merchandise purchased from suppliers before each bazaar.
- Large shipments often arrive in oversized packages (~2m long × 50cm wide).
- Merchandise collected personally.
- Purchasing cycle may repeat multiple times before an upcoming bazaar, depending on how sales are going.

*Bazaar setup:*
- Arrives very early on the day of the bazaar, sometimes the afternoon before.
- Confirms assigned table/booth with organizers.
- Organizes and prepares the stand before customers arrive.

*During the bazaar:*
- Primary activity is serving customers and making sales.
- During quiet periods, often reads or walks around to visit other vendors.
- Attention returns to customers immediately whenever someone approaches — this observed behavior directly corroborates the already-validated top friction (sale registration competing with attending the next customer, `company/CLAUDE.md`'s core thesis) with an independent observational source, not just Ana's own self-report.

*Multi-day bazaars:*
- If the bazaar spans multiple days, merchandise and the stand stay at the venue overnight; organizers are responsible for venue security.
- She returns directly the next morning to continue selling.

**Framing note for whoever builds from this:** these are observed patterns intended to describe the Primary Merchant Persona archetype (synthesized from merchant interviews, field observations, Product Owner observations, marketing research, and ongoing product discovery — Ana being the strongest single contributor, not the sole subject). Present as "observed patterns" / "typically," not as a unique, unrepeatable event specific to one calendar day.

---

## 1. ICP hypotheses

Each is stated so it can fail. None of these are personas — they're claims to test.

**H1 — Registration-friction generalization (highest priority, maps to backlog #1)**
Itinerant apparel/accessories vendors who sell at *private* bazares (bazares privados, ventas de garage, bazares en casa/salón — invite- or referral-based, distinct from open street tianguis) in Estado de México / CDMX metro, with a multi-SKU catalog (roughly 10+ products) and unpredictable customer flow, share Ana's top friction: registering a sale competes with attending the next customer, and sale records get lost.

**H2 — Catalog self-capping is a control problem, not a capital problem**
Vendors in this segment cap their own catalog size specifically to keep mental control over inventory/sales tracking — not primarily because of capital, storage, or transport limits. If true, a low-friction registration tool removes a real growth ceiling, not just a convenience.

**H3 — Segmentation readiness follows registration, doesn't precede it**
Vendors already informally track repeat customers via Instagram/WhatsApp follows, and want to tell a high-volume-occasional buyer apart from a small-but-every-bazaar buyer, but have no way to do it today. This makes paid customer segmentation a wanted *upgrade* once registration is solved — not a standalone feature people would adopt on its own.

**H4 — Bazaar-selection friction is real but out of scope right now (parking lot)**
Vendors who rotate across 3+ different bazares/tianguis a month feel real cost from picking a low-traffic or bad-weather date and would value informed guidance. `company/backlog.md` #3 is explicit: not started, no multi-vendor data exists, do not build. This hypothesis stays a listening-only item — we log signal, we don't design or pitch anything against it yet.

**H5 — Pricing model generalizes beyond Ana**
Vendors will accept a free-registration / paid-segmentation model (and treat the NFC tag pack as a consumable investment, per `decision-log.md` D11) and will resist a per-transaction commission — the same shape Ana already rejected. Worth checking this isn't just Ana's personal preference. Note: `business-decisions.md` Q11 (billing-cycle/deferred-timing rule) is still open, so this hypothesis is tested at the *directional* level (recurring/tiered vs. commission) — not against a specific price point or billing cadence.

### Refinements (2026-08-02, ICP refinement pass per Product Owner-approved scope)

No live web/social access was available this pass either (see Section 2), so these refinements are grounded in re-reading `company/CLAUDE.md`, `product/00-foundation/vision.md`, `product/00-foundation/backlog.md`, and `company/business-decisions.md` — not in new field data. They sharpen precision/testability; they don't change what's being claimed.

- **H1 — scope boundary vs. `vision.md`'s broader framing.** `vision.md` describes Nahui's long-run vision as the operating system for "mobile merchants — bazaar sellers, pop-up stores, and small entrepreneurs," which is wider than H1's current target. That breadth is a `04-scale` aspiration, not an MVP validation scope — H1 should stay explicitly limited to itinerant bazaar vendors matching Ana's profile (multi-SKU apparel/accessories, private bazares, Edomex/CDMX) for this validation round, to avoid diluting the sample with pop-up/other-vertical sellers whose frictions may differ. Recommend stating this boundary explicitly in the survey's screening questions (see Section 4.2, revised).
- **H1 — distinguish market-validation learning from product-validation threshold.** `backlog.md` #1 sets a *product* success bar (">=90% of sales registered, <3 sec per registration") for once the registration feature is live and in use. That is a measured-tool-performance metric, on a different question than anything in Section 6 (self-reported past incidence, gathered before the product exists). Flagging explicitly so a future readout doesn't compare them as if they were the same claim.
- **H2 — no change to the hypothesis; note the forced-choice option set (survey Q5) is exhaustive enough to interpret cleanly** (capital / space-transport / control / other, open-ended) — kept as-is, no sharpening needed here.
- **H3 — mechanism-neutral, following `business-decisions.md` Q8's resolution.** Q8 (resolved) established Customer Segmentation as a *core, mechanism-agnostic* capability — it resolves via NFC tag scan *or* a Sale-level Claim Token/QR, not an NFC-only feature. H3 as originally written didn't assume NFC, but it's worth stating explicitly now: segmentation-readiness signal should be sought from Buttons-mode-likely vendors too, not just vendors who'd naturally adopt NFC. This matters for who gets surveyed/interviewed under H3 — don't inadvertently skew toward NFC-inclined respondents when recruiting.
- **H4 — no change.** Stays a listening-only parking-lot item; `backlog.md` #3 hasn't moved.
- **H5 — no change to the hypothesis.** Its evidence-reading approach is addressed in Section 6's revision; see also Section 7 for the retained historical reasoning on why a directional read (not a fixed bar) is the right approach here in particular.

---

## 1c. Operating-model hypothesis — pricing structure (new, 2026-08-08; refined 2026-08-08, see H6a below)

**Context.** Raised in a Product Discovery thread (Product Owner + `architect` + `ux-designer`) investigating a "Day 0" merchant-onboarding gap: the domain model has no price field anywhere on Product/SaleItem — a real, confirmed gap. In discussing how to resolve it, the Product Owner proposed an operating-model hypothesis for how Ana likely prices what she sells, explicit that it is a hypothesis, not an observation, pending validation with Ana or other merchants. This section records that hypothesis with the same evidentiary discipline established in `company/jobs-to-be-done.md` (Validated Findings / Supported Evidence / Open Hypotheses) — **it does not recommend where price should live in the domain model**; that question is explicitly on hold pending this validation, per the Product Owner's own sequencing ("validate Ana's real operating model first, then derive the domain model from that").

**What's actually validated or supported today (existing record, not new evidence — restated here only to draw the line clearly against what follows):**
- Ana caps her own catalog size deliberately to preserve mental control over inventory/sales tracking. Sourced to `company/CLAUDE.md`'s Core Thesis ("She caps her own catalog size to keep mental control, which caps growth"). Single-sourced to the original Ana interview — per `jobs-to-be-done.md`'s own tiering of this exact claim (its Supported Evidence §2), this sits at **Supported Evidence**, not Validated Finding: a real, sourced behavioral adaptation, but not independently corroborated by a second source the way the sale-registration friction is (which has both the interview and an independent field observation, §1a above). Worth naming precisely rather than inflating it, since the new hypothesis below is being built on top of it.
- Her catalog is documented at roughly 10+ products, across named categories: pijamas, hoodies/maxys, calcetines. Same single source (`company/CLAUDE.md`) — a factual description of catalog composition, also Supported Evidence tier (single-sourced), not independently corroborated elsewhere in the repository.
- This document's own H2 ("Catalog self-capping is a control problem, not a capital problem," Section 1) is the *generalization* question built on the same base fact — whether this control motivation holds for vendors beyond Ana. H2 is itself still an open, untested hypothesis (see Sections 3 and 6), not a second source confirming Ana's own case.

**What is NOT validated — the new hypothesis, explicitly:**
Each selling group has a default price, and a merchant creates a new group only when pricing meaningfully diverges (e.g., "Pijamas" at a base $400, "Pijamas Disney" at $600 because it's priced differently) — rather than every distinct variant/SKU carrying its own independent price from the start. This is a **Product hypothesis, not a merchant-reported or observed fact.** Per the Product Owner's own framing: it was proposed because it appears to minimize operational effort while letting a merchant progressively add detail (a new group, a new price) only when the business actually needs it — a plausible, well-reasoned design instinct, not something Ana has said or been observed doing. It is recorded here specifically so it is never silently read as a finding later.

**Status update, 2026-08-08 (later same day):** the hypothesis above is refined — not overturned — by new field evidence. See **H6a**, at the end of this section, for the corrected shape, and Section 1d for a related, independently-logged fact. This paragraph, and the "Naming"/"Relationship to H2" paragraphs immediately below, are preserved verbatim per this document's non-deletion convention; none of them should be read on its own any longer as the current best characterization of H6 — read them together with H6a.

**Naming, for cross-reference:** referred to below as **H6 — Price-grouping / divergence hypothesis**, using the same H-numbering as H1-H5 for easy reference, but differing in kind from all five: H1-H5 test whether something already validated *for Ana* generalizes to a *broader market*. H6 has no validated starting point *even for Ana* — before any generalization question is meaningful, it first has to be checked against Ana's own actual behavior. Treat H6 as a single-subject discovery question first, a market-generalization question only after.

**Relationship to H2 — related, not the same question.** H2 asks *why* Ana caps the number of distinct products she carries (motivation: mental control vs. capital/space/transport). H6 asks *how* she structures pricing within whatever catalog she already has (mechanism: one default price per selling group with an override on divergence, versus every SKU/variant priced independently from the start, versus something else not yet imagined). A vendor could cap her catalog size for control reasons while still pricing every individual item distinctly; a vendor could carry a large catalog but group prices broadly. Answering H2 doesn't answer H6, and vice versa — both stay open, independently.

### H6a — Refined pricing mechanism: default price per group, plus an event-driven override axis (Supported Evidence, informal sourcing — 2026-08-08)

**Source and tier, stated precisely.** Product Owner, informal direct conversation with Ana (a natural conversation between friends, not a structured interview), 2026-08-08. The Product Owner asked an open question — is pricing a pain point for her, or does she keep a small set of fixed prices — and Ana's answer went beyond what was asked, volunteering detail unprompted. This is first-hand, direct, and real — stronger than a pure hypothesis — but it is a single, informal exchange, not independently corroborated by a second source, and explicitly **not** the structured H6 interview this document already has planned (Section 4.6, C2), which has not been conducted. **Tier: Supported Evidence** — the same tier this document already applies to the catalog-capping finding above — not Validated Finding, and this specific account should never be cited as satisfying Section 3's H6 interview recommendation.

**What Ana actually described:**
1. She intentionally varies her prices by bazaar/event, not only by selling group — named examples of venues where she charges differently: El Libanés, Parques Polanco, Centro Cívico.
2. Event cost is a real input to that variation: attending some events costs around $7,000; others around $2,500.
3. She sometimes pays someone else to operate her stand on weekdays, which adds to the effective cost of attending a given event beyond the venue/stand fee alone.
4. Despite all of that, her mental model stays simple: a small set of selling groups, each with a normal/default price, occasionally adjusted for a specific bazaar — not a per-customer or per-unit negotiation model, and not a full pricing engine.

**How this refines H6, precisely — not a confirmation, not a refutation.** H6 as originally framed (above) hypothesized one override axis: a new selling group gets created specifically when a variant's price diverges enough to warrant it (e.g., "Pijamas" at a base price, "Pijamas Disney" split out at a higher one). This observation confirms the "default price per selling group" half of that structure is real for Ana — no longer a pure, untested Product instinct — but it surfaces a **second, distinct override axis the original hypothesis didn't include**: the *same* selling group's price can also shift by bazaar/event, without creating a new group, apparently connected to what that event costs her to attend. H6's core shape (default price, occasional override) moves from Product hypothesis to Supported Evidence; its specific override *mechanism* was incomplete as originally written — override isn't only "create a new group for a divergent variant," it can also be "same group, adjusted price at a specific venue."

**What remains unvalidated, explicitly:**
- Whether the original variant-driven override (a new group for a meaningfully different product, e.g., a licensed-character line) is also real for Ana — this observation neither confirms nor denies that specific mechanism; it simply wasn't discussed in this conversation.
- Whether the event-driven price adjustment is a deliberate calculation (e.g., pricing higher specifically to recoup a $7,000 event's cost) or a looser instinct — the account establishes that the pattern exists and that cost is "a real input," not the reasoning behind it.
- Whether either mechanism generalizes to vendors beyond Ana — H6's eventual market-generalization layer is untouched by this single-subject observation, exactly as before.

**What this does not change.** This document still makes no recommendation about where price or price-override logic should live in the domain model — that stays on hold per the Product Owner's own sequencing, unaffected by this update. Section 3's H6 validation-channel recommendation (interview primary, community observation secondary) stands unchanged: this informal exchange sharpens what the eventual structured interview (Section 4.6, C2) should now specifically probe (the event-driven axis, and whether it's deliberate or instinctive) — it doesn't substitute for running it.

---

## 1d. Field observation — event cost as a business-decision input (2026-08-08)

**Source and tier.** Same conversation as H6a above: Product Owner, informal direct conversation with Ana, 2026-08-08 — first-hand, unprompted-in-content, but informal, single-sourced, not a structured interview. **Tier: Supported Evidence**, same standard applied throughout this section — real and sourced, not independently corroborated.

**The fact, stated on its own terms, independent of the pricing-structure question in H6a.** Ana treats event cost — a venue/stand fee plus a variable staffing cost (she sometimes pays someone else to operate her stand on weekdays) — as a real input to her business decisions. Evidenced concretely by the specific figures she volunteered (attending some events costs around $7,000, others around $2,500) and by the fact that this appears connected to her per-event price adjustments (H6a above) — though this observation only establishes that cost is *a real input*, not the specific decision rule she applies to it (e.g., whether she ever declines to attend a high-cost event, or only adjusts prices in response).

**Relationship to the existing record — strengthens, does not newly validate.** This is a new, concrete facet of a friction already on record, not a new claim from nothing:
- `company/CLAUDE.md`'s second validated friction: "Choosing which bazaar to attend, with no data on foot traffic/weather."
- This document's own H4 ("Bazaar-selection friction is real but out of scope right now," Section 1) — explicitly parked, listening-only, since `company/backlog.md` #3 is not started.
- `company/jobs-to-be-done.md`'s Friction tier 2 ("bazaar-selection... single-sourced to the original interview... deliberately lower-urgency... a planning decision made with time to deliberate, not a split-second cost").

Those prior sources describe the friction as foot-traffic/weather *uncertainty*. This observation adds a distinct, concrete facet that wasn't previously on record anywhere: a real, known **cost differential across venues** ($2,500 vs. $7,000, plus variable staffing) that a vendor has to weigh — a cost-side input to "which bazares are worth it," not only a demand-side (traffic/weather) one. Still single-sourced and informal; this does not upgrade H4 or Friction tier 2 to Validated, and does not change their status as parked/listening-only.

**Explicitly not a trigger to build anything.** Consistent with H4's own status and `company/backlog.md` #3 remaining not-started: this is recorded as evidence, not as a recommendation to prioritize bazaar-selection guidance. No action is implied here beyond keeping the record accurate.

**Cross-reference.** Also logged in `company/jobs-to-be-done.md`'s Friction tier 2 section, pointing back here, so a reader of either document finds the other.

---

## 2. Communities/channels to observe

Honesty check first: I do not have live web/social access in this pass, so I'm not asserting specific real group names, handles, or member counts as verified facts — that would risk inventing evidence, which Product Truth forbids. What follows is the *search pattern* to run and verify (first research task, no outreach involved), plus the channel types that are well-documented as where Mexican bazaar/tianguis sellers organize.

| Channel type | What to look for | Relevant to |
|---|---|---|
| Facebook Groups | Groups organized around bazares privados/venta de garage by municipio (e.g., naming patterns like "Bazar [Municipio], Edomex", "Emprendedoras [Ciudad]", "Vendedores bazar sobre ruedas") — these groups are typically where organizers post upcoming dates and vendors coordinate. Needs a verification pass (join requests, actual names) before any activity. | H1, H2, H4 |
| Facebook Marketplace / local buy-sell groups | Vendors cross-post inventory here; useful to see how they already describe their own catalog and what language they use for products/customers. | H1, H2 |
| Instagram | Hashtag patterns like #bazar, #bazarprivado, #ventadegaraje, #emprendedorasmx, #bazaronline + geo-tags for Edomex municipios. Vendor accounts often post "voy a estar en [bazaar name]" — good signal for how often they rotate locations (H4) and how they talk to regulars (H3, via Stories/highlights). | H1, H3, H4 |
| TikTok | Similar hashtag pattern (#bazar, #emprendedoramexicana) — vendors post "day in the life" / "setup" content, which tends to surface friction commentary (losing track of sales, cash handling) unprompted. | H1, H2 |
| WhatsApp | Not directly observable (private), but worth noting as the *actual* customer-relationship channel Ana and likely peers use — "community observation" here means noting what vendors say *about* WhatsApp groups/broadcast lists in public posts, not joining private lists. | H3 |
| Organizer pages/marketplaces | Bazaar-organizer Facebook Pages / Instagram accounts (the businesses that run recurring bazares) — they often list participating vendors or accept vendor applications publicly, which is a legitimate way to find real pilot candidates without contacting them yet. | H1, H4 (identifying pilot candidates) |

### 2.1 Verification pass — status (2026-08-02, updated 2026-08-04)

**2026-08-02 status (kept as written, for the record):** Not run. Same limitation as the first pass, stated again explicitly rather than silently repeating placeholder names as if they'd been checked: this session's tool access is Read/Write/Glob/Grep against the local repository only — no web browsing, no social-platform API, no search tool. I cannot confirm a single real Facebook Group name, Page, hashtag-activity count, or organizer account from here. Nothing in the table above should be treated as verified, and I have not added any new "specific-sounding" names since the first pass — doing so without a way to check them would be exactly the fabrication risk Product Truth exists to prevent.

What I *can* do without live access, and did in this pass: sharpen what "verified" should mean once access exists, so the eventual check is fast and unambiguous rather than open-ended:

| To confirm a channel candidate is real and usable | Evidence that would satisfy it |
|---|---|
| Group/Page actually exists and is active | Direct URL, visible post within the last 30 days, member/follower count |
| Matches H1's ICP, not a generic resale group | At least 3 posts referencing "bazar privado," "venta de garage," or a specific recurring private-bazaar event name (not open tianguis, not general marketplace resale) |
| Geographically in scope | Posts reference an Edomex or CDMX-metro municipio specifically |
| Organizer identifiable | A named Page or admin account distinct from the group itself (relevant for Section 2b's pilot-candidate criteria) |
| Public enough to observe passively | Group/Page content visible without joining, or joinable without a prior relationship — flag anything requiring approval/vetting as "requires Product Owner approval before joining," per Section 5 |

**2026-08-04 update — pass actually run:** a later session had live `WebSearch`/`WebFetch` access and applied this exact table against real search results. Result: 8 real, URL-verified channels found (5 Edomex bazaar-organizer Facebook Pages/Groups, 3 CDMX-adjacent Instagram/directory accounts), plus an honest account of what couldn't be verified (Facebook blocks unauthenticated `WebFetch` beyond a page's title/name — so "exists, named, located as described" is confirmed for each, but deep activity/privacy details mostly aren't) and what came up empty (a directly-browsable `#bazaredomex` hashtag page, TikTok-specific Edomex vendor activity). None of the 8 is an individual merchant — per this pass's own scope, individual vendors aren't discoverable this way, only the channels through which they might be reached. **Full table, per-channel scoring, and the ICP-fit caveats (these organizer channels host mixed "emprendedores" — not exclusively the private household-bazaar apparel niche H1 targets) live in `company/usability-testing-plan.md` §7.3.2-7.3.4** — not duplicated here to avoid the two documents drifting out of sync. This does not change H1-H5 in any way; it's a channel-discovery result, not new evidence about the hypotheses themselves (Section 2a below, the actual *content*-observation task, is still separately not run).

### 2a. Passive observation — status (2026-08-02, still not run as of 2026-08-04; attempted and found structurally blocked, 2026-08-07)

**2026-08-04 status (kept as written):** Not run. That pass (Section 2.1 above) confirmed *that channels exist* — it did not read or log unprompted content from within them.

**2026-08-07 update — attempted for real, came back empty, and the emptiness is itself the finding.** A dedicated pass ran live `WebSearch`/`WebFetch` against all 8 verified channels (§2.1) plus ~15 targeted searches for organic H1/H3 phrasing. Result: **zero verifiable, verbatim quotes logged** — not because none were sought hard enough, but because of two compounding, structural constraints: (1) Facebook/TikTok return unauthenticated `WebFetch` requests only a title/name shell, never actual post/comment bodies; (2) `WebSearch` over this space surfaces SEO content written *to* vendors (blog posts, guides) far more readily than it surfaces content written *by* them — individual merchant posts are largely unindexed or index as bare titles with no quotable text. The two channels that *are* readable (`@sobreruedas.bazar`, `@bazares_mexico`) are organizer/curator accounts with event-listing content only, not vendor-voice content, so being readable didn't help. Per this document's own Product Truth discipline, no fragment was logged as a "quote" unless independently traced to a real, checkable public post — none met that bar, so the observation log stays empty rather than padded.

**Consequence, flagged rather than resolved unilaterally:** §3's own recommendation ("community observation first, cheapest way to answer H1's breadth question") assumed this channel was low-cost to execute. As of today, with only unauthenticated web tools available, it isn't executable at all for *content* (as distinct from channel-*existence*, which did work 2026-08-04). This doesn't change H1/H3 themselves. It's a genuine open question for the Product Owner: wait for eventual authenticated/logged-in access, treat this channel as effectively closed for now, or move directly to the survey/interview channels §3 already scoped for H1/H3, since community observation currently can't deliver on its own.

---

## 2b. Candidate identification — criteria framework (no candidates named yet)

Per the Product Owner's approval, this builds identification *criteria*, not a contact list — no merchant or organizer has been identified through verified research yet, and nothing here authorizes contact.

**Primary criteria (must match H1's ICP):**
1. Sells apparel/accessories/general multi-SKU merchandise (roughly 10+ products) — not a single-product line or strictly made-to-order/commissioned goods (different friction profile: no repeat-catalog tracking problem).
2. Participates specifically in private/invite-based bazares (bazares privados, ventas de garage, bazares en casa/salón) — not exclusively open street tianguis, which have different foot-traffic and registration dynamics closer to H4's territory.
3. Operates in Estado de México / CDMX metro — keeps the pilot consistent with Ana's validated context (logistics, language register, local bazaar culture).
4. Visibly itinerant — public posts referencing participation in multiple distinct bazaar dates/venues over time, not a single fixed stall or permanent storefront.

**Signal-of-fit criteria (strengthen a candidate, not required):**
5. A public post or comment expressing a tracking/inventory-control frustration in their own words — the strongest form of evidence available through community observation, since it's unprompted.
6. Active, recent posting activity (improves reachability once/if outreach is ever approved).
7. A public contact channel exists (business Instagram/Facebook Page with open DMs, listed WhatsApp Business number) — a precondition for any future approved outreach, not itself a reason to reach out now.
8. No visible existing use of a competing sales-tracking or inventory tool.

**Disqualifying criteria:**
- Made-to-order/commissioned-only goods (no standing catalog to track).
- Fixed physical storefront only, no itinerant/bazaar component.
- Outside Edomex/CDMX metro (adds pilot logistics risk without adding validation value at this stage).

**Where to look (source types — partially verified as of 2026-08-04, see Section 2.1's update and `company/usability-testing-plan.md` §7.3.2 for the real channels found):**
- Public bazaar-organizer Facebook Pages/Instagram accounts, which often tag or list participating vendors.
- Vendor accounts that geo-tag or hashtag private-bazaar events in Edomex/CDMX municipios.
- Public comment threads under organizer posts, where vendors coordinate and sometimes surface pain points organically.

This is a scoring rubric to apply once real accounts are found, not a target list. Zero specific *individual merchants* are named in this document (real organizer/community *channels* now are, as of 2026-08-04 — see Section 2.1's update).

---

## 3. Proposed validation activities

For each hypothesis: channels considered, channel(s) recommended, and why.

**H1 — Registration-friction generalization**
- *Considered:* interviews, survey, community observation, landing page.
- *Recommended: community observation first, then a short survey, interviews last.* This is a breadth/prevalence question ("how common is this among vendors like Ana, not just Ana?") — cheapest to answer first by reading what vendors already say unprompted in bazaar groups (no outreach needed), then quantify with a short survey (5-7 questions, forced-choice "top problems in my business" list) distributed where H1's target hangs out. Interviews come last, reserved for the 5-8 respondents whose answers signal a strong match — depth after breadth, not instead of it.

**H2 — Catalog self-capping motivation**
- *Considered:* survey, interviews.
- *Recommended: interviews, with a forced-choice survey question feeding the shortlist.* This is a "why" question (mental control vs. capital/space/transport) that a checkbox survey answers shallowly at best. Use the H1 survey's forced-choice question as a cheap first filter, then a real conversation with 6-8 respondents to get the actual reasoning.

**H3 — Segmentation readiness**
- *Considered:* interviews, community observation, landing page/fake-door.
- *Recommended: fake-door landing page + community observation, interviews only for signups.* This is fundamentally a demand-breadth question ("do enough vendors want this badly enough to act") — a landing page measuring signup/interest rate against real traffic is a more honest signal than asking people directly if they'd want a feature (stated preference vs. revealed interest). Pair with community observation for organic "quiero saber quién me compra seguido"-type posts, which cost nothing to check and either corroborate or undercut the landing-page signal.

**H4 — Bazaar-selection friction (parking lot)**
- *Considered:* interviews, survey, community observation.
- *Recommended: community observation only, no active outreach.* Backlog #3 is explicitly not-started and not to be built yet. Running interviews or a survey on this now would front-run product sequencing and set an expectation we can't act on. Passive listening keeps the option informed for later without spending validation budget or making any promise to a merchant.

**H5 — Pricing model generalization**
- *Considered:* paid-ad pricing test, landing page A/B, survey, community observation.
- *Recommended: a forced-tradeoff survey question now; a paid-ad/landing-page pricing test deferred.* A real pricing experiment (e.g., two landing pages with different framings, driving small paid traffic) needs a live surface to point traffic at, which we don't have yet, and Q11 (billing-cycle model) is still an open Business Decision — testing a specific price point now would be testing a number we can't yet commit to. A simple tradeoff question ("¿preferirías pagar X al mes por esto, o un % de cada venta?") folded into the same survey as H1/H2 gets the directional read cheaply; the paid-ad pricing test becomes worth running once a real landing page/demo exists to send traffic to.

**H6 — Price-grouping / divergence hypothesis (new, 2026-08-08 — see Section 1c; refined 2026-08-08, see Section 1c's H6a)**
- *Considered:* interviews, survey, community observation, direct outreach/fake-door.
- *Recommended: interview (primary), community observation (cheap secondary check) — no survey, no landing page.* This is a nuanced "how do you actually think about it" mechanism question, not a breadth/prevalence or demand question — the same shape as H2's own reasoning above ("a checkbox survey answers shallowly at best"), and arguably more so here: a forced-choice question about pricing structure risks *suggesting* the very mechanic being tested (asking "do you set a default price per group and override it?" primes the answer it's trying to discover). A real conversation, walking through her actual product list with concrete examples, is the only way to surface her actual mental model without leading her to it. Community observation is worth a low-cost pass alongside it — if a vendor's public post or Story ever shows a visible price list with named variants at different prices (e.g., "Pijamas $400 / Pijamas Disney $600"), that's a real, unprompted data point costing nothing to log — but it folds into the already-standing Section 2a observation effort rather than justifying a new dedicated pass, and Section 2a's own 2026-08-07 finding (structurally blocked, zero verifiable quotes so far) means it shouldn't be counted on as the primary channel. No landing page or fake-door: this isn't a demand-interest question. No pricing-experiment/paid-ad test: this isn't a willingness-to-pay question — it's about how she structures her own product/price list today, unrelated to what Nahui would eventually charge her (H5's territory, kept fully separate).
- **Update, 2026-08-08 (later same day):** an informal, unprompted field observation (Section 1c's new H6a) has already surfaced real signal on this question — Supported Evidence, not a substitute for the structured interview recommended above. The eventual interview (Section 4.6, C2) should now specifically probe the event-driven override axis H6a surfaced (deliberate cost-recovery calculation vs. instinct; whether it applies to every bazaar or only specific ones) rather than starting from a blank slate. This doesn't change the channel recommendation itself — interview stays primary, community observation stays the cheap secondary check.

---

## 4. Outreach copy — DRAFT ONLY, NOT APPROVED, NOTHING GOES OUT UNTIL PRODUCT OWNER SIGN-OFF

All copy below is a working draft for the activities recommended in Section 3. Written in natural Mexican Spanish for merchant-facing pieces, per `global-principles.md`. None of it has been posted, sent, or shown to anyone outside this repo.

### 4.1 Recruitment post for bazaar Facebook Groups/Pages (drives to survey)

> ¡Hola! Somos Nahui, estamos platicando con vendedoras y vendedores de bazar para entender mejor cómo llevan el control de sus ventas y sus clientes. Si vendes en bazares (ropa, accesorios, lo que sea) nos ayudarías muchísimo respondiendo unas preguntas rápidas — no toma más de 3 minutos y no vendemos nada, solo estamos investigando. [liga a la encuesta]
> ¡Gracias! 💛

### 4.2 Short survey (H1/H2/H5 combined — revised 2026-08-02)

Revisions from v1: added a screening block up front (per H1's refined scope boundary, Section 1) so responses can be read against the actual ICP, and a one-line consent/data-use note consistent with brand tone (honest, respectful, no fine-print surprise).

**Antes de empezar:**
> Estas preguntas son para vendedoras y vendedores de bazar — nos ayudan a entender mejor tu negocio, no vendemos nada ni compartimos tus respuestas con nadie fuera de Nahui.

**Preguntas de perfil (para saber si aplicas):**
0a. ¿Vendes en bazares privados, tianguis, o ambos? (privados / tianguis / ambos) — *screening: private-bazaar respondents are H1's core ICP; tianguis-only respondents are logged separately, as a useful comparison point rather than counted as the same population.*
0b. ¿En qué zona vendes principalmente? (abierta, o lista de municipios Edomex/CDMX)

**Preguntas principales:**
1. ¿Qué vendes y en qué tipo de bazares participas? (privados, tianguis, ambos)
2. ¿Cuántos productos distintos manejas más o menos?
3. De esta lista, ¿cuáles son tus 2 mayores dolores de cabeza al vender? (opciones: llevar el control de las ventas, saber qué se vendió y qué no, cargar/organizar mercancía, cobrar, elegir en qué bazar meterte, otro — especifica)
4. ¿Alguna vez se te ha "perdido" el registro de una venta (se te olvidó anotarla, se te fue el cliente y no alcanzaste a apuntar)? (sí/no/no aplica)
5. ¿Por qué no vendes más productos de los que ya manejas? (opción abierta + opciones guía: no tengo capital, no tengo espacio/transporte, se me complica llevar el control, otro)
6. Si tuvieras una forma de saber quién de tus clientes te compra seguido (aunque sea poquito) contra quién te compra mucho pero rara vez, ¿te serviría? (sí/no/no sé)
7. Si una app te ayudara con todo esto, ¿preferirías pagar una cuota fija (por ejemplo mensual o por temporada) o un porcentaje de cada venta? (cuota fija / porcentaje / ninguna de las dos / depende del precio — especifica)

*Note on Q7: a "depende del precio" option is included because a bare fixed/percentage/neither forced choice hides a real, likely-common answer ("depends how much") that a strict three-option version would force into "ninguna de las dos" or a guess. Section 6 reads this as its own signal, not as noise to be reclassified into one of the other three.*

### 4.3 Interview invitation DM (for H1/H2 follow-up, sent only to survey respondents who opted in)

> Hola [nombre], vimos que respondiste nuestra encuesta sobre bazares — ¡gracias! Nos encantaría platicar contigo unos 15-20 minutos para entender mejor tu experiencia vendiendo. No es una venta, es puro aprender de ti. ¿Tendrías chance esta semana? Te regalamos [incentivo por definir] por tu tiempo.

### 4.4 Fake-door landing page copy (H3 — customer segmentation interest)

> **Conoce a tus clientes de verdad**
> Sabemos que muchos te siguen en bazar tras bazar. Pero, ¿sabes quién te compra seguido aunque sea poquito, y quién te compra mucho pero solo de vez en cuando?
> Estamos preparando una forma sencilla de que lo sepas — sin que tengas que anotar nada de más.
> [Anótate para ser de las primeras en probarlo] — campo: nombre, WhatsApp
>
> *Nota interna: this describes a Planned capability, framed honestly as "estamos preparando" (in progress), not "ya está disponible" — consistent with Product Truth. No specific launch date implied.*

### 4.5 Pilot-merchant outreach script (for direct contact once specific candidates are identified and approved — placeholder, no candidate identified yet)

> Hola [nombre], soy [nombre] de Nahui. Vimos que vendes en [bazar/zona] y nos encantaría platicar contigo — estamos construyendo una herramienta para ayudar a vendedoras de bazar a llevar el control de sus ventas sin que les quite tiempo con el cliente. Nos interesa mucho tu experiencia. ¿Te late que platiquemos unos minutos?

### 4.6 Interview guide (H1/H2, and H3 follow-up when a segmentation signup opts in) — new, 2026-08-02; extended 2026-08-08 with H6's pricing-structure probe (C2)

*Internal use only — not merchant-facing copy, but written so the actual spoken language stays natural Mexican Spanish, not a translated script. 15-20 minutes (now ~18-23 minutes with C2 added). Same warm/direct/respectful tone as the rest of the brand — this is a conversation between equals, not an audit of how she runs her business.*

**Antes de empezar (internal checklist for whoever conducts it):**
- Confirm she matches H1's screening criteria (private bazares, multi-SKU, Edomex/CDMX) from her survey answers before scheduling.
- Recording/notes only with her explicit okay, stated at the start.
- Remind her it's not a sales pitch — no product exists to sell yet.

**Apertura (2 min):**
> Gracias por tu tiempo. Esto es nomás para entender cómo es tu día a día vendiendo — no hay respuestas buenas o malas, y no te estamos vendiendo nada. ¿Te parece si grabo la plática nada más para no perderme nada? [esperar confirmación]

**A — Contexto del negocio (3-4 min)**
1. Cuéntame de tu negocio — ¿qué vendes, hace cuánto, en qué tipo de bazares te metes?
2. ¿Más o menos cuántos bazares haces al mes?

**B — Registro y control de ventas (6-8 min, core of H1/H2)**
3. Camina conmigo por lo que pasa cuando haces una venta — desde que el cliente se acerca hasta que se va. ¿Qué usas para anotar o llevar el control? (cuaderno, memoria, celular, nada)
4. ¿Te ha pasado que se te "perdió" el registro de una venta — se te olvidó anotarla, llegó otro cliente y no alcanzaste? Cuéntame de la última vez que pasó. *(probe for a specific, real instance, not a general "sí, a veces")*
5. ¿Cómo te sientes al final de un bazar respecto a saber exactamente qué vendiste y qué te queda? *(open, listen for confidence vs. guesswork language)*

**C — Por qué el catálogo tiene el tamaño que tiene (4-5 min, core of H2)**
6. ¿Cómo decides cuántos productos distintos manejar? ¿Alguna vez has pensado en meter más variedad y no lo has hecho — qué te detiene?
7. *(only if not already answered)* Si pudieras llevar el control perfecto de tu inventario sin esfuerzo extra, ¿meterías más productos?

**C2 — Cómo decides los precios (2-3 min, core of H6 — new, 2026-08-08)**

*Internal note: ask in this order, open-ended, without ever describing the "default price per group, override on divergence" pattern first — the goal is to hear whether it emerges in her own words, not to confirm it once suggested to her.*

*(2026-08-08 addendum, informal-observation-informed): an informal field observation already surfaced a second, event-driven override axis — see Section 1c's H6a. Once this interview actually runs, probe that axis specifically too (e.g., "¿el precio te cambia según en qué bazar estés? ¿de qué depende?") in addition to Q9's variant-divergence question below, and listen for whether the adjustment is a deliberate cost-recovery calculation or a looser instinct — still without leading with the "Pijamas / Pijamas Disney" framing or naming the specific venues/figures already on record, so her answer stays her own.*

8. Cuéntame cómo decides cuánto cobrar por cada producto. Por ejemplo, si tienes varias pijamas distintas, ¿todas cuestan lo mismo o cambia según cuál sea?
9. ¿Alguna vez has tenido un producto muy parecido a otro que ya vendes, pero le pusiste un precio diferente? Cuéntame de esa vez — ¿qué fue lo que hizo que le cambiaras el precio? *(probe: a licensed character, a different supplier, better fabric — and whether it became, in her own mental model, a different product/category, or "lo mismo pero más caro")*
10. *(only if not already answered)* Cuando metes algo nuevo, ¿normalmente ya sabes cuánto le vas a poner porque es parecido a algo que ya tienes, o cada cosa nueva la piensas desde cero?

**D — Clientes y relación (3-4 min, H3 signal — ask everyone, not only landing-page signups)**
11. ¿Reconoces a tus clientas/clientes que te compran seguido? ¿Cómo — te acuerdas, los sigues en redes, tienes un grupo de WhatsApp?
12. ¿Alguna vez has querido saber quién te compra mucho aunque sea de vez en cuando, contra quién te compra poquito pero siempre? ¿Para qué te serviría saberlo?

**Cierre (2 min):**
> Esto nos ayuda muchísimo, de verdad. [incentivo por definir, si aplica]. Si en algún momento tenemos algo que probar, ¿te gustaría ser de las primeras en verlo? *(this is the H3 opt-in bridge — captures interest without promising a launch date)*

**Post-interview (internal, not spoken):** log verbatim quotes for Q4 (lost-sale incident), Q6 (catalog-size reasoning), and Q9 (price-divergence example) specifically — these are the answers Section 6's H1/H2/H6 evidence-expected notes key off of.

---

## 5. What requires Product Owner approval

**Can start now, no approval needed** (research/preparation, no external-facing action):
- Verifying real Facebook Group/Page names, hashtag activity, and organizer accounts (Section 2's "immediate next step") — partially done 2026-08-04, see Section 2.1's update and `company/usability-testing-plan.md` §7.3.2.
- Reading public posts/content in already-public groups or hashtags (passive observation, no joining required) — still not run, see Section 2a.
- Refining ICP hypotheses and pilot-merchant criteria based on what that observation surfaces — done this pass, see Section 1's Refinements and Section 2b.
- Drafting/iterating survey instruments, interview guides, and landing page copy — done 2026-08-02, see Section 4.2 (revised) and 4.6 (new); extended 2026-08-08 to add H6's pricing-structure probe (Section 4.6, C2) and Section 1c's hypothesis record.
- Identifying candidate bazaar organizers or merchants from public information (building a list), without contacting anyone — criteria framework built this pass (Section 2b); real organizer/community channels found 2026-08-04 (Section 2.1's update), no individual merchants named, since none have been identified through verified research (and, per that pass's own scope, individual vendors aren't discoverable this way to begin with).

**Requires explicit Product Owner approval before it happens:**
- Joining any private/closed Facebook Group or WhatsApp community as an observer
- Posting the recruitment post (4.1) anywhere
- Publishing the fake-door landing page (4.4) live, or driving any traffic to it
- Sending the interview invitation DM (4.3) or the pilot-merchant outreach script (4.5) to any real person
- Running the survey (4.2) live on any real channel
- Any paid-ad experiment (H5's deferred pricing test)
- Contacting any specific pilot-merchant candidate once identified
- Posting into, joining, or messaging any of the specific channels found 2026-08-04 (`company/usability-testing-plan.md` §7.3.2) — finding the channel is research; using it is outreach
- Actually conducting the interview guide (4.6, including new C2) with Ana or any other merchant — the guide is prepared, not scheduled or run

Nothing in Section 4 goes out without a green light. This pass stayed strictly within the approved list above — no posting, no outreach, no live survey/landing page. This approval gate is unaffected by the Section 6 revision below — that revision changes how evidence gets read once collected, not what's authorized to run.

---

## 6. Learning objectives and expected evidence (revised 2026-08-02, per Product Owner direction; H6 added 2026-08-08)

**Framing change from v1.** The original version of this section stated hard go/no-go percentage thresholds for each hypothesis (e.g., "validated if ≥60%..."). The Product Owner reviewed the threshold accounting this produced (Section 7) and gave a direct correction: at this stage the objective is learning, not statistical proof, and these thresholds should be read as directional hypotheses, not decision gates. This section is revised accordingly. For each hypothesis below: a **learning objective** (the question this activity should actually answer) and **evidence expected** (the qualitative and quantitative signals to collect and watch for — direction and strength of pattern, not a pass/fail bar). Quantitative acceptance criteria come back into this document before the pilot phase, once there's a broader market understanding and a real acquisition channel (see Section 7 for the disposition of the earlier threshold work). **Section 3's channel/activity recommendations are unchanged** — this is a reframing of what "success" means, not a redesign of how evidence gets collected.

**H1 — Registration-friction generalization**
- *Learning objective:* Do vendors like Ana, beyond Ana herself, actually experience "losing track of a sale" as a real, recurring, specifically-describable friction — or is this a plausible-sounding problem we've pattern-matched onto them from a single data point?
- *Evidence expected:*
  - Qualitative: how often and how specifically vendors describe losing track of a sale, in their own words — a remembered, concrete incident versus a vague "sí, a veces"; whether this shows up unprompted in community observation (a post or comment volunteering the problem) *before* it's ever asked about directly in a survey or interview, which is a stronger signal than an answer to a direct question; the vocabulary vendors actually use for the problem (useful input for future product copy, independent of validation); whether the tone is "molesto pero normal" or genuinely costly ("se me fue una venta buena").
  - Quantitative, read as signal strength and direction, not a bar: the rough share of survey respondents reporting a lost-sale-record incident (Q4) and how sales-tracking ranks among stated top-2 problems (Q3); whether the pattern differs between the private-bazar screening group and the tianguis-only comparison group logged separately; whether interview answers (deeper, smaller n) corroborate or complicate what the survey suggested.
  - What would weaken the hypothesis: vendors describing sales-tracking as a solved non-issue ("uso una libreta y me funciona bien"), or consistently ranking it below other frictions like cobrar, cargar mercancía, or elegir bazar.

**H2 — Catalog self-capping is a control problem**
- *Learning objective:* When a vendor caps her catalog size, is mental control over tracking/inventory the real reason, or is it capital/space/transport — and how do vendors explain that tradeoff in their own words when walked through it?
- *Evidence expected:*
  - Qualitative: the actual reasoning given in interviews to "¿qué te detiene de meter más productos?" — listening for control/tracking language ("se me revuelve," "pierdo la cuenta," "ya no sé qué me queda") versus capital/space/transport language ("no tengo para comprar más," "no me cabe en el coche"); whether vendors who lead with capital/space also mention tracking difficulty as a secondary factor once they keep talking — still useful signal even when it isn't the primary reason given.
  - Quantitative, directional: the rough split between the two families of reasons in the survey's forced-choice Q5 among the interview shortlist, cross-checked against what the same person actually says in the open conversation — watch for divergence between the checkbox answer and the spoken reasoning, which is itself informative.
  - What would weaken the hypothesis: a consistent, confident attribution to capital/space/transport with no secondary mention of tracking difficulty anywhere in the conversation.

**H3 — Segmentation readiness follows registration**
- *Learning objective:* Is there real, unprompted demand for customer segmentation among vendors already dealing with registration — or does it only sound appealing when asked about directly, without anyone likely to act on it?
- *Evidence expected:*
  - Qualitative: organic posts or comments where vendors describe wanting to tell apart a loyal-but-small buyer from an occasional-but-big one, unprompted; whether interview respondents raise this spontaneously in the "clientes y relación" section (Q11) before being prompted, versus only endorsing it once suggested (Q12); the specific use a vendor imagines for the information (e.g., rewarding a regular) versus general curiosity with no follow-through intent.
  - Quantitative, read relative to expectations rather than against a numeric target: landing-page signup rate given real, warm traffic, read as "stronger/weaker interest than we'd guess," not compared to a fixed conversion percentage; how many interview respondents opt in to "ser de las primeras en probarlo."
  - What would weaken the hypothesis: landing-page visits with negligible signups, no organic mentions turned up by observation, and interview respondents needing heavy prompting before expressing any interest.

**H4 — Bazaar-selection friction (parking lot)**
- *Learning objective:* What, if anything, are vendors already saying unprompted about the cost of picking a bad bazaar date or location — is this a live pain point worth tracking toward a future prioritization call, or mostly quiet?
- *Evidence expected:* Qualitative only — a running log of organic mentions of bazaar-selection regret or foot-traffic guesswork, noting frequency, specificity, and emotional weight (annoyance vs. real financial regret). No quantitative target and no go/no-go read attached to this hypothesis right now; it stays listening-only, consistent with `backlog.md` #3 remaining not-started, and feeds a future prioritization conversation rather than a near-term decision.

**H5 — Pricing model generalization**
- *Learning objective:* Do vendors beyond Ana share a directional preference for flat/recurring pricing over a per-transaction commission, and how strongly and consistently is that preference held once nuance ("depende del precio") is allowed to surface rather than forced into a clean binary?
- *Evidence expected:*
  - Qualitative: how vendors explain their pricing preference when it comes up in conversation, especially the reasoning behind "depende del precio" answers (what price point would tip the decision, what specifically triggers resistance to a percentage model); any spontaneous commentary framing a per-sale commission as unfair or as "me quitan de lo que ya gané."
  - Quantitative, directional: the rough distribution across cuota fija / porcentaje / depende del precio / ninguna in survey Q7, read as a directional lean rather than a majority bar; whether "depende del precio" is common enough on its own to be a signal worth investigating further before `business-decisions.md` Q11 (billing-cycle model) is resolved.
  - What would weaken the hypothesis: a clear, confident preference for percentage-based pricing, or strong resistance to any recurring payment regardless of how it's framed.

**H6 — Price-grouping / divergence hypothesis (new, 2026-08-08 — see Section 1c; refined 2026-08-08, see Section 1c's H6a)**
- *Learning objective:* Does Ana (first) and vendors like her (once generalization is even reachable) actually think about pricing the way this hypothesis describes — a default price per selling group, overridden only when a variant's price meaningfully diverges — or does she price every item independently from the start, or some third pattern not yet considered?
- *Evidence expected:*
  - Qualitative: how she describes deciding a new item's price in her own words — whether she reaches for "es lo mismo que ya tengo" (defaulting to an existing group's price) as the natural starting point, versus treating every new item as needing its own price decision regardless of similarity to what she already sells; whether a real, remembered example of a price divergence exists at all (a specific item she priced differently from something similar), and what triggered it (a licensed character, a better fabric, a different supplier cost) — a concrete instance is much stronger evidence than a hypothetical "sí, supongo que sí" answer to a leading question.
  - What would weaken the hypothesis: she describes pricing every item individually regardless of similarity to others, with no sense of a "base group price" at all; or she describes a completely different organizing logic (e.g., pricing by supplier cost plus a fixed margin per item, unrelated to grouping by product type).
  - What would strengthen it: an unprompted, concrete example matching the pattern, given before she's shown anything resembling the "Pijamas / Pijamas Disney" framing — the closer her own example arrives unprompted, the stronger the signal.
  - *Explicitly out of scope for this evidence-gathering pass:* any recommendation about where a price field or grouping concept should live in the domain model. That is a downstream architecture/product question, to be taken up by `architect`/Product Owner only once this hypothesis has real evidence behind it — not decided or implied here.
  - **Update, 2026-08-08 (later same day):** an informal field observation (Section 1c's H6a) has already delivered exactly the kind of "unprompted, concrete example" this entry describes as the strongest possible signal — with the important caveat that it came from an informal conversation, not the structured interview this evidence-gathering plan describes. It's real Supported Evidence, tiered and cited precisely in Section 1c; it should inform, not replace, the structured interview run.

---

## 7. Threshold rationale (Product Owner request, 2026-08-02) — retained as dated historical record, no longer the operative framing

**Status note added 2026-08-02 (later same day):** this section was written in response to the Product Owner's request to explain the reasoning behind Section 6's original numeric thresholds. The Product Owner subsequently reviewed it and gave a direct correction (see the update note at the top of this document and the new Section 6 above): thresholds should be read as directional hypotheses, not decision gates, at this stage. **Section 7 is retired as the operative success framework** — it no longer describes what "validated"/"invalidated" mean in this package; Section 6 does. It's kept below, unedited, as a dated historical record for two reasons: (1) it documents reasoning (margin-of-error math, sample-size logic, the self-selection-bias argument) that stays genuinely useful input for the pre-pilot pass where quantitative acceptance criteria do get defined, so it's cheaper to keep than to redo later; (2) it's an honest paper trail of how thinking on this evolved, consistent with not silently rewriting a decision that was already reasoned through and shared. Nothing below should be read as active guidance for how to interpret evidence collected under Section 6 today.

The Product Owner asked directly whether Section 6's numbers are evidence-based or initial hypotheses, and to explain the reasoning either way. Honest answer up front: **none of Section 6's specific numbers are drawn from a named external benchmark I can cite with confidence.** They were reasonable-sounding working defaults set when the package was first drafted, not derived from a study, a prior Nahui data point (we have exactly one merchant, Ana, and her data isn't a statistical sample), or a formal power calculation. Below is what reasoning does sit behind each, stated plainly rather than dressed up after the fact, plus whether I'd revise it now.

### H1 — 60% validated / 30% invalidated threshold; 25-40 respondent sample size

1. **Benchmark or hypothesis?** Working hypothesis. No industry-standard figure exists (or is known to me) for "% of itinerant vendors who've lost a sale record" — this isn't a metric with an established external baseline.
2. **Reasoning behind the specific numbers:**
   - 60% (not 50%) was chosen to require a *clear* majority, not a bare one, specifically because a small, informally-recruited survey carries real self-selection bias — vendors who bother to answer a survey about sales-tracking pain may already be more likely to relate to that pain. A 50%+1 bar risked confirming the hypothesis on noise plus mild selection bias; 60% builds in a margin against that.
   - 30% (not 40% or 50%) as the invalidation floor was chosen to leave a deliberate gray zone (30-60%) rather than a single cutoff — a single-point threshold treats survey noise as false precision. The 30-60% band is meant to be read as "inconclusive, needs more data or interview follow-up," not a silent pass.
   - 25-40 respondents is a **convenience estimate**, not a power calculation: roughly what an organic post in a couple of bazaar Facebook groups could plausibly reach without paid promotion, large enough to feel like more than anecdote, small enough to be achievable without a recruitment campaign (which isn't approved anyway).
3. **Would I revise it now?** The gray-zone design is sound and I'd keep it conceptually. But I'd add an explicit caveat that isn't currently in the doc: at n=25-40, a reported proportion has a roughly ±16-18 percentage-point margin of error at conventional 95% confidence (e.g., an observed 55% could plausibly reflect a true rate anywhere from ~37% to ~73%). That means the 30-60% "gray zone" isn't just a design choice — it's close to the actual noise floor of a sample this size, so a result landing just outside it (say, 62% or 28%) shouldn't be read as decisively clearing or missing the bar. **Proposed revision (not applied): widen the target sample to 40-60 respondents if the approved channels can reasonably reach that many, and explicitly label the 25-40 range as a floor for "directional signal," not a threshold for "statistical confidence."**

### H2 — 5+ of 6-8 interview majority

1. **Benchmark or hypothesis?** Working hypothesis, loosely influenced by common qualitative-research practice (a rough, informally-cited convention that a handful of open-ended interviews with a fairly homogeneous population tends to surface most recurring themes) — I want to be careful not to overstate this as a specific named study, since I can't verify a citation without live access, and the closest well-known heuristic I'm aware of (Nielsen Norman Group's "5 users surface most usability problems") is about usability testing, not open-ended qualitative interviewing, so it's adjacent inspiration, not a directly applicable benchmark.
2. **Reasoning behind the specific numbers:** 6-8 interviews is small enough to run without a recruitment campaign, large enough that one or two outlier answers don't flip the read. 5-of-6-8 (62.5%-83%) was chosen to require a real majority given how easily a 4-of-7 split (57%) could occur by chance with such a small n.
3. **Would I revise it now?** I'd keep the range, but I'd make explicit that this is a qualitative-saturation heuristic, not a statistical threshold, and recommend reading a near-miss (e.g., 4 of 7) holistically rather than as a clean fail — if the minority group's stated reasoning is substantively different (e.g., genuinely capital-constrained, not just an outlier), that's still useful signal for the pricing/positioning conversation even if it doesn't clear the numeric bar. No change to the number itself proposed.

### H3 — 15%/5% landing-page conversion; 100-visit minimum

1. **Benchmark or hypothesis?** Partially informed by general marketing background knowledge, not a specific citation I can verify without live access — I'm aware, from general training-data knowledge rather than a lookup I can confirm right now, that commonly-discussed landing-page conversion figures are quite low for cold/paid traffic (roughly low single digits to ~5%) and meaningfully higher for warm, highly-targeted, organic traffic (rough double digits, sometimes 15-25%+). I don't have a specific named source I can cite with confidence in this session, and I want to flag that distinction clearly rather than presenting it as a verified benchmark.
2. **Reasoning behind the specific numbers:** 15% was set near the upper-middle of what seemed plausible *for warm traffic specifically* — the plan routes the landing page to the same bazaar-community channels as the survey, i.e., people already primed by an organic post, not cold ad traffic — while still being a real bar, not a token one. 5% was set roughly at typical cold-traffic-level performance, on the logic that if even warm, targeted traffic doesn't clear what cold traffic often achieves elsewhere, that's a real negative signal. 100 visits was set as a practical floor below which a percentage is mostly noise (3 of 20 "looks like" 15% but means nothing) — it was not derived from a formal sample-size calculation for proportions.
3. **Would I revise it now?** Yes, on the visit minimum specifically. Distinguishing a true 5% rate from a true 15% rate reliably needs meaningfully more than 100 visits — at n=100, a single observed rate anywhere in the 8-13% range would have a confidence interval overlapping both the 15% and 5% thresholds, making the result genuinely ambiguous rather than a clean read. **Proposed revision (not applied): raise the stated minimum to 150-200 visits for a decision-grade read, while keeping 100 as an explicit "too early to interpret at all" floor rather than a sufficiency bar.** I'd leave 15%/5% themselves as directional targets rather than precise, benchmark-derived numbers, and say so in the doc.

### H5 — 50% preferring cuota fija over porcentaje

1. **Benchmark or hypothesis?** Working hypothesis, and the least arbitrary of the five in one specific sense: it's a bare majority on a binary forced-choice question, which is close to the most defensible "least invented" number available — no external benchmark used or needed for a simple majority test.
2. **Reasoning behind the specific number:** 50% (not 60%, unlike H1) reflects that this is a two-option forced choice rather than an open behavioral claim — a bare majority is the natural inflection point for "which of two things do more people prefer," whereas H1's 60% bar exists specifically to guard against self-selection bias in an open prevalence claim. The two thresholds aren't inconsistent with each other; they're answering different kinds of questions.
3. **Would I revise it now?** Yes, for a different reason than the bar itself: this hypothesis feeds directly into a real, still-open pricing-model direction (`business-decisions.md` Q11 depends partly on the recurring-vs-commission shape), and it's currently tested only against Ana's single prior data point. Given the stakes, I'd apply the same "clear majority, not bare majority" logic used in H1 and **propose raising the bar to 55-60%** rather than leaving it at a coin-flip-adjacent 50%. Separately, I already added a "depende del precio" option to survey Q7 (Section 4.2) in this pass, because a strict fixed/percentage/neither forced choice was hiding a likely-common real answer; that change alone will shift how "50%" gets counted (does "depende del precio" count as neither, or get excluded from the denominator?) and needs a decision before the survey ever runs live. **This should be resolved together with Q11, not decided unilaterally here.**

### Cross-cutting caveat, not previously stated

All four of the survey-based thresholds (H1, H2's survey pre-filter, H5) share the same n=25-40 sample, so H5's 50% threshold has the identical wide-confidence-interval issue described under H1 (roughly ±16-18 points at this sample size). None of Section 6's numbers should be read as precision instruments; they're reasonable go/no-go markers for a small, exploratory, non-random sample, and the gray zones already built into H1 and H3 are the right instinct — I'd extend that same "band, not single line" treatment to H5 if revising.

**Summary of proposed revisions — historical, was never applied to Section 6, and Section 6 no longer uses this threshold framing at all following the Product Owner's 2026-08-02 correction:**
- H1: keep 60%/30%, but explicitly label the sample as directional/exploratory and consider widening the target to 40-60 respondents.
- H2: no numeric change; read near-misses holistically.
- H3: raise the visit minimum from 100 to 150-200 for a decision-grade read; keep 15%/5% as directional, not benchmark-derived, targets.
- H5: consider raising the validation bar from 50% to 55-60%, and resolve how "depende del precio" responses are counted before the survey runs live.

**What carries forward to the pre-pilot quantitative pass:** the margin-of-error math under H1, the qualitative-saturation reasoning under H2, the warm-vs-cold conversion-rate distinction and visit-minimum math under H3, and the open "how is 'depende del precio' counted" question under H5 (to be resolved alongside `business-decisions.md` Q11) are all still-relevant inputs whenever quantitative acceptance criteria get (re)defined, once there's a broader market understanding and a real acquisition channel to size a sample against.

---

## Open dependencies to flag

- **2026-08-07:** a companion analytical artifact, `company/jobs-to-be-done.md`, was persisted — a Jobs To Be Done synthesis grounded in the same interview/field evidence as this document, plus the 2026-08-07 competitive/behavioral landscape research. It names a related-but-distinct open hypothesis (the "Unserved-Job Hypothesis" — whether the registration job is currently unserved by any real alternative, not just underserved) and cross-references H1 explicitly to avoid label collision. That document doesn't change H1-H5 or Section 6's evidence-to-collect plan; it explains the underlying job those hypotheses are testing against. Check it before starting future positioning/messaging work.
- **2026-08-08:** a new Section 1c records H6 — the price-grouping/divergence operating-model hypothesis raised in a Product Discovery thread investigating the domain model's confirmed price-field gap on Product/SaleItem. Deliberately recorded here (market-validation territory: a merchant-behavior claim needing real validation), not in `company/jobs-to-be-done.md` (a JTBD/positioning-analysis document, not a merchant-operating-mechanism one) — keeping each artifact to its own job, per this document's own `company/CLAUDE.md`-derived discipline. H6 differs in kind from H1-H5: it has no validated starting point even for Ana, so it's a single-subject discovery question first, a generalization question only after. Section 4.6's interview guide now includes a dedicated C2 probe for it. This document makes no recommendation about where price should live in the domain model — that stays a downstream question for `architect`/Product Owner once real evidence exists, unaffected by anything recorded here.
- **2026-08-08 (later same day):** an informal, unprompted-in-content field observation from Ana (a Product Owner conversation, not a structured interview) refined H6 with real Supported Evidence — see new **Section 1c's H6a** for the pricing-structure refinement (default price per group, plus a second, event-driven override axis) and new **Section 1d** for the independently-logged bazaar-event-cost fact (cross-referenced in `company/jobs-to-be-done.md`'s Friction tier 2 section). Both are tagged Supported Evidence with informal sourcing, explicitly distinct from the still-not-run structured H6 interview (Section 4.6, C2, which now carries a short addendum pointing at what to probe once it does run). Neither changes H1-H5, Section 6's framing, or makes any recommendation about the domain model.
- Section 2's community verification pass was run for the first time 2026-08-04 (live access available that session) — see Section 2.1's update and `company/usability-testing-plan.md` §7.3 for the real channels found. It found organizer/community *channels*, not individual merchants (not the pass's goal — see that section). Section 2's earlier "no live access" note is kept above as the honest record of the two sessions where that was true.
- Section 2a's passive observation (reading and logging actual unprompted post *content*, not just confirming a channel exists) is still not run — see Section 2a's updated note.
- H5's directional read still depends on `business-decisions.md` Q11 (billing-cycle model) being resolved before a specific price point can ever be tested, not just a shape (recurring vs. commission) — and also depends on how "depende del precio" survey responses get counted, which should be resolved alongside Q11 before the survey ever runs live.
- No real *individual* pilot-merchant candidates are named yet anywhere in this package — deliberately, since none have been identified through verified research, and individual vendors aren't discoverable through public search/social browsing without outreach to begin with. Section 2b's criteria framework and Section 4.5's script are ready to apply the moment a verified candidate exists (via the Product Owner's network, an approved post into one of the 2026-08-04 channels, or a future opt-in survey/interview respondent); none has a real target yet.
- Section 6 now defines success as learning objectives and evidence-to-collect, not numeric go/no-go thresholds, per the Product Owner's 2026-08-02 correction. Section 7's original threshold reasoning is retained as a dated historical record (not operative) and as input for a future pre-pilot pass where quantitative acceptance criteria will be (re)defined, once there's a broader market understanding and a real acquisition channel.

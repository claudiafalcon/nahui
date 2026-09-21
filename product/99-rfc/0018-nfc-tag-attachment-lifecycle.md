# RFC 0018 — `NFCTag` gains an explicit attachment window, so a returned physical tag can be legitimately reattached

**Status:** Accepted (2026-09-21, Product Owner — live symptom, explicit direction to fix the lifecycle rather than the validation)

**Supersedes:** `decision-log.md` D74's "Reuse, stated plainly" §(C). **Amends:** D11's consumable framing (amended, not retired — tags remain consumable in the ordinary case); the `NFCTag` `ubiquitous-language.md` entry's 2026-09-19 "the row persists after a sale" clarification.

## The idea

`NFCTag` stops being a 1:1 attribute of `InventoryUnit` and becomes an **attachment record carrying an explicit validity window**. It gains `detachedAt` (nullable timestamp), the closing bookend to the `assignedAt` D59 already established. The uniqueness invariant is restated on the right object:

> **At most one *open* attachment per `(businessId, tagIdentifier)`, and at most one *open* attachment per `unitId`.** Both enforced by partial unique indexes `where detached_at is null`. A closed attachment is history and collides with nothing.

`InventoryUnit` gains a 1:N relationship to `NFCTag` with an at-most-one-open constraint, replacing today's 1:1.

## Why the current model is wrong

The `nfc_tags` row does two structurally different jobs at once, and uniqueness is attached to the row rather than to either job:

1. **The active physical attachment** — "this tag is on this garment right now." Read by sale-time scan resolution, allocation scan, tagged-unit counts (D80/D81), the untagged-pool selector (D82), and Asignar Tags eligibility.
2. **The historical attachment record** — "this identifier was on this unit when it sold." Read by exactly one thing: D10's claim-side resolution.

Job 2 is why the row must survive `finalize_sale`. Job 1 is why the identifier must become free again. Because one row carries both and uniqueness is stated as *one row per identifier*, **job 2 permanently forecloses job 1.** That is the whole defect — not a missing delete, and not a too-strict check.

Verified: the unique index is on `(business_id, tag_identifier)` (`20260913030000_inventory_persistence_layer.sql:203`), `unit_id` is additionally `not null unique` ("one tag per unit, ever"), `finalize_sale` never deletes, and the only two `delete from public.nfc_tags` statements are D77's (`20260918010000:108`) and D78's (`20260918020000:185`). The claim is Business-scoped, so the blast radius was never cross-tenant — but a merchant reusing her own tag is the entire case.

## When the window closes

Two closing events, and deliberately no third:

- **(a) Re-attachment of the same identifier to a new unit closes the prior window.** Permitted **only** when the prior open attachment's unit is `sold` or `removed`. If the prior holder is `available` or `reserved`, this stays a hard conflict — `tag_already_assigned`, `inventory.md` §3.15, unchanged. The re-attachment write closes the old window and opens the new one in one transaction.
- **(b) `available → removed` (D77/D78) closes the window.** Those paths hard-delete today; under this model they set `detachedAt` instead (see "Recommended" below).

**There is deliberately no automatic detachment at `finalize_sale`, and that is the load-bearing choice.** The moment a customer physically peels a tag off a garment is unobservable to Nahui, and whether she ever returns it is unknowable. Stamping a `detachedAt` at sale time would assert a physical fact the system cannot verify — the exact posture D59 was corrected to avoid ("Nahui must not silently assume unsold merchandise physically returned… just because the Event ended"). So the window on a sold unit stays **open until something supersedes it**, and the only thing that can supersede it is the merchant physically holding that tag against a new garment.

**Semantics, stated so "open window on a sold unit" doesn't read as sloppy:** *open* means "not superseded," **not** "in the merchant's possession." Possession is `InventoryUnit.status`. Keeping the two facts separate is precisely what lets D10's claim path and Inventory's counting paths read the same table and correctly disagree about the same row.

## Why this is a lifecycle correction, not the loosened check the Product Owner rejected

Her constraint was explicit: *"solve the lifecycle correctly rather than special-casing the validation error."*

A special case would keep "one row per identifier" as the invariant and carve an exception into the guard — `or status = 'sold'`, or catching the unique violation. **This does the opposite: it corrects the invariant itself**, because "one row per identifier" was never the business rule. The real rule has always been *a physical tag can be on at most one garment at a time*. The old schema conflated those two statements only because it had no way to express "was on." Once the attachment carries a window, the rule is stated exactly and enforced **with no exception branch at all** — the `sold`-holder case does not bypass the invariant, it **satisfies** it, by closing the prior window before opening a new one. Nothing is loosened; the constraint becomes strictly more precise.

## Why implicit re-attachment needs no merchant UX

To re-attach a tag she must be **holding** it, and holding it is the proof it came back. A tag still on a customer's garment cannot be scanned by the merchant. There is no false-positive case — the same exclusive-physical-possession property D74 relied on when choosing the factory UID over written content. The physical gesture carries all the evidence the write needs, so the model asks her nothing (`global-principles.md`, "never ask twice"; "technology should disappear").

This is also *why* implicit-detachment-on-re-attachment was chosen over an explicit "liberar tag" action: an explicit action would be exactly the deferred returns/reuse UX, dragged into scope.

## D10 is preserved in substance

Resolution becomes: identifier → **the one open attachment** → unit → disambiguate purely on `InventoryUnit.status` (`available`/`reserved` = sale scan, `sold` = claim). **The disambiguation rule D10 states is untouched**; only the lookup narrows from "the row" to "the open row." One added rule, explicit in the Foundation text: **scan resolution never reads a closed attachment.** Closed rows exist for traceability and for D59's "was this physically verified" question, never for resolving a tap.

`assignedAt` alone would have been insufficient by exactly one field: it gives "most recent attachment," the right resolution rule, but only as a `max()` heuristic over rows that all still assert they are current. With `detachedAt`, "the open attachment" is a stated fact enforced by a constraint rather than inferred by ordering — the same row-level-truth-over-derived-number discipline D59 established.

**`detachedAt` is not a new concept.** D59's invariant as persisted already reads: *"Verified physical identity … exists only during an `NFCTag`'s attachment window (`assignedAt` through detachment/reassignment, if any)."* The Foundation already describes a window with an end and already names reassignment as one of the two things that ends it. What was missing was any field that could express that end.

## The Claim-collision question

1. **An already-created `Claim` is structurally untouched.** `Claim`'s schema is `id, businessId, customerId, saleItemId, claimedAt` — **no `Claim` row references `NFCTag` at all.** Re-attaching an identifier can never invalidate, redirect, or orphan an existing Claim.
2. **Two people cannot hold the same physical tag.** Once the merchant has re-attached T to unit B, anyone tapping T is physically holding B; resolution returns B and reads B's status. Before B sells: sale scan. After B sells: a Claim against B's SaleItem. Both correct. The temporal ambiguity one would expect cannot occur, because possession of the physical token is exclusive.
3. **One real loss case, with a designed fallback.** Customer buys unit A, hands the tag back at the stall without ever claiming, merchant re-attaches it to B. A's SaleItem now has no NFC claim path. Acceptable, and not new: under D11 a tag that came back is by definition one the customer chose not to keep. **No Claim becomes structurally unreachable**, because D22's Sale-level Claim Token is generated at every Paid-tier Sale finalization regardless of mechanism, and a single Sale-token scan resolves into one Claim per SaleItem.
4. **Loyalty-claim is future/not built**, so this is a model-correctness question today, not a live regression — the right time to get it right, and no built claim code needs changing.

## Composition with D80 / D81 / D82

**D80 and D81 need no rule change.** Their sourcing rule is already `tagId != null AND status IN ('available','reserved')` (D81 narrowing to `available` for commit gates). Under the new model a closed attachment can only ever belong to a `sold` or `removed` unit — detachment is produced only by re-attachment (permitted only against a `sold`/`removed` holder) or by D77/D78 removal. So **within D80's status allowlist, "has an attachment" and "has an *open* attachment" denote the identical set.** The allowlist installed in D80's same-day clarification is exactly what makes this lifecycle change compose without touching D80/D81 at all.

The qualifier is still added to those selectors **defensively**, on D80's own stated reasoning for writing the scope as an allowlist ("so a future status added without a tag-release path cannot silently enter the count"), and the enabling condition is named so it stays checkable rather than incidentally true:

> **Composition invariant:** a closed `NFCTag` attachment never belongs to a unit whose status is in the sale-time allowlist (`available`/`reserved`).

**D82's selector genuinely must change.** `availableUntaggedCount` and `_fifo_commit_to_allocation`'s matching `not exists (… nfc_tags …)` predicate are safe today and only today. They stop being safe the moment any detachment can occur on a live unit — e.g. a tag falling off an `available` garment and being replaced, leaving that unit with a closed attachment and no open one. That unit is genuinely untagged and genuinely manually-committable, and the unqualified `not exists` would **silently exclude it**, under-counting the manual pool — the exact failure class D82 exists to close. **Both expressions gain `and nt.detached_at is null` in the same pass**, so ceiling and server predicate stay textually in step; keeping them in step *is* the D82 invariant.

## What it changes

**Schema** (new migration; **purely additive at the data level** — every existing row backfills to `detached_at = null`, all currently open, which is correct under the new model. No destructive statement, no manual Dashboard cleanup, nothing like D74's or D76's data corrections):

- `nfc_tags` gains `detached_at timestamptz null`.
- `unit_id`'s `unique` becomes a partial unique index `where detached_at is null`.
- `nfc_tags_identifier_unique_idx` becomes partial: `(business_id, tag_identifier) where detached_at is null`.
- `assign_tag_to_next_pending_unit`'s conflict check narrows to open attachments and gains the close-then-open transition when the existing open attachment's unit is `sold`/`removed`; its untagged-candidate predicate gains the open qualifier.
- **Exhaustive caller audit** — every `join public.nfc_tags` / `not exists (… nfc_tags …)` across the migration set gains the open qualifier, plus `src/domain/selectors.ts`'s tagged-count and untagged-available selectors. Done in one pass rather than discovered over three rounds.

**Foundation:**

- `ubiquitous-language.md` `NFCTag` — "1:1" → at-most-one-open-attachment; the "Consumable… the row persists after a sale" clause rewritten (the 2026-09-19 clarification is superseded **by name**, not quietly reworded); `detachedAt` added alongside `assignedAt`.
- `domain-model.md` — the "Not aggregate roots" `NFCTag` sentence; the entity-relationship block's `optional 1:1 NFCTag` line; the `InventoryUnit` lifecycle block's D77 parenthetical ("the model's only non-sale NFCTag detachment case" — no longer only); "Logical vs. physical identity" gains the sentence that `detachedAt` is what makes its own already-stated window-end expressible.
- `decision-log.md` — promoting entry; D74 §(C) marked superseded, D11 amended not retired.

**UX spec, narrowly:** `inventory.md` §3.15's *condition* narrows — "Este tag ya está asignado a otra prenda" now fires only when the prior holder is still on hand (`available`/`reserved`). **Spanish copy unchanged; no new screen, state, or flow.** A spec-accuracy amendment routed to `ux-designer`, not a design task — flagged so §3.15 doesn't go stale the way D59 left `home.md` §3.8a stale.

## Recommended, not required to close the defect

**D77/D78's hard deletes become detachments.** Otherwise the model carries two different meanings of "tag released" — one that preserves the window, one that destroys it — and the removed unit loses the attachment history D59's invariant relies on. Not required for reuse to work (deleting also frees the identifier). Already-deleted rows are gone and need no backfill.

## Alternatives considered and rejected

- **Promote `NFCTag` to an aggregate root** modeling the physical tag as durable stock (`unattached → attached → detached`, tags-on-hand counts). There is a real argument: every scan RPC already resolves `(business_id, tag_identifier)` with no `InventoryUnit` in context, a genuine independent query axis — the same test that promoted `Venue`, `BusinessMembership`, `EventAllocation`. But the decisive test is whether the tag needs state *while attached to nothing* — does Nahui model the drawer of 40 blank tags? Nothing in the Foundation or `backlog.md` asks for that. `architecture-principles.md` #5 permits speculative modeling exactly once, explicitly named, and that allowance is already spent on Supplier/`InventoryEntry.cost` (D9). **Rejected: no new root.**
- **Delete the row at `finalize_sale` and record the identifier on `SaleItem` instead.** Rejected on three grounds, the first decisive: (i) it moves a physical-identity fact into Selling, so Loyalty-claim would resolve a claim by reading Selling's stored identifier rather than Inventory's tag→unit map — a real change to the context edge D10 defines, where this RFC needs none; (ii) D79 checked and explicitly declined to add a resolution-mechanism field to `SaleItem` under the same over-modeling discipline; (iii) it destroys the attachment-window record D59's "Logical vs. physical identity" invariant depends on.
- **Just delete the row on `finalize_sale`.** Breaks D10 outright.
- **Time-scoped claim** (identifier frees after N days). Invents an undecided business rule and would silently expire a customer's claim on a clock — a Product/Business Decision, not an architectural one, and not needed.
- **Status-derived validity** (infer "still live" from the unit's status). Close, but wrong as the primary mechanism: it makes the attachment's validity a second-order inference from a field owned for a different purpose — the counter-vs-row-level-truth failure D59 named as a standing lesson. The window is a fact; store it as one.
- **An explicit `NFCTag.status` enum.** Adds a second writable representation of the same fact — the counter/flag-drift anti-pattern D59 and D71 both rejected by name. `assignedAt`/`detachedAt` is sufficient.

## What it does not change

No aggregate boundary moves; `NFCTag` stays owned by `InventoryUnit`, inside Inventory. No bounded-context edge changes — Loyalty-claim still reads Inventory's `InventoryUnit.status`, Selling still reads Inventory read-only for tag→unit resolution; `domain-model.md`'s Bounded contexts table needs no edit. No `Claim` or Loyalty-claim schema change. No `SaleItem` field. No change to D10's status partition. No change to `Product.nfcTaggingEnabled`, `Business.nfcPerProductEnabled`, `subscriptionTier` gating, or barcode/NFC mutual exclusivity (D65/D71/D79/D80). **No relaxation of `_fifo_commit_to_allocation`'s untagged-only predicate** — D81's "trap" ruling stands untouched and is not what this fix is about.

**Out of scope, deliberately:** returns/reuse merchant UX of any kind — no "devoluciones" flow, no tag-inventory screen, no "liberar tag" action, no confirmation dialog, no merchant-visible notion of a tag's history. The entire mechanism is invisible: she taps a returned tag onto a new garment in the existing Asignar Tags flow and it works.

## Provenance

**D74 pre-wrote the routing for this exact moment.** Its "Reuse, stated plainly" §(C) — a tag peeled from a *sold* unit and presented on a new unit — states: *"If the Product Owner's actual practice is (C), that is a Product Decision contradicting D11 and requires an RFC — to be logged in `product-decisions.md` if confirmed, not resolved here."* The Product Owner's 2026-09-21 directive confirms practice (C). This is not a fresh classification call; it is the already-logged instruction firing, and it means the "ya está en uso" symptom was a *decided* behaviour now revisited, not an oversight.

Distinct in kind from **D76**, which shared the symptom but was a query-scoping bug (`assign_tag_to_next_pending_unit` lacking product scope and an eligibility check). Here the row genuinely exists and genuinely claims the identifier.

## Decision ownership

- **Product Decision** — "is physical tag reuse a supported merchant practice?" **Already made by the Product Owner's own directive** (*"I don't want to knowingly preserve a lifecycle model that makes legitimate tag reuse impossible"*). Recorded as decided-by-directive, not posed as an open question.
- **Architect Decision** — how the lifecycle is modeled so reuse is expressible. This RFC.
- **Business Decision, flagged and deferred, not blocking** — D11 frames tags as "a recurring consumable — merchants buy additional tag packs as they keep selling," and D11's own text calls that "a business-model decision, not an architectural one." Supported reuse weakens that revenue framing at the margin (most tags still leave with customers; some now come back). Logged to `company/business-decisions.md`, resolved whenever pricing is next touched. D11 itself already says the domain model "supports either resolution."

## Consultations

**`knowledge-mentor`: not requested**, and deliberately so rather than silently skipped. The trigger is a new aggregate boundary, bounded context, interaction-architecture pattern, or design-system structure. This RFC rules *against* a new aggregate root and moves no context. The remaining shape — an association carrying an explicit validity window, with uniqueness constrained to the open interval — is ordinary temporal modeling, and the reasoning actually needed is already inside this Foundation (D59's window, D59's row-level-truth lesson, D80's allowlist discipline). The one genuinely open technique question — partial unique index vs. a `tstzrange` exclusion constraint — is an implementation call, not an architecture question.

**`brand-guardian`: not requested.** `detachedAt`, "attachment window," "tag reuse" are internal English domain terms with no merchant-facing surface. §3.15's Spanish copy is unchanged.

# Customer Loyalty Registration — UX Specification

Status: Approved (Draft-complete). First version built 2026-08-08 against `decision-log.md` D34/D35/D37. `ux-critic`: 2 rounds — round 1 found 2 Major (a self-contradictory "No, gracias" button-weight annotation; a missing decline affordance/trust-footer gap on §3.6) + 3 Minor, all fixed; round 2 clean, no regressions. `reviewer`: 1 Blocker (implementation-specific Button-class naming, fixed) + 2 Important (resolved by this document's own folder placement, `decision-log.md` D38) — final pass clean, including a fresh Foundation-consistency check against `domain-model.md`/`ubiquitous-language.md`/RFC 0004/RFC 0005. **Further amended 2026-08-09 (`decision-log.md` D40 — `loyaltyEnabled` retired):** §0 states plainly this flow is only ever reached via a Paid-tier-generated Claim Token; §8 item 2 resolved by dissolution. `ux-critic` verified clean. Folded back into Approved. See `product/02-ux-loyalty/CLAUDE.md` for the full status record.

**Scope boundary — read this before anything else.** This document is explicitly **not** part of the Nahui Merchant Application. It specifies a separate, customer-facing surface: a lightweight web destination that the opaque, signed Claim Token embedded in a QR (`ubiquitous-language.md`'s **Claim Token**, `decision-log.md` D22) resolves to, opened in the customer's own mobile browser. Per `information-architecture.md`'s own frozen module boundary ("Explicitly out of scope: loyalty-claim" — "The Merchant Application never participates in customer identification... The Loyalty experience always runs independently from the Merchant Application"): no app install, no bottom nav bar, no Nahui merchant-app UI shell, no shared navigation with `home.md`/`inventory.md`/`events.md`/`reports.md`/`settings.md`/`onboarding.md`. None of those documents' navigation conventions are reused here. This document's own conventions (`[ ]` = tappable, plain text = passive — the one visual-affordance convention this doc *does* borrow, since it's a base UI convention, not merchant chrome) are otherwise self-contained.

**What this flow reads (internal only, never rendered back to the customer):** resolves the Sale → SaleItem set behind the scanned Claim Token, via Loyalty-claim's existing read-only dependency on Selling (`domain-model.md` bounded-context table). Raw Sale ID, SaleItem contents, product names, prices, and counts are never shown to the customer at any point in this document — every screen state below was checked against this constraint explicitly.

**What this flow writes:** `Customer` (create-or-update via the `(businessId, email)` dedup lookup, `decision-log.md` D37) and `Claim` (one per SaleItem in the resolved Sale) — entirely within Loyalty-claim's own owned aggregates (`decision-log.md` D35), never touching `Sale`, `SaleItem`, or `InventoryUnit` directly.

**Reached only via a Paid-tier-generated Claim Token.** Per `decision-log.md` D40, a Claim Token is generated if and only if `subscriptionTier = paid` for the Business at Sale finalization — a Free-tier Business's Sale generates none, so there is no QR, no link, and no way for this surface to ever be reached from one.

**What this flow never does:** never authenticates or logs the customer in — identification only, never authorization (`product/99-rfc/0004-customer-loyalty-participation-record.md`, confirmed directly by the Product Owner). Never exposes data belonging to another Business or another Customer. Never routes into, embeds, or displays any part of the Merchant Application. Never requires an app install.

**Out of scope, by explicit instruction — flagged rather than designed around:**
- **The merchant-facing Loyalty Participation view** ("Tus clientes," `reports.md` §3.12/§3.13) — already designed, unaffected by this document.
- **The merchant-initiated "confirm reward" write action** (`product/99-rfc/0005-reward-cycle-confirmation-write-edge.md`, Proposed, pending Product Owner approval) — a different, merchant-side surface entirely; not designed here, and this document doesn't depend on it being Accepted.
- **NFC-tag-scan resolution mechanics** (`company/backlog.md` #2 Stage 1) — a different entry mechanism into the identical terminal write (`ubiquitous-language.md`'s **Claim** definition: "NFC tag scan... Sale-level Claim Token... all converging on the identical terminal write"). This document designs the Stage 2 (Sale-level QR/Claim Token) entry path specifically; whether an NFC scan lands on these same post-resolution screens is a reasonable future reuse, not confirmed or designed here (see §11).
- **Payments/checkout** — not part of this flow in any form (`company/CLAUDE.md` non-goals).
- **The QR's actual rendering on the merchant's Digital Receipt** — as of `home.md`'s 2026-08-09 QR amendment, §3.8f now renders a real, tappable/scannable Claim Token QR (replacing its former textual placeholder), with this document as its already-Approved destination flow (§3.1 onward). That amendment is a bridge only — it doesn't redesign anything specified here, and this document's own scope/content is unaffected by it.

## 1. Customer goal (this document's substitute for "Merchant goal," per this task's own framing)

Two distinct moments, each with its own goal:

- **First visit to this Business's loyalty relationship.** She just bought something from a vendor at a bazaar and was shown a QR. Her goal, in order: understand quickly and honestly what scanning this actually got her into (a relationship with *this specific vendor*, not a Nahui platform account — `product/99-rfc/0004...` confirms there is no such account); decide, genuinely freely, whether she wants that; if yes, give the minimum information required (just an email) with an honest, easy option to add a little more; get a clear, immediate signal that it worked.
- **Returning visit** (same email, same Business, an existing `Customer` record per D37). Her goal is simpler: confirm this new purchase counted, as fast as possible, without being asked anything she's already told this vendor before.

**A genuinely different pressure profile than every other document in this family.** `home.md`'s <3s bar (`company/backlog.md` #1) governs the *Sale write* — this flow is reached only *after* that write has already succeeded (`decision-log.md` D34's own finding: the Digital Receipt, and therefore any QR on it, "renders only after the Sale write has already succeeded... does not touch the write path #1/#2's speed gate protects"). So nothing here is bound to that 3-second floor. But a different kind of speed still matters: she's standing at a bazaar stall, likely on unreliable mobile data, has zero pre-existing trust in a web page a stranger's phone just showed her, and has no reason to linger. The design standard here isn't "beat a stopwatch," it's "don't give her a reason to bail" — every screen should read as obviously, immediately legible and honest, the same "respects the vendor's intelligence" tone `brand-guide.md` asks for toward Ana, applied here to the customer instead.

## 2. Resolution / decision logic

Evaluated the instant she opens the link (before anything is shown):

```
1. Resolve the Claim Token embedded in the URL — signature/format check.
   → Malformed, tampered, or unrecognized → 3.3 Enlace no disponible.
   → Recognized but past its validity window (exact duration not
     specified anywhere in the Foundation — flagged §8, item 1; doesn't
     block this design since the customer-facing resolution is
     identical regardless of the specific reason) → 3.3 Enlace no
     disponible — same screen, same copy as the malformed case. She has
     no need to know which specific reason applies, and neither is
     actionable from where she's standing.

2. Token is structurally valid and unexpired. Resolve the Sale →
   SaleItem set behind it (internal only — never rendered to her).
   Is every SaleItem in that Sale already linked to a Claim?
   → YES (fully claimed already — whether from her own earlier
     successful registration, an accidental double-open, or, rarely, a
     different person reaching an already-consumed token) →
     3.4 Esta compra ya fue registrada. No email is ever requested in
     this branch — the check happens before asking anything, which is
     what lets this state be reached identically regardless of who is
     asking, without needing to compare identities to protect privacy
     (`product/99-rfc/0004...`'s denylist: never expose another
     Customer's data). Nothing about who registered it, or when, is
     ever shown. (This check only covers a *rescan* of a token that
     already has a Claim — a distinct case from two people racing to
     claim the same still-*unclaimed* token near-simultaneously,
     named as an open gap in §8 item 6.)
   → NO (at least one SaleItem still unclaimed) → continue to 3.

3. Show 3.5 (Correo — entrada). She types an email, taps "Continuar."
   Client-side shape check (has an "@", a domain segment — nothing
   stronger validated here, since deeper validation isn't a UI-layer
   concern):
   → Implausible shape → 3.5a inline message, "Continuar" attempts
     nothing.
   → Plausible shape → attempt resolution (step 4).

4. Server resolves the dedup lookup for (businessId, email)
   (`decision-log.md` D37):
   → Existing Customer found for this Business → ageRange/gender are
     never (re-)asked (D37) → this same submission creates this Sale's
     remaining Claim(s), linking the existing Customer to every
     still-unclaimed SaleItem, and increments her stored counters →
     3.7/3.8 Guardando… → 3.11 Compra confirmada (cliente que regresa).
   → No existing Customer → 3.6 Cuéntanos un poco más — opcional. She
     may leave both fields blank and tap "Listo" immediately, or fill
     either/both first — no separate "skip" action required to bypass
     either field (same shape `onboarding.md` §2.2b already established
     for Business.logo/description).

5. "Listo" tapped (3.6) → the write: create a new Customer (email +
   whatever ageRange/gender she entered, either may be null) + create a
   Claim per unclaimed SaleItem in this Sale → 3.7/3.8 Guardando… →
   3.10 Registro exitoso (primera vez).

6. Either write attempt (step 3's combined lookup+write, or step 5's)
   fails on a transient error →
     3.9 No pudimos guardar — Reintentar, replaying the exact same
     attempt via a stable, client-held idempotency key established the
     moment she first tapped "Continuar"/"Listo"
     (`architecture-principles.md` #7) — never asks her to retype
     anything already entered, and never risks a duplicate Customer or
     Claim if the original write actually succeeded server-side and
     only the confirmation was lost.

7. Step 1-2's own resolution fails to load at all (no connectivity,
   server unreachable, before anything about the token is even known)
   → 3.12 No pudimos cargar — Reintentar (a bare retry of the
     resolution check; distinct from state 9 because nothing has been
     typed yet here, so there's nothing to preserve).

Separately, at any point on 3.5 or 3.6 — i.e. any point before the
write in step 5 actually fires — she may tap "No, gracias" instead →
3.6b (declined) — a real, always-available way to opt out, per this
task's explicit "no dark patterns" instruction, consistent across the
entire pre-write portion of the flow rather than only its first
screen. Nothing is written either way; on 3.6 specifically, nothing
has been written yet regardless, since the write only happens once
"Listo" is tapped (step 5), so declining there costs her nothing that
would need "undoing." This doesn't suppress being asked again on a
*future* Sale at this same Business — no Foundation field exists for
a persistent opt-out preference (§11).
```

## 3. Low-fidelity wireframes

Convention: `[ ]` = tappable, plain text = passive/informational — the one visual convention borrowed from the merchant-app document family (a base UI convention, not merchant chrome). No nav bar anywhere in this document — there is nothing to navigate to; this surface has exactly the states enumerated below and nothing else.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│                                │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
└───────────────────────────────┘
```
- Covers token validity + already-claimed checks together, silently. *global-principles.md*, "technology should disappear."

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
└───────────────────────────────┘
```

### 3.3 Enlace no disponible
```
┌───────────────────────────────┐
│                                │
│    Este enlace ya no está        │
│    disponible.                   │
│                                │
│    La próxima vez que compres,   │
│    vas a poder intentarlo de     │
│    nuevo.                        │
│                                │
└───────────────────────────────┘
```
- No "Reintentar" — retrying a resolution check won't change a fact about the token itself. Calm, plain tone, not styled as an alarming failure (nothing was entered, nothing is at risk — same distinction `brand-guide.md`'s Error-usage note already draws for a passive, retry-only load state, applied here at the content/tone level, not a color choice, which is out of this document's scope).
- No merchant/business identity shown here — the token never resolved far enough to know whose it was, or it's deliberately withheld either way; nothing to personalize with yet.

### 3.4 Esta compra ya fue registrada
```
┌───────────────────────────────┐
│                                │
│    Esta compra ya fue            │
│    registrada.                   │
│                                │
│    No hay nada más que hacer      │
│    aquí.                         │
│                                │
└───────────────────────────────┘
```
- Reached without ever asking for an email — see §2 step 2. No button, no Reintentar: nothing here will change on a retry, and there's no interrupted action to recover (§9 addresses why "never a dead end" doesn't apply to this specific state).

### 3.5 Correo — entrada (first interactive screen, shown to every visit)
```
┌───────────────────────────────┐
│                                │
│  Luna Mercado                        │  Business.name (or logo, if set —
│                                │  same source/precedent as
│                                │  home.md §3.8f's receipt, never
│                                │  both together)
│                                │
│  ¿Quieres que Luna Mercado te         │
│  recuerde la próxima vez que      │
│  le compres?                     │
│                                │
│  Con tu correo, Luna Mercado puede    │
│  llevar la cuenta de tus          │
│  compras aquí y, cuando juntes    │
│  suficientes, darte algo a        │
│  cambio.                         │
│                                │
│  Esto es solo con este negocio    │
│  — no es una cuenta de Nahui, y   │
│  tu correo no se comparte con     │
│  nadie más.                      │
│                                │
│ Correo                          │
│  [ tu@correo.com          ]      │
│                                │
│  [       Continuar        ]      │
│                                │
│  [       No, gracias       ]     │  a real, full-size opt-out — not a
│                                │  de-emphasized text link
│                                │
│         Powered by Nahui         │  small, passive, non-tappable
└───────────────────────────────┘
```
- **`Business.name` (or `Business.logo`) is the primary identity on screen — the customer's actual counterpart in this exchange — never Nahui's own mark in that position.** Direct continuation of the same brand-facing call `home.md` §3.8f already made for the merchant receipt (§10 there): this is a relationship with the vendor, not with the platform. Same source fields, same "never both together" rule.
- **Disclosure copy states plainly, before she types anything: who's asking, what for, and that it isn't a Nahui account.** No dark patterns — nothing implies urgency, scarcity, or a cost to declining. "No, gracias" is a bounded, full-size, equally-tappable button — not a de-emphasized text link — while "Continuar" remains the visually stronger of the two, so the pair stays distinguishable. This gives both actions genuinely equal *prominence and availability* — same size, same tap-target weight, same position in the visual hierarchy — without making them look identical, which this task's "no dark patterns, equal visual weight" instruction never required: it asks that declining be as easy to notice and tap as confirming, not that a reasonable person be unable to tell which button does which.
- **"Powered by Nahui" — a small, passive, non-interactive trust footer, not merchant-app UI shell or branding chrome.** Reasoned explicitly, not assumed: a completely unbranded page asking a stranger for her email reads more like phishing, not less — a bare legitimacy signal serves her, not the platform. It carries no navigation, no tap target, no logo — nothing that could be mistaken for the excluded merchant-app shell. See §10.
- "Continuar" is enabled only once the field holds a plausible-shaped value (§3.5a); it is not otherwise gated on anything else, since at this point the system doesn't yet know whether she's new or returning.

### 3.5a Correo — formato inválido (variant of 3.5)
```
│ Correo                          │
│  [ ana@gmail            ]        │
│  Escribe un correo válido        │
```
- Inline message directly below the field; "Continuar" does not attempt a write while this is showing.

### 3.6 Cuéntanos un poco más — opcional (first-time only)
```
┌───────────────────────────────┐
│                                │
│  Luna Mercado                        │
│                                │
│  Ya casi. Esto es opcional —      │
│  puedes dejarlo en blanco.        │
│                                │
│ Rango de edad (opcional)         │
│  [ 18-24 ] [ 25-34 ] [ 35-44 ]   │
│  [ 45-54 ] [ 55+ ]                │
│                                │
│ Género (opcional)                │
│  [ Mujer ] [ Hombre ] [ Otro ]    │
│                                │
│  [         Listo         ]       │
│                                │
│  [       No, gracias       ]     │  same opt-out treatment as 3.5
│                                │
│         Powered by Nahui         │  small, passive, non-tappable
└───────────────────────────────┘
```
- Reached only when the dedup lookup (§2 step 4) found no existing Customer — a returning customer never sees this screen at all.
- **No separate "skip" tap required for either field** — leaving both untouched and tapping "Listo" immediately is the entire mechanism, identical in shape to `onboarding.md` §2.2b's treatment of `Business.logo`/`Business.description`. Neither field carries any visual or copy cue suggesting the blank state is incomplete or provisional.
- Selections are tap-once option groups (implementation-independent — not specifying a component), not free text: no honest reason to type a range or a category by hand when a short, fixed set of options already covers it.
- **"No, gracias" carries over from 3.5, same bounded, full-size, equally-tappable treatment and same destination (3.6b).** Nothing has been written by this point — the write only fires on "Listo" (§2 step 5) — so this is a genuine decline, not a correction of something already saved; without it, this screen would be the one place in the flow where §3.5's own "always-available way to opt out" stops being true, which is exactly the inconsistency this affordance closes.
- **"Powered by Nahui" is present here for the same reason it's present on 3.5** — this is the one screen asking her for more than the bare minimum (optional demographics), which is exactly when an unbranded page would read most like phishing. Omitting it here specifically would contradict the footer's own stated purpose (§10).

### 3.6b No, gracias — confirmación
```
┌───────────────────────────────┐
│                                │
│  Entendido. Gracias por tu       │
│  compra.                         │
│                                │
└───────────────────────────────┘
```
- Nothing written — no Customer, no Claim, regardless of whether she declined from 3.5 or 3.6. A real, honest acknowledgment rather than leaving her uncertain whether closing the tab "did" anything.

### 3.7 / 3.8 Guardando… (near-instant / slow — shared, two trigger points)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│                                │        │        Guardando…               │
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │                                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
- One shared write state reached from either of two points: §2 step 3's combined lookup+write (existing Customer found), or §2 step 5's write after "Listo" (new Customer). Same convention `onboarding.md` §3.5 already establishes for a shared write state covering multiple paths — visually and textually identical either way, since from her side it's the same wait.

### 3.9 No pudimos guardar — error
```
┌───────────────────────────────┐
│  No pudimos guardar. Sigue        │
│  aquí, intenta de nuevo.          │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Whatever she typed (email, and if applicable, ageRange/gender) is preserved and replayed on retry via the same idempotency key — never re-asked. Same guarantee `inventory.md` §3.11 and this whole document family make for every retryable write.

### 3.10 Registro exitoso — primera vez
```
┌───────────────────────────────┐
│                                │
│  Luna Mercado                        │
│                                │
│         ¡Listo!                  │
│                                │
│  Ya quedaste registrada con       │
│  Luna Mercado. La próxima vez que     │
│  compres aquí, te va a             │
│  reconocer.                      │
│                                │
│         Powered by Nahui         │
└───────────────────────────────┘
```
- No item names, counts, or prices — nothing from the resolved Sale/SaleItem set is rendered, per this task's explicit constraint. No numeric progress toward a reward (§8, item 3 — deliberately not designed here, not grounded).

### 3.11 Compra confirmada — cliente que regresa
```
┌───────────────────────────────┐
│                                │
│  Luna Mercado                        │
│                                │
│    ¡Gracias! Ya contamos          │
│    esta compra.                  │
│                                │
│         Powered by Nahui         │
└───────────────────────────────┘
```
- Content-identical in spirit to 3.10 but without "quedaste registrada" (she already is) — the "light confirmation" this task's brief specifically asks for. Same absence of transactional detail or numeric progress.

### 3.12 No pudimos cargar — error (initial resolution failure)
```
┌───────────────────────────────┐
│  No pudimos cargar esto.          │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
- Covers step 1-2's own resolution failing outright (connectivity/server unreachable) before the token's validity is even known. No business identity shown yet — nothing resolved far enough to know whose it is.

## 4. Interaction flow

```
Entry: she taps the link the QR resolved to.

  → 3.1/3.2 Resolving
      → token malformed/expired → 3.3 Enlace no disponible (terminal;
        no further destination — nothing here is actionable)
      → resolution itself fails to load → 3.12 No pudimos cargar
          → Reintentar → 3.1/3.2 again
      → token valid, all SaleItems already claimed → 3.4 Esta compra ya
        fue registrada (terminal; no further destination)
      → token valid, ≥1 SaleItem unclaimed → 3.5 Correo — entrada

  3.5 Correo — entrada
      → types implausible-shaped email → 3.5a inline message → stays on
        3.5 until corrected
      → taps "No, gracias" → 3.6b No, gracias — confirmación (terminal;
        nothing written; also reached from 3.6, see below)
      → types plausible email, taps "Continuar" →
          server lookup (folded into 3.7/3.8's near-instant/slow state)
            → existing Customer found for (businessId, email) →
              write proceeds in the same motion → 3.7/3.8 Guardando…
                → success → 3.11 Compra confirmada — cliente que regresa
                  (terminal; nothing further to do)
                → transient failure → 3.9 No pudimos guardar
                  → Reintentar → 3.7/3.8 again, same idempotency key
            → no existing Customer → 3.6 Cuéntanos un poco más —
              opcional

  3.6 Cuéntanos un poco más — opcional
      → taps "No, gracias" → 3.6b No, gracias — confirmación (terminal;
        nothing written; same shared destination as declining from
        3.5, above)
      → taps "Listo" (with or without ageRange/gender filled) →
        3.7/3.8 Guardando…
          → success → 3.10 Registro exitoso — primera vez (terminal;
            nothing further to do)
          → transient failure → 3.9 No pudimos guardar
            → Reintentar → 3.7/3.8 again, same idempotency key

Every terminal state (3.3, 3.4, 3.6b, 3.9's own dead end if retries keep
failing indefinitely, 3.10, 3.11) is a genuine end of this document's own
graph — there is no "return to Merchant App" destination anywhere,
consistent with this document's own scope boundary. A customer who wants
to do anything else simply closes the page; that action isn't designed
here because it isn't a state this surface produces, it's the absence of
one.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Enlace no disponible (invalid/expired/malformed token — one shared state)
4. Esta compra ya fue registrada (token valid but fully claimed already)
5. Correo — entrada
5a. Correo — formato inválido (variant of 5)
6. Cuéntanos un poco más — opcional (first-time only, reached only when no existing Customer is found)
6b. No, gracias — confirmación (declined; reached from 3.5 or 3.6)
7/8. Guardando… (near-instant/slow, shared write state, reached from either 5's combined lookup+write or 6's "Listo")
9. No pudimos guardar — error
10. Registro exitoso — primera vez
11. Compra confirmada — cliente que regresa
12. No pudimos cargar — error (initial resolution failure)

## 6. Minimum step count

| Scenario | Taps/fields to confirmation | Why it can't be fewer |
|---|---|---|
| Returning customer (existing `(businessId, email)` match) | **2** (type email + tap Continuar) | Email is the only identification mechanism this system has — no login, no device/session recognition grounded in the Foundation (`product/99-rfc/0004...`'s explicit "not an authenticated platform user" clarification). It must be re-provided every visit; nothing else is ever re-asked (D37). |
| First-time customer, declines optional fields | **3** (type email + tap Continuar + tap Listo, both fields left blank) | Email has no honest default and is required for the dedup lookup itself. ageRange/gender are genuinely optional and add zero required taps to skip (§3.6). |
| First-time customer, provides optional fields | **3 taps + 2 selections** (type email + Continuar + select rango + select género + Listo) | Same floor as above; the two selections are her own choice to add, not required. |
| Declines from 3.5, before typing anything | **1** (tap "No, gracias") | A genuine, always-available opt-out — no dark pattern, no forced minimum interaction before she can decline. |
| Declines from 3.6, after providing her email | **3** (type email + tap Continuar + tap "No, gracias") | Same opt-out, now available at the one later point where she's already given something up — closes the gap §3.6 would otherwise leave as the flow's one screen without a decline path (see §3.6's own note). |
| Token already invalid/expired/fully claimed | **0** | Resolves automatically on load; she never has to do anything, and nothing she could do would change the outcome. |

No scenario here carries a tap that exists purely for ceremony — the one screen that could be seen as "an extra step" for a first-time customer (3.6) is fully skippable in a single tap with nothing filled in, the same discipline `onboarding.md` §2.2b already established for its own optional fields.

## 7. Automation opportunities

- Token validity + already-claimed resolution — fully automatic and silent (§2 steps 1-2); she is never asked to confirm or explain either fact.
- The dedup lookup `(businessId, email)` — fully automatic the instant she submits her email; she never sees or triggers it as a separate step (§2 step 4).
- ageRange/gender are never asked to an already-known Customer, structurally — the screen that would ask them (3.6) is only ever reached in the branch where no existing record was found; there is no code path where a returning customer is shown those fields at all.
- The already-claimed check happening *before* any email is requested (§2 step 2) automatically resolves the "same customer re-scanning vs. a different person reaching a consumed token" ambiguity without ever needing to compare identities — privacy-by-construction, not a runtime decision either the system or she has to make.
- Retry safety (transient write failures) — automatic idempotent replay via a client-held key (`architecture-principles.md` #7), never a manual "did that actually work?" judgment call left to her.

## 8. Open questions

Classified by Decision Ownership (`company/CLAUDE.md`), per this task's own instruction not to invent an answer where the Foundation is silent.

1. **Architect Decision candidate.** The exact validity window (if any) for a Claim Token — the Foundation confirms tokens can be "expired" (`ubiquitous-language.md`'s "opaque, signed Claim Token") but never states a duration or expiry rule. Doesn't block this design: the customer-facing resolution (3.3) is identical regardless of the specific reason, so this document doesn't need the number to be complete — only whoever implements the signing/validity check does.
2. **Resolved by `decision-log.md` D40 — this question dissolves, not merely resolved.** `loyaltyEnabled` is retired outright; there is no toggle left for a merchant to flip independently of `subscriptionTier`, so the scenario this item asked about (a Claim Token surviving a `loyaltyEnabled` flip before the customer scans it) can no longer arise. A Claim Token is now generated if and only if `subscriptionTier = paid` at Sale finalization (D40) — this document's §2 correctly never checked `loyaltyEnabled` at resolution time, and there is nothing left in its place to check.
3. **Product Decision.** Should the customer ever see her own reward-cycle progress (e.g., a "3 de 10" equivalent) on this surface, or does that information stay exclusively in the merchant-facing Loyalty Participation Record (D35, allowlisted to the Merchant Application only)? Nothing in this task's grounding specifies a customer-facing view of her own counters, and `Business.loyaltyRewardThreshold` (D37) is described only as something the merchant reads against — I deliberately did not design this in (3.10/3.11 show no numbers), rather than invent a customer-facing capability the Foundation doesn't describe.
4. **Product Decision, non-blocking.** Should a "No, gracias" decline on one Sale suppress being asked again on a future Sale at the same Business? No schema field exists for a persistent per-Customer opt-out preference; today, every Sale's Claim Token is independent, so she'd be asked again next time regardless. Named, not designed around.
5. **Consultation self-check, named per this document family's own convention (`onboarding.md` §2.2b), not a live request.** This document's two-step form shape (email-only first, optional demographics only if genuinely new) has no precedent in `product/02-ux/`'s existing merchant-only docs. I judged it decomposable from already-approved primitives — see this document's own preamble above for the specific precedents cited — rather than a genuinely novel interaction pattern requiring external grounding. Flagged explicitly for `ux-critic`/`reviewer` to challenge if that judgment doesn't hold.
6. **Architect Decision candidate, named gap.** The "already-claimed" check (§2 step 2) correctly handles a *rescan* of an already-claimed token — but doesn't name what happens when two people open the same still-*unclaimed* token near-simultaneously and both proceed far enough to submit a write: whichever write lands first becomes the Customer of record for every SaleItem in that Sale (§2 step 5); the second submission's write would then find zero remaining unclaimed SaleItems, a resolution outcome this document doesn't currently enumerate a screen for. Genuinely rare — it requires two people opening an identical token within the same narrow write window — and not designed around here: what the write layer should return in that case (e.g., treat it as equivalent to 3.4, fail as a distinct case, or something else) needs an Architect call before this document can design the corresponding screen state, consistent with how item 1's own token-validity mechanics are treated as an Architect Decision rather than invented here.

## 9. Principle justification

**global-principles.md:**
- *"Never ask twice"* — ageRange/gender are structurally never re-shown to an already-known Customer (§2 step 4, §7); the entire two-step split (3.5 then, conditionally, 3.6) exists specifically to make this guarantee real rather than aspirational — a single combined screen would have required either asking everyone the optional fields regardless of whether they're already known, or somehow knowing in advance who's returning, which nothing in the Foundation supports.
- *"The fastest interaction is the one that never happens"* — declining is one tap with no forced minimum interaction first (3.5); returning customers reach confirmation in two taps (§6); the optional-fields screen (3.6) is skippable in one tap with nothing filled.
- *"Technology should disappear"* — token validity and the already-claimed check both resolve silently, with no technical explanation ever surfacing to her (§2 steps 1-2, same near-instant/slow convention as every sibling document).
- *"Capture business truth once, reuse it forever"* — her email, once given to this Business, is never asked again for that Business; her ageRange/gender, once given, are never overwritten or re-collected on a later visit (D37).
- *"The best interface stays out of the merchant's way"* (applied here to the customer, the same principle's natural generalization) — a failed save never drops what she typed (3.9); "No, gracias" is a real, always-available escape hatch on both pre-write screens (3.5 and 3.6), not a dead end dressed up as one.

**architecture-principles.md:**
- *#6 (one-way dependency direction, capabilities/aggregates stay in their own bounded context)* — this document's every write lands on `Customer`/`Claim`, Loyalty-claim's own owned aggregates; nothing here ever writes to `Sale`, `SaleItem`, or `InventoryUnit` directly, and nothing here reads or renders raw Sale contents back to her.
- *#7 (writes exposed to client-initiated retry must be idempotent or keyed)* — directly grounds two distinct design decisions: the ordinary retry-after-failure guarantee (3.9), and the structural resolution of "already claimed" at token level (§2 step 2) rather than needing to compare who's asking.

**brand-guide.md:**
- *Tone — "warm, direct, respects the vendor's intelligence"* — applied to the customer here rather than Ana: 3.5's disclosure states plainly, before any commitment, what she's agreeing to and that it isn't a Nahui account; "No, gracias" is a bounded, full-size, equally-tappable button carrying genuinely equal prominence and availability to "Continuar" — same size, same tap weight — without being visually identical to it, satisfying this task's own explicit "no dark patterns" instruction without erasing the distinction between confirming and declining.
- *Brand promise — "connecting commerce, customers, and intelligence"* — the merchant's own identity (`Business.name`/`Business.logo`) is the foreground identity throughout (3.5, 3.10, 3.11), never Nahui's — the same brand-facing call `home.md` §3.8f already made for the merchant-side receipt, applied consistently on the customer-facing counterpart of that same artifact.

## 10. Decisions made

- **Two-step form (email-only first, optional demographics only if a lookup finds no existing Customer) instead of one combined screen.** Reasoned explicitly, not assumed: a single combined screen would force showing (even if skippable) the same "opcional" demographic fields to a returning customer on every visit, which reads as a real, if minor, violation of "never ask twice" in spirit even if functionally harmless — the two-step split makes the guarantee actually true, not just technically satisfied.
- **The "already claimed" check happens at token-resolution time, before any email is ever requested (§2 step 2) — not after she submits an email.** This was the key move that resolved a genuine ambiguity in the brief ("QR scanned twice" could mean the same customer or a different one) without needing to compare identities: since the check happens before anyone is asked to identify themselves, the resulting state (3.4) is correct and privacy-safe regardless of who's asking.
- **No client-side "remember this device" mechanism.** Considered and explicitly rejected — nothing in the Foundation grounds a device-identity or session concept for the customer, and D35/RFC 0004 are explicit that there is no login/account layer here at all. "Near-instant" for a returning visit is delivered entirely through the dedup lookup discarding no work she'd have to redo, not through inventing a persistence mechanism.
- **Malformed and expired tokens share one identical screen and copy (3.3).** She has no actionable use for knowing which specific reason applies, and neither case gives her anything to do differently.
- **A small, passive "Powered by Nahui" trust footer is included, reasoned as distinct from the excluded "merchant-app UI shell/branding chrome."** A stranger being asked for her email on a completely unbranded page is a worse trust signal, not a better one; the footer carries no navigation, no logo, no tap target — nothing that could be mistaken for merchant-app chrome.
- **No numeric reward-cycle progress is ever shown to the customer (3.10/3.11).** Not grounded anywhere in this task's citations as a customer-facing capability (D35's Loyalty Participation Record is explicitly merchant-facing only) — named as an open Product Decision (§8, item 3) instead of invented.
- **No raw Sale/SaleItem/product/price data appears on any screen in this document**, checked explicitly against every state — confirmation screens are purely relational ("¡Gracias! Ya contamos esta compra."), never transactional.

## 11. Future considerations

- Whether the NFC-tag-scan entry mechanism (`company/backlog.md` #2 Stage 1) should land on these same post-resolution screens (3.10/3.11 in particular) once it's built — plausible reuse given `ubiquitous-language.md`'s "all converging on the identical terminal write," but not confirmed or designed here; a future `ux-designer` task once Stage 1 sequencing is active.
- A persistent per-Customer decline/opt-out preference across future Sales at the same Business (§8, item 4) — not designed now, no Foundation field exists for it; only worth pursuing if real usage shows repeated declines feeling repetitive/annoying.
- Whether the customer should ever see her own reward-cycle progress (§8, item 3) — a real Product Decision, not resolved here.
- Whether `Business.logo` renders here in practice (3.5/3.10/3.11 note "or logo, if set" as a design intent, reusing `home.md` §3.8f's exact source/precedent) — not elaborated further since the mechanism itself (upload, storage) is already fully specified in `onboarding.md` §2.2b and doesn't need restating.

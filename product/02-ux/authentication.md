# Authentication — UX Specification

**Status:** New — first draft, pending `ux-critic`/`reviewer` review cycle. No prior Medium-Fidelity spec exists for this surface, so per `decision-log.md` D43 this enters the **New-Feature Workflow** (D42's full 7 stages), not the Migration Workflow — this document is that workflow's Product Definition/UX Flow Review stage.

**[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-case-2`]**

**[Further amended 2026-09-07 — see `authentication.changelog.md#2026-09-07-session-resume-invitation`]**

**Cross-reference, 2026-09-15 (`decision-log.md` D69):** `User.displayName` capture was considered and deliberately *not* added to §3.10c ("Invitación aceptada — bienvenida") — reasoned in full in `settings.md` §2.5. §3.10c itself is unchanged by this note.

**[Further amended 2026-09-07 — Slice 12 `merchant-user-tester` defect, see `authentication.changelog.md#2026-09-07-mistyped-own-number-after-signout`.]** An OWNER who signed out (`settings.md §2.5`) and mistyped her own number on re-entry was silently dropped into a brand-new `onboarding.md §3.3`, with no way back to her existing Business — directly contradicting the sign-out screen's own "no se pierde nada" promise. New §3.7e adds a one-tap confirming screen, reached only when a genuinely-first-time-anywhere phone verifies on a device that has previously held a session for a *different* phone — the exact, narrow condition of this defect — adding zero friction to any ordinary first-time verification. Paired with `settings.md §2.5`/§3.3a, which elevates that document's own already-named, previously-deferred Future Consideration (her own verified number, shown read-only) from deferred to designed.

**Further amended 2026-09-15 — `decision-log.md` D70, `product/99-rfc/0014-invitation-target-hint-enforced.md` (Accepted) — `Invitation.targetHint` becomes required, and acceptance authenticates specifically through it.** For the Invitation-acceptance entry point specifically, §2.0 step 4/§3.10's own "no session" branch no longer routes into §3.2a's three-way method choice. It routes directly into a new, pre-filled, locked Email sub-flow (new §3.2g) — RFC 0014 requires this one entry point to authenticate specifically through `targetHint`'s own value, never through phone or Google. §2.2a's write gains a fifth real outcome, `invitation_identity_mismatch` (new §3.10f) — reached identically whether the mismatch is caught against an already-valid session (RFC 0014's "already-authenticated-under-the-wrong-account" case) or after a fresh, locked Email verification (its narrower "existing account linked elsewhere" case); this document doesn't distinguish the two on screen, the same restraint §3.13a already models for a comparably shared fact. Ordinary (non-Invitation) entry through §3.2a is completely unaffected — phone, Google, and Email remain equally available first-class methods for every other entry point into this document; only the Invitation-acceptance path narrows. §3.2a's own 2026-09-14 "Invitation-context variant" is retired here, marked not deleted (§10). **Backward compatibility:** a still-`pending` Invitation with `targetHint = null` (created before this shipped) is exempt from the new check, server-side — nothing changes on this document's own screens for that case, since `accept_invitation()` simply never returns `invitation_identity_mismatch` for it. `settings.md`'s own companion amendment (the corrected, now-required invite-creation field, and a new OWNER-side repair path for a still-pending row) is that document's own scope, not this one's. Pending `ux-critic`/`reviewer` review.

**[Further amended 2026-09-13 — see `authentication.changelog.md#2026-09-13-google-email`.]** Activates two new, fully independent first-time sign-in/sign-up methods — Google Sign-In and Email — alongside phone, per `decision-log.md` D62/D63 and `product/99-rfc/0012-auth-identity-multi-method.md` (Accepted). A new method-choice screen (§3.2a) now precedes what was previously the phone-only entry point; §2.1/§2.2's resolution logic is generalized to read "any verified `AuthIdentity`" rather than "phone" specifically. §2.2a and §3.10–§3.13a (Invitation acceptance) are explicitly untouched here — that surface stays phone-scoped per RFC 0012 §3's own ruling *as this specific amendment left it*, even though `product/99-rfc/0013-invitation-token-based.md` has since been Accepted (`decision-log.md` D64) and reworked `Invitation` to be token-keyed in the Foundation. **This document's own §2.2a/§3.10–§3.13a text is now stale relative to the Foundation** (`architect`-caught drift, 2026-09-13) — it still describes and designs a phone-keyed Invitation the domain model no longer has. Not fixed in this pass; a dedicated `authentication.md` Migration-Workflow amendment for RFC 0013 is real, separate, not-yet-started follow-on work (alongside the parallel `settings.md` amendment already in progress) — flagged here so the drift isn't mistaken for settled.

**[Further amended 2026-09-14 — see `authentication.changelog.md#2026-09-14-rfc0013-token-invitation`.]** Closes the follow-on explicitly flagged by the banner above and by `product/02-ux/CLAUDE.md`'s own status line: §2.2a/§3.10–§3.13a (Invitation acceptance) are reworked in full against the now-Accepted `product/99-rfc/0013-invitation-token-based.md` (`decision-log.md` D64). `Invitation` discovery moves from an implicit phone-match at OTP-confirm/session-resume to an explicit pre-auth link resolution (new §2.0, new §3.9a/§3.9b) — the offer now appears *before* authentication, not after it. The acceptance write gains two new, precisely distinguished outcomes beyond success/failure (`already_member`, new §3.10d; `membership_revoked`, new §3.10e), alongside the existing `invitation_not_available` race, still §3.13a, now reached from two checkpoints instead of one and reused verbatim across both. Phone, Google, and Email all remain equally available acceptance-side authentication methods, reusing §3.2a–§3.2f verbatim — no parallel authentication UI built for this surface. The per-device decline-memory marker and the multi-pending-Invitation tie-break (former §2.2a steps 2/6) are both eliminated outright, not carried forward, per RFC 0013 §2's own structural reasoning. The ordinary, non-invitation resolution path (§2.1 session-resume, §2.2 cases 1–3, `onboarding.md` handoff) is confirmed completely unaffected — checked directly, not assumed (§2.0 step 1's NO branch). **Full remediation cycle complete.** `ux-critic` found and closed 4 Major (offer-before-authentication continuity, §3.2a's now-inaccurate "nowhere to return to" claim, an unmarked stale §10 bullet, token survival through a Google-cancel detour — see the changelog's "ux-critic closure round" entry). `reviewer`'s document-level pass found and closed 2 Important (an unmarked stale §10 bullet from the retired 2026-09-06 mechanism; the `already_member` outcome's own internal-consistency wording) + 2 Suggestions (snake_case/camelCase naming clarity, `peek_invitation` not being an RFC-literal name) — both fixed directly by Main. Folded back into Approved.

**Further amended 2026-09-14 — see `authentication.changelog.md#2026-09-14-mismatch-confirm-invitation-gap`.** Closes a spec-authorization gap `reviewer` surfaced re-verifying a Team Invitations Blocker fix: §2.0 step 4's "does this device hold a valid session" test had exactly two branches, with no accounting for a device sitting on an *unconfirmed* §3.7e gate at the moment she opens an `/invite/<token>` link. §2.0 step 4 and §3.10's own Behavior block both gain a third, explicit branch — resume §3.7e in place, Invitation-context line stacked on top, gating the acceptance write behind it. No session drop, no new screen, no new copy — reuses the already-Approved §3.7e screen and the already-Approved M1 context-line mechanism. Full reasoning in the changelog entry above.

**Scope:** the identity-verification gate that precedes everything else in the Merchant Application, including the already-Approved `onboarding.md`. A brand-new merchant reaches this gate via any of three independent, parallel methods — phone/WhatsApp OTP, Google Sign-In, or Email OTP (`decision-log.md` D62/D63) — never a mandatory phone step. Not a nav tab, not reachable again once a device holds a verified session (same "never shown twice" shape `onboarding.md` §2.1 already gives its own completion state). Implementation-independent — low-fidelity only, no visual design.

**Naming note (deviating from the task's suggested `owner-access.md`, reasoned explicitly):** this document is named `authentication.md`, not `owner-access.md`. The screens it designs — phone entry, OTP entry, resend, error/lockout states — are not Owner-specific; they're the general verification mechanism every future user of this product will eventually pass through, including a Seller accepting a future invitation (`§11`). Owner-provisioning is only *one* outcome of a successful verification (the first-ever-verification branch, `§2.2`), and per the Product Owner's own scope constraint this document shows no Owner-specific UI at all — naming the file after that one outcome would overstate what's actually on screen. This also directly resolves what `onboarding.md` §0 already calls, by name, "Authentication" — treated there as "an implementation-level concern below this spec's abstraction level." Reusing that exact word keeps continuity with the one place the Foundation already gestured at this concern, without editing that document (see `§11`).

**Placement note for Main:** per `product/02-ux/CLAUDE.md`'s own Rule, a document outside the frozen IA's four nav tabs needs an Architect/RFC ruling before it's given a file here — `onboarding.md`/`settings.md` got exactly this via `decision-log.md` D13, `product/02-ux-loyalty/` via D38. This document is the same shape (non-tab, supplementary, precedes the app's first tab). Recommend a short analogous ruling be logged before this is folded into Approved — not a blocker to the design itself.

**Out of scope, by explicit instruction — flagged rather than designed around:**
- **Role-management UI.** No role picker, no "you are the Owner" badge or screen, no membership-management surface. Owner-ness is a structural fact this flow produces, never something Ana chooses or sees named — the Product Owner's own explicit instruction, held to on every screen below.
- **Invitations / SELLER-role onboarding — acceptance now designed (§2.0 / §2.2's case 0 / §2.2a / §3.9a–§3.9b / §3.10–§3.13a, reworked in full 2026-09-14 against RFC 0013's token-based model).** What *issuing* an Invitation does (`settings.md` §2.7, "Invitar a alguien") stays that document's own scope, unchanged. This document now owns the moment an `/invite/<token>` link is opened — resolving it, offering it, and, once she authenticates by any method, accepting it — not the invite-sending action itself, and no longer any implicit phone-match at OTP-confirm or session-resume (RFC 0013 §2 eliminates that discovery mechanism entirely).
- **Business onboarding redesign.** `onboarding.md`'s three paths are frozen; this document's terminal state for a first-time verification is the literal `onboarding.md §3.3` (cited, not redescribed).
- **Payments/checkout, bazaar recommendations** — non-goals per `company/CLAUDE.md`, unrelated to this surface anyway.
- **Logout / device / account-session management.** Not designed here. See `§11`.
- **How OTP delivery is technically simulated or implemented** (SMS/WhatsApp gateway, mock delay mechanism, real vs. fake code). Below this spec's abstraction level — the same treatment already given to the device file-picker in `onboarding.md` §2.2b and to "how the platform determines which device/account maps to which Business" in that document's own §0. This document specifies only the merchant-*visible* behavior (`§2.3`).
- **The User/Owner/Seller domain model itself** — not something `ux-designer` invents. Named explicitly as Architect Question Q17 (`§8`), not silently assumed.

## 1. Merchant goal

**Business objective:** answer "whose phone is this" once, honestly and with minimal friction, before any Business exists — the prerequisite gate now sitting in front of `onboarding.md`'s own first-impression moment. Its only job is to get out of the way, silently, for every future app open. This directly implements `company/business-decisions.md` Q14 (Resolved, Product Owner, 2026-08-12: phone + SMS/WhatsApp OTP, chosen explicitly over password/email precisely because "any registration-adjacent step over a few seconds competes with the next customer" — this project's own core thesis, `company/CLAUDE.md`).

**Acceptance criteria:**
- A valid Mexican mobile number reaches a verified state via a one-time code, with no password ever created, remembered, or reset.
- A phone verified for the very first time, anywhere, proceeds directly — no separate "create account" step, no name/photo capture (that's `onboarding.md` §3.9/§3.10's job, not this document's) — into `onboarding.md`'s existing fresh entry point, cited by canonical ID (`onboarding.md §3.3`).
- A device that already holds a verified session never sees this flow again, ever — the same "never ask twice" bar `onboarding.md`'s own D13 completion state already holds itself to.
- No screen, in any state, names "Owner," "Seller," "role," or shows anything resembling a picker between them.
- A person who opens a still-`pending`, not-yet-expired Invitation link is never silently routed into `onboarding.md`'s Business-creation flow — she's offered, once, plainly, the specific Business that invited her, before any authentication is required to even see the offer (`peek_invitation`, RFC 0013 §2), with an honest way to decline that costs her nothing regardless of whether she authenticates at all. **Reworked 2026-09-14, `product/99-rfc/0013-invitation-token-based.md`/`decision-log.md` D64** — discovery is now exclusively link-based (§2.0), superseding the former phone-match-at-verification/session-resume mechanism (formerly §2.2 case 0/§2.1, added 2026-09-06/07, `product-decisions.md` Q24/Q25). An Invitation is never auto-surfaced on an ordinary app open anymore — token-based discovery reaches every population that mechanism used to specifically target, identically, by construction.
- A first-ever-anywhere verification succeeding on a device that has previously held a session for a *different* phone number is confirmed once, plainly, showing the number back to her, before a new Business is ever created under it — closing a real defect (§10, §3.7e) where a mistyped digit silently became a brand-new, empty Business with no way back to her real one.
- **Added 2026-09-13, `decision-log.md` D62/D63:** a merchant may complete first-ever Owner-creation via Google Sign-In, or via Email + one-time code, with zero phone number ever requested or required, converging into the identical `onboarding.md §3.3` handoff the phone path already reaches. All three methods are presented as equally valid, equally prominent choices (§3.2a) — none framed as the default and the others as fallbacks.

**Scope boundary, stated explicitly per this folder's own §1 rule:** this is an access/identity gate, not a parallel onboarding. It captures exactly one fact — a verified phone number — and nothing else. It does not decide *what* she can do once verified (that's the domain model's job, flagged to Architect, `§8`) and does not decide *how* her business gets set up (that's `onboarding.md`'s job, frozen).

**The tension this design holds, mirroring `onboarding.md` §1's own framing:**
- Nothing here is time-critical the way Home's <3s bar is (`company/backlog.md` #1) — no customer is standing in front of her at this moment.
- But unlike `onboarding.md`, which is genuinely "once ever," this gate is the very *first* screen she can ever reach in the whole product — before she's even seen `onboarding.md §3.3`'s own warm welcome copy. A verification step that feels bureaucratic or intimidating here risks losing her before Nahui has said a single word to her. The standard: the minimum honest friction a real verification mechanism ever requires, then silence, permanently, on that device.
- **Added 2026-09-13.** Offering a genuine, equal-weight choice of method (§3.2a) costs one additional tap on every path, including the already-optimized phone path (§6's minimum-step-count table corrected accordingly, from 4 to 5). This is a deliberate, named trade against "the fastest interaction is the one that never happens" (`global-principles.md`) — accepted because the trigger for this activation (`decision-log.md` D62) is specifically that *not* offering a real choice was itself excluding some prospective merchants (those reluctant to register a phone number under the current government mobile-line policy). The extra tap buys the thing that's actually load-bearing here.

## 2. Resolution / decision logic

### 2.0 Invitation-link pre-auth resolution (new, RFC 0013 — checked before
every other check in §2)

Evaluated automatically, on every app open, before §2.1's device-session
check ever runs — the exact "before either a Business or a User is in
context" sequencing RFC 0013 §2 requires structurally, not a stylistic
preference.

```
1. Was this app instance opened via a URL of the shape /invite/<token>
   (exact routing mechanism below this document's abstraction level, the
   same treatment §0 already gives comparable platform questions)?
     → NO (the overwhelming majority of opens) → §2's own resolution logic
       runs entirely unaffected, starting at §2.1 step 0, exactly as this
       document already describes it. Nothing below this point in §2.0 is
       ever evaluated — confirmed explicitly, not assumed.
     → YES → continue to step 2.

2. Resolve the Invitation by token alone, with zero authentication of any
   kind (`peek_invitation(token)` — RFC 0013 §2 step 2's own described
   mechanism, not a name the RFC itself uses; `accept_invitation`/
   `peek_invitation` are this document's own snake_case citations of the
   real Postgres RPC layer, distinct from `domain-model.md`'s camelCase
   `acceptInvitation` invariant name — both refer to the identical write,
   cited at whichever layer is more precise for the point being made.
   `Invitation`'s own discoverability mechanism, `decision-log.md` D64).
   Shown as §3.9a
   (Resolviendo invitación) — shares §3.1/§3.2's own near-instant/slow
   convention, cited not redescribed (this folder's own §4 shared-state
   rule).
     → The read itself fails outright (network drop, platform error — the
       token's status was never actually determined) → §3.9b, Reintentar,
       replays this same read.
     → Resolves cleanly to `status = pending` and not past `expiresAt` (a
       read-time derivation, `settings.md §2.7a`) → continue to step 3.
     → Resolves cleanly to anything else — not found (zero rows), or a
       determinate `status` that isn't a live `pending` (already accepted,
       revoked, or expired) → §3.13a (Invitación ya no disponible). This
       document has no reliable way to distinguish these cases and
       shouldn't guess — the identical restraint §3.13a's own body text
       already states for its other entry point (step 5, below).

3. Show the offer (§3.10) — Business name and what accepting means, read
   from `peek_invitation`'s own response. Shown before any authentication
   has happened at all — no session is required to see it, per RFC 0013
   §2 step 3.

4. She taps "Aceptar y empezar a vender" or "Ahora no" (§3.10). Both
   branches test the device's own ordinary session state first (§2.1
   step 1's existing test, unchanged) — see §3.10's own behavior notes,
   below, for the full branch. **[Corrected 2026-09-15, RFC 0014/D70]**
   Accepting on a session-less device now routes directly into §3.2g
   (new) — a pre-filled, locked Email sub-flow, never the three-way
   §3.2a–§3.2f choice — carrying the token forward the same "carries
   whatever's already in progress across an interruption" mechanism §3.8
   already establishes for this document's other pre-auth state,
   generalized here to carry one additional piece of context (the
   token), not a new mechanism.

   **[Added 2026-09-14, closes `ux-critic` M1; range corrected
   2026-09-15, RFC 0014/D70 — this sub-flow no longer reaches
   §3.2a–§3.2f/§3.3; it reaches only §3.2g and whatever §3.2g itself
   reaches.]** This token's presence stays visible to her, not just to
   the system, for as long as she carries it: §3.2g (new) and every
   screen it reaches (§3.6/§3.6a/§3.6b, §3.7/§3.7a-d, §3.7e) each render
   one additional line acknowledging the commitment she just made —
   illustrated once, at §3.2g's own wireframe, reused verbatim at every
   other screen this sub-flow reaches rather than redrawn at each one,
   per this folder's own §4 shared-state citation rule.

   **[Added 2026-09-14, closes `ux-critic` M4.]** Two distinct guarantees
   carry this token, not one stretched to cover both. The pre-auth
   context established here is scoped to the *entire* §3.2a–§3.2f
   sub-flow for its whole in-app duration — covering an ordinary
   intra-flow detour with no interruption at all, e.g. cancelling
   Google's own consent screen and silently landing back at §3.2a
   (§3.2c) — for as long as she's anywhere inside that sub-flow. §3.8's
   own carries-across-an-interruption guarantee is a *separate*,
   additional one, covering the app itself being closed, backgrounded, or
   killed mid-flow. Losing the token on an ordinary in-flow detour, with
   no error surfaced, would silently strand her in `onboarding.md`'s
   ordinary Business-creation flow instead of joining Ropa Ana — the
   exact failure this sentence exists to rule out.
     → A valid session already exists — §2.1 step 1's ordinary test,
       including its own "with no §3.7e confirmation left pending"
       condition (§2.1 step 0) → the acceptance write runs immediately,
       no authentication detour at all → §2.2a directly. **[Amended
       2026-09-15, RFC 0014/D70]** This write may now return a fifth
       outcome, `invitation_identity_mismatch` — this is precisely the
       RFC's own named "already-authenticated-under-the-wrong-account"
       case, a device holding a valid session under a User whose own
       verified email doesn't match `targetHint` → §3.10f (see §2.2a's
       own corrected outcome list, below).
     → **[Added 2026-09-14, closes a `reviewer`-flagged spec-
       authorization gap from a Team Invitations Blocker fix — see
       `authentication.changelog.md#2026-09-14-mismatch-confirm-
       invitation-gap`.]** A credential already verified on this device,
       but §2.1 step 0's own confirmation still pending — i.e. this
       exact test's "with no §3.7e confirmation left pending" clause is
       what's failing, not the absence of any session at all → §3.7e
       itself (a second entry point, cited not redrawn — see §3.7e's own
       text, below), stacking this same Invitation-context line (this
       step's own M1 mechanism, above) on top of its already-approved
       copy — the identical composition that mechanism's own "§3.3–§3.7e,
       wherever this path reaches them" citation already anticipated.
         → "Sí, es mío/mía" → the just-confirmed `userId` is handed
           directly to §2.2a's acceptance write → §3.10a → the same five
           real outcomes apply, including the new
           `invitation_identity_mismatch` → §3.10f. Never
           `onboarding.md §3.3` — confirming whose credential this is and
           accepting the Invitation are two separate, simultaneously-true
           facts, not competing outcomes of the same tap.
         → "No, elegir otro" → reverts this credential's own unconfirmed
           verification (the identical mechanism ordinary §3.7e's own
           "No, elegir otro" already uses, §2.2 case 1 — not reinvented
           here) → **[Corrected 2026-09-15, RFC 0014/D70]** returns to
           §3.2g (Invitación — correo confirmado), never §3.2a's
           Invitation-context variant or §3.3/§3.2e — this path is
           Email-only now, with nothing typed to preserve, since there
           was never anything to type. The token survives this whole
           detour intact, the same "carries whatever is already in
           progress" guarantee this step already gives (above). A
           subsequent successful verification re-tests this same branch
           from the top.
     → No session at all exists (a genuinely fresh device, or this exact
       credential's verification was itself just reverted by the branch
       above) → **[Corrected 2026-09-15, RFC 0014/D70]** §3.2g
       (Invitación — correo confirmado, new), not §3.2a–§3.2f. The email
       is already known — `targetHint`'s own stored value — so there is
       nothing to choose between and nothing to type; she confirms and
       receives a code at that exact address. On a successful
       verification, checked FIRST against §2.2's new case 0 (a token
       carried from here) → §2.2a. Control returns to accepting the
       Invitation the instant a `userId` resolves — never to
       `onboarding.md §3.3` or any other ordinary post-auth landing, and
       never to §3.2a's own three-way choice at any point in this path.

5. See §2.2a for the write itself and its five real outcomes.
```

### 2.1 Whether Authentication shows at all (device-level check)

Evaluated automatically, before anything else, on every app open:

```
0. **[New, 2026-09-13 — closes a contradiction `ux-critic` caught while
   verifying the §2.1/§3.8 generalization fix: §3.8 claims §3.7e resumes
   correctly, but without this check, step 1 below would silently treat
   a bare successful verification as "valid session" and route straight
   past an unconfirmed §3.7e, defeating the exact safety gate it exists
   to enforce. Checked FIRST, before step 1, the same "outranks the
   ordinary branches" pattern §2.2's own step 0 already establishes for
   the Invitation check. The underlying fact this step reads is a plain
   local marker — below this document's abstraction level, the same
   treatment already given §2.2 case 1's device-history marker — set the moment §3.7e is shown
   and cleared the moment either of its buttons is tapped, not a domain-
   model concept requiring any Foundation representation.]** Did a
   credential verify successfully
   (§3.7/§3.2c), triggering §3.7e's device-history confirmation, without
   her yet tapping "Sí, es mío/mía" or "No, elegir otro"?
     → YES → resume directly to §3.7e, unconfirmed — never falls through
       to step 1's ordinary valid-session logic below, which would
       otherwise treat the bare verification as sufficient on its own.
     → NO → fall through to step 1, unchanged.

1. **[Generalized 2026-09-13 — `decision-log.md` D62/D63, see the
   amendment banner above.]** Does this device already hold a valid
   verified session — any linked `AuthIdentity` (phone, Google, or
   email), not phone specifically — **with no §3.7e confirmation left
   pending (step 0, above)**? (The storage/validity mechanism itself
   is left as an implementation detail — same posture `onboarding.md` §0
   already gives "how the platform determines which device/account maps
   to which Business.")
     → YES: **[Superseded 2026-09-14, RFC 0013/D64 — see
       `authentication.changelog.md#2026-09-14-rfc0013-token-invitation`.
       The 2026-09-07 sub-check formerly here, testing for a pending
       Invitation at session-resume, is removed outright, not merely
       relabeled — RFC 0013 §6 confirms Invitations are no longer
       discoverable via any implicit session/phone match at all, only by
       opening their own link (§2.0, above).]** Authentication is never
       shown — not even a flash of a phone/OTP screen. Control passes
       directly and silently to `onboarding.md`'s own resolution logic
       (`onboarding.md §2.1`), unchanged. Whether a complete Business
       exists, an incomplete one, or none yet is entirely that document's
       own question to resolve from here — this document has nothing
       further to say once a session is confirmed valid.

2. **[Generalized 2026-09-13 — `ux-critic`-caught gap: this step was left phone-specific while §3.2a/§4 moved on without it, closed.]** Was a phone number or email address typed, a code sent, or a Google sign-in started, but never confirmed/completed, before the app was closed, backgrounded, or killed?
     → YES: resume at the exact step, nothing re-typed or re-started (§3.8, its own covered range extended to match) — same discipline `onboarding.md §3.7` already applies to its own in-progress work.

3. **[Generalized 2026-09-13]** Neither (true first open, or a device with no persisted session at
   all)?
     → Show §3.2a, fresh — Elegir cómo entrar.

4. The check itself fails outright (can't determine session state)?
     → Fallback (§3.9), Reintentar.
```

### 2.2 What happens once a credential is verified — a four-way branch (generalized 2026-09-13, `decision-log.md` D62/D63 — see amendment banner)

This is the part `onboarding.md`'s own §0 explicitly left unmodeled, and the reason this document exists. Reached from any successful credential verification — a phone OTP confirm (§3.7), an email OTP confirm (§3.7, reached via §3.2e/§3.2f), or a returned Google sign-in (§3.2c). Whichever credential just verified, this branch resolves generically from here on: does the resulting `AuthIdentity.userId` correspond to a User who already holds a Business, a User with no Business yet, or no existing User at all (RFC 0012 §4's "AuthIdentity resolution invariant"). **Case 0, immediately below, no longer tests any Invitation field directly — RFC 0013/D64 moved discovery to §2.0, before authentication ever runs; case 0 here only tests whether this specific verification was in service of a token carried from there.**

```
0. [Checked FIRST, before 1–3 below — this ordering matters] Was this
   credential verification reached via §2.0's pre-auth Invitation flow —
   i.e., is there a token still held in this session's own pre-auth
   context (set at §2.0 step 4, above)?
     → YES → skip cases 1–3 entirely; proceed directly to §2.2a's
       acceptance write, using this now-resolved `userId`. Never
       `onboarding.md §3.3`'s ordinary Business-creation handoff —
       accepting an Invitation and creating a fresh Business are
       mutually exclusive outcomes of the identical moment (a first-ever
       verification), and the token's presence is what decides which one
       this credential's very first verification produces.
     → NO → fall through to cases 1–3 below, entirely unchanged from the
       Approved text — the ordinary, overwhelmingly common case of a
       credential verifying with no Invitation context at all.

1. **This credential has never been verified before, anywhere** (no
   existing `AuthIdentity` row for it — RFC 0012 §4 shape 1), and, per
   step 0 above, carries no matching pending Invitation?
     → First-verification branch. The moment `onboarding.md §3.5`'s own
       Business-creation write next succeeds (unchanged, that document's
       own mechanism, not redesigned here), Owner-ness is produced as a
       pure structural consequence of that write being the one write path
       capable of creating a Business at all, gated only on the acting
       User holding at least one verified `AuthIdentity`, of any type
       (`decision-log.md` D44, amended RFC 0012/D62) — never asked, never
       shown, never named on any screen this document or `onboarding.md`
       define.

       **[New check, 2026-09-07 — Slice 12 merchant-user-tester defect,
       see §8 item 16/§10. Generalized 2026-09-13, `decision-log.md`
       D62/D63.]** Before handing off, one more silent, local check: does
       this device remember a *different* verified identity having held a
       session on it before — any `AuthIdentity`, any type (phone, email,
       or Google), at any point, even long since signed out — whose
       resolved User differs from the User just confirmed? (A plain local
       marker, the same "below this document's abstraction level"
       treatment §2.1 step 0 already gives its own §3.7e-pending marker.
       Deliberately a *separate* device fact from the
       session itself: `settings.md §2.5`'s "Cerrar sesión" clears which
       identity currently holds a session, but never clears this marker —
       otherwise this exact check could never fire in the one situation
       it exists for.)
         → No such marker (a genuinely virgin device — the ordinary case
           for almost every real first-time merchant) → hands off
           directly to `onboarding.md §3.3` (Bienvenida + Elegir cómo
           empezar), cited verbatim — the identical fresh entry point a
           true first launch already reaches there. No interstitial
           "¡verificado!" screen (§10). This document's own job stops
           here, unchanged from its original text.
         → A different identity's marker is found → show §3.7e first,
           once (generalized 2026-09-13, see §3.7e below). "Sí, es
           mío/mía" hands off exactly as the branch above. "No, elegir
           otro" returns to whichever entry point she used — §3.3 (phone,
           number pre-filled) or §3.2e (email, value pre-filled), the
           identical destination and pre-fill behavior "← Cambiar número"
           (§3.6) already establishes, not a new escape-hatch shape; for
           Google, returns to §3.2a.

2. This credential was already verified on THIS device, with a Business
   already local to it (complete or in-progress)?
     → **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-case-2`]**
       Reachable. Hands off to `onboarding.md`'s own resolution logic
       (`onboarding.md §2.1`), unchanged — the identical silent
       pass-through case 1 above already describes for an unbroken
       session, reached this time via a fresh OTP confirmation instead of
       a persisted flag. A complete local Business resolves straight
       through to Home (`home.md §2`); one still in-progress resumes
       exactly where Onboarding left off (`onboarding.md §2.1` cases
       2–4). See `settings.md §2.5a` for the full reasoning.
     **New note (2026-09-06, `product-decisions.md` Q24/Q25):** if this
     phone also happens to hold a pending Invitation from a *different*
     Business at this same moment, this amendment does not design that
     intersection — it's the multi-Business-membership case Q24/Q25 item
     1 already names as real but undesigned (no Business-switching
     surface exists anywhere yet). The Invitation simply stays pending,
     undisturbed, reachable only once a future join surface can read it
     from this state. Flagged, not solved — see §8, item 6.

3. This credential verifies successfully on a device holding no local session,
   and it's already associated with an existing, already-onboarded
   Business elsewhere (a new device, a reinstalled app, or any case where
   verification succeeds but no local Business record exists to match
   it)?
     → Not yet resolved. See §8 — this branch's real destination depends
       on a genuine, unresolved question (does a Business belong to a
       device or to a verified identity) that isn't this document's to
       invent. Flagged, not designed around, per this folder's own §4
       rule for exactly this situation.
     **New note (2026-09-06, `product-decisions.md` Q24/Q25):** the
     identical multi-Business/pending-Invitation intersection noted in
     case 2 applies here too, for the same reason — not designed,
     flagged at §8 item 6.
```

**Why step 0 outranks 1–3 rather than sitting after them:** the common, expected case is a trusted helper or family member with no prior Nahui use at all — exactly case 1's territory. Checking the Invitation first means that phone never even briefly resolves toward Business-creation before being redirected; there's no flicker, no "wrong" screen shown and then corrected. *global-principles.md*, "never ask twice" — extended here to "never show her the wrong next step even momentarily."

### 2.2a Invitation-acceptance write & outcome resolution (rewritten,
RFC 0013 — supersedes the phone-keyed version in full)

Reached via: §2.0 step 4's own "valid session already exists" branch (the
acceptance write runs immediately, no authentication detour); or §2.2's
new case 0 (a credential just verified, in service of a token carried
from §2.0). Two entry points into one identical resolution — the same
two-entry-point shape the phone-keyed version already established, kept
here rather than reinvented.

```
1. Run the acceptance write: `accept_invitation(token, userId)` —
   atomically creates `BusinessMembership(userId, businessId,
   role=SELLER, status=active)` and flips `Invitation.status: pending →
   accepted`, conditioned on `status` still being `pending` at write time
   (a compare-and-swap — RFC 0013 §2 step 6, `decision-log.md` D64).
   Carries its own stable idempotency key (`architecture-principles.md`
   #7, D30) — a retried confirm must never risk a duplicate Membership or
   an ambiguous "did it already join" state, the identical guarantee this
   document's other genuine first-time-provisioning writes already carry
   (§3.7, §3.7d). Shown as §3.10a (Aceptando invitación), same
   near-instant/slow convention as every other write in this document.

2. **[Amended 2026-09-15, RFC 0014/D70 — a fifth real outcome is added]**
   Resolves into exactly one of five real outcomes, never a sixth,
   undefined one:
     → success → §3.10c (Invitación aceptada — bienvenida) → Ir a Hoy →
       `home.md §2`, now reading a real, active SELLER Membership for the
       first time.
     → **[New, RFC 0014/D70]** `invitation_identity_mismatch` — a
       defensive precondition, checked before the status CAS itself
       (RFC 0014's own server-side guarantee, "never trust the client
       alone to have locked the auth method correctly"): the
       authenticating User's own resolved, verified
       `AuthIdentity(type='email')` doesn't include a row matching
       `targetHint`'s value. Reached identically whether this write ran
       immediately off an already-valid session (§2.0 step 4's first
       branch), off a confirmed §3.7e gate (§2.0 step 4's second
       branch), or off a fresh verification through §3.2g (§2.0 step
       4's third branch) — this document doesn't distinguish which path
       produced it, the identical restraint §3.13a's own body text
       already states for its own two entry points. **Never
       `invitation_not_available`** — the Invitation itself is
       perfectly valid; it's this account that doesn't match it. →
       §3.10f.
     → `invitation_not_available` — a real race: the Invitation was
       still `pending` when the offer was shown (§2.0 steps 2–3), but was
       consumed, revoked, or expired by something or someone else before
       this write ran. → §3.13a (Invitación ya no disponible) — the
       identical shared state §2.0 step 2 already reaches when the same
       underlying fact is discovered earlier, at the peek stage. Reused,
       not redescribed, per this folder's own §4 shared-state rule — the
       fact is the same regardless of which checkpoint catches it.
     → `already_member` — this `userId` already holds an active
       `BusinessMembership` for this exact `businessId` (e.g., she
       already accepted this or another still-live Invitation to this
       same Business through a separate attempt). Not an error — the
       fact it states is unambiguously true and good. → §3.10d.
     → `membership_revoked` — this `userId` already holds a `revoked`
       `BusinessMembership` for this exact `businessId` (an OWNER removed
       her before; this write deliberately does not silently reactivate
       that — reactivating a deliberately revoked Membership stays the
       OWNER's own decision, the same restraint `settings.md §3.11`
       already holds itself to for a revoked row). → §3.10e.
     → the write itself fails outright (genuine platform/network
       error — none of the above was actually determined) → §3.10b,
       Reintentar, replays the same write under the same idempotency key.

   **Backward compatibility, stated once here rather than at every
   citation (RFC 0014's own rule).** A `pending` Invitation with
   `targetHint = null` — a legacy row, created before this check shipped
   — never produces `invitation_identity_mismatch`: the check is
   null-guarded, not a hard-fail-everything migration. Nothing about
   this write's other four outcomes changes for such a row.

3. Declining was already resolved before this point (§2.0/§3.10's own
   "Ahora no" branch) — nothing in this section handles declining; §2.2a
   is reached only once she's already committed to accepting.

4. **Eliminated, not carried forward, from the phone-keyed version:** the
   multi-pending-Invitation tie-break (recency-based) and the per-device
   decline-memory marker. A token always identifies exactly one
   Invitation — there is no ambiguity left to tie-break. An Invitation is
   now only ever seen by explicitly opening its own link (§2.0), never
   auto-resurfaced on an ordinary app open the way phone-matching used to
   — so nothing needs remembering after a decline. RFC 0013 §2's own
   reasoning, not a new `ux-designer` addition.
```

### 2.3 Merchant-visible behavior around simulated OTP delivery

This document doesn't specify how a code is technically generated or delivered (§0). What it does specify: the copy on §3.6 states plainly that a code was sent to her number, without naming a delivery channel ("Te mandamos un código a tu número," never "por SMS" or "por WhatsApp") — deliberate, since `business-decisions.md` Q14 resolved *that* an OTP mechanism is used, not *which* channel(s) ship, and naming a specific channel here would be a technical commitment this Low-Fidelity document has no basis to make. It also never implies a delivery-time guarantee a mock environment can't honor ("revisa en un segundo," "ya casi llega") — the resend cooldown (§3.6) is the only timing promise this document makes, and it's a promise about *when she may ask again*, not about when delivery actually happens.

## 3. Low-fidelity wireframes

Conventions inherited from the rest of this family: `[ ]` = tappable, plain text = passive/informational. No persistent bottom nav bar on any screen in this section — same reasoning `onboarding.md`'s own §3 preamble gives, even more so: not even a Business exists yet at this point.

### 3.1 Resolving (near-instant)
```
┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │  skeleton shape, no text, no spinner
│        ▢▢▢▢▢▢▢▢▢▢              │
└───────────────────────────────┘
```
Identical silent-skeleton convention to every other tab's own §3.1. *global-principles.md*, "technology should disappear."

### 3.2 Resolving — slow (>~1.5s)
```
┌───────────────────────────────┐
│         Un momento…            │
└───────────────────────────────┘
```

### 3.2a Elegir cómo entrar (new, 2026-09-13 — true first-run entry point, `decision-log.md` D62/D63)

Ordinary entry (no Invitation token carried into this screen):
```
┌───────────────────────────────┐
│                                │
│           Nahui                 │
│                                │
│  Para empezar, elige cómo        │
│  quieres entrar.                  │
│                                │
│  [   Continuar con Google      ] │
│  [   Continuar con correo      ] │
│  [   Continuar con número        │
│       celular                  ] │
│                                │
└───────────────────────────────┘
```

**[Added 2026-09-14, closes `ux-critic` M1.]** Reached carrying a pre-auth Invitation token (§2.0 step 4's "no session exists" branch):
```
┌───────────────────────────────┐
│                                │
│           Nahui                 │
│                                │
│  Para aceptar la invitación de   │
│  Ropa Ana                          │
│                                │
│  Elige cómo quieres entrar.       │
│                                │
│  [   Continuar con Google      ] │
│  [   Continuar con correo      ] │
│  [   Continuar con número        │
│       celular                  ] │
│                                │
└───────────────────────────────┘
```

**Retired 2026-09-15, RFC 0014/D70 — marked superseded, not deleted, per this document's own non-deletion discipline.** Nothing routes into this variant any longer: §2.0 step 4/§3.10's own "no session" branch now goes directly to §3.2g (new) instead of here, since RFC 0014 requires the Invitation-acceptance path to authenticate specifically through Email, never through a three-way choice that includes Google or phone. The ordinary (context-less) render of §3.2a immediately above is completely unaffected — every other entry point into this document still reaches it exactly as designed.

- No back arrow — this is now the one screen in the whole product with nowhere to return to, the claim §3.3 previously made for itself and now inherits from this screen instead. **Caveat, added 2026-09-14 (closes `ux-critic` M2):** true only for this screen's ordinary, ambient entry point (a fresh device, no prior context). It does not hold when reached via §2.0 step 4's Invitation-offer path, where §3.10's own offer screen legitimately precedes it — a deliberate, accepted asymmetry for that one entry point, stated here explicitly rather than left as an uncaveated, now-inaccurate absolute. Not a functional dead end either way: she can always simply leave the app.
- All three options are the same visual weight — bracketed, same size, stacked — deliberately not primary/secondary/tertiary the way `onboarding.md §3.3`'s three paths are. *global-principles.md*, "business language before technical language": no raw method-type picker ("Teléfono / Google / Email" as bare labels) — each option is phrased as the actual action she takes ("Continuar con...").
- **Order (Google, Correo, Número celular) is a stated judgment call, not a priority ranking.** Google is listed first because it's genuinely the lowest-friction of the three when she's already signed into a Google account on her device (zero typing at all); phone is listed last, not because it's lesser, but because the exact motivating trigger for this activation (`decision-log.md` D62 — some prospective merchants are reluctant to register a phone number at all under the current government policy) means a phone-reluctant merchant shouldn't have to visually pass it first. Not asserted as validated — worth revisiting once real merchant reaction exists (Hypothesis-tagged, `tone-of-voice.md`'s own posture toward untested register choices).
- Copy never names "OTP," "AuthIdentity," "credential," or "provider" — "correo," "número celular," "Google" (a proper noun she already knows, not a technical concept) are the only words used.
- **[Added 2026-09-14, closes `ux-critic` M1.]** The Invitation-context variant's added line ("Para aceptar la invitación de [Business.name]") replaces "Para empezar," never stacks alongside it — the same `Business.name` variable §3.10's own offer copy already fills, reused rather than reworded. This same line — as the first line of body content on the screen, stacked above whatever else that screen already shows, never replacing any of its own existing copy — renders identically at every other screen §2.0's token-carrying context reaches: §3.2b–§3.2f, §3.3–§3.7d, §3.7e alike, for the whole duration described at §2.0 step 4. Illustrated once, here; reused verbatim at every other screen, per this folder's own §4 shared-state citation rule — one line of context copy threaded through screens this document already designs, not a new screen family. Disappears the moment §2.2a's own acceptance write runs — §3.10a onward already names Ropa Ana explicitly in its own copy, so nothing further is needed there.

**Behavior:** "Continuar con número celular" → §3.3 (unchanged content, amended entry point). "Continuar con correo" → §3.2e. "Continuar con Google" → §3.2b.

### 3.2b Continuando con Google — near-instant / slow (new)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Un momento…                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
Reached the instant she taps "Continuar con Google" (§3.2a). Hands off to Google's own account-picker/consent UI — Google's own surface, below this document's abstraction level, the same treatment `onboarding.md §2.2b` already gives the OS-level device file-picker. Same near-instant/slow convention as every other transition in this document.

### 3.2c Verificando con Google — near-instant / slow (new)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Confirmando…               │
└───────────────────────────────┘        └───────────────────────────────┘
```
Reached the moment control returns to Nahui from Google's UI, whatever she did there. Resolves into exactly one of: success (converges directly into §2.2's generalized four-way branch, reading `AuthIdentity(type=google, identifier=<Google's stable subject id>)`) or §3.2d (genuine error only). Carries the identical idempotency-key guarantee §3.7 already gives its own confirm action (`architecture-principles.md` #7) — a retried resolve must never risk a duplicate `User`/`AuthIdentity` if the original callback actually succeeded server-side and only the confirmation was lost.

**A deliberate, stated distinction — cancellation is not an error.** If she backs out of, denies, or dismisses Google's own consent screen, control returns here to find nothing to resolve — treated as a deliberate choice she made, not a failure, and routes silently back to §3.2a with no message at all. The identical posture `onboarding.md §3.4`'s "Mejor quiero empezar gratis" already takes toward a reversible mid-flow change of mind, applied here to an external cancellation instead of an in-app one. How "she cancelled" is technically distinguished from "Google returned a genuine error" is below this document's abstraction level (the same treatment §2.3 already gives OTP delivery mechanics) — only the two different merchant-visible outcomes matter here. **[Added 2026-09-14, closes `ux-critic` M4.]** If this attempt carries a pre-auth Invitation token (§2.0 step 4), that token survives this silent return to §3.2a fully intact — the pre-auth context §2.0 step 4 establishes is scoped to the whole §3.2a–§3.2f sub-flow for its entire in-app duration, a separate, additional guarantee from §3.8's own app-closed/backgrounded/killed interruption-resume mechanism. §3.2a re-renders showing its own Invitation-context variant (§3.2a, above) exactly as before — never silently dropping her into the screen's ordinary, context-less form.

### 3.2d Google — no se pudo continuar (new, genuine platform error only)
```
┌───────────────────────────────┐
│  No pudimos continuar con        │
│  Google. Intenta de nuevo o       │
│  elige otra forma de entrar.      │
│      [   Reintentar   ]          │
│      [   Elegir otra forma   ]    │
└───────────────────────────────┘
```
Reached only on a genuine send/confirm failure (network drop, a real error Google's own callback reports) — never for a plain cancellation (§3.2c). "Reintentar" replays §3.2b under the same idempotency-key guarantee. "Elegir otra forma" returns to §3.2a — never a dead end (`global-principles.md`), the same honest escape every other error state in this document already gives.

### 3.2e Correo electrónico — entry (new)
```
┌───────────────────────────────┐
│ ← Elegir cómo entrar             │
│                                │
│  Para empezar, dinos tu           │
│  correo.                          │
│                                │
│ Correo electrónico                │
│  [ __________________ ]           │
│                                │
│  [      Enviar código      ]     │  disabled until it looks like a real email
│                                │
└───────────────────────────────┘
```
- "Enviar código" disabled until the typed value has a minimally plausible email shape — at least one character before "@", an "@", at least one character between it and a final ".", and at least one character after that "." (a deliberately loose structural check, not full validation — the same posture §3.4's ten-digit phone gate takes: catch the obviously-incomplete case, real delivery/verification catches the rest). Same "required, no default, disabled-until-valid" convention every other required field in this family uses.
- Not auto-submitted the instant it looks valid, same reasoning §3.3 already states for the phone field: sending a code is a real action with a real consequence.
- "← Elegir cómo entrar" returns to §3.2a, typed value preserved for the same session, identical courtesy §3.3's own back arrow (below) gives.

### 3.2f Correo electrónico — formato inválido (inline, new)
```
Correo electrónico
 [ ana@correo         ]
 Verifica tu correo — parece que le falta algo.
[      Enviar código      ]   (disabled)
```
Reached on a paste producing a value that satisfies the loose "@ plus something" shape but fails the fuller structural check above (e.g., nothing after a trailing "."). Unlike §3.4/§3.6b's phone/code equivalents, this state is not strictly paste-only, since email validity has no fixed length the way a 10-digit phone or a 6-digit code does — a genuinely typed value could momentarily satisfy then fail the check as she edits. Non-blocking, corrects in place, same as every other formato-inválido state in this family.

**Behavior from here:** Enviar código → shares §3.5/§3.5a ("Enviando código," near-instant/slow, and its error state) — cited, not redescribed, per this folder's own §4 shared-state rule. Success → shares §3.6/§3.6a/§3.6b ("Ingresa el código"), generalized below. → Confirmar → shares §3.7/§3.7a–§3.7d ("Verificando código"), unchanged, already channel-neutral copy.

### 3.2g Invitación — correo confirmado (new, RFC 0014/D70 — reached only via the Invitation-acceptance path; never `§3.2a`'s ordinary three-way choice)
```
┌───────────────────────────────┐
│                                │
│  Para aceptar la invitación de   │
│  Ropa Ana                          │
│                                │
│  Te vamos a mandar un código a el  │
│  correo con el que te invitaron:    │
│                                │
│      ana@correo.com                │
│                                │
│  [   Enviar código   ]             │
│  [   Ahora no   ]                   │
│                                │
│  ¿No es tu correo? Dile a quien te  │
│  invitó que lo corrija.             │
│                                │
└───────────────────────────────┘
```
Reached the instant she taps "Aceptar y empezar a vender" on §3.10's offer, when no session already exists (§2.0 step 4's third branch) or when a reverted §3.7e confirmation returns her to authenticate again (§2.0 step 4's second branch, "No, elegir otro"). Replaces the ordinary "→ §3.2a–§3.2f" routing every other entry point into this document still uses. **This screen is the one and only entry point into authentication for an Invitation-acceptance attempt** — §3.2a's own three-way method choice never renders here at all, since RFC 0014 requires the *method*, not just the value, to be fixed to Email (Google's own `AuthIdentity` never captures a real email to check against `targetHint`, `decision-log.md` D70's own reasoning).

- The email shown is `targetHint`'s own stored value, read directly from the same `peek_invitation` response §3.9a already resolved — never typed, never editable on this screen. Reuses the identical "reflect a known fact back to her, plainly, before committing" shape §3.7e already establishes for a different situation, composed with the same Invitation-context line (§2.0 step 4's own M1 mechanism) rendered as the first line of body content here, exactly as it renders on every other screen this now-narrower sub-flow reaches.
- **"Enviar código" is the one real committing tap** — reuses §3.5's own send action verbatim (`Enviando código`, near-instant/slow, §3.5/§3.5a), which is already channel-neutral (parametrized on "número / correo") and needs no change to accept this new entry point.
- **"Ahora no" costs nothing** — the same zero-cost decline §3.10's own "Ahora no" already establishes. The device session state test is identical to §3.10's own "Ahora no" behavior (below) — she was never asked to authenticate for this, and isn't now either.
- **"¿No es tu correo? Dile a quien te invitó que lo corrija." — the honest answer to the one real, still-possible failure mode this design leaves open: the OWNER herself typo'd or mis-set the address.** Stated plainly, not alarmingly, per `tone-of-voice.md`'s "state facts before offering an opinion" — she can't fix this herself (the field is locked by design, RFC 0014's whole point), so the honest move is telling her who can (`settings.md §3.12`'s new "Editar correo" repair path, cited not redescribed).
- No format-validation state exists on this screen — nothing typed, nothing to mistype. If `targetHint`'s own stored value genuinely can't receive a code (a real send failure), that surfaces at §3.5a exactly as it already does for any other "Enviar código" attempt — no new error state needed.

**Behavior, "Enviar código":** shares §3.5/§3.5a verbatim → success → shares §3.6/§3.6a/§3.6b ("Ingresa el código," already parametrized to show "ana@correo.com" — nothing new needed there) → Confirmar → shares §3.7/§3.7a-d verbatim → success → checked FIRST against §2.2's case 0 (token carried) → §2.2a directly (§3.10a → one of five outcomes, including the new `invitation_identity_mismatch` → §3.10f).

**Behavior, "Ahora no":** identical device-session test to §3.10's own "Ahora no" (§2.0 step 4). No session exists here by construction (this screen is only ever reached on a no-session or reverted-confirmation branch), so this always routes to §3.2a, fresh, ordinary entry, no Invitation context — she was never asked to authenticate for this, and declining costs nothing further.

**§3.6's own escape hatch is parametrized a third way for this path.** "← Cambiar [número / correo]" would be wrong here — there's nothing to change, the field is locked by design. For this path specifically, that line reads "← Atrás" and returns to §3.2g, not to an editable entry screen — the only real "change" available from here is declining ("Ahora no," already on §3.2g itself).
- `§3.5`'s own citation, "reached via: phone flow — §3.3's Enviar código; or email flow — §3.2e/§3.2f's Enviar código," gains a third citation: "or the Invitation-locked email flow — §3.2g's Enviar código."
- `§3.6`'s own citation gains the identical third citation.
- `§3.8`'s own resumability range ("§3.2a–§3.2f, §3.3–§3.7e") extends to include §3.2g — an interruption after "Enviar código" but before "Confirmar" on this screen resumes exactly where she left it, the same guarantee every other in-progress screen in this document already carries.

### 3.3 Número celular — entry
```
┌───────────────────────────────┐
│ ← Elegir cómo entrar             │
│                                │
│  Para empezar, dinos tu          │
│  número celular.                  │
│                                │
│ Número celular                   │
│  +52  [ __________ ]             │
│                                │
│  [      Enviar código      ]     │  disabled until 10 digits
│                                │
└───────────────────────────────┘
```
- **[Amended 2026-09-13]** Gains a back arrow, "← Elegir cómo entrar," returning to §3.2a — this is no longer the first screen in the product; §3.2a is. Not a persisted resume state (that's still §3.8's job) — simply doesn't clear a partially-typed number if she taps back into this screen within the same session, the same "don't discard typed-but-unsent input" courtesy every other escape hatch in this family already gives (§3.6's "← Cambiar número").
- "+52" shown as fixed context, never typed — she gives her number the way she already gives it out to anyone; *global-principles.md*, "business language before technical language."
- "Enviar código" disabled until exactly 10 numeric digits are entered — the same required-no-default, disabled-until-valid convention every other required field in this family uses (`onboarding.md §3.5b`'s Producto+Precio gate, `§3.9`'s Nombre gate). **Deliberately not auto-submitted** the instant the 10th digit lands — sending a code is a real action with a real consequence (a message actually goes out), the identical reasoning `onboarding.md §6` already gives for keeping "Confirmar y activar" an explicit tap even though nothing is typed there: "the extra tap protects a real commitment from a stray tap."

### 3.4 Número celular — formato inválido (inline)
Reached only if a paste or similar produces a superficially-complete value containing non-numeric characters — not reachable through ordinary typing, since the button stays disabled until the field is exactly 10 digits.
```
Número celular
 +52  [ 55abc12345       ]
 Verifica tu número — solo dígitos, a 10 números.
[      Enviar código      ]   (disabled)
```
Non-blocking, corrects in place — nothing was ever submitted, so nothing "failed" from her side.

### 3.5 Enviando código — near-instant / slow (reached via: phone flow — §3.3's Enviar código; email flow — §3.2e/§3.2f's Enviar código; or the Invitation-locked email flow — §3.2g's Enviar código, added 2026-09-15, RFC 0014/D70)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Un momento…                │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
The one write-like action in this half of the flow: requests a code be generated and delivered. Same near-instant/slow convention as every other write action in this family. Carries the same stable idempotency-key guarantee every retryable write in this project carries (`architecture-principles.md` #7, `decision-log.md` D30) — a retried send attempt must never risk sending (or being billed for) two codes for one tap.

### 3.5a Enviando código — error
```
┌───────────────────────────────┐
│  No pudimos enviar tu código.    │
│  Intenta de nuevo.                │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Su typed number isn't lost — same guarantee every retry state in this family already gives.

### 3.6 Ingresa el código — entry (code sent) (reached via: phone flow §3.3; email flow §3.2e/§3.2f; or the Invitation-locked email flow §3.2g, added 2026-09-15, RFC 0014/D70 — shared state, this document's own §4 rule)
```
┌───────────────────────────────┐
│ ← Cambiar [número / correo]      │
│                                │
│  Ingresa el código                │
│  Te mandamos un código a tu       │
│  [número / correo], [+52 55 1234  │
│  5678 / ana@correo.com].          │
│                                │
│ Código                          │
│  [ ______ ]                      │
│                                │
│  [       Confirmar       ]       │  disabled until 6 digits
│                                │
│  ¿No te llegó? Reenviar en 0:30   │  countdown, plain text, not tappable
│                                │
└───────────────────────────────┘
```
- **[Amended 2026-09-13]** The destination line and escape hatch are parametrized: the bracketed pair resolves to whichever channel she actually used — never both, never a generic "identifier" word. **"← Cambiar [número / correo]"** — a real, always-available escape hatch, returns to §3.3 (phone) or §3.2e (email) with her value pre-filled, never a dead end (`global-principles.md`). Same posture `onboarding.md §3.4`'s "Mejor quiero empezar gratis" already establishes.
- **Assumed: 6-digit code.** Stated plainly as a judgment call, not derived from anywhere in the Foundation (there is none to derive it from).
- **Assumed: 30-second resend cooldown.** Also a plain judgment call — long enough to discourage abuse of the send mechanism, short enough that it never reads as a punitive wait for a merchant who genuinely didn't receive anything.
- Countdown is plain text, not bracketed, per the `[ ]`-vs-plain-text convention already established throughout this family (tappable = brackets).

### 3.6a Ingresa el código — reenvío disponible (reached via: phone or email flow)
Same screen as §3.6, once the cooldown elapses — not a distinct destination, the identical relationship `onboarding.md §3.9/§3.9a` already have to each other.
```
  ¿No te llegó?  [ Reenviar código ]
```
Tapping it replays §3.5's send action (same idempotency guarantee), returns to §3.6 with the cooldown restarted, and shows a brief, self-dismissing ambient confirmation — "Código reenviado" — reusing the identical ambient-confirmation pattern `home.md §3.8e` already established for "Venta finalizada ✓," rather than inventing a new one.

### 3.6b Código — formato inválido (inline) (reached via: phone or email flow)
Reached whenever a paste or similar places non-numeric characters into the Código field — most plausibly, per this flow's own channel (§2.3), pasting the entire delivered message ("Tu código de Nahui es: 123456") rather than just the code itself. Not reachable through ordinary typing, since "Confirmar" stays disabled until the field holds exactly 6 digits — the identical shape §3.4 already handles for the phone field.
```
Código
 [ Tu código de Nahui es... ]
 Verifica tu código — solo dígitos, a 6 números.
[       Confirmar       ]   (disabled)
```
Non-blocking, corrects in place — nothing was ever submitted, so nothing "failed" from her side. Same treatment as §3.4's equivalent state for the phone field.

### 3.7 Verificando código — near-instant / slow (reached via: phone or email flow)
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │      Confirmando…               │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
The one write-like action that actually resolves whether the code was right, expired, or exhausted — triggered by "Confirmar." Carries the identical idempotency-key guarantee §3.5 does (`architecture-principles.md` #7, D30) — this is the single action in this whole document with a genuine downstream consequence for a first-time phone (it's what makes proceeding into `onboarding.md §3.3` possible), so a retried confirm attempt must never risk a duplicated or ambiguous outcome.

Resolves into exactly one of §3.7a–§3.7d below, or — on success — the handoff branch (§2.2/§4). Never a fifth, undefined outcome.

### 3.7a Verificando código — código incorrecto (reached via: phone or email flow)
Same screen as §3.6/§3.6a, re-rendered with the code field cleared (nothing worth preserving in a wrong guess) and an inline message:
```
Código
 [ ______ ]
 Ese código no es correcto. Intenta de nuevo.
[       Confirmar       ]   (disabled until 6 digits again)
```
No attempt counter shown anywhere on screen — deliberately. Surfacing a raw "3 de 5 intentos" style count would read as pressure this moment doesn't need; the fact only becomes relevant, and is stated plainly, once the limit is actually reached (§3.7c). *brand/tone-of-voice.md*, "state facts before offering an opinion" — extended here to mean stating the *relevant* fact at the moment it's true, not manufacturing anxiety ahead of it.

### 3.7b Verificando código — código expirado (reached via: phone or email flow)
```
Código
 [ ______ ]
 Este código ya venció.
[   Reenviar código   ]
```
**Assumed: 5-minute code validity window**, another plain judgment call. "Confirmar" is replaced entirely by "Reenviar código" — there's nothing left worth letting her retry against. Resend here is available immediately, regardless of §3.6's own cooldown state — a deliberate exception: the code is already dead through no further fault of hers, so forcing an additional wait on top of that would be pure friction with no anti-abuse purpose left to serve.

### 3.7c Verificando código — demasiados intentos (reached via: phone or email flow)
Reached after **5 incorrect attempts on the same code**, stated explicitly as the chosen bound — a plain judgment call, not derived from the Foundation.
```
┌───────────────────────────────┐
│ ← Cambiar número                 │
│                                │
│  Ingresa el código                │
│                                │
│  Después de varios intentos,      │
│  este código ya no es válido.     │
│  Pide uno nuevo y con gusto        │
│  lo confirmamos.                  │
│                                │
│  [   Reenviar código   ]         │
│                                │
└───────────────────────────────┘
```
**Deliberadamente a soft, code-level invalidation — never a hard account or device lockout.** Resend is available immediately, no waiting period beyond it. This is a real, considered design choice, not an oversight: a full lockout after a handful of wrong guesses would be the kind of "bureaucratic, intimidating" moment `brand/brand-guide.md`'s tone explicitly warns against, at the exact first moment she's forming an impression of the product. The copy states what happened plainly, offers the fix in the same breath, and never frames the situation as something she did wrong (`brand/tone-of-voice.md`, "never imply a merchant needed rescuing," extended here to "never imply she needs correcting").

**Copy revised per `brand-guardian` consultation (2026-08-13).** The original draft — "Ya intentaste varias veces con este código, así que dejó de ser válido" — made *her* the grammatical subject of the failure clause and used a causal "así que," reading as a tally of her attempts being reported back to her rather than a system-state fact, breaking from this document family's own established pattern (`tone-of-voice.md`'s "no pudimos guardar" precedent, where the system, not the merchant, is always the subject of what-went-wrong). Revised to make "este código" the subject instead, dropping the causal "así que" — same information (she still learns why, per `character-bible.md`'s "tells the truth about what it does and doesn't know yet"), same soft-invalidation behavior, same two-beat fact-then-path-forward shape as every other error state in this family. `brand-guardian` also flagged this register as `tone-of-voice.md`-Hypothesis-tagged, not yet validated against a real merchant reaction — worth a real check once this ships, not a blocker now.

### 3.7d Verificando código — error de plataforma (reached via: phone or email flow)
Distinct from a wrong code — this is a genuine send/confirm failure (network drop, platform error) where the code's correctness was never actually determined.
```
┌───────────────────────────────┐
│  No pudimos confirmar tu código. │
│  Sigue aquí, intenta de nuevo.    │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Her typed code isn't lost. Retrying replays the same confirm attempt under the same idempotency key (§3.7's own guarantee) — critical here specifically, since this is the one ambiguous-outcome case `architecture-principles.md` #7 exists for: if the original attempt actually succeeded server-side and only the confirmation was lost, a blind retry must never risk a second, duplicate provisioning consequence for a first-time phone.

### 3.7e Verificando código / Google — éxito, pero este dispositivo guarda otra identidad (generalized 2026-09-13 — originally "éxito, pero este teléfono guarda otro número," Slice 12 defect fix, 2026-09-07)

Reached only from §2.2 case 1's new check above: a genuinely
first-time-anywhere credential just verified successfully — phone, email,
or Google alike — on a device that remembers a *different* identity
having held a session on it before (including via a completed
`settings.md §2.5` "Cerrar sesión"). Not reached by an ordinary
first-ever verification on a device with no such history — the common
case stays exactly as fast as it already was.

**Second entry point, added 2026-09-14 — closes a spec-authorization gap from a Team Invitations Blocker fix.** Also reached from §2.0 step 4's own third branch: a device already holding a verified credential that sits on this exact unconfirmed gate, discovered the instant she taps "Aceptar y empezar a vender" on a pre-auth Invitation offer (§3.10). Same screen, same copy, same two buttons — only "No, elegir otro"'s destination differs at this entry point (§2.0 step 4's own text, not restated here), since there's an Invitation-carrying authentication sub-flow to return to instead of the ordinary one. Renders the Invitation-context line (§2.0 step 4's own M1 mechanism) stacked on top — the identical composition that mechanism's own "§3.3–§3.7e, wherever this path reaches them" citation already anticipated, not a new copy instance.

```
┌───────────────────────────────┐
│           Nahui                 │
│                                │
│  [Este número / Este correo /      │
│  Esta cuenta de Google] todavía no  │
│  tiene un negocio en Nahui:         │
│                                │
│      [ +52 55 1234 5678 /          │
│        ana@correo.com /            │
│        ana@gmail.com ]             │
│                                │
│  Si es tuyo, seguimos y            │
│  empezamos tu negocio aquí.        │
│                                │
│  [   Sí, es mío/mía   ]          │
│  [   No, elegir otro   ]          │
│                                │
└───────────────────────────────┘
```

- **The demonstrative agrees in gender with the noun, not left as a bare bracket-substitution ("Este número / Este correo / Esta cuenta de Google," never "Este cuenta de Google") — corrected 2026-09-13, `ux-critic`-caught, traced back to this wireframe's own original text rather than something `ui-designer` introduced independently in code.** "Cuenta" is feminine; the original `[número / correo / cuenta de Google]` single-demonstrative pattern only ever produced correct Spanish for the two masculine nouns it was written against, since Google wasn't yet a live path when §3.7e was first drafted — the gender mismatch was real from the moment Google's branch became reachable, not a new defect introduced by generalizing this screen.
- The identifier is shown back to her, plainly — for phone/email, in the
  same "reflect what she typed" shape §3.6's "Te mandamos un código a..."
  already establishes, the actual mechanism that catches a mistyped
  digit; for Google, no typing occurred, so this reflects the resolved
  value back to her instead, the same underlying confirm-before-commit
  purpose, not the identical mechanism. **For Google specifically**, this
  is whatever human-readable label Google's own callback returns for
  that account (typically an associated email) — display-only,
  deliberately never the actual stored `AuthIdentity.identifier` value for
  `type=google`, which RFC 0012 §1 keeps as the provider's opaque stable
  subject ID, not this display value. Below this document's own
  abstraction level to specify further, the same posture §2.3 already
  gives OTP delivery mechanics.
- No new tone invented: states the fact (no Business exists yet under
  this identity) before anything else, per `tone-of-voice.md`'s "state
  facts before offering an opinion" — the identical discipline this
  document already holds every other screen to (§9).
- "Sí, es mío/mía" (gender-neutral form, since this screen no longer only
  ever refers to a "número") — the one real confirming tap a genuine
  new-Business commitment gets, the same standard §3.10's "Aceptar y
  empezar a vender" and §3.3's "Enviar código" already hold themselves to
  ("a real commitment costs one deliberate tap, never zero, never two" —
  `onboarding.md §6`).
- "No, elegir otro" (renamed from "No, corregir número," since Google has
  nothing to "correct") — costs nothing beyond the tap; returns to §3.2a
  for Google, or to §3.3/§3.2e (typed value preserved) for phone/email —
  the identical destination and pre-fill behavior §3.6's "← Cambiar
  [número / correo]" already establishes, not a new escape-hatch shape.
- No loading state of its own: the underlying write (provisioning a
  User/verified credential) already completed at §3.7/§3.2c; this screen
  is a pure local read-and-confirm gate before `onboarding.md`'s own
  write path (§3.5 there) ever runs.

### 3.8 Retomar autenticación interrumpida
No new wireframe — reaching any screen in §3.2a–§3.2f, §3.3–§3.7e a second time (after the app was closed, backgrounded, or crashed mid-flow) renders it pixel-identical, with whatever she'd already typed or started (her phone number or email, a partially-typed code, an in-progress Google redirect) still present. **[Range extended 2026-09-13 — `ux-critic`-caught gap: the original range, "§3.3–§3.7d," predated the Google/email screens and left no defined resume path for a background/kill mid-Google-redirect or mid-email-entry, closed.]** For the Google flow specifically (§3.2b/§3.2c), "resume" means re-attempting the redirect/callback resolution, not literally replaying stale external UI state — the same "below this document's abstraction level" treatment §2.3 already gives OTP delivery mechanics. The one exception to "pixel-identical" otherwise: §3.6's resend countdown is recomputed from real elapsed time on resume, not frozen at its pre-interruption value or reset to a fresh 0:30 — the number changes, nothing else about the screen does. Same guarantee `onboarding.md §3.7`/`home.md §3.13`/`inventory.md §3.7` already make for their own in-progress work. *global-principles.md*, "never ask twice." Never restarts from §3.2a once she's made real progress past it. **Extended 2026-09-14, RFC 0013** — the same mechanism also carries a pre-auth Invitation token (§2.0 step 4) across an interruption during §3.2a–§3.2f, generalized here to one additional piece of context, not a new mechanism. **Range further extended 2026-09-15, RFC 0014/D70** — the Invitation-acceptance path now reaches §3.2g (new), not §3.2a–§3.2f; this resumability guarantee extends to it identically: an interruption after "Enviar código" but before "Confirmar" on §3.2g resumes exactly where she left it.

### 3.9 Falla defensiva — no se pudo determinar el estado inicial
```
┌───────────────────────────────┐
│  No pudimos cargar Nahui.        │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Covers §2.1's own device-session check failing outright. Manual "Reintentar," same convention as `onboarding.md §3.8`/`inventory.md §3.18`/`events.md §3.18`/`reports.md §3.14` — no live-customer risk at this moment to justify a heavier auto-retry mechanism.

### 3.9a Resolviendo invitación (near-instant / slow) (new, RFC 0013)

Shares the identical silent-skeleton/"Un momento…" convention already
established at §3.1/§3.2 — cited, not redescribed (this folder's own §4
shared-state rule). Reached the instant the app detects it was opened via
an `/invite/<token>` link — evaluated automatically, before §2.1's own
device-session check ever runs (§2.0). Resolves `peek_invitation(token)`
— read-only, requires no authentication of any kind (RFC 0013 §2 step 2).

### 3.9b Invitación — no se pudo abrir el enlace (new, RFC 0013 — genuine
platform error only)
```
┌───────────────────────────────┐
│  No pudimos abrir esta            │
│  invitación. Intenta de nuevo.     │
│      [   Reintentar   ]           │
└───────────────────────────────┘
```
Reached only on a genuine read failure resolving the token (a network
drop, a platform error) — the token's own resolution was never actually
determined. Distinct from §3.13a, which is reached only once resolution
*did* succeed and returned a determinate "not live pending" answer.
"Reintentar" replays the same read, same near-instant/slow convention as
every other retryable read in this document.

### 3.10 Invitation-acceptance — offer (new)
(reached via: §2.0 step 3 — a still-`pending`, not-yet-expired Invitation resolved by token alone, before any authentication)
```
┌───────────────────────────────┐
│           Nahui                 │
│                                │
│  Te invitaron a vender con        │
│  Ropa Ana.                        │
│                                │
│  Vas a poder abrir tus propias    │
│  sesiones de venta y registrar     │
│  ventas, usando su Catálogo y      │
│  sus precios.                      │
│                                │
│  [  Aceptar y empezar a vender ] │
│  [   Ahora no   ]                  │
│                                │
└───────────────────────────────┘
```
- No back arrow — nothing about this moment is about changing an identity. She hasn't started authenticating yet at this point (§2.0 shows this offer before authentication runs at all); if she's not sure, "Ahora no" is the honest way out, not a back arrow to a screen that doesn't exist for her yet.
- **Copy reuses `settings.md §3.12`'s own already-written description of what a SELLER can do, mirrored from the inviting side rather than invented a second time** — "esta persona va a poder abrir sus propias sesiones de venta y registrar ventas... usando tu mismo Catálogo y tus mismos precios" becomes "vas a poder abrir tus propias sesiones... usando *su* Catálogo y *sus* precios." *global-principles.md*, "capture business truth once, reuse it forever" — this is the identical fact, said to the other party.
- `Business.name` fills the one variable in the sentence — always present (`onboarding.md §2.2b`, required on every Business). No attempt to name the inviting OWNER personally: `User` carries no display-name field (the same named gap `settings.md §2.7` already states plainly rather than inventing around).
- **"Aceptar y empezar a vender" is the one real confirming tap this commitment gets** — not a second nested Sí/No dialog on top of it. Same standard this document already holds "Enviar código" and "Cerrar sesión" to: a real commitment costs one deliberate tap, never zero, never two.
- "Ahora no" costs nothing to tap — no confirmation of its own, since nothing is lost or destroyed by declining (§2.2a step 4).

**Behavior, "Aceptar y empezar a vender":**
- Does this device currently hold a valid, verified session, with no
  §3.7e confirmation left pending (§2.1 step 1's ordinary test, per §2.0
  step 4's now-corrected branch, above — cited, not restated in full)?
    → YES → the token, held in this screen's own pre-auth context, is
      handed directly to §2.2a's acceptance write — §3.10a (Aceptando
      invitación), no detour through authentication at all. **[Amended
      2026-09-15, RFC 0014/D70]** This write may now return
      `invitation_identity_mismatch` → §3.10f, new — see §2.2a's own
      corrected outcome list.
    → A credential already verified on this device but sitting on its
      own unconfirmed §3.7e gate → §2.0 step 4's second branch runs
      exactly as written there (its own "Sí, es mío/mía" leads to the
      same §2.2a write, including the possible §3.10f outcome; its "No,
      elegir otro" now returns to §3.2g, not §3.2a/§3.3/§3.2e —
      corrected 2026-09-15, RFC 0014/D70).
    → NO → **[Corrected 2026-09-15, RFC 0014/D70]** routes into §3.2g
      (Invitación — correo confirmado, new), never §3.2a's three-way
      choice, carrying the token forward the same way §3.8 already
      carries any other in-progress pre-auth state. The email is
      already known (`targetHint`), so there's nothing to choose or
      type — she confirms and receives a code at that exact address,
      then control returns here automatically the instant a `userId`
      resolves (§2.2's new case 0) → §2.2a → §3.10a (or, on a
      `targetHint` mismatch, §3.10f).

**Behavior, "Ahora no":**
- Same device-session test.
    → Valid session exists → falls through to that session's own
      ordinary landing (§2.1 step 1 → `onboarding.md §2.1`'s
      resolution) — she simply continues using Nahui under her existing
      standing; this specific offer is untouched (RFC 0013 §2 — the
      Invitation stays `pending`; the only way she'd see it again is
      opening the same link a second time, since nothing auto-resurfaces
      it).
    → No session exists → routes to §3.2a, fresh — she was never asked
      to authenticate for this, and isn't now either.

**`brand-guardian` consultation complete, per §8 item 8 — §3.10's offer copy confirmed correct as drafted; §3.10c's welcome copy (below) has one Minor, deliberately-deferred nuance — see §8 item 8.**

### 3.10a Aceptando invitación — near-instant / slow
```
┌───────────────────────────────┐        ┌───────────────────────────────┐
│        ▢▢▢▢▢▢▢▢▢▢▢▢            │        │  Uniéndote a Ropa Ana…          │
└───────────────────────────────┘        └───────────────────────────────┘
   near-instant: silent skeleton              slow (>~1.5s): one plain line
```
Runs `accept_invitation(token, userId)` (§2.2a) — same near-instant/slow convention as every other write in this document.

### 3.10b Aceptando invitación — error
```
┌───────────────────────────────┐
│  No pudimos completar esto.      │
│  Sigue aquí, intenta de nuevo.    │
│      [   Reintentar   ]          │
└───────────────────────────────┘
```
Reached only on the write's own genuine platform-error outcome (§2.2a) — same idempotency guarantee §3.7d already carries for its own genuine first-time-provisioning write — a retried accept must never risk creating a second `BusinessMembership` or leaving `Invitation.status` ambiguous.

### 3.10c Invitación aceptada — bienvenida (new)
```
┌───────────────────────────────┐
│                                │
│           Nahui                 │
│                                │
│  Ya quedaste registrada con        │
│  Ropa Ana.                         │
│                                │
│  Cuando quieras vender, abre       │
│  tu sesión aquí.                    │
│                                │
│  Cuando quieras, puedes agregar       │
│  tu nombre en Tu cuenta.               │
│                                │
│      [   Ir a Hoy   ]              │
│                                │
└───────────────────────────────┘
```
- **Copy reuses the exact register `tone-of-voice.md` itself names as the concrete example of "celebration is about her, plainly stated, never inflated"** — "Ya quedaste registrada con Ropa Ana" is that document's own worked example, applied here rather than invented fresh. No confetti-shaped language, no exclamation, no framing this as Nahui's own accomplishment.
- One tap, "Ir a Hoy" — hands off into `home.md §2`'s own resolution, now reading a real, active SELLER Membership for the first time.
- Reached only on §2.2a's `success` outcome.
- **Added 2026-09-15 (`decision-log.md` D69/D70, `ux-critic` Major, closed) — a passive, zero-required-tap line pointing at "Tu cuenta."** `settings.md` §2.5 explicitly reasons against adding a `displayName` *field* to this screen (the fastest interaction is the one that never happens, and nothing at acceptance-time needs the name) — that reasoning is unaffected and still correct. What was missing, found by `ux-critic`: a SELLER onboarded this way never sees "Tu equipo," "Vendiendo ahorita," or "Exportar tus ventas" (all OWNER-only), so she had no way to ever learn anyone sees "Alguien de tu equipo" on her behalf, or that a fix exists — "Tu cuenta" existing self-service is not the same as her knowing it exists. This one informational line closes that discoverability gap without adding a field, a tap, or a decision to make right now — she can act on it later, or never, exactly as before.
- **`brand-guardian` consultation complete (2026-09-15, `reviewer`-caught process gap, closed).** Skipping consultation on the original wording was itself the error, independent of the wording's own quality — this exact screen is `tone-of-voice.md`'s own cited worked example and already carries a standing, deliberately-deferred Minor on its own verb choice, so it has *less* tonal slack than an average screen, not more. `brand-guardian` found the original line ("Para que te reconozcan por tu nombre, agrégalo en Tu cuenta") violated a specific, named rule, not a vague tonal preference: `tone-of-voice.md`'s own Concrete rules reject bare second-person imperatives ("agrégalo") in favor of offer-shaped constructions, citing `reports.md` §3.13's "Puedes revisar esto en Configuración" as the correct precedent shape — "agrégalo" was structurally the same imperative move that rule already names and rejects, just softer-verbed. A second, smaller issue: "para que te reconozcan" didn't say *by whom*, risking a false read that this is customer-facing recognition, which `character-bible.md`'s "Relationship with customers" rules out entirely. **Fixed:** reworded to "Cuando quieras, puedes agregar tu nombre en Tu cuenta" — drops the imperative for `tone-of-voice.md`'s own offer-shaped precedent construction, drops the ambiguous justification clause instead of wording around it, and echoes line 2's own "Cuando quieras vender..." cadence so the third line reads as a continuation of the same voice rather than a bolted-on aside in a different register — closing the "checklist/onboarding-nag" risk `brand-guardian` also named, not just the imperative-verb issue.

### 3.10d Invitación — ya formabas parte del equipo (new, RFC 0013 —
accept_invitation outcome: already_member)
```
┌───────────────────────────────┐
│           Nahui                 │
│                                │
│  Ya formas parte del equipo       │
│  de Ropa Ana.                     │
│                                │
│  Cuando quieras vender, abre       │
│  tu sesión aquí.                    │
│                                │
│      [   Ir a Hoy   ]              │
│                                │
└───────────────────────────────┘
```
Reached only when §2.2a's write returns `already_member` — this
authenticated User already holds an *active* `BusinessMembership` for
this exact Business (e.g., she already accepted another still-live
Invitation to this same Business through a separate attempt — never
*this* exact token, since a token already `accepted` would fail the
write's own CAS first and route to `invitation_not_available` instead).
Not an error: the fact it states is unambiguously true and good, so
treated as a variant of success, not a defensive state — the same
"celebration is about her, plainly stated, never inflated" register
§3.10c already establishes, adapted only to state the correct underlying
fact (already a member, not newly registered). Reuses §3.10c's exact
closing line and single confirming tap; the destination is identical
either way. "Ir a Hoy" → `home.md §2`.

### 3.10e Invitación — acceso cancelado antes (new, RFC 0013 —
accept_invitation outcome: membership_revoked)
```
┌───────────────────────────────┐
│           Nahui                 │
│                                │
│  Ya no tienes acceso para          │
│  vender con Ropa Ana.               │
│                                │
│  Si crees que esto es un error,     │
│  habla con quien te invitó.          │
│                                │
│      [   Entendido   ]              │
│                                │
└───────────────────────────────┘
```
Reached only when §2.2a's write returns `membership_revoked` — this
authenticated User already holds a *revoked* `BusinessMembership` for
this exact Business (an OWNER removed her before; this link, whether
freshly generated or an old still-live one, does not silently restore
that on its own). Deliberately does not accept, does not create a new
active Membership — reactivating a deliberately revoked Membership stays
the OWNER's own decision to make again, not a side effect of a link being
opened, the same restraint `settings.md §3.11` already holds itself to
(no reactivation mechanism designed for a revoked row).

Reuses `settings.md §3.14`'s exact non-diagnostic register ("si crees que
esto es un error, habla con quien te invitó") and near-verbatim fact
statement — the same fact-stating, no-blame tone already established for
the sibling situation, rather than inventing a second tone for a closely
related "you don't have standing here" moment (the identical reuse
discipline §3.13a already models for the same sentence).

"Entendido" → tests how she arrived here: if via a freshly-completed
authentication (§2.0 step 4's "no session" branch), falls through to
§2.2's ordinary cases 1–3, exactly as an equivalent authentication
success with no Invitation context would; if via an already-valid
session (§2.0 step 4's "valid session" branch), falls through directly
to `onboarding.md §2.1`'s own resolution, same as §2.1 step 1's ordinary
pass-through.

### 3.10f Invitación — no es para esta cuenta (new, RFC 0014/D70 — `accept_invitation` outcome: `invitation_identity_mismatch`)
```
┌───────────────────────────────┐
│           Nahui                 │
│                                │
│  Esta invitación es para           │
│  ana@correo.com, y esta cuenta      │
│  es otra.                            │
│                                │
│  Si tú eres ana@correo.com, cierra   │
│  esta sesión y entra de nuevo con     │
│  esa cuenta.                            │
│                                │
│      [   Cerrar sesión e intentar    │
│           de nuevo   ]                  │
│      [   Entendido   ]                    │
│                                │
└───────────────────────────────┘
```
Reached only when §2.2a's write returns `invitation_identity_mismatch` — the authenticated User's own verified email doesn't match `targetHint`. Reached identically whether this write ran off an already-valid, wrong-account session (RFC 0014's own "already-authenticated-under-the-wrong-account" case) or off a fresh verification through §3.2g that still resolved to a mismatched, already-linked-elsewhere account (RFC 0014's own narrower second case) — this document has no reliable way to distinguish the two, and shouldn't guess, the identical restraint §3.13a's own body text already states for its own two entry points.

- **Never "esta invitación ya no está disponible" or "no es válida" — the invitation is completely fine; it's this account that doesn't match it, per RFC 0014's own named register, held to literally.** Deliberately distinct copy and screen from §3.13a, even though both are "you don't get in" moments — collapsing them would misstate the fact, the same reasoning §3.10d/§3.10e already give for not collapsing into §3.13a's own generic framing.
- `targetHint`'s own value fills the one variable — the same value already shown, unlocked, at §3.2g, so nothing here contradicts what she already saw if she reached this via the fresh-verification path, and introduces no new, unexplained fact if she reached this via the already-authenticated fast path, where she never saw §3.2g at all.
- **"Cerrar sesión e intentar de nuevo" reuses `settings.md §2.5`'s exact sign-out mechanism and its own stated guarantee** — her Business, Catálogo, and historial de ventas are completely untouched, since this is a different device's session fact, not a data-loss risk. Runs inline, here, rather than sending her away to Configuración first — Configuración has no standing reason to be reachable from this exact moment, the same restraint `settings.md §3.14` already applies to its own comparable no-standing defensive state. Reuses `settings.md §3.8a/§3.8b`'s own near-instant/slow/error write template for the sign-out action itself, cited not redescribed. **No second confirming dialog** (unlike `settings.md §2.5`'s own ordinary entry point, which does show one) — she's already read the full explanation on this exact screen before tapping; a second "¿Cerrar tu sesión?" dialog on top would be a second confirming tap for the identical decision, which `onboarding.md §6`'s own standard ("a real commitment costs one deliberate tap, never zero, never two") argues against, not for. On success → §3.2g, fresh, the same Invitation token carried forward (§3.8's own guarantee, generalized here to a deliberate account-switch rather than an accidental interruption) — this branch re-tests from the top the next time she confirms.
- **"Entendido" is the honest way out that costs nothing and fixes nothing** — the same restrained shape `settings.md §3.14`'s own "Entendido" already establishes for a comparable no-standing moment: she can simply leave, or go find whoever invited her and ask them to check the email they used (`settings.md §3.12/§3.12e`'s own "Editar correo" repair path, cited not redescribed). Tests whether a valid session still exists on the device (it does, in both entry paths, by construction — either the pre-existing wrong-account one, or the one she just created verifying `targetHint` itself): → falls through to `onboarding.md §2.1`'s own ordinary resolution, whatever standing she already has elsewhere, completely untouched by this failed attempt — the same two-way test §3.13a's own "Continuar" already runs for a session-holding device, reused rather than reinvented.
- No "Reintentar" of its own — this isn't a failed write, it's an accurate, honest report of a real precondition that didn't hold. The only real next step (sign out and try under the right identity, or ask the OWNER to check what she typed) is stated plainly rather than implying a retry button fixes it on its own — same restraint `settings.md §3.14` already applies.

### 3.13a Invitación ya no disponible (defensive state — now reached from two checkpoints, RFC 0013)
(reached via: §2.0 step 2 — `peek_invitation` resolving to anything other than a live `pending` status, before any authentication; or §2.2a's write returning `invitation_not_available`, after authentication. Same shared state either way, per this folder's own §4 shared-state rule — the underlying fact is identical regardless of which checkpoint catches it.)
```
┌───────────────────────────────┐
│           Nahui                 │
│                                │
│  Esta invitación ya no está        │
│  disponible.                        │
│                                │
│  Si crees que esto es un error,     │
│  habla con quien te invitó.          │
│                                │
│      [   Continuar   ]              │
│                                │
└───────────────────────────────┘
```
- **Reuses `settings.md §3.14`'s exact register** ("si crees que esto es un error, habla con quien te invitó") — the same non-diagnostic, no-blame phrasing already established for the sibling Membership-revoked defensive state, rather than inventing a second tone for a closely-related situation.
- Deliberately doesn't diagnose *why* — already accepted, revoked, or any other non-`pending` state reads identically here; this document has no reliable way to distinguish them and shouldn't guess.
- "Continuar" → tests how she arrived here:
  - Reached via §2.0 step 2 (pre-auth — no authentication has happened yet for this attempt) → tests the device's own ordinary session state (§2.1 step 1): a valid session already → `onboarding.md §2.1`'s own resolution (her ordinary landing, whatever that already is); no session → §3.2a, fresh.
  - Reached via §2.2a (post-auth — she is definitely authenticated by now) → falls through to §2.2's ordinary cases 1–3, exactly as an equivalent authentication success with no Invitation context would.

  Nothing left for this token to do regarding this specific Invitation either way — it lands exactly where the same person would land had this link never existed.

## 4. Interaction flow (summary)

```
Open app (any time)
  → [New, RFC 0013 — checked before everything below] opened via
    /invite/<token>? ──────────────────────────────────────────────────→
    §2.0: resolviendo (§3.9a)
      → read fails ──────────────────────────────────────────────────→
        §3.9b, Reintentar
      → resolves, not live-pending (not found / expired / already
        resolved) ─────────────────────────────────────────────────────→
        §3.13a → Continuar → tests ordinary session state (§2.1 step 1):
          valid session → onboarding.md §2.1's resolution
          no session → §3.2a, fresh
      → resolves, live pending ────────────────────────────────────────→
        §3.10 (offer)
          → Ahora no → tests ordinary session state:
              valid session → onboarding.md §2.1's resolution, this
                Invitation untouched, still pending
              no session → §3.2a, fresh
          → Aceptar y empezar a vender → tests ordinary session state
            (§2.1 step 1, including its own no-pending-§3.7e condition):
              valid session, no §3.7e pending → §2.2a directly →
                outcomes below
              valid session, §3.7e pending → §3.7e, Invitation-context
                line stacked on top →
                  Sí, es mío/mía → §2.2a directly → outcomes below
                  No, elegir otro → reverts, returns to §3.2g
                    [Corrected 2026-09-15, RFC 0014/D70 — never
                    §3.2a/§3.3/§3.2e, this path is Email-only now] →
                    re-tests this same branch on the next successful
                    verification
              no session at all → §3.2g directly [Corrected 2026-09-15,
                RFC 0014/D70 — never §3.2a–§3.2f's three-way choice] →
                Enviar código → shares §3.5/§3.5a → Ingresa el código
                (§3.6/§3.6a/§3.6b) → Confirmar → shares §3.7/§3.7a-d →
                success, checked FIRST against §2.2's new case 0 (token
                present) → §2.2a → outcomes below
          [outcomes, §2.2a] → success → §3.10a → §3.10c → Ir a Hoy →
                                home.md §2
                             → invitation_identity_mismatch [New,
                               2026-09-15, RFC 0014/D70] → §3.10a →
                               §3.10f → Cerrar sesión e intentar de
                               nuevo → sign-out (settings.md §3.8a/
                               §3.8b's template) → §3.2g, fresh → this
                               branch re-tested from the top
                                                 → Entendido →
                               onboarding.md §2.1's ordinary resolution
                             → invitation_not_available → §3.10a →
                               §3.13a → Continuar → §2.2 cases 1–3
                             → already_member → §3.10a → §3.10d →
                               Ir a Hoy → home.md §2
                             → membership_revoked → §3.10a → §3.10e →
                               Entendido → §2.2 cases 1-3 or
                               onboarding.md §2.1, per §3.10e's own test
                             → platform error → §3.10b → Reintentar

  → NOT opened via /invite/<token> (the overwhelming majority of opens),
    entirely unaffected by any of the above:
      → resolve device session (§2.1, automatic)
      → [New, 2026-09-13, §2.1 step 0] verified, but §3.7e's device-
        history confirmation still unconfirmed? ────────────────────────→
        resume directly to §3.7e — never falls through to the ordinary
        valid-session check below, which would otherwise treat the bare
        verification as sufficient on its own
      → valid session exists (no §3.7e pending) ────────────────────────→
        [Restored 2026-09-14, RFC 0013 — see §2.1 step 1] Authentication
        never shown, not even a flash — control passes directly and
        silently to onboarding.md's own resolution (onboarding.md §2.1).
        (The 2026-09-07 pending-Invitation sub-check formerly here is
        removed outright — Invitations are discovered only via §2.0's
        own link-opening check now, above.)
      → in-progress (phone/email typed, code sent, or Google redirect
        started, not yet confirmed), interrupted ─────────────────────→
        resume exact step (§3.8, range extended to cover §3.2a–§3.2f) —
        countdown recomputed from real elapsed time, not frozen or reset
      → fresh, no session ────────────────────────────────────────────→
        Elegir cómo entrar (§3.2a, new 2026-09-13)
          → Continuar con número celular → Número celular (§3.3), same
            flow as before, entry point relabeled only
          → Continuar con correo → §3.2e
              → formato inválido (§3.2f) → corrects in place
              → Enviar código → shares §3.5/§3.5a → Ingresa el código
                (§3.6/§3.6a, generalized) → shares §3.6b/§3.7/§3.7a-d →
                success → §2.2's generalized branch, reading
                AuthIdentity(type=email)
          → Continuar con Google → §3.2b (redirecting, Google's own UI,
            out of scope) → §3.2c (verificando)
              → she cancels/backs out → silently back to §3.2a, no error
              → genuine platform error → §3.2d → Reintentar → §3.2b again,
                or Elegir otra forma → §3.2a
              → success → §2.2's generalized branch, reading
                AuthIdentity(type=google)
      → resolution itself fails ──────────────────────────────────────→
        fallback (§3.9), Reintentar

From §3.3 (reached via §3.2a's "Continuar con número celular"), type a number:

  A paste (or similar) produces a superficially-complete, non-numeric
  value ───────────────────────────────────────────────────────────→
    formato inválido (§3.4), corrects in place, back to §3.3

  A valid 10-digit number, Enviar código
    → enviando (§3.5) → error (§3.5a) → Reintentar
    → success → Ingresa el código (§3.6/§3.6a)
        → A paste (or similar) places non-numeric characters into the
          code field ────────────────────────────────────────────────→
          formato inválido (§3.6b), corrects in place, back to §3.6
        → (§3.6a only) Reenviar código ─────────────────────────────→
          replays §3.5's send (same idempotency guarantee), returns to
          §3.6 with cooldown restarted, ambient "Código reenviado"
          confirmation
        → Confirmar → verificando (§3.7)
            → código incorrecto (§3.7a) → back to §3.6/§3.6a, retype
            → código expirado (§3.7b) → Reenviar código → back to §3.5
            → demasiados intentos (§3.7c) → Reenviar código → back to §3.5
            → error de plataforma (§3.7d) → Reintentar → §3.7 again
            → success, checked FIRST against §2.2 case 0 (token carried
              from §2.0's pre-auth flow) ─────────────────→
              §2.2a directly — see the outcomes table in the new top
              block above (success / invitation_not_available /
              already_member / membership_revoked / platform error)
            → success, first-ever verification for this credential, not
              reached via §2.0's pre-auth Invitation flow ─────────────────────────────────→
              [New check, 2026-09-07, generalized 2026-09-13] does this
              device remember a different identity's session, ever (any
              AuthIdentity type)?
                → NO → onboarding.md §3.3 (Bienvenida + Elegir cómo
                  empezar), cited verbatim — Owner-ness produced
                  structurally the moment onboarding.md §3.5's own
                  Business-creation write next succeeds (§2.2, not
                  designed here)
                → YES → §3.7e (confirm identity) →
                    Sí, es mío/mía → onboarding.md §3.3, same as NO
                      above
                    No, elegir otro → back to whichever entry point she
                      used (§3.3/§3.2e, value preserved; §3.2a for
                      Google)
            → success, already-verified-on-this-device, Business local
              and intact [Amended 2026-08-13 — see
              authentication.changelog.md#2026-08-13-case-2] (reached
              via: account sign-out, `settings.md §2.5`, then
              re-verification) ──────→ `onboarding.md §2.1`'s own
              resolution — complete Business to Home (`home.md §2`),
              in-progress Business resumes exactly where left off
              (`onboarding.md §2.1` cases 2–4)
            → success, phone already tied to an existing,
              already-onboarded Business, no local session on this
              device ──────────────────────────────────────────────→
              NOT YET RESOLVED — see §8, Product Decision Q18
        → ← Cambiar número → back to §3.3, number preserved

Any interruption up to and including a still-unconfirmed code:
  → next app open resumes exactly where she left (§3.8) — never restarts
    from §3.3 once real progress has been made.
```

## 5. Screen states (enumeration)

1. Resolving (near-instant)
2. Resolving — slow
3. Número celular — entry
4. Número celular — formato inválido
5. Enviando código (near-instant / slow)
6. Enviando código — error
7. Ingresa el código — entry (cooldown active)
8. Ingresa el código — reenvío disponible (cooldown elapsed)
9. Código — formato inválido (inline)
10. Verificando código (near-instant / slow)
11. Verificando código — código incorrecto
12. Verificando código — código expirado
13. Verificando código — demasiados intentos
14. Verificando código — error de plataforma
15. Retomar autenticación interrumpida (resumes any of states 3–14, pixel-identical — except §3.6's resend countdown, recomputed from real elapsed time — in-progress data intact)
16. Falla defensiva — no se pudo determinar el estado inicial
17. Invitation-acceptance — offer (§3.10)
18. Aceptando invitación (near-instant / slow) (§3.10a)
19. Aceptando invitación — error (§3.10b)
20. Invitación aceptada — bienvenida (§3.10c)
21. Invitación ya no disponible (§3.13a)
22. Verificando código / Google — éxito, otra identidad en este dispositivo (§3.7e, generalized) — reached via §2.2 case 1 (fresh verification) or §2.0 step 4's own second entry point (an already-pending confirmation resumed mid pre-auth Invitation flow, added 2026-09-14)
23. Elegir cómo entrar (§3.2a, new)
24. Continuando con Google — near-instant / slow (§3.2b, new)
25. Verificando con Google — near-instant / slow (§3.2c, new)
26. Google — no se pudo continuar, genuine error only (§3.2d, new)
27. Correo electrónico — entry (§3.2e, new)
28. Correo electrónico — formato inválido (§3.2f, new)
29. Resolviendo invitación (near-instant / slow) (§3.9a, new)
30. Invitación — no se pudo abrir el enlace (§3.9b, new)
31. Invitación — ya formabas parte del equipo (§3.10d, new)
32. Invitación — acceso cancelado antes (§3.10e, new)
33. Invitación — correo confirmado (§3.2g, new, RFC 0014/D70)
34. Invitación — no es para esta cuenta (§3.10f, new, RFC 0014/D70)

## 6. Minimum step count

| Scenario | Taps to handoff | Why it can't be fewer |
|---|---|---|
| First-time verification, phone (or any fresh verification on a session-less device) | **[Corrected 2026-09-13] 5** (Elegir cómo entrar + typed phone + Enviar código + typed code + Confirmar — was 4) | Both fields are genuinely required, unique-per-person facts with no honest default — a phone number and a one-time code are the entire minimum a verification mechanism can ask for. Neither "Enviar código" nor "Confirmar" is auto-fired on field completion — both actions have a real, non-trivial consequence (a message sent; an identity confirmed), the same reasoning `onboarding.md §6` already gives its own "Confirmar y activar." The new choice screen (§3.2a) adds one real tap to every path — a deliberate, named trade for genuine method choice, reasoned in §1. |
| First-time verification, email (new, 2026-09-13) | **5** (Elegir cómo entrar + typed correo + Enviar código + typed code + Confirmar) | Identical shape to phone — two genuinely required fields, no honest default. |
| First-time verification, Google (new, 2026-09-13) | **2**, then Google's own UI, uncounted (Elegir cómo entrar + Continuar con Google) | The lowest-friction of the three by construction — no typing on Nahui's own screens at all. Google's own account-picker interaction is out of scope, the same treatment `onboarding.md §2.2b`'s file picker already gets. |
| Already-verified device | **0** — never shown | Direct consequence of §2.1's silent pass-through. |
| Resuming an interrupted verification | **0 extra** | Same guarantee `onboarding.md §3.7` already gives its own in-progress work. |
| Recovering from a wrong/expired/exhausted code | **+1 per occurrence** (retype code, or tap Reenviar código) | Not part of the floor — only reached when something genuinely went wrong; never a designed-in tax on the happy path. |
| Accepting a pending Invitation, already-authenticated device | **2** (Aceptar y empezar a vender → Ir a Hoy) | Unchanged from the phone-keyed version — one tap for the real commitment, one to leave the acknowledgment screen. |
| Accepting a pending Invitation, no session yet | ~~2 + whichever authentication method's own floor...~~ **Superseded 2026-09-15, RFC 0014/D70 — Invitation-acceptance no longer offers a choice of method at all.** **4** (Aceptar y empezar a vender → Enviar código → Confirmar → Ir a Hoy) | Lower than the superseded value above, not higher — RFC 0014 removes the method choice entirely for this one entry point (no §3.2a, no typing an identifier, since `targetHint` is already known), leaving only the two genuinely required auth-portion taps (send, confirm) plus the two Invitation-portion taps already justified elsewhere in this table. |
| Recovering from `invitation_identity_mismatch` (already signed in under the wrong account) | **+2** (Cerrar sesión e intentar de nuevo, then the 4-tap floor above repeats) | New, RFC 0014/D70. Not part of the ordinary floor — only reached when a device already holds a session under an account that doesn't match `targetHint`. The fix costs exactly what `settings.md §2.5`'s own sign-out costs, once, then the same 4-tap floor above, once more. |
| Declining a pending Invitation | **1** (Ahora no) | Unchanged — nothing to confirm, costs nothing beyond the tap, regardless of session state. |
| First-time verification on a device that previously held a different identity's session | **+1** (Sí, es mío/mía) | Not part of the floor — only reached when a device carries this specific history; protects a real, first-time Business-creation commitment from a mistyped digit or accidental re-verification, the same reasoning `onboarding.md §6` already gives every real-commitment tap in this family (§3.7e, generalized). |
| Accepting a pending Invitation, a credential already verified on this device but sitting on an unconfirmed §3.7e gate (new, added 2026-09-14) | **+1** (Sí, es mío/mía), on top of whichever floor already applied before the interruption — never a repeated OTP cycle | Same reasoning as the ordinary §3.7e row above, extended to this second entry point: protects the same real commitment (which identity this Business/Membership attaches to) from the same stray-tap/mistyped-credential risk, reusing the identical mechanism rather than forcing a redundant full re-verification. |

## 7. Automation opportunities

- Whether a device already holds a valid session — resolved silently on every app open (§2.1); never a manual "log in again" she has to trigger.
- "+52" is automatic context, never typed.
- Whether a given confirmed code represents a first-ever or a returning verification is resolved automatically, never asked to her as a separate question ("¿ya tienes cuenta?" never appears anywhere).
- The resend cooldown counts down automatically; she never tracks elapsed time herself.
- Owner-ness — fully automatic, a pure structural consequence of the atomic Business-creation write (`decision-log.md` D44), never a question, never a picker, per the Product Owner's explicit scope constraint.
- Whether a client also auto-fires "Confirmar" the instant a 6th digit lands (without changing the underlying required, gated action itself) is a High-Fidelity/implementation nicety, deliberately left undecided here — below this document's abstraction level, the same way exact digit-grouping in the phone field is.
- Whether an opened link's Invitation is still live-pending, expired, revoked, or already resolved is resolved automatically the instant the link opens (§2.0), before she's ever asked to do anything — never a manual "check invitation status" step.
- Which of §2.2a's five real accept-write outcomes occurred (success, identity-mismatch, not-available, already-member, membership-revoked) is resolved automatically and reported with distinct, honest copy for each — never collapsed into one generic "something happened" state.
- Whether this device has ever held a session for a *different* phone is checked automatically, silently, before any Business-creation handoff — never a raw question asked of her ("¿ya usaste este teléfono antes?" never appears anywhere); it only ever surfaces as the one confirming screen it gates (§3.7e).
- **Added 2026-09-13:** which of the three methods she used is never re-asked — §2.2's four-way branch resolves generically off whichever `AuthIdentity` just verified, never a separate "how did you sign in" question. Google's own account picker does her typing for her when she's already signed in on the device — the closest this document gets to a genuinely zero-typing verification path.
- Whether the authenticated identity's own verified email matches `targetHint` — checked automatically, server-side, at the moment of acceptance (RFC 0014/D70); never something Ana or the invited person has to confirm manually beyond the one "Cerrar sesión e intentar de nuevo" choice if it fails.

## 8. Open questions

None of the items below block this document's own completion. Both are named explicitly rather than invented around, per this folder's own §4 rule that every branch resolves to a named destination or an explicit "Not yet resolved" marker.

1. **Architect Question Q17 (`product/02-ux/architect-questions.md`) — Resolved.** Was: the User/Owner/Seller domain model this document's flow needs to actually be implementable. `domain-model.md` previously had no User/Account aggregate, no Role concept, no Business↔User relationship — Business was modeled as belonging to "an install" (`onboarding.md §2.1`'s own language), not to an authenticated identity — the concrete follow-up `company/business-decisions.md` Q14 already named as owed. **Resolved** via `product/99-rfc/0007-user-and-business-membership.md`, Accepted and promoted in full via `decision-log.md` D44 — `User` (global aggregate root, identified by `phone`) and `BusinessMembership` (`role: OWNER | SELLER`) are now part of `domain-model.md`/`ubiquitous-language.md`, with Business creation carrying the structural Owner-Membership invariant this document's §2.2 first-verification branch already assumed. No amendment to this document's own flow logic (§2.2/§4) was needed — it already describes exactly the behavior D44 makes implementable.
2. **Product Decision (proposed Q18, `product/02-ux/product-decisions.md`) — §2.2 case 3 (a verified credential — phone, email, or Google — on a session-less device, already tied to an existing already-onboarded Business; wording generalized 2026-09-13 to match the operative branch text, `ux-critic`-caught drift).** Genuinely undecided: whether a Business belongs to a device or an identity, and whether this mock/local-data prototype can even represent "same Business, second device" today.
3. **Provisional prototype defaults, not frozen domain invariants (Product Owner clarification, 2026-08-13):** the specific numbers chosen here by judgment call — 6-digit code, 30-second resend cooldown, 5-minute code validity, 5-attempt soft-invalidation bound — are product/prototype defaults, not settled Foundation rules. They should be revisited when a real authentication provider is integrated (Stage 7, Backend Integration) — a real SMS/OTP vendor may impose its own constraints (code length, delivery/expiry timing, rate limits) that supersede these values outright, and even absent that, they should be checked against a real or simulated first-run test before being treated as final, same evidence-driven caution `onboarding.md §8` items 1/5/6 already recommend for its own judgment calls. Nothing in this document's flow logic (§2, §4) depends on the exact values — only on their existence and the branches they gate.
4. **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-open-q4`]** Resolved. `settings.md §2.5` activates §2.2 case 2.
5. **`brand-guardian` consultation complete (2026-08-13)** — §3.7c's "too many attempts" copy revised per that consultation's finding (subject/causal-structure fix, same soft-invalidation design); flagged as `tone-of-voice.md`-Hypothesis-tagged, worth a real merchant-reaction check once shipped, not blocking now.
6. **Multi-Business membership intersecting with a pending Invitation — narrowed 2026-09-14, RFC 0013.** Sub-case (a) is superseded outright, not merely resolved: the 2026-09-07 fix it described (a special session-resume check for a zero-standing-anywhere User) no longer exists to need special-casing, since §2.0's token-based discovery reaches every population identically regardless of prior device history — there's no longer an "intersection" for this half at all. Sub-case (b) narrows to what it was always really about: **Business-switching UI.** Accepting a new Business's Invitation while already holding an active Membership elsewhere now works cleanly through §2.0/§2.2a (multi-Business membership is already valid domain-wise, Q24/Q25) — what's still genuinely undesigned is a way to *switch between* Businesses once she holds more than one Membership. `product-decisions.md` Q24/Q25 item 3 already names this gap; not solved here.
7. **Superseded by RFC 0013, not merely resolved.** The multi-pending-Invitation tie-break no longer applies — a token always identifies exactly one Invitation, so there's no ambiguity left to tie-break. See §2.2a step 4.
8. **`brand-guardian` consultation complete (2026-09-07).** Finding: §3.10's offer copy correctly applies the peer-to-peer register question posed; no issue found there. §3.10c's welcome copy — which reuses `tone-of-voice.md`'s own worked exemplar ("Ya quedaste registrada con Ropa Ana") verbatim — was flagged on a narrower point: the verb ("quedaste registrada," a passive connotation) may undersell that a Seller accepting an invitation just gained real active capability (open Sessions, register Sales), not merely been added to a list. Called explicitly Minor and non-blocking — the very next line ("Cuando quieras vender, abre tu sesión aquí") resolves the ambiguity within about a second of reading. **`ux-designer` call, documented here rather than resolved by editing the screen: left as-is for now**, deliberately deferred rather than adjusted — changing this exemplar's own verb would mean deviating from the literal reused text `tone-of-voice.md` itself cites, which deserves its own pass rather than an ad hoc tweak folded into this unrelated remediation. Revisit if this screen is next substantively touched — a candidate replacement already on record: "Ya puedes vender con Ropa Ana," which carries the active-capability meaning more directly.
9. **`settings.md §8` items 11 (cancelling a pending Invitation) and 12 (`Invitation.status = expired`'s trigger/timing) — both resolved in `settings.md`, 2026-09-13 (RFC 0013/D64). This document's §3.13a now correctly composes against that model as of this amendment (2026-09-14) — the "stale" framing previously logged here is closed, not merely noted.** This document's §3.13a defensive state was originally written to cover *either* outcome without needing to distinguish them — that framing itself was stale too, since it was written under the old phone-keyed model. `reviewer`-caught staleness (2026-09-13, closed): this item and §11's own matching reference both repeated the same now-false "unresolved there" claim as §2.2a step 1's inline parenthetical — all three pointed at the same fact, corrected in the 2026-09-13 pass rather than only at the one instance originally caught. Now further closed, for real, by this 2026-09-14 amendment reworking §3.13a itself against RFC 0013.
10. **Resolved by this amendment (2026-09-14) — see the front-matter status header.** §2.0/§2.2/§2.2a/§3.9a-§3.9b/§3.10-§3.13a now compose cleanly against the token-based RFC 0013 domain model. Full detail: this entire amendment.
11. **New Product Decision — account linking (`product/02-ux/product-decisions.md` Q26, `decision-log.md` D62/D63, RFC 0012 §5 Open Item 1, now live per D63) — added 2026-09-13, logged Q26 same day (`ux-critic`-caught documentation-persistence gap, closed).** Should Nahui ever offer a way for a merchant to link a second method to her existing identity (e.g., someone who signed up via Google later wants phone/WhatsApp too)? Not designed here — RFC 0012 §5 Invariant C already names the structural risk this activation makes live for the first time: the same real person completing cold sign-up twice, via two different methods, now silently produces two separate `User` rows with two separate Businesses, with no in-app way to notice or recover. This is a genuine, material risk this amendment introduces by design (per D63's own explicit choice), not a hypothetical — flagged plainly, not resolved, since resolving it requires a Product Owner call this document can't make.
12. **`settings.md §2.5/§3.3a` ("Tu cuenta") needs a follow-up amendment — added 2026-09-13, genuinely stale, not fixed by this document's own scope.** That section unconditionally shows a phone number, read-only, on every "Tu cuenta" variant, with no case for a merchant who has no linked phone `AuthIdentity` at all — now a real, reachable state the instant a merchant completes Owner-creation via Google or Email alone (D63 explicitly permits exactly this). RFC 0012 §6's "second Approved consumer checked" note only confirmed the field path is correct for a merchant who *has* a verified phone — it couldn't have addressed the zero-phone case, since Google/Email weren't activated at that point. Flagged explicitly for a follow-up `settings.md` amendment (new screen state — what "Tu cuenta" shows for a Google-only or Email-only merchant, presumably her verified email or a Google-account label, by the same reasoning §3.7e applies); not designed here since it's outside this document's own file scope.
13. **Provisional prototype defaults, email-specific — added 2026-09-13.** This amendment reuses phone's existing 6-digit code / 30-second cooldown / 5-minute validity / 5-attempt bound for email, unchanged, for consistency — but email delivery in the real world is frequently slower than SMS/WhatsApp (spam-filter queueing, greylisting). Worth a dedicated check once a real email provider is integrated (Stage 7), same caution §8 item 3 already states for the phone defaults, extended explicitly to cover this new channel rather than silently assumed identical.
14. **§3.7e's device-history check doesn't cover Google's actual realistic error mode — `ux-critic`-caught Major, named explicitly 2026-09-13, not resolved here.** The check fires only when *this device* remembers a *different identity's* prior session — built to catch a transcription error (a mistyped digit or email address). Google has no transcription step at all, so the real risk isn't "wrong device history," it's **picking the wrong already-signed-in account from Google's own account picker** — common on a shared/family device with multiple Google accounts signed in — and that can happen on a device with **zero prior Nahui history**, meaning §3.7e never fires for it under the current trigger condition. A merchant could tap "Continuar con Google," pick the wrong account, and silently get a brand-new Business created under someone else's Google identity, with no confirmation screen at any point. **Not solved in this pass** — named as a real, accepted gap (same class as items 11–13) rather than the narrower "is the existing check even worth firing for Google" question this item originally, incompletely, asked. A future fix would need a Google-specific confirmation step independent of device history (e.g., always showing the resolved Google account's label back to her before proceeding, regardless of device history) — not designed here.
15. ~~Whether a post-acceptance soft mismatch warning... is worth designing~~ **Superseded 2026-09-15 (`product-decisions.md` Q30, `product/99-rfc/0014-invitation-target-hint-enforced.md`, Accepted, `decision-log.md` D70).** Resolved as a hard block, not a soft warning — see §2.0/§2.2a/§3.2g/§3.10f, this same amendment.
16. **Whether `invitation_identity_mismatch`'s two named technical paths (already-wrong-account fast path, vs. a fresh Email verification that still resolves to an account linked elsewhere) ever need distinguishing UI, rather than sharing §3.10f — added 2026-09-15.** No evidence yet either path is common enough to warrant it — RFC 0014's own "narrower than it sounds" framing for the second path, mirrored here rather than re-litigated.

## 9. Principle justification

**global-principles.md:**
- *"The fastest interaction is the one that never happens"* — a verified device is never asked again (§2.1); no separate "create account" step exists between OTP success and `onboarding.md §3.3` (§2.2, §10).
- *"Never ask twice"* — resuming an interrupted verification never re-asks anything already typed (§3.8); whether a phone is first-time or returning is resolved automatically, never asked as a raw question (§7).
- *"Technology should disappear"* — no nav bar exists before there's anything to navigate into; loading states stay silent unless genuinely slow, identical convention to every other tab.
- *"Business language before technical language"* — "Número celular," "código," never "OTP," "sesión," "token," or "autenticación" anywhere in merchant-facing copy.
- *"Capture business truth once, reuse it forever"* — a verified phone is captured exactly once per device and never re-collected on retry (§3.5a, §3.7d's idempotent-retry guarantees).

**architecture-principles.md:**
- *#1 (capabilities resolved once, upstream)* — extended here to identity itself: verification is resolved once, before any Business, Session, or Sale exists, never re-asked mid-flow.
- *#4 (internal-only entities never leak into user-facing language)* — no domain term ("User," "Owner," "Seller," "Role," "Session" in the authentication sense) ever appears in merchant-facing copy.
- *#7 (idempotent/keyed retries)* — both write-like actions in this document (§3.5 send, §3.7 confirm) carry the same stable idempotency-key guarantee every other retryable write in this project carries, named explicitly for §3.7 given its genuine first-time-provisioning consequence.

**brand-guide.md / tone-of-voice.md:**
- *Tone — "warm, direct, respects the vendor's intelligence... never intimidating"* — §3.7c's soft, code-level invalidation (never a hard account lockout) is the concrete application of this principle to a genuinely new situation this document introduces; flagged for a `brand-guardian` consultation rather than asserted as settled (§3.7c, §8).
- *tone-of-voice.md, "state facts before offering an opinion"* — every error/limit state states what happened before what to do next, no apology-first structure.

**§2.2a/§3.10–§3.13a additions (`product-decisions.md` Q24/Q25, 2026-09-06/07) — superseded 2026-09-14, see the "§2.0/§2.2a rework" block below for the current justification.** Kept here, marked superseded rather than deleted, for continuity of the record (this document's own established discipline, §8 item 4/§10):
- *global-principles.md*, "capture business truth once, reuse it forever" — §3.10's description of what a SELLER can do is the identical fact `settings.md §3.12` already wrote for the inviting side, reused rather than reworded twice. (Still true, unaffected by the rework.)
- ~~*global-principles.md*, "never ask twice" — checking for a pending Invitation happens automatically... declining never re-surfaces the same offer on the next open.~~ Superseded — the mechanism this described (session-resume checking, per-device decline memory) no longer exists; see §2.0/§2.2a's own current text.
- ~~*global-principles.md*, "the fastest interaction is the one that never happens" — no second/simultaneous-Invitation picker is built without evidence it's ever real (§2.2a step 2).~~ Superseded — the multi-pending tie-break this referred to is eliminated outright (§2.2a step 4), not merely undesigned.
- *architecture-principles.md* #7 (idempotent/keyed writes) — the accept action's atomic `BusinessMembership` creation + `Invitation.status` flip carries the same stable idempotency-key guarantee every other write-with-real-consequence in this document carries. (Still true, unaffected by the rework.)
- *brand/tone-of-voice.md*, "celebration is about her, plainly stated, never inflated" — §3.10c reuses that document's own literal worked example verbatim. (Still true, unaffected by the rework.)
- ~~*global-principles.md*, "never ask twice" — extended 2026-09-07: the same offer is checked on every ordinary app open...~~ Superseded — the 2026-09-07 session-resume check this referred to is removed outright (§2.1 step 1, restored to its simpler form).

**§2.2/§3.7e defect fix (Slice 12 `merchant-user-tester`, 2026-09-07):**
- *"Never ask twice"* — extended, not contradicted, by §3.7e: this confirms a fact never yet confirmed (whether THIS number, on a device with different prior history, is really hers), not a re-ask of anything already settled.
- The same reasoning `onboarding.md §6` gives every real-commitment tap in this family ("the extra tap protects a real commitment from a stray tap") — extended here to protect a Business-creation commitment, the single highest-consequence write this document gates, from a plain typing mistake.
- *brand/tone-of-voice.md* — §3.7e states the one fact that matters (no Business exists yet under this number) before asking anything — the identical two-beat shape every other confirm/error state in this document already uses (§3.7c, `settings.md §3.8`).

**Google/Email activation (`decision-log.md` D62/D63, added 2026-09-13):**
- *global-principles.md*, "business language before technical language" — §3.2a presents three named actions ("Continuar con Google/correo/número celular"), never a technical method-type picker.
- *global-principles.md*, "never ask twice" — §2.2's generalized branch resolves which credential/User this is exactly once, regardless of method, never asking "¿ya tienes cuenta?" through any of the three paths.
- *architecture-principles.md* #7 (idempotent/keyed retries) — extended explicitly to §3.2c's Google-callback resolution and §3.2e/§3.2f's email send, the identical guarantee §3.5/§3.7 already carry.
- *tone-of-voice.md*, "state facts before offering an opinion" — §3.2d states what happened (couldn't continue with Google) before offering the fix, same two-beat shape as every other error state in this document; §3.2c's cancel-is-silent design applies the same discipline in the other direction — no manufactured "something went wrong" framing for a moment where nothing did.
- *global-principles.md*, "the fastest interaction is the one that never happens" — weighed explicitly against, not silently overridden: §1's "tension" section names the one real cost this activation adds (one extra tap on every path, including the previously-optimized phone path) as a deliberate trade, not an oversight.

**§2.0/§2.2a rework (RFC 0013, token-based Invitation, added 2026-09-14):**
- *global-principles.md*, "capture business truth once, reuse it forever" — §3.13a's dead-link copy and destination logic are reused verbatim across both the pre-auth peek discovery and the post-auth accept-race outcome, never re-authored for the same fact.
- *global-principles.md*, "never ask twice" — extended: an Invitation is now only ever surfaced by opening its own link, never re-surfaced on an unrelated ordinary app open; declining costs nothing to re-litigate since there's nothing left to remember (§2.2a step 4).
- *architecture-principles.md* #7 (idempotent/keyed retries) — `accept_invitation`'s CAS-guarded, idempotency-keyed write reuses the exact same guarantee class every other real-consequence write in this document already carries.
- *global-principles.md*, "the fastest interaction is the one that never happens" — offering the same, already-approved §3.2a–§3.2f authentication screens rather than a parallel invitation-specific login UI; no new authentication surface built for one entry point.
- *brand/tone-of-voice.md*, "state facts before offering an opinion" — §3.10d/§3.10e both state the underlying fact (already a member; access was cancelled) before anything else, the identical two-beat shape every other state in this document already uses.

**§2.0 step 4 / §3.7e second-entry-point closure (Team Invitations Blocker fix, added 2026-09-14):**
- *global-principles.md*, "never ask twice" — resolving an already-pending §3.7e confirmation in place means she is never forced to redo a full credential re-verification for something that already succeeded.
- *global-principles.md*, "capture business truth once, reuse it forever" — extended here to interaction patterns, not just data: reuses §3.7e's own already-Approved screen and copy verbatim rather than authoring a parallel confirmation surface for this one entry point.
- The same reasoning `onboarding.md §6` gives every real-commitment tap in this family, already applied to ordinary §3.7e (§9, above) — extended here to the identical commitment reached via a second path.

**§2.0/§2.2a/§3.2g/§3.10f addition (RFC 0014/D70, `targetHint` enforced, 2026-09-15):**
- *global-principles.md*, "never ask twice" — the email is given exactly once, by the OWNER, at invite-creation (`settings.md §3.12`); the invited person is never asked to type or re-confirm it, only to receive and enter the code sent there.
- *architecture-principles.md* #7 (idempotent/keyed writes) — `accept_invitation()`'s new precondition check runs inside the identical CAS-guarded, idempotency-keyed write §2.2a already carries; a retried accept under `invitation_identity_mismatch` never risks a duplicate or ambiguous outcome.
- *brand/tone-of-voice.md*, "state facts before offering an opinion" — §3.10f states the actual fact (this account and this invitation's own email don't match) before offering the one real fix, the identical two-beat shape §3.10d/§3.10e already use. Never "invitación inválida" — the invitation itself is fine, RFC 0014's own named register, held to literally.
- *global-principles.md*, "the fastest interaction is the one that never happens" — weighed explicitly, not silently overridden, the same posture §1's own §3.2a tension already models: RFC 0014 removes a choice (which method) precisely because offering it here was itself the security hole, not a convenience — the friction traded away is real, named, and accepted by the Product Owner directly ("I think email is fine," `decision-log.md` D70), not a UX oversight.

## 10. Decisions made

- **Named `authentication.md`, not `owner-access.md`** — the screens designed here aren't Owner-specific; naming the file after one outcome of a successful verification would overstate what's on screen. Reasoned in full at the top of this document.
- **No interstitial "¡verificado!" screen between OTP success and `onboarding.md §3.3`.** A first-time verification hands off silently and immediately — adding a ceremony screen here would pad a moment `onboarding.md §3.3`'s own warm welcome copy already covers, the same restraint `onboarding.md §10` already applied when it merged its own Bienvenida and path-choice screens into one.
- **Device-level session persistence assumed** — verified once per device, never re-asked on subsequent opens. The storage mechanism itself is left below this document's abstraction level, the same treatment `onboarding.md §0` already gives comparable platform questions.
- **+52-prefixed, 10-digit Mexican mobile number; 6-digit code; 30-second resend cooldown; 5-minute code validity; 5-attempt soft-invalidation bound** — five explicit judgment calls, none derived from the Foundation, all named plainly rather than silently assumed (§3.3, §3.6, §3.7b, §3.7c).
- **§3.7c's "too many attempts" state is a soft, code-level invalidation, never a hard account/device lockout** — reasoned explicitly against `brand/brand-guide.md`'s tone, not defaulted to a generic security pattern. Copy itself revised per a completed `brand-guardian` consultation — see §3.7c, §8.
- **§2.2 case 3 (returning phone, new device, already-onboarded Business) is explicitly marked "Not yet resolved"** rather than invented — routed to a new Product Decision (Q18) and a new Architect Question (Q17).
- **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-decisions-10`]** Logout / account-session-management UI — resolved. `settings.md §2.5` ("Cerrar sesión") now designs exactly this, activating §2.2 case 2 above for the first time.
- **Pending-Invitation check runs first, before the existing three-way branch (§2.2, §2.2a, 2026-09-06)** — never lets a first-time-verifying invited phone even briefly resolve toward Business-creation. **[Superseded 2026-09-14, RFC 0013/D64 — see `authentication.changelog.md#2026-09-14-rfc0013-token-invitation`.]** This role is now played by §2.0 step 1's link-detection check, which runs even earlier — before authentication ever starts, not merely before the three-way branch that follows it.
- **A second/simultaneous pending Invitation resolves by recency, no picker** — a plain judgment call, not derived from the Foundation, revisited only if real evidence surfaces the case. **[Superseded 2026-09-14, RFC 0013/D64 — see `authentication.changelog.md#2026-09-14-rfc0013-token-invitation`.]** The multi-pending-Invitation tie-break this bullet describes no longer exists — a token always identifies exactly one Invitation, so there's no ambiguity left to tie-break (§2.2a step 4, §8 item 7's own matching closure).
- **Accepting costs one real confirming tap (§3.10); declining costs zero** — matches this document's own existing asymmetry between committing actions and reversible/no-cost ones.
- **§3.13a reuses `settings.md §3.14`'s exact non-diagnostic register** rather than inventing a second tone for a closely related "you don't have standing here" moment.
- **§3.10c's `brand-guardian` consultation (§8, item 8) is complete — copy left as-is, deliberately deferred, not treated as a blocking finding.** See §8 for the full reasoning and the on-record candidate replacement if this screen is next revisited.
- **§2.1's session-resume check now also tests for a pending Invitation on a phone with zero standing anywhere (2026-09-07).** The original case-0 gate ("never verified before, anywhere") missed a real population: verified once, stalled before choosing an Onboarding path, invited later. Corrected to test the state that matters (zero Business/Membership anywhere) rather than verification history, checked at both entry points that can reach it. Declining is remembered per-device per-Invitation so the "never ask twice" bar holds even though this check now runs on every app open, not just once at OTP-confirm. **[Superseded 2026-09-14, RFC 0013 — see the bullets below.]**
- ~~Phone/WhatsApp kept as a fully available acceptance-side authentication method, alongside Google/Email, reusing §3.2a–§3.2f verbatim — added 2026-09-14. `business-decisions.md` Q19 concerns full Meta Business Verification for production Sender status, a separate business question; WhatsApp OTP delivery itself is real and live in this pilot. Stripping phone from only the acceptance path, while keeping it for ordinary entry, would be an arbitrary, unexplained asymmetry — a `ux-designer` call, stated plainly.~~ **Superseded 2026-09-15, RFC 0014/D70 — see the bullet below.**
- **Offer-before-authentication sequencing composes three already-approved elements (§3.10's decision-screen shape, §3.2a's entry point, §3.8's state-carrying-across-interruption mechanism) rather than a new interaction pattern — added 2026-09-14.** Not a `knowledge-mentor` consultation candidate, the identical reasoning this document's own 2026-09-07 device-history-check composition already used.
- **§3.13a reused verbatim as the shared "gone" state for both the pre-auth peek discovery and the post-auth accept-time race, rather than two separate dead-link screens — added 2026-09-14.** Same underlying fact, same non-diagnostic restraint already established there.
- **`already_member` and `membership_revoked` get distinct, honest copy rather than being collapsed into §3.13a's generic framing — added 2026-09-14.** Both states are meaningfully different facts (she does have standing; she used to and lost it) that "this invitation is unavailable" would misstate or under-explain.
- **No `brand-guardian`/`knowledge-mentor` consultation run for this amendment — added 2026-09-14, reasoned explicitly rather than silently skipped.** The three genuinely new copy instances (§3.9b's platform error, §3.10d's already-a-member fact, §3.10e's revoked-access fact) are each routine compositions of already-reviewed register patterns already live in this document/`settings.md` family — not a first-of-its-kind emotional or tonal situation; the offer-before-authentication sequencing is likewise composition, not a new pattern (see the bullet above).
- **The multi-pending-Invitation tie-break and per-device decline-memory marker are both eliminated, not carried forward — added 2026-09-14.** RFC 0013 §2's own structural reasoning, not a new `ux-designer` judgment call.
- **§2.1's 2026-09-07 session-resume Invitation sub-check is removed outright, restoring the simpler pre-2026-09-07 form — added 2026-09-14.** RFC 0013 §6's own explicit instruction, since Invitations are no longer discoverable via any implicit session/phone match.
- **§2.2 case 1 gains a device-history check before handing off to `onboarding.md §3.3` (2026-09-07, Slice 12 `merchant-user-tester` defect).** A first-time-anywhere phone verifying on a device that remembers a different phone's prior session is shown its own typed number back, once, before a new Business is created under it. Fires only for that narrow, real-risk intersection — never for the ordinary first-ever-device case. Grounded in composing two already-reviewed conventions rather than inventing a new one: reflecting typed data back to her (§3.6's own OTP-destination line) and a plain confirm/correct choice for a real commitment (`settings.md §3.8`'s "Cerrar sesión" shape, §3.10's accept/decline shape) — not a `knowledge-mentor` consultation candidate, since neither element is new to this document family, only their combination.
- **§2.0 step 4 gains a third branch, between its existing YES/NO test, for a device sitting on an unconfirmed §3.7e gate — added 2026-09-14, closing a spec-authorization gap `reviewer` surfaced re-verifying a Team Invitations Blocker fix.** The spec's literal two-way text routed this case to §3.2a (fresh method-choice) — checked explicitly and rejected: that routing forces a redundant full re-verification of an already-verified credential ("never ask twice," `global-principles.md`) and, worse, would cause §2.2 case 1's own "never verified before, anywhere" test to fail on the retry, silently defeating the device-history check that gates §3.7e in the first place — a real safety regression, not merely extra friction. The built fix (reuse §3.7e in place, gate the accept write behind it, no session drop, thread the Invitation-context line) is authorized as the correct design instead. Not a new interaction pattern — composes only already-Approved elements (§3.7e's screen, the M1 context-line mechanism, §3.7e's own existing revert-and-return shape) — so no `knowledge-mentor` consultation was run, matching this document's own established precedent for identically-shaped compositions (see the bullets above). No new copy introduced (§3.7e's text is reused verbatim), so no `brand-guardian` consultation was run either.
- **Email uses a numeric code, not a magic link — added 2026-09-13.** A magic link requires leaving the app into a mail client and, on mobile, frequently resolves into a browser rather than back into the app — a real, documented deep-link reliability gap, not hypothetical. A code also lets Email reuse the entire already-Approved "Ingresa el código" state machine (§3.6–§3.7e) verbatim, generalized only to show the right identifier back to her — versus a magic link needing its own entirely new "revisa tu correo"/expired-link/already-used-link state family with no existing precedent in this document. A `ux-designer` judgment call, stated plainly per this folder's own convention for undecided-by-the-Foundation numbers (§8 item 3), not asserted as the only valid choice.
- **All three sign-in methods presented as equal-weight options, order stated as a non-priority judgment call (Google, Correo, Número celular) — added 2026-09-13.** Reasoned explicitly in §3.2a, not asserted as validated.
- **Google's redirect-cancel treated as a non-event, not an error — added 2026-09-13.** A deliberate distinction from a genuine platform error (§3.2d), reasoned against `tone-of-voice.md`'s "never manufacture a problem that didn't happen."
- **No account-linking UI designed in this amendment — added 2026-09-13.** RFC 0012 §5's duplicate-User gap is named as a live, accepted risk (§8 item 11), not solved here; this document only activates the three methods as independent cold-sign-up entry points, per D63's own explicit scope.
- **§2.2a/§3.10–§3.13a (Invitation acceptance) left entirely untouched by this amendment, including §2.2 case 0's literal phone-specific text — added 2026-09-13.** Correctly phone-scoped per RFC 0012 §3 *at the time this amendment was made* — touching it here risked getting ahead of that separately-in-progress work. **Now stale, not merely deferred** — RFC 0013/D64 was Accepted the same day and reworked `Invitation` to be token-keyed; this document's own Invitation sections need their own follow-up amendment (`architect`-caught, see the banner and §2.2's own note above).
- **§2.1 gains a new step 0, checked before the ordinary valid-session test — added 2026-09-13, `ux-critic`-caught contradiction, closed.** The first remediation round extended §3.8's resumability claim to cover §3.7e without checking whether §2.1's own step-priority logic actually supported it — it didn't: a bare successful verification already satisfies "valid session" (step 1), so an interruption landing exactly between verification success and her §3.7e tap would have silently fallen through past the confirmation screen the moment ordinary step 1 logic ran, defeating its own safety purpose. Step 0 closes this the same way §2.2's own step 0 already outranks its 1–3 for the Invitation check — checked first, resumes directly to §3.7e, never lets the ordinary session check treat an unconfirmed §3.7e as settled.
- **RFC 0014/D70, 2026-09-15: Invitation-acceptance now authenticates specifically through a pre-filled, locked Email sub-flow (§3.2g) — supersedes this document's own 2026-09-13 "Phone/WhatsApp kept as a fully available acceptance-side authentication method... reusing §3.2a–§3.2f verbatim" decision, on that one point only.** That earlier decision reasoned against an arbitrary asymmetry between ordinary entry and Invitation-acceptance entry — correct reasoning at the time, superseded now by a real, named technical/security requirement: Google's `AuthIdentity` never captures a real email to check `targetHint` against (`decision-log.md` D70's own reasoning), so only Email specifically can be checked cleanly. Ordinary (non-Invitation) entry is completely unaffected — §3.2a's three-way choice, and phone/Google as first-class methods generally, remain exactly as designed for every other entry point into this document.
- **§3.2a's own 2026-09-14 "Invitation-context variant" is retired, not deleted, by this correction** — nothing routes into it any longer, since §2.0 step 4/§3.10's own "no session" branch now goes to §3.2g instead. Kept, marked superseded, per this document's own non-deletion discipline (the same treatment §2.2a step 4 already gives the retired multi-pending tie-break).
- **New defensive state §3.10f, reached from §2.2a's new `invitation_identity_mismatch` outcome, reused identically regardless of which of RFC 0014's two named paths produced it** — the same "this document has no reliable way to distinguish, and shouldn't guess" restraint §3.13a already models, applied here to a new outcome rather than reinvented.
- **No `knowledge-mentor` consultation run for §3.2g's own shape — reasoned explicitly, not silently skipped.** It composes three already-Approved elements: §3.7e's "reflect a known identifier back to her, plainly, before committing" shape, §3.10's own zero-cost "Ahora no" decline, and §3.5/§3.6's already channel-neutral send/confirm mechanism — the identical "composition, not a new pattern" reasoning this document already applied to its own 2026-09-14 offer-before-authentication sequencing (§10, above).
- **No `brand-guardian` consultation run for §3.10f's copy — reasoned explicitly.** Its two-beat "state the fact, then the one real fix" shape and its literal "never say invalid, the invitation is fine" register are both RFC 0014's own explicit, named instruction (`decision-log.md` D70), not a fresh tonal judgment call this document is making independently — the same posture already justified for §3.9b/§3.10d/§3.10e's own routine-composition copy (§10, 2026-09-14 entry, above).
- **§3.10f's "Cerrar sesión e intentar de nuevo" runs without a second confirming dialog, deliberately — reasoned explicitly against `settings.md §2.5`'s own ordinary entry point, which does show one.** There, the sign-out row itself carries no context, so a confirm dialog is the one deliberate tap for that real commitment. Here, she's already read the full explanation on §3.10f itself before this button is even visible — a second "¿Cerrar tu sesión?" dialog on top would be a second confirming tap for the identical decision, which `onboarding.md §6`'s own standard ("never zero, never two") argues against.

## 11. Future considerations

- **Invitation flow / SELLER-role onboarding — acceptance now designed against the correct token-based model (reworked 2026-09-14, RFC 0013/D64, superseding the earlier phone-keyed design).** What remains genuinely open: how an invited SELLER's Role gets attached (accepting writes `BusinessMembership` directly, §2.2a step 1 — no separate "attach a role" step exists). **Cancelling/expiring a pending Invitation from the issuing side is resolved** (`settings.md §8` items 11/12, closed 2026-09-13, RFC 0013/D64) — stale "unresolved there" wording corrected here in the same pass as §8 item 9.
- **[Amended 2026-08-13 — see `authentication.changelog.md#2026-08-13-future-11`]** Self-service logout / account-level session management — resolved. `settings.md §2.5` ("Cerrar sesión") now designs exactly this.
- **Multi-Business-per-phone — partially addressed as of 2026-09-06, narrowed further 2026-09-07 and again 2026-09-14.** `product-decisions.md` Q24/Q25 resolved that a User may belong to more than one Business; this document's §2.2 cases 2/3 name the real, still-undesigned intersection with a pending Invitation. **Narrowed 2026-09-14** — the token-based discovery mechanism itself has no intersection problem with existing Memberships elsewhere (§8 item 6, superseded/narrowed); only the still-real, still-undesigned Business-switching surface stays open.
- **A merchant-visible display name for a team member** — same gap `settings.md §2.7`/§11 already names; this document's §3.10 inherits the identical limitation (no way to name the inviting OWNER personally).
- **Account linking / duplicate-User merge — added 2026-09-13.** The real gap named in §8 item 11, not designed here; a future RFC's own scope once evidence or a Product Owner decision warrants it.
- **Apple Sign-In — added 2026-09-13.** Modeled in RFC 0012's schema (`AuthIdentity.type` includes `apple`) but not activated by D62/D63 and not designed in this amendment. Same posture this document already takes toward anything schema-ready-but-not-yet-exposed.
- **`settings.md` "Tu cuenta" zero-phone display state — added 2026-09-13.** Flagged, not fixed here — see §8 item 12.
- **`onboarding.md §0`'s own "Authentication... implementation-level concern below this spec's abstraction level" framing is now stale** now that this document exists as a real spec for exactly that concern. Flagged for whoever next amends `onboarding.md` — not resolved here, since `onboarding.md` is treated as frozen for this task.
- **A persistent, read-only display of her own verified phone number somewhere in `settings.md` — Resolved 2026-09-07.** First flagged 2026-08-13 (`merchant-user-tester` walk of "Tu cuenta," read as "an unfinished corner"), logged then as a mild want; a second, later `merchant-user-tester` walk of Slice 12 confirmed it as a real, severe defect once routine sign-out/sign-in cycling became part of the multi-Membership workflow (`product/02-ux/experience-review-2026-09-07-slice-12-team-invite.md`) — a mistyped digit on re-verification silently produced a brand-new, empty Business with no way back, directly contradicting the sign-out screen's own "no se pierde nada" promise. Closed by `settings.md §2.5`/§3.3a now showing her own verified number, read-only, in "Tu cuenta," paired with this document's own §2.2/§3.7e device-history check.
- **The device-history marker §2.2/§3.7e relies on is itself a plain local fact, not a domain concept** — if a device's local storage is ever cleared independently of a deliberate sign-out (app reinstall, cache clear), this safeguard silently stops firing for that device, the same limitation §2.1's own session-persistence mechanism already has. Not designed around here, consistent with this document's existing abstraction-level line.
- ~~A post-acceptance soft mismatch warning (`targetHint` vs. the resolved authenticated identity) — added 2026-09-14.~~ **Superseded 2026-09-15 (RFC 0014/D70)** — resolved as a hard block, not a soft warning; see §2.0/§2.2a/§3.2g/§3.10f, this same amendment.
- **Whether `invitation_identity_mismatch`'s two named technical paths ever need distinguishing UI — added 2026-09-15 (§8, item 16).** Not designed here, no evidence yet it's needed.

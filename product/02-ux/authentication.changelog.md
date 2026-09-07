# Authentication — Changelog

Historical reasoning, superseded framing, and decision provenance for
`authentication.md`'s amendments — moved out of the spec itself so the spec
stays skimmable for building/reviewing against, while none of the reasoning
is lost. Every entry here is dated and cross-referenced from the exact
inline location `authentication.md` cites it from (a one-line pointer of
the form "**[Amended DATE — see `authentication.changelog.md#anchor`]**").
This file carries no current normative rule text — anything an implementer
needs to build or review against always stays inline in `authentication.md`
itself.

---

## 2026-08-13 — Account-level sign-out makes §2.2 case 2 reachable

**Root decision:** `settings.md §2.5` (Product Owner decision, 2026-08-13)
adds a "Cerrar sesión" (account-level sign-out) action. Full reasoning for
that action itself lives in `settings.md`'s own status header and
§2.5/§2.5a — intentionally not duplicated here, per this document's own
original cross-reference discipline.

**Why this document needed correcting:** before this decision, nothing in
the product ever cleared a device's verified-phone session while its local
Business record stayed intact — so `authentication.md` §2.2 case 2 (a phone
already verified on this device, with a Business already local to it) was
named explicitly but described as theoretically unreachable. The new
"Cerrar sesión" action is exactly the mechanism that creates that condition
on purpose. That single change cascaded into corrections across this
document: the front-matter status header, §2.2 case 2's own resolution
text, §4's flow line for that case, and the record-keeping in §8 item 4,
§10, and §11 (each of which had previously logged this as an open/
theoretical gap and now needed to mark it resolved).

### §2.2 case 2 / status header / §4 flow line
*(cite as `authentication.changelog.md#2026-08-13-case-2`)*

This document's original draft marked this branch as theoretically
unreachable, reasoning that nothing ever cleared a device's verified-
session fact while its local Business record stayed intact. As of this
decision (Product Owner, 2026-08-13) it's reachable: a deliberate
account-level sign-out (`settings.md §2.5`) creates exactly that condition
on purpose. The front-matter status-header paragraph and §4's flow-line
annotation both point to this same entry — neither restates the reasoning
independently; the case-2 resolution text in §2.2 itself is where the
corrected current logic actually lives.

### §8 item 4
*(cite as `authentication.changelog.md#2026-08-13-open-q4`)*

This item was originally logged as a named-but-unreachable gap. It's
resolved by the same `settings.md §2.5` decision above. No amendment to
this document's own domain/flow logic beyond the case-2 and §4 corrections
was needed — the case's destination was always well-defined once reachable;
only its "not reachable" framing was stale. Kept in §8, marked resolved
rather than deleted, for continuity of the record.

### §10 decisions-made bullet
*(cite as `authentication.changelog.md#2026-08-13-decisions-10`)*

Originally logged as an open gap: no logout/account-session-management UI
existed anywhere in the product, so this branch had no real mechanism to
reach it. `settings.md §2.5`'s "Cerrar sesión" action (Product Owner
decision, 2026-08-13) is the concrete resolution. The bullet is kept in
§10, marked resolved rather than deleted, so the record of what was once a
genuinely open gap stays visible rather than silently disappearing.

### §11 future-considerations bullet
*(cite as `authentication.changelog.md#2026-08-13-future-11`)*

Same resolution as §10 above. Originally listed under Future Considerations
as a self-service logout / account-level session management gap not
designed anywhere in the product. `settings.md §2.5`'s "Cerrar sesión"
action (Product Owner decision, 2026-08-13) resolves it. Kept in §11,
marked resolved, for the same continuity discipline `settings.md §8` item 5
already models for its own once-open `defaultSellingMode` gap.

---

## 2026-09-07 — Session-resume also checks for a pending Invitation, closing a gap Slice 12's build surfaced

**Root decision:** building Slice 12 (Q24/Q25 first usable version — multi-staff concurrent selling) into `product/02c-high-fidelity-prototype/`, `ui-designer` found the literal §2.2 case-0 gate ("has this phone never been verified before, anywhere") never fires for a real, reachable population: a phone that verifies successfully, never completes Onboarding (no Business, no Membership anywhere), and only later — on an ordinary app reopen, no fresh OTP confirm — receives a pending Invitation. The build picked a behavior (proactively offer it) to make the app runnable; `architect` confirmed the scenario is real and the resolution reasonable, but flagged it as an unrouted code-level decision needing a proper spec amendment (`product/02-ux/CLAUDE.md` §4). `ux-designer` drafted the amendment; no new screen, copy, or interaction pattern — a corrected branch condition (test standing, not verification history) and a second entry point into the already-reviewed §3.10 offer screen, plus a repeat-ask guard.

### §2.1 case 1
*(cite as `authentication.changelog.md#2026-09-07-session-resume-invitation`)*

Original text, before this amendment:

> 1. Does this device already hold a valid verified-phone session? (The
>    storage/validity mechanism itself is left as an implementation detail —
>    same posture `onboarding.md` §0 already gives "how the platform
>    determines which device/account maps to which Business.")
>      → YES: Authentication is never shown — not even a flash of a phone/
>        OTP screen. Control passes directly and silently to `onboarding.md`'s
>        own resolution logic (`onboarding.md §2.1`), unchanged. Whether a
>        complete Business exists, an incomplete one, or none yet is entirely
>        that document's own question to resolve from here — this document
>        has nothing further to say once a session is confirmed valid.

Corrected to check, once, whether this User holds zero `BusinessMembership`/Business anywhere and has an undeclined pending Invitation, before delegating to `onboarding.md` — see the current §2.1 text for the live version.

### §2.2 case 0

Original text, before this amendment:

> 0. [Checked FIRST, before 1–3 below — this ordering matters] Does this
>    phone have a pending Invitation (`Invitation.status = pending`,
>    `Invitation.phone` = this verified number) AND has this phone never
>    been verified before, anywhere (the same condition that would
>    otherwise route it into case 1)?
>      → YES → Invitation-acceptance branch. See §2.2a. Never
>        `onboarding.md §3.3`'s Business-creation handoff.
>      → NO → fall through to cases 1–3 below, entirely unchanged from the
>        Approved text.

The "never been verified before, anywhere" clause used verification history as a stand-in for "has she landed anywhere yet" — correct for a true first-timer, but it silently excluded the population above. Corrected to test zero-Membership/zero-Business standing directly — see the current §2.2 case 0 text for the live version and its own inline reasoning.

### §8 item 6

Original text, before this amendment:

> 6. **Multi-Business membership intersecting with a pending Invitation (§2.2 cases 2/3's new notes, 2026-09-06, `product-decisions.md` Q24/Q25)** — genuinely undesigned. A phone that already has a local/known Business elsewhere and also holds a pending Invitation falls through to that case's ordinary behavior, unchanged; the Invitation simply waits. `product-decisions.md` Q24/Q25 item 1 already names the underlying gap (no Business-switching surface exists) — this doesn't newly discover it, only confirms it also applies at this specific junction.

Split into sub-case (a), Resolved by this amendment, and sub-case (b), still open — see the current §8 item 6 text. The stale cross-reference ("Q24/Q25 item 1") is also corrected to item 3, the entry that actually names the no-Business-switching-surface gap.

# Experience Review — 2026-09-07: Slice 12 team-invite / multi-Membership walkthrough

**Persona:** Ana. **Purpose:** `merchant-user-tester` walk of Slice 12 (Q24/Q25 first usable version — multi-staff concurrent selling) against the live `product/02c-high-fidelity-prototype/` dev server, after `ux-critic`/`reviewer` both passed clean on the built code. Task: invite a sister as a SELLER, sign out and accept the invitation as her (a different phone number), explore her scoped-down experience, then (as OWNER again) allocate Event-scoped stock and revoke the sister's access.

## Finding — inviting a SELLER and accepting as her both worked cleanly

**Verification status: Independently Verified** (live walkthrough, click-by-click record in the agent's own report). "Configuración" → "Tu equipo" → "Invitar a alguien" was exactly where Ana expected it; the offer screen clearly stated what the invited person could and couldn't do before sending. The sign-out confirmation dialog's explicit "nada se pierde" reassurance built real trust. Accepting the invitation as the sister (a genuinely different, never-before-verified phone number) was clean end to end: phone → OTP → "Te invitaron a vender con..." → "Aceptar y empezar a vender" → welcome → Home. The sister's scoped-down Home experience (Hoy-only nav, "Tu cuenta" instead of "Configuración," her own separate "Hoy: $0 · 0 ventas" counter drawing on the same shared stock) read as appropriately limited without feeling broken or incomplete — Ana called this "genuinely useful."

## Finding — signing back in as the OWNER silently created a new business, with no recovery path — real defect, severe, fix in progress

**Run 1 (only run — task stopped here).** After exploring as the sister and signing out again, Ana tried to sign back in as herself. She had never been shown her own phone number anywhere in the app (Home, Configuración/"Tu cuenta," the sign-out dialog — nowhere), so she typed a number from memory. It didn't match her real one. The app gave zero indication anything was wrong — no "no reconocemos este número," no error, nothing — and instead routed her straight into fresh Onboarding ("¿Cómo quieres empezar?"), the same screen a genuinely brand-new merchant would see. Reopening the app fresh didn't recover her original account either. She stopped the task at this point rather than tapping "Empezar gratis," reasoning correctly that a real merchant wouldn't do that either — she'd stop, unsettled, and go looking for help.

**Verification status: Independently Verified** (Ana's own click-by-click record; the underlying behavior — a never-before-verified phone proceeds directly into fresh Onboarding, no separate "create account" step — is confirmed-correct per `decision-log.md` D44's Owner-creation invariant, checked directly against `product/99-rfc/0007-user-and-business-membership.md`). The defect isn't that behavior in isolation — it's that Ana had no way to know whether the number she typed was genuinely new or her own, mistyped, and the app never disclosed the distinction at the one moment it mattered.

**Root cause, already partially known, now much higher-stakes.** `authentication.md` §11 already named this exact gap as a deferred Future Consideration, first flagged 2026-08-13 by an earlier `merchant-user-tester` walk of Configuración's "Tu cuenta" section: "A persistent, read-only display of her own verified phone number somewhere in `settings.md` — not designed here." That gap predates Slice 12 and was low-stakes when a device rarely needed re-verification. Slice 12's entire point — real multi-Membership switching, inviting staff, accepting as them, switching back — makes signing out and back in a routine, expected part of the workflow for the first time, turning a minor omission into a genuinely dangerous one. Ana's own reaction confirms this precisely: "that's the moment I'd start worrying about whether my sales history was actually safe" — directly contradicting the sign-out dialog's own explicit promise seconds earlier ("nada se pierde").

**Status: real defect, confirmed, not yet fixed.** Routed to `ux-designer` (2026-09-07) to design the smallest correction — reading the actual current `authentication.md`/`settings.md` flow rather than assuming a fix shape in advance. Blocks Slice 12's fold-back into Approved until closed and re-verified by a fresh Ana walkthrough from the beginning, per this project's own "full rerun, not a resume" discipline.

## Diagnostics not reached

Steps 4 (OWNER allocating Event-scoped stock) and 5 (revoking the sister's access, checking her locked-out state) were never attempted — Ana could not regain access to the OWNER account after signing out, so the task stopped before reaching them. These remain genuinely untested by this walkthrough; a follow-up rerun (after the recovery-path fix lands) needs to cover them, not just re-confirm steps 1-3.

## What worked well

The invite flow, the sign-out reassurance, and the sister's scoped-down SELLER experience all read as trustworthy and well-built — Ana specifically said she'd have recommended this to another vendor up through that point. The business name shown throughout the sister's acceptance flow ("Negocio Pagado," a plan-tier label rather than an actual shop name) read as placeholder-ish and is worth a look, but is a pre-existing seeded-demo-data artifact, not something Slice 12 introduced — not raised as a separate finding here.

## Status

One severe, confirmed defect blocks approval — fix in progress. Two of five task steps (Event allocation, revocation) remain genuinely untested and need their own coverage once a rerun is possible.

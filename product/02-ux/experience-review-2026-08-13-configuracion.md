# Experience Review — 2026-08-13: Configuración (plan management, selling mode, sign out/sign in)

**Persona:** Ana. **Purpose:** first-ever `merchant-user-tester` walk of Configuración (`product/02c-high-fidelity-prototype/`, Slice 4), after `ux-critic`/`reviewer` both passed clean. Path: fresh onboarding (Empezar gratis) → find Configuración from Home's "⋯" menu → upgrade to Paid → switch selling mode to tags → downgrade back to Free (read consequences) → cancel the pending downgrade → sign out → re-verify with the same phone → confirm everything persisted.

## Core question 1: is the settings area findable and does it explain consequences honestly — Validated

Ana found Configuración via Home's "Controles" menu without difficulty, and each capability action (upgrade, downgrade, selling-mode switch) explained its consequence in specific, named terms (exact dates, exact losses, "no se te cobra nada aquí") before asking for confirmation — read by Ana as exceeding her expectation for a first "settings" screen. **Verification status: Independently Verified.**

## Core question 2: does sign-out/re-verify genuinely preserve everything — Validated

After signing out and re-verifying with the same phone number, Ana landed directly on her existing Home — same business, same product, same plan ("Pago"), same selling mode ("Con tags") — no re-onboarding, nothing lost. Read as the strongest trust moment in the walk: the sign-out confirmation's "no se pierde nada" promise "proved literally true when tested." **Verification status: Independently Verified.**

## Finding — `defaultSellingMode`'s "Desde tu próxima sesión" wording briefly read as a pending change, unlike it actually is

After confirming "Cambiar a vender con tags," the confirmation copy read "Desde tu próxima sesión, vas a empezar vendiendo con tags" — Ana interpreted this as "this won't happen until later," the same shape as the plan-downgrade's genuine pending state. But Configuración's own summary immediately showed "Con tags" with no pending marker at all, unlike the downgrade case's clear "(cambia a Gratis el 12 sep)" parenthetical. This is not a build defect — `settings.md §2.3` deliberately specifies `defaultSellingMode` as immediate with no pending-value structure at all: the *setting* saves right away (correctly shown immediately), while the copy's "próxima sesión" phrasing refers to Session-start's own once-per-Session mode resolution (D23), a different, narrower fact. The distinction is real and intentional, but the copy doesn't fully disambiguate it from the adjacent pending-downgrade pattern one screen over, and a first-time merchant read it as the same kind of "wait and see" state. **Verification status: Independently Verified** (the felt confusion) — **root cause confirmed correct-per-spec via `settings.md §2.3`**, not a defect. Logged as a copy-clarity candidate for a future pass, not routed as a fix now — the underlying behavior is correct and the confusion resolved itself once Ana actually tested a fresh session.

## Finding — no phone number or account identifier shown anywhere in "Tu cuenta"

"Tu cuenta" renders only a section header and the "Cerrar sesión" button — no way to confirm which number the device is verified under, except transiently on the OTP screen during entry. Read by Ana as "an unfinished corner." This is an already-named, explicitly out-of-scope item — `authentication.md §11`: "A persistent, read-only display of her own verified phone number somewhere in `settings.md` — not designed here, no evidence of need yet." This walkthrough is the first real evidence of a (mild) want. **Verification status: Independently Verified** (the observation) — routed as new evidence against an already-logged future consideration, not a new finding requiring action now.

## Not treated as a defect — one tooling-level click-timeout artifact

A `click` on the onboarding "Entrar" button returned a timeout error; the next snapshot showed navigation had already succeeded. Same benign tooling artifact pattern already documented for this codebase (Slice 2's own experience review) — not investigated further, not Ana-facing.

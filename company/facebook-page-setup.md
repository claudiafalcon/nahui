# Facebook Page Setup — Draft for Product Owner Review

**Status: DRAFT ONLY. Nothing created, nothing published.** Prepared by Marketing per the Product Owner's request, under the standing Approval gate (`.claude/agents/marketing.md`) and the account/governance model in `company/marketing-operating-environment.md`. No account exists yet; no username has been reserved; no image has been uploaded. Everything below is a recommendation awaiting explicit sign-off, item by item.

---

## Framing correction (read this before the rest)

The request was to make this Page "match our Instagram account." **No Instagram account exists yet either.** Per `company/marketing-operating-environment.md`, nothing in Marketing's account list has been provisioned — Facebook Page and Instagram are both still in the "worth setting up now" column, neither is done. So there's nothing live for this Page to match.

What this document actually does instead: it establishes the **shared branding standard** — name, voice, visual treatment, contact model — derived directly from `company/brand/brand-guide.md`'s real definitions (Coral AA+ `#C13F26` / Coral `#E86248`, Fredoka/Inter, warm-direct-confident-respectful tone, "The path to what's next"). When Instagram is set up next, it should follow this same standard rather than the reverse. Saying this plainly so the "matching" framing doesn't get treated as if a source of truth already existed somewhere.

Also worth noting up front: per `company/marketing-operating-environment.md` §2, the recommended owner is **the Product Owner personally, as Business Manager admin, pending incorporation** — not a "Nahui" legal-entity account, since that entity doesn't exist yet.

---

## 1. Facebook Page name

**Recommended: `Nahui`**

- Matches the brand name exactly — no suffix needed. Facebook Page *display names* don't require platform-wide uniqueness (unlike usernames/handles below), so `Nahui` alone is safe to use even if other unrelated pages share the word.
- Avoid appending "MX" or "App" to the display name itself — the brand guide's name is just "Nahui"; adding qualifiers to the primary name dilutes it for no real benefit.
- **Fallback (only if Meta's naming policy flags the bare word for some reason, e.g. a trademark dispute):** `Nahui App`.

## 2. Username / handle

I cannot verify live availability — no browser/API access in this session (see `company/marketing-operating-environment.md`'s note on Marketing's current tool limits: Read/Write/Glob/Grep only). These are proposals to check at creation time, not confirmed-available handles.

| Priority | Handle | Rationale |
|---|---|---|
| Primary | `@NahuiApp` | Clear, matches the `nahui.app` domain conceptually, low collision risk since "Nahui" alone is a plausible generic/cultural term (Nahuatl origin) more likely to be taken bare. |
| Fallback 1 | `@SomosNahui` | "We are Nahui" — warm, on-tone, common pattern for Mexican small-business Pages. |
| Fallback 2 | `@NahuiMX` | Geographic disambiguator, clean and short. |

Recommend checking all three (in this order) at creation time and locking whichever is actually free — don't improvise a fourth variant on the spot without it passing brand review.

## 3. Category

Meta's Page category taxonomy (as of current training knowledge — reconfirm against the live picker at creation, since Meta periodically revises category lists).

- **Primary: `Software Company`** — most precise fit. Nahui is building software (sales registration + business intelligence app); this is closer to the actual product than any retail-adjacent category.
- **Secondary (Meta allows up to 3): `Business Service`** — captures that the product serves small/informal business owners, not consumers directly.
- **Do not use:** "Shopping & Retail," "E-commerce Website," or anything implying Nahui sells physical goods or processes payments — payments/checkout is an explicit non-goal (`company/CLAUDE.md`), and a retail-flavored category would misrepresent the product to anyone browsing categories.

## 4. Short bio — Facebook "Page description" field (101-character limit, exact)

**Spanish (merchant-facing, primary):**

> Tecnología para vendedores ambulantes en México. Construyendo Nahui junto a comerciantes reales.

**Character count: 96 / 101.** Verified by manual count, leaves 5 characters of margin (no trailing edits needed).

*English gloss, internal reference only — not for publishing:* "Technology for itinerant vendors in Mexico. Building Nahui together with real merchants."

## 5. Long "About" description

Two versions: a fuller narrative for whichever surface allows more room (Meta Business Suite's "Story"/extended About), and a compact fallback sized for the classic ~255-character "long description" field in case that hard limit still applies. I don't have a verified current character cap for this specific field — flagging that rather than asserting a precise number I can't confirm this session.

**Product Truth check performed before writing this:** `product/03-build/` is empty (only a `.gitkeep`) — nothing has shipped. `product/01-validation/` holds a throwaway prototype only. So the copy below deliberately says "estamos construyendo" (we're building) throughout, never "ya puedes usar" or "descarga la app" — there is no available product yet, only Planned/in-progress work.

**Extended version (Spanish):**

> Nahui es una app que estamos construyendo para vendedoras y vendedores de bazar en México — gente que vende ropa, accesorios y más en bazares privados, ferias y tianguis, moviéndose de un lugar a otro.
>
> Sabemos que cuando llega un cliente no hay tiempo que perder anotando una venta a mano o tratando de recordar qué ya se vendió. Por eso estamos construyendo una forma de registrar cada venta en segundos — para que nunca se te pierda una venta ni el control de tu negocio, sin tener que convertirte en contadora para lograrlo.
>
> Todavía estamos en la etapa de aprender y construir junto con vendedoras y vendedores reales, así que por ahora no hay una app disponible para descargar. Si vendes en bazares y quieres contarnos cómo llevas tu negocio, o ser de las primeras personas en probar lo que estamos construyendo, escríbenos — nos encantaría conocerte.
>
> Nahui viene del náhuatl y está ligado al movimiento y las cuatro direcciones — así como tu negocio, que nunca deja de moverse.

**Compact fallback (Spanish, ~250 characters, for a hard-capped field):**

> Nahui es una app que estamos construyendo para vendedoras y vendedores de bazar en México. Queremos que registrar una venta tome segundos, no minutos, para que nunca se te escape un cliente ni el control de tu negocio. Aún estamos aprendiendo contigo — escríbenos.

*English gloss, internal reference only:* Explains Nahui is an app currently being built for itinerant bazaar vendors in Mexico; the core problem (registering a sale competes with attending the next customer) and the intent (seconds, not minutes, no accounting expertise required); states plainly nothing is available to download yet; invites the reader to talk to us or be an early tester; closes with the Nahui name's Nahuatl/movement meaning per `brand-guide.md`.

## 6. Mission statement

Not a distinct native Facebook field for a Software Company-category Page (that field exists mainly for Nonprofit-category Pages) — provided here as reusable copy for a pinned post, the Story section's framing line, or wherever Instagram's own setup wants matching language.

**Primary:**

> Creemos que un negocio ambulante no debería tener que elegir entre atender al cliente y llevar el control de sus ventas. Por eso estamos construyendo Nahui: para que cada venta quede registrada, sin quitarte tiempo del mostrador.

**Alternative (shorter):**

> Ninguna vendedora debería perder una venta por no tener un segundo para anotarla. Existimos para que cada venta cuente.

Both are grounded directly in `company/CLAUDE.md`'s core thesis (validated friction: registration competes with attending the next customer, sale records get lost) — not generic startup language, and not a claim about segmentation or bazaar-recommendation features that aren't part of the validated thesis.

## 7. Call-to-action button

**Recommended: "Send Message" (Enviar mensaje)**

Facebook's CTA options include Learn More, Sign Up, Contact Us, Shop Now, Send Message, Call Now, among others. At this stage:

- **"Sign Up" is wrong** — there's nothing to sign up for; no waitlist or landing page is live (the fake-door landing page drafted in `company/market-validation.md` §4.4 is explicitly unpublished, unapproved).
- **"Learn More" is premature** — it needs a URL to send people to, and there's no live website/landing page at `nahui.app` to point it at yet. Revisit this once a real landing page exists.
- **"Shop Now"/"Book Now" don't apply** — Nahui doesn't sell to end consumers and payments/checkout is an explicit non-goal.
- **"Send Message" fits where Nahui actually is:** a validation-stage presence whose real job right now is starting conversations (with prospective merchants, community members, potential pilot candidates) — not converting traffic. It's honest about the stage and low-commitment for whoever clicks it.

**Governance note:** per `company/marketing-operating-environment.md` §2/§14, every reply through this inbox still requires a human hand — this CTA opens a channel, it doesn't imply Marketing (the agent) can respond autonomously. Same "every message needs approval" rule applies here as anywhere else.

## 8. Profile photo recommendation

Use the **icon-only brand mark**, not the full wordmark lockup — Facebook's circular crop clips a horizontal wordmark's edges (confirmed by looking at `company/brand/raw-assets/Nahui.png`, which is a wide, edge-to-edge wordmark unsuitable for a circle crop).

- **Asset:** the four-pillar mark (`company/brand/raw-assets/Union.png`) — the plus/compass symbol representing Comercio, Clientes, Datos, and Movimiento per `brand-guide.md`'s "four pillars" description.
- **Color:** Coral `#E86248` mark on a white or Balanced (`#F4F4F4`) background. This is a decorative/brand-mark use, not text or a button fill, so base Coral is correct here — Coral AA+ is reserved for text/button-fill contexts per `brand-guide.md`'s Q12 resolution; it doesn't apply to an icon mark like this.
- **Crop guidance:** center the mark with generous padding (roughly 20-25% margin on all sides within the square upload canvas) so Facebook's circular mask doesn't clip any of the four arms. Upload at Facebook's recommended 500×500px minimum (displays at ~170×170 on desktop, smaller on mobile) — export the mark as a clean PNG with transparent or solid background, no drop shadow (per brand guide's "no sharp corners, soft curves" — keep it simple, no added effects).

## 9. Cover image concept

Not a stock photo — grounded in the brand's real visual identity and the actual value proposition, honestly framed as in-progress.

**Concept: "The path to what's next," rendered literally.**
- Background: Balanced (`#F4F4F4`) or a soft Coral-to-Blush (`#E86248` → `#F2887C`) gradient wash, rounded-geometry decorative elements (soft curved shapes, no sharp corners) echoing the four-pillar mark, kept subtle and not competing with text.
- Foreground copy (large, Fredoka, Obsidian or white depending on background contrast): **"El camino a lo que sigue."** (Natural Mexican Spanish rendering of the tagline — not a literal word-for-word translation; keep in Spanish since this faces the merchant-facing audience, per `global-principles.md`'s Product Language rule.)
- Smaller supporting line beneath, Inter: **"Estamos construyendo Nahui con vendedoras y vendedores de bazar en México."** — states the in-progress, co-built nature honestly; avoids implying an available product.
- What to avoid: no screenshots of app UI (nothing in `03-build` has shipped, and even `02-ux`/`02b-medium-fidelity` work is pre-release spec, not final visual design — showing it publicly would risk presenting Planned/Experimental work as Available). No generic stock photography of "a market" or "a phone with a shopping cart" — payments/checkout imagery specifically must be avoided as a non-goal.
- Format: 820×312px (desktop) is Facebook's classic cover-image guidance; Meta's current editor auto-crops for mobile, so keep all text/logo elements within the safe center ~640×312px zone.

## 10. Contact information to display

Cross-checked against `company/marketing-operating-environment.md`'s actual asset plan rather than inventing a channel:

| Field | Recommendation | Status |
|---|---|---|
| Email | `hola@nahui.app` | **Contingent, not confirmed live.** §1 of `marketing-operating-environment.md` lists Google Workspace on `nahui.app` (which this email depends on) as "worth setting up now" — not confirmed as actually provisioned as of this writing. **Do not list this email on the Page until Workspace is live and the mailbox can actually receive mail.** Flag this as a dependency to close before publishing, not something to assume is already true. |
| Phone / WhatsApp | None | §7 explicitly defers WhatsApp Business provisioning "until interview scheduling actually starts." No dedicated business number exists. Leave blank rather than listing a personal number (governance doc is explicit that mixing personal and business contact is a risk to avoid). |
| Website | None yet | The `nahui.app` domain is owned (per `marketing-operating-environment.md` fact #2) but no live landing page/site is confirmed built. Don't list a URL that doesn't resolve to anything real — leave the field blank until a real page exists, or confirm with the Product Owner whether a placeholder/coming-soon page is already live at the domain before filling this in. |
| Address | None | No physical business location — correctly omitted for an itinerant-merchant-facing software company. |

## 11. Initial settings / recommendations for a professional Page

- **Page visibility:** create as **Unpublished/Draft** in Meta Business Suite, not live. Keep it unpublished until the Product Owner explicitly approves going live — consistent with the standing Approval gate; "created but not yet published" is a meaningfully different state from "public," and this doc's approval covers preparation, not publication.
- **Setup method:** create through **Meta Business Suite / Business Manager**, not the legacy standalone Page-creation flow — this is required for the role-based delegation model in `marketing-operating-environment.md` §2 (Content Creator/Moderator/Analyst roles) and for the future Instagram linkage in §3, which needs the Page and Instagram account under the same Business Manager.
- **Page roles:** Product Owner as sole Admin at creation. No other roles added yet — Marketing (the agent) has no login of any kind and cannot hold a role; a human operator role only gets added once one is actually designated, per §2/§10.
- **Two-factor authentication:** enabled on the Product Owner's Facebook account before Page creation, per governance §11 (TOTP authenticator app, not SMS where avoidable).
- **Messaging response-time settings:** do not enable an "instant reply" badge/claim that overstates actual availability — Meta's shown "typically replies within X" indicator should reflect real response behavior, not a promised SLA that doesn't exist yet at this single-operator stage. Set an Away Message for realistic expectations (e.g., acknowledging the message was received, no promised response window) rather than defaulting to an auto-reply implying 24/7 support.
- **Reviews/Recommendations:** turn **off** public reviews/ratings at creation. There's no live product and no real pilot merchant relationship yet to generate authentic reviews — an empty or prematurely-solicited reviews section undermines the honest, no-overclaiming posture the brand requires. Revisit once real pilot merchants have actual experience to review.
- **Templates and tabs:** use the "Business" template (About, Posts, Reviews-off-per-above) rather than the default. Explicitly hide/remove the **Shop** tab and any e-commerce-oriented tab — Nahui doesn't sell anything through this Page, and a visible Shop tab would misrepresent the product given payments/checkout is a non-goal.
- **Country/audience targeting:** no geographic restriction needed at Page level; content itself will naturally skew to Mexico through language and imagery.
- **Activity log:** enable Meta Business Suite's native activity log immediately (free, already built) — feeds the audit-trail requirement in `marketing-operating-environment.md` §13.
- **Linked Instagram:** leave unlinked for now — Instagram doesn't exist yet either. Link it at Instagram's own setup time, following this same document as the shared standard (see Framing correction above), not before.

---

## Summary for Product Owner review

Every one of the 11 items above is a **recommendation awaiting approval**, not an action taken. Nothing has been created. Two dependencies worth resolving before this can actually go live even after approval:

1. **Email (`hola@nahui.app`)** depends on Google Workspace being provisioned on the `nahui.app` domain — confirm that's actually done before it's listed as a live contact channel.
2. **Website field** depends on confirming whether anything currently resolves at `nahui.app`, or leaving it blank until a real landing page exists.

Once approved, actual account creation, username registration, image upload, and publishing are Product Owner actions per `marketing-operating-environment.md` — not something Marketing or Main can execute.

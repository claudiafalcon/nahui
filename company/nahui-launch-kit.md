# Nahui Launch Kit — Validation Stage

Prepared by Market Validation & Go-to-Market (`marketing` agent), persisted by Main, 2026-08-07. **Status: planning/preparation artifact only.** Nothing in this document authorizes creating an account, publishing content, sending anything, or making any external-facing change. Every item below is a recommendation for the Product Owner to review and execute personally, item by item, per the standing Approval gate and the account model in `company/marketing-operating-environment.md`.

**Governing constraint, restated because it shapes every line below:** Nahui is in validation/pilot stage — one validated merchant (Ana), no commercial launch, no finalized pricing (`business-decisions.md` Q11 open), no shipped product (`product/03-build/` is empty). Every claim in this kit traces to a Validated Finding or explicitly-labeled Supported Evidence in `company/jobs-to-be-done.md`, or directly to `vision.md`/`company/CLAUDE.md`. Where evidence doesn't exist yet, this kit says so rather than filling the gap with plausible-sounding copy.

**Instagram account state — verified directly by the Product Owner (2026-08-07), superseding this session's earlier automated read-only check (which had misread the account's state).** `@nahui.app` is confirmed as the official account. Confirmed baseline: no profile picture, no posts, no stories or highlights, following exactly one real merchant who sells at bazaars (initial test follows already cleaned up by the Product Owner). This is a genuinely blank-slate account with one deliberate exception (the one real-merchant follow, kept intentionally) — **not** an unaudited account with unknown prior activity. Treat this as the baseline for every future marketing/social-media recommendation. Facebook and TikTok still haven't been confirmed either way (both render client-side to automated checks) — worth the same direct verification before assuming their state.

---

## 1. Social Account Setup Guide

### 1.0 Shared standard across all three platforms

Derived directly from `company/brand/brand-guide.md`:

- **Display name:** `Nahui` everywhere — no suffix.
- **Visual identity:** icon-only four-pillar brand mark (`company/brand/raw-assets/Union.png`) for every profile photo — never the horizontal wordmark, which clips under a circular crop. Base Coral (`#E86248`) is correct for this decorative use; Coral AA+ is reserved for text/button-fill contexts (`business-decisions.md` Q12), not applicable to a static icon.
- **Voice:** warm, direct, honest, respectful — never condescending about "informal" commerce, never implying the merchant needs rescuing. Copy speaks as a team still learning and building, not a company with a finished product to sell.
- **Language:** natural Mexican Spanish, not translated English.
- **Product Truth discipline applied everywhere:** every bio/about field uses "estamos construyendo," never "ya puedes usar" or "descarga la app." No pricing, no tier names, no feature promise beyond the one Validated Finding (sale registration in the moment of a sale).

### 1.1 Facebook Page

**Carries forward `company/facebook-page-setup.md` largely as-is** — it already meets this kit's discipline. Full detail (long "About" copy, mission statement, initial settings, cover-image concept, admin/security model) lives there; summarized here with two explicit corrections.

**Unchanged from that draft:** Page name `Nahui`; category Primary `Software Company`, secondary `Business Service` (never "Shopping & Retail" or anything payments-adjacent); short bio *"Tecnología para vendedores ambulantes en México. Construyendo Nahui junto a comerciantes reales."*; the extended/compact About copy in `facebook-page-setup.md` §5–6; CTA button **"Enviar mensaje"** (not "Sign Up" or "Learn More" — nothing to sign up for, no live site yet); profile image the four-pillar mark; cover concept "El camino a lo que sigue," soft Coral-to-Blush wash, no app screenshots, no stock photography; created **Unpublished/Draft**, Reviews off, Shop tab hidden, Product Owner sole Admin, 2FA before creation.

**Corrections this kit makes, and why:**

1. **Contact email is `ihola@nahui.app`, not `hola@nahui.app`** — the prior draft used a placeholder before the official address existed. Do not list it live until Google Workspace on `nahui.app` is provisioned and the mailbox can receive mail.
2. **Username priority is now `@nahui.app` first** — Instagram's handle is confirmed as `@nahui.app`; try the same on Facebook first for cross-platform consistency once both accounts sit in the same Business Manager. If unavailable, fall back to the original `@NahuiApp`/`@SomosNahui`/`@NahuiMX` list.

### 1.2 Instagram Business (`@nahui.app` — already exists, respect exactly)

- **Username:** `@nahui.app` — already reserved, do not change.
- **Display name field:** `Nahui` exactly — no keyword-stuffing.
- **Category:** closest honest fit, in order: `Software company`, else `App page`, else `Business service` — reconfirm against the live picker.
- **Bio (150 chars):** *"Construyendo una forma más fácil de registrar tus ventas en el bazar. Vendedoras y vendedores reales nos están ayudando a hacerlo bien. 💛"* (139 chars).
- **Website/link:** point to `nahui.app` once the landing page is live — not before.
- **Contact options:** Email button → `ihola@nahui.app` (same live-mailbox precondition). No WhatsApp button — governance defers WhatsApp Business until interview scheduling starts.
- **Profile photo:** four-pillar mark — confirmed no photo currently set, so this applies directly with no conflicting content to review first.
- **Highlights:** none yet — an empty row is more honest than manufactured categories. Consistent with the account's confirmed current state.
- **The one existing follow (a real bazaar merchant), kept intentionally per the Product Owner's own cleanup:** don't unfollow it as part of this setup — it's deliberate, not leftover noise.
- **Initial settings:** switch to Professional/Business if not already; link to the Facebook Page once it exists; keep private or simply unposted-to until launch-ready; 2FA before any further changes.
- **Admin/role model:** identical to Facebook's — Product Owner as owner, no other role until a human operator is designated.

### 1.3 TikTok Business

**Sequenced last, provisioned only if observation work actually surfaces TikTok as a real venue** — governance lists it as "defer until proven relevant"; Marketing's own research hasn't confirmed the ICP uses it.

- **Display name:** `Nahui`. **Username:** try `@nahui.app` first (unverified this session — confirm manually), fallback `@nahuiapp`.
- **Category:** `Software` or `Business services` — TikTok's taxonomy is coarser, reconfirm at setup.
- **Bio (80 chars):** *"App para vendedoras de bazar en México. Aún construyendo. 💛 [link a nahui.app]"* (~65 chars).
- **Website link:** same precondition as the other two platforms.
- **Profile photo:** four-pillar mark. No cover-banner field on TikTok.
- **Initial settings:** enable Business Suite/analytics; set comment moderation to require review; 2FA on the linked email before creation.
- **Admin/role model:** the weakest of the three — TikTok's team-access tooling is immature, meaning shared credentials via the password vault rather than a clean scoped role, which raises the bar on vault discipline specifically here.

### Cross-platform contact information

| Field | Value | Status |
|---|---|---|
| Email | `ihola@nahui.app` | Do not publish until Workspace is provisioned and receiving mail |
| Website | `nahui.app` | Do not publish until the landing page is live |
| Phone / WhatsApp | none | Deferred per governance until interview scheduling starts |
| Address | none | Correctly omitted — itinerant-merchant-facing product |

### Security and admin/role recommendations (all three platforms)

- Every account owned by the **Product Owner personally, pending incorporation** — never a "Nahui" entity account, never a purpose-built persona account.
- **2FA (TOTP, not SMS) on every account** before creation or before touching an account that already shows activity — applies immediately to the existing Instagram account.
- **Marketing (the agent) never holds credentials to anything.** All account access is role-based delegation or direct execution by whoever holds the vault credential.
- **No credential, recovery code, or API secret is ever written into this repository.**
- **Password manager vault first**, before any of the above (see Execution Order, step 1).
- **Designate a secondary recovery contact** across all three platforms — not resolved by this kit, flagged as an open item.

---

## 2. Landing Page Blueprint

### Goal

Not a commercial-launch page. Its job: **give the recruitment/validation work already drafted in `company/market-validation.md` somewhere real to point to** — distributing the H1/H2/H5 survey, capturing pilot-candidate signups, establishing a legitimate checkable public presence. Explicitly not trying to convert visitors into "customers."

### Target audience

Primary: vendors matching H1's screening criteria — private/invite-based bazares, multi-SKU apparel/accessories catalog, Estado de México/CDMX metro. Spanish-only, no English toggle — no evidenced need for one.

### Information architecture

1. Header (logo mark + wordmark only) → 2. Hero → 3. "Lo que hemos aprendido" (value prop) → 4. Bridge to survey CTA → 5. Pilot-recruitment section → 6. "Cómo estamos construyendo esto" (transparency) → 7. FAQ → 8. Footer

### Hero section

**Headline:** *"Registrar una venta no debería quitarte al siguiente cliente."* — directly grounded in JTBD's Validated Finding #1.

**Subhead:** *"Estamos construyendo Nahui platicando con vendedoras y vendedores de bazar reales — para entender cómo llevan el control de sus ventas hoy, y qué les haría más fácil el día a día."* — frames the friction as what was learned from real conversations, not asserted as universal (H1 is still an open hypothesis).

No hero image of a product — nothing has shipped. Use the brand's rounded-geometry shapes and the four-pillar mark, not a UI screenshot or stock photography.

### Value proposition (JTBD-grounded only)

1. *"Sabemos que el cliente no espera."* — Validated Finding #1.
2. *"Estamos aprendiendo con vendedoras y vendedores reales, no adivinando desde afuera."* — process claim, not a feature claim.
3. *"Todavía no hay una app para descargar — y no queremos prometerte una fecha que no podamos cumplir."* — explicit Product Truth statement.

**Deliberately excluded:** customer segmentation, bazaar recommendations, NFC tags, pricing/tiers — Planned or Open-Hypothesis territory, unnecessary for this page's actual job.

### CTA structure — two distinct, separately tracked CTAs

Kept separate because `market-validation.md`'s evidence-reading discipline treats H1's survey response rate and H3's landing-page interest rate as different signals — one blended form would muddy which signal came from which hypothesis.

- **Primary — survey:** *"Cuéntanos cómo vendes"* → links to the H1/H2/H5 survey once approved and live.
- **Secondary — pilot interest:** *"Quiero ser de las primeras en probarlo"* → short on-page form (nombre, WhatsApp o correo, zona, tipo de bazar), feeding the same screening data as the survey's Q0a/Q0b.

**Explicitly held out of v1:** H3's fake-door test — recommend its own separately-tracked page/section once specifically approved, since its evidence-reading depends on a clean, isolated signup rate.

### Email-capture strategy

Two structurally separate lists: survey responses (Google Form/Sheet, Drafts→Approved discipline) and pilot-interest signups (a second Sheet, same discipline). Never stored in this repository — personal data belongs in access-controlled Drive. Both carry the consent line: *"No vendemos nada ni compartimos tu información con nadie fuera de Nahui."*

### Pilot-recruitment section

*"Si vendes en bazares privados en el Estado de México o CDMX, y quieres ser de las primeras personas en platicar con nosotros o probar lo que vayamos construyendo, cuéntanos aquí."* Fields: nombre, WhatsApp o correo, zona, tipo de bazares — mirrors the survey's own screening block intentionally.

### FAQ

- **¿Qué es Nahui?** — building for bazaar vendors, the sale-registration friction, one sentence.
- **¿Ya puedo descargar la app?** — "Todavía no. Estamos en la etapa de aprender junto con vendedoras y vendedores reales antes de construir algo que de verdad les sirva."
- **¿Cuánto va a costar?** — "Todavía no lo hemos decidido." Nothing more specific — Q11 genuinely open.
- **¿Cómo puedo participar?** — points to the two CTAs.
- **¿Comparten mi información?** — same consent line.
- **¿Quiénes están detrás de Nahui?** — light, no named individuals, grounds the brand's origin/Nahuatl meaning.

### Footer

`ihola@nahui.app` · Instagram `@nahui.app` (linked) · `nahui.app` · "Aviso de privacidad" link (inactive/greyed until the real document exists) · copyright line, no address.

### Trust elements appropriate to this stage

- Plain early-stage statement — no "trusted by X vendors," no fabricated testimonial, no logo wall.
- **Privacy flag:** do not name Ana or any other real, identifiable merchant, or describe her circumstances precisely enough to identify her, without explicit consent — `market-validation.md` §1a already applies this internally; this page carries it into a public surface. If referenced at all, keep it generic ("vendedoras y vendedores reales"), never a name/photo/specific-enough story.
- No manufactured urgency ("cupo limitado," countdowns) — pilot-cohort size hasn't been decided.
- A one-line explanation on every data-capture field of why the information is being asked.

### What should intentionally NOT appear

App UI screenshots/mockups; app store badges/"download now" language; any pricing/tier/billing language (Q11 open); a specific launch date; testimonials, star ratings, "as seen on" logos; NFC/segmentation/bazaar-recommendation features described as available; Meta Pixel or paid-ad tracking at launch (see checklist); Ana's name or identifying detail.

---

## 3. Launch Readiness Checklist

### Branding assets
- [ ] Icon-only four-pillar mark exported clean (transparent + solid-background)
- [ ] Wordmark for header/footer use on the landing page only (not circular crops)
- [ ] Favicon set (16×16, 32×32, apple-touch-icon)
- [ ] Fredoka + Inter licensed/hosted (open-license Google Fonts)
- [ ] Color tokens confirmed against the resolved brand palette, including Coral AA+ (`#C13F26`) for any landing-page text/button-fill use (`business-decisions.md` Q12) — never base Coral for CTA button text

### Images
- [ ] Profile photos, all three platforms, ≥500×500px
- [ ] Facebook cover image, 820×312px, safe zone ~640×312px
- [ ] Landing page hero visual (illustrative, not photographic)
- [ ] Open Graph / social-share image, 1200×630px

### Domain configuration
- [ ] Confirm current DNS state of `nahui.app` (nothing currently resolves there)
- [ ] A/CNAME records to the chosen landing-page host
- [ ] MX, SPF, DKIM, DMARC once Workspace is provisioned — coordinate with A/CNAME so they don't conflict
- [ ] SSL/HTTPS confirmed
- [ ] `www.nahui.app` redirect to bare domain

### Email
- [ ] Google Workspace provisioned on `nahui.app`
- [ ] `ihola@nahui.app` created and tested (send/receive) **before** listed anywhere public
- [ ] Delegated access model per `marketing-operating-environment.md` §1 — delegation, not shared password

### Landing page
- [ ] Build against §2's blueprint — a single lightweight page is sufficient, no CMS/account system needed
- [ ] Mobile-first — assume mid-range hardware, variable connectivity
- [ ] Minimal page weight — no heavy JS framework needed
- [ ] `lang="es-MX"` set

### Privacy Policy / Terms — scope only, not drafted here

Drafting the actual legal text is outside Marketing's scope and needs real legal input, ideally Mexican counsel, not a generic English-language template.

**Minimum coverage needed:** what personal data is collected and why; how it's used (research/pilot-recruitment only, not sold/shared); retention and a deletion-request path; cookie/analytics disclosure once any analytics tool is installed; a named privacy contact (`ihola@nahui.app`).

**Mexico-specific flag:** Mexico's federal data-protection law (Ley Federal de Protección de Datos Personales en Posesión de los Particulares) requires an **Aviso de Privacidad** with specific mandatory elements once any personal data is collected — not optional boilerplate, and a generic "Privacy Policy" wouldn't necessarily satisfy it. Needs a Mexican legal reviewer before the forms go live.

- [ ] Aviso de Privacidad drafted and reviewed by real legal counsel
- [ ] Lightweight Terms/Aviso Legal for a pre-launch informational site, same caveat
- [ ] Both published and linked from the footer before forms go live

### Analytics
- [ ] Lightweight, privacy-respecting page-visit tracking — needed to compute H3-style signup rates, install before launch not after
- [ ] **Meta Pixel explicitly deferred** — install only once a specific paid-ad experiment (H5's deferred pricing test) is approved and defined

### SEO basics
- [ ] Honest title tag/meta description (no overclaiming)
- [ ] Open Graph tags
- [ ] `robots.txt` and minimal `sitemap.xml`
- [ ] Alt text on all images
- [ ] Page-speed check on real mid-range mobile connection

### Platform verification
- [ ] Meta Business Manager domain verification for `nahui.app`
- [ ] Facebook Page + Instagram linked under the same Business Manager
- [ ] TikTok business verification, only once/if that account is actually provisioned

### Anything else
- [ ] Simple honest "estamos construyendo esto" placeholder at `nahui.app` if the full build takes longer than the domain sits idle — must not overclaim
- [ ] Business email signature template, consistent with brand voice
- [ ] No editorial/content calendar in this kit — deliberately excluded, that's an advertising-stage responsibility

---

## 4. Execution Order

1. **Password manager vault** — nothing below touches a real credential before this exists. Zero dependencies, lowest risk.
2. **Google Workspace on `nahui.app`** — provisions the email and Forms/Sheets/Drive stack everything downstream depends on. Must happen before anything publicly lists the email or links to a form that doesn't exist yet.
3. **DNS: MX/SPF/DKIM/DMARC**, same pass as step 2 — a misconfigured record silently sends real merchant replies to spam, worse than no email at all at this trust-sensitive stage.
4. **2FA on core accounts** before creating or touching any business account — cheaper to set up first than retrofit onto a live account.
5. **Secure the existing Instagram `@nahui.app` account with 2FA.** Its state is already confirmed (blank slate, one intentional merchant follow, no audit needed) — this step is now just standard account-hardening before any content gets applied, not an investigation.
6. **Create the Facebook Page**, Unpublished/Draft — the anchor asset Instagram needs to link to for role-based delegation to work.
7. **Link the Instagram account to the Facebook Page/Business Manager; apply §1.1/§1.2 content** (profile photo, bio) — both stay unpublished/quiet, nowhere yet for a click to land.
8. **TikTok — deferred, sequenced last**, only if/once observation work confirms it as a real venue.
9. **Build the landing page**, in parallel with 6–8 once branding assets and domain DNS are ready — no dependency forces it to wait.
10. **Aviso de Privacidad + minimal Terms, real legal input** — hard gate before the landing page can collect names/contacts.
11. **Install lightweight analytics before going live** — added after launch, day-one traffic is lost and unrecoverable.
12. **Product Owner reviews and approves this entire kit, item by item** — nothing below proceeds without this.
13. **Publish the landing page live** — the actual infrastructure the recruitment funnel depends on.
14. **Publish the Facebook Page and Instagram profile**, using approved content — sequenced after the landing page since the Facebook CTA needs somewhere real to point.
15. **Begin using the already-drafted, still-individually-gated recruitment copy** (`market-validation.md` §4.1/§4.2/§4.3/§4.5) — each still requires its own per-item approval under that document's §5.
16. **TikTok posting, if/when the account exists** — same per-item approval discipline, no standing exception for being a newer platform.

---

## Open items flagged for Product Owner decision

1. ~~The existing Instagram `@nahui.app` account's current state~~ — **Resolved 2026-08-07.** Confirmed blank-slate account (no photo, no posts, no stories/highlights, one intentional merchant follow) — verified directly by the Product Owner, superseding the earlier automated read that had misread its state. No further audit needed.
2. **Facebook and TikTok account state still unconfirmed** — the same automated check that misread Instagram couldn't confirm these either way. Worth direct verification before assuming either is a blank slate.
3. **Aviso de Privacidad / Terms** — needs a real legal reviewer identified; this kit only scopes what they need to cover.

## Sources
`company/CLAUDE.md` · `product/00-foundation/vision.md` · `company/brand/brand-guide.md` · `company/jobs-to-be-done.md` · `company/market-validation.md` · `company/market-validation-roadmap.md` · `company/facebook-page-setup.md` · `company/marketing-operating-environment.md` · `company/business-decisions.md` · `product/00-foundation/global-principles.md`

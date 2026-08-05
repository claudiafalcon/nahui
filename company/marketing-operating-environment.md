# Marketing's Operating Environment — Accounts, Access, and Governance

Design for the minimum set of accounts, assets, permissions, and operating procedures Marketing needs to execute market validation, before any of it is actually granted. Nothing in this document has been created yet — this is the proposal, not a record of provisioned infrastructure. Once approved, provisioning itself is a Product Owner action (account creation, payment, legal ownership), not something Marketing or Main can do autonomously.

## Two confirmed facts this design is now built around

1. **Nahui is not a formally registered legal entity in Mexico yet.** Every account below defaults to **Product Owner personally, as owner** — not a business entity name platforms would need to verify. Don't create anything under an entity name that doesn't legally exist; platforms (especially Meta Business Manager) will ask for legal/tax details on business-tier verification eventually, and that's a migration to do once incorporation happens, not something to front-run now.
2. **The domain `nahui.app` is already owned.** This changes the email/Workspace recommendation below from "start with a plain Gmail" to "set up directly on the real domain" — no reason to use a placeholder identity when a real one already exists.

## One remaining thing this document assumes

**Marketing today has no execution tooling.** The `marketing` agent's current tool access is `Read, Write, Glob, Grep` — no browser, no API calls, no ability to literally log into anything. Every "autonomous" activity below means *drafting into a file for review*, not *executing on a live platform*. The account/access model is designed for two futures at once: (a) today, where a human always executes, and (b) a later point where genuine execution tooling (scheduling software, an API integration) might exist — the model below should not need to be redesigned when that day comes, only extended.

## Governing principles

- **Nahui owns the assets, never the agent, never a personal identity that outlives its usefulness to the company.** Every account is business infrastructure, not the Product Owner's personal footprint — this matters for continuity (if the Product Owner is ever unavailable, the business isn't locked out of its own presence) and for separation of personal/business risk.
- **Marketing never holds a master password to anything.** Where a platform supports role-based/delegated access (most business-tier tools do), Marketing's *human operator* gets a scoped, revocable role — not the account owner's credentials. Where a platform doesn't support that (several don't, noted per-asset below), a human continues to execute directly and Marketing only ever prepares the content.
- **No credential, password, recovery code, or API secret is ever written into this repository.** This repo is git-tracked and its history is durable. Account *identifiers* (an email address, a Page name, a Drive folder link) are fine to log here; anything that grants access is not. All of that lives in the password manager only.
- **Publishing and outreach require a human hand on every send, at this stage.** Not just approval-in-principle — the actual act of clicking "post" or "send" is done by a person, every time, until there's a specific, reviewed reason to automate it. This is stricter than "Marketing needs approval before acting" — it's "Marketing cannot act on external platforms at all yet," which is already true today by tooling limitation and should stay true by policy even once tooling changes, until proven safe to loosen.
- **Two-person rule on anything that can lock the business out of its own account.** Password changes, recovery-email/phone changes, 2FA re-enrollment, and ownership transfers should never be a unilateral action by whoever's currently operating day-to-day — always confirmed with the Product Owner specifically, logged.

---

## Per-asset design

### 1. Business email
- **Owner:** Product Owner personally (pending incorporation), on the real domain already owned — `nahui.app`. No need for a placeholder Gmail; set up directly as e.g. `hola@nahui.app`. This requires Google Workspace (or another email host) configured against the domain's DNS — a real setup step, not automatic just because the domain exists.
- **Access model:** Google Workspace delegation lets a second identity access the mailbox without ever seeing the password — this is the target state from day one, since Workspace is needed anyway to use the domain for email. Credentials live in the password manager only.
- **Autonomous:** none directly (Marketing can draft email copy into a file for review).
- **Needs approval:** every send, any account-recovery/security setting change.

### 2. Facebook Page (not a personal account)
- **Owner:** Product Owner personally, as the Page's Business Manager admin, pending incorporation.
- **Access model:** Meta Business Suite supports granular Page roles (Content Creator, Moderator, Analyst, etc.) — the eventual human operator gets a scoped role, never the Page admin's personal Facebook login.
- **Flag, not a recommendation:** joining *closed* bazaar-community Groups for research requires a real personal profile that looks and behaves like a real person — Meta's ToS is genuinely strict about purpose-built/fake accounts, and a "Nahui Research" persona account risks a ban that could also jeopardize the linked Page. The lower-risk path is the Product Owner (or a real team member) personally joining and observing under their own identity, not provisioning a dedicated account for this. Most public Groups don't require membership to read, which covers a lot of Marketing's stated observation needs without this problem at all.
- **Autonomous:** drafting posts/copy, reading already-public Group content (no login needed for public groups).
- **Needs approval:** every post, every group join, every message, every comment/reply.

### 3. Instagram
- **Owner:** Product Owner personally, pending incorporation — set up as a Business/Creator account linked to the Facebook Page above (this linkage is required for Meta's role-delegation to work).
- **Access model:** same Meta Business Suite role-based access as Facebook.
- **Autonomous:** drafting captions/content, public hashtag browsing (no login required for public content).
- **Needs approval:** every post, every DM, every follow/like/comment.

### 4. TikTok
- **Owner:** Product Owner personally, pending incorporation — TikTok Business account.
- **Access model:** TikTok's team-access features are less mature than Meta's for a small business account at this stage — realistically this means shared credentials via the password manager rather than a clean role split, which raises the bar on password-manager discipline specifically for this one (see §10).
- **Autonomous:** drafting scripts/content ideas, public hashtag browsing.
- **Needs approval:** every post, every comment/interaction.

### 5. LinkedIn Company Page
- **Flag before designing access for it: is this actually needed right now?** Marketing's own community-research work (Facebook Groups, Instagram/TikTok hashtags, WhatsApp, organizer Pages) never named LinkedIn as a channel where bazaar merchants — the current validation audience — actually are. LinkedIn only becomes relevant for a different audience (investors, potential hires), not merchant validation. Recommend deferring this entirely until there's a concrete investor/stakeholder-facing need, rather than provisioning it now.
- If/when needed: LinkedIn structurally requires a named personal profile to administer a Company Page (no headless business-only login) — the Product Owner's own profile would need to be the admin, with any other admin added as a named individual, not a role/token.

### 6. X (Twitter)
- **Same flag as LinkedIn, stronger:** not named anywhere in Marketing's own channel research as a place the ICP gathers. Recommend not provisioning this at all for the current validation phase — every unused account is pure attack surface with no offsetting benefit. Revisit only if a specific, evidenced reason emerges.

### 7. WhatsApp Business
- **Owner:** Nahui-dedicated phone number (not the Product Owner's personal number), Product Owner as the account holder pending incorporation. Worth a small recurring cost (a dedicated low-cost SIM or VoIP business number) — mixing business outreach with a personal number is both a privacy risk for the Product Owner and unprofessional for recipients who'd see a personal WhatsApp profile.
- **Access model:** the basic WhatsApp Business app is tied to one device/number with no meaningful role delegation (the API-tier WhatsApp Business Platform does support this, via a Business Solution Provider, but that's real infrastructure overkill for MVP-stage validation). Practically: whoever holds the device sends messages directly; there's no way to give Marketing "access" short of literal device access, which shouldn't happen.
- **Autonomous:** drafting message templates/scripts.
- **Needs approval:** every single message — this is the highest-sensitivity channel (direct 1:1 contact with a real person) and should stay 100% human-executed regardless of what other automation exists elsewhere.

### 8. Google account (Forms/Sheets/Drive umbrella)
- **Owner:** Product Owner personally, pending incorporation — the same `nahui.app` Google Workspace setup as the business email above, not a separate account. One Workspace subscription covers email, Forms, Sheets, and Drive together, all with proper delegation — no reason to run a bare personal Gmail alongside it.
- **Access model:** add the eventual human operator as an Editor on specific shared Drive folders/Forms/Sheets — never share the account password itself.
- **Autonomous:** creating/editing survey drafts, organizing research docs (all pre-publish/private).
- **Needs approval:** publishing a Form live (making it externally accessible), sharing any link outside the team, granting new people access to anything.

### 9. Shared drive/storage
- **Owner:** Nahui (same Google/Workspace account as above), or this repository, depending on content type. Recommend a clear split: research-in-progress and anything containing personal data (survey responses with names/contacts, interview notes) belongs in Drive with access-controlled sharing, not in this git repo. Strategy/planning documents without personal data (like `company/market-validation.md` itself) are correctly already in the repo — versioned, attributable, durable.
- **Folder structure as the actual control mechanism:** a "Drafts" area Marketing/the operator writes into freely, and an "Approved" area that only gets populated by an explicit Product Owner action — the act of moving something between the two *is* the approval gate, not just a verbal go-ahead.

### 10. Password management
- A dedicated **business/team password manager vault** (1Password or Bitwarden both support this well) — never a personal password manager, never passwords in a spreadsheet or doc.
- **Owner:** Product Owner holds the vault's owner/master account.
- **Structure:** each credential stored as its own item, shared to specific people/roles rather than one flat vault everyone can see everything in — most managers support this natively (item-level or collection-level sharing).
- **What "Marketing has access" actually means in practice today:** nothing — there is no agent identity that can open a password manager. It means *whoever is executing an approved action* (today, the Product Owner; later, possibly a hired team member) retrieves the specific credential needed at the moment of that action. This is a deliberate friction point, not an oversight — it's what keeps "Marketing can draft" from silently becoming "Marketing can post."

### 11. Authentication (2FA)
- 2FA enabled on every account above, no exceptions — including the password manager's own vault.
- Second factor should be an authenticator app (TOTP) on a device the Product Owner controls, not SMS where avoidable (SMS is the weaker option — SIM-swap risk) and never a factor only an agent or a future automation tool could access on its own.
- Recovery codes generated at 2FA setup go into the password manager vault as their own encrypted item — never into this repo, never into a chat transcript.

### 12. Ownership and recovery
- **Single point of failure to avoid:** don't make the Product Owner the *only* person who could ever recover any of these accounts. Designate one trusted secondary (a co-founder, or a specific trusted person) as a documented recovery contact — added as a secondary admin/recovery method where the platform supports it, or at minimum given vault access to the credentials, so the business isn't locked out if the Product Owner is unreachable.
- **Migration trigger:** the moment Nahui incorporates, every account above should be re-pointed to the legal entity (business verification on Meta/Google/etc., business bank-linked payment methods rather than personal ones) — worth a checklist item for that day, not something to solve preemptively now.

### 13. Audit trail
- **Drafts and strategy:** already well-covered — `company/market-validation.md`'s git history is a real, durable audit trail of what was proposed and when, attributed by commit.
- **Actual external actions (what got posted/sent, and when) — not currently tracked anywhere, and should be.** Recommend a simple log, either a new `company/marketing-activity-log.md` or a dated section appended to `market-validation.md`, recording: what went out, on which platform, when, who executed it, and a link/screenshot if practical. This is the piece that closes the loop between "drafted and approved" and "actually happened" — without it, there's no record of what Nahui has actually said publicly.
- Enable each platform's own native activity log too (Meta Business Suite's activity log, Google Workspace's admin audit log) — free, already built, no reason not to turn it on.

### 14. Approval workflow before publishing or contacting people
This mostly already exists and is already working — this section just makes the mechanics explicit rather than implicit:
1. Marketing drafts content/copy, writes it into a file (today: `company/market-validation.md` or similar).
2. Main presents the draft to the Product Owner for review — exactly the pattern already used for the market-validation package itself.
3. Product Owner approves specific items (not a blanket "go ahead" — per-item, matching Section 5's existing "requires approval" itemization).
4. A human (today: the Product Owner; later: whoever's designated) retrieves the needed credential from the password manager and executes the action directly on the platform.
5. The action gets logged per §13 above.

No step here is new — it's the same loop already used for `company/market-validation.md`'s own approval gate, just extended to cover the infrastructure that loop will eventually touch.

---

## What to actually provision now vs. defer

**Worth setting up now**, given Marketing's already-approved prep work (community research, candidate identification):
- Password manager vault (needed before anything else touches real credentials — do this first, everything below gets stored in it)
- Google Workspace on `nahui.app` (covers business email, Forms, Sheets, and Drive in one setup — the domain's already owned, this is the one real setup step remaining)
- Facebook Page + Instagram Business account (linked, one Meta Business Suite setup)

**Defer until there's a concrete, evidenced reason:**
- TikTok (only if/once TikTok specifically proves relevant during observation — Marketing's research listed it as a secondary channel, not primary)
- WhatsApp Business (defer until interview scheduling actually starts — no reason to hold a dedicated number idle)
- LinkedIn, X — not currently supported by Marketing's own channel research; don't provision speculatively

This keeps the security surface matched to what's actually being used, rather than standing up seven accounts to support four channels' worth of real work.

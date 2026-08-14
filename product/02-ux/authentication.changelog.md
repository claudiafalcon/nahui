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

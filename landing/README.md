# `landing/` — Nahui's public presentation page

Static. No build step, no framework, no third-party request at runtime (fonts
are self-hosted). Three source files plus `assets/`.

| File | What it is |
|---|---|
| `BRIEF.md` | Product definition. Approved by the Product Owner, 2026-10-08. |
| `CONTENT.md` | The copy contract, owned by `marketing`. **Every string on the page comes from here.** |
| `index.html` | The page. Both languages, each string once. |
| `styles.css` | Tokens from `company/brand/brand-guide.md`, with every contrast ratio measured in the file header. |
| `i18n.js` | The language switch. Contains no copy, in either language. |

Write grant: `company/infrastructure-decisions.md` **ID019**. `marketing` owns
the claims and the CTA, `brand-guardian` owns the voice, `ui-designer` owns
layout, craft and code. The copy is not edited here.

## Run it

```
cd landing && python3 -m http.server 8000
```
Then open `http://127.0.0.1:8000/`. Opening `index.html` as a `file://` URL
also works, except that `localStorage` may be unavailable, so the language
choice will not persist between loads.

## The two publication gates

Both are attributes on `<html>` in `index.html`. Each is a one-word edit, and
each hides links only — never a claim.

| Attribute | Flip to `"on"` when |
|---|---|
| `data-repo-link="off"` | The privacy scrub of the files outside this folder has landed (`CONTENT.md` §8.2). Hides three links to the public repository. |
| `data-privacy-link="off"` | The privacy notice has a URL of its own (`CONTENT.md` §8.3). It must not be the retired demo subdomain (D61). **This precondition now appears to be met:** `CONTENT.md` §10.5 records `https://www.nahui.app/aviso-de-privacidad.html` as verified live on 2026-10-08. The flip and the `href` are left for Main, not taken here — the gate is a publication decision, and the link does not render while it is `"off"`. |

## Four layout rules that are not stylistic

`CONTENT.md` §6.11 makes these binding, because the copy and the layout can
fail the same test separately: a correctly written passage rendered as a grey
"bad news" panel puts the defect straight back. Each is marked in `index.html`
and in `styles.css` at the place it applies.

| Rule | How it is held |
|---|---|
| (a) `today.bar` must not read as a warning | `.standard` — no alert fill, no icon, no state colour, no heavier border than its siblings. Its weight comes from width, type size and air only. |
| (b) `today.notYet` and `today.bar` must not share treatment or stack as two muted blocks | `.capsnote` is a plain line on the capability list (no fill, no border, no rule, full ink); `.standard` is a card, a full `--s8` below it. |
| (c) `status.body3` and `status.body4` always render together, in that order, in one block | `.declare` wraps both. The blush rule belongs to the wrapper, not to `body3`, so `body3` can never stand alone or close the section. |
| (d) `status.blocked` lays out as a dated case, not a disclaimer, and shares no treatment with `body3` | `.case` — a bordered card with a date stamp beside its body, borrowing `.record`'s grammar from "Lo que las vendedoras cambiaron", which is already this page's form for "dated, logged, checkable". `.declare` is a rule-left declaration with no border, so the two can never stack as matching panels. |

"Cómo va" renders five blocks, and the order is normative (`CONTENT.md` §4.5):
`body1` → `body2` → `blocked` → `body3`+`body4` together.

### The one typographic device over a `marketing`-owned string

`.standard .lede` sets the first sentence of `today.bar` — the one naming the
standard — on its own line at one size step up. No word, no order and no
punctuation changes; the paragraph is still one `<p>` and one string in
`CONTENT.md`. Approved on that basis, 2026-10-08, because the card was calm but
had no entry point. It is not a licence to split other strings.

## Before this page is shared anywhere

- `og:image` is a **relative** path and there is **no `og:url`**, because the
  page's own URL is unresolved (`CONTENT.md` §8.11). Both are marked `TODO(url)`
  in `index.html`. Fill them in with the absolute URL before sharing a link.
- `ihola@nahui.app` **is** delivery-tested — the Product Owner sent a live test
  on 2026-10-08 and confirmed receipt (`CONTENT.md` §8.1, §10.5). The address
  must keep matching the live privacy notice character for character, including
  the leading **i**, because the notice publishes it as the ARCO channel
  (`CONTENT.md` §6.12). If one changes, both change the same day.
- The written form of the Product Owner's name **is** confirmed: "Claudia
  Falcón", with the accent (`CONTENT.md` §8.13, §10.5). That is what the page
  renders, in both language versions.

## How the two languages work

Every translatable unit exists **exactly once**, in `index.html`, as a pair of
adjacent elements:

```html
<p class="t" data-l="es">…</p>
<p class="t" data-l="en" lang="en">…</p>
```

`i18n.js` holds no string table. It writes `data-lang` on `<html>`; CSS decides
which of the two shows. So:

- **Spanish is the static content of the page.** With JavaScript disabled the
  page renders in full, in words (`BRIEF.md` §6).
- **Nothing can silently diverge**, because nothing is duplicated.
- **With JavaScript disabled, both languages render** — see the `<noscript>`
  block in `index.html`. The English reader is never left without a page.
- A claim and its translation sit on adjacent lines, which is the line-by-line
  parity check `CONTENT.md` §10 row 5 asks a reviewer to run.

`data-l` says which language *version* an element belongs to; `lang` says what
language its text actually is. They differ on the language button, whose
Spanish-version label is the English word "English".

### Editing a string

Edit both lines of the pair, in the same pass. Then open
`index.html?i18ncheck=1` and read the console: it reports the count of
translatable units per language and lists any element missing its counterpart.
That is the one divergence this design still allows — a string added in one
language and forgotten in the other — so it is the one thing worth checking
automatically.

The handful of values that are not text nodes (`<title>`, the meta
descriptions, the `aria-label`s — including the hero loop's, which is how a
`<video>` carries a description at all — and an image `alt` wherever there is
one) follow the same rule: the Spanish is the attribute already in the HTML,
and only the English alternate is carried, once, in a `data-*` attribute
beside it.

## Assets

| File | Source |
|---|---|
| `assets/mark.svg` | Geometry unchanged from `company/brand/raw-assets/Component 1.svg`. Colours exposed as CSS variables so the halo can match the surface it sits on. |
| `assets/app-loop.{webm,mp4}` | **The hero.** A silent 12.5s loop of the real product registering a sale — empty grid, Plumas, Papas, total $32, "Cerrando venta…", the finished-sale receipt with its QR code — then back to the empty grid, which reads as the next sale. 540×1024, 30fps, no audio stream at all. VP9 **146 KB** / H.264 **111 KB**. Cut by the Product Owner from her own screen recording on her own test account, 2026-10-08, seconds **5.0–17.5** of the source below. The phone's status and navigation bars are cropped out, which is why it is 146px shorter than `app-hoy.png`. **Recut the same day** (60px off the source before scaling, so the fix cost no quality) because the first cut sliced the app's own bottom tab bar through the middle of its icons. See "The hero loop" below. |
| `assets/app-loop-poster.png` | The video's `poster`, and therefore the entire hero for a reader who asked for less motion, has no video support or has no JavaScript. It is **frame 7.2s of `app-loop` itself** — the sale standing at two items, with its chips, its badges, its total and its "Finalizar Venta" button. 540×1024, so it matches the loop exactly: no crop, no scaling, no distortion, and a handoff that is invisible because it is the same recording. 256-colour PNG, **76 KB** (max channel delta 0.61 mean against the source frame — no visible banding at any size this page renders). PNG, not WebP, because a `poster` takes one URL and a browser without WebP would get the empty box this hero must never be. **It is also painted as a CSS `background-image`, over a 551-byte inline copy of the same frame** — see "The box is painted by CSS" below. No second file: the small copy lives in `styles.css` as a `data:` URI. |
| `assets/Screen_Recording_20261008_081439_Chrome.mp4` | The uncut original, ~76 MB, the Product Owner's own screen recording of her test account. It is the source `app-loop.*` was cut from, and the source for the full 45-second video still to be produced per `video-script.md`. **It must not be committed at that size** — it is deliberately left untracked, and keeping it out of git is the Product Owner's to handle, not this folder's. |
| `assets/app-hoy.{webp,png}` | A real production capture of the running product mid-sale, 540×1170, supplied by the Product Owner from her own test account. It was the hero until the loop replaced it on 2026-10-08, and was then the loop's `poster` for one pass. **Both files are now kept but unreferenced** — see "Why the poster is not `app-hoy.png`" below; it is a measurement, not a preference. Stays in Spanish in both language versions (`BRIEF.md` §6) if it is ever used again. **Open item, which applies to the loop too:** the screen shows merchandise — Plumas, Cerveza, Camisas, Papas — which is not the pilot merchant's assortment, but is also not the substitution map `CONTENT.md` §6.3 names as binding for this surface (Bolsas, Accesorios, Playeras, Gorras). Flagged for the Product Owner rather than resolved here. |
| `assets/og-image.png` | 1200×630. Identity lockup only — no claim, so it serves both languages. |
| `assets/favicon*` | Derived from `mark.svg`. |
| `assets/fonts/*` | Fredoka (variable) and Inter 400/500, subset to Latin, converted to woff2. ~97 KB total. |

## The hero loop

The phone in the hero is a `<video>`, not a screenshot. It replaced the static
capture on 2026-10-08, on the Product Owner's call: a loop of the product being
used proves it works without anyone pressing play. It is evidence, not media —
no controls, no sound, nothing to click (`pointer-events: none`).

**Motion is opt-in, by the device's own setting.** This is the part to not
undo by accident:

- The element ships with **no `autoplay` attribute** and `preload="none"`. A
  small gate at the end of `<body>` starts it, and only when
  `prefers-reduced-motion` is *not* `reduce`. Measured: a reader who asked for
  less motion downloads **zero bytes** of the loop and sees the poster.
- It is written that way because `autoplay` in the markup starts before any
  script can intervene, and CSS can hide a video but cannot stop one. The
  attribute is the single thing that would make the promise unkeepable.
- If the setting changes while the page is open, the loop stops and the poster
  comes back. Both directions tested.
- The gate asks more than once, and asking is bounded. See "Why one `play()`
  call was not enough" below — a retry can never fire under reduced motion,
  and it gives up after five refusals rather than fight Low Power Mode.
- **With JavaScript off, nothing moves and nothing is fetched** — the poster is
  the whole hero, which is the hero this page shipped with. That is the safe
  direction for a failure, and the reason the gate is not "remove autoplay if
  reduce" but "add playback if no preference".

### The box is painted by CSS, not by the `poster` attribute

Reported from a real phone, 2026-10-08: the hero was a blank white rectangle,
and it filled in later. Measured rather than reasoned about, by screencasting
a throttled cold load frame by frame and reading the pixels inside the box:

| | before | after |
|---|---|---|
| 200 kbps, box blank/partly white after it appears | **5.8 s** | **70 ms** (one frame, at 7% opacity of its own fade-in) |
| 100 kbps, same | **12.1 s** | **86 ms** |
| poster file blocked entirely | empty box | painted |

The `poster` attribute was never the problem. Chrome and WebKit both paint it
at `readyState 0`, measured in both — it simply had not **arrived** yet. On a
200 kbps cold load `app-loop-poster.png` is the *last* thing the page finishes
(76 KB, behind the stylesheet, the document and three fonts), and until then
the box has nothing to show. Moving that same file to a CSS `background-image`
would have changed nothing on its own: same file, same arrival time.

So the box is painted in **two layers** (`styles.css`, `.phone video`), and
the bottom one costs no request at all:

1. the real still, `assets/app-loop-poster.png` — the same URL the `poster`
   attribute keeps, so it is never fetched twice;
2. **the same frame at 20×38, 551 bytes, inline as a `data:` URI.** It arrives
   inside the stylesheet, so it is painted at first style resolution: before
   the gate runs, while the real still is in flight, with JavaScript off, and
   permanently for a reader who asked for less motion. It is a real downscale
   of the real frame — header band, both scan buttons, the four product cards
   and the coral action button are all where they will be — so the handoff is
   a *sharpening*, never a substitution, and on a slow link the real PNG wipes
   down over it like a photo coming into focus.

The `poster` attribute stays as well. It is what a browser uses when it decides
to, and keeping all three costs nothing. **There is now no state, and no
instant, in which that box can be empty** — verified in Chrome and WebKit under
normal motion, reduced motion, JavaScript disabled, the poster file blocked,
and the poster *and* video both blocked.

Cost: `styles.css` grows 2.9 KB raw, ~1.6 KB gzipped (the 736-char data URI
does not compress; the rest is the comment explaining why it is there). The
page is served Brotli-compressed. Layout shift is unchanged at **CLS 0.012**,
and the phone contributes **zero** of it in every state — the one shift on the
page is the hero paragraph when Fredoka swaps in, which predates this and is
not the phone.

### Why one `play()` call was not enough

Reported from **macOS Safari**: the hero stayed still, scrolling it out of view
and back did nothing, and **only switching windows started it**. That is not a
paint problem — it is `play()` losing, with nothing ever asking again. It took
two passes to get right, and both failures are worth keeping written down
because they are different.

**A `play()` call can lose in two ways, and only one of them is a rejection.**

1. **Refused.** Safari rejects far more readily than Chrome: when the tab is
   not foregrounded at the moment of the call, when the element is off screen,
   and unconditionally in Low Power Mode. The promise rejects.
2. **Accepted, then nothing.** With `preload="none"` the browser may take the
   call, report `paused = false`, and simply not fetch. The promise never
   settles in either direction.

The first pass handled only (1), and introduced a guard that made (2)
permanent: `if (!v.paused) return`. Measured directly on the real element, in
WebKit **and** in Chrome:

| | `paused` | `readyState` |
|---|---|---|
| before `play()` | `true` | 0 |
| **synchronously after `play()`** | **`false`** | **0** |
| 1.5 s later | `false` | 4 |

`paused` flips **inside the call**, before anything has loaded. So that guard
does not mean "it is running", it means "we have asked once" — and when Safari
accepted and then fetched nothing, every later signal was turned away by a
state that had never become true. The observer fired on every scroll back
exactly as built; the guard rebounded it. What started the loop on a window
switch was Safari re-evaluating on its own, not this code.

The guard is now the honest test — `readyState >= 3` (`HAVE_FUTURE_DATA`), only
true once there are frames — and "accepted but still empty" is *detected* and
answered by raising `preload` to `auto`, which **resumes a suspended load**
(measured in both engines: `readyState` 0 → 4, 149 835 bytes, element
untouched, still paused). Three things about that, each deliberate:

- **It is evidence-based, not speculative.** Forcing the fetch on the *first*
  attempt would make a device in **Low Power Mode** — which refuses playback
  outright — pay **146 KB** for a loop it will never show. Measured: in WebKit
  it does exactly that. So the fetch is only forced once the browser has shown
  it accepted the call and still has nothing.
- **Raising `preload`, not calling `load()`.** `load()` *resets* the element,
  so a signal arriving during a perfectly healthy download would throw it away
  and start over. Raising `preload` resumes a suspended load and is a no-op on
  one already running.
- **It is never left armed.** `sync()` puts `preload` back to `none` the moment
  less motion is asked for. That attribute *is* the zero-bytes promise.

The gate re-asks only on a real signal, never on a timer:

- the element **entering the viewport** (`IntersectionObserver`) at **two
  thresholds**, so one unhurried scroll into view is two chances — the second
  is what catches a browser that silently deferred the first — and it fires
  again on every scroll back;
- the tab **becoming visible** again — the same `visibilitychange` signal
  `decision-log.md` D75 / commit `92f2e1b` leaned on when Chrome silently
  dropped a Web NFC session on backgrounding. Nothing here *claims* a state
  the way that UI did, so there is nothing to re-arm on the way out, only
  something to re-ask on the way back in;
- a **bfcache restore**, which fires `pageshow` and not `visibilitychange`;
- the reader's **first touch**, once. A swipe to scroll is a real gesture, and
  a gesture is what Safari trusts most.

And it **gives up**. Low Power Mode is a battery decision to respect, not a
race to win: after five consecutive refusals nothing asks again and the still
simply stays. A success resets the count, so a reader who scrolls past the hero
all afternoon never exhausts it.

Verified in WebKit and Chrome against two emulations — Safari's *refusal* rules
(hidden, off screen, Low Power) and Safari's *silent deferral* (accept, report
`paused=false`, fetch nothing, never settle) — run against the build she has
and the build this is:

| under silent deferral | the build she had | now |
|---|---|---|
| desktop, reader does nothing | **never plays** | **plays**, no action needed |
| scroll out of view and back | **never plays** | **plays** |
| switch window away and back | **never plays** | **plays** |
| phone, hero below the fold, scrolls to it | never plays | **plays** |
| phone, reader never scrolls | still, 0 bytes | still, 0 bytes, `preload` still `none` |

| under refusal | the build she had | now |
|---|---|---|
| phone, reader scrolls to the hero | never plays | **plays** |
| phone, 8 scroll away/back cycles | never plays | **plays**, 2 calls total |
| desktop, hero in view at load | plays | plays |
| Low Power Mode, repeated signals | still | still, **0 video bytes** |
| `play()` always refused, 10 tab cycles | — | **exactly 5 calls, then silence** |
| reduced motion — idle, scrolled, tapped, `pageshow`, 6 window cycles, all at once | 0 calls | **0 calls, 0 fetches, 0 bytes, `preload` never leaves `none`** |

**What could not be verified here, stated plainly:** real Safari. "Allow remote
automation" is off in Safari's Developer settings on this machine, and turning
it on is the Product Owner's call, not a build step — so the evidence above is
WebKit (Playwright, WebKit 27.2) and Chrome, plus explicit emulations of
Safari's two failure modes. That gap is exactly how the first pass shipped a
bug: a refusal-based emulation cannot model a browser that neither refuses nor
plays. **The remaining check is hers:** open the page on macOS Safari, cold,
and confirm the loop starts without leaving the tab or scrolling.

### Why the poster is not `app-hoy.png`

It was, for one pass, and the intent was right: reuse the still that was
already there. The pixels say it cannot work. The screenshot and the recording
are **two different captures of the same screen**, and they disagree twice —
the screenshot carries 146px of phone status and navigation bar that the
recording does not, and its app content sits **22px lower**. Measured
landmarks in `app-hoy.png`:

| Row | What is there |
|---|---|
| 0–51 | the phone's status bar — must be cropped away |
| 68–82 | «VENTA RÁPIDA» — cropping past row ~57 slices it |
| 1044–1102 | the app's own bottom tab bar — cropping into it slices the icons |
| 1103–1169 | the phone's black navigation bar — must be cropped away |

So the clean app screen is rows 52–1102, **1051 rows**, and the box is
**1024**. It is 27 rows short: every `object-position` either leaves device
chrome showing or cuts a UI element. There is no correct percentage, and that
held for the 1054-tall first cut too — the 42% used then left a 3px grey edge
and only looked clean because the loop was taller.

**So the poster is a frame of the loop itself** (7.2s, the sale at two items).
It needs no crop, it cannot drift if either file is ever recut again, and the
handoff is invisible by construction rather than by tuning. The box is still
locked with an explicit `aspect-ratio: 540 / 1024` rather than left to the
`width`/`height` attributes, so the hero cannot reflow when the video loads —
**that one line is what to change if the loop is recut to another height.**
`object-fit: cover` stays with no `object-position`: it does nothing while the
two match, and if they ever stop matching it crops rather than stretches.

`::-webkit-media-controls` is hidden deliberately: with JavaScript disabled,
Chrome and Safari force their own controls onto a `<video>` that carries none,
and they land across the middle of the screenshot.

**Weight.** The loop is in the hero, not deferred: the hero *is* the argument,
and a deferred hero is a hero that arrives late. With `preload="none"` the cost
is only paid by readers who will actually see it move — a reduced-motion reader
pays **76 KB** for the poster and nothing else. The sources are WebM-first as
specified, so Chrome takes the 146 KB VP9 rather than the 111 KB H.264; that is
the one place left where the page could shed ~35 KB by reordering, and it is
deliberate, because VP9 is the better-looking encode here.

## Colour

`styles.css` opens with every pair measured against the surface it actually
renders on. Two values are additions to `brand-guide.md` rather than quotations
from it, both named and measured: `--on-dark-muted` `#D5CFCA` (8.92:1 on the
dark band, where the ordinary muted ink is 2.31:1 and unusable) and `--line`
`#8C8681` (3.59:1 on white, 3.27:1 on the shell — the boundary token, clearing
`DESIGN-SYSTEM.md` §10's 3:1 floor). There are exactly three background
surfaces: white, `#F4F4F4` and `#2D2D2D`. No invented light tints.

One deliberate deviation from `brand-guide.md`, for an accessibility reason:
the primary button's hover is Tezontle **Dark** `#A72C2C`, not Tezontle
`#D94C3A`, because white on `#D94C3A` measures 4.16:1 and fails AA. This is
the same rebound `brand-guide.md` itself already applied to the bottom
navigation.

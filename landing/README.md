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
| `data-privacy-link="off"` | The privacy notice has a URL of its own (`CONTENT.md` §8.3). It must not be the retired demo subdomain (D61). |

## Before this page is shared anywhere

- `og:image` is a **relative** path and there is **no `og:url`**, because the
  page's own URL is unresolved (`CONTENT.md` §8.11). Both are marked `TODO(url)`
  in `index.html`. Fill them in with the absolute URL before sharing a link.
- `ihola@nahui.app` has not been delivery-tested (`CONTENT.md` §8.1).
- The written form of the Product Owner's name is pending her confirmation
  (`CONTENT.md` §8.13).

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
descriptions, the `aria-label`s, the screenshot's `alt`) follow the same rule:
the Spanish is the attribute already in the HTML, and only the English
alternate is carried, once, in a `data-*` attribute beside it.

## Assets

| File | Source |
|---|---|
| `assets/mark.svg` | Geometry unchanged from `company/brand/raw-assets/Component 1.svg`. Colours exposed as CSS variables so the halo can match the surface it sits on. |
| `assets/app-hoy.{webp,png}` | A real capture of the running product's "Hoy" screen, from `company/campaign-assets/`. Stays in Spanish in both language versions (`BRIEF.md` §6). It shows no merchandise, so the approved substitution map does not arise. |
| `assets/og-image.png` | 1200×630. Identity lockup only — no claim, so it serves both languages. |
| `assets/favicon*` | Derived from `mark.svg`. |
| `assets/fonts/*` | Fredoka (variable) and Inter 400/500, subset to Latin, converted to woff2. ~97 KB total. |

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

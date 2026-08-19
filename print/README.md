# print — static pieces, not ads

Everything in here is a **still** rendered by headless Chrome from a standalone
HTML file. Nothing here is part of the React app: these files live outside
`src/`, so CRA never compiles them and the Pages build ignores them. They are in
this repo because the artwork they use is, and because a finished coupon that
only exists in someone's Downloads folder is lost the moment that machine is.

Each piece imports its artwork straight out of `../../src/Images/` rather than
keeping its own copy — one file per logo, so a corrected mark fixes every piece
at once.

## Rendering

`puppeteer` is installed **outside** this repo on purpose (it pulls its own
Chromium, which does not belong in the install every ad build has to do). Same
arrangement as `tools/record.js`:

```
mkdir -p /tmp/rec && cd /tmp/rec && npm i puppeteer
```

Then, from the piece's own directory:

```
cd print/coupon           && NODE_PATH=/tmp/rec/node_modules node shot.js
cd print/staples-flyer    && NODE_PATH=/tmp/rec/node_modules node pdf.js
cd print/staples-brochure && NODE_PATH=/tmp/rec/node_modules node pdf.js
```

The scripts resolve paths from their own directory, so the output lands beside
the source regardless of where you invoked them from. `pdf.js` also drops
`proof-*.png` page images for checking a layout without opening a PDF viewer.

## The pieces

| Folder | Trim | What it is |
|---|---|---|
| `coupon/` | 2160×2160 px | Free-month coupon for **Code Ninjas Woodbridge**. Square, for Instagram. Promo code `CNWOODBRIDGE1`. |
| `staples-flyer/` | 5.5 × 8.5 in | Customer-facing take-one left **in Staples stores**. The $50 offer only. Prints 2-up on Letter. |
| `staples-brochure/` | 8.5 × 11 in, 2pp | Corporate leaflet handed to **Staples store teams**. Page 1 the $50 offer, page 2 the $20 offer. |

The flyer deliberately matches the trim and layout language of Staples' own $20
coupon so the two sit in the same rack and read as one campaign.

## Where the offer terms came from

The $50 terms are the ones in `src/Components/StaplesPowerUpAd.js` and
`StaplesLockupAd.js`, both of which record them as lifted from the Staples
Canada owner SOP. The two agree verbatim, so they are treated as canonical and
are **not** paraphrased anywhere in here.

The $20 terms are transcribed from the official coupon PDF (`Print Version 1–3`
of the `$20 Staples Offer` pack — all three are identical on terms; only the
hero word changes).

> **Known conflict, present in the source artwork.** The official $20 coupon
> says the offer runs to **Sept 14, 2026** in its headline and to **September
> 10, 2026** in its own fine print. Both are reproduced as they appear —
> rewriting a partner's legal copy would be worse than surfacing the clash —
> so this needs settling with Staples before another run is printed.

## Copy that is still unconfirmed

Per the repo rule on offer details: the flyer and brochure point at
`codeninjas.com` because the $50 offer is franchise-wide and no campaign landing
page was supplied. Neither carries a phone number or a participating-centre
list. The Woodbridge coupon carries `6175 Hwy 7`, `cnwoodbridge.com` and
`647-887-9940`.

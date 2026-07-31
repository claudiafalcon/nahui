# Vision

## What Nahui is

Nahui is not a payment application.

Nahui is the operating system for mobile merchants — bazaar sellers, pop-up stores, and small entrepreneurs.

Goal: **capture business intelligence without adding operational friction.**

The application follows the merchant's natural workflow instead of exposing technical concepts. Technology becomes invisible.

For who Nahui is building for and why (Ana, her validated frictions, business model direction), see `company/CLAUDE.md` — that's business context, not repeated here.

## Merchant workflow

The business starts when merchandise arrives, not when a sale happens.

```
Receive Merchandise
        ↓
Register Lot
        ↓
(Optional) Assign NFC Tags
        ↓
Schedule Event
        ↓
Start Business Session
        ↓
Sell Products
        ↓
Close Session
        ↓
Review Results
```

Buttons and NFC are not selling modes — they are implementation details of how a Sale captures which InventoryUnit sold. The merchant never switches between them while selling; see `architecture-principles.md` for why this is a Business-level capability, never a screen-level choice.

## Where this fits

This is one of several `00-foundation` documents. See `CLAUDE.md` in this folder for the full index and how to use them.

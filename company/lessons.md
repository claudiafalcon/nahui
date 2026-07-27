# Lessons learned

## 2026-07-25 — Initial tap-to-register prototype
- Decision: simulate NFC tap with large per-product buttons instead of waiting for physical tags, so the core mechanic (registration speed) can be validated without being blocked by hardware.
- Added automatic per-registration timer (not manual) because eyeballing time isn't reliable for the success metric (<3 seconds).
- Pending: once physical NFC tags arrive, replace the button with real NFC reading via Web NFC API (Android/Chrome only) or an external reader.

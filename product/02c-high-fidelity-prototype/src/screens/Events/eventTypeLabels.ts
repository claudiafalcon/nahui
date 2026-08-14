import type { EventType } from '../../domain/types';

/**
 * events.md §3.8 — the six closed Event types (`decision-log.md` D16),
 * naturalized into the Mexican-Spanish word a vendor would actually say for
 * each one — the same treatment `ubiquitous-language.md` already gives
 * "Bazaar" itself. "Market" renders as "Tianguis," not a literal
 * translation (EVT-M1 remediation: "Tianguis" — the recurring, open-air
 * public market a vendor like Ana would actually call by that name, a
 * meaningfully different venue from "Bazar," not a synonym for it).
 * "Bazar" is listed first in the picker (§3.8's own ordering note) —
 * `EVENT_TYPE_ORDER` below preserves that order; this map alone doesn't.
 */
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  Bazaar: 'Bazar',
  Expo: 'Expo',
  'Pop-up': 'Pop-up',
  Festival: 'Festival',
  Market: 'Tianguis',
  'Office Sale': 'Venta de oficina',
};

/** §3.8's own display order — "Bazar" first (Ana's primary, validated
 * context, `company/CLAUDE.md`), not alphabetical. */
export const EVENT_TYPE_ORDER: EventType[] = ['Bazaar', 'Expo', 'Pop-up', 'Festival', 'Market', 'Office Sale'];

let counter = 0;

/** Same shape as the Merchant prototype's own `makeId` (prefix + running
 * counter) — referenced for shape only, reimplemented locally per this
 * folder's zero-import rule. */
export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}-${counter}-${Date.now().toString(36)}`;
}

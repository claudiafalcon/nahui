let counter = 0;

/** Simple, readable, collision-safe-enough id generator for a local prototype. */
export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

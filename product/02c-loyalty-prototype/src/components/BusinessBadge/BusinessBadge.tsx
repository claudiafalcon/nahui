import styles from './BusinessBadge.module.css';

/**
 * `Business.name` (or `Business.logo`) is the primary, foreground identity
 * on every screen that shows one — never Nahui's own mark in that
 * position (`customer-loyalty-registration.md` §3.5's own annotation,
 * mirroring `home.md` §3.8f's identical call for the merchant receipt:
 * same source fields, "never both together"). No seed Business in this
 * build sets a `logo`, so every screen renders the name path; the initial
 * avatar bubble is this build's own visual-language choice (not dictated
 * by the spec) for a page that would otherwise open with nothing but a
 * line of text as its sole grounding.
 */
export function BusinessBadge({ name, logo }: { name: string; logo?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className={styles.badge}>
      <div className={styles.avatar} aria-hidden="true">
        {logo ? <img src={logo} alt="" /> : initial}
      </div>
      <span className={styles.name}>{name}</span>
    </div>
  );
}

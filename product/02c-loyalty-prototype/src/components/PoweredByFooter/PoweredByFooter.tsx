import styles from './PoweredByFooter.module.css';

/**
 * A small, passive, non-tappable trust footer — never the merchant-app
 * shell, never a navigation element, no logo, no tap target
 * (`customer-loyalty-registration.md` §3.5/§3.6/§3.10/§3.11, §10). Reasoned
 * explicitly in the spec: a completely unbranded page asking a stranger
 * for her email reads more like phishing, not less.
 */
export function PoweredByFooter() {
  return <p className={styles.footer}>Powered by Nahui</p>;
}

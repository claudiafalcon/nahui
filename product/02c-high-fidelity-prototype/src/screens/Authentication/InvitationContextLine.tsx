import styles from './InvitationContextLine.module.css';

/** A pre-auth Invitation token she's carrying through the whole §3.2a–§3.2f
 * (and §3.3–§3.7d) authentication sub-flow — the shared shape every step
 * component that accepts an `invitationContext` prop passes through. */
export type InvitationContext = { businessName: string };

/**
 * authentication.md §2.0 step 4 (closes `ux-critic` M1) — "this token's
 * presence stays visible to her, not just to the system, for as long as she
 * carries it: every screen in §3.2a–§3.2f... renders one additional line
 * acknowledging the commitment she just made... reused verbatim at every
 * other screen this sub-flow reaches rather than redrawn at each one, per
 * this folder's own §4 shared-state citation rule." One shared component so
 * that reuse is real, not eight independently-typed copies of the same
 * sentence.
 *
 * Stacked above whatever else the screen already shows, never replacing any
 * of its own existing copy — §3.2a itself is the one deliberate exception:
 * its own "Para empezar," line is replaced outright by this same sentence,
 * not stacked alongside it (§3.2a's own wireframe). That one substitution is
 * handled locally in `ChooseMethodStep.tsx`, not through this component,
 * since it's a real content replacement, not an addition.
 *
 * Deliberately not rendered on any near-instant/slow silent-skeleton
 * transition (`GoogleProgress`, the "Enviando…"/"Confirmando…" states in
 * `PhoneStep`/`EmailStep`/`CodeStep`) — those screens show no text at all in
 * their near-instant form and a single generic status word in their slow
 * form, by the same "technology should disappear" convention every other
 * tab's own §3.1/§3.2 already holds itself to; stacking a business-name line
 * onto a state designed to carry zero content would contradict that
 * convention rather than extend it. A disclosed simplification, not a
 * silent gap — every screen with real body copy still carries the line.
 */
export function InvitationContextLine({ businessName }: InvitationContext) {
  return <p className={styles.line}>Para aceptar la invitación de {businessName}</p>;
}

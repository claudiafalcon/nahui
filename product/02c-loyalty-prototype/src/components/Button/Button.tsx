import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'decline';
}

/**
 * Two variants only, per `company/brand/brand-guide.md`'s Buttons section:
 * Primary (solid Coral AA+ fill, white text) and — reused here for
 * "No, gracias" — an outlined/light-fill Secondary treatment, sized and
 * weighted identically to Primary so declining is genuinely as easy to
 * notice and tap as confirming (§3.5's own "no dark patterns" reasoning),
 * without the two looking identical.
 */
export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const variantClass = variant === 'primary' ? styles.primary : styles.decline;
  return <button className={[styles.button, variantClass, className].filter(Boolean).join(' ')} {...rest} />;
}

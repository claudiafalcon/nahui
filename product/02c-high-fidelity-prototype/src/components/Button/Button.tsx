import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  inline?: boolean;
}

export function Button({ variant = 'primary', inline, className, ...rest }: ButtonProps) {
  const classes = [styles.btn, styles[variant], inline ? styles['size-inline'] : '', className]
    .filter(Boolean)
    .join(' ');
  return <button className={classes} {...rest} />;
}

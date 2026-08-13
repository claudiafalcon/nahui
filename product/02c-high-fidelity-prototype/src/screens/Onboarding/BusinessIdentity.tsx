import { useRef, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { WritingState } from './WritingState';
import styles from './BusinessIdentity.module.css';

const SAVE_DELAY_MS = 260;

/**
 * onboarding.md §3.9/§3.9a/§3.10/§3.10a — Tu negocio. Reached the instant
 * §3.5's write succeeds, real paths only. No back arrow, no nav bar — the
 * identical reasoning §3.5b/§3.5c already give.
 *
 * "Subir logo" opens the device's own file picker (§0 — below this spec's
 * abstraction level, no cropping/editing of any kind). The inline failure
 * state (a file that can't be shown as a logo preview) *is* genuinely
 * reachable — selecting a non-image file — not a static/unwired state.
 */
export function BusinessIdentity({
  onSaved,
}: {
  onSaved: (fields: { name: string; logo?: string; description?: string }) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canContinue = name.trim().length > 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('No pudimos mostrar ese archivo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(typeof reader.result === 'string' ? reader.result : undefined);
      setLogoError(null);
    };
    reader.onerror = () => setLogoError('No pudimos mostrar ese archivo.');
    reader.readAsDataURL(file);
  }

  function handleContinue() {
    if (!canContinue) return;
    setSaving(true);
    window.setTimeout(() => {
      onSaved({ name: name.trim(), logo, description: description.trim() || undefined });
    }, SAVE_DELAY_MS);
  }

  if (saving) {
    return <WritingState label="Guardando tu negocio…" />;
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Tu negocio</h1>
      <p className={styles.body}>
        {logo
          ? 'Tu nombre y tu logo son lo que tus clientes van a ver en tu recibo digital.'
          : 'Tu nombre y tu logo son lo que tus clientes van a ver en tu recibo digital. Trae tu logo si ya tienes uno — no es necesario.'}
      </p>

      <div className={styles.field}>
        <span className={styles.label}>Nombre de tu negocio</span>
        <input
          className={styles.input}
          type="text"
          autoFocus
          placeholder="Escribe el nombre…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Logo (opcional)</span>
        {logo ? (
          <div className={styles.logoRow}>
            <img className={styles.logoPreview} src={logo} alt="Logo de tu negocio" />
            <button className={styles.linkBtn} onClick={() => fileInputRef.current?.click()}>
              Cambiar
            </button>
            <button
              className={styles.linkBtn}
              onClick={() => {
                setLogo(undefined);
                setLogoError(null);
              }}
            >
              Quitar
            </button>
            <span className={styles.visuallyHidden} role="status">
              Logo cargado
            </span>
          </div>
        ) : (
          <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
            Subir logo
          </button>
        )}
        {logoError && (
          <p className={styles.error}>
            {logoError}
            <br />
            Intenta con otro logo, si quieres.
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenFileInput}
          onChange={handleFileChange}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Descripción o frase (opcional)</span>
        <textarea
          className={styles.textarea}
          placeholder="Escribe algo breve…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
        <span className={styles.hint}>La guardamos con tu negocio — tu recibo no la muestra todavía.</span>
      </div>

      <div className={styles.spacer} />
      <Button className={styles.cta} disabled={!canContinue} onClick={handleContinue}>
        Continuar
      </Button>
    </div>
  );
}

import { useRef, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { PhotoCapture } from '../../components/PhotoCapture/PhotoCapture';
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
 *
 * §3.10a's save error/retry is now wired (`WritingState`'s `error`/
 * `errorLabel`/`onRetry`, identical shape to §3.5a in `OnboardingFlow.tsx`) —
 * and, as of Stage 7 Backend Integration's real `update_business_identity`
 * call, genuinely reachable: a rejected/failed RPC call lands here for real,
 * not just a disclosed-but-unreachable branch.
 *
 * **"¿Cómo te llamas?" (added 2026-09-15, `decision-log.md` D69,
 * `product-decisions.md` Q29) — `User.displayName`, a genuinely different
 * fact from the other three fields, written by a second, independently-
 * sequenced, best-effort write, never folded into `onSaved`'s own
 * `Business`-identity write.** Never gates "Continuar" — the same
 * zero-required-tap treatment Logo/Descripción already get. Its own write
 * (`onDisplayNameSaved`, fired only after `onSaved` itself already
 * succeeded, per §2.2b's own decided ordering) is fire-and-forget from this
 * component's own point of view: this screen never blocks progression on
 * it, and never surfaces its failure — `OnboardingFlow.tsx`'s own caller
 * logs a failure to the console and nothing more, the same restraint the
 * demo path's own seed-identity write already takes for a comparable
 * "not this dispatch's UX to invent a retry surface for" write.
 */
export function BusinessIdentity({
  onSaved,
  onDisplayNameSaved,
}: {
  onSaved: (fields: { name: string; logo?: string; description?: string }) => Promise<boolean>;
  /** `decision-log.md` D69/§2.2b's own second, independently-sequenced
   * write — fired only once `onSaved` above has already succeeded, never
   * awaited by this component (best-effort, from her own point of view a
   * fire-and-forget side effect of tapping "Continuar"). A no-op call when
   * she left "¿Cómo te llamas?" blank — nothing to write, the identical
   * "leaving it untouched is the entire skip mechanism" posture Logo/
   * Descripción already get. */
  onDisplayNameSaved: (displayName: string) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Live-found gap (2026-09-15) — same as CatalogView.tsx's own note.
  const [cameraOpen, setCameraOpen] = useState(false);

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
    setSaveState('saving');
    window.setTimeout(async () => {
      const ok = await onSaved({ name: name.trim(), logo, description: description.trim() || undefined });
      if (!ok) {
        setSaveState('error');
        return;
      }
      // `decision-log.md` D69/§2.2b — reached only once the Business-identity
      // write above has already succeeded (the Product Owner's own decided
      // ordering). Never awaited, never gates progression, its own failure
      // is never shown to her — a genuinely independent, best-effort second
      // write, not a second step of this same commit.
      const trimmedDisplayName = displayName.trim();
      if (trimmedDisplayName) onDisplayNameSaved(trimmedDisplayName);
    }, SAVE_DELAY_MS);
  }

  if (saveState === 'saving') {
    return <WritingState label="Guardando tu negocio…" />;
  }

  if (saveState === 'error') {
    // §3.10a — Stage 7 Backend Integration: a genuinely reachable branch now,
    // reached when the real `update_business_identity` RPC call fails.
    // Retrying replays the exact already-typed Nombre/Descripción and
    // already-selected Logo, since this is the same component instance and
    // none of that state was ever cleared — and per §3.10a's own wireframe,
    // that preservation is shown, not just true:
    // Nombre/logo/Descripción render above "Reintentar," reusing the exact
    // logo-preview markup (`.logoPreview`) the non-error screen already uses.
    return (
      <WritingState
        error
        errorLabel="No pudimos guardar tu negocio. Sigue aquí, intenta de nuevo."
        onRetry={handleContinue}
      >
        <div className={styles.errorPreview}>
          <span className={styles.errorPreviewName}>{name.trim()}</span>
          {logo && <img className={styles.logoPreview} src={logo} alt="Logo de tu negocio" />}
          {description.trim() && <p className={styles.errorPreviewDescription}>{description.trim()}</p>}
        </div>
      </WritingState>
    );
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

      {/* "¿Cómo te llamas?" — new 2026-09-15, `decision-log.md` D69/§2.2b.
          Deliberately not labeled "Tu nombre" (already committed on this
          screen to mean `Business.name`, per the intro paragraph above) —
          a direct, personal question instead, unmistakably distinct from
          "Nombre de tu negocio." Never gates "Continuar." */}
      <div className={styles.field}>
        <span className={styles.label}>¿Cómo te llamas? (opcional)</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Escribe tu nombre…"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <span className={styles.hint}>Así te reconocen en Resultados y en Tu equipo — nunca en tu recibo.</span>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Logo (opcional)</span>
        {logo ? (
          <div className={styles.logoRow}>
            <img className={styles.logoPreview} src={logo} alt="Logo de tu negocio" />
            <button className={styles.linkBtn} onClick={() => setCameraOpen(true)}>
              Tomar foto
            </button>
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
          <div style={{ display: 'flex', gap: 12 }}>
            <button className={styles.uploadBtn} onClick={() => setCameraOpen(true)}>
              Tomar foto
            </button>
            <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
              Subir logo
            </button>
          </div>
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
          accept="image/*,android/allowCamera"
          capture="environment"
          className={styles.hiddenFileInput}
          onChange={handleFileChange}
        />
        {cameraOpen && (
          <PhotoCapture
            onCapture={(dataUrl) => {
              setLogo(dataUrl);
              setLogoError(null);
              setCameraOpen(false);
            }}
            onCancel={() => setCameraOpen(false)}
            onUnavailable={() => {
              setCameraOpen(false);
              fileInputRef.current?.click();
            }}
          />
        )}
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

import { useEffect, useState } from 'react';
import { copyToClipboard } from '@/ui/common/clipboard';
import { TournamentIcon, type TournamentText } from './TournamentDisplay';

export function ShareTournamentButton({ url, text }: { url: string; text: TournamentText }) {
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);
  const [copying, setCopying] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 3000);
    return () => window.clearTimeout(timer);
  }, [copied]);
  async function copy() {
    setCopying(true);
    try { await copyToClipboard(url); setCopied(true); setManual(false); }
    catch { setManual(true); }
    finally { setCopying(false); }
  }
  return <div className="t-share-control">
    <button type="button" className="t-share-button" disabled={copying} onClick={() => void copy()}><TournamentIcon name={copied ? 'check' : 'share'} />{copied ? text('Enlace copiado', 'Link copied') : text('Compartir torneo', 'Share tournament')}</button>
    <span className="sr-only" role="status">{copied ? text('Enlace del torneo copiado al portapapeles.', 'Tournament link copied to clipboard.') : ''}</span>
    {manual && <label>{text('Copia este enlace para compartir el torneo', 'Copy this link to share the tournament')}<input aria-label={text('Enlace del torneo', 'Tournament link')} readOnly value={url} onFocus={(e) => e.target.select()} /></label>}
  </div>;
}

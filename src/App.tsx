import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { AudioEngine } from './audio/engine';
import { Presentation } from './components/Presentation';
import { PresenterView } from './presenter/PresenterView';
import { PreviewMode } from './presenter/PreviewMode';
import { LIVE_CHANNEL, useDeck } from './presenter/deck';

const subscribe = (cb: () => void) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb); };
const getRoute = () => location.hash.replace(/^#\/?/, '').split('?')[0] || 'audience';

function Audience({ audio }: { audio: AudioEngine }) {
  const deck = useDeck(LIVE_CHANNEL, 'start', 'audience');
  useEffect(() => { (window as unknown as { __osis: unknown }).__osis = { get state() { return deck.state; }, audio }; });
  return <Presentation deck={deck} audio={audio} role="audience" />;
}

/**
 * Routing berbasis hash (#/ audiens, #/presenter, #/preview) → refresh tidak pernah 404,
 * sekaligus aman di host statis manapun. vercel.json tetap menyertakan SPA fallback.
 */
export default function App() {
  const route = useSyncExternalStore(subscribe, getRoute);
  const audio = useMemo(() => new AudioEngine(), []);
  useEffect(() => { (window as unknown as { __audio: AudioEngine }).__audio = audio; return () => audio.dispose(); }, [audio]);
  if (route === 'presenter') return <PresenterView />;
  if (route === 'preview') return <PreviewMode audio={audio} />;
  return <Audience audio={audio} />;
}

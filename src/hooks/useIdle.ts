import { useEffect, useState } from 'react';
/** true = kontrol terlihat (mouse bergerak / tombol ditekan); false setelah idle. */
export function useActive(ms = 2600) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    let t: number;
    const bump = () => { setActive(true); clearTimeout(t); t = window.setTimeout(() => setActive(false), ms); };
    bump();
    window.addEventListener('mousemove', bump); window.addEventListener('keydown', bump); window.addEventListener('pointerdown', bump);
    return () => { clearTimeout(t); window.removeEventListener('mousemove', bump); window.removeEventListener('keydown', bump); window.removeEventListener('pointerdown', bump); };
  }, [ms]);
  return active;
}

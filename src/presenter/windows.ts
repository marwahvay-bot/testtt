/** Utilitas window: Presenter View, layar audiens, fullscreen. Semua defensif (popup bisa diblokir). */
const base = () => location.href.split('#')[0];

export function openPresenter(): Window | null {
  const w = window.open(`${base()}#/presenter`, 'osis-presenter', 'popup=yes,width=1400,height=860');
  w?.focus();
  return w;
}

/** Buka layar audiens. Jika Window Management API tersedia & ada layar kedua, tempatkan di layar tersebut. */
export async function openAudience(): Promise<Window | null> {
  let feat = 'popup=yes,width=1280,height=720';
  try {
    const gsd = (window as unknown as { getScreenDetails?: () => Promise<{ screens: Array<{ availLeft: number; availTop: number; availWidth: number; availHeight: number; isPrimary: boolean }> }> }).getScreenDetails;
    if (gsd) {
      const d = await gsd.call(window);
      const ext = d.screens.find((s) => !s.isPrimary);
      if (ext) feat = `popup=yes,left=${ext.availLeft},top=${ext.availTop},width=${ext.availWidth},height=${ext.availHeight}`;
    }
  } catch { /* izin ditolak / tidak didukung → posisi default */ }
  const w = window.open(`${base()}#/`, 'osis-audience', feat);
  w?.focus();
  return w;
}

export async function toggleFullscreen(forceOn = false) {
  try {
    if (document.fullscreenElement) { if (!forceOn) await document.exitFullscreen(); }
    else await document.documentElement.requestFullscreen();
  } catch { /* ditolak browser */ }
}
export const isFullscreen = () => !!document.fullscreenElement;

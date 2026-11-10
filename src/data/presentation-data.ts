/**
 * SINGLE SOURCE OF TRUTH — seluruh konten presentasi.
 * Diekstrak dari "OSIS-SEKBID-6-PRESENTATION-TRANSITIONS.pptx" (8 slide) dan opening MP4.
 * Teks sumber dipertahankan apa adanya. Hal yang tidak ada di sumber ditulis:
 * "Belum tercantum di sumber."  (lihat docs/CONTENT_AUDIT.md)
 */

export type Sfx = 'whoosh' | 'impact' | 'riser' | 'sweep' | 'tick' | null;
export type Theme = 'blue' | 'navy' | 'white' | 'yellow';
export type SceneKind =
  | 'intro' | 'overview' | 'goals' | 'proker' | 'roles'
  | 'workflow' | 'outputs' | 'principles' | 'closing' | 'qa';

export const NOT_IN_SOURCE = 'Belum tercantum di sumber.';

export const identity = {
  org: 'OSIS SMAN 3 KUALA KAPUAS',
  period: '2026/2027',
  sekbid: 'SEKBID 6',
  tagline: 'PUBLIKASI, DOKUMENTASI & DESAIN',
  alt: 'OSIS VISUAL — DOCUMENTATION & CREATIVE MEDIA',
  logos: {
    osis: './assets/logos/logo_osis.png',
    sekolah: './assets/logos/logo_sekolah.png',
    sekbid6: './assets/logos/logo_sekbid6.png',
  },
};

/* ───────────── Slide 01 ───────────── */
export const intro = {
  headline: ['DARI MOMEN', 'MENJADI', 'INFORMASI.'],
  body: 'Sekbid 6 berperan dalam mengelola publikasi, dokumentasi, desain, editing, dan arsip digital untuk mendukung penyampaian informasi serta identitas visual OSIS.',
  flowLabel: 'ALUR KERJA SEKBID 6',
  flow: ['DOKUMENTASI', 'KREATIVITAS', 'PUBLIKASI', 'ARSIP'],
};

/* ───────────── Slide 02 — 6 program kerja ───────────── */
export interface Proker {
  no: string;
  id: string;
  name: string;
  lines: string[]; // pemenggalan judul untuk kinetic typography (tidak mengubah nama resmi)
  desc: string;
  keywords: string[];
  flowStep: 0 | 1 | 2 | 3; // posisi pada alur slide 01 (inferensi editorial, lihat CONTENT_AUDIT)
  outputs: string[]; // dirujuk dari slide 06 (inferensi editorial)
  theme: Theme;
  motif: 'lens' | 'shapes' | 'timeline' | 'signal' | 'folders' | 'burst';
}

export const prokers: Proker[] = [
  { no: '01', id: 'dokumentasi-event', name: 'DOKUMENTASI EVENT', lines: ['DOKUMENTASI', 'EVENT'],
    desc: 'Mendokumentasikan kegiatan OSIS dan sekolah melalui foto maupun video.',
    keywords: ['foto', 'video'], flowStep: 0, outputs: ['FOTO KEGIATAN', 'VIDEO DOKUMENTASI'], theme: 'blue', motif: 'lens' },
  { no: '02', id: 'creative-media', name: 'CREATIVE MEDIA', lines: ['CREATIVE', 'MEDIA'],
    desc: 'Membuat poster, banner, konten media sosial, dan kebutuhan visual lainnya.',
    keywords: ['poster', 'banner', 'media sosial'], flowStep: 1, outputs: ['POSTER & DESAIN', 'KONTEN MEDSOS'], theme: 'white', motif: 'shapes' },
  { no: '03', id: 'video-photo-editing', name: 'VIDEO & PHOTO EDITING', lines: ['VIDEO & PHOTO', 'EDITING'],
    desc: 'Mengolah hasil dokumentasi menjadi konten visual yang siap digunakan atau dipublikasikan.',
    keywords: ['siap digunakan', 'dipublikasikan'], flowStep: 1, outputs: ['VIDEO HASIL EDITING'], theme: 'navy', motif: 'timeline' },
  { no: '04', id: 'publikasi', name: 'PUBLIKASI', lines: ['PUBLIKASI'],
    desc: 'Menyebarkan informasi dan dokumentasi melalui media komunikasi OSIS yang sesuai.',
    keywords: ['informasi', 'dokumentasi'], flowStep: 2, outputs: ['KONTEN MEDSOS', 'WEBSITE INFORMASI OSIS'], theme: 'yellow', motif: 'signal' },
  { no: '05', id: 'digital-archive', name: 'DIGITAL ARCHIVE', lines: ['DIGITAL', 'ARCHIVE'],
    desc: 'Mengelola dan menyimpan dokumentasi secara terstruktur agar mudah dicari dan digunakan kembali.',
    keywords: ['terstruktur', 'mudah dicari'], flowStep: 3, outputs: ['ARSIP DIGITAL', 'STRUKTUR FOLDER ARSIP'], theme: 'blue', motif: 'folders' },
  { no: '06', id: 'creative-event', name: 'CREATIVE EVENT', lines: ['CREATIVE', 'EVENT'],
    desc: 'Mengembangkan kegiatan atau tantangan kreatif seputar fotografi, videografi, desain, dan media.',
    keywords: ['fotografi', 'videografi', 'desain', 'media'], flowStep: 1, outputs: [], theme: 'navy', motif: 'burst' },
];

export const overview = { title: ['6 PROGRAM', 'KERJA.'], accent: ['1 TUJUAN', 'VISUAL.'] };

/* ───────────── Slide 03 ───────────── */
export const goals = {
  title: 'APA YANG INGIN KAMI CAPAI?',
  items: [
    { no: '01', title: 'Dokumentasi berkualitas.', body: 'Memastikan setiap kegiatan OSIS terdokumentasi dengan baik.', icon: 'target' },
    { no: '02', title: 'Kualitas visual meningkat.', body: 'Meningkatkan kualitas foto, video, desain, editing, dan publikasi.', icon: 'bars' },
    { no: '03', title: 'Arsip terorganisir.', body: 'Menyimpan dokumentasi secara rapi agar mudah ditemukan dan digunakan kembali.', icon: 'folder' },
    { no: '04', title: 'Identitas visual konsisten.', body: 'Membangun identitas visual OSIS yang lebih terarah dan konsisten.', icon: 'ring' },
  ],
};

/* ───────────── Slide 04 ───────────── */
export const roles = {
  title: ['FLEKSIBEL DALAM', 'PERAN.'],
  title2: ['TERARAH DALAM', 'HASIL.'],
  lead: 'Peran dapat berbeda sesuai:',
  points: ['Kebutuhan kegiatan', 'Kemampuan masing-masing', 'Kondisi di lapangan', 'Kebutuhan tim'],
  closing: 'Anggota juga dapat saling membantu dalam proses produksi.',
  nodes: ['DOKUMENTASI', 'DESAIN', 'EDITING', 'PUBLIKASI', 'ARSIP'],
};

/* ───────────── Slide 05 ───────────── */
export const workflow = {
  title: 'DARI PERMINTAAN SAMPAI ARSIP.',
  steps: [
    { no: '01', title: 'PERMINTAAN', body: 'Menerima kebutuhan dokumentasi atau desain.' },
    { no: '02', title: 'PENENTUAN PIC', body: 'Menentukan penanggung jawab berdasarkan kebutuhan kegiatan.' },
    { no: '03', title: 'PRODUKSI', body: 'Melaksanakan dokumentasi, desain, atau editing.' },
    { no: '04', title: 'QC', body: 'Memeriksa kualitas dan kelayakan hasil.' },
    { no: '05', title: 'PUBLIKASI', body: 'Menyampaikan hasil melalui media yang sesuai.' },
    { no: '06', title: 'ARSIP', body: 'Menyimpan hasil secara terstruktur.' },
  ],
};

/* ───────────── Slide 06 ───────────── */
export const outputs = {
  title: ['BUKAN SEKADAR', 'DOKUMENTASI.'],
  note: 'Contoh output yang direncanakan',
  items: [
    { id: 'foto', label: 'FOTO KEGIATAN', kind: 'concept' },
    { id: 'video', label: 'VIDEO DOKUMENTASI', kind: 'concept' },
    { id: 'poster', label: 'POSTER & DESAIN', kind: 'concept' },
    { id: 'medsos', label: 'KONTEN MEDSOS', kind: 'concept' },
    { id: 'editing', label: 'VIDEO HASIL EDITING', kind: 'real' },
    { id: 'arsip', label: 'ARSIP DIGITAL', kind: 'concept' },
    { id: 'folder', label: 'STRUKTUR FOLDER ARSIP', kind: 'concept' },
    { id: 'web', label: 'WEBSITE INFORMASI OSIS', kind: 'web' },
  ],
  webTitle: 'PROTOTYPE WEBSITE OSIS',
  webStatus: 'Dalam pengembangan',
};

/* ───────────── Slide 07 ───────────── */
export const principles = {
  title: ['MEMBANGUN MEDIA OSIS', 'YANG LEBIH TERARAH.'],
  items: [
    { no: '01', title: 'KONSISTENSI', body: 'Menjaga kualitas dan konsistensi dokumentasi serta publikasi.' },
    { no: '02', title: 'KETERATURAN', body: 'Membangun sistem penyimpanan dan pengelolaan aset digital.' },
    { no: '03', title: 'KREATIVITAS', body: 'Mengembangkan ide dan kemampuan anggota dalam bidang visual media.' },
  ],
};

/* ───────────── Slide 08 ───────────── */
export const closing = {
  lines: [
    { pre: 'CAPTURE THE ', hi: 'MOMENT.' },
    { pre: 'CREATE THE ', hi: 'STORY.' },
    { pre: 'PRESERVE THE ', hi: 'MEMORY.' },
  ],
};

/* ───────────── Q&A (editorial; tidak ada di PPTX) ───────────── */
export const qa = {
  title: ['DISKUSI &', 'TANYA JAWAB.'],
  sub: 'Ada yang ingin ditanyakan atau dibahas bersama?',
};

/* ═════════════ Scene map + Presenter Notes ═════════════ */
export interface Notes {
  points: string[];
  facts: string[];
  context: string;
  narrative: string;
  transition: string;
}
export interface SceneMeta {
  id: string;
  kind: SceneKind;
  group: 'Pembuka' | 'Program Kerja' | 'Cara Kerja' | 'Penutup';
  name: string;
  proker?: number;
  stages: number;
  stageLabels: string[];
  sfx: Sfx[]; // satu per stage (index 0 = stage 1)
  duration: number; // detik (rekomendasi)
  source: string;
  notes: Notes;
}

const P = prokers;

export const scenes: SceneMeta[] = [
  {
    id: 'intro', kind: 'intro', group: 'Pembuka', name: 'Dari Momen Menjadi Informasi', stages: 3,
    stageLabels: ['Judul', 'Peran Sekbid 6', 'Alur kerja'], sfx: ['whoosh', 'tick', 'sweep'], duration: 25, source: 'Slide 01',
    notes: {
      points: ['Sekbid 6 = pengelola publikasi, dokumentasi, desain, editing, dan arsip digital.', 'Tujuan akhirnya: penyampaian informasi dan identitas visual OSIS.', 'Alur: Dokumentasi → Kreativitas → Publikasi → Arsip.'],
      facts: ['Periode OSIS SMAN 3 Kuala Kapuas 2026/2027.', 'Empat tahap alur kerja Sekbid 6.'],
      context: 'Opening tadi sudah memperkenalkan tim dan identitas Sekbid 6. Scene ini menerjemahkan identitas itu menjadi peran yang konkret.',
      narrative: 'Jadi, sederhananya, Sekbid 6 itu tugasnya mengubah momen menjadi informasi. Setiap kegiatan OSIS dan sekolah kami tangkap, kami olah, kami sebarkan, lalu kami simpan rapi. Alurnya empat tahap: dokumentasi, kreativitas, publikasi, dan arsip.',
      transition: 'Nah, supaya alurnya berjalan, kami punya enam program kerja. Yuk kita lihat satu per satu.',
    },
  },
  {
    id: 'overview', kind: 'overview', group: 'Pembuka', name: '6 Program Kerja, 1 Tujuan Visual', stages: 2,
    stageLabels: ['Judul', 'Enam program kerja'], sfx: ['whoosh', 'sweep'], duration: 25, source: 'Slide 02',
    notes: {
      points: ['Enam proker, satu tujuan visual.', 'Sebut nama keenam proker sekilas; detail ada di scene masing-masing.'],
      facts: P.map((p) => `${p.no} ${p.name}`),
      context: 'Ini peta besar. Jangan dijelaskan panjang, karena tiap proker punya scene sendiri.',
      narrative: 'Ada enam program kerja, tapi semuanya mengarah ke satu tujuan visual. Dokumentasi Event, Creative Media, Video & Photo Editing, Publikasi, Digital Archive, dan Creative Event.',
      transition: 'Sebelum masuk ke detail, ini dulu yang ingin kami capai lewat keenam proker tadi.',
    },
  },
  {
    id: 'goals', kind: 'goals', group: 'Pembuka', name: 'Apa yang Ingin Kami Capai?', stages: 3,
    stageLabels: ['Judul', 'Target 01–02', 'Target 03–04'], sfx: ['whoosh', 'tick', 'tick'], duration: 30, source: 'Slide 03',
    notes: {
      points: ['Empat target: dokumentasi berkualitas, kualitas visual meningkat, arsip terorganisir, identitas visual konsisten.'],
      facts: goals.items.map((g) => `${g.no} ${g.title}`),
      context: 'Empat target ini menjadi tolok ukur seluruh proker.',
      narrative: 'Ada empat hal yang ingin kami capai. Pertama, setiap kegiatan terdokumentasi dengan baik. Kedua, kualitas visualnya naik. Ketiga, arsipnya rapi dan mudah ditemukan lagi. Keempat, identitas visual OSIS jadi lebih terarah dan konsisten.',
      transition: 'Sekarang kita masuk ke proker pertama.',
    },
  },
  ...P.map<SceneMeta>((p, i) => ({
    id: p.id, kind: 'proker', group: 'Program Kerja', name: p.name, proker: i, stages: 3,
    stageLabels: ['Nama program', 'Penjelasan', 'Posisi dalam alur & contoh output'], sfx: ['whoosh', 'tick', 'sweep'] as Sfx[],
    duration: 22, source: 'Slide 02 (+ slide 01 & 06 untuk keterkaitan)',
    notes: {
      points: [p.desc, `Posisi pada alur kerja: ${intro.flow[p.flowStep]}.`, p.outputs.length ? `Contoh output terkait: ${p.outputs.join(', ')}.` : `Contoh output terkait: ${NOT_IN_SOURCE}`],
      facts: [`Nama resmi: ${p.name}`, 'Jadwal, target peserta, dan output rinci: ' + NOT_IN_SOURCE],
      context: 'Sumber hanya memuat nama dan deskripsi satu kalimat untuk tiap proker. Detail tambahan (jadwal, peserta, mekanisme) sengaja tidak ditampilkan agar tidak mengarang. Jika ditanya, jawab langsung sebagai presenter.',
      narrative: `${p.name[0] + p.name.slice(1).toLowerCase()} — ${p.desc[0].toLowerCase() + p.desc.slice(1)}`,
      transition: i < P.length - 1 ? `Dari sini kita lanjut ke proker berikutnya: ${P[i + 1].name.toLowerCase()}.` : 'Enam proker sudah lengkap. Sekarang soal bagaimana tim bekerja di lapangan.',
    },
  })),
  {
    id: 'roles', kind: 'roles', group: 'Cara Kerja', name: 'Fleksibel dalam Peran', stages: 3,
    stageLabels: ['Judul', 'Peta peran', 'Prinsip & kolaborasi'], sfx: ['whoosh', 'sweep', 'tick'], duration: 30, source: 'Slide 04',
    notes: {
      points: ['Peran fleksibel, hasil tetap terarah.', 'Empat faktor penentu peran: kebutuhan kegiatan, kemampuan masing-masing, kondisi lapangan, kebutuhan tim.', 'Anggota saling membantu dalam produksi.'],
      facts: ['Lima peran: Dokumentasi, Desain, Editing, Publikasi, Arsip.'],
      context: 'Tekankan bahwa fleksibel bukan berarti tidak jelas; hasil tetap terarah lewat alur kerja di scene berikutnya.',
      narrative: 'Di lapangan, peran bisa berbeda-beda tergantung kebutuhan kegiatan, kemampuan masing-masing, kondisi, dan kebutuhan tim. Kami juga saling membantu. Tapi hasilnya tetap terarah.',
      transition: 'Terarahnya seperti apa? Ini alur dari permintaan sampai arsip.',
    },
  },
  {
    id: 'workflow', kind: 'workflow', group: 'Cara Kerja', name: 'Dari Permintaan Sampai Arsip', stages: 3,
    stageLabels: ['Judul & garis waktu', 'Langkah 01–03', 'Langkah 04–06'], sfx: ['whoosh', 'tick', 'tick'], duration: 30, source: 'Slide 05',
    notes: {
      points: ['Enam langkah: Permintaan → Penentuan PIC → Produksi → QC → Publikasi → Arsip.', 'QC (Quality Control) memastikan kualitas dan kelayakan hasil.'],
      facts: workflow.steps.map((s) => `${s.no} ${s.title}`),
      context: 'Alur ini yang menjaga konsistensi kualitas dan keteraturan arsip.',
      narrative: 'Alurnya enam langkah. Ada permintaan masuk, kami tentukan PIC-nya, lalu produksi. Sebelum dipublikasikan, hasilnya kami cek dulu lewat QC. Terakhir, dipublikasikan dan disimpan di arsip secara terstruktur.',
      transition: 'Lalu, apa saja hasil yang direncanakan dari alur ini?',
    },
  },
  {
    id: 'outputs', kind: 'outputs', group: 'Cara Kerja', name: 'Bukan Sekadar Dokumentasi', stages: 3,
    stageLabels: ['Judul', 'Output baris 1', 'Output baris 2'], sfx: ['whoosh', 'tick', 'tick'], duration: 30, source: 'Slide 06',
    notes: {
      points: ['Output yang direncanakan: foto kegiatan, video dokumentasi, poster & desain, konten medsos, video hasil editing, arsip digital, struktur folder arsip, website informasi OSIS.', 'Website informasi OSIS: masih prototype, dalam pengembangan.'],
      facts: ['Seluruh output berstatus RENCANA, bukan hasil yang sudah selesai.', 'Kartu bergambar hanya konsep visual, bukan foto kegiatan asli.', 'Kartu "Video hasil editing" memakai cuplikan opening yang memang karya Sekbid 6.'],
      context: 'Sumber memakai placeholder untuk contoh output. Di sini diganti ilustrasi konsep agar tidak tampak seperti dokumentasi palsu.',
      narrative: 'Jadi Sekbid 6 bukan sekadar dokumentasi. Hasil yang kami rencanakan mulai dari foto, video, poster, konten medsos, video editing, sampai arsip digital dan struktur foldernya. Website informasi OSIS juga masih dalam pengembangan.',
      transition: 'Intinya, semua ini kami rangkum dalam tiga hal.',
    },
  },
  {
    id: 'principles', kind: 'principles', group: 'Cara Kerja', name: 'Membangun Media OSIS yang Lebih Terarah', stages: 2,
    stageLabels: ['Judul', 'Tiga pilar'], sfx: ['whoosh', 'impact'], duration: 25, source: 'Slide 07',
    notes: {
      points: ['Tiga pilar: Konsistensi, Keteraturan, Kreativitas.'],
      facts: principles.items.map((s) => `${s.no} ${s.title}`),
      context: 'Ini kesimpulan strategis: konsistensi kualitas, keteraturan aset digital, kreativitas anggota.',
      narrative: 'Kesimpulannya, kami ingin membangun media OSIS yang lebih terarah, lewat tiga hal. Konsistensi kualitas, keteraturan sistem penyimpanan aset digital, dan kreativitas anggota di bidang visual media.',
      transition: 'Dan kalau diringkas jadi satu kalimat…',
    },
  },
  {
    id: 'closing', kind: 'closing', group: 'Penutup', name: 'Cinematic Closing', stages: 4,
    stageLabels: ['Capture the moment', 'Create the story', 'Preserve the memory', 'Identitas Sekbid 6'], sfx: ['whoosh', 'whoosh', 'riser', 'impact'], duration: 25, source: 'Slide 08',
    notes: {
      points: ['Tiga kalimat penutup: Capture the moment. Create the story. Preserve the memory.', 'Klimaks: logo OSIS dan identitas Sekbid 6.'],
      facts: ['Sekbid 6 — Publikasi, Dokumentasi & Desain', 'OSIS SMAN 3 Kuala Kapuas 2026/2027'],
      context: 'Beri jeda di tiap kalimat. Biarkan musik dan visual bekerja.',
      narrative: 'Capture the moment. Create the story. Preserve the memory. Itu yang akan kami lakukan sepanjang 2026/2027.',
      transition: 'Terima kasih. Sekarang kami buka untuk diskusi dan tanya jawab.',
    },
  },
  {
    id: 'qa', kind: 'qa', group: 'Penutup', name: 'Diskusi & Tanya Jawab', stages: 2,
    stageLabels: ['Judul', 'Jangkar diskusi'], sfx: ['whoosh', 'tick'], duration: 0, source: 'Editorial (tidak ada di PPTX)',
    notes: {
      points: ['Buka sesi tanya jawab.', 'Enam proker di layar bisa jadi jangkar pertanyaan.'],
      facts: ['Detail yang belum ada di sumber (jadwal, target peserta, anggaran) sebaiknya dijawab langsung atau dicatat untuk ditindaklanjuti.'],
      context: 'Durasi bebas, tidak dihitung dalam target 5–7 menit.',
      narrative: 'Silakan, kalau ada pertanyaan, masukan, atau ide, kami sangat terbuka.',
      transition: '—',
    },
  },
];

export const totalRecommendedSeconds = scenes.reduce((a, s) => a + s.duration, 0);
export const OPENING_SECONDS = 50;

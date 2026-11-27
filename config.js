/* ============================================================================
   SIR FAZIL MANIYA · Islamiyat · website settings
   THE ONLY FILE YOU EDIT. Every page reads it, so keep one copy beside them.
   Built by Nexlyr Solutions.

   Rule: a blank value hides that thing on the site. Nothing invented ever
   shows: no placeholder number, no made-up review, no fake result.
   ============================================================================ */

window.RA_CONFIG = {

  /* 1. WHO HE IS ------------------------------------------------------------ */
  name:      'Sir Fazil Maniya',
  fullName:  'Mohammad Fazil Maniya',
  shortName: 'Fazil Maniya',
  subject:   'Islamiyat',
  city:      'Karachi',
  yearsTeaching: 15,               // teaching since 2012 (Teach For Pakistan, Gizri)
  studentsMentored: 7000,          // "more than 7000 of his students have been mentored"

  /* 2. CONTACT -------------------------------------------------------------- */
  // ADD HIS WHATSAPP NUMBER HERE. While it is blank, every "message" button copies the
  // ready-written message and opens his Instagram instead, and the WhatsApp cards stay hidden.
  whatsapp:     '923332488819',    // international format, digits only, e.g. '923001234567'
  phoneDisplay: '0333 2488819',    // how it shows on the site, e.g. '0300 123 4567'
  phone2:       '',                // optional second number; blank = hidden
  email:        '',                // blank = hidden

  instagram: 'https://www.instagram.com/mohammadfazilmaniya',
  facebook:  '',                   // blank = hidden
  youtube:   'https://www.youtube.com/@mohammadfazilmaniya',
  whatsappChannel: 'https://whatsapp.com/channel/0029VbC5v7R5EjxrJij3JH2V',
  recordedCourse: 'https://www.learnedguys.com/home/course/islamiyat-2058-o-level-0493-igcse-topical-recorded-course-by-m-fazil-maniya/45',

  /* Where he teaches. Remove a line to hide it.
     centres: { n: name, a: area, logo: '/logos/file.webp' or [two files] }. No logo = a lettered tile until one is added.
     Put a logo file in the /logos/ folder and write its name here. */
  campuses: [
    { name: 'Evening classes in Karachi', note: 'Evening · 5 areas', text: 'Evening batches at centres in Jauhar, Gulshan, North Nazimabad, Defence and Bahadurabad.', centres: [
      { n: 'TP Core', a: 'Jauhar & Gulshan', logo: '/logos/tpc.webp' },
      { n: 'TP Core · TCR', a: 'North Nazimabad', logo: ['/logos/tpc.webp', '/logos/tcr.webp'] },
      { n: 'TP Core · Burraq', a: 'Defence', logo: '/logos/tpc.webp' },
      { n: 'Maniya’s', a: 'Bahadurabad' }
    ] },
    { name: 'Live online', note: 'Pakistan & abroad', text: 'Live online batches for students across Pakistan and abroad, through three online academies.', centres: [
      { n: 'Forte Institute', a: 'Online', logo: '/logos/forte.webp' },
      { n: 'Gives', a: 'Online', logo: '/logos/gives.webp' },
      { n: 'Max Academy', a: 'Online', logo: '/logos/max.webp' }
    ] },
    { name: 'Recorded course', note: 'LearnedGuys · Urdu', text: 'A 54-hour topical recorded course for 2058 and 0493, to watch at your own pace.', centres: [{ n: 'LearnedGuys', a: 'Recorded', logo: '/logos/learnedguys.webp' }] }
  ],
  /* Morning classes at schools, and schools he has taught at before. */
  morning: [
    { n: 'Head Start School System', logo: '/logos/hss.webp' }, { n: 'Froebel’s Education Centre', logo: '/logos/fec.webp' }, { n: 'Credo School', logo: '/logos/credo.webp' }, { n: 'The Academy', logo: '/logos/academy.webp' }
  ],
  previously: [
    { n: 'The Cedar School', logo: '/logos/cedar.webp' }, { n: 'The City School (PAF Chapter)' }, { n: 'Beaconhouse School System', logo: '/logos/bss.webp' },
    { n: 'The Patriots School' }, { n: 'Hexis College' }, { n: 'Highbrow College' }, { n: 'Falconhouse Grammar School' },
    { n: 'Yen Academy' }, { n: 'Mama Baby Care School' }, { n: 'Huffaz Exclusive Academy' }
  ],
  /* Students each session, from Sir Fazil's own record. [session, where, students] */
  JOURNEY: [
    ['2012–13', 'Teach For Pakistan', 200], ['2013–14', 'Teach For Pakistan', 200], ['2014–15', '', 200], ['2015–16', '', 250],
    ['2016–17', '', 300], ['2017–18', '', 300], ['2018–19', '', 500], ['2019–20', '', 500], ['2020–21', '', 500], ['2021–22', '', 500],
    ['2022–23', 'SWK', 750], ['2023–24', 'SWK', 750], ['2024–25', 'SWK', 1000], ['2025–26', 'SWK', 1000], ['2026–27', 'TP Core', 1200]
  ],
  online: true,

  /* Crash courses. { title: 'June 2027 crash course', codes: '2058 · 0493', start: '2027-04-01', where: 'Karachi centres and online', note: '' }
     Past dates drop off on their own. Empty = "dates announced soon". */
  /* Sir Fazil's logo: put the file in the site folder and write its name here, e.g. '/mfm-logo.png'.
     It replaces the MF monogram in the nav, footer, loader and bot. */
  logo: '/mfm-logo.webp',

  CRASH: [],

  /* Fees, shown in the portal's Fees tab. Blank = "your centre will confirm". */
  fees: { monthly: '', bank: '', account: '', title: '' },

  /* 3. REAL MATERIAL ONLY — empty lists hide their sections ---------------- */
  /* { value: 'A*', label: '2058 Islamiyat', note: 'May/June 2027', name: 'Student name' } */
  RESULTS: [],
  /* { name: 'Ayesha K.', meta: '2058 · 2027', text: 'What they actually said.' } */
  REVIEWS: [],

  /* 4. SITE ----------------------------------------------------------------- */
  siteUrl:   'https://mohammadfazilmaniya.com',
  agency:    'Nexlyr Solutions',
  agencyUrl: 'https://nexlyr.solutions'
};

/* ============================================================================
   Plumbing. Nothing to edit below.
   ============================================================================ */
(function () {
  var C = window.RA_CONFIG;
  C.live = false;
  C.waUrl = function (text) {
    if (C.whatsapp) return 'https://wa.me/' + C.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
    if (C.instagram) return C.instagram;
    if (C.facebook) return C.facebook;
    return 'contact.html';
  };
  C.waLabel = C.whatsapp ? 'WhatsApp' : (C.instagram ? 'Instagram' : 'Facebook');
})();

/* Design versions, side by side for the final choice: V1 is the site at /, V2 lives at /v2 (home, about,
   courses) and V3 (the folio in the V2 colours) at /v3 with every page. A small switch on the left edge
   jumps to the same page in the other designs. To hide it after the decision, set SHOW = false. */
(function () {
  var SHOW = true;
  if (!SHOW) return;
  var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (/^\/v2(\/|$)/.test(path)) return; /* V2 has its own switch */
  var cur = /^\/v3(\/|$)/.test(path) ? 3 : 1;
  var page = path.replace(/^\/v3/, '') || '/';
  if (page === '/index') page = '/';
  var V2 = { '/about': '/v2/about', '/courses': '/v2/courses' };
  var href = [page, V2[page] || '/v2', '/v3' + (page === '/' ? '' : page)];
  function add() {
    if (document.querySelector('nav.mfm-vsw')) return;
    var n = document.createElement('nav');
    n.className = 'mfm-vsw'; n.setAttribute('aria-label', 'Design version');
    n.innerHTML = '<span>Design</span>' + href.map(function (h, i) { return '<a href="' + h + '"' + (i + 1 === cur ? ' aria-current="page"' : '') + '>V' + (i + 1) + '</a>'; }).join('');
    n.style.cssText = 'position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:2147483000;display:flex;flex-direction:column;gap:4px;padding:8px 5px;border-radius:0 12px 12px 0;background:rgba(5,42,33,.92);border:1px solid rgba(232,181,71,.35);border-left:0;font:700 12px/1 system-ui,sans-serif;box-shadow:0 14px 30px -14px rgba(0,0,0,.6)';
    [].forEach.call(n.children, function (a, i) {
      if (!i) { a.style.cssText = 'writing-mode:vertical-rl;transform:rotate(180deg);font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:rgba(248,244,234,.55);padding:4px 0 6px;align-self:center'; return; }
      a.style.cssText = 'display:grid;place-items:center;width:36px;height:34px;border-radius:9px;text-decoration:none;' + (i === cur ? 'background:linear-gradient(180deg,#F7D88A,#E8B547 55%,#B8841C);color:#052A21' : 'color:#F8F4EA');
    });
    document.body.appendChild(n);
  }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();

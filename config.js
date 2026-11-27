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

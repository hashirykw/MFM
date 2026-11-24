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
  yearsTeaching: 12,               // his YouTube channel: "12 years of teaching experience"

  /* 2. CONTACT -------------------------------------------------------------- */
  // ADD HIS WHATSAPP NUMBER HERE. While it is blank, every "message" button copies the
  // ready-written message and opens his Instagram instead, and the WhatsApp cards stay hidden.
  whatsapp:     '923332488819',    // international format, digits only, e.g. '923001234567'
  phoneDisplay: '0333 2488819',    // how it shows on the site, e.g. '0300 123 4567'
  phone2:       '',                // optional second number; blank = hidden
  email:        '',                // blank = hidden

  instagram: 'https://instagram.com/m.fazil.maniya',
  facebook:  '',                   // blank = hidden
  youtube:   'https://www.youtube.com/user/mohammadfazilmaniya',
  recordedCourse: 'https://www.learnedguys.com/home/course/islamiyat-2058-o-level-0493-igcse-topical-recorded-course-by-m-fazil-maniya/45',

  /* Where he teaches. Remove a line to hide it. */
  /* centres: the academies / schools for each place, shown as chips on the home page.
     ADD THE REAL NAMES HERE, e.g. centres: ['ABC Academy · Gulshan', 'XYZ School · DHA']. Empty = "list to be confirmed". */
  campuses: [
    { name: 'Karachi centres & schools', note: 'In class · 15+ centres', text: 'Classes at more than 15 academic centres and schools across Karachi. Message for this session’s centres and timings.', centres: [] },
    { name: 'Live online', note: 'Online classes', text: 'Live online O Level Islamiyat classes for students outside Karachi and abroad.', centres: [] },
    { name: 'Recorded course', note: 'LearnedGuys · Urdu', text: 'A 54-hour topical recorded course for 2058 and 0493, to watch at your own pace.', centres: ['LearnedGuys'] }
  ],
  online: true,

  /* Crash courses. { title: 'June 2027 crash course', codes: '2058 · 0493', start: '2027-04-01', where: 'Karachi centres and online', note: '' }
     Past dates drop off on their own. Empty = "dates announced soon". */
  /* Sir Fazil's logo: put the file in the site folder and write its name here, e.g. 'mfm-logo.png'.
     It replaces the MF monogram in the nav, footer, loader and bot. */
  logo: '',

  CRASH: [],

  /* Fees, shown in the portal's Fees tab. Blank = "your centre will confirm". */
  fees: { monthly: '', bank: '', account: '', title: '' },

  /* 3. REAL MATERIAL ONLY — empty lists hide their sections ---------------- */
  /* { value: 'A*', label: '2058 Islamiyat', note: 'May/June 2027', name: 'Student name' } */
  RESULTS: [],
  /* { name: 'Ayesha K.', meta: '2058 · 2027', text: 'What they actually said.' } */
  REVIEWS: [],

  /* 4. SITE ----------------------------------------------------------------- */
  siteUrl:   'https://mfm.nexlyr.solutions',
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

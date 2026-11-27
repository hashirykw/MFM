# Sir Fazil Maniya · Islamiyat website

A multi-page site for Sir Mohammad Fazil Maniya (MFM): Cambridge O Level Islamiyat 2058 and IGCSE Islamiyat 0493, Karachi and online. Settings live in `config.js`.

## Nov 2026 finish: palette, sound, 3D

- **Palette** (`tools/folio/src/palette/luxe.css`, home parts in `luxe-home.css`): Paper is white, black type, Sir Fazil's book green (#0B462B; main shade #195739) and matte gold, with silver hairlines. Ink is near-black with deep book-green bands, silver type and matte gold. No terracotta anywhere (the build turns any left-over clay colour gold).
- **Buttons**: matte; a deeper green rises on hover, a small lift, a firm press.
- **Sound** (`tools/folio/src/luxe.js`): classical effects made in the browser (plucked harp, soft bells, a page turn). The switch sits in the top bar on every page and is remembered. The inner pages' older sound calls go through the same engine.
- **Cookie bar, toasts, pop-ups, dropdowns, scrollbar**: all in theme. The cookie bar says what the site stores (theme, sound, notes cart) because there is no tracking.
- **Qibla** (`tools/folio/src/qibla.js`): great-circle bearing and distance to the Ka'ba from the prayer-corner city or the visitor's location, with a live device compass on phones. The janamaz sits on a compass ring and settles to face the qibla when let go.
- **Prayer times fallback**: if AlAdhan can't be reached, `prayer.js` works the times out on the device (Karachi-method angles, Hanafi Asr) with the Umm al-Qura Hijri date.
- **3D**: `tools/folio/src/models3d.js` builds seven dioramas (now including Masjid al-Aqsa), all drawn frameless by one shared canvas (`scene3d.js`) and free to turn; (the Ka'ba, Jabal al-Nur and Hira, the Qur'an on a rehal, the wells of Badr, a mihrab and minbar, Masjid an-Nabawi). `python3 tools/folio/render/render.py` renders them into the folio plates (`assets/folio/img/folio/*.webp`). The same models run live and can be turned: the Ka'ba by Courses, the Qur'an by the Lab, the Nabawi by the FAQ, and the hero plates on the Lab, Reviews and 404 pages (`scene3d.js`).

## One design: V4 (28 Nov 2026)

V4 is now the whole site, served at `/`: the paper-and-ink folio with the greens lifted to Hashir's sample #0A503C, and the paper textures as they were. The other versions (`/v2`, `/v3`, the old root design, and the separate `/v4` copy) are deleted. Old `/v2`, `/v3`, `/v4` and `/v5` links redirect to the same page at `/`. The v2/v3 notes further down are history only.

## The live design: the folio (Nov 2026)

The whole site now uses the paper-and-ink **folio** design (formerly `/v5`, in the style of the Hamza Polani, Hashir portfolio and Clarus sites): crumpled paper and emerald-ink bands with torn edges, Archivo Wide caps with a handwritten accent, the Paper / Ink theme switch, the contents menu and the bottom dock. `/v5` now redirects to `/`.

Every page is its own page, with all the V1 data, tools and forms:

| Page | What it is |
|---|---|
| `/` | The folio home: the 3D masjid hero, Seerah marquee, about, the six plates, courses, era track, study pack, a short Lab, checker sample, portal preview, where he teaches, FAQ and WhatsApp registration. Each section links to its full page. |
| `/courses` `/syllabus` `/lab` `/ai-checker` `/portal` `/parent` `/past-papers` `/notes` `/crash-course` `/reviews` `/about` `/contact` `/404` | The full V1 pages (tracker, zakat studio, checker workspace, portal and parent dashboards, past-paper viewer and timer, notes cart, enrolment form…) in the folio design. |

**How it is built.** Run `python3 tools/folio/build.py` from the repo root after any change.

- `tools/folio/src/`: the folio home (`index.html`, `home.css`, `home.js`, `data.js`, `mosque3d.js`), the shared shell (`base.css`, `shell.js`), and `bridge.css`, which dresses the V1 pages in the folio design.
- `tools/folio/v1src/`: the V1 page sources (all content and scripts). Edit these for page content; the build adds the shared top bar, menu, dock, footer and Nexlyr strip, gives each section its paper or ink band, and puts a word tape under every hero.
- `tools/folio/plates.py` draws the six pencil plates.
- Output: the pages in the site root, and the shared files in `assets/folio/` (cached by the browser after the first page; file links carry a content hash so updates show at once). `legacy-1.css` / `legacy-2.css` are the V1 layout rules, pruned to what the pages use.
- The silver 3D shapes behind forms, the particle background and GSAP are not loaded any more, so pages paint straight away.

## v2 (Nov 2026): how the files fit together

- **`assets/`**: the styles and script every page shares, cached by the browser after the first page. `mfm-1/2/3.css` and `mfm-core.js` are the engine. **`mfm.css` is the v2 look** (fonts, silver/glass finish, buttons, cards, nav, menu, the 3D card deck); tune the design there. `mfm.js` sets up the card decks.
- **`fonts/`**: self-hosted Outfit (headings), Urbanist (text and labels), Amiri (Arabic). No Google Fonts call. (The old Bodoni Moda, Manrope and DM Mono files are no longer used.)
- **v4 (Nov 2026)**: palette #051F20 #0B2B26 #163832 #235347 #8EB69B #DAF1DE; white + brushed silver base in White mode; burgundy for the conversion buttons (Register, Enrol, hero); glass blur removed except a light blur on the nav and bottom bar; method cards redesigned with a filling step number. All v4 rules sit at the end of `assets/mfm.css`.
- **`vendor/`**: GSAP, ScrollTrigger, Lenis and three.js, self-hosted. three.js loads only after the page is up, so it never delays the text.
- **`photos/`**: drop the real pictures here with these names (WebP, about 1600 px wide) and they appear on their own:

| File | Where it shows |
|---|---|
| `fazil-maniya.webp` (site root) | Portrait cut-out, transparent background, about 856 × 1316: hero and About |
| `photos/in-class.webp` | Teaching in class in Karachi: home, About, Contact |
| `photos/online-class.webp` | Live online class: home, About |
| `photos/recorded-course.webp` | Recorded course: home, About |
| `photos/course-2058.webp` | O Level 2058 course card: home, Courses |
| `photos/course-0493.webp` | IGCSE 0493 course card: home |
| `photos/marked-answer.webp` | A marked answer sheet: AI checker |
| `photos/crash-course.webp` | Crash course: Crash course page |

- **v3 tones.** Each kind of tool has its own material (`.tn-emerald`, `-mint`, `-silver`, `-clear`, `-paper`, `-ink`, `-sage`, `-ruby`, `-aurora` in `mfm.css`): the "between classes" grid uses them so the crash course, the checker, the portal, papers, notes, the daily term, parents, YouTube and the tracker each read differently at a glance. On phones the grid is a two-column bento with three wide bands.
- **Register.** Beside the form, what the login opens sits on a turning ring of glass cards (turns on its own, pauses while you point at it, follows a drag or swipe). The silver 3D shapes behind every form are sized and placed so they always show whole around the form.
- **v3.1.** The zakat picture (home and Lab) is built once and glides: each amount is a bar on one scale, the nisab is a dashed line through them, and the zakat due shows as one square in forty. Photo slots show the matching artwork (arches, domes, lanterns, the book, the star) until real photos are added; the hero shows the mihrab artwork. The footer fades in instead of starting on a hard line. The Arabic font is cut down to the letters the site uses (about 48 KB instead of 108 KB).
- No intro screen and no page curtain: the page itself is the first thing that paints. Text is never hidden while loading; only content below the fold fades in, once, when reached.
- When you change anything in `assets/`, bump `?v=2` in the page links (and `VERSION` in `sw.js`) so installed copies refresh.

Built by Nexlyr Solutions on the same system as the Sir Sohail Ahmed site: the preloader and page curtain, a 3D particle background that changes shape section by section (an eight-point star, a crescent, the Ka'ba with its tawaf rings, a dome, minarets, zakat coins, the five pillars on one ring, a globe), stacking cards, and the dark black / emerald / silver palette.

The tabs follow the Sir Xahid Anwer Digital Campus: AI checker, student portal, parents, past papers with a side-by-side viewer and a locked exam mode, notes, crash course and reviews. Buttons use the same motion as that site (the label rolls, the arrow slides through, the disc floods the button, ghost buttons get a light that runs round the edge). Nothing follows the cursor any more.

**Two themes.** White is the default and Green is the other; the switch sits bottom-left on laptops (with the sound button) and inside the bottom bar on phones, and the choice is remembered. Silver is a matte brushed metal (no shine), surfaces are frosted glass, and charts are flat and quiet. The colour pass for the White theme is generated at build time by `theme.py`; hand-tuned rules live in `src/skin.css`.

**Logo.** The MFM mark is an obsidian tile with chrome letters (nav, footer, bot, app icons). If Sir Fazil sends his own logo, drop the file in the site folder and set `logo` in `config.js` (for example `logo: 'mfm-logo.png'`).

**Front end only.** Sign-in, the portal, the parent view, the checker queue and fee slips run in the visitor's browser (localStorage) with sample data that is labelled "Preview" on screen. The backend and admin panel (ADMIN-MFM) replace these later; see *Backend to connect* below.

## Files

| File | What it is |
|---|---|
| `index.html` | Home: hero with two crossing ribbons, an "everything between classes" grid (crash course, AI checker, portal, papers, notes, term of the day, parents, YouTube, tracker), FAQ and a 3-step portal registration form, plus the pinned "mark ladder" (one Badr question climbing from recall to significance), the courses, the six-step method, a live zakat studio, the syllabus map (six areas, two papers), command words, the study tools, where he teaches |
| `courses.html` | O Level 2058, IGCSE 0493 and the recorded course: papers, questions, marks, timings, assessment objectives, every topic linked to the tracker |
| `syllabus.html` | Every topic for 2058 / 0493: all 15 passages, all 20 Hadiths, the Seerah, the first community, the Caliphs, the Articles of Faith and the Pillars, with key points, key terms, key dates and a progress tracker |
| `ai-checker.html` | How the checker works, a fully marked sample answer (tap a highlight for the comment; feedback, model answer, Sir Fazil's note), practice vs test, and the checker itself for signed-in students: task, question, typed answer or photos/PDF |
| `portal.html` | Student login, a fee-slip login request, and the dashboard: home, checker, notes reader (watermarked with the student ID, blacks out on screenshot keys or when the tab loses focus), lectures, papers, results, rank (Starter to Diamond, privacy switch), fees (status, how to pay, slip upload, history, printable receipt) and profile |
| `parent.html` | Parent login (P-#### IDs), several children per parent, latest result, position, fees, marks chart, attendance with a warning after 3 missed classes, announcements, message the team |
| `past-papers.html` | 2058 and 0493 question papers and mark schemes (2020–2026): QP + MS side by side, "Sit it" exam mode (full screen, the clock, leaving the tab is counted, an exit phrase to give up, then mark it yourself or send it to the AI checker), two original MFM practice papers with mark schemes, attempt tracker, exam timer |
| `crash-course.html` | Next crash course (from `CRASH` in `config.js`, otherwise "announced soon"), what it covers, Karachi and online, FAQ |
| `reviews.html` | Reviews from `REVIEWS` in `config.js` (empty until real ones are added) and a form to send one |
| `manifest.webmanifest`, `sw.js`, `icons/` | The installable app (Android, desktop; iPhone via Share → Add to Home Screen). "Get the app" in the footer and the app card use it |
| `api/paper.js` | Vercel function that fetches a 2058/0493 PDF so it shows inside the side-by-side viewer |
| `lab.html` | Islamiyat Lab: zakat calculator with what-ifs, Seerah and Caliphate timeline with a "which came first" drill, the 15 passages with a theme quiz, Hadith flashcards and quiz, key-term flashcards and quiz |
| `notes.html` | Notes store with a cart that writes the order message |
| `about.html` | His profile, what students get, where he teaches |
| `contact.html` | Enrolment form that writes a ready message, contacts, FAQ |
| `404.html` | Not-found page |
| `config.js` | **The only file you edit**: WhatsApp number, social links, places he teaches, real results and reviews, crash course dates (`CRASH`), fee payment details (`fees`) |
| `mfm-arch.svg`, `art-*.svg` | Original Islamic-geometry artwork (mihrab, star lattice, arches, domes, lanterns, book, Ka'ba) |
| `mfm-share.jpg` | The link-preview image |
| `favicon.svg`, `apple-touch-icon.png` | MF monogram icons |
| `vercel.json`, `robots.txt`, `sitemap.xml` | Hosting and search files |

## Check these before going live

1. **WhatsApp number.** Set to his WhatsApp Business line, 0333 2488819 (`923332488819` in `config.js`). Every "message" button opens a WhatsApp chat with the ready-written message.
2. **His photo.** Save a portrait cut-out (transparent background, about 856 × 1316) as `fazil-maniya.webp` in this folder. The hero, the About page and the preloader pick it up automatically. Until then they show the mihrab artwork.
3. **Figures.** "12 years", "15+ centres and schools", "6,000+ students", "IBA gold medalist" and "National Bowling Champion 2023" are from his YouTube channel description. Confirm they are current.
4. **Instagram and places.** `@mohammadfazilmaniya` is the handle on file. The recorded course link is his LearnedGuys topical course for 2058 / 0493. Live online classes are described generally; name the platform or centres in `config.js` → `campuses` if he wants them shown.
5. **Notes titles.** The store lists notes by title only and shows no prices: the order message asks his team to confirm price and availability. Rename or remove items in `RA.DATA.PRODUCTS` inside each page if his range differs.
6. **Domain.** Canonical links, the sitemap and the share image point to `https://mohammadfazilmaniya.com`. If the live domain is different, change `SITE` and rebuild, or find-and-replace it across the files.
7. **Results and reviews.** `RESULTS` and `REVIEWS` in `config.js` are empty, so nothing invented appears.
8. **Fees.** Fill `fees` in `config.js` (monthly amount, bank, account title and number) so the portal's "How to pay" shows them.
9. **Crash course.** Add each batch to `CRASH` in `config.js` (title, dates, place, mode) and it appears on the home grid and the crash course page.

## Backend to connect (next phase)

- Student and parent accounts (IDs, passwords, linking children to parents) instead of the browser-only sign-in.
- The checker: store submissions and photos, run the AI marking, Sir Fazil's approve / change step, results back to the student.
- Portal data: classes, notes and lecture files, test marks, ranks, attendance, announcements, fee status and slip approval.
- Admin panel (ADMIN-MFM) to manage all of the above. App store builds can wrap the same pages once the backend is live.

## Notes on content

- Passage themes and Hadith summaries are short study summaries in our own words, not a translation of the Qur'an or the Hadith, and not Cambridge wording.
- The Badr example, the zakat presets and the Lab figures are labelled examples. The nisab is entered by the user, because gold and silver prices change.
- Past papers open from PapaCambridge's public archive (2058 and 0493, June and November series, variants 1 and 2). If a variant wasn't set in a session, the archive shows an empty page.
- Progress (ticked topics, paper scores, known Hadiths and terms, cart, sound) is saved in the visitor's own browser only.

## Sources

- Cambridge O Level Islamiyat 2058 syllabus 2026–2027: https://www.cambridgeinternational.org/Images/697279-2026-2027-syllabus.pdf
- Cambridge O Level Islamiyat 2058 syllabus 2028: https://www.cambridgeinternational.org/Images/744846-2028-syllabus.pdf
- Cambridge IGCSE Islamiyat 0493 syllabus 2028: https://www.cambridgeinternational.org/Images/744793-2028-syllabus.pdf
- Mohammad Fazil Maniya on YouTube: https://www.youtube.com/user/mohammadfazilmaniya
- Recorded course: https://www.learnedguys.com/home/course/islamiyat-2058-o-level-0493-igcse-topical-recorded-course-by-m-fazil-maniya/45

## v3.2 — brand material
- Sir Fazil's round MFM emblem (`mfm-logo.webp`, `mfm-logo.png`) is set as `logo` in config.js: it replaces the monogram in the nav, footer, loader, bot, hero badge and profile card. Favicon, app icons and apple-touch icon are made from it. **Send the original high-resolution logo file to sharpen it** (the current one is cut from a phone screenshot).
- Instagram now points to @mohammadfazilmaniya (from his QR code).
- Karachi centres filled in config.js (morning schools: Beaconhouse, Froebel's, Credo, The Academy, Hexis, Highbrow, Falconhouse North; evening classes across Karachi).
- About page: Cambridge-certified, BSCS gold medal (IBA), Masters in CS and Islamic Studies, CAIE/Edexcel training, schools taught at, National Tenpin Bowling Champion.
- Notes store: his book "O Level & IGCSE Islamiyat, new edition 2026–2027" (`mfm-book.webp`) as a feature and a cart item.
- Footer tagline: "When you learn, teach. When you get, give." #IslamiyatWithMFM
- Still blank (hidden until filled): Facebook and TikTok links in config.js.

## V2 design (Nov 2026): `/v2`

A second design lives beside the current one so both can be compared on the same domain: **`/v2`** (home), **`/v2/about`** and **`/v2/courses`**. Deep emerald and gold from the MFM logo and study-pack covers, glass cards, Bricolage Grotesque headings, a 3D gold eight-point star behind the portrait and a 3D study-pack book you can drag to turn. The tool pages (portal, AI checker, past papers, notes, lab, parents) are shared with V1.

- Each V2 page is one self-contained HTML file (styles and scripts inlined); three.js comes from `/vendor` and loads after the page paints.
- Edit the sources in `tools/v2/` (`pages/` for each page, `parts/` for the shared nav, footer, CSS and 3D), then run `python3 tools/v2/build.py` to rebuild `/v2`. `tools/` is not deployed (`.vercelignore`).
- V2 pages are `noindex` so search engines keep the live design until one is chosen.
- **V1 / V2 switch.** V2 pages show it on the left edge. V1 pages show it too once someone has opened `/v2`, or add `?compare` to any address. It lives at the end of `config.js`.

## V3 design (Nov 2026): `/v3`

Chosen section by section from the design board: midnight emerald with gold kept for one thing per screen, Inter headings, a 3D light-beam hero, key-cap buttons and numbers, a hairline logo grid, dark bento cards for courses and tools, the mark ladder, a 3D study pack that lifts apart as you scroll, reviews from `REVIEWS` in `config.js` (an honest invitation until there are some), the photo fan, and a register key you can press (Enter works too). Pages: **`/v3`**, **`/v3/about`**, **`/v3/courses`**.

- Sources in `tools/v3/` (same layout as V2); rebuild with `python3 tools/v3/build.py`. Fonts in `v3/fonts/` (Inter, self-hosted).
- The V1 / V2 / V3 switch sits on the left edge of every V2 and V3 page; V1 shows it once someone has opened V2 or V3, or with `?compare`.

## V4 design (Nov 2026): `/v4`

A calm, editorial "scholar's edition": warm paper white, Newsreader serif headings with Inter for text, deep emerald as the one institutional colour with a brass accent, fine rule lines, real photographs, no 3D. A worked Badr example on an emerald band, a course catalogue, a tools index, logos, the study pack, the hall, reviews from `REVIEWS`, and a plain registration form. Pages: **`/v4`**, **`/v4/about`**, **`/v4/courses`**. Sources in `tools/v4/`; rebuild with `python3 tools/v4/build.py`. Fonts in `v4/fonts/`.

## V5 design: now the live site (see the top of this file).

The V1–V5 switch is on every V2–V5 page (and on V1 once someone has opened any of them).

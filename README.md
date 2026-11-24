# Sir Fazil Maniya · Islamiyat website

A multi-page site for Sir Mohammad Fazil Maniya (MFM): Cambridge O Level Islamiyat 2058 and IGCSE Islamiyat 0493, Karachi and online. Every page is one self-contained HTML file in one flat folder. The only shared file is `config.js`, which holds the settings.

Built by Nexlyr Solutions on the same system as the Sir Sohail Ahmed site: the preloader and page curtain, a 3D particle background that changes shape section by section (an eight-point star, a crescent, the Ka'ba with its tawaf rings, a dome, minarets, zakat coins, the five pillars on one ring, a globe), stacking cards, and the dark black / emerald / silver palette.

## Files

| File | What it is |
|---|---|
| `index.html` | Home: hero, the pinned "mark ladder" (one Badr question climbing from recall to significance), the courses, the six-step method, a live zakat studio, the syllabus map (six areas, two papers), command words, the study tools, where he teaches |
| `courses.html` | O Level 2058, IGCSE 0493 and the recorded course: papers, questions, marks, timings, assessment objectives, every topic linked to the tracker |
| `syllabus.html` | Every topic for 2058 / 0493: all 15 passages, all 20 Hadiths, the Seerah, the first community, the Caliphs, the Articles of Faith and the Pillars, with key points, key terms, key dates and a progress tracker |
| `past-papers.html` | 2058 and 0493 question papers and mark schemes (2020–2026), attempt tracker with scores, exam timer with focus mode |
| `lab.html` | Islamiyat Lab: zakat calculator with what-ifs, Seerah and Caliphate timeline with a "which came first" drill, the 15 passages with a theme quiz, Hadith flashcards and quiz, key-term flashcards and quiz |
| `notes.html` | Notes store with a cart that writes the order message |
| `about.html` | His profile, what students get, where he teaches |
| `contact.html` | Enrolment form that writes a ready message, contacts, FAQ |
| `404.html` | Not-found page |
| `config.js` | **The only file you edit**: WhatsApp number, social links, places he teaches, real results and reviews |
| `mfm-arch.svg`, `art-*.svg` | Original Islamic-geometry artwork (mihrab, star lattice, arches, domes, lanterns, book, Ka'ba) |
| `mfm-share.jpg` | The link-preview image |
| `favicon.svg`, `apple-touch-icon.png` | MF monogram icons |
| `vercel.json`, `robots.txt`, `sitemap.xml` | Hosting and search files |

## Check these before going live

1. **WhatsApp number.** No public number was found, so `whatsapp` and `phoneDisplay` in `config.js` are blank. Until they are filled, every "message" button copies the ready-written message and opens his Instagram, and the WhatsApp cards stay hidden. Add the number and everything switches to WhatsApp.
2. **His photo.** Save a portrait cut-out (transparent background, about 856 × 1316) as `fazil-maniya.webp` in this folder. The hero, the About page and the preloader pick it up automatically. Until then they show the mihrab artwork.
3. **Figures.** "12 years", "15+ centres and schools", "6,000+ students", "IBA gold medalist" and "National Bowling Champion 2023" are from his YouTube channel description. Confirm they are current.
4. **Instagram and places.** `@m.fazil.maniya` is the handle on file. The recorded course link is his LearnedGuys topical course for 2058 / 0493. Live online classes are described generally; name the platform or centres in `config.js` → `campuses` if he wants them shown.
5. **Notes titles.** The store lists notes by title only and shows no prices: the order message asks his team to confirm price and availability. Rename or remove items in `RA.DATA.PRODUCTS` inside each page if his range differs.
6. **Domain.** Canonical links, the sitemap and the share image point to `https://mfm.nexlyr.solutions`. If the live domain is different, change `SITE` and rebuild, or find-and-replace it across the files.
7. **Results and reviews.** `RESULTS` and `REVIEWS` in `config.js` are empty, so nothing invented appears.

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

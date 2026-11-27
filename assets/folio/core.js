/* =========================================================================
   Sir Fazil Maniya · Islamiyat · study data
   Cambridge O Level Islamiyat 2058 and IGCSE Islamiyat 0493 (same two papers,
   same content). Short study summaries in our own words, not Cambridge wording
   and not a translation of the Qur'an or Hadith.
   ========================================================================= */
(function () {
'use strict';
const RA = window.RA = window.RA || {};
/* ======================= DATA ======================= */

/* Paper 1 · Question 1: the fifteen set Qur'anic passages (Appendix 1 of the syllabus) */
const PASSAGES = [
 {n:1, ref:"2.255", ar:"البقرة", sura:"al-Baqara (Ayat al-Kursi)", g:"God in Himself",
  t:"Allah the Ever-Living, the Self-Subsisting",
  th:["Tawhid: there is no god but Allah, the Ever-Living (al-Hayy), the Self-Subsisting (al-Qayyum)","He never tires, slumbers or sleeps, and everything in the heavens and earth is His","No one intercedes with Him except by His permission; He knows what is before and behind every creature","His Throne extends over the heavens and the earth, and guarding them does not weary Him"],
  imp:"Muslims recite it after prayers, before sleeping and for protection. It reminds a believer that Allah is always watching and always in control, so they rely on Him and fear disobeying Him."},
 {n:2, ref:"6.101–103", ar:"الأنعام", sura:"al-An'am", g:"God in Himself",
  t:"The Originator who has no partner or son",
  th:["Allah is the Originator of the heavens and the earth","He has no consort, so He cannot have a son: this rejects shirk and the idea of a son of God","He created everything, knows everything and is the guardian of all affairs, so only He is worshipped","No vision can grasp Him, yet He grasps all vision: He is beyond understanding and aware of all things"],
  imp:"It keeps worship pure of shirk. Because no eye can see Him but He sees everything, a Muslim behaves well in private as well as in public."},
 {n:3, ref:"41.37", ar:"فصلت", sura:"Fussilat", g:"God in Himself",
  t:"Worship the Creator, not the creation",
  th:["Night and day, the sun and the moon are among His signs","Do not prostrate to the sun or the moon but to Allah, who created them","Nature points to its Creator; it is never itself to be worshipped"],
  imp:"Muslims reflect on nature as a sign of Allah and give sajda only to Him. It rejects sun and moon worship and every form of shirk."},
 {n:4, ref:"42.4–5", ar:"الشورى", sura:"al-Shura", g:"God in Himself",
  t:"The Most High, the Oft-Forgiving",
  th:["Everything in the heavens and earth belongs to Allah, the Most High, the Most Great","The heavens almost burst apart in awe of Him","The angels glorify their Lord and ask forgiveness for those on earth","Allah is Oft-Forgiving, Most Merciful"],
  imp:"It teaches humility before His greatness and hope in His mercy, so Muslims keep repenting and asking forgiveness rather than despairing."},
 {n:5, ref:"112", ar:"الإخلاص", sura:"al-Ikhlas", g:"God in Himself",
  t:"Allah is One",
  th:["Allah is One (Ahad)","He is the Eternal, Absolute (al-Samad), on whom all depend","He neither begets nor was begotten","There is nothing comparable to Him"],
  imp:"The clearest statement of Tawhid, recited often in salat. The Prophet said it equals a third of the Qur'an. It rules out every idea of partners or children for Allah."},
 {n:6, ref:"1", ar:"الفاتحة", sura:"al-Fatiha", g:"God's relationship with the created world",
  t:"Lord of the worlds, Master of the Day of Judgement",
  th:["All praise belongs to Allah, Lord and Sustainer of all the worlds","He is the Most Gracious, the Most Merciful, and Master of the Day of Judgement","Him alone we worship and from Him alone we ask help","A prayer for guidance to the straight path, not the path of those who earned anger or went astray"],
  imp:"Recited in every rak'a of every prayer, so it is the Muslim's constant prayer for guidance. It is called Umm al-Kitab, the mother of the Book."},
 {n:7, ref:"2.21–22", ar:"البقرة", sura:"al-Baqara", g:"God's relationship with the created world",
  t:"The Creator who provides",
  th:["All people are called to worship their Lord, who created them and those before them","He made the earth a resting place and the sky a canopy","He sends rain and brings out fruits as provision","So do not set up rivals to Allah when you know better"],
  imp:"It calls for gratitude and worship in return for provision, warns against shirk, and asks Muslims to look after the earth they were given."},
 {n:8, ref:"96.1–5", ar:"العلق", sura:"al-'Alaq", g:"God's relationship with the created world",
  t:"Read in the name of your Lord",
  th:["The first revelation, in the cave of Hira in 610","Read in the name of your Lord who created, who created man from a clot","Allah is Most Generous and taught by the pen","He taught man what he did not know"],
  imp:"It makes seeking knowledge an act of worship and teaches Muslims to begin every task in the name of Allah. It also reminds people of their humble origin."},
 {n:9, ref:"99", ar:"الزلزلة", sura:"al-Zalzala", g:"God's relationship with the created world",
  t:"The earthquake of the Last Day",
  th:["On the Last Day the earth will shake and throw out its burdens","The earth will report what happened on it, because Allah commands it","People will come forward in groups to be shown their deeds","Whoever does an atom's weight of good will see it, and an atom's weight of evil will see it"],
  imp:"No deed is too small to count, so Muslims do every small good and avoid every small sin, knowing they are accountable."},
 {n:10, ref:"114", ar:"الناس", sura:"al-Nas", g:"God's relationship with the created world",
  t:"Refuge with the Lord of mankind",
  th:["Seek refuge with the Lord, King and God of mankind","Protection from the evil of the whisperer who withdraws","The whisperer works on people's hearts, from among jinn and men"],
  imp:"Muslims recite it with Sura 113 for protection, before sleeping and when ill, as the Prophet did. It teaches that Allah alone protects from Shaytan's whispering."},
 {n:11, ref:"2.30–37", ar:"البقرة", sura:"al-Baqara", g:"God's Messengers",
  t:"Adam, the first khalifa",
  th:["Allah tells the angels He will place a khalifa (vicegerent) on earth","He teaches Adam the names of all things, which the angels cannot tell","All the angels bow to Adam except Iblis, who refuses out of pride","Adam and his wife slip because of Satan, are sent to earth, and Allah accepts Adam's repentance"],
  imp:"Humans are stewards of the earth and are honoured by knowledge. Pride ruined Iblis, while repentance saved Adam, so Muslims turn back to Allah after every sin."},
 {n:12, ref:"6.75–79", ar:"الأنعام", sura:"al-An'am", g:"God's Messengers",
  t:"Ibrahim reasons his way to Tawhid",
  th:["Ibrahim is shown the kingdom of the heavens and the earth","A star, the moon and the sun each set, so none of them can be his Lord","He declares himself free of his people's shirk","He turns his face to the Creator of the heavens and the earth, as a true monotheist"],
  imp:"Faith can be reached through reflection and reason. Ibrahim stood alone against his people, so Muslims stand firm on Tawhid even when it is unpopular."},
 {n:13, ref:"5.110", ar:"المائدة", sura:"al-Ma'ida", g:"God's Messengers",
  t:"The miracles of 'Isa, by Allah's permission",
  th:["Allah's favours to 'Isa and his mother Maryam, and his strengthening with the Holy Spirit (Jibril)","He spoke in the cradle and as a grown man, and was taught the Book, wisdom, the Tawrat and the Injil","By Allah's permission he made a bird of clay, healed the blind and lepers, and raised the dead","Allah protected him from the Children of Israel, who called his signs magic"],
  imp:"Muslims believe in all prophets, including 'Isa, as human messengers. Every miracle comes by Allah's permission, which rejects the belief that 'Isa was divine."},
 {n:14, ref:"93", ar:"الضحى", sura:"al-Duha", g:"God's Messengers",
  t:"Your Lord has not forsaken you",
  th:["Revealed to comfort the Prophet after a pause in revelation","Allah has not forsaken him, and the hereafter is better than this life","He found him an orphan and sheltered him, wandering and guided him, in need and enriched him","So do not oppress the orphan or turn away the one who asks, and speak of your Lord's blessings"],
  imp:"It gives hope in hard times and sets duties: kindness to orphans and the poor, and gratitude for Allah's blessings."},
 {n:15, ref:"108", ar:"الكوثر", sura:"al-Kawthar", g:"God's Messengers",
  t:"Al-Kawthar: abundance",
  th:["Allah has given the Prophet al-Kawthar, abundant good","So pray to your Lord and sacrifice","His enemy, who mocked him after his sons died, is the one cut off"],
  imp:"It comforted the Prophet in grief. Muslims answer Allah's gifts with prayer and sacrifice, as at Eid al-Adha, and trust His promise."}
];

/* Paper 2 · Question 1: the twenty set Hadiths (Appendix 2), summarised in our own words */
const HADITHS = [
 {n:1, g:"Individual conduct", t:"Religion is sincerity", s:"Religion is sincerity: to Allah, to His Book, to His Messenger, to Muslim leaders and to ordinary Muslims.", les:"Be sincere in worship and honest with everyone: follow the Qur'an faithfully, advise leaders truthfully and wish others well."},
 {n:2, g:"Life in the community", t:"Want for your brother what you want for yourself", s:"None of you truly believes until he wants for his brother what he wants for himself.", les:"Faith shows in unselfishness: share, help, and never envy others the good you want for yourself."},
 {n:3, g:"Individual conduct", t:"Speak good or keep silent", s:"Whoever believes in Allah and the Last Day should speak good or stay silent, be generous to his neighbour and honour his guest.", les:"Control the tongue: no backbiting or lies. Treat neighbours and guests well as part of faith."},
 {n:4, g:"Individual conduct", t:"Are the obligations enough for Paradise?", s:"A man asks whether praying the obligatory prayers, fasting Ramadan and treating the lawful as lawful and the forbidden as forbidden will bring him to Paradise, and the Prophet says yes.", les:"Islam is practical: sincerely keeping the obligations and avoiding the forbidden is the path to Paradise."},
 {n:5, g:"Life in the community", t:"Charity from every joint", s:"Every joint of a person owes charity every day: judging justly between two people, helping someone onto their mount, a good word, every step to prayer and removing harm from the road.", les:"Charity is not only money. Small acts of help and kindness every day count as sadaqa."},
 {n:6, g:"Life in the community", t:"Change evil with your hand, tongue or heart", s:"Whoever sees an evil should change it with his hand; if he cannot, with his tongue; and if he cannot, with his heart, which is the weakest faith.", les:"Muslims have a duty to stop wrong in the community, by action, by speaking out, or at least by hating it inwardly."},
 {n:7, g:"Individual conduct", t:"The best person strives with himself and his wealth", s:"Asked who is the most excellent person, the Prophet said a believer who strives in Allah's way with his person and his property.", les:"Excellence means sacrifice: using your time, effort and money for Allah's cause and others' good."},
 {n:8, g:"Individual conduct", t:"Who is a martyr?", s:"Martyrs include whoever is killed in Allah's way, whoever dies in Allah's way, and whoever dies of plague or of a stomach disease.", les:"Allah's reward is broad: a believer who dies while striving or suffering patiently is honoured, not only on the battlefield."},
 {n:9, g:"Individual conduct", t:"The best food is what you earn yourself", s:"No one eats better food than what he earns with his own hands; the prophet Dawud ate from the work of his hands.", les:"Honest work is honourable. Muslims should earn a lawful living rather than depend on others."},
 {n:10, g:"Life in the community", t:"Caring for widows and the poor", s:"The one who looks after a widow or a poor person is like one who strives in Allah's way, or who prays all night and fasts all day.", les:"Social welfare is worship. Supporting the vulnerable earns a reward as great as constant prayer and fasting."},
 {n:11, g:"Life in the community", t:"The guardian of an orphan", s:"The Prophet said he and the one who looks after an orphan will be close together in Paradise, like two fingers held side by side.", les:"Caring for orphans brings a Muslim close to the Prophet. Society must protect the orphaned."},
 {n:12, g:"Life in the community", t:"Make things easy, not hard", s:"Sending Abu Musa and Mu'adh ibn Jabal to Yemen, the Prophet told them to make things easy, not difficult, to give good news and not drive people away, and to cooperate.", les:"Leaders, teachers and parents should be gentle and encouraging, never harsh."},
 {n:13, g:"Individual conduct", t:"The one who learns the Qur'an", s:"The one who learns the Qur'an is like the owner of tethered camels: if he keeps watch over them he keeps them, and if he lets them loose they wander off.", les:"The Qur'an must be revised regularly or it is forgotten. Daily recitation keeps it in the heart."},
 {n:14, g:"Life in the community", t:"Mercy in buying, selling and debts", s:"Allah shows mercy to a person who is kind when he sells, when he buys and when he asks for repayment.", les:"Islamic business is honest and generous: fair prices, no cheating, and patience with debtors."},
 {n:15, g:"Life in the community", t:"No mercy for the merciless", s:"Allah will not show mercy to the one who does not show mercy to people.", les:"Kindness to others, including the weak and animals, is the way to earn Allah's mercy."},
 {n:16, g:"Life in the community", t:"Believers are one body", s:"Believers in their love and mercy for each other are like one body: when one part aches, the whole body feels the fever and sleeplessness.", les:"The Ummah is one: Muslims feel each other's suffering and come to help, whether nearby or far away."},
 {n:17, g:"Individual conduct", t:"Modesty brings only good", s:"Modesty (haya') produces nothing but good.", les:"Modesty in speech, dress and behaviour protects a Muslim from sin and earns respect."},
 {n:18, g:"Individual conduct", t:"A mustard seed of faith, a mustard seed of pride", s:"Whoever has faith the weight of a mustard seed in his heart will not enter Hell, and whoever has pride the weight of a mustard seed will not enter Paradise.", les:"Even a little faith is precious, and even a little arrogance is dangerous. Muslims stay humble."},
 {n:19, g:"Individual conduct", t:"The world is the believer's prison", s:"This world is a prison for the believer and a paradise for the unbeliever.", les:"A believer restrains desires and lives by Allah's limits, looking to the reward of the hereafter."},
 {n:20, g:"Individual conduct", t:"Allah looks at hearts and deeds", s:"Allah does not look at your bodies or your wealth, but He looks at your hearts and your deeds.", les:"Intention and action matter, not looks or riches. Muslims judge no one by appearance or wealth."}
];

const UNITS_OL = {1:"Major themes of the Qur'an", 2:"History and importance of the Qur'an", 3:"Life and importance of the Prophet (pbuh)", 4:"The first Islamic community",
  5:"Major teachings in the Hadiths", 6:"History and importance of the Hadiths", 7:"The Rightly Guided Caliphs", 8:"Articles of Faith and Pillars of Islam"};
const PAPER_OF = u => u <= 4 ? 1 : 2;

const OL_TOPICS = [].concat(
 PASSAGES.map(p => ({n:"1."+p.n, u:1, t:"Passage "+p.n+": Sura "+p.ref+" · "+p.t, k:p.th.concat(["Importance today: "+p.imp]), ref:p.ref, ar:p.ar, grp:p.g})),
 [
 {n:"2.1",u:2,t:"Revelation of the Qur'an, 610–632",k:["First revelation in the cave of Hira, Ramadan 610, through the angel Jibril (Sura 96.1–5)","Khadija's support and Waraqa ibn Nawfal's confirmation","Revealed gradually over about 23 years, in Makka and Madina","Modes of revelation: through Jibril, like the ringing of a bell, and in true dreams"]},
 {n:"2.2",u:2,t:"Preservation in the Prophet's lifetime",k:["Memorised by the Prophet and many Companions (huffaz)","Written by his scribes, led by Zayd ibn Thabit, on parchment, bones, leaves and stones","The order of verses and suras set by the Prophet as Jibril taught him","Jibril reviewed the Qur'an with him every Ramadan, twice in the final year"]},
 {n:"2.3",u:2,t:"Compilation under Abu Bakr",k:["Many huffaz were killed at the Battle of Yamama, 633","Umar urged Abu Bakr to collect the Qur'an in one place","Zayd ibn Thabit gathered it, checking every verse against written and memorised sources","The collected sheets passed to Umar, then to his daughter Hafsa"]},
 {n:"2.4",u:2,t:"Standardisation under Uthman",k:["Hudhayfa ibn al-Yaman reported quarrels over recitation in the army","Uthman borrowed Hafsa's copy and set Zayd and others to make copies in the Quraysh dialect","Copies were sent to the main provinces and other versions were burned","This kept one agreed text for the whole Ummah, unchanged to this day"]},
 {n:"2.5",u:2,t:"The Qur'an in legal thinking",k:["The Qur'an is the first source of Shari'a","The Sunna explains and adds detail to it","Ijma' (consensus of scholars) and qiyas (analogy) apply its principles to new cases","Mu'adh ibn Jabal's answer: Qur'an, then Sunna, then his own reasoning (ijtihad)"]},
 {n:"2.6",u:2,t:"Importance of the Qur'an as the basis of thought and action",k:["The literal word of Allah, guidance for all people and all times","Recited in salat, memorised, and the basis of law and morals","Its themes: Tawhid, prophethood, the hereafter, worship and conduct","Similar passages to the set passages can be used as evidence"]},
 {n:"3.1",u:3,t:"Birth to the call to prophethood",k:["Born in Makka in 570, the Year of the Elephant; father Abdullah died before his birth","Nursed by Halima Sa'diyya; mother Amina died when he was six; then raised by Abd al-Muttalib and Abu Talib","Journey to Syria and the monk Bahira; Hilf al-Fudul; known as al-Amin","Marriage to Khadija at 25; resolving the dispute over the Black Stone at 35"]},
 {n:"3.2",u:3,t:"First revelation and early preaching",k:["Retreats in the cave of Hira; first revelation in 610 at 40","First believers: Khadija, Ali, Zayd ibn Haritha, Abu Bakr","About three years of private preaching","Public preaching from Mount Safa and the call to his own clan"]},
 {n:"3.3",u:3,t:"Opposition and persecution in Makka",k:["Why the Quraysh opposed him: idols, trade, tribal power and equality","Persecution of Bilal, Sumayya (the first martyr) and Ammar","Migration to Abyssinia (615) and Ja'far's speech before the Negus","Boycott of Banu Hashim in Shi'b Abi Talib (about 616–619)"]},
 {n:"3.4",u:3,t:"Year of Sorrow, Ta'if, Isra and Mi'raj, Aqaba",k:["619: deaths of Khadija and Abu Talib, the Year of Sorrow","Rejection and stoning at Ta'if; the Prophet prayed for its people","Isra and Mi'raj: the night journey and ascension; five daily prayers made obligatory","First and second Pledges of Aqaba with the people of Yathrib (621, 622)"]},
 {n:"3.5",u:3,t:"The Hijra, 622",k:["The Quraysh plot to kill him; Ali sleeps in his bed","Three days in the cave of Thawr with Abu Bakr","The mosque at Quba and arrival in Yathrib, renamed Madina","The Hijra begins the Islamic calendar (1 AH)"]},
 {n:"3.6",u:3,t:"Leadership in Madina",k:["Building the Prophet's Mosque","Brotherhood (mu'akhat) between the Muhajirun and the Ansar","The Charter of Madina: rights and duties of Muslims, Jews and others","Change of qibla from Jerusalem to the Ka'ba (2 AH)"]},
 {n:"3.7",u:3,t:"Battles of Badr, Uhud and the Trench",k:["Badr, 17 Ramadan 2 AH (624): about 313 Muslims defeat about 1,000 Makkans","Uhud, 3 AH (625): the archers leave their post; Hamza is martyred","The Trench (Khandaq), 5 AH (627): Salman al-Farsi's trench; the confederates withdraw","Lessons: obedience, patience, consultation, trust in Allah"]},
 {n:"3.8",u:3,t:"Hudaybiyya to the conquest of Makka",k:["Treaty of Hudaybiyya, 6 AH (628), called a clear victory (Sura 48)","Letters inviting rulers to Islam: Heraclius, Khusraw, the Negus, the Muqawqis","Conquest of Makka, 8 AH (630), with a general amnesty; the idols destroyed","Hunayn and Tabuk; the Year of Delegations, 9 AH"]},
 {n:"3.9",u:3,t:"The Farewell Pilgrimage and death",k:["Farewell Hajj, 10 AH (632) and the sermon at Arafat","Equality, rights of women, sanctity of life and property, end of usury and blood feuds","Death in Madina in 11 AH (632), aged 63, in Aisha's room","Abu Bakr's words: whoever worshipped Muhammad, Muhammad has died; Allah is alive"]},
 {n:"3.10",u:3,t:"His character and example",k:["Personal conduct: honesty, humility, simplicity, forgiveness","Relations with women: kindness to his wives and daughters, rights for women","Relations with non-Muslims: the Charter of Madina, the Makkan amnesty, kindness to a Jewish neighbour","Relations with other states: treaties, envoys and letters to rulers"]},
 {n:"3.11",u:3,t:"Seal of the Prophets",k:["Khatam al-Nabiyyin: the last prophet, sent to all mankind (Sura 33.40)","His message completes earlier revelations","His Sunna is the model for every Muslim","Why his example matters for individuals and communities today"]},
 {n:"4.1",u:4,t:"The Prophet's wives",k:["Khadija, Sawda, Aisha, Hafsa, Zaynab bint Khuzayma, Umm Salama","Zaynab bint Jahsh, Juwayriya, Umm Habiba, Safiyya, Maymuna","Mothers of the Believers: their roles in teaching and transmitting Hadith","Reasons for the marriages: support, alliances, care for widows, teaching"]},
 {n:"4.2",u:4,t:"His children and descendants",k:["Sons Qasim and Abdullah (with Khadija) and Ibrahim (with Mariya) died in childhood","Daughters Zaynab, Ruqayya, Umm Kulthum and Fatima","Fatima married Ali; their sons Hasan and Husayn","The line of Imams recognised by Shi'a Muslims, from Ali to Muhammad al-Mahdi"]},
 {n:"4.3",u:4,t:"The Ten Blessed Companions",k:["Abu Bakr, Umar, Uthman and Ali","Talha ibn Ubaydullah and Zubayr ibn al-Awwam","Abd al-Rahman ibn Awf and Sa'd ibn Abi Waqqas","Sa'id ibn Zayd and Abu Ubayda ibn al-Jarrah: all promised Paradise"]},
 {n:"4.4",u:4,t:"The Prophet's scribes",k:["Zayd ibn Thabit, his chief scribe","Ali, Uthman and Ubayy ibn Ka'b","Mu'awiya ibn Abi Sufyan and others","Their role in writing down revelation and the Prophet's letters"]},
 {n:"4.5",u:4,t:"The Emigrants and the Helpers",k:["Muhajirun: those who left Makka for Allah's sake","Ansar: the Aws and Khazraj of Madina who sheltered them","Brotherhood: the example of Sa'd ibn al-Rabi' and Abd al-Rahman ibn Awf","Lessons in sacrifice, unity and generosity"]},
 {n:"4.6",u:4,t:"Major figures around the Prophet",k:["Abu Talib and Hamza, his uncles and protectors","Bilal, the first mu'adhdhin; Zayd ibn Haritha","Mus'ab ibn Umayr, the first teacher sent to Madina; Salman al-Farsi","Opponents such as Abu Jahl and Abu Lahab"]},
 {n:"4.7",u:4,t:"The four Caliphs in the Prophet's lifetime",k:["Abu Bakr: first adult male convert, al-Siddiq, companion in the Hijra","Umar: his conversion strengthened the Muslims; al-Faruq","Uthman: married two of the Prophet's daughters, Dhun-Nurayn; generous gifts","Ali: first child to accept Islam; slept in the Prophet's bed on the night of the Hijra"]}
 ],
 HADITHS.map(h => ({n:"5."+h.n, u:5, t:"Hadith "+h.n+": "+h.t, k:[h.s, "Lesson: "+h.les], grp:h.g})),
 [
 {n:"6.1",u:6,t:"Compilation in the Prophet's time and after",k:["Companions memorised and acted on his words; some wrote them down, such as Abdullah ibn Amr's al-Sahifa al-Sadiqa","Abu Hurayra, Aisha and Ibn Umar narrated large numbers","Umar ibn Abd al-Aziz ordered official collection; al-Zuhri among the first collectors","Scholars travelled widely to hear Hadiths at first hand"]},
 {n:"6.2",u:6,t:"Early collections: musnad and musannaf",k:["Early written collections, such as the Sahifa of Hammam ibn Munabbih","Imam Malik's Muwatta, an early collection arranged by subject","Musnad: arranged by the Companion who narrated, e.g. the Musnad of Ahmad ibn Hanbal","Musannaf: arranged by subject, e.g. the Musannaf of Abd al-Razzaq"]},
 {n:"6.3",u:6,t:"The main compilers and their methods",k:["Al-Bukhari: about 16 years, choosing around 7,000 narrations (with repetitions) from hundreds of thousands","Muslim ibn al-Hajjaj: Sahih Muslim, arranged by subject","Abu Dawud, al-Tirmidhi, al-Nasa'i and Ibn Majah: the Sunan collections","Al-Kulayni, Ibn Babawayh and al-Tusi: the Shi'a collections"]},
 {n:"6.4",u:6,t:"Testing reliability: isnad and matn",k:["Isnad: the chain of narrators must be unbroken, each narrator truthful and with a sound memory","Biographies of narrators (ilm al-rijal) used to check them","Matn: the text must not contradict the Qur'an, established Sunna or reason","Grades: sahih (sound), hasan (good), da'if (weak)"]},
 {n:"6.5",u:6,t:"The six Sunni and four Shi'a collections",k:["Sunni: Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami' al-Tirmidhi, Sunan al-Nasa'i, Sunan Ibn Majah","Shi'a: al-Kafi (al-Kulayni), Man la Yahduruhu al-Faqih (Ibn Babawayh)","Tahdhib al-Ahkam and al-Istibsar (al-Tusi)","Main features: arrangement, number of Hadiths and how strict the selection was"]},
 {n:"6.6",u:6,t:"Hadith in legal thinking and Muslim life",k:["Second source of Shari'a after the Qur'an","Explains how to pray, give zakat and perform Hajj","Works with ijma' and qiyas to answer new questions","Hadith Qudsi: Allah's words in the Prophet's phrasing"]},
 {n:"7.1",u:7,t:"Abu Bakr, 632–634",k:["Chosen at Saqifa Bani Sa'ida","Sent Usama's army as the Prophet had planned","Wars of Ridda against false prophets and those refusing zakat; Yamama","Compilation of the Qur'an; campaigns into Iraq and Syria under Khalid ibn al-Walid; nominated Umar"]},
 {n:"7.2",u:7,t:"Umar, 634–644",k:["Victories at Yarmuk and Qadisiyya; Jerusalem, Egypt, Persia","Diwan (register), provinces with governors, judges and the Bayt al-Mal","Hijri calendar, garrison cities such as Kufa, Basra and Fustat","Personal simplicity and justice; martyred in 644; a council of six chose his successor"]},
 {n:"7.3",u:7,t:"Uthman, 644–656",k:["Chosen by the council (shura)","Standard copies of the Qur'an sent to the provinces","First Muslim navy; expansion in North Africa and the east","Charges of favouring relatives; rebels besieged his house and he was martyred in 656"]},
 {n:"7.4",u:7,t:"Ali, 656–661",k:["Moved the capital to Kufa","Battle of the Camel (656) and the Battle of Siffin (657) with Mu'awiya","Arbitration, the Kharijites and the Battle of Nahrawan","Known for knowledge and justice; martyred in Kufa in 661"]},
 {n:"7.5",u:7,t:"The Caliphs as models of leadership",k:["Consultation (shura), justice and accountability","Simple living and care for the poor","Protection of non-Muslim subjects (dhimmis)","Lessons for government today"]},
 {n:"7.6",u:7,t:"Relations with other states",k:["Treaties and letters, following the Prophet's example","Terms offered to cities, such as Umar's treaty with Jerusalem","Conduct in war: no harm to non-combatants, crops or places of worship","How these examples guide Muslim states today"]},
 {n:"8.1",u:8,t:"Belief in Allah",k:["Tawhid: Allah is One in His being, attributes and worship","His names and attributes (al-Asma' al-Husna)","Shirk, associating partners with Allah, is the greatest sin","How belief in Allah shapes a Muslim's life"]},
 {n:"8.2",u:8,t:"Angels",k:["Created from light, with no free will; always obey Allah","Jibril (revelation), Mika'il (provision), Israfil (the trumpet), the Angel of Death","Recording angels (Kiraman Katibin); Munkar and Nakir in the grave","Belief in angels makes a Muslim mindful of every deed"]},
 {n:"8.3",u:8,t:"The revealed Books",k:["Suhuf of Ibrahim, Tawrat of Musa, Zabur of Dawud, Injil of 'Isa","The Qur'an is the final book, preserved unchanged","Earlier books were changed or lost over time","Purpose: guidance for mankind"]},
 {n:"8.4",u:8,t:"The Prophets",k:["Chosen humans sent with Allah's message, sinless and truthful","Twenty-five named in the Qur'an; Muhammad is the last","Their character: patience, honesty, trust in Allah","Muslims believe in all of them without distinction"]},
 {n:"8.5",u:8,t:"Predestination and decree (al-Qadr)",k:["Allah knows and decrees everything","Humans still have free will and responsibility for their choices","Accepting good and bad with patience and gratitude","Effect on a Muslim: effort plus trust in Allah (tawakkul)"]},
 {n:"8.6",u:8,t:"Resurrection and the Last Day",k:["Death and the life of the grave (barzakh)","The trumpet, resurrection and the gathering","Judgement, the scales (mizan) and the bridge (sirat)","Paradise and Hell: accountability for every deed"]},
 {n:"8.7",u:8,t:"Jihad",k:["Its meaning: striving in the way of Allah","The greater jihad against one's own self and desires","Jihad of the tongue, pen and wealth","Armed jihad: only in defence, under proper authority, with strict rules of conduct"]},
 {n:"8.8",u:8,t:"Shahada",k:["The declaration: there is no god but Allah, and Muhammad is the Messenger of Allah","The entry into Islam and the basis of every other pillar","Said in the adhan, in salat and at birth and death","Its meaning must be lived, not only spoken"]},
 {n:"8.9",u:8,t:"Salat",k:["Preparation: wudu, clean body, clothes and place, facing the qibla, intention","Five daily prayer times and the movements of a rak'a","Jumu'a with its khutba, and the two Eid prayers","Shortened prayer when travelling, making up delayed prayers, private prayer (du'a)"]},
 {n:"8.10",u:8,t:"Zakat",k:["2.5% of savings above the nisab, held for a lunar year","The eight categories of recipients (Sura 9.60)","Purifies wealth and the heart; reduces poverty","Difference between zakat (obligatory) and sadaqa (voluntary)"]},
 {n:"8.11",u:8,t:"Sawm",k:["Fasting in Ramadan from dawn to sunset: suhur and iftar","Exemptions: the sick, travellers, the elderly, pregnant or nursing women, children","Making up missed fasts, and fidya","Significance: taqwa, self-control, empathy with the poor; Laylat al-Qadr"]},
 {n:"8.12",u:8,t:"Hajj",k:["Ihram at the miqat and the talbiya","Tawaf around the Ka'ba and sa'y between Safa and Marwa","Mina, the standing at Arafat, Muzdalifa, stoning the pillars, sacrifice","Significance: equality, unity of the Ummah, remembering Ibrahim and his family"]}
 ]
);

const SYL = {
 ol:{label:"O Level Islamiyat 2058", short:"2058", word:"Topic", units:UNITS_OL, note:"Paper 1 is units 1–4 and Paper 2 is units 5–8. The same content is examined in IGCSE 0493.", topics:OL_TOPICS},
 ig:{label:"IGCSE Islamiyat 0493", short:"0493", word:"Topic", units:UNITS_OL, note:"The same two papers and the same content as O Level 2058. IGCSE is graded A* to G.", topics:OL_TOPICS}
};
/* each unit's colour group. The keys are the theme's colour classes, renamed for Islamiyat in DNAME */
const DEPT = {1:"hq", 2:"hq", 3:"people", 4:"mkt", 5:"ops", 6:"ops", 7:"fin", 8:"ext"};
const DNAME = {hq:"The Qur'an", people:"The Prophet", mkt:"First community", ops:"The Hadiths", fin:"The Caliphs", ext:"Faith & pillars"};
const DPAPER = {hq:1, people:1, mkt:1, ops:2, fin:2, ext:2};
const deptOf = (key, t) => DEPT[t.u];

/* Paper facts used by the past-papers page, the timer and the bot (from the 2026–2028 syllabuses) */
const PMETA = {
 "2058":{name:"O Level Islamiyat", grades:"A*–E", papers:{1:{n:"Qur'an, the Prophet and the first community", min:90, m:50, w:"50%"}, 2:{n:"Hadiths, the Caliphs, faith and pillars", min:90, m:50, w:"50%"}}},
 "0493":{name:"IGCSE Islamiyat", grades:"A*–G", papers:{1:{n:"Qur'an, the Prophet and the first community", min:90, m:50, w:"50%"}, 2:{n:"Hadiths, the Caliphs, faith and pillars", min:90, m:50, w:"50%"}}}
};
/* Assessment objectives (whole qualification) */
const AO = [["AO1","Knowledge",68],["AO2","Understanding",32]];

/* Notes catalogue. Prices are never shown on the site: his team quotes them on WhatsApp. */
const PRODUCTS = [
 {id:"p1-notes", code:"2058", lvl:"O Level · IGCSE", t:"Paper 1 Notes", d:"The history of the Qur'an, the life of the Prophet and the first Islamic community, written as 10-mark answers.", cc:"var(--c-accent)"},
 {id:"p2-notes", code:"2058", lvl:"O Level · IGCSE", t:"Paper 2 Notes", d:"The history of the Hadiths, the Rightly Guided Caliphs, and the Articles of Faith and Pillars of Islam.", cc:"var(--c-cool)"},
 {id:"passages", code:"2058", lvl:"O Level · IGCSE", t:"The 15 Qur'anic Passages", d:"Every set passage with its themes, importance today and linked verses for evidence.", cc:"var(--c-eco)"},
 {id:"hadiths", code:"2058", lvl:"O Level · IGCSE", t:"The 20 Hadiths", d:"Each set Hadith with its teaching and how Muslims act on it, ready for Paper 2 Question 1.", cc:"var(--c-pink)"},
 {id:"seerah", code:"2058", lvl:"O Level · IGCSE", t:"Seerah Timeline & Battles", d:"The Prophet's life from 570 to 632 in order, with the dates, numbers and names examiners look for.", cc:"var(--c-bad)"},
 {id:"part-b", code:"2058", lvl:"O Level · IGCSE", t:"Part (b) Answer Bank", d:"Model 4-mark answers that explain significance and lessons for Muslims today.", cc:"var(--c-accent)"},
 {id:"top-p1", code:"2058", lvl:"Past papers", t:"Topical Past Papers · Paper 1", d:"Paper 1 questions sorted by topic, with mark-scheme points alongside.", cc:"var(--c-cool)"},
 {id:"top-p2", code:"2058", lvl:"Past papers", t:"Topical Past Papers · Paper 2", d:"Paper 2 questions sorted by topic, with mark-scheme points alongside.", cc:"var(--c-eco)"},
 {id:"mfm-book", code:"2058 · 0493", lvl:"New edition 2026–27", t:"O Level & IGCSE Islamiyat — the MFM book", d:"Sir Mohammad Fazil Maniya's own Islamiyat book, new edition for the 2026 and 2027 exams.", cc:"var(--c-eco)", img:"/mfm-book.webp"}
];

/* Key terms. [term, meaning, topic] */
const DEFS = [
 ["Tawhid","the oneness of Allah: He is One in His being, His attributes and His right to be worshipped","8.1"],
 ["Shirk","associating partners with Allah in worship or in His attributes; the one sin Allah does not forgive if a person dies upon it","8.1"],
 ["Risala","prophethood: Allah's message sent through His messengers","8.4"],
 ["Akhira","the life after death and the Day of Judgement","8.6"],
 ["Barzakh","the stage between death and resurrection, the life of the grave","8.6"],
 ["Qadr","Allah's knowledge and decree of everything that happens","8.5"],
 ["Tawakkul","putting complete trust in Allah after doing one's own best","8.5"],
 ["Wahy","revelation: Allah's message sent to a prophet","2.1"],
 ["Sura","a chapter of the Qur'an; there are 114","2.6"],
 ["Ayat","a verse of the Qur'an; also means a sign","2.6"],
 ["Makki sura","a sura revealed in Makka, mostly on belief, Tawhid and the hereafter","2.1"],
 ["Madani sura","a sura revealed in Madina, often on law and life in the community","2.1"],
 ["Hafiz","a person who has memorised the whole Qur'an","2.2"],
 ["Mushaf","the Qur'an written down as a book","2.4"],
 ["Khalifa","a successor or vicegerent; humans as Allah's stewards on earth, and the title of the leaders after the Prophet","1.11"],
 ["Sunna","the Prophet's words, actions and silent approvals, the model for Muslims","6.6"],
 ["Hadith","a report of what the Prophet said, did or approved","6.6"],
 ["Hadith Qudsi","a Hadith in which the Prophet reports Allah's words in his own phrasing","6.6"],
 ["Isnad","the chain of narrators through whom a Hadith was passed on","6.4"],
 ["Matn","the actual text of a Hadith","6.4"],
 ["Sahih","a sound Hadith with a complete, reliable chain and an acceptable text","6.4"],
 ["Hasan","a good Hadith, slightly below sahih in the strength of its narrators","6.4"],
 ["Da'if","a weak Hadith with a broken chain or a doubtful narrator","6.4"],
 ["Musnad","a Hadith collection arranged by the Companion who narrated each Hadith","6.2"],
 ["Musannaf","a Hadith collection arranged by subject","6.2"],
 ["Shari'a","Islamic law, drawn from the Qur'an and the Sunna","2.5"],
 ["Ijma'","the consensus of Muslim scholars on a legal question","2.5"],
 ["Qiyas","analogy: applying the ruling of an earlier case to a new case with the same cause","2.5"],
 ["Ijtihad","the effort of a qualified scholar to reach a ruling by independent reasoning","2.5"],
 ["Hijra","the Prophet's migration from Makka to Madina in 622, the start of the Islamic calendar","3.5"],
 ["Muhajirun","the Emigrants who left Makka for Madina for the sake of Islam","4.5"],
 ["Ansar","the Helpers: the Muslims of Madina who sheltered the Emigrants","4.5"],
 ["Mu'akhat","the brotherhood the Prophet set up between the Muhajirun and the Ansar","3.6"],
 ["Ummah","the worldwide community of Muslims","3.6"],
 ["Khatam al-Nabiyyin","the Seal of the Prophets: Muhammad, the last prophet","3.11"],
 ["Shura","consultation in decision-making","7.5"],
 ["Ridda","apostasy; the Ridda wars were fought under Abu Bakr","7.1"],
 ["Bayt al-Mal","the public treasury, organised under Umar","7.2"],
 ["Diwan","the register of soldiers and stipends introduced by Umar","7.2"],
 ["Shahada","the declaration of faith: there is no god but Allah, and Muhammad is His Messenger","8.8"],
 ["Wudu","the ritual washing before salat","8.9"],
 ["Qibla","the direction of the Ka'ba in Makka, faced in prayer","8.9"],
 ["Rak'a","one complete unit of prayer, from standing to prostration","8.9"],
 ["Khutba","the sermon given before the Friday prayer and after the Eid prayers","8.9"],
 ["Qasr","shortening the four-rak'a prayers to two while travelling","8.9"],
 ["Nisab","the minimum amount of wealth on which zakat becomes due","8.10"],
 ["Sadaqa","voluntary charity, given at any time","8.10"],
 ["Suhur","the meal before dawn during a fast","8.11"],
 ["Iftar","the meal that breaks the fast at sunset","8.11"],
 ["Fidya","compensation, usually feeding the poor, for fasts a person cannot make up","8.11"],
 ["Ihram","the sacred state, and the simple white clothing, of a pilgrim","8.12"],
 ["Tawaf","walking seven times around the Ka'ba","8.12"],
 ["Sa'y","walking seven times between Safa and Marwa","8.12"],
 ["Wuquf","the standing at Arafat on 9 Dhul Hijja, the heart of Hajj","8.12"],
 ["Jihad","striving in the way of Allah: against one's own self, with the tongue and pen, and in defence","8.7"],
 ["Taqwa","awareness and fear of Allah that keeps a person from sin","8.11"]
];

/* Key dates. [CE, AH, event, topic] */
const DATES = [
 ["570","53 BH","Birth of the Prophet in Makka, the Year of the Elephant","3.1"],
 ["576","","Death of his mother Amina at Abwa","3.1"],
 ["595","","Marriage to Khadija","3.1"],
 ["605","","Rebuilding of the Ka'ba; he places the Black Stone","3.1"],
 ["610","","First revelation in the cave of Hira","2.1"],
 ["613","","Public preaching begins","3.2"],
 ["615","","First migration to Abyssinia","3.3"],
 ["616","","Boycott of Banu Hashim begins","3.3"],
 ["619","","Year of Sorrow: deaths of Khadija and Abu Talib","3.4"],
 ["620","","Isra and Mi'raj; five daily prayers","3.4"],
 ["621","","First Pledge of Aqaba","3.4"],
 ["622","1 AH","The Hijra to Madina; Second Pledge of Aqaba earlier that year","3.5"],
 ["624","2 AH","Battle of Badr; change of qibla","3.7"],
 ["625","3 AH","Battle of Uhud","3.7"],
 ["627","5 AH","Battle of the Trench","3.7"],
 ["628","6 AH","Treaty of Hudaybiyya","3.8"],
 ["630","8 AH","Conquest of Makka; Battle of Hunayn","3.8"],
 ["632","10–11 AH","Farewell Pilgrimage; death of the Prophet","3.9"],
 ["633","12 AH","Battle of Yamama; Qur'an collected under Abu Bakr","2.3"],
 ["634","13 AH","Death of Abu Bakr; Umar becomes caliph","7.1"],
 ["636","15 AH","Battles of Yarmuk and Qadisiyya","7.2"],
 ["638","17 AH","Umar introduces the Hijri calendar","7.2"],
 ["644","23 AH","Martyrdom of Umar; Uthman becomes caliph","7.3"],
 ["c. 650","c. 30 AH","Uthman's standard copies of the Qur'an","2.4"],
 ["656","35 AH","Martyrdom of Uthman; Ali becomes caliph","7.3"],
 ["656","36 AH","Battle of the Camel","7.4"],
 ["657","37 AH","Battle of Siffin","7.4"],
 ["661","40 AH","Martyrdom of Ali","7.4"]
];

const INDEX = [];
SYL.ol.topics.forEach(t => INDEX.push({ k:'ol', code:SYL.ol.short, n:t.n, t:t.t, u:t.u, unit:SYL.ol.units[t.u], dept:deptOf('ol', t), pts:t.k }));
/* FORMULAS is kept as an empty list so older engine code that reads it keeps working */
const FORMULAS = [];
RA.DATA = { OL_TOPICS, UNITS_OL, SYL, DEPT, DNAME, DPAPER, PAPER_OF, deptOf, PMETA, AO, PRODUCTS, DEFS, DATES, PASSAGES, HADITHS, FORMULAS, INDEX };
})();

/* =========================================================================
   RA core — utilities, sound, theme, smooth scroll, nav, reveals, tilt,
   cursor, toast, modal, command palette, Sir Fazil’s Assistant.
   ========================================================================= */
(function () {
'use strict';
const RA = window.RA = window.RA || {};
const C = RA.C = window.RA_CONFIG || {};
if (!C.waUrl) C.waUrl = t => C.whatsapp ? 'https://wa.me/' + C.whatsapp + (t ? '?text=' + encodeURIComponent(t) : '') : (C.instagram || 'contact.html');
const D = RA.DATA;
const $ = RA.$ = (s, r) => (r || document).querySelector(s);
const $$ = RA.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const root = document.documentElement;
root.classList.add('js');
RA.RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
RA.FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
RA.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
RA.store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { } }
};
RA.fmt = (n, dp) => {
  if (n == null || !isFinite(n)) return '—';
  dp = dp == null ? 0 : dp;
  const s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  return n < 0 && Math.abs(n) >= Math.pow(10, -dp) / 2 ? '(' + s + ')' : s;
};
RA.num = v => { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; };
RA.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const Q = RA._q = RA._q || [];
RA.page = fn => Q.push(fn);

/* ---------------------------------------------------------------- sound */
RA.Snd = (function () {
  let ctx = null, master = null, on = RA.store.get('ra-sound', true), last = 0;
  function ensure() {
    if (!on) return null;
    if (!ctx) {
      try {
        /* v2: a warmer chain — soft low-pass, a little glassy air (short echo) and a gentle limiter */
        ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.2;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200; lp.Q.value = 0.3;
        const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
        const dl = ctx.createDelay(0.5), fb = ctx.createGain(), wet = ctx.createGain(), hp = ctx.createBiquadFilter();
        dl.delayTime.value = 0.13; fb.gain.value = 0.28; wet.gain.value = 0.22; hp.type = 'highpass'; hp.frequency.value = 700;
        master.connect(lp); lp.connect(comp); comp.connect(ctx.destination);
        lp.connect(hp); hp.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(comp);
      }
      catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(f, dur, type, vol, when, slide) {
    const c = ensure(); if (!c) return;
    /* v2: each note is a soft bell — the tone plus quiet upper partials, slightly longer tail; harsh waves become triangles */
    const t = c.currentTime + (when || 0), g = c.createGain(), d = dur * 1.35;
    const wave = (type === 'square' || type === 'sawtooth') ? 'triangle' : (type || 'sine');
    [[1, 1, wave], [2.0, .22, 'sine'], [3.01, .07, 'sine']].forEach(([m, a, w]) => {
      const o = c.createOscillator(), og = c.createGain(); o.type = w; o.frequency.setValueAtTime(f * m, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(f * m * slide, t + d);
      o.detune.value = m === 1 ? 0 : 4; og.gain.value = a; o.connect(og); og.connect(g); o.start(t); o.stop(t + d + 0.05);
    });
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    g.connect(master);
  }
  function noise(dur, vol, freq) {
    const c = ensure(); if (!c) return;
    const len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq || 1200; f.Q.value = 0.8; g.gain.value = vol || 0.2;
    s.connect(f); f.connect(g); g.connect(master); s.start();
  }
  const api = {
    get on() { return on; },
    set(v) { on = !!v; RA.store.set('ra-sound', on); if (on) api.chime(); },
    unlock() { if (on) ensure(); },
    tick() { const n = performance.now(); if (n - last < 70) return; last = n; tone(2100, 0.035, 'sine', 0.035); },
    click() { tone(880, 0.06, 'triangle', 0.16); },
    soft() { tone(640, 0.09, 'sine', 0.12); },
    open() { tone(480, 0.14, 'sine', 0.14, 0, 1.6); },
    close() { tone(760, 0.12, 'sine', 0.12, 0, 0.6); },
    chime() { tone(880, 0.35, 'sine', 0.16); tone(1318.5, 0.5, 'sine', 0.12, 0.07); },
    coin() { tone(1568, 0.07, 'square', 0.04); tone(2093, 0.3, 'sine', 0.12, 0.06); tone(2637, 0.35, 'sine', 0.06, 0.12); },
    stamp() { noise(0.12, 0.3, 500); tone(96, 0.18, 'sine', 0.35); },
    err() { tone(220, 0.16, 'sawtooth', 0.08); tone(175, 0.22, 'sawtooth', 0.07, 0.09); },
    whoosh() { noise(0.4, 0.14, 900); },
    alarm() { [0, 0.24, 0.48].forEach(w => tone(1046.5, 0.16, 'square', 0.06, w)); }
  };
  return api;
})();
const Snd = RA.Snd;

/* ---------------------------------------------------------------- theme */
RA.theme = function (t) {
  root.dataset.theme = t; RA.store.set('ra-theme', t);
  $$('meta[name="theme-color"]').forEach(m => m.content = t === 'light' ? '#f3ecdc' : '#0b1914');
  $$('[data-theme-btn]').forEach(b => b.setAttribute('aria-pressed', String(t === 'light')));
  if (RA.BG) RA.BG.theme(t);
  document.dispatchEvent(new CustomEvent('ra:theme', { detail: t }));
};

/* ---------------------------------------------------------------- smooth scroll */
function smooth() {
  const ST = window.ScrollTrigger;
  if (window.gsap && ST) gsap.registerPlugin(ST);
  if (!RA.RM && window.Lenis) {
    const lenis = RA.lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.2 }); /* v5: quick and smooth, no long glide */
    if (window.gsap && ST) { lenis.on('scroll', ST.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(400, 33); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const h = a.getAttribute('href'); if (h.length < 2) return;
    const el = document.getElementById(decodeURIComponent(h.slice(1))); if (!el) return;
    e.preventDefault(); RA.go(el); history.replaceState(null, '', h);
  });
}
RA.go = function (target, offset) {
  if (typeof target === 'string') target = $(target);
  if (target == null) return;
  offset = offset == null ? -96 : offset;
  if (RA.lenis) RA.lenis.scrollTo(target, { offset, duration: 1.3 });
  else if (typeof target === 'number') scrollTo({ top: target, behavior: RA.RM ? 'auto' : 'smooth' });
  else scrollTo({ top: target.getBoundingClientRect().top + scrollY + offset, behavior: RA.RM ? 'auto' : 'smooth' });
};
RA.lock = function (on) {
  if (RA.lenis) on ? RA.lenis.stop() : RA.lenis.start();
  document.body.style.overflow = on ? 'hidden' : '';
};

/* ---------------------------------------------------------------- nav + menu */
function nav() {
  const n = $('.nav'); if (!n) return;
  let lastY = scrollY;
  const upd = () => {
    const y = scrollY;
    n.classList.toggle('solid', y > 30);
    const mb = $('.mbar'); if (mb) { const end = y + innerHeight > document.documentElement.scrollHeight - 160; mb.classList.toggle('mb-hide', y > 240 && y > lastY + 2 && !end); if (y < lastY - 2 || end) mb.classList.remove('mb-hide'); }
    if (!root.classList.contains('menu-open')) n.classList.toggle('hide', y > 260 && y > lastY + 2);
    if (y < lastY - 2) n.classList.remove('hide');
    lastY = y;
  };
  addEventListener('scroll', upd, { passive: true }); upd();
  const burger = $('.burger'), menu = $('.menu');
  if (!burger || !menu) return;
  $$('nav a', menu).forEach((a, i) => a.style.transitionDelay = (0.12 + i * 0.045) + 's');
  const set = open => {
    root.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open)); RA.lock(open); open ? Snd.open() : Snd.close();
    if (open) n.classList.remove('hide');
  };
  burger.addEventListener('click', () => set(!root.classList.contains('menu-open')));
  document.addEventListener('pointerdown', e => { if (root.classList.contains('menu-open') && !e.target.closest('.menu,.burger')) set(false); });
  menu.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) set(false); });
}

/* ---------------------------------------------------------------- reveals */
function splitWords(el) {
  /* v2: headings stay whole text, set once, never re-built letter by letter */
  return;
  if (el.dataset.splitDone) return; el.dataset.splitDone = '1';
  let i = 0;
  const walk = node => {
    Array.from(node.childNodes).forEach(ch => {
      if (ch.nodeType === 3) {
        if (!ch.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const o = document.createElement('span'); o.className = 'slw';
          const w = document.createElement('span'); w.className = 'sw';
          Array.from(p).forEach(c => { const s = document.createElement('span'); s.className = 'sc'; s.style.setProperty('--i', i++); s.textContent = c; w.appendChild(s); });
          o.appendChild(w); frag.appendChild(o);
        });
        ch.replaceWith(frag);
      } else if (ch.nodeType === 1 && ch.tagName !== 'BR' && !ch.hasAttribute('data-nosplit')) walk(ch);
    });
  };
  if (!el.hasAttribute('aria-label') && /^H[1-6]$/.test(el.tagName)) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  walk(el);
}
RA.split = splitWords;
RA.reveal = function (scope) {
  $$('.ph', scope).forEach(p => { if (!p.closest('.ldx,.pt') && !p.classList.contains('wp')) p.classList.add('wp'); });
  $$('.hero-fig .portrait', scope).forEach(p => p.classList.add('wp'));
  const all = $$('[data-rv],[data-split],.wp,.hair', scope).filter(e => !e.classList.contains('in'));
  /* v2: on screen now = shown now (no fade-in, no blink). Below the fold = a short rise when reached. */
  const fold = innerHeight * 0.92;
  const els = all.filter(e => { const r = (e.classList.contains('wp') && e.parentElement ? e.parentElement : e).getBoundingClientRect(); if (r.top < fold || e.closest('.hero,.nav,.menu,.modal')) { e.classList.add('in', 'rv-now'); return false; } e.classList.add('rv-wait'); return true; });
  if (RA.RM || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = RA._io || (RA._io = new IntersectionObserver(es => {
    const hit = es.filter(en => en.isIntersecting).map(en => en.target);
    hit.sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
    let k = 0;
    hit.forEach(t => {
      if (t.matches('.card[data-rv],.proc-s,[data-rv="scale"]') && !t.style.getPropertyValue('--d')) t.style.setProperty('--d', (Math.min(k++, 4) * 0.05).toFixed(2) + 's');
      t.classList.add('in'); RA._io.unobserve(t);
      if (t.matches('.folio,.eyebrow')) decode(t); else $$('.folio,.eyebrow', t).forEach(decode);
    });
  }, { rootMargin: '0px 0px 12% 0px', threshold: 0 }));
  /* a clip-path:inset(100%) photo has zero visible area and Chrome's observer counts that, so watch its parent instead */
  const iow = RA._iow || (RA._iow = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; (en.target._wp || []).forEach(w => w.classList.add('in')); en.target._wp = null; RA._iow.unobserve(en.target);
  }), { rootMargin: '0px 0px -7% 0px', threshold: 0 }));
  els.forEach(e => {
    if (e.classList.contains('wp') && e.parentElement) { const h = e.parentElement; (h._wp || (h._wp = [])).push(e); iow.observe(h); }
    else io.observe(e);
  });
  $$('.folio,.eyebrow', scope).forEach(f => { if (!f._dec && !f.closest('[data-rv],.sec-head .meta')) decodeOnView(f); });
  $$('.sec-head .meta', scope).forEach(m => { const f = $('.folio', m); if (f && !f._dec) decodeOnView(f); });
};
/* labels decode like a ledger being posted */
const GLYPH = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789#/+=';
function decode(el) {
  return; /* v2: labels show as written, no scramble */
  if (!el || el._dec || RA.RM) return; el._dec = 1;
  const nodes = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.textContent.trim()) nodes.push([n, n.textContent]);
  const total = nodes.reduce((a, x) => a + x[1].length, 0); if (!total) return;
  const t0 = performance.now(), dur = Math.min(1100, 380 + total * 22);
  const step = now => {
    const p = Math.min(1, (now - t0) / dur); let off = 0;
    nodes.forEach(([node, txt]) => {
      let out = '';
      for (let i = 0; i < txt.length; i++) { const c = txt[i], q = (off + i) / total; out += (p >= 1 || q < p * 1.15 - 0.15 || /[\s·—–&.,:;()'’]/.test(c)) ? c : GLYPH[(Math.random() * GLYPH.length) | 0]; }
      node.textContent = out; off += txt.length;
    });
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function decodeOnView(el) {
  return;
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { decode(en.target); io.disconnect(); } }), { threshold: 0.6 });
  io.observe(el);
}
function counters() {
  return; /* v2: figures are printed in the page; no count-up from zero */
  const els = $$('[data-count]'); if (!els.length) return;
  const run = el => {
    const end = parseFloat(el.dataset.count), dp = (el.dataset.count.split('.')[1] || '').length, dur = 1600, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = (end * e).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }); if (p < 1) requestAnimationFrame(step); };
    if (RA.RM) el.textContent = end.toLocaleString('en-US'); else requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: 0.4 });
  els.forEach(e => io.observe(e));
}

/* ---------------------------------------------------------------- tilt, magnetic, cursor */
RA.tilt = function (scope) {
  $$('[data-tilt]', scope).forEach(el => {
    if (el._tilt) return; el._tilt = 1;
    if (!$('.sheen', el) && el.classList.contains('card')) { const s = document.createElement('i'); s.className = 'sheen'; el.prepend(s); }
    if (!RA.FINE || RA.RM) return;
    const max = parseFloat(el.dataset.tilt) || 5;
    let raf = 0;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { el.style.transform = 'perspective(1100px) rotateX(' + ((0.5 - y) * max).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * max).toFixed(2) + 'deg) translateZ(0)'; });
    });
    el.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); el.style.transform = ''; });
  });
};
function autoTilt() {
  $$('.card').forEach(c => { if (c.hasAttribute('data-tilt') || c.closest('.vpanel,form,[data-rail],[data-stack]') || $('input,select,textarea,table,canvas', c)) return; c.setAttribute('data-tilt', '3.5'); });
}
function magnetic() {
  if (!RA.FINE || RA.RM) return;
  $$('[data-mag]').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)'; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
function cursor() {
  return; /* v2: the normal cursor; no follower ring */
  if (!RA.FINE || RA.RM) return;
  const c = $('.cursor'); if (!c) return;
  const dot = $('.c-dot', c), ring = $('.c-ring', c);
  let x = -100, y = -100, rx = -100, ry = -100, shown = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return; x = e.clientX; y = e.clientY;
    if (!shown) { shown = true; rx = x; ry = y; root.classList.add('has-cursor'); }
    c.classList.toggle('hover', !!e.target.closest('a,button,[role=button],input,select,textarea,label,[data-tilt]'));
  }, { passive: true });
  addEventListener('pointerdown', () => c.classList.add('down')); addEventListener('pointerup', () => c.classList.remove('down'));
  document.addEventListener('mouseleave', () => c.classList.add('gone')); document.addEventListener('mouseenter', () => c.classList.remove('gone'));
  (function f() { rx += (x - rx) * 0.2; ry += (y - ry) * 0.2; dot.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)'; requestAnimationFrame(f); })();
}
function uiSounds() {
  addEventListener('pointerdown', () => Snd.unlock(), { once: true });
  if (RA.FINE) document.addEventListener('pointerover', e => {
    const t = e.target.closest('a,button'); if (!t || (e.relatedTarget && t.contains(e.relatedTarget))) return; Snd.tick();
  });
  document.addEventListener('click', e => { if (e.target.closest('a,button:not([data-nosnd])')) Snd.click(); });
}

/* ---------------------------------------------------------------- toast + modal */
RA.toast = function (msg, ms) {
  let box = $('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 420); }, ms || 2600);
};
RA.modal = function (html) {
  const m = $('#modal'); if (!m) return;
  $('#modalBody').innerHTML = html; m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); RA.lock(true); Snd.open();
  const f = $('input,select,textarea,button:not(.xbtn)', $('#modalBody')); setTimeout(() => f && f.focus(), 60);
};
RA.closeModal = function () {
  const m = $('#modal'); if (!m || !m.classList.contains('open')) return;
  m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); RA.lock(false); Snd.close();
  setTimeout(() => { if (!m.classList.contains('open')) { $('#modalBody').innerHTML = ''; const b = $('.modal-box', m); if (b) b.classList.remove('wide'); } }, 420);
};
function modalWire() {
  const m = $('#modal'); if (!m) return;
  m.addEventListener('click', e => { if (e.target.closest('[data-close]')) RA.closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') RA.closeModal(); });
}

/* ---------------------------------------------------------------- config binding */
function bindConfig() {
  $$('[data-wa]').forEach(a => { a.href = C.waUrl(a.dataset.wa || ''); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-cfg]').forEach(el => { const v = C[el.dataset.cfg]; if (v) el.textContent = v; });
  $$('[data-href]').forEach(a => { const v = C[a.dataset.href]; if (v) { a.href = v; a.target = '_blank'; a.rel = 'noopener'; } else a.hidden = true; });
  $$('[data-need]').forEach(el => { if (!C[el.dataset.need]) el.hidden = true; });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
}

/* ---------------------------------------------------------------- dock */
function dock() {
  const d = $('.dock'); if (!d) return;
  $$('[data-theme-btn]').forEach(b => { b.setAttribute('aria-pressed', String(root.dataset.theme === 'light')); b.addEventListener('click', () => RA.theme(root.dataset.theme === 'light' ? 'dark' : 'light')); });
  const sb = $('[data-sound-btn]');
  if (sb) {
    const paint = () => { sb.setAttribute('aria-pressed', String(Snd.on)); sb.innerHTML = Snd.on ? ICON.sound : ICON.mute; sb.setAttribute('aria-label', Snd.on ? 'Turn sound off' : 'Turn sound on'); };
    paint(); sb.addEventListener('click', () => { Snd.set(!Snd.on); paint(); RA.toast(Snd.on ? 'Sound on' : 'Sound off', 1400); });
  }
  $$('[data-sound-toggle]').forEach(t => { const p = () => { t.textContent = Snd.on ? 'Sound: on' : 'Sound: off'; t.setAttribute('aria-pressed', String(Snd.on)); }; p(); t.addEventListener('click', () => { Snd.set(!Snd.on); p(); const sb = $('[data-sound-btn]'); if (sb) sb.innerHTML = Snd.on ? ICON.sound : ICON.mute; }); });
  const top = $('[data-top-btn]'), ring = top && $('circle', top);
  if (top) {
    const upd = () => { const h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? scrollY / h : 0; if (ring) ring.style.setProperty('--off', (100.5 * (1 - p)).toFixed(1)); };
    addEventListener('scroll', upd, { passive: true }); upd();
    top.addEventListener('click', () => RA.go(0, 0));
  }
}
const ICON = RA.ICON = {
  sound: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>',
  arrow: '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

/* ---------------------------------------------------------------- command palette */
function cmdk() {
  const box = $('#cmdk'); if (!box) return;
  const inp = $('#cmdkIn'), list = $('#cmdkList');
  const PAGES = [['Home', 'index.html', 'Start'], ['Courses', 'courses.html', '2058 · 0493 papers'], ['Syllabus tracker', 'syllabus.html', 'Every topic'], ['Past papers', 'past-papers.html', 'QP · MS · timer'],
    ['Islamiyat Lab', 'lab.html', 'Five tools'], ['Notes store', 'notes.html', 'Order by message'], ['About Sir Fazil', 'about.html', 'Story'], ['Enrol & contact', 'contact.html', 'Book a seat'],
    ['AI answer checker', 'ai-checker.html', 'Get an answer marked'], ['Student portal', 'portal.html', 'Notes · lectures · results · fees'], ['Parents', 'parent.html', 'Your child’s progress'], ['Crash course', 'crash-course.html', 'Before the exam'], ['Reviews', 'reviews.html', 'Students']];
  const TOOLS = [['zakat', 'Zakat calculator'], ['timeline', 'Seerah and Caliphate timeline'], ['passages', 'The 15 Qur\'anic passages'], ['hadith', 'The 20 Hadiths: flashcards'], ['terms', 'Key-term flashcards and quiz']];
  const items = [];
  PAGES.forEach(p => items.push({ g: 'Pages', i: '→', t: p[0], s: p[2], go: p[1] }));
  TOOLS.forEach(t => items.push({ g: 'Lab tools', i: 'LAB', t: t[1], s: 'lab', go: 'lab.html#' + t[0] }));
  if (D) {
    D.INDEX.forEach(t => items.push({ g: 'Syllabus topics', i: t.code, t: t.n + '  ' + t.t, s: t.unit, go: 'syllabus.html#' + t.k + '-' + t.n, k: t.pts.join(' ') }));
    D.DEFS.forEach(d => items.push({ g: 'Key terms', i: 'DEF', t: d[0], s: 'topic ' + d[2], k: d[1], fn: () => { if (RA.bot) RA.bot.ask('define ' + d[0]); } }));
    (D.DATES || []).forEach(d => items.push({ g: 'Key dates', i: d[0].replace('c. ', ''), t: d[2], s: d[0] + (d[1] ? ' CE · ' + d[1] : ''), go: 'syllabus.html#ol-' + d[3] }));
  }
  items.push({ g: 'Actions', i: '♪', t: 'Sound on / off', s: 'sound', fn: () => { const b = $('[data-sound-btn]'); b ? b.click() : Snd.set(!Snd.on); } });
  items.push({ g: 'Actions', i: '⏱', t: 'Time a 2058 Paper 1 (1h 30m)', s: 'timer', go: 'past-papers.html#t-2058-1' });
  items.push({ g: 'Actions', i: '⏱', t: 'Time a 2058 Paper 2 (1h 30m)', s: 'timer', go: 'past-papers.html#t-2058-2' });
  items.push({ g: 'Actions', i: 'MSG', t: 'Message Sir Fazil', s: 'enrol', go: C.waUrl('Assalam o Alaikum Sir, I found your website and would like to book a seat.'), ext: 1 });
  let shown = [], sel = 0;
  function render() {
    const q = inp.value.trim().toLowerCase(), toks = q.split(/\s+/).filter(Boolean);
    shown = items.filter(it => { const h = (it.t + ' ' + it.s + ' ' + (it.k || '') + ' ' + it.g).toLowerCase(); return toks.every(t => h.includes(t)); });
    if (!q) shown = shown.filter(it => !/Syllabus topics|Key terms|Key dates/.test(it.g)).concat(items.filter(it => it.g === 'Syllabus topics').slice(0, 6));
    shown = shown.slice(0, 40); sel = 0;
    let g = '', html = '';
    shown.forEach((it, i) => { if (it.g !== g) { g = it.g; html += '<div class="cmdk-grp">' + RA.esc(g) + '</div>'; } html += '<button type="button" class="cmdk-item" role="option" data-i="' + i + '" aria-selected="' + (i === 0) + '"><i>' + RA.esc(it.i) + '</i><span>' + RA.esc(it.t) + '</span><small>' + RA.esc(it.s) + '</small></button>'; });
    list.innerHTML = html || '<div class="empty" style="margin:8px">Nothing matches “' + RA.esc(q) + '”. Try a topic like “Badr”, “zakat” or “passage 5”.</div>';
  }
  function pick(i) { const it = shown[i]; if (!it) return; close(); if (it.fn) return it.fn(); if (it.ext) return window.open(it.go, '_blank', 'noopener'); location.href = it.go; }
  function move(d) { const b = $$('.cmdk-item', list); if (!b.length) return; sel = (sel + d + b.length) % b.length; b.forEach((x, i) => x.setAttribute('aria-selected', String(i === sel))); b[sel].scrollIntoView({ block: 'nearest' }); }
  function open() { box.classList.add('open'); box.setAttribute('aria-hidden', 'false'); inp.value = ''; render(); setTimeout(() => inp.focus(), 30); RA.lock(true); Snd.open(); }
  function close() { if (!box.classList.contains('open')) return; box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); RA.lock(false); }
  RA.cmdk = open;
  inp.addEventListener('input', render);
  inp.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); move(1); } else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); } else if (e.key === 'Enter') { e.preventDefault(); pick(sel); } });
  list.addEventListener('click', e => { const b = e.target.closest('.cmdk-item'); if (b) pick(+b.dataset.i); });
  box.addEventListener('click', e => { if (e.target.classList.contains('scrim')) close(); });
  addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); box.classList.contains('open') ? close() : open(); }
    else if (e.key === 'Escape') close();
  });
  $$('[data-cmdk]').forEach(b => b.addEventListener('click', open));
}

/* ---------------------------------------------------------------- Sir Fazil’s Assistant (answers below) */
function bot() {
  const fab = $('.fab'), box = $('#bot'); if (!fab || !box) return;
  const log = $('.bot-log', box), form = $('.bot-f', box), inp = $('input', form), chipsEl = $('.bot-chips', box);
  let hist = []; try { hist = JSON.parse(sessionStorage.getItem('ilm-bot-log') || '[]'); } catch (e) { }
  /* the frosted panel: a dark header with a live seal, a welcome with topic tiles, a WhatsApp line */
  const CF = window.RA_CONFIG || {}, IC = p => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  $('.bot-h', box).innerHTML = '<span class="bot-av"><span class="seal" aria-hidden="true"><b>MFM</b></span><i class="live" aria-hidden="true"></i></span><div class="bot-id"><b>Sir Fazil’s Assistant</b><small>Replies instantly · Islamiyat 2058 &amp; 0493</small></div><button class="xbtn" type="button" aria-label="Close">' + IC('<path d="M6 6l12 12M18 6 6 18"/>') + '</button>';
  if (!$('.bot-foot', box)) form.insertAdjacentHTML('afterend', '<a class="bot-foot" target="_blank" rel="noopener" href="' + (CF.waUrl ? CF.waUrl('Assalam o Alaikum Sir, I have a question about Islamiyat') : 'contact.html') + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#25D366"/><g transform="translate(4.2 4.2) scale(.65)"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></g></svg>Prefer a person? <b>WhatsApp Sir Fazil’s team</b></a>');
  inp.placeholder = 'Ask a term, a passage, a Hadith or a date…';
  const TILES = [
    ['<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', 'Class timings', 'timings'],
    ['<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>', 'Where does Sir teach?', 'where does Sir Fazil teach?'],
    ['<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20"/>', 'The 15 passages', 'passages'],
    ['<path d="M7 4h10v16l-5-3.5L7 20z"/>', 'The 20 Hadiths', 'hadiths'],
    ['<path d="M8 3h8l4 4v14H4V3z"/><path d="M8 12h8M8 16h5"/>', 'Past papers', 'past papers'],
    ['<path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z"/>', 'Define a key term', 'Define tawhid'],
    ['<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h7"/>', 'Work out zakat', 'zakat'],
    ['<path d="M20 12.5 12.5 20 4 11.5V4h7.5z"/><circle cx="8" cy="8" r="1.3"/>', 'Fees', 'fees']
  ];
  function welcome() {
    const w = document.createElement('div'); w.className = 'bot-hi';
    w.innerHTML = '<h4>Assalam o Alaikum!</h4><p>I’m Sir Fazil’s Assistant, Sir Fazil’s study assistant. Pick a topic or type your question. For anything I can’t answer, Sir’s team is one tap away on WhatsApp.</p><div class="bot-lv"><button type="button" data-say="I’m in O Level">O Level 2058</button><button type="button" data-say="I’m doing IGCSE">IGCSE 0493</button></div><div class="bot-tiles">' + TILES.map(([ic, t, q]) => '<button type="button" class="bot-tile" data-say="' + RA.esc(q) + '"><span class="ic">' + IC(ic) + '</span><span>' + t + '</span></button>').join('') + '</div>';
    log.appendChild(w);
  }
  function say(html, who, keep) {
    const m = document.createElement('div'); m.className = 'msg ' + (who || 'b'); m.innerHTML = html; log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    if (keep !== false && !/typing/.test(who || '')) { hist.push([who || 'b', html]); hist = hist.slice(-30); try { sessionStorage.setItem('ilm-bot-log', JSON.stringify(hist)); } catch (e) { } }
    return m;
  }
  function reply(html) {
    const t = say('<i></i><i></i><i></i>', 'b typing', false);
    setTimeout(() => { t.remove(); say(html); Snd.soft(); chips(); }, RA.RM ? 50 : 380 + Math.random() * 300);
  }
  function ask(q) { q = String(q || '').trim(); if (!q) return; box.classList.add('talked'); say(RA.esc(q), 'u'); reply(RA.botAnswer ? RA.botAnswer(q) : 'Ask on WhatsApp.'); }
  function chips() { const c = RA.botChips ? RA.botChips() : []; chipsEl.innerHTML = c.map(t => '<button class="chip" type="button">' + RA.esc(t) + '</button>').join(''); }
  let greeted = false;
  function open() {
    box.classList.add('open'); box.setAttribute('aria-hidden', 'false'); fab.setAttribute('aria-expanded', 'true'); Snd.open();
    if (!greeted) { greeted = true; welcome(); if (hist.length) { box.classList.add('talked'); hist.forEach(([w, h]) => say(h, w, false)); } }
    chips(); setTimeout(() => { if (RA.FINE) inp.focus({ preventScroll: true }); }, 120);
  }
  function close() { box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); fab.setAttribute('aria-expanded', 'false'); Snd.close(); }
  RA.bot = { open, close, ask: q => { if (!box.classList.contains('open')) open(); setTimeout(() => ask(q), 220); } };
  fab.addEventListener('click', () => box.classList.contains('open') ? close() : open());
  $$('[data-ask],[data-open-bot]').forEach(b => b.addEventListener('click', () => { if (!box.classList.contains('open')) open(); }));
  $('.xbtn', box).addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  form.addEventListener('submit', e => { e.preventDefault(); const v = inp.value; inp.value = ''; ask(v); });
  box.addEventListener('click', e => {
    const s = e.target.closest('[data-say]'); if (s) { ask(s.dataset.say); return; }
    if (e.target.closest('[data-open-cart]')) { if (RA.cart) RA.cart.open(); return; }
    const c = e.target.closest('.bot-chips .chip'); if (c) ask(c.textContent);
  });
  chips();
}

/* ---------------------------------------------------------------- rails: horizontal galleries */
const CHEV = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>';
function setVW() { root.style.setProperty('--vw', root.clientWidth + 'px'); }
setVW(); addEventListener('resize', setVW);
RA.rails = function (scope) {
  $$('[data-rail]', scope).forEach(track => {
    if (track._rail) { track._rail(); return; }
    const mode = track.dataset.rail;
    track.classList.add('rail');
    const ctl = document.createElement('div');
    ctl.className = 'rail-ctl' + (/^[mtc]$/.test(mode) ? ' rail-ctl-' + mode : '');
    ctl.innerHTML = '<span class="rail-n"><b>01</b> / <i>01</i></span><span class="rail-bar" aria-hidden="true"><i></i></span><span class="rail-btns">' +
      '<button type="button" class="rail-b" data-d="-1" aria-label="Previous">' + CHEV(-1) + '</button><button type="button" class="rail-b" data-d="1" aria-label="Next">' + CHEV(1) + '</button></span>';
    (track.dataset.railAfter ? $(track.dataset.railAfter) || track : track).after(ctl);
    const n = $('.rail-n b', ctl), tot = $('.rail-n i', ctl), bar = $('.rail-bar i', ctl), prev = $('[data-d="-1"]', ctl), next = $('[data-d="1"]', ctl);
    const items = () => Array.from(track.children).filter(c => c.offsetParent !== null || c.getClientRects().length);
    let raf = 0;
    const upd = () => {
      raf = 0;
      const pl = getComputedStyle(track).paddingLeft; if (track.style.scrollPaddingInline !== pl) track.style.scrollPaddingInline = pl;
      const sw = track.scrollWidth, cw = track.clientWidth, max = sw - cw, x = track.scrollLeft;
      const scrolls = getComputedStyle(track).overflowX !== 'visible' && max > 4;
      ctl.style.display = scrolls ? '' : 'none';
      if (!scrolls) return;
      const its = items(); const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      let idx = 0; its.forEach((it, i) => { if (it.offsetLeft - pad <= x + 8) idx = i; });
      if (x >= max - 4) idx = its.length - 1;
      n.textContent = String(idx + 1).padStart(2, '0'); tot.textContent = String(its.length).padStart(2, '0');
      const tw = Math.max(.08, cw / sw); bar.style.setProperty('--tw', tw.toFixed(3)); bar.style.setProperty('--tx', ((x / max) * (1 / tw - 1)).toFixed(3));
      prev.disabled = x <= 4; next.disabled = x >= max - 4;
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    track._rail = q;
    track.addEventListener('scroll', q, { passive: true }); addEventListener('resize', q);
    if ('MutationObserver' in window) new MutationObserver(q).observe(track, { childList: true });
    ctl.addEventListener('click', e => {
      const b = e.target.closest('.rail-b'); if (!b) return;
      const its = items(), first = its[0], second = its[1];
      const step = first ? (second ? second.offsetLeft - first.offsetLeft : first.offsetWidth) : track.clientWidth * .8;
      const per = Math.max(1, Math.floor((track.clientWidth - 20) / step));
      track.scrollBy({ left: +b.dataset.d * step * per, behavior: RA.RM ? 'auto' : 'smooth' }); Snd.soft();
    });
    /* drag with a mouse */
    let down = false, sx = 0, sl = 0, moved = 0;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('input,select,textarea,button,summary')) return;
      down = true; moved = 0; sx = e.clientX; sl = track.scrollLeft;
    });
    addEventListener('pointermove', e => {
      if (!down) return; const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = 1; track.classList.add('dragging'); }
      if (moved) { track.scrollLeft = sl - dx; e.preventDefault(); }
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      if (moved) {
        const its = items(), x = track.scrollLeft, pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        let best = 0, bd = 1e9; its.forEach(it => { const d = Math.abs(it.offsetLeft - pad - x); if (d < bd) { bd = d; best = it.offsetLeft - pad; } });
        track.classList.remove('dragging'); track.scrollTo({ left: best, behavior: 'smooth' });
        const stop = ev => { ev.preventDefault(); ev.stopPropagation(); };
        track.addEventListener('click', stop, { capture: true, once: true }); setTimeout(() => track.removeEventListener('click', stop, true), 50);
      }
    });
    upd(); setTimeout(upd, 400);
  });
};

/* ---------------------------------------------------------------- button light + photo parallax */
function finish() {
  /* button finish: inner sheen layer and click ripple */
  const dress = b => { if (b.firstElementChild && b.firstElementChild.classList.contains('btn-sheen')) return; const s = document.createElement('span'); s.className = 'btn-sheen'; s.setAttribute('aria-hidden', 'true'); b.prepend(s); };
  $$('.btn').forEach(dress);
  if ('MutationObserver' in window) new MutationObserver(ms => ms.forEach(m => {
    const t = m.target; if (t.nodeType === 1 && t.classList.contains('btn')) dress(t);
    m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.classList.contains('btn')) dress(n); if (n.firstElementChild) $$('.btn', n).forEach(dress); });
  })).observe(document.body, { childList: true, subtree: true });
  if (!RA.RM) document.addEventListener('pointerdown', e => {
    const b = e.target.closest && e.target.closest('.btn'); if (!b || b.disabled) return;
    const r = b.getBoundingClientRect(), s = document.createElement('span');
    s.className = 'rip'; s.style.setProperty('--rx', (e.clientX - r.left) + 'px'); s.style.setProperty('--ry', (e.clientY - r.top) + 'px');
    b.appendChild(s); setTimeout(() => s.remove(), 950);
  });
  /* cards: the lit edge follows the cursor */
  if (RA.FINE && !RA.RM) document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.card'); if (!c || c._tilt) return;
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
  $$('a.btn:not(.btn-ghost):not(.btn-sm):not(.btn-xs):not(.btn-block)').forEach(a => {
    if ($('svg', a) || !a.textContent.trim()) return;
    a.insertAdjacentHTML('beforeend', a.hasAttribute('data-wa') ? ICON.wa.replace('<svg ', '<svg class="ic" ') : ICON.arrow);
  });
  if (RA.FINE && !RA.RM) document.addEventListener('pointermove', e => {
    const b = e.target.closest && e.target.closest('.btn,.rail-b'); if (!b) return;
    const r = b.getBoundingClientRect(); b.style.setProperty('--bx', (e.clientX - r.left).toFixed(0) + 'px'); b.style.setProperty('--by', (e.clientY - r.top).toFixed(0) + 'px');
  }, { passive: true });
  if (window.gsap && window.ScrollTrigger && !RA.RM) {
    $$('.ph[data-par] > img').forEach(img => {
      gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
  $$('.ph > img').forEach(img => { if (img.complete && !img.naturalWidth && img.getAttribute('src')) img.closest('.ph').classList.add('ph-x'); });
  $$('.credo-plate img').forEach(img => { if (img.complete && !img.naturalWidth) img.parentNode.classList.add('nologo'); });
}

/* ---------------------------------------------------------------- preloader: FAZIL rises, fills with gold from below, then the camera dives through the I */
function loader() {
  const on = root.classList.contains('ld-on');
  const parts = $$('.ldx-fill,.ldx-ink,.ldx-m');
  const kill = () => { parts.forEach(p => p.remove()); root.classList.remove('ld-on'); };
  try { sessionStorage.setItem('ra-seen', '1'); } catch (e) { }
  if (!on || RA.RM || !window.gsap) { kill(); return Promise.resolve(); }
  RA.lock(true); scrollTo(0, 0);
  const fill = $('.ldx-fill'), ink = $('.ldx-ink'), gold = $('.ldx-gold'), N = $('#ldN');
  const L = $$('.ldx-ink .ldx-w i'), sub = $('.ldx-ink .ldx-s span'), metas = $$('.ldx-m');
  gsap.set(L, { yPercent: 118 }); gsap.set(sub, { yPercent: 120 }); gsap.set(metas, { autoAlpha: 0, y: 10 });
  gsap.set(['.nav', '.fab', '.dock', '.mbar'], { autoAlpha: 0 });
  const st = { lv: 0, ps: 1.32 };
  const paint = () => { gold.style.setProperty('--lv', st.lv.toFixed(2)); fill.style.setProperty('--lv', st.lv.toFixed(2)); gold.style.setProperty('--ps', st.ps.toFixed(3)); N.textContent = String(Math.round(st.lv)).padStart(3, '0'); };
  const fonts = Promise.race([document.fonts && document.fonts.load ? document.fonts.load('900 100px "Big Shoulders Display"') : Promise.resolve(), new Promise(r => setTimeout(r, 900))]);
  const frames = new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  if (window.gsap) gsap.ticker.lagSmoothing(400, 33);
  return Promise.all([fonts, frames]).then(() => new Promise(res => {
    const E = 'expo.out';
    gsap.timeline({ onComplete: kill })
      .to(metas, { autoAlpha: 1, y: 0, duration: .8, ease: E, stagger: .06 }, 0)
      .to(L, { yPercent: 0, duration: 1.2, ease: E, stagger: .075 }, .12)
      .to(sub, { yPercent: 0, duration: 1, ease: E }, .75)
      .to(st, { lv: 100, duration: 2.5, ease: 'power2.inOut', onUpdate: paint }, .35)
      .to(st, { ps: 1.06, duration: 3.4, ease: 'power1.inOut', onUpdate: paint }, 0)
      .add(() => {
        const I = $('.ldx-ink .ldx-i').getBoundingClientRect();
        const o = (I.left + I.width / 2) + 'px ' + (I.top + I.height * .5) + 'px';
        gsap.set([ink, fill], { transformOrigin: o });
      }, 3.0)
      .to(metas, { autoAlpha: 0, y: -8, duration: .35, ease: 'power2.in' }, 3.0)
      .to([ink, fill], { scale: 70, duration: 1.4, ease: 'expo.in' }, 3.05)
      .to(fill, { opacity: 0, duration: .5, ease: 'power2.in' }, 3.4)
      .add(() => { RA.lock(false); res(); }, 3.45)
      .to(['.nav', '.fab', '.dock', '.mbar'], { autoAlpha: 1, duration: .9, ease: 'power2.out', clearProps: 'opacity,visibility' }, 3.7)
      .set(ink, { autoAlpha: 0 }, 4.45);
  }));
}

/* ---------------------------------------------------------------- page curtain: the next page's name rises and fills, then lifts */
const PAGES = { 'index.html': ['Home', 'f.01'], '': ['Home', 'f.01'], 'ai-checker.html': ['AI Checker', 'f.02'], 'portal.html': ['Portal', 'f.03'], 'parent.html': ['Parents', 'f.04'], 'past-papers.html': ['Past papers', 'f.05'], 'notes.html': ['Notes', 'f.06'], 'crash-course.html': ['Crash course', 'f.07'], 'courses.html': ['Courses', 'f.08'], 'syllabus.html': ['Syllabus', 'f.09'], 'lab.html': ['The Lab', 'f.10'], 'reviews.html': ['Reviews', 'f.11'], 'about.html': ['About', 'f.12'], 'contact.html': ['Contact', 'f.13'], '404.html': ['Not found', 'f.00'] };
function ptWord(label, folio) {
  const pt = $('.pt'); if (!pt) return;
  $('.pt-f', pt).textContent = (folio || '') + ' — Sir Fazil Maniya';
  const w = $('.pt-w', pt); w.textContent = label; delete w.dataset.splitDone; splitWords(w);
}
function curtain() {
  const pt = $('.pt'); if (!pt) return Promise.resolve();
  let arriving = null; try { arriving = sessionStorage.getItem('ra-pt'); sessionStorage.removeItem('ra-pt'); } catch (e) { }
  let p = Promise.resolve();
  if (root.classList.contains('pt-on')) {
    const d = (arriving || '').split('|'); ptWord(d[0] || 'Fazil Maniya', d[1]);
    p = new Promise(res => {
      const go = () => { pt.classList.add('lift'); setTimeout(res, 380); setTimeout(() => { root.classList.remove('pt-on'); pt.classList.remove('lift'); }, 1150); };
      const f = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 500))]) : Promise.resolve();
      f.then(() => setTimeout(go, 260));
    });
  }
  if (RA.RM) return p;
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-wa')) return;
    let u; try { u = new URL(a.href, location.href); } catch (er) { return; }
    if (u.origin !== location.origin) return;
    const nm = x => (x.split('/').pop() || 'index.html').replace(/\.html$/, '') + '.html';
    const file = nm(u.pathname);
    if (!(file in PAGES)) return;
    if (file === nm(location.pathname)) return;
    e.preventDefault();
    const [label, folio] = PAGES[file];
    try { sessionStorage.setItem('ra-pt', label + '|' + folio); } catch (er) { }
    ptWord(label, folio); pt.classList.add('go'); void pt.offsetWidth; pt.classList.add('cover');
    if (RA.lenis) RA.lenis.stop();
    setTimeout(() => { location.href = u.href; }, 720);
  });
  addEventListener('pageshow', e => { if (e.persisted) { pt.classList.remove('go', 'cover', 'lift'); root.classList.remove('pt-on'); if (RA.lenis) RA.lenis.start(); } });
  return p;
}

/* ---------------------------------------------------------------- motion details */
function motion() {
  const G = window.gsap, ST = window.ScrollTrigger;
  /* scroll progress line */
  const sp = $('.sprog');
  if (sp) { let q = 0; const u = () => { q = 0; const h = document.documentElement.scrollHeight - innerHeight; sp.style.setProperty('--sp', h > 0 ? (scrollY / h).toFixed(4) : 0); }; addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(u); }, { passive: true }); u(); }
  /* footer wordmark: fit to width, fill from the bottom as the page ends */
  const fm = $('.foot-mark');
  if (fm) {
    const o = $('.fm-o', fm);
    const fit = () => { fm.style.setProperty('--fms', '100px'); const w = o.scrollWidth, cs = getComputedStyle(fm.parentNode), W = fm.parentNode.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); if (w && W) fm.style.setProperty('--fms', Math.min(260, 100 * W / w * 0.99).toFixed(1) + 'px'); };
    fit(); addEventListener('resize', fit); if (document.fonts) { document.fonts.ready.then(fit); document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', fit); } setTimeout(fit, 1500); if ('ResizeObserver' in window) new ResizeObserver(fit).observe(fm.parentNode);
    if (!RA.RM) {
      let q = 0; const u = () => { q = 0; const r = fm.getBoundingClientRect(), h = innerHeight, max = document.documentElement.scrollHeight - h, start = Math.min(r.top + scrollY - h, max - 1); const p = Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, max - start))); fm.style.setProperty('--fl', (p * p * (3 - 2 * p)).toFixed(3)); };
      addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(u); }, { passive: true }); u();
    } else fm.style.setProperty('--fl', 1);
  }
  /* touch screens: photos switch to colour as they cross the middle of the screen (VERZISH) */
  if (!RA.FINE && 'IntersectionObserver' in window) {
    const lv = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('is-live', en.isIntersecting)), { rootMargin: '-38% 0px -38% 0px' });
    $$('.ph').forEach(p => lv.observe(p));
  }
  if (RA.RM || !G || !ST) return;
  /* v2: section intros and the hero copy stay fully readable while you scroll (no word-by-word fill, no fade-out) */
  $$('.phero').forEach(ph => {
    const g = $('.phero-g', ph) || $('.wrap', ph); if (!g) return;
    const kids = Array.from(g.children);
    G.timeline({ scrollTrigger: { trigger: ph, start: 'top top', end: 'bottom top', scrub: true } })
      .to(kids[0], { yPercent: -6, ease: 'none' }, 0)
      .to(kids.slice(1), { yPercent: 9, ease: 'none' }, 0);
  });
  /* the ledger tape speeds up with the scroll */
  const tapes = $$('.tape-in').map(t => t.getAnimations ? t.getAnimations()[0] : null).filter(Boolean);
  if (0 && tapes.length) { /* v2: the ribbons glide at one steady speed (no speed-ups on scroll) */
    let v = 1, last = scrollY, lt = performance.now();
    addEventListener('scroll', () => { const now = performance.now(), dv = Math.abs(scrollY - last) / Math.max(16, now - lt) * 16; last = scrollY; lt = now; v = Math.max(v, 1 + Math.min(dv / 6, 7)); }, { passive: true });
    G.ticker.add(() => { v += (1 - v) * 0.05; tapes.forEach(a => a.playbackRate = v); });
  }
  /* VERZISH sticky stack: each card pins under the nav; the ones beneath shrink back and dim as the next arrives */
  /* v2: the method cards now sit one below the other; no pinned stack */
  if (0) $$('[data-stack]').forEach(st => {
    const kids = Array.from(st.children);
    kids.forEach((k, i) => k.style.setProperty('--si', i));
    kids.forEach((k, i) => {
      if (i === kids.length - 1) return;
      const nxt = kids[i + 1];
      G.fromTo(k, { scale: 1, filter: 'brightness(1)' }, { scale: 0.9 + Math.min(i, 5) * 0.008, filter: 'brightness(.42)', ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: nxt, start: 'top bottom', end: () => 'top ' + (parseFloat(getComputedStyle(nxt).top) || 100) + 'px', scrub: true, invalidateOnRefresh: true } });
    });
  });
  /* rails glide in from the right */
  $$('[data-rail]').forEach(r => G.from(r, { x: 32, opacity: 0, duration: .55, ease: 'power3.out', scrollTrigger: { trigger: r, start: 'top 96%', once: true } }));
  /* big section numbers drift */
  /* v2: section titles sit still (no scroll drift) */
}

/* ---------------------------------------------------------------- boot */
RA.boot = function () {
  bindConfig(); smooth(); nav(); modalWire(); dock(); cmdk(); bot(); cursor(); uiSounds(); counters();
  /* v2: no intro screen and no page curtain: the page is the first thing you see */
  $$('.ldx,.pt').forEach(n => n.remove()); root.classList.remove('ld-on', 'pt-on');
  const L = Promise.resolve();
  
  Q.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
  RA.reveal(); autoTilt(); RA.tilt(); RA.rails(); finish(); motion();
  if (window.ScrollTrigger) {
    const r = () => ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(r);
    addEventListener('load', r, { once: true });
  }
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', RA.boot); else RA.boot();
})();

/* =========================================================================
   Study engine — what every page shares on top of RA core:
   the notes cart, the send helper, Sir Fazil’s Assistant's answers,
   copy buttons. Data lives in data.js (RA.DATA).
   ========================================================================= */
(function () {
'use strict';
const RA = window.RA, D = RA.DATA, C = RA.C, $ = RA.$, $$ = RA.$$, esc = RA.esc, Snd = RA.Snd;
const BIZ = RA.BIZ = {};
const wa = t => C.waUrl(t);
/* send a ready-written message: WhatsApp when a number is set, otherwise copy it and open Instagram */
RA.send = function (msg, what) {
  if (C.whatsapp) { window.open(wa(msg), '_blank', 'noopener'); RA.toast('WhatsApp is opening with your ' + (what || 'message')); return; }
  const go = () => { if (C.instagram) window.open(C.instagram, '_blank', 'noopener'); };
  const ok = () => { RA.toast('Your ' + (what || 'message') + ' is copied. Paste it in the DM', 4200); go(); };
  if (navigator.clipboard) navigator.clipboard.writeText(msg).then(ok).catch(() => { go(); RA.toast('Copy your message from the preview, then send it'); }); else { go(); }
};
const WA_ICO = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>';
BIZ.fmt = n => Math.abs(n) >= 1000 ? Math.round(n).toLocaleString('en-PK') : (Math.round(n * 100) / 100).toString();

/* ---------------------------------------------------------------- notes cart (prices are quoted on WhatsApp) */
(function () {
  const el = $('#cart'); if (!el) return;
  let items = RA.store.get('ilm-cart', []);
  const byId = id => D.PRODUCTS.find(p => p.id === id);
  items = items.filter(i => byId(i.id));
  const save = () => { RA.store.set('ilm-cart', items); badge(); };
  function badge() { const n = items.reduce((a, b) => a + b.q, 0); $$('[data-cart-n]').forEach(b => { b.textContent = n || ''; b.dataset.n = n; }); $$('.nav-cart').forEach(b => b.classList.toggle('has', n > 0)); }
  function render() {
    const b = $('#cartBody'), f = $('#cartFoot');
    if (!items.length) { b.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><a class="btn btn-sm" href="notes.html">Browse notes</a></div>'; f.hidden = true; return; }
    f.hidden = false;
    b.innerHTML = items.map((i, k) => { const p = byId(i.id); return '<div class="ci"><span class="ci-c">' + esc(p.code) + '</span><div><b>' + esc(p.t) + '</b><small>' + (i.f === 'print' ? 'Printed' : 'PDF') + ' · ' + esc(p.lvl) + '</small></div><div class="qty"><button type="button" data-q="-1" data-k="' + k + '" aria-label="One less">−</button><span>' + i.q + '</span><button type="button" data-q="1" data-k="' + k + '" aria-label="One more">+</button></div></div>'; }).join('');
  }
  function add(id, f) { f = f || 'print'; const ex = items.find(i => i.id === id && i.f === f); ex ? ex.q++ : items.push({ id, f, q: 1 }); save(); render(); Snd.coin(); const p = byId(id); RA.toast((p ? p.t : 'Notes') + ' added to your cart'); $$('[data-cart-open]').forEach(b => b.animate && b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' })); }
  function open() { render(); el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); Snd.open(); }
  function close() { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); Snd.close(); }
  RA.cart = { add, open, close, items: () => items };
  $('#cartBody').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (!b) return; const k = +b.dataset.k; items[k].q += +b.dataset.q; if (items[k].q <= 0) items.splice(k, 1); save(); render(); Snd.soft(); });
  $$('[data-cart-open]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); el.classList.contains('open') ? close() : open(); }));
  $('#cartX').addEventListener('click', close);
  document.addEventListener('click', e => { if (el.classList.contains('open') && !e.target.closest('#cart,[data-cart-open],[data-add]')) close(); });
  document.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (!b) return; add(b.dataset.add, b.dataset.f); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && el.classList.contains('open')) close(); });
  $('#cartFoot').addEventListener('submit', e => {
    e.preventDefault(); const nm = $('#coName'), ph = $('#coPhone'), city = $('#coCity'); let bad = false;
    [[nm, v => v.trim().length > 1], [ph, v => v.replace(/\D/g, '').length >= 10], [city, v => v.trim().length > 1]].forEach(([i, ok]) => { const f = !ok(i.value); i.setAttribute('aria-invalid', String(f)); if (f) bad = true; });
    if (bad) { Snd.err(); $('#coErr').textContent = 'Add your name, a WhatsApp number (10+ digits) and your city.'; return; }
    $('#coErr').textContent = '';
    const lines = items.map(i => { const p = byId(i.id); return '• ' + p.t + ' (' + p.code + ') — ' + (i.f === 'print' ? 'Printed' : 'PDF') + ' × ' + i.q; });
    const msg = "Assalam o Alaikum Sir, I'd like to order these Islamiyat notes:\n\n" + lines.join('\n') + '\n\nName: ' + nm.value.trim() + '\nWhatsApp: ' + ph.value.trim() + '\nCity: ' + city.value.trim() + ($('#coAddr').value.trim() ? '\nAddress: ' + $('#coAddr').value.trim() : '') + '\n\nPlease confirm the price, availability and delivery.';
    Snd.chime(); RA.send(msg, 'order');
  });
  badge();
})();

/* ---------------------------------------------------------------- copy buttons */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]'); if (!b) return; const v = b.dataset.copy;
  const ok = () => { const o = b.textContent; b.textContent = 'Copied'; setTimeout(() => b.textContent = o, 1400); RA.toast(v + ' copied'); };
  if (navigator.clipboard) navigator.clipboard.writeText(v).then(ok).catch(() => RA.toast(v)); else RA.toast(v);
});

/* ---------------------------------------------------------------- Sir Fazil’s Assistant answers */
(function () {
  const { SYL, PMETA, PRODUCTS, DEFS, DATES, PASSAGES, HADITHS } = D;
  let ctx = { lvl: null }; try { ctx = JSON.parse(sessionStorage.getItem('ilm-bot-ctx') || '{"lvl":null}'); } catch (e) { }
  const save = () => { try { sessionStorage.setItem('ilm-bot-ctx', JSON.stringify(ctx)); } catch (e) { } };
  const PCODE = { ol: '2058', ig: '0493' }, LNAME = { ol: 'O Level Islamiyat 2058', ig: 'IGCSE Islamiyat 0493' };
  const IG = C.instagram, YT = C.youtube;
  const norm = s => (' ' + s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9*\s'.×+%-]/g, ' ').replace(/\s+/g, ' ') + ' ');
  function lev(a, b) { if (Math.abs(a.length - b.length) > 1) return 9; const m = [...Array(a.length + 1)].map((_, i) => [i]); for (let j = 1; j <= b.length; j++) m[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return m[a.length][b.length]; }
  function has(q, words) { const tok = q.trim().split(' '); let s = 0; for (const w of words) { if (w.includes(' ')) { if (q.includes(' ' + w + ' ') || q.includes(w)) s += w.length + 3; } else if (q.includes(' ' + w + ' ')) s += w.length + 2; else if (w.length >= 5 && tok.some(t => t.length >= 4 && lev(t, w) <= 1)) s += w.length; } return s; }
  const lvlFrom = q => { const ig = /0493|igcse/.test(q), ol = /2058|o ?level|o-level|\bol\b/.test(q); return ig && ol ? null : ig ? 'ig' : ol ? 'ol' : null; };
  const acts = arr => '<div class="mrow">' + arr.map(([t, h, x]) => x === 'btn' ? '<button class="chip" type="button" ' + h + '>' + esc(t) + '</button>' : '<a class="btn btn-xs' + (x === 1 && /wa\.me/.test(h) ? ' btn-pri' : '') + '" href="' + esc(h) + '"' + (x ? ' target="_blank" rel="noopener"' : '') + '>' + (x === 1 && /wa\.me/.test(h) ? WA_ICO + ' ' : '') + esc(t) + '</a>').join('') + '</div>';
  const L = () => ctx.lvl;
  const fmt = BIZ.fmt;
  const dur = m => Math.floor(m / 60) ? Math.floor(m / 60) + 'h' + (m % 60 ? ' ' + m % 60 + 'm' : '') : m + 'm';
  const places = (C.campuses || []).map(c => '<b>' + esc(c.name) + '</b>').join(', ');
  const contactBtn = (t, msg) => C.whatsapp ? [t, wa(msg), 1] : (IG ? ['DM on Instagram', IG, 1] : ['Contact page', 'contact.html']);
  const passageCard = p => '<b>Passage ' + p.n + ' · Sura ' + p.ref + '</b> <span class="muted">' + esc(p.sura) + ' · ' + esc(p.g) + '</span><br><b>' + esc(p.t) + '</b><ul>' + p.th.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><span class="muted">Importance today:</span> ' + esc(p.imp) + acts([['Open in syllabus', 'syllabus.html#ol-1.' + p.n], ['Drill the passages', 'lab.html#passages']]);
  const hadithCard = h => '<b>Hadith ' + h.n + ': ' + esc(h.t) + '</b> <span class="muted">· ' + esc(h.g) + '</span><br>' + esc(h.s) + '<br><span class="muted">Lesson:</span> ' + esc(h.les) + acts([['Open in syllabus', 'syllabus.html#ol-5.' + h.n], ['Hadith flashcards', 'lab.html#hadith']]);
  const INT = [
    { k: ['hi', 'hello', 'salam', 'assalam', 'aoa', 'hey', 'salaam'], a: () => 'Wa alaikum assalam! Ask me a key term (“define tawhid”), a passage (“passage 12” or “sura 93”), a Hadith (“hadith 5”), a date (“when was Badr”), your zakat (“zakat 500000 nisab 150000”), paper timings, or how to order notes. Which course are you on?' + acts([['O Level 2058', 'data-say="I\'m in O Level"', 'btn'], ['IGCSE 0493', 'data-say="I\'m doing IGCSE"', 'btn']]) },
    { k: ["i'm in", 'im in', 'doing', 'studying', 'i am in', 'my level', 'i study'], a: q => { const l = lvlFrom(q); if (!l) return 'Which one: O Level 2058 or IGCSE 0493? The content is the same; only the grading differs.'; ctx.lvl = l; save(); return 'Got it, <b>' + LNAME[l] + '</b>. Try “what\'s in paper 2”, “passage 5”, “define ijma” or “notes”.' + acts([['Syllabus', 'syllabus.html#' + l], ['Past papers', 'past-papers.html'], ['Notes', 'notes.html']]); } },
    { k: ['fees', 'fee', 'price of class', 'cost of class', 'charges', 'kitni', 'paisay', 'price', 'prices'], a: () => 'Fees and notes prices depend on the batch, the centre and the format, so Sir Fazil’s team quotes them directly. Send your course and exam session.' + acts([contactBtn('Ask about fees', 'Assalam o Alaikum Sir, what are the fees for your ' + (L() ? LNAME[L()] : 'Islamiyat') + ' classes?'), ['Enrol form', 'contact.html#enrol']]) },
    { k: ['timings', 'timing', 'batch', 'schedule', 'days', 'class time', 'waqt', 'kab'], a: () => 'Batch timings change every session and differ by centre. Send your course and area for this session’s schedule.' + acts([contactBtn('Ask timings', 'Assalam o Alaikum Sir, what are the current batch timings' + (L() ? ' for ' + LNAME[L()] : '') + '?')]) },
    { k: ['where', 'location', 'address', 'campus', 'centre', 'center', 'academy', 'school', 'institute'], a: () => 'Evenings: <b>TP Core</b> in Jauhar and Gulshan, <b>TP Core / TCR</b> in North Nazimabad, <b>TP Core / Burraq</b> in Defence and <b>Maniya’s</b> in Bahadurabad. Online: Forte, Gives and Max Academy. Mornings he teaches at Head Start, Froebel’s, Credo School and The Academy.' + acts([['Where he teaches', 'about.html#schools']]) },
    { k: ['online', 'zoom', 'abroad', 'remote', 'outside karachi', 'recorded', 'recording', 'missed', 'noon', 'learnedguys', 'course online'], a: () => 'Yes. There are live online batches through Forte, Gives and Max Academy for students across Pakistan and abroad, and a full <b>topical recorded course</b> for 2058 and 0493 (about 54 hours, taught in Urdu) that you can watch at your own pace. His YouTube channel has free lessons too.' + acts([['Recorded course', C.recordedCourse || 'courses.html#rec', 1], ['YouTube', YT || 'about.html', YT ? 1 : 0]]) },
    { k: ['crash', 'revision', 'workshop', 'seminar', 'last minute'], a: () => 'Ask about this session’s revision and crash classes. New batches are announced on his Instagram first.' + acts([IG ? ['Instagram', IG, 1] : ['Contact', 'contact.html'], contactBtn('Ask about revision', 'Assalam o Alaikum Sir, are there revision or crash classes this session?')]) },
    { k: ['instagram', 'insta', 'youtube', 'social', 'videos', 'reel', 'lectures', 'channel'], a: () => 'Follow Sir Fazil on Instagram for batch updates, on YouTube for free Islamiyat lessons, and join his WhatsApp channel for tips and resources.' + acts([IG ? ['Instagram', IG, 1] : null, YT ? ['YouTube', YT, 1] : null, C.whatsappChannel ? ['WhatsApp channel', C.whatsappChannel, 1] : null].filter(Boolean)) },
    { k: ['notes', 'buy', 'book', 'books', 'material', 'store', 'shop', 'order', 'which notes'], a: () => { const ps = PRODUCTS.slice(0, 4); return 'From the notes store:<ul>' + ps.map(p => '<li>' + esc(p.t) + ' · printed or PDF</li>').join('') + '</ul>Start with the notes for the paper you find harder, then the passages and Hadiths booklets for Question 1 of each paper. Prices are confirmed when you order.' + acts([...ps.slice(0, 2).map(p => ['Add ' + p.t, 'data-add="' + p.id + '" data-f="print"', 'btn']), ['Open store', 'notes.html']]); } },
    { k: ['cart', 'checkout', 'my order'], a: () => 'Your cart has ' + (RA.cart ? RA.cart.items().reduce((a, b) => a + b.q, 0) : 0) + ' item(s).' + acts([['Open cart', 'data-open-cart', 'btn']]) },
    { k: ['past paper', 'past papers', 'pastpapers', 'papers', 'question paper', 'specimen'], a: q => { const l = lvlFrom(q) || L() || 'ol'; const c = PCODE[l]; const y = (q.match(/20(1\d|2\d)/) || [])[0]; return 'Past papers for <b>' + c + '</b>' + (y ? ' ' + y : '') + ' open beside their mark schemes, examiner reports and grade thresholds, and the tracker logs every score.' + acts([['Open ' + c + (y ? ' ' + y : ''), 'past-papers.html#p-' + c + (y ? '-' + y : '')]]); } },
    { k: ['mark scheme', 'marking scheme', 'ms', 'answers', 'examiner report', 'er', 'levels'], a: () => 'Every question paper sits beside its mark scheme (MS). Islamiyat is marked in <b>levels</b>: part (a) rewards accurate, detailed, well-ordered knowledge; part (b) rewards a clear explanation of significance. The examiner report (ER) says exactly where marks were lost.' + acts([['Past papers', 'past-papers.html']]) },
    { k: ['timer', 'time myself', 'timed', 'stopwatch', 'countdown'], a: q => { const l = lvlFrom(q) || L() || 'ol'; const c = PCODE[l]; const p = (q.match(/paper\s*([12])|\bp([12])\b/) || []).slice(1).find(Boolean) || '1'; const pm = PMETA[c].papers[p]; return 'A timed ' + c + ' Paper ' + p + ' runs <b>' + dur(pm.min) + '</b>: about 15 minutes for Question 1 and 25 for each 14-mark question.' + acts([['Start ' + c + ' P' + p + ' timer', 'past-papers.html#t-' + c + '-' + p]]); } },
    { k: ['duration', 'how long', 'marks', 'weight', 'weighting', 'paper 1', 'paper 2', 'p1', 'p2', 'how many questions', 'structure', 'pattern'], a: q => { const l = lvlFrom(q) || L() || 'ol'; const c = PCODE[l]; const pn = (q.match(/paper\s*([12])|\bp([12])\b/) || []).slice(1).find(Boolean); const M = PMETA[c];
      const body = { 1: 'Question 1: two of three Qur\'anic passages (8 marks). Question 2: history and importance of the Qur\'an (14). Then two of Questions 3–5 on the life of the Prophet and the first Islamic community (14 each).', 2: 'Question 1: two of four Hadiths (8 marks). Question 2: history and importance of the Hadiths (14). Then two of Questions 3–5 on the Rightly Guided Caliphs and the Articles of Faith and Pillars of Islam (14 each).' };
      if (pn) { const p = M.papers[pn]; return '<b>' + c + ' Paper ' + pn + ' · ' + esc(p.n) + '</b><br>' + dur(p.min) + ' · ' + p.m + ' marks · ' + p.w + '<br>' + body[pn] + acts([['Timed attempt', 'past-papers.html#t-' + c + '-' + pn]]); }
      return '<b>' + M.name + ' (' + c + ')</b><ul>' + Object.entries(M.papers).map(([n, p]) => '<li>Paper ' + n + ': ' + esc(p.n) + ' · ' + dur(p.min) + ' · ' + p.m + ' marks · ' + p.w + '</li>').join('') + '</ul>Both papers are compulsory. In each, you answer Questions 1 and 2 and two others.'; } },
    { k: ['difference', 'o level or igcse', 'igcse or o level', '2058 vs 0493', '0493 vs 2058', 'same syllabus'], a: () => 'O Level <b>2058</b> and IGCSE <b>0493</b> have the same two papers and the same content. O Level is graded A*–E and IGCSE A*–G, and you cannot sit both in the same series. Your school or exam centre decides which one you enter.' + acts([['Compare them', 'courses.html#ig']]) },
    { k: ['topic', 'chapter', 'unit', 'syllabus', 'topics', 'content'], a: q => { const l = lvlFrom(q) || L() || 'ol'; const d = SYL[l]; const n = (q.match(/(?:topic|unit|chapter)\s*(\d{1,2}(?:\.\d{1,2})?)/) || [])[1];
      if (n) { const t = d.topics.find(x => x.n === n); if (t) return '<b>' + d.short + ' · ' + t.n + ' ' + esc(t.t) + '</b><ul>' + t.k.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' + acts([['Open in syllabus', 'syllabus.html#' + l + '-' + t.n]]);
        const u = +n; if (d.units[u]) return '<b>' + d.short + ' · Unit ' + u + ': ' + esc(d.units[u]) + '</b> (Paper ' + D.PAPER_OF(u) + ')<ul>' + d.topics.filter(x => x.u === u).slice(0, 12).map(x => '<li>' + x.n + ' ' + esc(x.t) + '</li>').join('') + '</ul>' + acts([['Open syllabus', 'syllabus.html#' + l]]); }
      return '<b>' + d.label + '</b> has ' + Object.keys(d.units).length + ' units and ' + d.topics.length + ' topics, including all 15 passages and 20 Hadiths. Ask “what\'s in unit 7” or open the tracker.' + acts([['Open syllabus', 'syllabus.html#' + l]]); } },
    { k: ['command word', 'command words', 'describe', 'outline', 'write an account', 'give an account', 'narrate', 'explain', 'discuss'], a: () => '<b>Read the command word first.</b><ul><li><b>Outline / Describe / Write an account</b> (part a): the events or teachings in order, with names, dates and numbers.</li><li><b>Explain the importance / significance</b> (part b): why it matters to Muslims, with a reason.</li><li><b>What lessons can Muslims learn</b> (part b): a lesson for today, with an example from life now.</li><li><b>Discuss</b>: more than one point of view or more than one reason, developed.</li></ul>' + acts([['See the mark ladder', 'index.html#ladder']]) },
    { k: ['part b', 'b part', '4 mark', 'four mark', 'significance', 'lessons', 'evaluation', 'a*', 'a star', 'high marks', 'technique', 'tips'], a: () => 'Part (a) is 10 marks for <b>knowledge</b>: a full, accurate, ordered account with names, dates and Qur\'an or Hadith references. Part (b) is 4 marks for <b>understanding</b>: don\'t repeat history, explain what it means for a Muslim today and give a real example from life now.' + acts([['See it step by step', 'index.html#ladder']]) },
    { k: ['zakat', 'nisab', 'zakaat'], a: () => '<b>Zakat</b> is 2.5% of savings at or above the <b>nisab</b> (the value of 87.48 g of gold or 612.36 g of silver) once they have been held for a lunar year. Give me numbers: <code>zakat 500000 nisab 150000</code>, or try the Zakat studio.' + acts([['Zakat studio', 'lab.html#zakat']]) },
    { k: ['sir fazil', 'fazil maniya', 'maniya', 'mfm', 'who is', 'about', 'teacher', 'experience', 'years'], a: () => 'Sir Mohammad Fazil Maniya is a Cambridge-certified O Level Islamiyat teacher with ' + esc(String(C.yearsTeaching || 15)) + '+ years of teaching and 7,000+ students mentored. He started with Teach For Pakistan at a government school in Gizri, is a gold medalist in BSCS from IBA Karachi with Master’s degrees in Computer Science and Islamic Studies, and became National Tenpin Bowling Champion of Pakistan in 2023.' + acts([['About Sir Fazil', 'about.html']]) },
    { k: ['contact', 'number', 'phone', 'call', 'whatsapp', 'dm'], a: () => (C.whatsapp ? 'WhatsApp <b>' + esc(C.phoneDisplay) + '</b>' + (IG ? ', or DM him on Instagram.' : '.') : 'DM Sir Fazil on Instagram or use the enrolment form.') + acts([C.whatsapp ? ['WhatsApp', wa("Assalam o Alaikum Sir, I'd like to ask about your Islamiyat classes."), 1] : null, IG ? ['Instagram', IG, 1] : null, ['Enrol form', 'contact.html#enrol']].filter(Boolean)) },
    { k: ['enrol', 'enroll', 'admission', 'join', 'register', 'seat', 'admit'], a: () => 'Seats fill fast. Fill the enrol form and your message opens ready to send.' + acts([['Enrol now', 'contact.html#enrol']]) },
    { k: ['grade', 'grades', 'result', 'threshold'], a: q => { const l = lvlFrom(q) || L(); return l ? PMETA[PCODE[l]].name + ' is graded <b>' + PMETA[PCODE[l]].grades + '</b>. Grade thresholds for each session sit next to its papers.' : 'O Level Islamiyat 2058 is graded A*–E. IGCSE Islamiyat 0493 is graded A*–G.'; } },
    { k: ['passage', 'passages', 'quranic passage', 'ayat', 'surah', 'sura', 'theme', 'themes'], a: () => '<b>Paper 1 Question 1</b> sets three of these 15 passages and you answer two: the themes (4 marks) and their importance (4 marks). Ask “passage 1” to “passage 15”, or “sura 93”.<ul>' + ['God in Himself', 'God\'s relationship with the created world', 'God\'s Messengers'].map((g, i) => '<li><b>' + g + '</b>: ' + PASSAGES.filter(p => p.g === g).map(p => p.ref).join(', ') + '</li>').join('') + '</ul>' + acts([['Drill the passages', 'lab.html#passages']]) },
    { k: ['hadith', 'hadiths', 'ahadith'], a: () => '<b>Paper 2 Question 1</b> sets four of these 20 Hadiths and you answer two: the teaching (4 marks) and how Muslims act on it (4 marks). Ask “hadith 1” to “hadith 20”.' + acts([['Hadith flashcards', 'lab.html#hadith'], ['See all 20', 'syllabus.html#ol-5.1']]) },
    { k: ['thanks', 'thank you', 'shukriya', 'jazakallah', 'jazak'], a: () => 'Wa iyyakum. May Allah make your exam easy!' }
  ];
  /* Sura and passage lookups */
  function passage(q) {
    let m = q.match(/passage\s*(\d{1,2})\b/); if (m) { const p = PASSAGES.find(x => x.n === +m[1]); if (p) return passageCard(p); }
    m = q.match(/sura?h?\s*(\d{1,3})(?:[.: ](\d{1,3}))?/); if (m) { const s = m[1], v = m[2]; const p = PASSAGES.find(x => x.ref.split('.')[0] === s && (!v || x.ref.includes('.' + v) || x.ref.split('.')[1] && +v >= +x.ref.split('.')[1].split('–')[0] && +v <= +(x.ref.split('–')[1] || x.ref.split('.')[1]))); if (p) return passageCard(p); }
    if (/kursi|kursee/.test(q)) return passageCard(PASSAGES[0]);
    const nm = PASSAGES.find(p => { const k = p.sura.toLowerCase().replace(/^al-|\s*\(.*\)/g, '').replace(/[^a-z]/g, ''); return k.length > 3 && q.replace(/[^a-z]/g, '').includes(k); });
    if (nm && /sura|surah|passage|ikhlas|fatiha|duha|kawthar|zalzala|alaq|nas\b/.test(q)) return passageCard(nm);
    return null;
  }
  function hadith(q) { const m = q.match(/hadith\s*(?:no\.?|number)?\s*(\d{1,2})\b/); if (!m) return null; const h = HADITHS.find(x => x.n === +m[1]); return h ? hadithCard(h) : null; }
  /* "when was Badr", "hijra date" */
  const DATE_KEYS = [['badr', 'Badr'], ['uhud', 'Uhud'], ['trench', 'Trench'], ['khandaq', 'Trench'], ['hijra', 'Hijra'], ['hijrah', 'Hijra'], ['hudaybiyya', 'Hudaybiyya'], ['hudaibiya', 'Hudaybiyya'], ['conquest', 'Conquest'], ['makka', 'Conquest'], ['farewell', 'Farewell'], ['yamama', 'Yamama'], ['yarmuk', 'Yarmuk'], ['qadisiyya', 'Qadisiyya'], ['siffin', 'Siffin'], ['camel', 'Camel'], ['sorrow', 'Sorrow'], ['abyssinia', 'Abyssinia'], ['boycott', 'Boycott'], ['miraj', "Mi'raj"], ['isra', 'Isra'], ['aqaba', 'Aqaba'], ['first revelation', 'First revelation'], ['birth', 'Birth'], ['born', 'Birth'], ['hijri calendar', 'Hijri calendar'], ['khadija', 'Khadija'], ['death of the prophet', 'death of the Prophet']];
  function when(q) { if (!/when|date|year|kab/.test(q) && !DATE_KEYS.some(([k]) => q.includes(' ' + k + ' '))) return null; const hit = DATE_KEYS.find(([k]) => q.includes(k)); if (!hit) return null; const rows = DATES.filter(d => d[2].toLowerCase().includes(hit[1].toLowerCase())); if (!rows.length) return null;
    return rows.map(d => '<b>' + d[0] + (d[1] ? ' CE · ' + d[1] : '') + '</b>: ' + esc(d[2])).join('<br>') + '<br><span class="muted">Syllabus topic ' + rows[0][3] + '</span>' + acts([['Open the topic', 'syllabus.html#ol-' + rows[0][3]], ['Timeline drill', 'lab.html#timeline']]); }
  function define(q) { const m = q.match(/(?:define|definition of|what is an?|what is|what are|meaning of|whats|who are the)\s+([a-z\s'-]{3,40})/); const term = (m ? m[1] : q).trim().replace(/\?$/, '').replace(/\s+/g, ' ').replace(/'/g, '');
    let best = null, bs = 0; for (const d of DEFS) { const k = d[0].toLowerCase().replace(/'/g, ''); let s = 0; if (term === k) s = 100; else if (term.includes(k)) s = k.length + 10; else if (k.includes(term) && term.length > 4) s = term.length; else if (lev(term, k) <= 2 && k.length > 5) s = 6; if (s > bs) { bs = s; best = d; } }
    if (best && bs >= 6 && (m || bs >= 50)) return '<b>' + best[0] + '</b>: ' + best[1] + '.<br><span class="muted">Syllabus topic ' + best[2] + ' · now use it in an answer with an example</span>' + acts([['Drill key terms', 'lab.html#terms']]); return null; }
  const num = (q, re) => { const m = q.match(re); return m ? parseFloat(m[1].replace(/,/g, '')) : null; };
  function calc(raw) { const q = ' ' + raw.toLowerCase().replace(/rs\.?|pkr|\$/g, '') + ' ';
    if (/zaka/.test(q)) { const n = num(q, /nisab\s*[:=]?\s*([\d,.]+)/); const w = num(q, /(?:zakat|zakaat|wealth|savings|have)\s*(?:on|of|for)?\s*[:=]?\s*([\d,.]+)/);
      if (w != null) { if (n != null && w < n) return 'Your wealth of <b>Rs ' + fmt(w) + '</b> is below the nisab of Rs ' + fmt(n) + ', so <b>no zakat is due</b> on it this year.' + acts([['Zakat studio', 'lab.html#zakat']]);
        return '<b>Zakat</b> = ' + fmt(w) + ' × 2.5% = <b>Rs ' + fmt(Math.round(w * 0.025)) + '</b>' + (n == null ? '<br><span class="muted">Due only if this is at or above the nisab and has been held for a lunar year. Add “nisab 150000” to check.</span>' : '') + acts([['Zakat studio', 'lab.html#zakat']]); } }
    return null; }
  RA.botAnswer = function (raw) {
    const q = norm(raw); const l = lvlFrom(q); if (l && l !== ctx.lvl && !/i'?m in|doing|studying/.test(q)) { ctx.lvl = l; save(); }
    const c = calc(raw); if (c) return c;
    const p = passage(q); if (p) return p;
    const h = hadith(q); if (h) return h;
    const w = when(q); if (w) return w;
    if (/define|definition|what is|what are|meaning of|whats /.test(q)) { const d = define(q); if (d) return d; }
    let best = null, bs = 0; for (const it of INT) { const s = has(q, it.k); if (s > bs) { bs = s; best = it; } }
    if (best) return best.a(q);
    const d = define(q); if (d) return d;
    return 'I don’t have that one saved yet. Ask Sir Fazil directly; your question is already filled in.' + acts([contactBtn('Ask Sir Fazil', 'Assalam o Alaikum Sir, I have an Islamiyat question: ' + raw)]);
  };
  RA.botChips = function () { const c = ctx.lvl ? PCODE[ctx.lvl] : null; return c ? ['Define ijma', 'Passage 14', 'Hadith 16', c + ' past papers', 'How do I answer part (b)?'] : ['Define tawhid', 'When was Badr?', 'Sura 112', 'Command words', '2058 vs 0493', 'Fees', 'Notes']; };
})();
})();

/* ---------------------------------------------------------------- BIZ facade
   The page tools were written against a BIZ object; this maps it onto RA so they run unchanged. */
(function () {
  const RA = window.RA, D = RA.DATA, C = RA.C, S = RA.Snd;
  ['step', 'swap', 'plop'].forEach(k => { if (!S[k]) S[k] = () => S.soft(); });
  if (!S.type) S.type = () => S.tick();
  const B = window.BIZ = Object.assign({}, D, {
    $: RA.$, $$: RA.$$, store: RA.store, esc: RA.esc, RM: RA.RM, FINE: RA.FINE,
    wa: t => C.waUrl(t), WA_DISPLAY: C.phoneDisplay, IG: C.instagram,
    Snd: S, toast: (m, ms) => RA.toast(m, ms), modal: h => RA.modal(h), closeModal: () => RA.closeModal(),
    fmt: RA.BIZ.fmt,
    money: n => 'Rs ' + Number(n).toLocaleString('en-PK'),
    pulse: () => { try { RA.BG && RA.BG.pulse && RA.BG.pulse(); } catch (e) { } },
    ready: fn => RA.page(fn), lock: v => RA.lock(v), go: t => RA.go(t)
  });
  Object.defineProperty(B, 'bot', { get: () => RA.bot });
  Object.defineProperty(B, 'cart', { get: () => RA.cart });
  Object.defineProperty(B, 'lenis', { get: () => RA.lenis });
})();

/* =========================================================================
   MFM upgrades on top of the engine: motion buttons, the "More" menu,
   the installable app, reviews from config. Runs after RA.boot.
   ========================================================================= */
(function () {
'use strict';
const RA = window.RA, C = RA.C || {}, $ = RA.$, $$ = RA.$$, esc = RA.esc;

/* ---------- motion buttons: rolling label, arrow that slides through, colour flood ---------- */
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const SKIP = '.btn-xs,[data-plain],.chip,.mrow .btn,.nxb .btn,.wi-btns .btn';
function enhanceBtn(b) {
  if (!b || !b.matches || !b.matches('.btn') || b.matches(SKIP)) return;
  if (b.classList.contains('btn-x') && b.querySelector(':scope > .btn-l')) return;
  [...b.querySelectorAll(':scope > .btn-sheen, :scope > .rip')].forEach(x => x.remove());
  if (b.querySelector(':scope > :not(svg)') && !b.classList.contains('btn-x')) return; /* buttons that hold a badge or other markup stay as they are */
  const svg = b.querySelector(':scope > svg.ic') || b.querySelector(':scope > svg'), label = b.textContent.trim().replace(/\s+/g, ' ');
  if (!label) return;
  const icon = svg ? svg.outerHTML.replace(/class="[^"]*"/, '') : ARROW, e = esc(label);
  b.innerHTML = '<span class="btn-l"><span>' + e + '</span><span aria-hidden="true">' + e + '</span></span><span class="btn-fill" aria-hidden="true"></span><span class="btn-i" aria-hidden="true">' + icon + icon + '</span>';
  b.classList.add('btn-x');
}
RA.enhanceBtns = scope => $$('.btn', scope || document).forEach(enhanceBtn);
function start() {
  RA.enhanceBtns();
  /* new buttons (lists, modals, the bot) and buttons whose text a script just changed */
  new MutationObserver(ms => ms.forEach(m => {
    if (m.target.nodeType === 1 && m.target.classList && m.target.classList.contains('btn-x') && !m.target.querySelector(':scope > .btn-l')) enhanceBtn(m.target);
    m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.matches('.btn')) enhanceBtn(n); if (n.querySelectorAll) n.querySelectorAll('.btn').forEach(enhanceBtn); });
  })).observe(document.body, { childList: true, subtree: true });
}

/* ---------- "More" in the nav ---------- */
function more() {
  const w = $('.nav-more'); if (!w) return;
  const b = $('button', w), p = $('.nav-drop', w);
  const set = v => { w.classList.toggle('open', v); b.setAttribute('aria-expanded', String(v)); };
  b.addEventListener('click', e => { e.stopPropagation(); set(!w.classList.contains('open')); });
  document.addEventListener('click', e => { if (!w.contains(e.target)) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  p.addEventListener('focusout', e => { if (!w.contains(e.relatedTarget)) set(false); });
}

/* ---------- installable app: Android / desktop prompt, iPhone instructions ---------- */
let deferred = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; });
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const ios = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
RA.installApp = function () {
  if (standalone()) { RA.toast('The app is already installed on this device'); return; }
  if (deferred) { deferred.prompt(); deferred.userChoice.finally(() => { deferred = null; hideCard(); }); return; }
  RA.modal('<span class="lbl">Get the app</span><h2 id="mTitle" style="font-size:clamp(26px,3.2vw,34px);margin:8px 48px 12px 0">Sir Fazil’s Islamiyat app</h2>'
    + (ios() ? '<ol class="sub-list"><li><span>1</span>Open this site in Safari.</li><li><span>2</span>Tap the Share button at the bottom of the screen.</li><li><span>3</span>Choose “Add to Home Screen”, then “Add”.</li></ol>'
      : '<ol class="sub-list"><li><span>1</span>Open this site in Chrome or Edge, on your phone or laptop.</li><li><span>2</span>Open the browser menu (⋮).</li><li><span>3</span>Choose “Install app” or “Add to Home screen”.</li></ol>')
    + '<p class="small muted" style="margin-top:14px">The app opens full screen, works on Android, iPhone and desktop, and keeps the pages you have opened for when the internet drops.</p>');
};
function hideCard() { const c = $('#appCard'); if (c) c.classList.remove('show'); }
function appCard() {
  $$('[data-install]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); RA.installApp(); }));
  if (standalone()) return;
  let until = 0; try { until = +localStorage.getItem('mfm-app-later') || 0; } catch (e) { }
  if (Date.now() < until) return;
  const card = document.createElement('div'); card.className = 'app-card'; card.id = 'appCard'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Get the app');
  card.innerHTML = '<span class="seal" aria-hidden="true"><b>MFM</b></span><div><b>Get the app</b><small>On your home screen</small></div><button class="btn btn-sm btn-pri" type="button" id="appYes">Install</button><button class="xbtn" type="button" id="appNo" aria-label="Not now">×</button>';
  document.body.appendChild(card);
  $('#appYes').addEventListener('click', () => RA.installApp());
  $('#appNo').addEventListener('click', () => { hideCard(); try { localStorage.setItem('mfm-app-later', String(Date.now() + 7 * 864e5)); } catch (e) { } });
  /* only after the visitor has looked around */
  let shown = false; const go = () => { if (shown) return; shown = true; card.classList.add('show'); };
  setTimeout(() => { if (scrollY > innerHeight * 1.2) go(); else addEventListener('scroll', function f() { if (scrollY > innerHeight * 1.2) { go(); removeEventListener('scroll', f); } }, { passive: true }); }, 20000);
}
if ('serviceWorker' in navigator && location.protocol === 'https:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));

/* ---------- reviews from config (nothing invented: an empty list hides the section) ---------- */
RA.reviewCard = r => '<figure class="rv-card card"><blockquote>“' + esc(r.text) + '”</blockquote><figcaption><b>' + esc(r.name) + '</b>' + (r.meta ? '<small>' + esc(r.meta) + '</small>' : '') + '</figcaption></figure>';
function reviews() {
  const R = (C.REVIEWS || []).filter(r => r && r.text);
  $$('[data-reviews]').forEach(sec => {
    const host = $('[data-reviews-list]', sec), n = +sec.dataset.reviews || 5;
    if (!R.length) { if (sec.dataset.empty !== 'keep') sec.hidden = true; return; }
    if (host) host.innerHTML = R.slice(0, n).map(RA.reviewCard).join('');
  });
}

/* ---------- sign-in (front end only until the backend is connected) ----------
   Any ID in the right shape opens a preview session on this device. The backend
   will replace check() with a real call; nothing else needs to change. */
const KEY = 'mfm-session';
RA.auth = {
  get() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } },
  set(v) { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch (e) { } },
  out() { RA.auth.set(null); },
  check(id, pw) { id = String(id || '').trim().toUpperCase(); if (!/^MFM-?\d{3,6}$/.test(id)) return 'Enter your student ID, like MFM-1024.'; if (String(pw || '').length < 4) return 'Enter your password.'; return null; }
};
RA.signIn = function (done) {
  RA.modal('<span class="lbl">Student portal</span><h2 id="mTitle" style="font-size:clamp(26px,3.2vw,34px);margin:8px 48px 14px 0">Student sign in</h2>'
    + '<form class="stack si-form" id="siForm" novalidate><div class="field"><label for="siId">Student ID</label><input id="siId" placeholder="MFM-1024" autocomplete="username" autocapitalize="characters" spellcheck="false"></div>'
    + '<div class="field"><label for="siPw">Password</label><input id="siPw" type="password" autocomplete="current-password"></div><p class="ferr" id="siErr" role="alert"></p>'
    + '<button class="btn btn-pri btn-block" type="submit">Sign in</button><p class="small muted">Your ID and password come from Sir Fazil’s team when you register. <a href="index.html#register">Get a login</a></p></form>');
  setTimeout(() => { const i = $('#siId'); if (i) i.focus(); }, 80);
  $('#siForm').addEventListener('submit', e => { e.preventDefault(); const id = $('#siId').value, bad = RA.auth.check(id, $('#siPw').value);
    if (bad) { $('#siErr').textContent = bad; RA.Snd && RA.Snd.err(); return; }
    const v = { id: id.trim().toUpperCase().replace(/^MFM-?/, 'MFM-'), name: 'Student', since: Date.now() }; RA.auth.set(v); RA.closeModal(); RA.Snd && RA.Snd.chime(); RA.toast('Signed in as ' + v.id); if (done) done(v); });
};


/* ---------- theme + sound dock, bottom-left (the same switch as the Xahid campus) ----------
   White is the default. The new theme opens as a circle from the switch where the browser can do it. */
function tdock() {
  const root = document.documentElement, Snd = RA.Snd;
  const d = document.createElement('div');
  d.className = 'tdock'; d.setAttribute('role', 'group'); d.setAttribute('aria-label', 'Theme and sound');
  d.innerHTML = '<button type="button" class="tpill" role="switch" aria-checked="false" aria-label="Green theme"><span class="tpill-lab tpill-l">White<br>theme</span><span class="tpill-lab tpill-d">Green<br>theme</span><span class="tpill-k" aria-hidden="true"><i></i></span></button>'
    + '<button type="button" class="tsnd" aria-pressed="false" aria-label="Sound"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4z" fill="currentColor" fill-opacity=".18"/><path class="wv" d="M15.4 9.6a3.4 3.4 0 0 1 0 4.8"/><path class="wv" d="M17.9 7.1a6.9 6.9 0 0 1 0 9.8"/><path class="slash" d="M4 20 20 4"/></svg></button>';
  document.body.appendChild(d);
  /* phones: the same switch, small, inside the bottom quick bar */
  const mb = $('.mbar');
  if (mb) { const m = document.createElement('button'); m.type = 'button'; m.className = 'tpill tmini'; m.setAttribute('role', 'switch'); m.innerHTML = '<span class="tpill-k" aria-hidden="true"><i></i></span>'; const sr = $('[data-cmdk]', mb); mb.insertBefore(m, sr || null); }
  const pills = $$('.tpill'), pill = $('.tpill', d), snd = $('.tsnd', d);
  const sync = () => {
    const g = root.dataset.theme === 'dark';
    pills.forEach(p => { p.setAttribute('aria-checked', String(g)); p.setAttribute('aria-label', g ? 'Switch to the White theme' : 'Switch to the Green theme'); });
    if (Snd) { snd.setAttribute('aria-pressed', String(!!Snd.on)); snd.setAttribute('aria-label', Snd.on ? 'Sound on' : 'Sound off'); }
  };
  pills.forEach(pill => pill.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { RA.theme(t); sync(); };
    if (!document.startViewTransition || RA.RM) return apply();
    const r = $('.tpill-k', pill).getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] }, { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
  }));
  snd.addEventListener('click', () => { if (!Snd) return; Snd.set(!Snd.on); sync(); if (Snd.on && Snd.tick) Snd.tick(); });
  /* the navbar's theme button runs the same switch, with the reveal starting from the button itself */
  $$('.nav-theme').forEach(b => b.addEventListener('click', () => { const t = root.dataset.theme === 'dark' ? 'light' : 'dark'; const apply = () => { RA.theme(t); sync(); }; if (!document.startViewTransition || RA.RM) return apply(); const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)); const vt = document.startViewTransition(apply); vt.ready.then(() => root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] }, { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {}); }));
  sync();
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('in')));
  /* phones: steps aside while you scroll down, back on the way up; drops to the bottom when the quick bar hides */
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY, dy = y - lastY; if (Math.abs(dy) < 6) return;
    if (innerWidth <= 760) d.classList.toggle('away', dy > 0 && y > 220);
    lastY = y;
  }, { passive: true });
  document.addEventListener('focusin', e => { if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) d.classList.add('away'); });
}

/* ---------- logo: set C.logo in config.js and it replaces the MF monogram everywhere ---------- */
function logo() {
  const C = window.RA_CONFIG || {};
  if (!C.logo) return;
  $$('.seal').forEach(s => { s.classList.add('has-logo'); s.innerHTML = '<img src="' + C.logo + '" alt="" decoding="async">'; });
}

function boot() { start(); more(); $$('[data-install]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); RA.installApp(); })); reviews(); logo(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

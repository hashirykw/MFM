/* Islamiyat Lab data · V5 */
window.MFM = {
  /* [CE year, event] — Seerah and the Rightly Guided Caliphs */
  EVENTS: [
    [570, 'Birth of the Prophet, the Year of the Elephant'],
    [576, 'Death of Aminah, the Prophet\'s mother'],
    [578, 'Death of Abd al-Muttalib'],
    [595, 'Marriage to Khadijah'],
    [605, 'Rebuilding of the Ka\'ba and the Black Stone'],
    [610, 'First revelation in the Cave of Hira'],
    [613, 'Public preaching begins in Makka'],
    [615, 'First migration to Abyssinia'],
    [619, 'The Year of Sorrow'],
    [621, 'First Pledge of Aqaba'],
    [622, 'The Hijra to Madina'],
    [624, 'Battle of Badr'],
    [625, 'Battle of Uhud'],
    [627, 'Battle of the Trench'],
    [628, 'Treaty of Hudaybiyya'],
    [629, 'Battle of Mu\'ta'],
    [630, 'Conquest of Makka'],
    [631, 'The Year of Delegations'],
    [632, 'Farewell Pilgrimage and death of the Prophet'],
    [634, 'Umar becomes caliph'],
    [636, 'Battle of Yarmuk'],
    [644, 'Martyrdom of Umar; Uthman becomes caliph'],
    [656, 'Martyrdom of Uthman; Ali becomes caliph'],
    [661, 'Martyrdom of Ali in Kufa'],
  ],

  /* [name, who, [points]] */
  FIGS: [
    ['Abu Bakr', 'First caliph · 632–634', ['First free adult man to accept Islam; called al-Siddiq.', 'Went with the Prophet on the Hijra and hid with him in the Cave of Thawr.', 'Fought the Ridda wars and the false prophets, ending at Yamama.', 'Had the Qur\'an gathered into one volume by Zayd ibn Thabit.']],
    ['Umar ibn al-Khattab', 'Second caliph · 634–644', ['Accepted Islam in Makka; called al-Faruq.', 'Began the Hijri calendar from the Hijra.', 'Set up the diwan, stipends and new provinces.', 'Syria, Iraq, Persia and Egypt came under Muslim rule; martyred in 644.']],
    ['Uthman ibn Affan', 'Third caliph · 644–656', ['Married two of the Prophet\'s daughters, so called Dhun-Nurayn.', 'Bought the well of Ruma for the Muslims of Madina.', 'Sent standard copies of the Qur\'an to the provinces.', 'Martyred in his house in Madina in 656.']],
    ['Ali ibn Abi Talib', 'Fourth caliph · 656–661', ['Among the very first to accept Islam, as a boy.', 'Slept in the Prophet\'s bed on the night of the Hijra.', 'Married Fatima, the Prophet\'s daughter.', 'Faced the Battle of the Camel and Siffin; martyred in Kufa in 661.']],
    ['Khadijah bint Khuwaylid', 'Wife of the Prophet', ['A respected merchant of Makka; married the Prophet in 595.', 'The first person to believe in his message.', 'Comforted him after the first revelation in 610.', 'Died in 619, the Year of Sorrow.']],
    ['Abu Talib', 'Uncle and protector', ['Raised the Prophet after Abd al-Muttalib died.', 'Protected him from the Quraysh for years of preaching.', 'Endured the boycott of Banu Hashim in the valley.', 'Died in 619, the Year of Sorrow.']],
    ['Bilal ibn Rabah', 'The first mu\'adhdhin', ['An Abyssinian slave tortured by Umayya ibn Khalaf.', 'Kept repeating "Ahad, Ahad" (God is One).', 'Freed by Abu Bakr.', 'Called the first adhan in Madina.']],
    ['Zayd ibn Haritha', 'Freed slave and adopted son', ['Freed and brought up by the Prophet.', 'The only Companion named in the Qur\'an (33:37).', 'Went with the Prophet to Ta\'if.', 'Martyred leading the army at Mu\'ta in 629.']],
    ['Mus\'ab ibn Umayr', 'The first envoy to Madina', ['Sent to Yathrib after the First Pledge of Aqaba to teach Islam.', 'Many of Madina accepted Islam through him.', 'Carried the standard at Uhud.', 'Martyred at Uhud in 625.']],
    ['Hamza ibn Abd al-Muttalib', 'The Lion of Allah', ['The Prophet\'s uncle; accepted Islam in Makka.', 'His conversion gave the Muslims strength.', 'Fought in single combat at Badr.', 'Martyred at Uhud in 625.']],
  ],

  /* answer builder: part (a) and part (b) */
  ABQ: {
    10: {
      q: 'Write about the Battle of Badr. (10)',
      guide: '<b>Part (a) · knowledge.</b> An accurate, detailed and well-ordered account. Give the cause, the battle and the result, with the evidence the examiner looks for.',
      checks: [['date', 'A date: 17 Ramadan, 2 AH (624)'], ['nums', 'Numbers: 313 against about 1,000'], ['ref', 'A Qur\'an reference, e.g. 8:9 or 3:123'], ['names', 'Names: Abu Jahl, Hamza, Ali, Abu Sufyan'], ['facts', 'Six or more developed points'], ['order', 'In order: cause, then battle, then result']],
    },
    4: {
      q: 'Was the Battle of Badr the most important event of the Prophet\'s time in Madina? Give reasons for your answer. (4)',
      guide: '<b>Part (b) · understanding.</b> Give your view, back it with a reason and an example, and weigh one other event. Not more history.',
      checks: [['opinion', 'Your view, clearly stated'], ['because', 'A reason: because, this shows'], ['example', 'An example: for example, such as'], ['other', 'Another side: however, on the other hand'], ['short', 'Kept short: 40 to 220 words']],
    },
  },

  /* [question, [correct, ...wrong], explanation] */
  QUIZ: [
    ['How many daily prayers are obligatory?', ['Five', 'Three', 'Four', 'Six'], 'Five daily prayers were made obligatory on the night of the Mi\'raj.'],
    ['What share of savings above the nisab is paid as zakat?', ['2.5%', '5%', '10%', '20%'], 'Zakat on savings is 2.5% of wealth held above the nisab for a full lunar year.'],
    ['In which month is the Hajj performed?', ['Dhul Hijjah', 'Ramadan', 'Muharram', 'Shawwal'], 'The rites of Hajj take place from the 8th to the 13th of Dhul Hijjah.'],
    ['What does Tawhid mean?', ['The oneness of God', 'The prophethood', 'The Day of Judgement', 'Divine decree'], 'Tawhid, the oneness of God, is the first article of faith.'],
    ['Which angel brought the revelation to the Prophet?', ['Jibril', 'Mika\'il', 'Israfil', 'Izra\'il'], 'Jibril brought the first revelation in the Cave of Hira in 610.'],
    ['Which surah is called "the Opening"?', ['Al-Fatiha', 'Al-Ikhlas', 'Al-Baqara', 'Al-Nas'], 'Al-Fatiha opens the Qur\'an and is recited in every unit of prayer.'],
    ['Under which caliph was the Qur\'an first gathered into one volume?', ['Abu Bakr', 'Umar', 'Uthman', 'Ali'], 'After many huffaz died at Yamama, Abu Bakr had Zayd ibn Thabit gather the Qur\'an.'],
    ['Which caliph sent standard copies of the Qur\'an to the provinces?', ['Uthman', 'Abu Bakr', 'Umar', 'Ali'], 'Uthman had copies made from the compiled text and sent them to the main cities.'],
    ['What is ijma\'?', ['The consensus of scholars', 'Reasoning by analogy', 'A collection of Hadiths', 'Personal opinion'], 'Ijma\' is agreement among scholars, a source of Islamic law after the Qur\'an and Sunna.'],
    ['What is qiyas?', ['Reasoning by analogy', 'The consensus of scholars', 'The chain of narrators', 'A type of fast'], 'Qiyas applies a ruling from the Qur\'an or Sunna to a new case with the same cause.'],
    ['Over roughly how many years was the Qur\'an revealed?', ['23', '10', '13', '40'], 'From 610 in Makka to 632 in Madina: about 23 years.'],
    ['What is the first pillar of Islam?', ['The shahada', 'Salat', 'Zakat', 'Sawm'], 'The shahada declares belief in one God and in Muhammad as His Messenger.'],
  ],

  /* [command, where it shows up, do, avoid] */
  CW: [
    ['Write about', 'Part (a) · 10 marks', 'Give a full, accurate account in order: names, dates, places and what happened, with a reference where you can.', 'Avoid opinions and summaries; these marks are for knowledge.'],
    ['Describe', 'Part (a) · 10 marks', 'Say what happened or what something is, in detail, with the key facts and the evidence for them.', 'Avoid explaining why unless the question asks.'],
    ['Briefly describe', 'Question 1 · 4 marks', 'Give the main themes or teachings of the passage or Hadith in a few accurate points.', 'Avoid a long story or a word-by-word translation.'],
    ['Why is it important', 'Part (b) · 4 marks', 'Give reasons it matters to Muslims, linking each with because or this shows.', 'Avoid retelling the history from part (a).'],
    ['Give reasons for your answer', 'Part (b) · 4 marks', 'State your view, support it with a reason and an example, and weigh another side.', 'Avoid answering with facts alone; evaluation earns these marks.'],
    ['What can Muslims learn', 'Part (b) · 4 marks', 'Draw a lesson for Muslims today and tie it to an example from life now.', 'Avoid repeating the event without a lesson.'],
  ],
};

// ============================================================
//  data.js  -  TODOS os casos do jogo (dados separados da lógica)
//
//  Marcações dentro das respostas (para a "Grammar Lens"):
//    {ps:texto}  -> Past Simple        (ex: {ps:went})
//    {pc:texto}  -> Past Continuous    (ex: {pc:was reading})
//    {cn:texto}  -> Connective         (ex: {cn:when}, {cn:because})
//
//  Campos de cada caso:
//    questionLimit   -> quantas perguntas o jogador pode fazer
//    requireEvidence -> true = na acusação o jogador também precisa apontar a PROVA
//    culprit         -> ID do culpado
//  Na resposta mentirosa:
//    lie: true       -> esta é a frase falsa
//    evidence: [...] -> provas aceitas: ID de uma pista ("power") ou
//                       uma resposta de outro suspeito ("nina-1" = Nina, pergunta de índice 1)
// ============================================================

const CASES = [
  // ==========================================================
  // CASO 1 - EASY
  // ==========================================================
  {
    id: "trophy",                                                  // identificador único
    title: "The School Trophy",                                    // nome do caso
    level: "Easy",                                                 // dificuldade
    questionLimit: 8,                                              // 8 perguntas de 12 possíveis
    requireEvidence: false,                                        // não precisa apontar a prova
    intro:                                                         // história inicial
      "Friday afternoon, Oakwood High School. The golden basketball trophy " +
      "disappeared from the gym between 3:00 and 4:00 PM. " +
      "Three people were at school. One of them is lying.",
    clues: [                                                       // fatos sempre verdadeiros
      { id: "library", text: "The school library closed early on Friday, at 2:30 PM, for cleaning." },
      { id: "gymkey",  text: "The gym was opened with a key. The gym key is kept in the teachers' room." },
      { id: "sunny",   text: "It was a sunny afternoon. The basketball team trained outside." },
    ],
    culprit: "jake",
    suspects: [
      {
        id: "coach", name: "Coach Miller", role: "Basketball Coach", avatar: "🏋️",
        questions: [
          { q: "Where were you between 3 and 4 PM?",
            a: "I {pc:was training} the girls' team outside, on the field. It {ps:was} a beautiful day." },
          { q: "Where was the gym key?",
            a: "It {ps:was} in the teachers' room, as always. I {ps:didn't take} it today." },
          { q: "Did you see anyone near the teachers' room?",
            a: "Yes. I {ps:saw} Jake there at 2:50. He {pc:was looking} around nervously." },
          { q: "Who wanted the trophy?",
            a: "Maybe Jake. He {ps:lost} the final last month {cn:and} he {ps:was} very angry with me." },
        ],
      },
      {
        id: "brown", name: "Mr. Brown", role: "Janitor", avatar: "🧹",
        questions: [
          { q: "Where were you between 3 and 4 PM?",
            a: "I {pc:was cleaning} the library from 2:30 to 4:00. {cn:That's why} it {ps:closed} early." },
          { q: "Did anyone enter the library?",
            a: "Nobody. I {ps:locked} the door {cn:because} the floor {ps:was} wet." },
          { q: "Did you hear anything strange?",
            a: "Yes. {cn:Later}, at about 3:15, I {ps:heard} the gym door. Somebody {ps:opened} it {cn:and} {ps:closed} it fast." },
          { q: "What did you do after 4 PM?",
            a: "I {ps:finished} my work {cn:and} {ps:went} home by bike." },
        ],
      },
      {
        id: "jake", name: "Jake Turner", role: "Student", avatar: "🧒",
        questions: [
          { q: "Why were you at school after 3 PM?",
            a: "I {ps:stayed} at school {cn:because} I {ps:had} a history test on Monday." },
          { q: "Where did you study?",
            a: "In the library. I {pc:was sitting} at a table near the window. It {ps:was} very quiet, {cn:so} I {ps:studied} a lot.",
            lie: true, evidence: ["library", "brown-1"] },          // MENTIRA: a biblioteca estava fechada
          { q: "Why were you near the teachers' room?",
            a: "I {pc:was looking} for my history teacher. I {ps:had} a question about the test." },
          { q: "Do you like basketball?",
            a: "I {ps:loved} it, {cn:but} I {ps:quit} the team {cn:after} we {ps:lost} the final." },
        ],
      },
    ],
  },

  // ==========================================================
  // CASO 2 - EASY
  // ==========================================================
  {
    id: "necklace",
    title: "The Blackwood Necklace",
    level: "Easy",
    questionLimit: 8,
    requireEvidence: false,
    intro:
      "Saturday night, Blackwood Mansion. Lady Blackwood's diamond necklace " +
      "disappeared from her bedroom between 8:00 and 9:00 PM. " +
      "Three people were in the house. One of them is lying.",
    clues: [
      { id: "storm", text: "A heavy storm started at 7:45 PM. It rained until midnight." },
      { id: "power", text: "The electricity went off in the whole house from 8:20 to 8:50 PM." },
      { id: "tea",   text: "A cup of tea was found in the cook's bedroom, on the second floor." },
    ],
    culprit: "victor",
    suspects: [
      {
        id: "grey", name: "Mr. Grey", role: "The Butler", avatar: "🤵",
        questions: [
          { q: "Where were you between 8 and 9 PM?",
            a: "I {pc:was working} in the dining room. I {ps:polished} the silver for tomorrow's dinner." },
          { q: "What were you doing when the lights went out?",
            a: "I {pc:was cleaning} a spoon {cn:when} everything {ps:went} dark. I {ps:found} a candle {cn:and} {ps:continued} my work." },
          { q: "Did you see anyone?",
            a: "Yes. At about 8:10 I {ps:saw} Mrs. Lee. She {pc:was carrying} a cup of tea upstairs." },
          { q: "What did you do after 9 PM?",
            a: "I {ps:heard} Lady Blackwood scream, {cn:so} I {ps:ran} to her room immediately." },
        ],
      },
      {
        id: "lee", name: "Mrs. Lee", role: "The Cook", avatar: "👩‍🍳",
        questions: [
          { q: "Where were you between 8 and 9 PM?",
            a: "I {pc:was resting} in my bedroom on the second floor. I {ps:felt} very tired after dinner." },
          { q: "What were you doing when the lights went out?",
            a: "I {pc:was reading} a novel {cn:when} the lights {ps:went} off. I {ps:used} my phone's flashlight {cn:because} I {ps:wanted} to finish the chapter." },
          { q: "Did you see anyone?",
            a: "{cn:Before} I {ps:went} upstairs with my tea, I {ps:passed} Mr. Grey in the dining room. {cn:Later}, I {ps:heard} footsteps in the corridor, {cn:but} I {ps:didn't open} the door." },
          { q: "Did you go outside tonight?",
            a: "No way! It {pc:was raining} so hard. I {ps:stayed} inside all night." },
        ],
      },
      {
        id: "victor", name: "Victor Blackwood", role: "The Nephew", avatar: "🕴️",
        questions: [
          { q: "Where were you between 8 and 9 PM?",
            a: "I {pc:was watching} a football game on TV in the living room, from 8 to 9." },
          { q: "What were you doing when the lights went out?",
            a: "Lights? I {ps:didn't notice} anything strange. I {ps:watched} the whole game {cn:without} any interruption.",
            lie: true, evidence: ["power", "grey-1", "lee-1"] },     // MENTIRA: a luz acabou
          { q: "Did you see anyone?",
            a: "No one. I {ps:was} alone the whole time, {cn:so} nobody can confirm my story. Sorry." },
          { q: "Did you go outside tonight?",
            a: "Only at 7:30. I {ps:went} to my car to get my wallet. {cn:Then} I {ps:came} back inside {cn:before} the storm." },
        ],
      },
    ],
  },

  // ==========================================================
  // CASO 3 - MEDIUM (4 suspeitos)
  // ==========================================================
  {
    id: "laptop",
    title: "The Missing Laptop",
    level: "Medium",
    questionLimit: 10,                                             // 10 de 16 possíveis
    requireEvidence: false,
    intro:
      "Friday evening, TechNova office, 5th floor. A secret prototype laptop " +
      "disappeared from the lab between 6:00 and 7:00 PM. " +
      "Four people were in the building. Find the liar!",
    clues: [
      { id: "elevator", text: "The elevator was out of service all day. A sign said: 'Please use the stairs'." },
      { id: "coffee",   text: "The coffee machine on the 5th floor was broken since Monday." },
      { id: "delivery", text: "A delivery of keyboards arrived at the reception at 6:30 PM." },
      { id: "labdoor",  text: "The lab door was not broken. Somebody opened it with a code." },
    ],
    culprit: "paul",
    suspects: [
      {
        id: "sarah", name: "Sarah Kim", role: "Developer", avatar: "👩‍💻",
        questions: [
          { q: "Where were you between 6 and 7 PM?",
            a: "I {pc:was fixing} a bug at my desk until 6:30. {cn:Then} I {ps:went} down to the reception." },
          { q: "How did you go down to the reception?",
            a: "I {ps:took} the stairs, {cn:of course}. The elevator {ps:was} broken. Five floors... my legs!" },
          { q: "Why did you go to the reception?",
            a: "A delivery {ps:arrived} at 6:30. It {ps:was} a box of new keyboards, {cn:so} I {ps:signed} for it {cn:and} {ps:carried} it upstairs." },
          { q: "Did you see anyone on the 5th floor?",
            a: "I {ps:saw} Mark near the kitchen. He {pc:was complaining} about the coffee machine." },
        ],
      },
      {
        id: "mark", name: "Mark Davis", role: "Designer", avatar: "🧑‍🎨",
        questions: [
          { q: "Where were you between 6 and 7 PM?",
            a: "I {pc:was drawing} new icons in the meeting room. I {ps:had} a deadline." },
          { q: "What were you doing in the kitchen?",
            a: "I {ps:tried} to make a coffee, {cn:but} the machine {ps:didn't work}. {cn:So} I {ps:drank} water instead." },
          { q: "When did you leave the office?",
            a: "I {ps:left} at 7:15. I {ps:walked} down five floors {cn:because} of the elevator. Terrible!" },
          { q: "Did you see anyone strange?",
            a: "{cn:While} I {pc:was walking} to the kitchen, I {ps:saw} Paul near the lab door. He {pc:was holding} a big bag." },
        ],
      },
      {
        id: "paul", name: "Paul Turner", role: "Manager", avatar: "👨‍💼",
        questions: [
          { q: "Why were you at the office so late?",
            a: "I {ps:came} back at 6:20 {cn:because} I {ps:forgot} my car keys on my desk." },
          { q: "How did you get to the 5th floor?",
            a: "I {ps:took} the elevator, {cn:as usual}. It {ps:was} very fast, {cn:so} I {ps:arrived} in one minute.",
            lie: true, evidence: ["elevator", "sarah-1", "linda-1"] }, // MENTIRA: elevador quebrado
          { q: "What did you do in the office?",
            a: "I {ps:picked up} my keys {cn:and} I {ps:left} after five minutes. Nothing else." },
          { q: "Do you know the lab door code?",
            a: "Yes, {cn:of course}. I'm the manager. {cn:But} three other people {ps:knew} it too." },
        ],
      },
      {
        id: "linda", name: "Linda Moore", role: "Cleaner", avatar: "👩‍🔧",
        questions: [
          { q: "Where were you between 6 and 7 PM?",
            a: "I {pc:was cleaning} the 4th floor until 6:45. {cn:Then} I {ps:went} up to the 5th floor." },
          { q: "How did you go up to the 5th floor?",
            a: "By the stairs. The elevator {ps:was} broken all day, {cn:so} I {ps:carried} my heavy bucket up. Ugh!" },
          { q: "Did you see anyone on the stairs?",
            a: "Yes, I {ps:saw} Sarah. She {pc:was carrying} a big box up the stairs. It {ps:looked} heavy." },
          { q: "Was the lab door open?",
            a: "Yes, {cn:and} that {ps:was} strange, {cn:because} it {ps:was} closed {cn:when} I {ps:cleaned} the lab this morning." },
        ],
      },
    ],
  },

  // ==========================================================
  // CASO 4 - MEDIUM (4 suspeitos)
  // ==========================================================
  {
    id: "bakery",
    title: "The Bakery Break-in",
    level: "Medium",
    questionLimit: 10,
    requireEvidence: false,
    intro:
      "Sunday morning, Bruno's Bakery. Someone opened the front door with a key " +
      "and stole all the money from the cash register between 6:00 and 7:00 AM. " +
      "Four people were near the bakery.",
    clues: [
      { id: "key",     text: "There was no damage on the front door. The thief used a key." },
      { id: "market",  text: "The street market on Main Street was cancelled this Sunday because of a festival." },
      { id: "sunrise", text: "The sun rose at 6:45 AM. Before that, the streets were dark." },
      { id: "hat",     text: "A green wool thread was found on the cash register." },
    ],
    culprit: "hill",
    suspects: [
      {
        id: "anna", name: "Anna Rossi", role: "Assistant Baker", avatar: "👩‍🦰",
        questions: [
          { q: "Where were you between 6 and 7 AM?",
            a: "I {pc:was sleeping} at home until 6:30. {cn:After that}, I {ps:took} the bus to work." },
          { q: "What did you find when you arrived?",
            a: "I {ps:arrived} at 7:05. The front door {ps:was} open {cn:and} the cash register {ps:was} empty!" },
          { q: "Who has a key to the bakery?",
            a: "Only Mr. Bruno {cn:and} me. {cn:But} last month Mr. Bruno {ps:gave} a spare key to his neighbor, Mr. Hill." },
          { q: "Did you see anyone near the bakery?",
            a: "Yes, I {ps:saw} Leo outside. He {pc:was locking} his bike {cn:and} {pc:was waiting} for me." },
        ],
      },
      {
        id: "leo", name: "Leo Park", role: "Delivery Boy", avatar: "🚴",
        questions: [
          { q: "Where were you between 6 and 7 AM?",
            a: "I {pc:was delivering} bread to the hotel on Oak Street." },
          { q: "What was the street like?",
            a: "It {ps:was} dark {cn:and} cold. I {ps:turned on} my bike light {cn:because} the sun {ps:didn't rise} until almost 7." },
          { q: "When did you come back to the bakery?",
            a: "I {ps:came} back at 7:00 {cn:and} {ps:waited} for Anna {cn:because} I {ps:didn't have} a key." },
          { q: "Did you see anyone near the bakery?",
            a: "Yes! {cn:While} I {pc:was riding} past the bakery at 6:15, I {ps:saw} a man near the front door. {cn:Unfortunately}, I {ps:didn't see} his face." },
        ],
      },
      {
        id: "hill", name: "Mr. Hill", role: "The Neighbor", avatar: "👴",
        questions: [
          { q: "Where were you between 6 and 7 AM?",
            a: "I {ps:left} my house at 6:00 {cn:because} I {ps:wanted} to go shopping early." },
          { q: "Where did you go shopping?",
            a: "I {pc:was buying} fresh vegetables at the street market on Main Street. There {ps:were} so many people!",
            lie: true, evidence: ["market", "rosa-2"] },             // MENTIRA: a feira foi cancelada
          { q: "Do you have a key to the bakery?",
            a: "Yes, Bruno {ps:gave} me a key {cn:because} I {ps:watered} his plants last summer. {cn:But} I {ps:didn't use} it today!" },
          { q: "When did you come back home?",
            a: "I {ps:came} back home at 7:30 {cn:and} {ps:made} breakfast. {cn:Then} I {ps:heard} the police cars." },
        ],
      },
      {
        id: "rosa", name: "Mrs. Rosa", role: "Morning Jogger", avatar: "🏃‍♀️",
        questions: [
          { q: "Where were you between 6 and 7 AM?",
            a: "I {pc:was running} in the park, {cn:like} every Sunday morning." },
          { q: "Did you pass the bakery?",
            a: "Yes, at about 6:20. A man {pc:was closing} the bakery door. He {pc:was wearing} a green wool hat." },
          { q: "Did you go to Main Street?",
            a: "Yes, at the end of my run. The street {ps:was} full of festival decorations, {cn:but} there {ps:was} no market today." },
          { q: "Do you know Mr. Hill?",
            a: "Yes, he's my neighbor. Last week he {ps:bought} a green wool hat {cn:and} {ps:showed} it to everybody." },
        ],
      },
    ],
  },

  // ==========================================================
  // CASO 5 - HARD (5 suspeitos, mentira contradiz OUTRO SUSPEITO)
  // ==========================================================
  {
    id: "train",
    title: "The Night Train Violin",
    level: "Hard",
    questionLimit: 12,                                             // só 12 de 25 perguntas!
    requireEvidence: true,                                         // precisa provar a mentira
    intro:
      "Night train from Paris to Vienna. The famous violinist Elena Vargas woke up " +
      "and her 300-year-old violin was gone from her cabin (Cabin 7). It disappeared " +
      "between 1:00 and 2:00 AM. Five passengers had a chance. Some of them look " +
      "suspicious... but only ONE is lying. Choose your questions carefully!",
    clues: [
      { id: "lights",    text: "The corridor lights in Car 2 (Cabins 7, 8 and 9) were turned off at 1:00 AM. Only small blue night lights stayed on." },
      { id: "keys",      text: "Cabin 7 was opened with a key. Only two keys open it: the conductor's master key and Elena's spare key, which her assistant keeps." },
      { id: "car3",      text: "Passengers in Car 3 said the conductor checked their tickets at about 1:30 AM." },
      { id: "cigarette", text: "A cigarette was found near the window at the end of the Car 2 corridor." },
      { id: "charger",   text: "In the morning, a phone charger with the initials 'C.M.' was found in Cabin 8." },
    ],
    culprit: "clara",
    suspects: [
      {
        id: "hans", name: "Hans Weber", role: "Conductor", avatar: "🧑‍✈️",
        questions: [
          { q: "Where were you between 1 and 2 AM?",
            a: "I {pc:was checking} tickets in Car 3 from 12:45 to 1:45. {cn:After that}, I {ps:went} back to my small office." },
          { q: "Where was your master key?",
            a: "It {ps:was} on my belt all night. I never {ps:took} it off, not even for a second." },
          { q: "Did you see anyone in Car 2?",
            a: "{cn:When} I {ps:passed} Car 2 at 12:40, everything {ps:was} quiet. Only a man {pc:was standing} near the window." },
          { q: "Did you hear anything?",
            a: "No. The train {ps:was} very noisy {cn:because} we {pc:were crossing} the mountains." },
          { q: "Who knew about the violin?",
            a: "Everybody! Miss Vargas {ps:played} it in the dining car {cn:before} dinner. All the passengers {ps:saw} it." },
        ],
      },
      {
        id: "clara", name: "Clara Moreau", role: "Elena's Assistant", avatar: "👩‍💼",
        questions: [
          { q: "Where were you between 1 and 2 AM?",
            a: "I {pc:was sleeping} in Cabin 9, next to Miss Vargas. I {ps:went} to bed at 12:30." },
          { q: "Did you leave your cabin during the night?",
            a: "No, never. I {ps:stayed} in my cabin all night {cn:and} I {ps:didn't open} the door {cn:until} 7 AM.",
            lie: true, evidence: ["nina-1", "ortega-2", "charger"] },  // MENTIRA: a cabine dela estava vazia
          { q: "Where is Elena's spare key?",
            a: "I always {ps:kept} it in my bag. It {ps:was} there this morning, {cn:so} nobody {ps:used} it." },
          { q: "Did you hear anything?",
            a: "Nothing. I {ps:took} a sleeping pill {cn:because} I {ps:couldn't} sleep on the train." },
          { q: "Did you lose anything on the train?",
            a: "Hmm... yes, my phone charger. I {ps:didn't find} it this morning. Strange." },
        ],
      },
      {
        id: "nina", name: "Nina Kowalski", role: "Journalist", avatar: "👩‍🦱",
        questions: [
          { q: "Where were you between 1 and 2 AM?",
            a: "I {pc:was writing} an article in Cabin 8. My phone battery {ps:died} at about 1:10." },
          { q: "What did you do when your battery died?",
            a: "At 1:15 I {ps:knocked} on Cabin 9 to borrow a charger. Nobody {ps:answered}, {cn:but} the door {ps:was} open. The cabin {ps:was} EMPTY, {cn:so} I {ps:took} the charger {cn:and} {ps:went} back." },
          { q: "Did you see anyone in the corridor?",
            a: "It {ps:was} dark. {cn:While} I {pc:was walking} back, I {ps:saw} a shadow near Cabin 7, {cn:but} I {ps:didn't see} the face." },
          { q: "Why didn't you tell anyone about the charger?",
            a: "I {ps:wanted} to return it in the morning. {cn:Honestly}, I {ps:felt} a little embarrassed." },
          { q: "What do you know about Elena Vargas?",
            a: "She {ps:was} angry with her assistant yesterday. {cn:During} dinner, they {ps:argued} about money." },
        ],
      },
      {
        id: "ortega", name: "Mr. Ortega", role: "Businessman", avatar: "🧔",
        questions: [
          { q: "Where were you between 1 and 2 AM?",
            a: "I {pc:was standing} at the window at the end of the corridor {cn:because} I {ps:couldn't} sleep." },
          { q: "What were you doing at the window?",
            a: "I {pc:was smoking}. I know, it's not allowed... {cn:That's why} I {ps:didn't say} anything before." },
          { q: "Did you see anyone in the corridor?",
            a: "At about 1:15 a woman {ps:came} out of Cabin 8 {cn:and} {ps:knocked} on the next door. Nobody {ps:opened}, {cn:but} she {ps:went} inside for a moment." },
          { q: "When did you go back to your cabin?",
            a: "At about 1:20. I {ps:finished} my cigarette {cn:and} {ps:went} to bed." },
          { q: "Did you want the violin?",
            a: "Me? I {ps:offered} to buy it last year, {cn:but} Elena {ps:said} no. {cn:So} what? I {ps:didn't steal} it!" },
        ],
      },
      {
        id: "tom", name: "Tom Becker", role: "Student", avatar: "🎒",
        questions: [
          { q: "Where were you between 1 and 2 AM?",
            a: "I {pc:was sleeping} in Car 3. I {ps:woke} up {cn:when} the conductor {ps:checked} my ticket." },
          { q: "What time did the conductor check your ticket?",
            a: "I {ps:looked} at my phone. It {ps:was} 1:32." },
          { q: "Did you go to Car 2?",
            a: "No. I {ps:went} to the bathroom at 1:50, {cn:but} the bathroom in Car 3 {ps:was} closer." },
          { q: "Did you see anything strange?",
            a: "{cn:When} I {pc:was going} to the bathroom, I {ps:saw} a woman with a big black case. She {pc:was walking} fast to the last car." },
          { q: "Do you know Elena Vargas?",
            a: "I {ps:asked} for her autograph at dinner. She {ps:was} very nice to me." },
        ],
      },
    ],
  },

  // ==========================================================
  // CASO 6 - HARD (5 suspeitos, mentira exige JUNTAR informações)
  // ==========================================================
  {
    id: "server",
    title: "The Server Room Breach",
    level: "Hard",
    questionLimit: 12,
    requireEvidence: true,
    intro:
      "Wednesday night, DataBank headquarters. Somebody entered the server room and " +
      "copied secret customer files at 10:52 PM, using access card #14. " +
      "Five people are involved. The card owner looks guilty... but is he? " +
      "Only ONE person is lying. Combine the facts!",
    clues: [
      { id: "doorlog",  text: "Server room log: access card #14 opened the door at 10:52 PM." },
      { id: "lostcard", text: "Security received a report about the loss of card #14 at 2:05 PM." },
      { id: "entrance", text: "After 10 PM, the main entrance is locked from the outside. You can leave the building, but you can't enter." },
      { id: "gate",     text: "After 10 PM, the only way in is the garage gate. It opens only for a car with a parking card and closes after 30 seconds." },
    ],
    culprit: "frank",
    suspects: [
      {
        id: "rafael", name: "Rafael Souza", role: "Intern (card #14)", avatar: "🧑‍🎓",
        questions: [
          { q: "Where were you at 10:52 PM?",
            a: "I {pc:was playing} an online game at home with three friends. They can confirm it." },
          { q: "Where is your access card?",
            a: "I {ps:lost} it at lunch, in the cafeteria. I {ps:reported} it right away." },
          { q: "Who sat with you at lunch?",
            a: "Frank {cn:and} Priya. Frank {ps:asked} me to show him my new card. He {ps:said} it {ps:looked} different." },
          { q: "Why didn't security cancel your card?",
            a: "I don't know! I {ps:sent} the report at 2 PM. {cn:Maybe} they {ps:forgot}." },
          { q: "Do you know the server password?",
            a: "No, I'm only an intern. I never {ps:had} access to the server." },
        ],
      },
      {
        id: "diana", name: "Diana Cole", role: "Security Guard", avatar: "👮‍♀️",
        questions: [
          { q: "Where were you between 10:30 and 11:30 PM?",
            a: "I {pc:was watching} the cameras in the security room. I {ps:left} only once, at 11:30, to help the delivery driver." },
          { q: "Did the garage gate open tonight?",
            a: "Yes, only twice {cn:after} 10 PM: for a red car at 10:40 {cn:and} for the delivery van at 11:30." },
          { q: "Did you see the driver of the red car?",
            a: "No. It {ps:parked} in a dark corner {cn:and} the driver {ps:took} the stairs, {cn:so} the camera {ps:didn't see} the face." },
          { q: "Why didn't you cancel card #14?",
            a: "I {pc:was going} to cancel it, {cn:but} the security system {ps:was} offline all afternoon." },
          { q: "Did you hear anything?",
            a: "At 10:55 Priya {ps:called} me. She {ps:said} someone {pc:was copying} files from the server." },
        ],
      },
      {
        id: "priya", name: "Priya Shah", role: "IT Manager", avatar: "👩‍🔬",
        questions: [
          { q: "Where were you at 10:52 PM?",
            a: "I {pc:was working} from home {cn:when} I {ps:received} an alert on my phone at 10:55." },
          { q: "What did the alert say?",
            a: "Someone {pc:was copying} secret files from the server. I {ps:called} Diana immediately." },
          { q: "Who knows the server password?",
            a: "Only two people: me {cn:and} Frank." },
          { q: "Why didn't you go to the office?",
            a: "I {ps:live} 50 km away. I {ps:tried} to lock the server from home, {cn:but} it {ps:was} too late." },
          { q: "Did you see Rafael's card at lunch?",
            a: "Yes. Rafael {ps:left} it on the table {cn:when} he {ps:went} to get dessert. Frank {pc:was sitting} right next to it." },
        ],
      },
      {
        id: "frank", name: "Frank Miller", role: "Senior Engineer", avatar: "👨‍🔧",
        questions: [
          { q: "Why were you in the building at night?",
            a: "I {ps:forgot} my laptop charger, {cn:so} I {ps:came} back at 10:45." },
          { q: "Where is your car?",
            a: "At the mechanic. It {ps:broke} down on Monday {cn:and} it's still there." },
          { q: "How did you enter the building?",
            a: "I {ps:walked} in through the garage gate. It {ps:was} open, {cn:so} I {ps:didn't need} a card.",
            lie: true, evidence: ["gate", "diana-1"] },              // MENTIRA: o portão só abre para carros
          { q: "Did you go to the server room?",
            a: "No! I {ps:went} straight to my desk, {ps:got} my charger {cn:and} {ps:left} at 11:00." },
          { q: "Did you see anyone?",
            a: "No one. The office {ps:was} completely empty {cn:and} dark." },
        ],
      },
      {
        id: "lucas", name: "Lucas Rocha", role: "Delivery Driver", avatar: "🚚",
        questions: [
          { q: "Why were you there so late?",
            a: "There {ps:was} a big accident on the highway, {cn:so} I {ps:arrived} at 11:30, two hours late." },
          { q: "How did you enter the garage?",
            a: "I {ps:used} my parking card. The gate {ps:opened} {cn:and} Diana {ps:came} down to help me." },
          { q: "Did you see anyone?",
            a: "{cn:When} I {pc:was entering} the garage, a red car {ps:left} very fast." },
          { q: "Did you see the driver of the red car?",
            a: "Only for a second. A man with glasses. He {pc:was holding} a laptop bag." },
          { q: "What did you deliver?",
            a: "Ten new computers. Diana {ps:signed} the papers {cn:and} I {ps:left} at midnight." },
        ],
      },
    ],
  },
];

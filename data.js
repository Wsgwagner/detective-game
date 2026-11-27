// ============================================================
//  data.js  -  TODOS os casos do jogo (dados separados da lógica)
//  Marcações dentro das respostas (para a "Grammar Lens"):
//    {ps:texto}  -> Past Simple        (ex: {ps:went})
//    {pc:texto}  -> Past Continuous    (ex: {pc:was reading})
//    {cn:texto}  -> Connective         (ex: {cn:when}, {cn:because})
// ============================================================

const QUESTION_LIMIT = 9; // quantas perguntas o detetive pode fazer em cada caso

const CASES = [                                                    // lista de casos (array de objetos)
  {
    id: "necklace",                                                // identificador único do caso
    title: "The Blackwood Necklace",                               // nome do caso
    level: "Easy",                                                 // dificuldade mostrada no menu
    intro:                                                         // história inicial do caso
      "Saturday night, Blackwood Mansion. Lady Blackwood's diamond necklace " +
      "disappeared from her bedroom between 8:00 and 9:00 PM. " +
      "Three people were in the house. One of them is lying.",
    clues: [                                                       // pistas do arquivo do caso (fatos verdadeiros)
      { id: "storm", text: "A heavy storm started at 7:45 PM. It rained until midnight." },
      { id: "power", text: "The electricity went off in the whole house from 8:20 to 8:50 PM." },
      { id: "tea",   text: "A cup of tea was found in the cook's bedroom, on the second floor." },
    ],
    culprit: "victor",                                             // ID do culpado
    suspects: [                                                    // lista de suspeitos
      {
        id: "grey",                                                // ID do suspeito
        name: "Mr. Grey",                                          // nome
        role: "The Butler",                                        // função/profissão
        avatar: "🤵",                                              // emoji usado como "foto"
        questions: [                                               // perguntas disponíveis para ele
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
        id: "lee",
        name: "Mrs. Lee",
        role: "The Cook",
        avatar: "👩‍🍳",
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
        id: "victor",
        name: "Victor Blackwood",
        role: "The Nephew",
        avatar: "🕴️",
        questions: [
          { q: "Where were you between 8 and 9 PM?",
            a: "I {pc:was watching} a football game on TV in the living room, from 8 to 9." },
          { q: "What were you doing when the lights went out?",
            a: "Lights? I {ps:didn't notice} anything strange. I {ps:watched} the whole game {cn:without} any interruption.",
            lie: true, contradicts: "power" },                    // MENTIRA! contradiz a pista "power"
          { q: "Did you see anyone?",
            a: "No one. I {ps:was} alone the whole time, {cn:so} nobody can confirm my story. Sorry." },
          { q: "Did you go outside tonight?",
            a: "Only at 7:30. I {ps:went} to my car to get my wallet. {cn:Then} I {ps:came} back inside {cn:before} the storm." },
        ],
      },
    ],
  },
  {
    id: "laptop",
    title: "The Missing Laptop",
    level: "Medium",
    intro:
      "Friday evening, TechNova office, 5th floor. A secret prototype laptop " +
      "disappeared from the lab between 6:00 and 7:00 PM. " +
      "Three employees were in the building. Find the liar!",
    clues: [
      { id: "elevator", text: "The elevator was out of service all day. A sign said: 'Please use the stairs'." },
      { id: "coffee",   text: "The coffee machine on the 5th floor was broken since Monday." },
      { id: "delivery", text: "A delivery of keyboards arrived at the reception at 6:30 PM." },
    ],
    culprit: "paul",
    suspects: [
      {
        id: "sarah",
        name: "Sarah Kim",
        role: "Developer",
        avatar: "👩‍💻",
        questions: [
          { q: "Where were you between 6 and 7 PM?",
            a: "I {pc:was fixing} a bug at my desk until 6:30. {cn:Then} I {ps:went} down to the reception." },
          { q: "How did you go down to the reception?",
            a: "I {ps:took} the stairs, {cn:of course}. The elevator {ps:was} broken. Five floors... my legs!" },
          { q: "Why did you go to the reception?",
            a: "A delivery {ps:arrived} at 6:30. It {ps:was} a box of new keyboards, {cn:so} I {ps:signed} for it." },
          { q: "Did you see anyone on the 5th floor?",
            a: "I {ps:saw} Mark near the kitchen. He {pc:was complaining} about the coffee machine." },
        ],
      },
      {
        id: "mark",
        name: "Mark Davis",
        role: "Designer",
        avatar: "🧑‍🎨",
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
        id: "paul",
        name: "Paul Turner",
        role: "Manager",
        avatar: "👨‍💼",
        questions: [
          { q: "Why were you at the office so late?",
            a: "I {ps:came} back at 6:20 {cn:because} I {ps:forgot} my car keys on my desk." },
          { q: "How did you get to the 5th floor?",
            a: "I {ps:took} the elevator, {cn:as usual}. It {ps:was} very fast, {cn:so} I {ps:arrived} in one minute.",
            lie: true, contradicts: "elevator" },
          { q: "What did you do in the office?",
            a: "I {ps:picked up} my keys {cn:and} I {ps:left} after five minutes. Nothing else." },
          { q: "Did you see the delivery at the reception?",
            a: "No, I {pc:wasn't paying} attention to the reception. I {pc:was talking} on the phone." },
        ],
      },
    ],
  },
  {
    id: "bakery",
    title: "The Bakery Break-in",
    level: "Hard",
    intro:
      "Sunday morning, Bruno's Bakery. Someone opened the front door with a key " +
      "and stole all the money from the cash register between 6:00 and 7:00 AM. " +
      "Three people had a reason to be near the bakery.",
    clues: [
      { id: "key",     text: "There was no damage on the front door. The thief used a key." },
      { id: "market",  text: "The street market on Main Street was cancelled this Sunday because of a festival." },
      { id: "sunrise", text: "The sun rose at 6:45 AM. Before that, the streets were dark." },
    ],
    culprit: "hill",
    suspects: [
      {
        id: "anna",
        name: "Anna Rossi",
        role: "Assistant Baker",
        avatar: "👩‍🦰",
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
        id: "leo",
        name: "Leo Park",
        role: "Delivery Boy",
        avatar: "🚴",
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
        id: "hill",
        name: "Mr. Hill",
        role: "The Neighbor",
        avatar: "👴",
        questions: [
          { q: "Where were you between 6 and 7 AM?",
            a: "I {ps:left} my house at 6:00 {cn:because} I {ps:wanted} to go shopping early." },
          { q: "Where did you go shopping?",
            a: "I {pc:was buying} fresh vegetables at the street market on Main Street. There {ps:were} so many people!",
            lie: true, contradicts: "market" },
          { q: "Do you have a key to the bakery?",
            a: "Yes, Bruno {ps:gave} me a key {cn:because} I {ps:watered} his plants last summer. {cn:But} I {ps:didn't use} it today!" },
          { q: "When did you come back home?",
            a: "I {ps:came} back home at 7:30 {cn:and} {ps:made} breakfast. {cn:Then} I {ps:heard} the police cars." },
        ],
      },
    ],
  },
];

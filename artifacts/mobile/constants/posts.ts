export type PostComment = {
  id: string;
  user: string;
  initials: string;
  color: string;
  text: string;
  time: string;
};

export type Creator = {
  name: string;
  handle: string;
  initials: string;
  color: string;
};

export type Post = {
  id: string;
  title: string;
  location: string;
  description: string;
  tag: "foryou" | "trending" | "all";
  imgH: number;
  cover?: string;
  grad?: [string, string];
  emoji?: string;
  creator: Creator;
  comments: PostComment[];
};

export const POSTS: Post[] = [
  {
    id: "p1",
    title: "Sunset at Oia",
    location: "Santorini, Greece",
    description:
      "The most photogenic sunset on earth. Arrive an hour early to claim your spot on the cliffs — it fills up fast.",
    tag: "foryou",
    imgH: 240,
    cover: "santorini",
    creator: {
      name: "Sofia Markou",
      handle: "@sofiatravels",
      initials: "SM",
      color: "#7C6FF7",
    },
    comments: [
      {
        id: "c1a",
        user: "Lucas",
        initials: "LU",
        color: "#4ECDC4",
        text: "This view is absolutely insane 😍",
        time: "2h ago",
      },
      {
        id: "c1b",
        user: "Maria",
        initials: "MA",
        color: "#FF6B6B",
        text: "Adding this to my Santorini trip immediately!",
        time: "45m ago",
      },
    ],
  },
  {
    id: "p2",
    title: "Best ramen under ¥800",
    location: "Tokyo, Japan",
    description:
      "Hidden spot in Shibuya — no tourists, locals only. Tonkotsu broth that's been simmering for 18 hours. Queue opens at 11am.",
    tag: "trending",
    imgH: 164,
    cover: "tokyo",
    creator: {
      name: "Kenji Moto",
      handle: "@kenjieats",
      initials: "KM",
      color: "#FF6B6B",
    },
    comments: [
      {
        id: "c2a",
        user: "Alex",
        initials: "AR",
        color: "#7C6FF7",
        text: "What's the name of this place?",
        time: "1h ago",
      },
      {
        id: "c2b",
        user: "Kenji",
        initials: "KM",
        color: "#FF6B6B",
        text: "It's Fuunji — DM me the exact address",
        time: "58m ago",
      },
    ],
  },
  {
    id: "p3",
    title: "Hidden waterfall trail",
    location: "Ubud, Bali",
    description:
      "45-minute trek through rice terraces gets you to a waterfall most tourists never see. Bring water shoes.",
    tag: "foryou",
    imgH: 164,
    cover: "bali",
    creator: {
      name: "Dewa Putra",
      handle: "@dewabali",
      initials: "DP",
      color: "#4ECDC4",
    },
    comments: [
      {
        id: "c3a",
        user: "Sofia",
        initials: "SM",
        color: "#7C6FF7",
        text: "Is this near Tegallalang? Looks incredible",
        time: "3h ago",
      },
    ],
  },
  {
    id: "p4",
    title: "Rooftop bar at midnight",
    location: "Bangkok, Thailand",
    description:
      "Sky Bar on the 64th floor. The view stretches across the entire city. Get there before midnight to beat the crowd.",
    tag: "trending",
    imgH: 220,
    grad: ["#FF6B6B", "#C2185B"],
    emoji: "🍹",
    creator: {
      name: "Prae Siriwan",
      handle: "@praebkk",
      initials: "PS",
      color: "#FF6B6B",
    },
    comments: [
      {
        id: "c4a",
        user: "Lucas",
        initials: "LU",
        color: "#4ECDC4",
        text: "The dress code was strict when I went — heads up!",
        time: "5h ago",
      },
      {
        id: "c4b",
        user: "Prae",
        initials: "PS",
        color: "#FF6B6B",
        text: "Yeah smart casual is required 👔",
        time: "4h ago",
      },
    ],
  },
  {
    id: "p5",
    title: "Secret beach cove",
    location: "Maldives",
    description:
      "You reach it by a 15-min boat ride. White sand, zero crowds, and the clearest water you've ever seen. Ask your resort.",
    tag: "foryou",
    imgH: 164,
    grad: ["#4ECDC4", "#006E7F"],
    emoji: "🏝️",
    creator: {
      name: "Aisha Rahman",
      handle: "@aishawanders",
      initials: "AR",
      color: "#4ECDC4",
    },
    comments: [
      {
        id: "c5a",
        user: "Maria",
        initials: "MA",
        color: "#FF6B6B",
        text: "Which resort? I need to know 🙏",
        time: "30m ago",
      },
    ],
  },
  {
    id: "p6",
    title: "Morning café ritual",
    location: "Paris, France",
    description:
      "Café de Flore, 8am on a weekday. Croissant + café crème. Half the tables empty. This is when Paris is actually Paris.",
    tag: "all",
    imgH: 220,
    grad: ["#7C6FF7", "#3B2FB5"],
    emoji: "☕",
    creator: {
      name: "Chloé Dubois",
      handle: "@chloeinparis",
      initials: "CD",
      color: "#7C6FF7",
    },
    comments: [
      {
        id: "c6a",
        user: "Alex",
        initials: "AR",
        color: "#7C6FF7",
        text: "Went here last spring — absolutely magical 🥐",
        time: "6h ago",
      },
      {
        id: "c6b",
        user: "Dewa",
        initials: "DP",
        color: "#4ECDC4",
        text: "Adding to my Paris trip for next year!",
        time: "2h ago",
      },
    ],
  },
  {
    id: "p7",
    title: "Neon streets at midnight",
    location: "Seoul, South Korea",
    description:
      "Hongdae district comes alive after 11pm. Street food, live music, and neon everywhere. It never sleeps.",
    tag: "trending",
    imgH: 164,
    grad: ["#C44BFF", "#FF6B6B"],
    emoji: "🌆",
    creator: {
      name: "Ji-yeon Park",
      handle: "@jiyeonseoul",
      initials: "JP",
      color: "#C44BFF",
    },
    comments: [
      {
        id: "c7a",
        user: "Kenji",
        initials: "KM",
        color: "#FF6B6B",
        text: "The tteokbokki stalls here are 🔥",
        time: "1h ago",
      },
    ],
  },
  {
    id: "p8",
    title: "Overwater villa escape",
    location: "Maldives",
    description:
      "Glass floor, private plunge pool, direct ocean access. Book the sunset-facing villas for the view. Worth every cent.",
    tag: "foryou",
    imgH: 240,
    grad: ["#0099CC", "#4ECDC4"],
    emoji: "🌊",
    creator: {
      name: "Aisha Rahman",
      handle: "@aishawanders",
      initials: "AR",
      color: "#4ECDC4",
    },
    comments: [
      {
        id: "c8a",
        user: "Chloé",
        initials: "CD",
        color: "#7C6FF7",
        text: "Which resort is this? The glass floor 😱",
        time: "4h ago",
      },
      {
        id: "c8b",
        user: "Aisha",
        initials: "AR",
        color: "#4ECDC4",
        text: "Conrad Rangali — look for the Muraka suite 🙌",
        time: "3h ago",
      },
    ],
  },
  {
    id: "p9",
    title: "Alpine sunrise hike",
    location: "Swiss Alps",
    description:
      "Leave the hut at 4:30am. Two hours of darkness, then the sun breaks over the peaks. One of the best things I've ever done.",
    tag: "all",
    imgH: 164,
    grad: ["#2E7D52", "#4ECDC4"],
    emoji: "⛰️",
    creator: {
      name: "Lars Berger",
      handle: "@larsalpine",
      initials: "LB",
      color: "#4ECDC4",
    },
    comments: [
      {
        id: "c9a",
        user: "Sofia",
        initials: "SM",
        color: "#7C6FF7",
        text: "Which trail is this? Grindelwald?",
        time: "8h ago",
      },
      {
        id: "c9b",
        user: "Lars",
        initials: "LB",
        color: "#4ECDC4",
        text: "Männlichen to Kleine Scheidegg — the classic!",
        time: "7h ago",
      },
    ],
  },
  {
    id: "p10",
    title: "Night market feast",
    location: "Chiang Mai, Thailand",
    description:
      "Sunday Walking Street on Wualai Road. Arrive hungry. Mango sticky rice, pad see ew, and grilled skewers for under €5 total.",
    tag: "all",
    imgH: 210,
    grad: ["#FFB347", "#FF6B6B"],
    emoji: "🥢",
    creator: {
      name: "Prae Siriwan",
      handle: "@praebkk",
      initials: "PS",
      color: "#FF6B6B",
    },
    comments: [
      {
        id: "c10a",
        user: "Kenji",
        initials: "KM",
        color: "#FF6B6B",
        text: "The mango sticky rice from the old lady at the corner is unreal",
        time: "3h ago",
      },
    ],
  },
  {
    id: "p11",
    title: "Secret garden café",
    location: "Kyoto, Japan",
    description:
      "Hidden behind a bamboo gate in Arashiyama. Order the matcha set. They only take 12 guests at a time — book ahead.",
    tag: "foryou",
    imgH: 164,
    grad: ["#FF6B6B", "#FFB347"],
    emoji: "🌸",
    creator: {
      name: "Kenji Moto",
      handle: "@kenjieats",
      initials: "KM",
      color: "#FF6B6B",
    },
    comments: [
      {
        id: "c11a",
        user: "Ji-yeon",
        initials: "JP",
        color: "#C44BFF",
        text: "Was this during cherry blossom season?",
        time: "2h ago",
      },
      {
        id: "c11b",
        user: "Kenji",
        initials: "KM",
        color: "#FF6B6B",
        text: "Yes — early April is magic 🌸",
        time: "1h ago",
      },
    ],
  },
  {
    id: "p12",
    title: "Turquoise lagoon dive",
    location: "Phi Phi, Thailand",
    description:
      "Pileh Lagoon by longtail boat at 7am before the tour boats arrive. Snorkel inside a lagoon surrounded by limestone cliffs.",
    tag: "trending",
    imgH: 180,
    grad: ["#4ECDC4", "#7C6FF7"],
    emoji: "🐠",
    creator: {
      name: "Dewa Putra",
      handle: "@dewabali",
      initials: "DP",
      color: "#4ECDC4",
    },
    comments: [
      {
        id: "c12a",
        user: "Aisha",
        initials: "AR",
        color: "#4ECDC4",
        text: "Going there in March — is it still worth it?",
        time: "5h ago",
      },
    ],
  },
  {
    id: "p13",
    title: "24h in Seoul",
    location: "Seoul, South Korea",
    description:
      "Morning: Gyeongbokgung Palace. Afternoon: Bukchon hanok village. Evening: Namsan Tower. Night: Hongdae. You won't sleep.",
    tag: "all",
    imgH: 200,
    grad: ["#7C6FF7", "#C44BFF"],
    emoji: "🗼",
    creator: {
      name: "Ji-yeon Park",
      handle: "@jiyeonseoul",
      initials: "JP",
      color: "#C44BFF",
    },
    comments: [
      {
        id: "c13a",
        user: "Lars",
        initials: "LB",
        color: "#4ECDC4",
        text: "Planning Seoul in October — is the weather good?",
        time: "1h ago",
      },
      {
        id: "c13b",
        user: "Ji-yeon",
        initials: "JP",
        color: "#C44BFF",
        text: "October is literally the best time. Perfect temps 🍂",
        time: "45m ago",
      },
    ],
  },
  {
    id: "p14",
    title: "Best pasta in Rome",
    location: "Rome, Italy",
    description:
      "Trattoria da Enzo al 29, Trastevere. No menu in English. Point at what the table next to you is eating. You cannot go wrong.",
    tag: "trending",
    imgH: 164,
    grad: ["#FFB347", "#E65100"],
    emoji: "🍝",
    creator: {
      name: "Chloé Dubois",
      handle: "@chloeinparis",
      initials: "CD",
      color: "#7C6FF7",
    },
    comments: [
      {
        id: "c14a",
        user: "Sofia",
        initials: "SM",
        color: "#7C6FF7",
        text: "The cacio e pepe there changed my life 🍝",
        time: "3h ago",
      },
      {
        id: "c14b",
        user: "Chloé",
        initials: "CD",
        color: "#7C6FF7",
        text: "Exactly! Worth the queue every single time",
        time: "2h ago",
      },
    ],
  },
];

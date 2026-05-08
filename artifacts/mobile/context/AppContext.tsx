import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface TripMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: "owner" | "editor" | "viewer";
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  localCover?: string;
  startDate: string;
  endDate: string;
  status: "planning" | "upcoming" | "ongoing" | "completed";
  currency: string;
  totalBudget: number;
  members: TripMember[];
  accentColor: string;
  notes: string;
  createdAt: string;
  shareToken: string;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  day: number;
  time: string;
  title: string;
  location: string;
  type: "flight" | "hotel" | "activity" | "restaurant" | "transport" | "other";
  notes: string;
  booked: boolean;
  cost?: number;
}

export interface BudgetItem {
  id: string;
  tripId: string;
  category:
    | "accommodation"
    | "transport"
    | "food"
    | "activities"
    | "shopping"
    | "other";
  amount: number;
  date: string;
  description: string;
  paidBy: string;
}

export interface Booking {
  id: string;
  tripId: string;
  type: "flight" | "hotel" | "car" | "activity" | "restaurant";
  title: string;
  confirmationCode: string;
  date: string;
  checkOut?: string;
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "cancelled";
  notes: string;
}

export interface ChecklistItem {
  id: string;
  tripId: string;
  title: string;
  checked: boolean;
  category: "documents" | "clothing" | "health" | "tech" | "other";
}

export interface ChatMessage {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: "trips" | "countries" | "planning" | "social";
}

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  bio: string;
}

const genId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const SEED_USER: User = {
  id: "u1",
  name: "Alex Rivera",
  email: "alex@tripflow.app",
  initials: "AR",
  avatarColor: "#7C6FF7",
  bio: "Wanderlust traveler. 3 countries explored, many more to go.",
};

const SEED_TRIPS: Trip[] = [
  {
    id: "trip_1",
    title: "Santorini Escape",
    destination: "Santorini",
    country: "Greece",
    localCover: "santorini",
    startDate: "2026-07-15",
    endDate: "2026-07-22",
    status: "upcoming",
    currency: "EUR",
    totalBudget: 3500,
    members: [
      {
        id: "u1",
        name: "Alex",
        initials: "AR",
        color: "#7C6FF7",
        role: "owner",
      },
      {
        id: "u2",
        name: "Maria",
        initials: "MA",
        color: "#FF6B6B",
        role: "editor",
      },
      {
        id: "u3",
        name: "Lucas",
        initials: "LU",
        color: "#4ECDC4",
        role: "viewer",
      },
    ],
    accentColor: "#7C6FF7",
    notes: "Dream trip to Santorini! Book sunset cruise early.",
    createdAt: "2026-04-01",
    shareToken: "stni-abc123",
  },
  {
    id: "trip_2",
    title: "Tokyo Neon Nights",
    destination: "Tokyo",
    country: "Japan",
    localCover: "tokyo",
    startDate: "2026-09-10",
    endDate: "2026-09-20",
    status: "planning",
    currency: "USD",
    totalBudget: 4200,
    members: [
      {
        id: "u1",
        name: "Alex",
        initials: "AR",
        color: "#7C6FF7",
        role: "owner",
      },
    ],
    accentColor: "#FF6B6B",
    notes: "Solo adventure through the city of neon.",
    createdAt: "2026-04-10",
    shareToken: "toky-def456",
  },
  {
    id: "trip_3",
    title: "Bali Retreat",
    destination: "Ubud, Bali",
    country: "Indonesia",
    localCover: "bali",
    startDate: "2025-11-01",
    endDate: "2025-11-10",
    status: "completed",
    currency: "USD",
    totalBudget: 2800,
    members: [
      {
        id: "u1",
        name: "Alex",
        initials: "AR",
        color: "#7C6FF7",
        role: "owner",
      },
      {
        id: "u4",
        name: "Sofia",
        initials: "SO",
        color: "#FFB347",
        role: "editor",
      },
    ],
    accentColor: "#4ECDC4",
    notes: "Completed. One of the best trips ever!",
    createdAt: "2025-09-15",
    shareToken: "bali-ghi789",
  },
];

const SEED_ITINERARY: ItineraryItem[] = [
  {
    id: "it_1",
    tripId: "trip_1",
    day: 1,
    time: "08:00",
    title: "Flight to Athens",
    location: "Airport",
    type: "flight",
    notes: "Terminal 2, Gate B12",
    booked: true,
    cost: 280,
  },
  {
    id: "it_2",
    tripId: "trip_1",
    day: 1,
    time: "18:00",
    title: "Check-in Hotel Caldera",
    location: "Oia, Santorini",
    type: "hotel",
    notes: "Sea view room",
    booked: true,
    cost: 420,
  },
  {
    id: "it_3",
    tripId: "trip_1",
    day: 2,
    time: "10:00",
    title: "Breakfast at Ammoudi Bay",
    location: "Ammoudi, Santorini",
    type: "restaurant",
    notes: "Try the fresh octopus",
    booked: false,
    cost: 45,
  },
  {
    id: "it_4",
    tripId: "trip_1",
    day: 2,
    time: "15:00",
    title: "Sunset Sailing Cruise",
    location: "Caldera",
    type: "activity",
    notes: "Book ahead!",
    booked: false,
    cost: 150,
  },
  {
    id: "it_5",
    tripId: "trip_2",
    day: 1,
    time: "10:00",
    title: "Arrive at Narita",
    location: "Narita International Airport",
    type: "flight",
    notes: "Immigration queue can be long",
    booked: true,
    cost: 850,
  },
  {
    id: "it_6",
    tripId: "trip_2",
    day: 1,
    time: "16:00",
    title: "Shibuya Crossing",
    location: "Shibuya, Tokyo",
    type: "activity",
    notes: "Go at rush hour",
    booked: false,
    cost: 0,
  },
];

const SEED_BUDGET: BudgetItem[] = [
  {
    id: "b_1",
    tripId: "trip_1",
    category: "transport",
    amount: 280,
    date: "2026-07-15",
    description: "Flights",
    paidBy: "Alex",
  },
  {
    id: "b_2",
    tripId: "trip_1",
    category: "accommodation",
    amount: 1960,
    date: "2026-07-15",
    description: "Hotel (7 nights)",
    paidBy: "Alex",
  },
  {
    id: "b_3",
    tripId: "trip_1",
    category: "food",
    amount: 120,
    date: "2026-07-16",
    description: "Dinner at Sunset",
    paidBy: "Maria",
  },
  {
    id: "b_4",
    tripId: "trip_2",
    category: "transport",
    amount: 850,
    date: "2026-09-10",
    description: "Round trip flight",
    paidBy: "Alex",
  },
  {
    id: "b_5",
    tripId: "trip_2",
    category: "accommodation",
    amount: 1100,
    date: "2026-09-10",
    description: "Airbnb 10 nights",
    paidBy: "Alex",
  },
];

const SEED_BOOKINGS: Booking[] = [
  {
    id: "bk_1",
    tripId: "trip_1",
    type: "flight",
    title: "Aegean Airlines GR 241",
    confirmationCode: "AEG7291",
    date: "2026-07-15",
    amount: 280,
    currency: "EUR",
    status: "confirmed",
    notes: "Window seat booked",
  },
  {
    id: "bk_2",
    tripId: "trip_1",
    type: "hotel",
    title: "Caldera Villas Oia",
    confirmationCode: "CAL3847",
    date: "2026-07-15",
    checkOut: "2026-07-22",
    amount: 1960,
    currency: "EUR",
    status: "confirmed",
    notes: "Breakfast included",
  },
  {
    id: "bk_3",
    tripId: "trip_2",
    type: "flight",
    title: "JAL JL 417",
    confirmationCode: "JAL9912",
    date: "2026-09-10",
    amount: 850,
    currency: "USD",
    status: "confirmed",
    notes: "",
  },
];

const SEED_CHECKLIST: ChecklistItem[] = [
  {
    id: "ck_1",
    tripId: "trip_1",
    title: "Passport (valid 6+ months)",
    checked: true,
    category: "documents",
  },
  {
    id: "ck_2",
    tripId: "trip_1",
    title: "Travel insurance",
    checked: true,
    category: "documents",
  },
  {
    id: "ck_3",
    tripId: "trip_1",
    title: "Sunscreen SPF 50+",
    checked: false,
    category: "health",
  },
  {
    id: "ck_4",
    tripId: "trip_1",
    title: "Swimsuit x3",
    checked: false,
    category: "clothing",
  },
  {
    id: "ck_5",
    tripId: "trip_1",
    title: "Universal adapter",
    checked: true,
    category: "tech",
  },
  {
    id: "ck_6",
    tripId: "trip_1",
    title: "Download offline maps",
    checked: false,
    category: "tech",
  },
  {
    id: "ck_7",
    tripId: "trip_2",
    title: "Japan Rail Pass",
    checked: false,
    category: "documents",
  },
  {
    id: "ck_8",
    tripId: "trip_2",
    title: "Portable WiFi router",
    checked: true,
    category: "tech",
  },
];

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "m_1",
    tripId: "trip_1",
    userId: "u2",
    userName: "Maria",
    text: "I booked the sunset cruise! Caldera Yachting, great reviews.",
    timestamp: "2026-06-10T14:30:00Z",
    isMine: false,
  },
  {
    id: "m_2",
    tripId: "trip_1",
    userId: "u1",
    userName: "Alex",
    text: "Amazing! Which company did you go with?",
    timestamp: "2026-06-10T14:32:00Z",
    isMine: true,
  },
  {
    id: "m_3",
    tripId: "trip_1",
    userId: "u3",
    userName: "Lucas",
    text: "68 days to go! Can not wait!",
    timestamp: "2026-06-10T14:40:00Z",
    isMine: false,
  },
];

const SEED_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach_1",
    title: "First Trip",
    description: "Created your first trip",
    icon: "map",
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    category: "trips",
  },
  {
    id: "ach_2",
    title: "World Explorer",
    description: "Visit 5 different countries",
    icon: "globe",
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    category: "countries",
  },
  {
    id: "ach_3",
    title: "Master Planner",
    description: "Add 10 itinerary items",
    icon: "calendar",
    unlocked: false,
    progress: 6,
    maxProgress: 10,
    category: "planning",
  },
  {
    id: "ach_4",
    title: "Budget Pro",
    description: "Track budget on 3 trips",
    icon: "dollar-sign",
    unlocked: true,
    progress: 3,
    maxProgress: 3,
    category: "planning",
  },
  {
    id: "ach_5",
    title: "Social Traveler",
    description: "Invite 3 friends to a trip",
    icon: "users",
    unlocked: false,
    progress: 2,
    maxProgress: 3,
    category: "social",
  },
  {
    id: "ach_6",
    title: "Globetrotter",
    description: "Complete 3 trips",
    icon: "award",
    unlocked: true,
    progress: 3,
    maxProgress: 3,
    category: "trips",
  },
  {
    id: "ach_7",
    title: "Checklist Champion",
    description: "Pack everything for a trip",
    icon: "check-circle",
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: "planning",
  },
  {
    id: "ach_8",
    title: "Bookings Master",
    description: "Add 5 confirmed bookings",
    icon: "bookmark",
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    category: "planning",
  },
];

interface AppContextType {
  trips: Trip[];
  itineraryItems: ItineraryItem[];
  budgetItems: BudgetItem[];
  bookings: Booking[];
  checklistItems: ChecklistItem[];
  chatMessages: ChatMessage[];
  achievements: Achievement[];
  currentUser: User;
  createTrip: (
    data: Omit<Trip, "id" | "createdAt" | "members" | "shareToken">
  ) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  addItineraryItem: (item: Omit<ItineraryItem, "id">) => void;
  toggleItineraryBooked: (id: string) => void;
  deleteItineraryItem: (id: string) => void;
  addBudgetItem: (item: Omit<BudgetItem, "id">) => void;
  deleteBudgetItem: (id: string) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  deleteBooking: (id: string) => void;
  addChecklistItem: (item: Omit<ChecklistItem, "id">) => void;
  toggleChecklistItem: (id: string) => void;
  deleteChecklistItem: (id: string) => void;
  sendMessage: (tripId: string, text: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(SEED_USER);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [
          tripsRaw,
          itinRaw,
          budgetRaw,
          bookingsRaw,
          checklistRaw,
          chatRaw,
          achRaw,
          userRaw,
          seeded,
        ] = await Promise.all([
          AsyncStorage.getItem("tf_trips"),
          AsyncStorage.getItem("tf_itinerary"),
          AsyncStorage.getItem("tf_budget"),
          AsyncStorage.getItem("tf_bookings"),
          AsyncStorage.getItem("tf_checklist"),
          AsyncStorage.getItem("tf_chat"),
          AsyncStorage.getItem("tf_achievements"),
          AsyncStorage.getItem("tf_user"),
          AsyncStorage.getItem("tf_seeded"),
        ]);

        if (!seeded) {
          setTrips(SEED_TRIPS);
          setItineraryItems(SEED_ITINERARY);
          setBudgetItems(SEED_BUDGET);
          setBookings(SEED_BOOKINGS);
          setChecklistItems(SEED_CHECKLIST);
          setChatMessages(SEED_MESSAGES);
          setAchievements(SEED_ACHIEVEMENTS);
          await Promise.all([
            AsyncStorage.setItem("tf_trips", JSON.stringify(SEED_TRIPS)),
            AsyncStorage.setItem(
              "tf_itinerary",
              JSON.stringify(SEED_ITINERARY)
            ),
            AsyncStorage.setItem("tf_budget", JSON.stringify(SEED_BUDGET)),
            AsyncStorage.setItem("tf_bookings", JSON.stringify(SEED_BOOKINGS)),
            AsyncStorage.setItem(
              "tf_checklist",
              JSON.stringify(SEED_CHECKLIST)
            ),
            AsyncStorage.setItem("tf_chat", JSON.stringify(SEED_MESSAGES)),
            AsyncStorage.setItem(
              "tf_achievements",
              JSON.stringify(SEED_ACHIEVEMENTS)
            ),
            AsyncStorage.setItem("tf_user", JSON.stringify(SEED_USER)),
            AsyncStorage.setItem("tf_seeded", "1"),
          ]);
        } else {
          if (tripsRaw) setTrips(JSON.parse(tripsRaw));
          if (itinRaw) setItineraryItems(JSON.parse(itinRaw));
          if (budgetRaw) setBudgetItems(JSON.parse(budgetRaw));
          if (bookingsRaw) setBookings(JSON.parse(bookingsRaw));
          if (checklistRaw) setChecklistItems(JSON.parse(checklistRaw));
          if (chatRaw) setChatMessages(JSON.parse(chatRaw));
          if (achRaw) setAchievements(JSON.parse(achRaw));
          if (userRaw) setCurrentUser(JSON.parse(userRaw));
        }
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  const save = useCallback(
    async (key: string, value: unknown) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    []
  );

  const createTrip = useCallback(
    (data: Omit<Trip, "id" | "createdAt" | "members" | "shareToken">) => {
      const newTrip: Trip = {
        ...data,
        id: genId(),
        createdAt: new Date().toISOString(),
        members: [
          {
            id: currentUser.id,
            name: currentUser.name,
            initials: currentUser.initials,
            color: currentUser.avatarColor,
            role: "owner",
          },
        ],
        shareToken:
          data.destination.toLowerCase().slice(0, 4) + "-" + genId().slice(0, 6),
      };
      setTrips((prev) => {
        const next = [newTrip, ...prev];
        save("tf_trips", next);
        return next;
      });
    },
    [currentUser, save]
  );

  const updateTrip = useCallback(
    (id: string, data: Partial<Trip>) => {
      setTrips((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
        save("tf_trips", next);
        return next;
      });
    },
    [save]
  );

  const deleteTrip = useCallback(
    (id: string) => {
      setTrips((prev) => {
        const next = prev.filter((t) => t.id !== id);
        save("tf_trips", next);
        return next;
      });
    },
    [save]
  );

  const addItineraryItem = useCallback(
    (item: Omit<ItineraryItem, "id">) => {
      const newItem: ItineraryItem = { ...item, id: genId() };
      setItineraryItems((prev) => {
        const next = [...prev, newItem];
        save("tf_itinerary", next);
        return next;
      });
    },
    [save]
  );

  const toggleItineraryBooked = useCallback(
    (id: string) => {
      setItineraryItems((prev) => {
        const next = prev.map((i) =>
          i.id === id ? { ...i, booked: !i.booked } : i
        );
        save("tf_itinerary", next);
        return next;
      });
    },
    [save]
  );

  const deleteItineraryItem = useCallback(
    (id: string) => {
      setItineraryItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        save("tf_itinerary", next);
        return next;
      });
    },
    [save]
  );

  const addBudgetItem = useCallback(
    (item: Omit<BudgetItem, "id">) => {
      const newItem: BudgetItem = { ...item, id: genId() };
      setBudgetItems((prev) => {
        const next = [...prev, newItem];
        save("tf_budget", next);
        return next;
      });
    },
    [save]
  );

  const deleteBudgetItem = useCallback(
    (id: string) => {
      setBudgetItems((prev) => {
        const next = prev.filter((b) => b.id !== id);
        save("tf_budget", next);
        return next;
      });
    },
    [save]
  );

  const addBooking = useCallback(
    (booking: Omit<Booking, "id">) => {
      const newBooking: Booking = { ...booking, id: genId() };
      setBookings((prev) => {
        const next = [...prev, newBooking];
        save("tf_bookings", next);
        return next;
      });
    },
    [save]
  );

  const updateBookingStatus = useCallback(
    (id: string, status: Booking["status"]) => {
      setBookings((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, status } : b));
        save("tf_bookings", next);
        return next;
      });
    },
    [save]
  );

  const deleteBooking = useCallback(
    (id: string) => {
      setBookings((prev) => {
        const next = prev.filter((b) => b.id !== id);
        save("tf_bookings", next);
        return next;
      });
    },
    [save]
  );

  const addChecklistItem = useCallback(
    (item: Omit<ChecklistItem, "id">) => {
      const newItem: ChecklistItem = { ...item, id: genId() };
      setChecklistItems((prev) => {
        const next = [...prev, newItem];
        save("tf_checklist", next);
        return next;
      });
    },
    [save]
  );

  const toggleChecklistItem = useCallback(
    (id: string) => {
      setChecklistItems((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, checked: !c.checked } : c
        );
        save("tf_checklist", next);
        return next;
      });
    },
    [save]
  );

  const deleteChecklistItem = useCallback(
    (id: string) => {
      setChecklistItems((prev) => {
        const next = prev.filter((c) => c.id !== id);
        save("tf_checklist", next);
        return next;
      });
    },
    [save]
  );

  const sendMessage = useCallback(
    (tripId: string, text: string) => {
      const msg: ChatMessage = {
        id: genId(),
        tripId,
        userId: currentUser.id,
        userName: currentUser.name,
        text,
        timestamp: new Date().toISOString(),
        isMine: true,
      };
      setChatMessages((prev) => {
        const next = [...prev, msg];
        save("tf_chat", next);
        return next;
      });
    },
    [currentUser, save]
  );

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      setCurrentUser((prev) => {
        const next = { ...prev, ...data };
        save("tf_user", next);
        return next;
      });
    },
    [save]
  );

  if (!initialized) return null;

  return (
    <AppContext.Provider
      value={{
        trips,
        itineraryItems,
        budgetItems,
        bookings,
        checklistItems,
        chatMessages,
        achievements,
        currentUser,
        createTrip,
        updateTrip,
        deleteTrip,
        addItineraryItem,
        toggleItineraryBooked,
        deleteItineraryItem,
        addBudgetItem,
        deleteBudgetItem,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addChecklistItem,
        toggleChecklistItem,
        deleteChecklistItem,
        sendMessage,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

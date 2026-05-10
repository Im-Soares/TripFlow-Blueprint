import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, ApiError, type TripWithMembers, type TripMemberRow } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

/* ─── Local types ─── */

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
  coverImageUrl?: string | null;
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
  category: "accommodation" | "transport" | "food" | "activities" | "shopping" | "other";
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

/* ─── Converters ─── */

const MEMBER_COLORS = ["#7C6FF7", "#FF6B6B", "#4ECDC4", "#FFB347", "#6C8EBF", "#E879A0"];

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function toLocalMember(m: TripMemberRow, idx: number): TripMember {
  const name = m.name ?? m.email ?? "Unknown";
  return {
    id: m.userId,
    name,
    initials: toInitials(name),
    color: MEMBER_COLORS[idx % MEMBER_COLORS.length],
    role: (m.role ?? "viewer") as TripMember["role"],
  };
}

function toLocalTrip(t: TripWithMembers): Trip {
  return {
    id: t.id,
    title: t.title,
    destination: t.destination,
    country: t.country ?? "",
    localCover: undefined,
    coverImageUrl: t.coverImageUrl ?? null,
    startDate: t.startDate,
    endDate: t.endDate,
    status: (t.status ?? "planning") as Trip["status"],
    currency: t.currency ?? "USD",
    totalBudget: t.estimatedBudget ?? 0,
    members: t.members.map(toLocalMember),
    accentColor: t.accentColor ?? "#7C6FF7",
    notes: t.notes ?? "",
    createdAt: t.createdAt,
    shareToken: t.shareToken ?? "",
  };
}

/* ─── Seed data for local-only features ─── */

const genId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);
const TRIPS_KEY = "tf_trips";

const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: "ach_1", title: "First Trip", description: "Created your first trip", icon: "map", unlocked: false, progress: 0, maxProgress: 1, category: "trips" },
  { id: "ach_2", title: "World Explorer", description: "Visit 5 different countries", icon: "globe", unlocked: false, progress: 0, maxProgress: 5, category: "countries" },
  { id: "ach_3", title: "Master Planner", description: "Add 10 itinerary items", icon: "calendar", unlocked: false, progress: 0, maxProgress: 10, category: "planning" },
  { id: "ach_4", title: "Budget Pro", description: "Track budget on 3 trips", icon: "dollar-sign", unlocked: false, progress: 0, maxProgress: 3, category: "planning" },
  { id: "ach_5", title: "Itinerary Expert", description: "Plan 5 detailed itineraries", icon: "list", unlocked: false, progress: 0, maxProgress: 5, category: "planning" },
  { id: "ach_6", title: "Globetrotter", description: "Complete 3 trips", icon: "award", unlocked: false, progress: 0, maxProgress: 3, category: "trips" },
  { id: "ach_7", title: "Booking Master", description: "Add 5 confirmed bookings", icon: "bookmark", unlocked: false, progress: 0, maxProgress: 5, category: "planning" },
  { id: "ach_8", title: "Destination Specialist", description: "Visit the same country 3 times", icon: "star", unlocked: false, progress: 0, maxProgress: 3, category: "countries" },
];

/* ─── Context interface ─── */

interface AppContextType {
  trips: Trip[];
  tripsLoading: boolean;
  refreshTrips: () => Promise<void>;
  itineraryItems: ItineraryItem[];
  budgetItems: BudgetItem[];
  bookings: Booking[];
  checklistItems: ChecklistItem[];
  chatMessages: ChatMessage[];
  achievements: Achievement[];
  currentUser: User;
  createTrip: (data: Omit<Trip, "id" | "createdAt" | "members" | "shareToken">) => Promise<Trip>;
  updateTrip: (id: string, data: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
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
  const { authState } = useAuth();

  /* ─── Current user from auth ─── */
  const currentUser = useMemo((): User => {
    if (authState.status === "authenticated") {
      const u = authState.user;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        initials: toInitials(u.name),
        avatarColor: "#7C6FF7",
        bio: u.bio ?? "",
      };
    }
    return { id: "", name: "", email: "", initials: "?", avatarColor: "#7C6FF7", bio: "" };
  }, [authState]);

  /* ─── Trips — real API ─── */
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  const saveTrips = useCallback(async (value: Trip[]) => {
    await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(value));
  }, []);

  const loadLocalTrips = useCallback(async () => {
    const raw = await AsyncStorage.getItem(TRIPS_KEY);
    const localTrips = raw ? (JSON.parse(raw) as Trip[]) : [];
    setTrips(localTrips);
    return localTrips;
  }, []);

  const refreshTrips = useCallback(async () => {
    if (authState.status !== "authenticated") return;
    setTripsLoading(true);
    try {
      const { trips: apiTrips } = await api.trips.list();
      const localTrips = apiTrips.map(toLocalTrip);
      setTrips(localTrips);
      await saveTrips(localTrips);
    } catch {
      await loadLocalTrips();
      // silently fail — trips stays as previous state
    } finally {
      setTripsLoading(false);
    }
  }, [authState.status, loadLocalTrips, saveTrips]);

  useEffect(() => {
    if (authState.status === "authenticated") {
      refreshTrips();
    } else if (authState.status === "unauthenticated") {
      setTrips([]);
    }
  }, [authState.status, refreshTrips]);

  const createTrip = useCallback(
    async (data: Omit<Trip, "id" | "createdAt" | "members" | "shareToken">): Promise<Trip> => {
      try {
        const { trip: apiTrip } = await api.trips.create({
          title: data.title,
          destination: data.destination,
          country: data.country,
          startDate: data.startDate,
          endDate: data.endDate,
          currency: data.currency,
          estimatedBudget: data.totalBudget,
          accentColor: data.accentColor,
          notes: data.notes,
          status: data.status,
          coverImageUrl: data.coverImageUrl ?? undefined,
        });
        const local = toLocalTrip(apiTrip);
        setTrips((prev) => {
          const next = [local, ...prev];
          void saveTrips(next);
          return next;
        });
        return local;
      } catch (err) {
        if (err instanceof ApiError && err.status !== 0) {
          throw err;
        }

        const local: Trip = {
          ...data,
          coverImageUrl: data.coverImageUrl ?? null,
          id: genId(),
          createdAt: new Date().toISOString(),
          members: [
            {
              id: currentUser.id || "local-user",
              name: currentUser.name || "You",
              initials: currentUser.initials || "YO",
              color: currentUser.avatarColor || "#7C6FF7",
              role: "owner",
            },
          ],
          shareToken: Math.random().toString(36).slice(2, 10).toUpperCase(),
        };
        setTrips((prev) => {
          const next = [local, ...prev];
          void saveTrips(next);
          return next;
        });
        return local;
      }
    },
    [currentUser, saveTrips]
  );

  const updateTrip = useCallback(async (id: string, data: Partial<Trip>) => {
    const apiData: Record<string, unknown> = {};
    if (data.title !== undefined) apiData.title = data.title;
    if (data.destination !== undefined) apiData.destination = data.destination;
    if (data.country !== undefined) apiData.country = data.country;
    if (data.startDate !== undefined) apiData.startDate = data.startDate;
    if (data.endDate !== undefined) apiData.endDate = data.endDate;
    if (data.currency !== undefined) apiData.currency = data.currency;
    if (data.totalBudget !== undefined) apiData.estimatedBudget = data.totalBudget;
    if (data.accentColor !== undefined) apiData.accentColor = data.accentColor;
    if (data.notes !== undefined) apiData.notes = data.notes;
    if (data.status !== undefined) apiData.status = data.status;

    try {
      const { trip: apiTrip } = await api.trips.update(id, apiData as any);
      const local = toLocalTrip(apiTrip as TripWithMembers);
      setTrips((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...local, members: t.members } : t));
        void saveTrips(next);
        return next;
      });
    } catch {
      setTrips((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
        void saveTrips(next);
        return next;
      });
    }
  }, [saveTrips]);

  const deleteTrip = useCallback(async (id: string) => {
    try {
      await api.trips.delete(id);
    } catch {}
    setTrips((prev) => {
      const next = prev.filter((t) => t.id !== id);
      void saveTrips(next);
      return next;
    });
  }, [saveTrips]);

  /* ─── Local-only data — AsyncStorage ─── */

  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [itinRaw, budgetRaw, bookingsRaw, checklistRaw, chatRaw, achRaw] =
          await Promise.all([
            AsyncStorage.getItem("tf_itinerary"),
            AsyncStorage.getItem("tf_budget"),
            AsyncStorage.getItem("tf_bookings"),
            AsyncStorage.getItem("tf_checklist"),
            AsyncStorage.getItem("tf_chat"),
            AsyncStorage.getItem("tf_achievements"),
          ]);
        if (itinRaw) setItineraryItems(JSON.parse(itinRaw));
        if (budgetRaw) setBudgetItems(JSON.parse(budgetRaw));
        if (bookingsRaw) setBookings(JSON.parse(bookingsRaw));
        if (checklistRaw) setChecklistItems(JSON.parse(checklistRaw));
        if (chatRaw) setChatMessages(JSON.parse(chatRaw));
        setAchievements(achRaw ? JSON.parse(achRaw) : SEED_ACHIEVEMENTS);
        if (!achRaw) {
          await AsyncStorage.setItem("tf_achievements", JSON.stringify(SEED_ACHIEVEMENTS));
        }
      } catch {}
    })();
  }, []);

  const save = useCallback(async (key: string, value: unknown) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }, []);

  const addItineraryItem = useCallback((item: Omit<ItineraryItem, "id">) => {
    const newItem: ItineraryItem = { ...item, id: genId() };
    setItineraryItems((prev) => { const next = [...prev, newItem]; save("tf_itinerary", next); return next; });
  }, [save]);

  const toggleItineraryBooked = useCallback((id: string) => {
    setItineraryItems((prev) => { const next = prev.map((i) => i.id === id ? { ...i, booked: !i.booked } : i); save("tf_itinerary", next); return next; });
  }, [save]);

  const deleteItineraryItem = useCallback((id: string) => {
    setItineraryItems((prev) => { const next = prev.filter((i) => i.id !== id); save("tf_itinerary", next); return next; });
  }, [save]);

  const addBudgetItem = useCallback((item: Omit<BudgetItem, "id">) => {
    const newItem: BudgetItem = { ...item, id: genId() };
    setBudgetItems((prev) => { const next = [...prev, newItem]; save("tf_budget", next); return next; });
  }, [save]);

  const deleteBudgetItem = useCallback((id: string) => {
    setBudgetItems((prev) => { const next = prev.filter((b) => b.id !== id); save("tf_budget", next); return next; });
  }, [save]);

  const addBooking = useCallback((booking: Omit<Booking, "id">) => {
    const newBooking: Booking = { ...booking, id: genId() };
    setBookings((prev) => { const next = [...prev, newBooking]; save("tf_bookings", next); return next; });
  }, [save]);

  const updateBookingStatus = useCallback((id: string, status: Booking["status"]) => {
    setBookings((prev) => { const next = prev.map((b) => b.id === id ? { ...b, status } : b); save("tf_bookings", next); return next; });
  }, [save]);

  const deleteBooking = useCallback((id: string) => {
    setBookings((prev) => { const next = prev.filter((b) => b.id !== id); save("tf_bookings", next); return next; });
  }, [save]);

  const addChecklistItem = useCallback((item: Omit<ChecklistItem, "id">) => {
    const newItem: ChecklistItem = { ...item, id: genId() };
    setChecklistItems((prev) => { const next = [...prev, newItem]; save("tf_checklist", next); return next; });
  }, [save]);

  const toggleChecklistItem = useCallback((id: string) => {
    setChecklistItems((prev) => { const next = prev.map((c) => c.id === id ? { ...c, checked: !c.checked } : c); save("tf_checklist", next); return next; });
  }, [save]);

  const deleteChecklistItem = useCallback((id: string) => {
    setChecklistItems((prev) => { const next = prev.filter((c) => c.id !== id); save("tf_checklist", next); return next; });
  }, [save]);

  const sendMessage = useCallback((tripId: string, text: string) => {
    const msg: ChatMessage = {
      id: genId(), tripId, userId: currentUser.id, userName: currentUser.name,
      text, timestamp: new Date().toISOString(), isMine: true,
    };
    setChatMessages((prev) => { const next = [...prev, msg]; save("tf_chat", next); return next; });
  }, [currentUser, save]);

  const updateProfile = useCallback((data: Partial<User>) => {
    // Profile updates now handled by AuthContext.updateUser — this is a no-op shim
    // kept for backward compatibility with screens still importing it
    void data;
  }, []);

  return (
    <AppContext.Provider
      value={{
        trips, tripsLoading, refreshTrips,
        itineraryItems, budgetItems, bookings, checklistItems, chatMessages, achievements,
        currentUser,
        createTrip, updateTrip, deleteTrip,
        addItineraryItem, toggleItineraryBooked, deleteItineraryItem,
        addBudgetItem, deleteBudgetItem,
        addBooking, updateBookingStatus, deleteBooking,
        addChecklistItem, toggleChecklistItem, deleteChecklistItem,
        sendMessage, updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

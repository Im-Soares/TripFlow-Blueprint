import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BudgetItem,
  Booking,
  ChecklistItem,
  ItineraryItem,
  useApp,
} from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const COVER_IMAGES: Record<string, ImageSourcePropType> = {
  santorini: require("@/assets/images/trip_santorini.png"),
  tokyo: require("@/assets/images/trip_tokyo.png"),
  bali: require("@/assets/images/trip_bali.png"),
};

type Tab = "overview" | "itinerary" | "budget" | "bookings" | "pack" | "chat" | "invite";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "home" },
  { key: "itinerary", label: "Plan", icon: "calendar" },
  { key: "budget", label: "Budget", icon: "dollar-sign" },
  { key: "bookings", label: "Bookings", icon: "bookmark" },
  { key: "pack", label: "Pack", icon: "package" },
  { key: "chat", label: "Chat", icon: "message-circle" },
  { key: "invite", label: "Share", icon: "share-2" },
];

const BUDGET_CATEGORIES = ["accommodation", "transport", "food", "activities", "shopping", "other"] as const;
const BOOKING_TYPES = ["flight", "hotel", "car", "activity", "restaurant"] as const;
const CHECKLIST_CATEGORIES = ["documents", "clothing", "health", "tech", "other"] as const;
const ITINERARY_TYPES = ["flight", "hotel", "activity", "restaurant", "transport", "other"] as const;

const CATEGORY_ICONS: Record<string, string> = {
  accommodation: "home",
  transport: "navigation",
  food: "coffee",
  activities: "zap",
  shopping: "shopping-bag",
  other: "more-horizontal",
  flight: "send",
  hotel: "home",
  car: "truck",
  activity: "zap",
  restaurant: "coffee",
  documents: "file-text",
  clothing: "tag",
  health: "heart",
  tech: "smartphone",
};

const CATEGORY_COLORS: Record<string, string> = {
  accommodation: "#7C6FF7",
  transport: "#4ECDC4",
  food: "#FFB347",
  activities: "#FF6B6B",
  shopping: "#7C6FF7",
  other: "#7575A0",
  flight: "#4ECDC4",
  hotel: "#7C6FF7",
  car: "#FFB347",
  activity: "#FF6B6B",
  restaurant: "#FFB347",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

// ===== OVERVIEW =====
function OverviewTab({ tripId }: { tripId: string }) {
  const colors = useColors();
  const { trips, itineraryItems, budgetItems, checklistItems, bookings } = useApp();
  const trip = trips.find((t) => t.id === tripId)!;
  const items = itineraryItems.filter((i) => i.tripId === tripId);
  const budget = budgetItems.filter((b) => b.tripId === tripId);
  const checklist = checklistItems.filter((c) => c.tripId === tripId);
  const myBookings = bookings.filter((b) => b.tripId === tripId);
  const spent = budget.reduce((s, b) => s + b.amount, 0);
  const budgetPct = trip.totalBudget > 0 ? Math.min(spent / trip.totalBudget, 1) : 0;
  const checked = checklist.filter((c) => c.checked).length;
  const duration = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
      {/* Dates */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.dateRow}>
          <View style={styles.dateBlock}>
            <Text style={[styles.dateLabel, { color: colors.mutedForeground }]}>Departure</Text>
            <Text style={[styles.dateValue, { color: colors.foreground }]}>{formatDate(trip.startDate)}</Text>
          </View>
          <View style={[styles.dateDivider, { backgroundColor: colors.border }]} />
          <View style={styles.dateBlock}>
            <Text style={[styles.dateLabel, { color: colors.mutedForeground }]}>Return</Text>
            <Text style={[styles.dateValue, { color: colors.foreground }]}>{formatDate(trip.endDate)}</Text>
          </View>
          <View style={[styles.dateDivider, { backgroundColor: colors.border }]} />
          <View style={styles.dateBlock}>
            <Text style={[styles.dateLabel, { color: colors.mutedForeground }]}>Duration</Text>
            <Text style={[styles.dateValue, { color: colors.foreground }]}>{duration}d</Text>
          </View>
        </View>
      </View>

      {/* Quick stats */}
      <View style={styles.statsRow}>
        {[
          { icon: "calendar", val: items.length, label: "Events", color: colors.primary },
          { icon: "bookmark", val: myBookings.filter((b) => b.status === "confirmed").length, label: "Confirmed", color: colors.teal },
          { icon: "package", val: `${checked}/${checklist.length}`, label: "Packed", color: colors.amber },
        ].map((s) => (
          <View key={s.label} style={[styles.miniStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name={s.icon as any} size={16} color={s.color} />
            <Text style={[styles.miniStatVal, { color: colors.foreground }]}>{s.val}</Text>
            <Text style={[styles.miniStatLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Budget progress */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Feather name="dollar-sign" size={16} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Budget</Text>
        </View>
        <View style={styles.budgetNumbers}>
          <View>
            <Text style={[styles.budgetSpent, { color: colors.foreground }]}>
              {trip.currency} {spent.toFixed(0)}
            </Text>
            <Text style={[styles.budgetLabel, { color: colors.mutedForeground }]}>of {trip.currency} {trip.totalBudget}</Text>
          </View>
          <Text style={[styles.budgetPct, { color: budgetPct > 0.9 ? colors.coral : colors.teal }]}>
            {(budgetPct * 100).toFixed(0)}%
          </Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.secondary }]}>
          <View
            style={[styles.progressFill, {
              backgroundColor: budgetPct > 0.9 ? colors.coral : colors.primary,
              width: `${budgetPct * 100}%` as any,
            }]}
          />
        </View>
      </View>

      {/* Members */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Feather name="users" size={16} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Travelers</Text>
        </View>
        {trip.members.map((m) => (
          <View key={m.id} style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: m.color }]}>
              <Text style={styles.memberAvatarText}>{m.initials}</Text>
            </View>
            <Text style={[styles.memberName, { color: colors.foreground }]}>{m.name}</Text>
            <View style={[styles.rolePill, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.roleText, { color: colors.mutedForeground }]}>{m.role}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Notes */}
      {trip.notes ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="file-text" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Notes</Text>
          </View>
          <Text style={[styles.notesText, { color: colors.mutedForeground }]}>{trip.notes}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

// ===== ITINERARY =====
function ItineraryTab({ tripId }: { tripId: string }) {
  const colors = useColors();
  const { trips, itineraryItems, addItineraryItem, toggleItineraryBooked, deleteItineraryItem } = useApp();
  const trip = trips.find((t) => t.id === tripId)!;
  const items = itineraryItems
    .filter((i) => i.tripId === tripId)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", location: "", time: "09:00", day: "1", type: "activity" as ItineraryItem["type"], notes: "", cost: "" });

  const byDay: Record<number, ItineraryItem[]> = {};
  items.forEach((i) => {
    if (!byDay[i.day]) byDay[i.day] = [];
    byDay[i.day].push(i);
  });
  const days = Object.keys(byDay).map(Number).sort((a, b) => a - b);
  const duration = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));

  function submit() {
    if (!form.title.trim()) return;
    addItineraryItem({
      tripId,
      title: form.title.trim(),
      location: form.location.trim(),
      time: form.time,
      day: parseInt(form.day) || 1,
      type: form.type,
      notes: form.notes.trim(),
      booked: false,
      cost: form.cost ? parseFloat(form.cost) : undefined,
    });
    setForm({ title: "", location: "", time: "09:00", day: "1", type: "activity", notes: "", cost: "" });
    setShowAdd(false);
  }

  function dayLabel(day: number) {
    const d = new Date(trip.startDate);
    d.setDate(d.getDate() + day - 1);
    return `Day ${day} — ${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {days.length === 0 ? (
          <View style={{ paddingTop: 20 }}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No activities yet. Tap + to add your first item.</Text>
          </View>
        ) : (
          days.map((day) => (
            <View key={day} style={{ marginBottom: 20 }}>
              <Text style={[styles.dayLabel, { color: colors.primary }]}>{dayLabel(day)}</Text>
              {byDay[day].map((item) => (
                <View key={item.id} style={[styles.itinItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.itinIcon, { backgroundColor: (CATEGORY_COLORS[item.type] ?? colors.primary) + "22" }]}>
                    <Feather name={(CATEGORY_ICONS[item.type] ?? "circle") as any} size={14} color={CATEGORY_COLORS[item.type] ?? colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itinTitle, { color: colors.foreground }]}>{item.title}</Text>
                    {item.location ? <Text style={[styles.itinSub, { color: colors.mutedForeground }]}>{item.location} · {item.time}</Text> : null}
                  </View>
                  {item.cost ? <Text style={[styles.itinCost, { color: colors.teal }]}>${item.cost}</Text> : null}
                  <TouchableOpacity onPress={() => toggleItineraryBooked(item.id)}>
                    <Feather name={item.booked ? "check-circle" : "circle"} size={18} color={item.booked ? colors.teal : colors.mutedForeground} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItineraryItem(item.id)}>
                    <Feather name="trash-2" size={14} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={[styles.addFab, { backgroundColor: colors.primary }]} onPress={() => setShowAdd(true)} activeOpacity={0.85}>
        <Feather name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
            <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Add Activity</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Title" placeholderTextColor={colors.mutedForeground} value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Location" placeholderTextColor={colors.mutedForeground} value={form.location} onChangeText={(v) => setForm((f) => ({ ...f, location: v }))} />
              <View style={styles.inputRow2}>
                <TextInput style={[styles.input, { flex: 1, backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Day (1,2...)" placeholderTextColor={colors.mutedForeground} value={form.day} onChangeText={(v) => setForm((f) => ({ ...f, day: v }))} keyboardType="numeric" />
                <TextInput style={[styles.input, { flex: 1, backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Time (HH:MM)" placeholderTextColor={colors.mutedForeground} value={form.time} onChangeText={(v) => setForm((f) => ({ ...f, time: v }))} />
              </View>
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Cost (optional)" placeholderTextColor={colors.mutedForeground} value={form.cost} onChangeText={(v) => setForm((f) => ({ ...f, cost: v }))} keyboardType="numeric" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {ITINERARY_TYPES.map((t) => (
                    <TouchableOpacity key={t} style={[styles.typeChip, { backgroundColor: form.type === t ? colors.primary : colors.secondary }]} onPress={() => setForm((f) => ({ ...f, type: t }))}>
                      <Text style={[styles.typeChipText, { color: form.type === t ? "#fff" : colors.mutedForeground }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.secondary }]} onPress={() => setShowAdd(false)}><Text style={[styles.modalBtnText, { color: colors.mutedForeground }]}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={submit}><Text style={[styles.modalBtnText, { color: "#fff" }]}>Add</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

// ===== BUDGET =====
function BudgetTab({ tripId }: { tripId: string }) {
  const colors = useColors();
  const { trips, budgetItems, addBudgetItem, deleteBudgetItem } = useApp();
  const trip = trips.find((t) => t.id === tripId)!;
  const items = budgetItems.filter((b) => b.tripId === tripId);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", category: "food" as BudgetItem["category"] });

  const spent = items.reduce((s, b) => s + b.amount, 0);
  const remaining = trip.totalBudget - spent;

  const byCategory: Record<string, number> = {};
  items.forEach((b) => { byCategory[b.category] = (byCategory[b.category] ?? 0) + b.amount; });

  function submit() {
    if (!form.description.trim() || !form.amount) return;
    addBudgetItem({ tripId, description: form.description.trim(), amount: parseFloat(form.amount), category: form.category, date: new Date().toISOString().slice(0, 10), paidBy: "You" });
    setForm({ description: "", amount: "", category: "food" });
    setShowAdd(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 100 }}>
        {/* Summary */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.budgetSummary}>
            <View style={styles.budgetSummaryItem}>
              <Text style={[styles.summaryAmt, { color: colors.foreground }]}>{trip.currency} {trip.totalBudget.toFixed(0)}</Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total Budget</Text>
            </View>
            <View style={styles.budgetSummaryItem}>
              <Text style={[styles.summaryAmt, { color: colors.coral }]}>{trip.currency} {spent.toFixed(0)}</Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Spent</Text>
            </View>
            <View style={styles.budgetSummaryItem}>
              <Text style={[styles.summaryAmt, { color: remaining >= 0 ? colors.teal : colors.destructive }]}>{trip.currency} {Math.abs(remaining).toFixed(0)}</Text>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{remaining >= 0 ? "Remaining" : "Over budget"}</Text>
            </View>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.secondary, marginTop: 12 }]}>
            <View style={[styles.progressFill, { backgroundColor: remaining < 0 ? colors.destructive : colors.primary, width: `${Math.min((spent / trip.totalBudget) * 100, 100)}%` as any }]} />
          </View>
        </View>

        {/* By category */}
        {Object.entries(byCategory).map(([cat, amt]) => (
          <View key={cat} style={[styles.catRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.catIcon, { backgroundColor: (CATEGORY_COLORS[cat] ?? colors.primary) + "22" }]}>
              <Feather name={(CATEGORY_ICONS[cat] ?? "circle") as any} size={14} color={CATEGORY_COLORS[cat] ?? colors.primary} />
            </View>
            <Text style={[styles.catLabel, { color: colors.foreground }]}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
            <Text style={[styles.catAmt, { color: colors.foreground }]}>{trip.currency} {amt.toFixed(0)}</Text>
          </View>
        ))}

        {/* Transactions */}
        <Text style={[styles.sectionHeading, { color: colors.foreground }]}>Transactions</Text>
        {items.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No expenses yet.</Text>
        ) : (
          items.map((b) => (
            <View key={b.id} style={[styles.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.catIcon, { backgroundColor: (CATEGORY_COLORS[b.category] ?? colors.primary) + "22" }]}>
                <Feather name={(CATEGORY_ICONS[b.category] ?? "circle") as any} size={12} color={CATEGORY_COLORS[b.category] ?? colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txTitle, { color: colors.foreground }]}>{b.description}</Text>
                <Text style={[styles.txMeta, { color: colors.mutedForeground }]}>{b.paidBy} · {formatShortDate(b.date)}</Text>
              </View>
              <Text style={[styles.txAmt, { color: colors.foreground }]}>{trip.currency} {b.amount.toFixed(0)}</Text>
              <TouchableOpacity onPress={() => deleteBudgetItem(b.id)}>
                <Feather name="trash-2" size={14} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.addFab, { backgroundColor: colors.primary }]} onPress={() => setShowAdd(true)} activeOpacity={0.85}>
        <Feather name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
            <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Add Expense</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Description" placeholderTextColor={colors.mutedForeground} value={form.description} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))} />
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder={`Amount (${trip.currency})`} placeholderTextColor={colors.mutedForeground} value={form.amount} onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))} keyboardType="numeric" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {BUDGET_CATEGORIES.map((c) => (
                    <TouchableOpacity key={c} style={[styles.typeChip, { backgroundColor: form.category === c ? colors.primary : colors.secondary }]} onPress={() => setForm((f) => ({ ...f, category: c }))}>
                      <Text style={[styles.typeChipText, { color: form.category === c ? "#fff" : colors.mutedForeground }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.secondary }]} onPress={() => setShowAdd(false)}><Text style={[styles.modalBtnText, { color: colors.mutedForeground }]}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={submit}><Text style={[styles.modalBtnText, { color: "#fff" }]}>Add</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

// ===== BOOKINGS =====
function BookingsTab({ tripId }: { tripId: string }) {
  const colors = useColors();
  const { trips, bookings, addBooking, deleteBooking, updateBookingStatus } = useApp();
  const trip = trips.find((t) => t.id === tripId)!;
  const myBookings = bookings.filter((b) => b.tripId === tripId);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", confirmationCode: "", date: "", amount: "", type: "hotel" as Booking["type"], notes: "" });

  function submit() {
    if (!form.title.trim()) return;
    addBooking({ tripId, title: form.title.trim(), confirmationCode: form.confirmationCode.trim(), date: form.date || new Date().toISOString().slice(0, 10), amount: parseFloat(form.amount) || 0, currency: trip.currency, type: form.type, status: "pending", notes: form.notes.trim() });
    setForm({ title: "", confirmationCode: "", date: "", amount: "", type: "hotel", notes: "" });
    setShowAdd(false);
  }

  const STATUS_COLOR: Record<string, string> = { confirmed: colors.teal, pending: colors.amber, cancelled: colors.destructive };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 100 }}>
        {myBookings.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingTop: 20 }]}>No bookings yet. Add your flights, hotels, and more.</Text>
        ) : (
          myBookings.map((b) => (
            <View key={b.id} style={[styles.bookingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.bookingHeader}>
                <View style={[styles.catIcon, { backgroundColor: (CATEGORY_COLORS[b.type] ?? colors.primary) + "22" }]}>
                  <Feather name={(CATEGORY_ICONS[b.type] ?? "bookmark") as any} size={14} color={CATEGORY_COLORS[b.type] ?? colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookingTitle, { color: colors.foreground }]}>{b.title}</Text>
                  <Text style={[styles.bookingMeta, { color: colors.mutedForeground }]}>{formatShortDate(b.date)}{b.checkOut ? ` – ${formatShortDate(b.checkOut)}` : ""}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[b.status] + "22" }]}>
                  <Text style={[styles.statusBadgeText, { color: STATUS_COLOR[b.status] }]}>{b.status}</Text>
                </View>
              </View>
              {b.confirmationCode ? (
                <View style={[styles.codeRow, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>Confirmation</Text>
                  <Text style={[styles.codeValue, { color: colors.primary }]}>{b.confirmationCode}</Text>
                </View>
              ) : null}
              <View style={styles.bookingFooter}>
                <Text style={[styles.bookingAmt, { color: colors.foreground }]}>{b.currency} {b.amount.toFixed(0)}</Text>
                <View style={styles.bookingActions}>
                  {b.status === "pending" && (
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.teal + "22" }]} onPress={() => updateBookingStatus(b.id, "confirmed")}>
                      <Text style={[styles.actionBtnText, { color: colors.teal }]}>Confirm</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => deleteBooking(b.id)}>
                    <Feather name="trash-2" size={14} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.addFab, { backgroundColor: colors.primary }]} onPress={() => setShowAdd(true)} activeOpacity={0.85}>
        <Feather name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
            <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Add Booking</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Title (e.g. Flight BA 298)" placeholderTextColor={colors.mutedForeground} value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Confirmation code" placeholderTextColor={colors.mutedForeground} value={form.confirmationCode} onChangeText={(v) => setForm((f) => ({ ...f, confirmationCode: v }))} />
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder={`Amount (${trip.currency})`} placeholderTextColor={colors.mutedForeground} value={form.amount} onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))} keyboardType="numeric" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {BOOKING_TYPES.map((t) => (
                    <TouchableOpacity key={t} style={[styles.typeChip, { backgroundColor: form.type === t ? colors.primary : colors.secondary }]} onPress={() => setForm((f) => ({ ...f, type: t }))}>
                      <Text style={[styles.typeChipText, { color: form.type === t ? "#fff" : colors.mutedForeground }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.secondary }]} onPress={() => setShowAdd(false)}><Text style={[styles.modalBtnText, { color: colors.mutedForeground }]}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={submit}><Text style={[styles.modalBtnText, { color: "#fff" }]}>Add</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

// ===== CHECKLIST / PACK =====
function PackTab({ tripId }: { tripId: string }) {
  const colors = useColors();
  const { checklistItems, addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useApp();
  const items = checklistItems.filter((c) => c.tripId === tripId);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ChecklistItem["category"]>("other");

  const checked = items.filter((c) => c.checked).length;
  const byCategory: Record<string, ChecklistItem[]> = {};
  items.forEach((c) => { if (!byCategory[c.category]) byCategory[c.category] = []; byCategory[c.category].push(c); });

  function submit() {
    if (!newTitle.trim()) return;
    addChecklistItem({ tripId, title: newTitle.trim(), checked: false, category: newCategory });
    setNewTitle("");
    setShowAdd(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 4, paddingBottom: 100 }}>
        {/* Progress */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 8 }]}>
          <View style={styles.packProgress}>
            <Text style={[styles.packProgressText, { color: colors.foreground }]}>{checked} / {items.length} packed</Text>
            <Text style={[styles.packPct, { color: items.length > 0 && checked === items.length ? colors.teal : colors.mutedForeground }]}>
              {items.length > 0 ? `${Math.round((checked / items.length) * 100)}%` : "0%"}
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.secondary, marginTop: 8 }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.teal, width: items.length > 0 ? `${(checked / items.length) * 100}%` as any : "0%" }]} />
          </View>
        </View>

        {Object.entries(byCategory).map(([cat, catItems]) => (
          <View key={cat} style={{ marginBottom: 12 }}>
            <Text style={[styles.dayLabel, { color: colors.primary }]}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
            {catItems.map((item) => (
              <View key={item.id} style={[styles.checkRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => toggleChecklistItem(item.id)} style={styles.checkbox}>
                  <Feather name={item.checked ? "check-square" : "square"} size={20} color={item.checked ? colors.teal : colors.mutedForeground} />
                </TouchableOpacity>
                <Text style={[styles.checkLabel, { color: item.checked ? colors.mutedForeground : colors.foreground, textDecorationLine: item.checked ? "line-through" : "none" }]}>{item.title}</Text>
                <TouchableOpacity onPress={() => deleteChecklistItem(item.id)}>
                  <Feather name="x" size={14} color={colors.destructive} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        {items.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingTop: 20 }]}>No items yet. Add what you need to pack.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.addFab, { backgroundColor: colors.primary }]} onPress={() => setShowAdd(true)} activeOpacity={0.85}>
        <Feather name="plus" size={22} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
            <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
              <View style={styles.modalHandle} />
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Add Item</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground }]} placeholder="Item name" placeholderTextColor={colors.mutedForeground} value={newTitle} onChangeText={setNewTitle} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {CHECKLIST_CATEGORIES.map((c) => (
                    <TouchableOpacity key={c} style={[styles.typeChip, { backgroundColor: newCategory === c ? colors.primary : colors.secondary }]} onPress={() => setNewCategory(c)}>
                      <Text style={[styles.typeChipText, { color: newCategory === c ? "#fff" : colors.mutedForeground }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.secondary }]} onPress={() => setShowAdd(false)}><Text style={[styles.modalBtnText, { color: colors.mutedForeground }]}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.primary }]} onPress={submit}><Text style={[styles.modalBtnText, { color: "#fff" }]}>Add</Text></TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

// ===== CHAT =====
function ChatTab({ tripId }: { tripId: string }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chatMessages, sendMessage } = useApp();
  const messages = chatMessages.filter((m) => m.tripId === tripId);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);

  function send() {
    if (!text.trim()) return;
    sendMessage(tripId, text.trim());
    setText("");
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>
      <FlatList
        ref={listRef}
        data={[...messages].reverse()}
        inverted
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12, gap: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.msgRow, { justifyContent: item.isMine ? "flex-end" : "flex-start" }]}>
            {!item.isMine && (
              <View style={[styles.msgAvatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.msgAvatarText}>{item.userName.slice(0, 1)}</Text>
              </View>
            )}
            <View style={{ maxWidth: "75%" }}>
              {!item.isMine && <Text style={[styles.msgName, { color: colors.mutedForeground }]}>{item.userName}</Text>}
              <View style={[styles.msgBubble, { backgroundColor: item.isMine ? colors.primary : colors.card, borderColor: colors.border }]}>
                <Text style={[styles.msgText, { color: item.isMine ? "#fff" : colors.foreground }]}>{item.text}</Text>
              </View>
              <Text style={[styles.msgTime, { color: colors.mutedForeground }]}>{formatTime(item.timestamp)}</Text>
            </View>
          </View>
        )}
      />
      <View style={[styles.chatInput, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          style={[styles.chatTextInput, { backgroundColor: colors.secondary, color: colors.foreground }]}
          placeholder="Message..."
          placeholderTextColor={colors.mutedForeground}
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.secondary }]} onPress={send} activeOpacity={0.85}>
          <Feather name="send" size={18} color={text.trim() ? "#fff" : colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ===== INVITE / SHARE =====
function InviteTab({ tripId }: { tripId: string }) {
  const colors = useColors();
  const { trips } = useApp();
  const trip = trips.find((t) => t.id === tripId)!;

  const shareLink = `https://tripflow.app/join/${trip.shareToken}`;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 40 }}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: "center", gap: 12 }]}>
        <View style={[styles.shareIcon, { backgroundColor: colors.primary + "22" }]}>
          <Feather name="share-2" size={28} color={colors.primary} />
        </View>
        <Text style={[styles.shareTitle, { color: colors.foreground }]}>Invite Travelers</Text>
        <Text style={[styles.shareSub, { color: colors.mutedForeground }]}>Share your trip with friends and family. They can view and collaborate in real time.</Text>
        <View style={[styles.codeBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Text style={[styles.codeBoxText, { color: colors.primary }]}>{trip.shareToken}</Text>
        </View>
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert("Share Link Copied!", `Share this invite code with your travel crew:\n\n${trip.shareToken}\n\nThey can join at: ${shareLink}`)}
          activeOpacity={0.85}
        >
          <Feather name="copy" size={16} color="#fff" />
          <Text style={[styles.shareBtnText, { color: "#fff" }]}>Copy Invite Code</Text>
        </TouchableOpacity>
      </View>

      {/* Current members */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground, marginBottom: 12 }]}>Current Travelers</Text>
        {trip.members.map((m) => (
          <View key={m.id} style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: m.color }]}>
              <Text style={styles.memberAvatarText}>{m.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.memberName, { color: colors.foreground }]}>{m.name}</Text>
              <Text style={[styles.memberRole, { color: colors.mutedForeground }]}>{m.role}</Text>
            </View>
            {m.role !== "owner" && (
              <TouchableOpacity onPress={() => Alert.alert("Remove", `Remove ${m.name} from this trip?`, [{ text: "Cancel" }, { text: "Remove", style: "destructive" }])}>
                <Feather name="user-minus" size={16} color={colors.destructive} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Link info */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground, marginBottom: 8 }]}>How it works</Text>
        {[
          { icon: "link", text: "Share your invite code with anyone" },
          { icon: "user-plus", text: "They enter it in TripFlow Explore tab" },
          { icon: "eye", text: "They join as a viewer by default" },
          { icon: "edit-2", text: "Promote them to editor in member settings" },
        ].map((step, i) => (
          <View key={i} style={styles.howStep}>
            <View style={[styles.stepIcon, { backgroundColor: colors.primary + "22" }]}>
              <Feather name={step.icon as any} size={14} color={colors.primary} />
            </View>
            <Text style={[styles.stepText, { color: colors.mutedForeground }]}>{step.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ===== MAIN SCREEN =====
export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const trip = trips.find((t) => t.id === id);
  if (!trip) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Trip not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[{ color: colors.primary, marginTop: 12, fontFamily: "Inter_500Medium" }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cover = trip.coverImageUrl ? { uri: trip.coverImageUrl } : trip.localCover ? COVER_IMAGES[trip.localCover] : null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      {/* Hero header */}
      <View style={styles.heroContainer}>
        {cover ? (
          <Image source={cover} style={styles.heroBg} />
        ) : (
          <View style={[styles.heroBg, { backgroundColor: trip.accentColor + "44" }]} />
        )}
        <LinearGradient colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.75)"]} style={StyleSheet.absoluteFill} />
        <View style={[styles.heroContent, { paddingTop: Platform.OS === "web" ? 67 + 8 : insets.top + 8 }]}> 
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{trip.title}</Text>
            <Text style={styles.heroSub}>{trip.destination}, {trip.country}</Text>
          </View>
        </View>
      </View>

      {/* Tab bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Feather name={tab.icon as any} size={14} color={activeTab === tab.key ? colors.primary : colors.mutedForeground} />
              <Text style={[styles.tabLabel, { color: activeTab === tab.key ? colors.primary : colors.mutedForeground }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab content */}
      <View style={styles.tabContent}>
        {activeTab === "overview" && <OverviewTab tripId={id!} />}
        {activeTab === "itinerary" && <ItineraryTab tripId={id!} />}
        {activeTab === "budget" && <BudgetTab tripId={id!} />}
        {activeTab === "bookings" && <BookingsTab tripId={id!} />}
        {activeTab === "pack" && <PackTab tripId={id!} />}
        {activeTab === "chat" && <ChatTab tripId={id!} />}
        {activeTab === "invite" && <InviteTab tripId={id!} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  notFoundText: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  heroContainer: { height: 180, position: "relative", overflow: "hidden" },
  heroBg: { width: "100%", height: "100%", position: "absolute", resizeMode: "cover" },
  heroContent: { flex: 1, flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center", marginTop: 4 },
  heroText: { flex: 1, justifyContent: "flex-end", paddingBottom: 12, marginTop: "auto" },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff" },
  heroSub: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.8)", marginTop: 2 },
  tabBar: { borderBottomWidth: 1 },
  tabBarContent: { paddingHorizontal: 8 },
  tabItem: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  tabContent: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateBlock: { flex: 1, alignItems: "center", gap: 4 },
  dateLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  dateValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  dateDivider: { width: 1, height: 32, marginHorizontal: 8 },
  statsRow: { flexDirection: "row", gap: 10 },
  miniStat: { flex: 1, alignItems: "center", gap: 6, paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
  miniStatVal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  miniStatLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  budgetNumbers: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  budgetSpent: { fontSize: 22, fontFamily: "Inter_700Bold" },
  budgetLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  budgetPct: { fontSize: 16, fontFamily: "Inter_700Bold" },
  progressBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  memberAvatarText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#fff" },
  memberName: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  memberRole: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rolePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  roleText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  notesText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  dayLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  itinItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  itinIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itinTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  itinSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  itinCost: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginRight: 6 },
  addFab: { position: "absolute", right: 0, bottom: 24, width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", elevation: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(128,128,128,0.3)", alignSelf: "center", marginBottom: 8 },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
  input: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: "Inter_400Regular" },
  inputRow2: { flexDirection: "row", gap: 10 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  typeChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 4 },
  modalBtn: { flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: 12 },
  modalBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 20 },
  budgetSummary: { flexDirection: "row" },
  budgetSummaryItem: { flex: 1, alignItems: "center", gap: 4 },
  summaryAmt: { fontSize: 18, fontFamily: "Inter_700Bold" },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  catRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  catIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  catLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  catAmt: { fontSize: 15, fontFamily: "Inter_700Bold" },
  sectionHeading: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginTop: 8 },
  txRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  txTitle: { fontSize: 14, fontFamily: "Inter_500Medium" },
  txMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  txAmt: { fontSize: 14, fontFamily: "Inter_700Bold", marginRight: 8 },
  bookingCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  bookingHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  bookingTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  bookingMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  codeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderRadius: 8 },
  codeLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  codeValue: { fontSize: 13, fontFamily: "Inter_700Bold" },
  bookingFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bookingAmt: { fontSize: 15, fontFamily: "Inter_700Bold" },
  bookingActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  actionBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
  checkbox: { padding: 2 },
  checkLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  packProgress: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  packProgressText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  packPct: { fontSize: 15, fontFamily: "Inter_700Bold" },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 4 },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  msgAvatarText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  msgName: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 3, marginLeft: 4 },
  msgBubble: { borderRadius: 16, padding: 12, borderWidth: 1 },
  msgText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  msgTime: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 3, marginHorizontal: 4 },
  chatInput: { flexDirection: "row", alignItems: "flex-end", gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  chatTextInput: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular", maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  shareIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginTop: 8 },
  shareTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  shareSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  codeBox: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 24, paddingVertical: 14 },
  codeBoxText: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  shareBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginBottom: 8 },
  shareBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  howStep: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  stepIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  stepText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});

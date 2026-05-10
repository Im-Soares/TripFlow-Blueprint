import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React, { useState, useMemo } from "react";
import {
  Alert,
  Dimensions,
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

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

// MODAL COMPONENTS
function ModalInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: any;
  colors: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.secondary }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function QuickActionModal({
  visible,
  onClose,
  title,
  type,
  colors,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  type: "activity" | "expense" | "booking";
  colors: any;
  onSave: (data: any) => void;
}) {
  const [data, setData] = useState<any>({});

  const handleSave = () => {
    onSave(data);
    setData({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView style={styles.modalForm}>
            {type === "activity" && (
              <>
                <ModalInput
                  label="Activity Title"
                  value={data.title || ""}
                  onChangeText={(text) => setData({ ...data, title: text })}
                  placeholder="e.g., Eiffel Tower visit"
                  colors={colors}
                />
                <ModalInput
                  label="Location"
                  value={data.location || ""}
                  onChangeText={(text) => setData({ ...data, location: text })}
                  placeholder="e.g., Paris, France"
                  colors={colors}
                />
                <ModalInput
                  label="Time"
                  value={data.time || ""}
                  onChangeText={(text) => setData({ ...data, time: text })}
                  placeholder="e.g., 10:00 AM"
                  colors={colors}
                />
                <ModalInput
                  label="Notes"
                  value={data.notes || ""}
                  onChangeText={(text) => setData({ ...data, notes: text })}
                  placeholder="Add any details..."
                  colors={colors}
                />
              </>
            )}

            {type === "expense" && (
              <>
                <ModalInput
                  label="Description"
                  value={data.description || ""}
                  onChangeText={(text) => setData({ ...data, description: text })}
                  placeholder="e.g., Dinner at La Tour"
                  colors={colors}
                />
                <ModalInput
                  label="Amount"
                  value={data.amount || ""}
                  onChangeText={(text) => setData({ ...data, amount: text })}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  colors={colors}
                />
                <ModalInput
                  label="Paid By"
                  value={data.paidBy || ""}
                  onChangeText={(text) => setData({ ...data, paidBy: text })}
                  placeholder="Your name"
                  colors={colors}
                />
                <ModalInput
                  label="Date"
                  value={data.date || ""}
                  onChangeText={(text) => setData({ ...data, date: text })}
                  placeholder="YYYY-MM-DD"
                  colors={colors}
                />
              </>
            )}

            {type === "booking" && (
              <>
                <ModalInput
                  label="Booking Title"
                  value={data.title || ""}
                  onChangeText={(text) => setData({ ...data, title: text })}
                  placeholder="e.g., Hotel Indigo Paris"
                  colors={colors}
                />
                <ModalInput
                  label="Provider"
                  value={data.provider || ""}
                  onChangeText={(text) => setData({ ...data, provider: text })}
                  placeholder="e.g., Booking.com"
                  colors={colors}
                />
                <ModalInput
                  label="Confirmation Code"
                  value={data.confirmationCode || ""}
                  onChangeText={(text) => setData({ ...data, confirmationCode: text })}
                  placeholder="Reference number"
                  colors={colors}
                />
                <ModalInput
                  label="Price"
                  value={data.amount || ""}
                  onChangeText={(text) => setData({ ...data, amount: text })}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  colors={colors}
                />
              </>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1 }]}
              onPress={onClose}
            >
              <Text style={[styles.modalBtnText, { color: colors.foreground }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={[styles.modalBtnText, { color: "#fff" }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "22" }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: colors.foreground }]}>
          {typeof value === "number" && value === 0 ? "0" : value || "—"}
        </Text>
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips, achievements, currentUser, tripsLoading, addItineraryItem, addBudgetItem, addBooking, itineraryItems } = useApp();

  // Modal states
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const isWeb = Platform.OS === "web";
  const isMobile = Platform.OS !== "web" && Platform.OS !== "android";

  // Trip calculations
  const upcoming = trips.filter((t) => t.status === "upcoming" || t.status === "ongoing");
  const planning = trips.filter((t) => t.status === "planning");
  const activeTrip = planning.length > 0 ? planning[0] : upcoming[0];
  const completedTrips = trips.filter((t) => t.status === "completed").length;
  const countries = new Set(trips.map((t) => t.country).filter(Boolean)).size;
  const totalDays = trips.reduce((acc, t) => {
    const diff = new Date(t.endDate).getTime() - new Date(t.startDate).getTime();
    return acc + Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, 0);
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  // Upcoming activities
  const upcomingActivities = useMemo(() => {
    if (!activeTrip) return [];
    return itineraryItems
      .filter((item) => item.tripId === activeTrip.id)
      .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
      .slice(0, 4);
  }, [activeTrip, itineraryItems]);

  // Recent activity (mock data for now)
  const recentActivity = [
    { id: "1", user: "You", action: "Added activity", time: "2 hours ago", icon: "plus-circle" },
    { id: "2", user: "Team", action: "Updated itinerary", time: "5 hours ago", icon: "edit-3" },
  ];

  // Discovery destinations (mock data)
  const destinations = [
    { id: "1", name: "Kyoto, Japan", desc: "Ancient temples & gardens", price: "from €890", emoji: "🏯" },
    { id: "2", name: "Bali, Indonesia", desc: "Beaches & culture", price: "from €420", emoji: "🏝️" },
    { id: "3", name: "Barcelona, Spain", desc: "Architecture & food", price: "from €650", emoji: "🏛️" },
    { id: "4", name: "Marrakech, Morocco", desc: "Markets & desert", price: "from €540", emoji: "🕌" },
  ];

  function greet() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function handleAddActivity(data: any) {
    if (!activeTrip) {
      Alert.alert("No active trip", "Create or select a trip first");
      return;
    }
    addItineraryItem({
      tripId: activeTrip.id,
      day: 1,
      time: data.time || "10:00 AM",
      title: data.title,
      location: data.location,
      type: "activity",
      notes: data.notes,
      booked: false,
    });
    Alert.alert("Success", "Activity added!");
  }

  function handleAddExpense(data: any) {
    if (!activeTrip) {
      Alert.alert("No active trip", "Create or select a trip first");
      return;
    }
    addBudgetItem({
      tripId: activeTrip.id,
      category: "activities",
      amount: parseFloat(data.amount) || 0,
      date: data.date || new Date().toISOString().split("T")[0],
      description: data.description,
      paidBy: data.paidBy,
    });
    Alert.alert("Success", "Expense tracked!");
  }

  function handleAddBooking(data: any) {
    if (!activeTrip) {
      Alert.alert("No active trip", "Create or select a trip first");
      return;
    }
    addBooking({
      tripId: activeTrip.id,
      type: "activity",
      title: data.title,
      confirmationCode: data.confirmationCode,
      date: data.date || new Date().toISOString(),
      amount: parseFloat(data.amount) || 0,
      currency: activeTrip.currency,
      status: "confirmed",
      notes: data.provider,
    });
    Alert.alert("Success", "Booking saved!");
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: isWeb ? 34 + 84 : insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: topInset + 16 }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>{greet()}</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {currentUser.name.split(" ")[0]}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: currentUser.avatarColor }]}
            onPress={() => router.push("/(tabs)/profile")}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{currentUser.initials}</Text>
          </TouchableOpacity>
        </View>

        {activeTrip ? (
          <>
            {/* ACTIVE TRIP HERO */}
            <View style={styles.heroSection}>
              <LinearGradient
                colors={[activeTrip.accentColor + "40", activeTrip.accentColor + "10"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.heroCard, { borderColor: colors.border }]}
              >
                <View style={styles.heroContent}>
                  <View>
                    <Text style={[styles.heroTag, { color: activeTrip.accentColor }]}>
                      {activeTrip.status === "planning" ? "PLANNING" : "UPCOMING"}
                    </Text>
                    <Text style={[styles.heroTitle, { color: colors.foreground }]}>
                      {activeTrip.title}
                    </Text>
                    <Text style={[styles.heroDestination, { color: colors.mutedForeground }]}>
                      📍 {activeTrip.destination}, {activeTrip.country}
                    </Text>
                  </View>
                </View>

                <View style={styles.heroStats}>
                  <View style={styles.heroStatItem}>
                    <Text style={[styles.heroStatValue, { color: activeTrip.accentColor }]}>
                      {activeTrip.members.length}
                    </Text>
                    <Text style={[styles.heroStatLabel, { color: colors.mutedForeground }]}>Travelers</Text>
                  </View>
                  <View style={styles.heroDivider} />
                  <View style={styles.heroStatItem}>
                    <Text style={[styles.heroStatValue, { color: activeTrip.accentColor }]}>
                      {activeTrip.totalBudget ? `€${activeTrip.totalBudget}` : "—"}
                    </Text>
                    <Text style={[styles.heroStatLabel, { color: colors.mutedForeground }]}>Budget</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.heroBtn, { backgroundColor: activeTrip.accentColor }]}
                  onPress={() => router.push(`/trip/${activeTrip.id}`)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.heroBtnText}>Continue Planning</Text>
                  <Feather name="arrow-right" size={16} color="#fff" />
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* QUICK ACTIONS */}
            <View style={styles.quickActionsSection}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={[styles.quickActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setShowActivityModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.qaIcon, { backgroundColor: colors.primary + "22" }]}>
                    <Feather name="map-pin" size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.qaLabel, { color: colors.foreground }]}>Add Activity</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setShowExpenseModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.qaIcon, { backgroundColor: colors.coral + "22" }]}>
                    <Feather name="dollar-sign" size={20} color={colors.coral} />
                  </View>
                  <Text style={[styles.qaLabel, { color: colors.foreground }]}>Add Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setShowBookingModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.qaIcon, { backgroundColor: colors.teal + "22" }]}>
                    <Feather name="check-circle" size={20} color={colors.teal} />
                  </View>
                  <Text style={[styles.qaLabel, { color: colors.foreground }]}>Add Booking</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* UPCOMING ACTIVITIES */}
            {upcomingActivities.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Today & Upcoming</Text>
                  <TouchableOpacity onPress={() => router.push(`/trip/${activeTrip.id}`)}>
                    <Text style={[styles.seeAll, { color: colors.primary }]}>Full Schedule</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeline}>
                  {upcomingActivities.map((item, idx) => (
                    <View key={item.id} style={styles.timelineItem}>
                      <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                      {idx < upcomingActivities.length - 1 && (
                        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>
                          {item.time}
                        </Text>
                        <Text style={[styles.activityTitle, { color: colors.foreground }]}>
                          {item.title}
                        </Text>
                        {item.location && (
                          <Text style={[styles.activityLocation, { color: colors.mutedForeground }]}>
                            📍 {item.location}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* RECENT ACTIVITY */}
            {recentActivity.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Updates</Text>
                <View style={[styles.feedCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {recentActivity.map((act, idx) => (
                    <View key={act.id}>
                      <View style={styles.feedItem}>
                        <View style={[styles.feedIcon, { backgroundColor: colors.primary + "22" }]}>
                          <Feather name={act.icon as any} size={16} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.feedAction, { color: colors.foreground }]}>
                            <Text style={{ fontFamily: "Inter_600SemiBold" }}>{act.user}</Text> {act.action}
                          </Text>
                          <Text style={[styles.feedTime, { color: colors.mutedForeground }]}>
                            {act.time}
                          </Text>
                        </View>
                      </View>
                      {idx < recentActivity.length - 1 && (
                        <View style={[styles.feedDivider, { backgroundColor: colors.border }]} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          /* EMPTY STATE */
          <View style={styles.emptyHero}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.primary + "22" }]}>
              <Feather name="map" size={56} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Let's plan a trip!</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Create your first adventure and start planning
            </Text>
            <TouchableOpacity
              style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/create-trip")}
              activeOpacity={0.85}
            >
              <Feather name="plus" size={18} color="#fff" />
              <Text style={styles.ctaBtnText}>Create a Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* IMPROVED STATS */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Travel Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Trips" value={trips.length} icon="map" color={colors.primary} />
            <StatCard label="Countries" value={countries || 0} icon="globe" color={colors.coral} />
            <StatCard label="Days" value={totalDays || 0} icon="sun" color={colors.teal} />
            <StatCard label="Awards" value={unlockedAchievements || 0} icon="award" color={colors.amber} />
          </View>
        </View>

        {/* DISCOVER DESTINATIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Discover</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>More</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoverScroll}
            scrollEventThrottle={16}
          >
            {destinations.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={[styles.discoverCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary + "20", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.discoverGradient}
                />
                <View style={styles.discoverContent}>
                  <Text style={styles.discoverEmoji}>{dest.emoji}</Text>
                  <Text style={[styles.discoverName, { color: colors.foreground }]}>{dest.name}</Text>
                  <Text style={[styles.discoverDesc, { color: colors.mutedForeground }]}>
                    {dest.desc}
                  </Text>
                  <Text style={[styles.discoverPrice, { color: colors.primary }]}>{dest.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* MODALS */}
      <QuickActionModal
        visible={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Add Activity"
        type="activity"
        colors={colors}
        onSave={handleAddActivity}
      />
      <QuickActionModal
        visible={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Add Expense"
        type="expense"
        colors={colors}
        onSave={handleAddExpense}
      />
      <QuickActionModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Add Booking"
        type="booking"
        colors={colors}
        onSave={handleAddBooking}
      />

      {/* FAB for mobile */}
      {!isWeb && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/create-trip")}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerContent: { gap: 4 },
  greeting: { fontSize: 14, fontFamily: "Inter_400Regular" },
  name: { fontSize: 32, fontFamily: "Inter_700Bold" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },

  // HERO SECTION
  heroSection: { paddingHorizontal: 20, marginBottom: 32 },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 20,
  },
  heroContent: { gap: 8 },
  heroTag: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  heroTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginTop: 4 },
  heroDestination: { fontSize: 15, fontFamily: "Inter_400Regular", marginTop: 6 },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
  },
  heroStatItem: { flex: 1, alignItems: "center" },
  heroStatValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  heroStatLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  heroDivider: { width: 1, height: 40 },
  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  heroBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },

  // QUICK ACTIONS
  quickActionsSection: { paddingHorizontal: 20, marginBottom: 32 },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  qaIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  qaLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center" },

  // STATS
  statsSection: { paddingHorizontal: 20, marginBottom: 32 },
  statsGrid: { gap: 10, marginTop: 14 },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statContent: { flex: 1, gap: 2 },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },

  // TIMELINE
  section: { paddingHorizontal: 20, marginBottom: 28 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  timeline: { gap: 2 },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 12,
  },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  timelineLine: { position: "absolute", left: 4, top: 20, width: 2, height: 60 },
  activityTime: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 2 },
  activityTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  activityLocation: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },

  // FEED
  feedCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 12,
  },
  feedItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
  },
  feedIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  feedAction: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  feedTime: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  feedDivider: { height: 1, marginHorizontal: 14 },

  // DISCOVER
  discoverScroll: { paddingHorizontal: 20, gap: 12, paddingRight: 20 },
  discoverCard: {
    width: 160,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    paddingTop: 12,
  },
  discoverGradient: { position: "absolute", top: 0, left: 0, right: 0, height: 80 },
  discoverContent: {
    padding: 14,
    gap: 6,
  },
  discoverEmoji: { fontSize: 32, marginBottom: 4 },
  discoverName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  discoverDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 16 },
  discoverPrice: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 4 },

  // EMPTY STATE
  emptyHero: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 40,
  },
  emptyIcon: { width: 100, height: 100, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptySub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 12,
  },
  ctaBtnText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },

  // FAB
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  modalForm: { paddingHorizontal: 20, paddingVertical: 8 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});

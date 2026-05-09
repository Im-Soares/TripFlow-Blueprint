import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TripCard } from "@/components/TripCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "22" }]}>
        <Feather name={icon as any} size={16} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips, achievements, currentUser, tripsLoading, refreshTrips } = useApp();

  const upcoming = trips.filter((t) => t.status === "upcoming" || t.status === "ongoing");
  const nextTrip = upcoming[0];
  const completedTrips = trips.filter((t) => t.status === "completed").length;
  const countries = new Set(trips.map((t) => t.country)).size;
  const totalDays = trips.reduce((acc, t) => {
    const diff = new Date(t.endDate).getTime() - new Date(t.startDate).getTime();
    return acc + Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, 0);
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  function greet() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>{greet()}</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{currentUser.name.split(" ")[0]}</Text>
        </View>
        <TouchableOpacity
          style={[styles.avatar, { backgroundColor: currentUser.avatarColor }]}
          onPress={() => router.push("/(tabs)/profile")}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{currentUser.initials}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard label="Trips" value={trips.length} icon="map" color={colors.primary} />
        <StatCard label="Countries" value={countries} icon="globe" color={colors.coral} />
        <StatCard label="Days" value={totalDays} icon="sun" color={colors.teal} />
        <StatCard label="Awards" value={unlockedAchievements} icon="award" color={colors.amber} />
      </View>

      {/* Next trip */}
      {nextTrip && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Next Adventure</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/trips")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <TripCard trip={nextTrip} variant="large" />
        </View>
      )}

      {/* All upcoming */}
      {upcoming.length > 1 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Coming Up</Text>
          {upcoming.slice(1).map((t) => (
            <TripCard key={t.id} trip={t} variant="compact" />
          ))}
        </View>
      )}

      {/* Completed */}
      {completedTrips > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Past Trips</Text>
          {trips
            .filter((t) => t.status === "completed")
            .map((t) => (
              <TripCard key={t.id} trip={t} variant="compact" />
            ))}
        </View>
      )}

      {/* Empty state */}
      {trips.length === 0 && (
        <View style={styles.emptyHero}>
          <Feather name="map" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No trips yet</Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>Start planning your next adventure</Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/create-trip")}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>Create a Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: { fontSize: 14, fontFamily: "Inter_400Regular" },
  name: { fontSize: 26, fontFamily: "Inter_700Bold", marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff" },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  emptyHero: { alignItems: "center", gap: 12, paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center" },
  ctaBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  ctaBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});

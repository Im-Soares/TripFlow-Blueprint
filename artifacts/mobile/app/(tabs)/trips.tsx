import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { TripCard } from "@/components/TripCard";
import { Trip, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type FilterStatus = "all" | "upcoming" | "planning" | "ongoing" | "completed";

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "planning", label: "Planning" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Done" },
];

export default function TripsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips } = useApp();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const filtered = trips.filter((t: Trip) => {
    const matchesFilter = filter === "all" || t.status === filter;
    const matchesSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.country.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 16, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Trips</Text>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/create-trip")}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: colors.secondary, marginHorizontal: 20 }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search trips..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.key ? colors.primary : colors.secondary,
                borderColor: filter === f.key ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f.key ? "#fff" : colors.mutedForeground },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <EmptyState
            icon="map"
            title={search ? "No trips found" : "No trips yet"}
            subtitle={search ? "Try a different search term" : "Create your first trip to get started"}
            actionLabel={search ? undefined : "Create Trip"}
            onAction={search ? undefined : () => router.push("/create-trip")}
          />
        ) : (
          filtered.map((trip: Trip) => (
            <TripCard key={trip.id} trip={trip} variant="large" />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  filtersScroll: { flexGrow: 0 },
  filtersRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 20, paddingTop: 4 },
});

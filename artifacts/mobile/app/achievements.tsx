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

import { Achievement, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORY_LABELS: Record<string, string> = {
  trips: "Trips",
  countries: "Countries",
  planning: "Planning",
};

export default function AchievementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { achievements } = useApp();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const unlocked = achievements.filter((a) => a.unlocked).length;
  const categories = ["trips", "countries", "planning"] as const;

  function AchBadge({ a }: { a: Achievement }) {
    const pct = a.maxProgress > 0 ? a.progress / a.maxProgress : 0;
    return (
      <View
        style={[
          styles.achCard,
          {
            backgroundColor: colors.card,
            borderColor: a.unlocked ? colors.teal + "66" : colors.border,
            opacity: a.unlocked ? 1 : 0.65,
          },
        ]}
      >
        <View
          style={[
            styles.achIconWrap,
            {
              backgroundColor: a.unlocked ? colors.teal + "22" : colors.secondary,
            },
          ]}
        >
          <Feather
            name={a.icon as any}
            size={22}
            color={a.unlocked ? colors.teal : colors.mutedForeground}
          />
          {a.unlocked && (
            <View style={[styles.unlockDot, { backgroundColor: colors.teal }]} />
          )}
        </View>
        <Text
          style={[
            styles.achTitle,
            { color: a.unlocked ? colors.foreground : colors.mutedForeground },
          ]}
          numberOfLines={1}
        >
          {a.title}
        </Text>
        <Text
          style={[styles.achDesc, { color: colors.mutedForeground }]}
          numberOfLines={2}
        >
          {a.description}
        </Text>
        {!a.unlocked && a.maxProgress > 1 && (
          <View style={{ width: "100%", gap: 4 }}>
            <View style={[styles.progressBar, { backgroundColor: colors.secondary }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: colors.primary, width: `${pct * 100}%` as any },
                ]}
              />
            </View>
            <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
              {a.progress} / {a.maxProgress}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 60 : insets.bottom + 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Achievements</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Progress banner */}
      <View
        style={[
          styles.banner,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.bannerLeft}>
          <Feather name="award" size={28} color={colors.amber} />
          <View style={{ gap: 2 }}>
            <Text style={[styles.bannerValue, { color: colors.foreground }]}>
              {unlocked} Unlocked
            </Text>
            <Text style={[styles.bannerLabel, { color: colors.mutedForeground }]}>
              of {achievements.length} achievements
            </Text>
          </View>
        </View>
        <View style={[styles.bannerProgress, { gap: 4 }]}>
          <View
            style={[styles.progressBar, { backgroundColor: colors.secondary, height: 8 }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.amber,
                  height: 8,
                  borderRadius: 4,
                  width: `${(unlocked / achievements.length) * 100}%` as any,
                },
              ]}
            />
          </View>
          <Text style={[styles.bannerPct, { color: colors.amber }]}>
            {Math.round((unlocked / achievements.length) * 100)}%
          </Text>
        </View>
      </View>

      {/* By category */}
      {categories.map((cat) => {
        const catAchs = achievements.filter((a) => a.category === cat);
        if (catAchs.length === 0) return null;
        return (
          <View key={cat} style={styles.section}>
            <View style={styles.catHeader}>
              <Text style={[styles.catTitle, { color: colors.foreground }]}>
                {CATEGORY_LABELS[cat]}
              </Text>
              <Text style={[styles.catCount, { color: colors.mutedForeground }]}>
                {catAchs.filter((a) => a.unlocked).length}/{catAchs.length}
              </Text>
            </View>
            <View style={styles.grid}>
              {catAchs.map((a) => (
                <View key={a.id} style={styles.gridItem}>
                  <AchBadge a={a} />
                </View>
              ))}
            </View>
          </View>
        );
      })}
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
    paddingBottom: 16,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  banner: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  bannerLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  bannerValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  bannerLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  bannerProgress: { gap: 6 },
  bannerPct: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  section: { paddingHorizontal: 20, marginTop: 24 },
  catHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  catTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  catCount: { fontSize: 13, fontFamily: "Inter_500Medium" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridItem: { width: "47%" },
  achCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    alignItems: "center",
  },
  achIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unlockDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  achTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  achDesc: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 15 },
  progressBar: { height: 4, borderRadius: 2, overflow: "hidden", width: "100%" },
  progressFill: { height: "100%", borderRadius: 2 },
  progressLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textAlign: "center" },
});

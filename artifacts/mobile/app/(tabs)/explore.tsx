import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { POSTS } from "@/constants/posts";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GAP = 8;
const H_PAD = 16;
const COL_W = (SCREEN_WIDTH - H_PAD * 2 - GAP) / 2;

const COVER: Record<string, ImageSourcePropType> = {
  santorini: require("@/assets/images/trip_santorini.png"),
  tokyo: require("@/assets/images/trip_tokyo.png"),
  bali: require("@/assets/images/trip_bali.png"),
};

const TABS = [
  { id: "all", label: "All" },
  { id: "foryou", label: "For You" },
  { id: "trending", label: "Trending" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trips } = useApp();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabId>("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [saveModalPost, setSaveModalPost] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  const visible = POSTS.filter((p) => {
    if (tab !== "all" && p.tag !== tab) return false;
    if (
      query &&
      !p.title.toLowerCase().includes(query.toLowerCase()) &&
      !p.location.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const left = visible.filter((_, i) => i % 2 === 0);
  const right = visible.filter((_, i) => i % 2 === 1);

  function openPost(postId: string) {
    router.push(`/explore/${postId}?tab=${tab}` as any);
  }

  function confirmSave(tripId: string) {
    if (!saveModalPost) return;
    const pid = saveModalPost;
    setSaved((prev) => new Set(prev).add(pid));
    setSaveModalPost(null);
    const trip = trips.find((t) => t.id === tripId);
    if (trip) Alert.alert("Saved! ✈️", `Added to "${trip.title}"`);
  }

  function Card({ post }: { post: (typeof POSTS)[number] }) {
    const isSaved = saved.has(post.id);

    return (
      <TouchableOpacity
        style={[styles.card, { width: COL_W }]}
        activeOpacity={0.92}
        onPress={() => openPost(post.id)}
      >
        <View style={[styles.cardImg, { height: post.imgH }]}>
          {post.cover ? (
            <Image
              source={COVER[post.cover]}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={(post.grad ?? ["#7C6FF7", "#3B2FB5"]) as [string, string]}
              style={StyleSheet.absoluteFill}
            />
          )}
          {!post.cover && post.emoji && (
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{post.emoji}</Text>
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.42)"]}
            style={[StyleSheet.absoluteFill, styles.fade]}
          />
          <TouchableOpacity
            style={[
              styles.bookmarkBtn,
              isSaved && { backgroundColor: colors.primary },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              isSaved ? null : setSaveModalPost(post.id);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="bookmark" size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardCaption}>
          <Text
            style={[styles.cardTitle, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {post.title}
          </Text>
          <Text
            style={[styles.cardLoc, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            📍 {post.location}
          </Text>
          <TouchableOpacity
            style={[styles.addBtn, { borderColor: colors.border }]}
            onPress={(e) => {
              e.stopPropagation();
              setSaveModalPost(post.id);
            }}
          >
            <Feather name="plus" size={11} color={colors.primary} />
            <Text style={[styles.addBtnText, { color: colors.primary }]}>
              Add to trip
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: botPad }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 14 }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>
                Explore
              </Text>
              <Text
                style={[styles.tagline, { color: colors.mutedForeground }]}
              >
                Find your next adventure
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="map" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={[
              styles.search,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search destinations, restaurants, cafés…"
              placeholderTextColor={colors.mutedForeground}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Feather name="x" size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={styles.tabItem}
                  onPress={() => setTab(t.id)}
                >
                  <Text
                    style={[
                      styles.tabLabel,
                      {
                        color: active
                          ? colors.foreground
                          : colors.mutedForeground,
                        fontFamily: active
                          ? "Inter_700Bold"
                          : "Inter_400Regular",
                      },
                    ]}
                  >
                    {t.label}
                  </Text>
                  {active && (
                    <LinearGradient
                      colors={["#7C6FF7", "#C44BFF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.tabBar}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Masonry grid */}
        {visible.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text
              style={[styles.emptyText, { color: colors.mutedForeground }]}
            >
              No results for "{query}"
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            <View style={styles.col}>
              {left.map((p) => (
                <Card key={p.id} post={p} />
              ))}
            </View>
            <View style={styles.col}>
              {right.map((p) => (
                <Card key={p.id} post={p} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Save to Trip modal */}
      <Modal
        visible={saveModalPost !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSaveModalPost(null)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setSaveModalPost(null)}
        >
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={[styles.handle, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
              Add to Trip
            </Text>
            <Text
              style={[styles.sheetSub, { color: colors.mutedForeground }]}
            >
              Which trip should this spot go to?
            </Text>
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              {trips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  style={[
                    styles.tripRow,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => confirmSave(trip.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.tripDot,
                      { backgroundColor: trip.accentColor },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.tripName, { color: colors.foreground }]}
                    >
                      {trip.title}
                    </Text>
                    <Text
                      style={[
                        styles.tripDest,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {trip.destination}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.addCircle,
                      { backgroundColor: colors.primary + "22" },
                    ]}
                  >
                    <Feather name="plus" size={16} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={() => setSaveModalPost(null)}
            >
              <Text
                style={[
                  styles.cancelText,
                  { color: colors.mutedForeground },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: H_PAD, paddingBottom: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  tabs: { flexDirection: "row", gap: 4 },
  tabItem: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginRight: 16,
    alignItems: "center",
    gap: 5,
  },
  tabLabel: { fontSize: 15 },
  tabBar: { height: 2.5, width: "100%", borderRadius: 2 },
  grid: {
    flexDirection: "row",
    paddingHorizontal: H_PAD,
    gap: GAP,
    marginTop: 4,
  },
  col: { flex: 1, gap: GAP },
  card: { borderRadius: 20, overflow: "hidden" },
  cardImg: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  emojiWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 44 },
  fade: { borderRadius: 20 },
  bookmarkBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardCaption: {
    paddingTop: 8,
    paddingHorizontal: 4,
    paddingBottom: 4,
    gap: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  cardLoc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  addBtnText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyEmoji: { fontSize: 44 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 22,
  },
  sheetTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 4 },
  sheetSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 20,
  },
  tripRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  tripDot: { width: 10, height: 10, borderRadius: 5 },
  tripName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  tripDest: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  addCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});

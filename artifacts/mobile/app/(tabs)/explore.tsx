import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

type Post = {
  id: string;
  title: string;
  location: string;
  tag: "foryou" | "trending" | "all";
  imgH: number;
  cover?: string;
  grad?: [string, string];
  emoji?: string;
};

const POSTS: Post[] = [
  {
    id: "p1",
    title: "Sunset at Oia",
    location: "Santorini, Greece",
    tag: "foryou",
    imgH: 240,
    cover: "santorini",
  },
  {
    id: "p2",
    title: "Best ramen under ¥800",
    location: "Tokyo, Japan",
    tag: "trending",
    imgH: 164,
    cover: "tokyo",
  },
  {
    id: "p3",
    title: "Hidden waterfall trail",
    location: "Ubud, Bali",
    tag: "foryou",
    imgH: 164,
    cover: "bali",
  },
  {
    id: "p4",
    title: "Rooftop bar at midnight",
    location: "Bangkok, Thailand",
    tag: "trending",
    imgH: 220,
    grad: ["#FF6B6B", "#C2185B"],
    emoji: "🍹",
  },
  {
    id: "p5",
    title: "Secret beach cove",
    location: "Maldives",
    tag: "foryou",
    imgH: 164,
    grad: ["#4ECDC4", "#006E7F"],
    emoji: "🏝️",
  },
  {
    id: "p6",
    title: "Morning café ritual",
    location: "Paris, France",
    tag: "all",
    imgH: 220,
    grad: ["#7C6FF7", "#3B2FB5"],
    emoji: "☕",
  },
  {
    id: "p7",
    title: "Neon streets at midnight",
    location: "Seoul, South Korea",
    tag: "trending",
    imgH: 164,
    grad: ["#C44BFF", "#FF6B6B"],
    emoji: "🌆",
  },
  {
    id: "p8",
    title: "Overwater villa escape",
    location: "Maldives",
    tag: "foryou",
    imgH: 240,
    grad: ["#0099CC", "#4ECDC4"],
    emoji: "🌊",
  },
  {
    id: "p9",
    title: "Alpine sunrise hike",
    location: "Swiss Alps",
    tag: "all",
    imgH: 164,
    grad: ["#2E7D52", "#4ECDC4"],
    emoji: "⛰️",
  },
  {
    id: "p10",
    title: "Night market feast",
    location: "Chiang Mai, Thailand",
    tag: "all",
    imgH: 210,
    grad: ["#FFB347", "#FF6B6B"],
    emoji: "🥢",
  },
  {
    id: "p11",
    title: "Secret garden café",
    location: "Kyoto, Japan",
    tag: "foryou",
    imgH: 164,
    grad: ["#FF6B6B", "#FFB347"],
    emoji: "🌸",
  },
  {
    id: "p12",
    title: "Turquoise lagoon dive",
    location: "Phi Phi, Thailand",
    tag: "trending",
    imgH: 180,
    grad: ["#4ECDC4", "#7C6FF7"],
    emoji: "🐠",
  },
  {
    id: "p13",
    title: "24h in Seoul",
    location: "Seoul, South Korea",
    tag: "all",
    imgH: 200,
    grad: ["#7C6FF7", "#C44BFF"],
    emoji: "🗼",
  },
  {
    id: "p14",
    title: "Best pasta in Rome",
    location: "Rome, Italy",
    tag: "trending",
    imgH: 164,
    grad: ["#FFB347", "#E65100"],
    emoji: "🍝",
  },
];

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

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabId>("all");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [modalPost, setModalPost] = useState<string | null>(null);

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

  function toggleLike(id: string) {
    setLiked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function confirmSave(tripId: string) {
    if (!modalPost) return;
    const id = modalPost;
    setSaved((prev) => new Set(prev).add(id));
    setModalPost(null);
    const trip = trips.find((t) => t.id === tripId);
    if (trip) Alert.alert("Saved!", `Added to "${trip.title}" ✈️`);
  }

  function Card({ post }: { post: Post }) {
    const isSaved = saved.has(post.id);
    const isLiked = liked.has(post.id);

    return (
      <TouchableOpacity
        style={[styles.card, { width: COL_W }]}
        activeOpacity={0.93}
      >
        {/* Image area */}
        <View style={[styles.cardImg, { height: post.imgH }]}>
          {post.cover ? (
            <Image
              source={COVER[post.cover]}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={post.grad!}
              style={StyleSheet.absoluteFill}
            />
          )}
          {!post.cover && post.emoji && (
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{post.emoji}</Text>
            </View>
          )}
          {/* Subtle bottom fade */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.45)"]}
            style={[StyleSheet.absoluteFill, styles.fade]}
          />
          {/* Bookmark */}
          <TouchableOpacity
            style={[
              styles.bookmarkBtn,
              isSaved && { backgroundColor: colors.primary },
            ]}
            onPress={() => (isSaved ? null : setModalPost(post.id))}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather
              name={isSaved ? "bookmark" : "bookmark"}
              size={12}
              color="#fff"
              style={isSaved ? { opacity: 1 } : { opacity: 0.9 }}
            />
          </TouchableOpacity>
        </View>

        {/* Caption */}
        <View style={styles.cardCaption}>
          <Text
            style={[styles.cardTitle, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {post.title}
          </Text>
          <View style={styles.cardMeta}>
            <Text
              style={[styles.cardLoc, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              📍 {post.location}
            </Text>
            <TouchableOpacity
              onPress={() => toggleLike(post.id)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Feather
                name="heart"
                size={12}
                color={isLiked ? "#FF6B6B" : colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { borderColor: colors.border }]}
            onPress={() => setModalPost(post.id)}
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
              <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
                Find your next adventure
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="map" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={[
              styles.search,
              { backgroundColor: colors.card, borderColor: colors.border },
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
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
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
        visible={modalPost !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setModalPost(null)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalPost(null)}
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
            <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>
              Which trip should this spot go to?
            </Text>
            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              {trips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  style={[styles.tripRow, { borderBottomColor: colors.border }]}
                  onPress={() => confirmSave(trip.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.tripAccent,
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
              onPress={() => setModalPost(null)}
            >
              <Text
                style={[styles.cancelText, { color: colors.mutedForeground }]}
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

  /* Header */
  header: {
    paddingHorizontal: H_PAD,
    paddingBottom: 12,
  },
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

  /* Search */
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

  /* Tabs */
  tabs: {
    flexDirection: "row",
    gap: 4,
  },
  tabItem: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    marginRight: 16,
    alignItems: "center",
    gap: 5,
  },
  tabLabel: { fontSize: 15 },
  tabBar: {
    height: 2.5,
    width: "100%",
    borderRadius: 2,
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    paddingHorizontal: H_PAD,
    gap: GAP,
    marginTop: 4,
  },
  col: {
    flex: 1,
    gap: GAP,
  },

  /* Card */
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
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

  /* Caption */
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
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  addBtnText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },

  /* Empty */
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyEmoji: { fontSize: 44 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },

  /* Modal */
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
  sheetTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
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
  tripAccent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tripName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
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
  cancelText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});

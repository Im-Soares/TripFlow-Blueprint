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

const SCREEN_WIDTH = Dimensions.get("window").width;
const COLUMN_WIDTH = (SCREEN_WIDTH - 20 - 20 - 10) / 2;

const COVER_IMAGES: Record<string, ImageSourcePropType> = {
  santorini: require("@/assets/images/trip_santorini.png"),
  tokyo: require("@/assets/images/trip_tokyo.png"),
  bali: require("@/assets/images/trip_bali.png"),
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "beaches", label: "🏖️ Beaches" },
  { id: "food", label: "🍜 Food" },
  { id: "nightlife", label: "🌃 Nightlife" },
  { id: "nature", label: "🌿 Nature" },
  { id: "luxury", label: "💎 Luxury" },
  { id: "hidden", label: "🗝️ Hidden Gems" },
];

const FEED_TABS = ["For You", "Trending", "Food", "Nature", "Cities"];

type ExplorePost = {
  id: string;
  title: string;
  location: string;
  category: string;
  likes: number;
  saves: number;
  tall: boolean;
  coverKey?: string;
  emoji?: string;
  color?: string[];
};

const EXPLORE_POSTS: ExplorePost[] = [
  {
    id: "e1",
    title: "Sunset at Oia",
    location: "Santorini, Greece",
    category: "nature",
    likes: 2847,
    saves: 412,
    coverKey: "santorini",
    tall: true,
  },
  {
    id: "e2",
    title: "Best ramen under ¥800",
    location: "Tokyo, Japan",
    category: "food",
    likes: 1923,
    saves: 334,
    coverKey: "tokyo",
    tall: false,
  },
  {
    id: "e3",
    title: "Hidden waterfall trail",
    location: "Ubud, Bali",
    category: "nature",
    likes: 3102,
    saves: 567,
    coverKey: "bali",
    tall: false,
  },
  {
    id: "e4",
    title: "Rooftop bar hopping",
    location: "Bangkok, Thailand",
    category: "nightlife",
    likes: 892,
    saves: 156,
    emoji: "🍹",
    color: ["#FF6B6B", "#C2185B"],
    tall: true,
  },
  {
    id: "e5",
    title: "Secret beach cove",
    location: "Maldives",
    category: "beaches",
    likes: 4211,
    saves: 789,
    emoji: "🏝️",
    color: ["#4ECDC4", "#006E7F"],
    tall: false,
  },
  {
    id: "e6",
    title: "Morning café ritual",
    location: "Paris, France",
    category: "food",
    likes: 1456,
    saves: 203,
    emoji: "☕",
    color: ["#7C6FF7", "#3B2FB5"],
    tall: true,
  },
  {
    id: "e7",
    title: "Neon streets at midnight",
    location: "Seoul, South Korea",
    category: "nightlife",
    likes: 2103,
    saves: 389,
    emoji: "🌆",
    color: ["#C44BFF", "#FF6B6B"],
    tall: false,
  },
  {
    id: "e8",
    title: "Overwater villa escape",
    location: "Maldives",
    category: "luxury",
    likes: 5890,
    saves: 1102,
    emoji: "🌊",
    color: ["#0099CC", "#4ECDC4"],
    tall: true,
  },
  {
    id: "e9",
    title: "Alpine hiking sunrise",
    location: "Swiss Alps",
    category: "nature",
    likes: 2780,
    saves: 441,
    emoji: "⛰️",
    color: ["#2E7D52", "#4ECDC4"],
    tall: false,
  },
  {
    id: "e10",
    title: "Night market feast",
    location: "Chiang Mai, Thailand",
    category: "food",
    likes: 1677,
    saves: 298,
    emoji: "🥢",
    color: ["#FFB347", "#FF6B6B"],
    tall: true,
  },
  {
    id: "e11",
    title: "Secret garden café",
    location: "Kyoto, Japan",
    category: "hidden",
    likes: 934,
    saves: 217,
    emoji: "🌸",
    color: ["#FF6B6B", "#FFB347"],
    tall: false,
  },
  {
    id: "e12",
    title: "Turquoise lagoon dive",
    location: "Phi Phi, Thailand",
    category: "beaches",
    likes: 3445,
    saves: 623,
    emoji: "🐠",
    color: ["#4ECDC4", "#7C6FF7"],
    tall: false,
  },
];

type Collection = {
  id: string;
  title: string;
  author: string;
  count: number;
  emoji: string;
  color: string[];
};

const COLLECTIONS: Collection[] = [
  {
    id: "c1",
    title: "Best cafés in Paris",
    author: "Maria R.",
    count: 12,
    emoji: "☕",
    color: ["#7C6FF7", "#3B2FB5"],
  },
  {
    id: "c2",
    title: "Bali hidden gems",
    author: "Alex T.",
    count: 8,
    emoji: "🌴",
    color: ["#4ECDC4", "#006E7F"],
  },
  {
    id: "c3",
    title: "Tokyo anime spots",
    author: "Kenji M.",
    count: 15,
    emoji: "🎌",
    color: ["#FF6B6B", "#C2185B"],
  },
  {
    id: "c4",
    title: "Budget Europe 2w",
    author: "Sophie L.",
    count: 20,
    emoji: "🎒",
    color: ["#FFB347", "#E65100"],
  },
  {
    id: "c5",
    title: "Maldives on €80/day",
    author: "Chris B.",
    count: 9,
    emoji: "🏝️",
    color: ["#0099CC", "#4ECDC4"],
  },
];

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trips } = useApp();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFeedTab, setActiveFeedTab] = useState("For You");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [saveModalPost, setSaveModalPost] = useState<string | null>(null);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad =
    Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  const filteredPosts = EXPLORE_POSTS.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (
      query &&
      !p.title.toLowerCase().includes(query.toLowerCase()) &&
      !p.location.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  const leftPosts = filteredPosts.filter((_, i) => i % 2 === 0);
  const rightPosts = filteredPosts.filter((_, i) => i % 2 === 1);

  function toggleLike(id: string) {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function saveToTrip(tripId: string) {
    if (!saveModalPost) return;
    const postId = saveModalPost;
    setSavedPosts((prev) => {
      const next = new Set(prev);
      next.add(postId);
      return next;
    });
    setSaveModalPost(null);
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      Alert.alert("Saved! 🎉", `Added to "${trip.title}"`);
    }
  }

  function renderCard(post: ExplorePost) {
    const imgHeight = post.tall ? 210 : 148;
    const isLiked = likedPosts.has(post.id);
    const isSaved = savedPosts.has(post.id);

    return (
      <TouchableOpacity
        key={post.id}
        style={[styles.masonryCard, { backgroundColor: colors.card }]}
        activeOpacity={0.9}
      >
        <View style={[styles.cardImageWrap, { height: imgHeight }]}>
          {post.coverKey ? (
            <Image
              source={COVER_IMAGES[post.coverKey]}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={(post.color ?? ["#7C6FF7", "#3B2FB5"]) as [string, string]}
              style={styles.cardImage}
            />
          )}
          {!post.coverKey && post.emoji && (
            <View style={styles.cardEmojiWrap}>
              <Text style={styles.cardEmoji}>{post.emoji}</Text>
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.55)"]}
            style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
          />
          <TouchableOpacity
            style={[
              styles.bookmarkBtn,
              isSaved && { backgroundColor: colors.primary },
            ]}
            onPress={() =>
              isSaved ? null : setSaveModalPost(post.id)
            }
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather
              name="bookmark"
              size={11}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
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
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.likeRow}
              onPress={() => toggleLike(post.id)}
            >
              <Feather
                name="heart"
                size={11}
                color={isLiked ? "#FF6B6B" : colors.mutedForeground}
              />
              <Text style={[styles.likeCount, { color: colors.mutedForeground }]}>
                {(post.likes + (isLiked ? 1 : 0)).toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addTripBtn}
              onPress={() => setSaveModalPost(post.id)}
            >
              <Text style={[styles.addTripText, { color: colors.primary }]}>
                + Trip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topInset + 16 }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>
                Explore
              </Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Find your next adventure
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.mapBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Feather name="map" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder='Search "Tokyo sushi" or "Bali waterfalls"'
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
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Feed tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.feedTabsRow}
        >
          {FEED_TABS.map((tab) => {
            const active = activeFeedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={styles.feedTab}
                onPress={() => setActiveFeedTab(tab)}
              >
                <Text
                  style={[
                    styles.feedTabText,
                    {
                      color: active ? colors.foreground : colors.mutedForeground,
                      fontFamily: active ? "Inter_700Bold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {tab}
                </Text>
                {active && (
                  <View
                    style={[styles.feedTabBar, { backgroundColor: colors.primary }]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Travel Collections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Travel Collections
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>
                See all
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {COLLECTIONS.map((col) => (
              <TouchableOpacity
                key={col.id}
                style={styles.collectionCard}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={col.color as [string, string]}
                  style={styles.collectionGradient}
                >
                  <Text style={styles.collectionEmoji}>{col.emoji}</Text>
                  <View style={styles.collectionInfo}>
                    <Text style={styles.collectionTitle} numberOfLines={2}>
                      {col.title}
                    </Text>
                    <Text style={styles.collectionMeta}>
                      {col.count} places · by {col.author}
                    </Text>
                  </View>
                  <View style={styles.collectionSaveBtn}>
                    <Feather name="plus" size={14} color="#fff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Masonry grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {activeCategory === "all"
                ? activeFeedTab
                : CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "Discover"}
            </Text>
            <Text style={[styles.postCount, { color: colors.mutedForeground }]}>
              {filteredPosts.length} spots
            </Text>
          </View>

          {filteredPosts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No results found
              </Text>
            </View>
          ) : (
            <View style={styles.masonry}>
              <View style={styles.masonryCol}>
                {leftPosts.map((p) => renderCard(p))}
              </View>
              <View style={styles.masonryCol}>
                {rightPosts.map((p) => renderCard(p))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Save to Trip Modal */}
      <Modal
        visible={saveModalPost !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSaveModalPost(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSaveModalPost(null)}
        >
          <Pressable
            style={[styles.modalSheet, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={[styles.modalHandle, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Save to Trip
            </Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
              Choose which trip to add this spot to
            </Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {trips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  style={[
                    styles.tripRow,
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => saveToTrip(trip.id)}
                >
                  <View
                    style={[
                      styles.tripDot,
                      { backgroundColor: trip.accentColor },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tripRowTitle, { color: colors.foreground }]}>
                      {trip.title}
                    </Text>
                    <Text style={[styles.tripRowSub, { color: colors.mutedForeground }]}>
                      {trip.destination} · {trip.status}
                    </Text>
                  </View>
                  <Feather name="plus" size={18} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={() => setSaveModalPost(null)}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>
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
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: { fontSize: 30, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 2 },
  mapBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  feedTabsRow: {
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 4,
  },
  feedTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    gap: 4,
  },
  feedTabText: { fontSize: 14 },
  feedTabBar: {
    height: 2,
    width: "80%",
    borderRadius: 1,
  },
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  postCount: { fontSize: 13, fontFamily: "Inter_400Regular" },
  collectionCard: {
    width: 168,
    borderRadius: 18,
    overflow: "hidden",
  },
  collectionGradient: {
    padding: 16,
    gap: 10,
    minHeight: 150,
    justifyContent: "space-between",
  },
  collectionEmoji: { fontSize: 32 },
  collectionInfo: { flex: 1 },
  collectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    lineHeight: 19,
  },
  collectionMeta: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  collectionSaveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  masonry: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },
  masonryCol: {
    flex: 1,
    gap: 10,
  },
  masonryCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardImageWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 14,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardEmojiWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: { fontSize: 40 },
  bookmarkBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 10,
    gap: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  cardLoc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 15,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  likeCount: { fontSize: 11, fontFamily: "Inter_400Regular" },
  addTripBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(124,111,247,0.15)",
  },
  addTripText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  modalSub: {
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
  tripDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tripRowTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  tripRowSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
    textTransform: "capitalize",
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

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Keyboard,
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
import { POSTS, type Post, type PostComment } from "@/constants/posts";
import { useColors } from "@/hooks/useColors";

const { width: W, height: H } = Dimensions.get("window");

const COVER: Record<string, ImageSourcePropType> = {
  santorini: require("@/assets/images/trip_santorini.png"),
  tokyo: require("@/assets/images/trip_tokyo.png"),
  bali: require("@/assets/images/trip_bali.png"),
};

export default function PostDetailScreen() {
  const { id, tab } = useLocalSearchParams<{ id: string; tab: string }>();
  const router = useRouter();
  const { trips } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const flatRef = useRef<FlatList>(null);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [commentPost, setCommentPost] = useState<string | null>(null);
  const [saveModalPost, setSaveModalPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<
    Record<string, PostComment[]>
  >({});

  const currentTab = tab ?? "all";
  const posts =
    currentTab === "all"
      ? POSTS
      : POSTS.filter((p) => p.tag === currentTab);
  const startIndex = Math.max(0, posts.findIndex((p) => p.id === id));

  function toggleFollow(handle: string) {
    setFollowed((prev) => {
      const n = new Set(prev);
      n.has(handle) ? n.delete(handle) : n.add(handle);
      return n;
    });
  }

  function openSave(postId: string) {
    setSaveModalPost(postId);
  }

  function confirmSave(tripId: string) {
    if (!saveModalPost) return;
    const pid = saveModalPost;
    setSaved((prev) => new Set(prev).add(pid));
    setSaveModalPost(null);
    const trip = trips.find((t) => t.id === tripId);
    const post = POSTS.find((p) => p.id === pid);
    if (trip && post) {
      Alert.alert("Saved! ✈️", `"${post.title}" added to "${trip.title}"`);
    }
  }

  function submitComment(postId: string) {
    const text = commentText.trim();
    if (!text) return;
    const newComment: PostComment = {
      id: Date.now().toString(),
      user: "You",
      initials: "ME",
      color: colors.primary,
      text,
      time: "just now",
    };
    setLocalComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), newComment],
    }));
    setCommentText("");
    Keyboard.dismiss();
  }

  function PostItem({ post }: { post: Post }) {
    const isSaved = saved.has(post.id);
    const isFollowed = followed.has(post.creator.handle);
    const allComments = [
      ...post.comments,
      ...(localComments[post.id] ?? []),
    ];
    const topPad = Platform.OS === "web" ? 20 : insets.top;
    const botPad = Platform.OS === "web" ? 34 : insets.bottom;

    return (
      <View style={{ width: W, height: H, backgroundColor: "#000" }}>
        {/* Background */}
        {post.cover ? (
          <Image
            source={COVER[post.cover]}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={post.grad ?? ["#1a1a2e", "#0a0a14"]}
            style={StyleSheet.absoluteFill}
          />
        )}
        {!post.cover && post.emoji && (
          <View style={styles.emojiCenter}>
            <Text style={styles.bigEmoji}>{post.emoji}</Text>
          </View>
        )}

        {/* Top fade */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent"]}
          style={[styles.topFade, { height: topPad + 80 }]}
        />

        {/* Bottom fade */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.92)"]}
          style={styles.bottomFade}
        />

        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <Feather name="share" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Right sidebar */}
        <View style={[styles.sidebar, { bottom: botPad + 160 }]}>
          {/* Creator avatar + follow */}
          <View style={styles.sidebarItem}>
            <TouchableOpacity
              style={[
                styles.creatorAvatar,
                { backgroundColor: post.creator.color },
                isFollowed && styles.creatorFollowed,
              ]}
              onPress={() => toggleFollow(post.creator.handle)}
            >
              <Text style={styles.creatorInitials}>
                {post.creator.initials}
              </Text>
            </TouchableOpacity>
            {!isFollowed && (
              <View
                style={[
                  styles.followPlusBtn,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Feather name="plus" size={10} color="#fff" />
              </View>
            )}
          </View>

          {/* Save */}
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => (isSaved ? null : openSave(post.id))}
          >
            <View
              style={[
                styles.sideIconCircle,
                isSaved && { backgroundColor: colors.primary },
              ]}
            >
              <Feather name="bookmark" size={20} color="#fff" />
            </View>
            <Text style={styles.sideLabel}>
              {isSaved ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>

          {/* Comments */}
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => setCommentPost(post.id)}
          >
            <View style={styles.sideIconCircle}>
              <Feather name="message-circle" size={20} color="#fff" />
            </View>
            <Text style={styles.sideLabel}>{allComments.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom info */}
        <View style={[styles.bottomInfo, { paddingBottom: botPad + 24 }]}>
          {/* Creator row */}
          <View style={styles.creatorRow}>
            <View
              style={[
                styles.creatorAvatarSmall,
                { backgroundColor: post.creator.color },
              ]}
            >
              <Text style={styles.creatorInitialsSmall}>
                {post.creator.initials}
              </Text>
            </View>
            <Text style={styles.creatorHandle}>{post.creator.handle}</Text>
            <TouchableOpacity
              style={[
                styles.followBtn,
                isFollowed && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => toggleFollow(post.creator.handle)}
            >
              <Text style={styles.followBtnText}>
                {isFollowed ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title + location */}
          <Text style={styles.postTitle} numberOfLines={2}>
            {post.title}
          </Text>
          <Text style={styles.postLocation}>📍 {post.location}</Text>

          {/* Description */}
          <Text style={styles.postDesc} numberOfLines={3}>
            {post.description}
          </Text>

          {/* Add to Trip CTA */}
          <TouchableOpacity
            style={[styles.addTripCta, { backgroundColor: colors.primary }]}
            onPress={() => openSave(post.id)}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.addTripCtaText}>Add to Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const activeComments = commentPost
    ? [
        ...(POSTS.find((p) => p.id === commentPost)?.comments ?? []),
        ...(localComments[commentPost] ?? []),
      ]
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        ref={flatRef}
        data={posts}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PostItem post={item} />}
        pagingEnabled
        initialScrollIndex={startIndex}
        getItemLayout={(_, index) => ({
          length: H,
          offset: H * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
      />

      {/* Comments sheet */}
      <Modal
        visible={commentPost !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setCommentPost(null)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setCommentPost(null)}
        >
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View
              style={[styles.handle, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
              Comments
            </Text>
            <ScrollView
              style={{ maxHeight: 340 }}
              showsVerticalScrollIndicator={false}
            >
              {activeComments.length === 0 && (
                <Text
                  style={[
                    styles.noComments,
                    { color: colors.mutedForeground },
                  ]}
                >
                  No comments yet. Be the first!
                </Text>
              )}
              {activeComments.map((c) => (
                <View key={c.id} style={styles.commentRow}>
                  <View
                    style={[
                      styles.commentAvatar,
                      { backgroundColor: c.color },
                    ]}
                  >
                    <Text style={styles.commentInitials}>{c.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.commentHeader}>
                      <Text
                        style={[
                          styles.commentUser,
                          { color: colors.foreground },
                        ]}
                      >
                        {c.user}
                      </Text>
                      <Text
                        style={[
                          styles.commentTime,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {c.time}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.commentText,
                        { color: colors.foreground },
                      ]}
                    >
                      {c.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View
              style={[
                styles.commentInput,
                { backgroundColor: colors.secondary, borderColor: colors.border },
              ]}
            >
              <TextInput
                style={[styles.commentInputText, { color: colors.foreground }]}
                placeholder="Add a comment…"
                placeholderTextColor={colors.mutedForeground}
                value={commentText}
                onChangeText={setCommentText}
                returnKeyType="send"
                onSubmitEditing={() =>
                  commentPost && submitComment(commentPost)
                }
              />
              <TouchableOpacity
                onPress={() => commentPost && submitComment(commentPost)}
                disabled={!commentText.trim()}
              >
                <Feather
                  name="send"
                  size={18}
                  color={
                    commentText.trim() ? colors.primary : colors.mutedForeground
                  }
                />
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Save to Trip sheet */}
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
            <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>
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
                      style={[
                        styles.tripName,
                        { color: colors.foreground },
                      ]}
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
  emojiCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  bigEmoji: { fontSize: 90 },
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebar: {
    position: "absolute",
    right: 16,
    alignItems: "center",
    gap: 22,
  },
  sidebarItem: { alignItems: "center", gap: 4 },
  creatorAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  creatorFollowed: { borderColor: "#7C6FF7" },
  creatorInitials: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  followPlusBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -6,
  },
  sideIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  sideLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  bottomInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 72,
    paddingHorizontal: 20,
    gap: 6,
  },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  creatorAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  creatorInitialsSmall: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  creatorHandle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  followBtnText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  postTitle: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  postLocation: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  postDesc: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginTop: 2,
  },
  addTripCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  addTripCtaText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },

  /* Modals */
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
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 18,
  },
  noComments: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingVertical: 24,
  },
  commentRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  commentInitials: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  commentUser: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  commentTime: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  commentText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginTop: 12,
  },
  commentInputText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
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

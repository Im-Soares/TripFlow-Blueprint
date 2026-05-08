import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
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

const DESTINATIONS = [
  { name: "Paris", country: "France", emoji: "🗼", color: "#7C6FF7" },
  { name: "Maldives", country: "Maldives", emoji: "🏝️", color: "#4ECDC4" },
  { name: "Machu Picchu", country: "Peru", emoji: "🏔️", color: "#FFB347" },
  { name: "Safari", country: "Kenya", emoji: "🦁", color: "#FF6B6B" },
  { name: "New York", country: "USA", emoji: "🗽", color: "#7C6FF7" },
  { name: "Kyoto", country: "Japan", emoji: "⛩️", color: "#FF6B6B" },
];

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trips } = useApp();
  const [token, setToken] = useState("");
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const sharedTrips = trips.filter((t) => t.members.length > 1);

  function joinTrip() {
    if (!token.trim()) return;
    const found = trips.find(
      (t) => t.shareToken?.toLowerCase() === token.trim().toLowerCase()
    );
    if (found) {
      Alert.alert("Trip Found!", `"${found.title}" — you already have access.`);
    } else {
      Alert.alert("Not Found", "No trip found with that invite code. Check the code and try again.");
    }
    setToken("");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Explore</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>Join trips & discover places</Text>
      </View>

      {/* Join via invite */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Join a Trip</Text>
        <View style={[styles.inviteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.inviteIconWrap, { backgroundColor: colors.primary + "22" }]}>
            <Feather name="link" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.inviteTitle, { color: colors.foreground }]}>Enter Invite Code</Text>
          <Text style={[styles.inviteSub, { color: colors.mutedForeground }]}>
            Get a code from a friend and join their trip instantly
          </Text>
          <View style={[styles.inputRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <TextInput
              style={[styles.tokenInput, { color: colors.foreground }]}
              placeholder="e.g. stni-abc123"
              placeholderTextColor={colors.mutedForeground}
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.joinBtn, { backgroundColor: colors.primary, opacity: token.trim() ? 1 : 0.5 }]}
              onPress={joinTrip}
              activeOpacity={0.85}
            >
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Shared trips */}
      {sharedTrips.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Shared with You</Text>
          {sharedTrips.map((trip) => (
            <View
              key={trip.id}
              style={[styles.sharedCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.sharedAccent, { backgroundColor: trip.accentColor }]} />
              <View style={styles.sharedContent}>
                <Text style={[styles.sharedTitle, { color: colors.foreground }]}>{trip.title}</Text>
                <Text style={[styles.sharedSub, { color: colors.mutedForeground }]}>
                  {trip.destination} · {trip.members.length} members
                </Text>
              </View>
              <View style={styles.sharedMembers}>
                {trip.members.slice(0, 2).map((m, i) => (
                  <View
                    key={m.id}
                    style={[styles.memberDot, { backgroundColor: m.color, marginLeft: i > 0 ? -6 : 0 }]}
                  >
                    <Text style={styles.memberDotText}>{m.initials.slice(0, 1)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Invite codes for your trips */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Invite Links</Text>
        {trips.slice(0, 4).map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={[styles.linkCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert("Share Code", `Invite code for "${trip.title}":\n\n${trip.shareToken}\n\nShare this code with friends to let them join your trip.`, [{ text: "Got it" }])
            }
          >
            <Feather name="share-2" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.linkTitle, { color: colors.foreground }]}>{trip.title}</Text>
              <Text style={[styles.linkCode, { color: colors.primary }]}>{trip.shareToken}</Text>
            </View>
            <Feather name="copy" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Discover destinations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Discover Destinations</Text>
        <View style={styles.destGrid}>
          {DESTINATIONS.map((d) => (
            <View
              key={d.name}
              style={[styles.destCard, { backgroundColor: d.color + "22", borderColor: d.color + "44" }]}
            >
              <Text style={styles.destEmoji}>{d.emoji}</Text>
              <Text style={[styles.destName, { color: colors.foreground }]}>{d.name}</Text>
              <Text style={[styles.destCountry, { color: colors.mutedForeground }]}>{d.country}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  inviteCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    alignItems: "center",
  },
  inviteIconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  inviteTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  inviteSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 18 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 14,
    paddingRight: 4,
    paddingVertical: 4,
    width: "100%",
    gap: 8,
  },
  tokenInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", paddingVertical: 8 },
  joinBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  joinBtnText: { color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sharedCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  sharedAccent: { width: 4, alignSelf: "stretch" },
  sharedContent: { flex: 1, paddingVertical: 14, paddingHorizontal: 12 },
  sharedTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sharedSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  sharedMembers: { flexDirection: "row", alignItems: "center", paddingRight: 14 },
  memberDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  memberDotText: { fontSize: 9, fontFamily: "Inter_700Bold", color: "#fff" },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  linkTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  linkCode: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  destGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  destCard: {
    width: "47%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  destEmoji: { fontSize: 28 },
  destName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  destCountry: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

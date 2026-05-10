import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function SupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  function openEmail() {
    Linking.openURL("mailto:support@tripflow.app");
  }

  function openChat() {
    Linking.openURL("mailto:support@tripflow.app?subject=TripFlow%20Support");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 80 : insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topInset + 16 }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Help & Support</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Need help?</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>Our support team is available to help with account issues, trip planning, or technical questions.</Text>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={openEmail} activeOpacity={0.85}>
          <Text style={styles.actionText}>Email support@tripflow.app</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={openChat} activeOpacity={0.85}>
          <Text style={[styles.actionText, { color: colors.foreground }]}>Start a support conversation</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>FAQs</Text>
        <View style={styles.faqItem}>
          <Text style={[styles.faqQuestion, { color: colors.foreground }]}>How do I change my trip details?</Text>
          <Text style={[styles.faqAnswer, { color: colors.mutedForeground }]}>Open the trip, tap "Edit" on the plan, and update details as needed.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={[styles.faqQuestion, { color: colors.foreground }]}>Can I share my itinerary?</Text>
          <Text style={[styles.faqAnswer, { color: colors.mutedForeground }]}>Yes. Use the trip share options to invite friends and collaborators.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={[styles.faqQuestion, { color: colors.foreground }]}>Where can I manage notifications?</Text>
          <Text style={[styles.faqAnswer, { color: colors.mutedForeground }]}>Go to Notifications in your profile settings to customize alerts.</Text>
        </View>
      </View>
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
  card: {
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  paragraph: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  actionBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
  faqItem: { gap: 6, marginBottom: 16 },
  faqQuestion: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  faqAnswer: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
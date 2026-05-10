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

import { useColors } from "@/hooks/useColors";

export default function TermsOfServiceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

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
        <Text style={[styles.title, { color: colors.foreground }]}>Terms of Service</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>TripFlow Terms</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>By using TripFlow, you agree to our terms and acknowledge that the app is provided as-is. We may update the service and privacy terms periodically to improve functionality and security.</Text>
        <Text style={[styles.heading, { color: colors.foreground }]}>Your responsibilities</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>You are responsible for keeping your login details secure, respecting other users, and using TripFlow only for lawful travel planning purposes.</Text>
        <Text style={[styles.heading, { color: colors.foreground }]}>Account usage</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>We reserve the right to suspend or terminate accounts that violate our community guidelines, misuse the platform, or compromise security.</Text>
        <Text style={[styles.heading, { color: colors.foreground }]}>Limitation of liability</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>TripFlow is a planning tool and does not guarantee bookings, travel outcomes, or partner availability. Always verify trip details directly with providers.</Text>
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
    gap: 14,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  heading: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginTop: 12 },
  paragraph: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
});
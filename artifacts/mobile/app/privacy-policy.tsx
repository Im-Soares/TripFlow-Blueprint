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

export default function PrivacyPolicyScreen() {
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
        <Text style={[styles.title, { color: colors.foreground }]}>Privacy Policy</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your privacy is important</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>TripFlow collects only the information needed to provide travel planning and trip management features. We do not sell your personal data and we use industry standard protection to keep your account secure.</Text>
        <Text style={[styles.heading, { color: colors.foreground }]}>What we collect</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>We collect:</Text>
        <View style={styles.bulletList}>
          <Text style={[styles.bulletItem, { color: colors.foreground }]}>• Profile details like name, email and preferences.</Text>
          <Text style={[styles.bulletItem, { color: colors.foreground }]}>• Trip and itinerary details that help you manage your travel plans.</Text>
          <Text style={[styles.bulletItem, { color: colors.foreground }]}>• Anonymous usage data to improve app performance and features.</Text>
        </View>
        <Text style={[styles.heading, { color: colors.foreground }]}>How we use data</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>Your data is used to power the app experience, send optional notifications, and personalize trip suggestions. We never share your data without consent, except when required by law.</Text>
        <Text style={[styles.heading, { color: colors.foreground }]}>Need help?</Text>
        <Text style={[styles.paragraph, { color: colors.foreground }]}>Contact privacy@tripflow.app for questions or data access requests.</Text>
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
  bulletList: { paddingLeft: 12, marginTop: 8, gap: 6 },
  bulletItem: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const [tripReminders, setTripReminders] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);

  function handleSave() {
    Alert.alert("Notifications updated", "Your notification preferences have been saved.");
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
        <Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Notification Preferences</Text>
        <View style={[styles.row, { borderBottomColor: colors.border }]}> 
          <View style={styles.rowText}> 
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>Trip reminders</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>Receive alerts for upcoming trips and itinerary updates.</Text>
          </View>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.primary }}
            thumbColor={tripReminders ? colors.background : colors.background}
            value={tripReminders}
            onValueChange={setTripReminders}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}> 
          <View style={styles.rowText}> 
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>Promotional emails</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>Get tips, travel inspiration, and special offers.</Text>
          </View>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.primary }}
            thumbColor={promoEmails ? colors.background : colors.background}
            value={promoEmails}
            onValueChange={setPromoEmails}
          />
        </View>

        <View style={styles.row}> 
          <View style={styles.rowText}> 
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>App updates</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>Allow release notes and feature announcements.</Text>
          </View>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.primary }}
            thumbColor={appUpdates ? colors.background : colors.background}
            value={appUpdates}
            onValueChange={setAppUpdates}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save preferences</Text>
        </TouchableOpacity>
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
    gap: 18,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  rowText: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  rowSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4, lineHeight: 18 },
  saveBtn: { borderRadius: 16, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
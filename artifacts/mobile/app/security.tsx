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

export default function SecurityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  function handleSave() {
    Alert.alert("Security settings updated", "Your security preferences have been saved.");
  }

  function handleChangePassword() {
    Alert.alert("Change Password", "Password change feature coming soon. For now, contact support@tripflow.app");
  }

  function handleViewSessions() {
    Alert.alert("Active Sessions", "You have 1 active session on this device.\n\nLast login: Today");
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
        <Text style={[styles.title, { color: colors.foreground }]}>Security</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account Security</Text>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={handleChangePassword} activeOpacity={0.85}>
          <Text style={[styles.actionText, { color: colors.foreground }]}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={handleViewSessions} activeOpacity={0.85}>
          <Text style={[styles.actionText, { color: colors.foreground }]}>View Active Sessions</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Security Features</Text>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>Two-Factor Authentication</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>Add an extra layer of security to your account.</Text>
          </View>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.primary }}
            thumbColor={twoFactor ? colors.background : colors.background}
            value={twoFactor}
            onValueChange={setTwoFactor}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>Biometric Login</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>Use fingerprint or face recognition to log in.</Text>
          </View>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.primary }}
            thumbColor={biometric ? colors.background : colors.background}
            value={biometric}
            onValueChange={setBiometric}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>Login Alerts</Text>
            <Text style={[styles.rowSubtitle, { color: colors.mutedForeground }]}>Get notified when someone logs into your account.</Text>
          </View>
          <Switch
            trackColor={{ false: colors.secondary, true: colors.primary }}
            thumbColor={loginAlerts ? colors.background : colors.background}
            value={loginAlerts}
            onValueChange={setLoginAlerts}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save security settings</Text>
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
    gap: 16,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  actionBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
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
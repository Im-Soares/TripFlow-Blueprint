import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function SettingRow({ icon, label, onPress, danger }: { icon: string; label: string; onPress: () => void; danger?: boolean }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.settingRow, { borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: danger ? colors.destructive + "22" : colors.secondary }]}>
        <Feather name={icon as any} size={16} color={danger ? colors.destructive : colors.mutedForeground} />
      </View>
      <Text style={[styles.settingLabel, { color: danger ? colors.destructive : colors.foreground }]}>{label}</Text>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, trips, achievements } = useApp();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const countries = new Set(trips.map((t) => t.country)).size;
  const completedTrips = trips.filter((t) => t.status === "completed").length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
      </View>

      {/* Avatar + info */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: currentUser.avatarColor }]}>
          <Text style={styles.avatarText}>{currentUser.initials}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.foreground }]}>{currentUser.name}</Text>
        <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{currentUser.email}</Text>
        {currentUser.bio ? (
          <Text style={[styles.userBio, { color: colors.mutedForeground }]}>{currentUser.bio}</Text>
        ) : null}
      </View>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{trips.length}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total Trips</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{countries}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Countries</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{completedTrips}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Completed</Text>
        </View>
      </View>

      {/* Achievements preview */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Achievements</Text>
          <TouchableOpacity onPress={() => router.push("/achievements")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.achRow}>
          {achievements.filter((a) => a.unlocked).slice(0, 4).map((a) => (
            <View
              key={a.id}
              style={[styles.achBadge, { backgroundColor: colors.teal + "22", borderColor: colors.teal + "44" }]}
            >
              <Feather name={a.icon as any} size={20} color={colors.teal} />
              <Text style={[styles.achLabel, { color: colors.foreground }]} numberOfLines={1}>{a.title}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.achProgress, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="award" size={16} color={colors.amber} />
          <Text style={[styles.achProgressText, { color: colors.foreground }]}>
            {unlockedAchievements} of {achievements.length} achievements unlocked
          </Text>
          <TouchableOpacity onPress={() => router.push("/achievements")}>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="user" label="Edit Profile" onPress={() => Alert.alert("Edit Profile", "Profile editing coming soon.")} />
          <SettingRow icon="bell" label="Notifications" onPress={() => Alert.alert("Notifications", "Notification settings coming soon.")} />
          <SettingRow icon="shield" label="Privacy" onPress={() => Alert.alert("Privacy", "Privacy settings coming soon.")} />
          <SettingRow icon="help-circle" label="Help & Support" onPress={() => Alert.alert("Support", "Contact: support@tripflow.app")} />
          <SettingRow icon="log-out" label="Sign Out" onPress={() => Alert.alert("Sign Out", "Are you sure?", [{ text: "Cancel" }, { text: "Sign Out", style: "destructive" }])} danger />
        </View>
      </View>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>TripFlow v1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  avatarSection: { alignItems: "center", paddingTop: 16, paddingBottom: 24, gap: 6 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  avatarText: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff" },
  userName: { fontSize: 22, fontFamily: "Inter_700Bold" },
  userEmail: { fontSize: 14, fontFamily: "Inter_400Regular" },
  userBio: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 40, lineHeight: 18, marginTop: 4 },
  statsCard: { marginHorizontal: 20, borderRadius: 18, borderWidth: 1, flexDirection: "row", padding: 20 },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statDivider: { width: 1, marginVertical: 4 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 14, fontFamily: "Inter_500Medium" },
  achRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  achBadge: { alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, minWidth: 80 },
  achLabel: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },
  achProgress: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, padding: 14 },
  achProgressText: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  settingsCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  settingIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  settingLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  version: { textAlign: "center", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 24, marginBottom: 8 },
});

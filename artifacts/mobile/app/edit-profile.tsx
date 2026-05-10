import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function EditProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser } = useApp();
  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState(currentUser.bio || "Avid traveler building the best trips.");
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Profile Saved", "Your profile information has been updated.");
    }, 600);
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
        <Text style={[styles.title, { color: colors.foreground }]}>Edit Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Personal Info</Text>
        <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={colors.mutedForeground}
        />

        <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Email address"
          placeholderTextColor={colors.mutedForeground}
        />

        <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Bio</Text>
        <TextInput
          style={[styles.inputArea, { backgroundColor: colors.background, color: colors.foreground, borderColor: colors.border }]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us a bit about yourself"
          placeholderTextColor={colors.mutedForeground}
          multiline
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save Changes"}</Text>
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
    gap: 14,
  },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  inputLabel: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 6 },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
  },
  inputArea: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  saveBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "Inter_700Bold" },
});
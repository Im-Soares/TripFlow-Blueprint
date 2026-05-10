import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
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
import { ApiError } from "@/lib/api";

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "SGD"];
const ACCENT_COLORS = ["#7C6FF7", "#FF6B6B", "#4ECDC4", "#FFB347", "#6C8EBF", "#E879A0"];
const STATUS_OPTIONS = [
  { key: "planning", label: "Planning" },
  { key: "upcoming", label: "Upcoming" },
] as const;

export default function CreateTripScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { createTrip } = useApp();

  const [form, setForm] = useState({
    title: "",
    destination: "",
    country: "",
    startDate: "",
    endDate: "",
    totalBudget: "",
    currency: "USD",
    accentColor: ACCENT_COLORS[0],
    status: "upcoming" as "planning" | "upcoming",
    notes: "",
    bannerImage: null as string | null,
  });
  const [loading, setLoading] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const isValid = form.title.trim().length > 0 && form.destination.trim().length > 0;

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant access to your photo library to select a banner image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm((f) => ({ ...f, bannerImage: result.assets[0].uri }));
    }
  }

  async function submit() {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      await createTrip({
        title: form.title.trim(),
        destination: form.destination.trim(),
        country: form.country.trim() || form.destination.trim(),
        startDate: form.startDate || new Date().toISOString().slice(0, 10),
        endDate: form.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        totalBudget: parseFloat(form.totalBudget) || 0,
        currency: form.currency,
        accentColor: form.accentColor,
        status: form.status,
        notes: form.notes.trim(),
        coverImageUrl: form.bannerImage,
      });
      router.back();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create trip. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topInset + 16, backgroundColor: colors.background, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} disabled={loading}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>New Trip</Text>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: isValid && !loading ? colors.primary : colors.secondary }]}
          onPress={submit}
          disabled={!isValid || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.saveBtnText, { color: isValid ? "#fff" : colors.mutedForeground }]}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.form, { paddingBottom: Platform.OS === "web" ? 60 : insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner Image */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Trip Banner</Text>
          <TouchableOpacity style={[styles.bannerPicker, { borderColor: colors.border }]} onPress={pickImage} activeOpacity={0.85}>
            {form.bannerImage ? (
              <Image source={{ uri: form.bannerImage }} style={styles.bannerImage} />
            ) : (
              <View style={styles.bannerPlaceholder}>
                <Feather name="camera" size={24} color={colors.mutedForeground} />
                <Text style={[styles.bannerPlaceholderText, { color: colors.mutedForeground }]}>
                  Add a banner image
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {form.bannerImage && (
            <TouchableOpacity
              style={[styles.removeBannerBtn, { backgroundColor: colors.destructive }]}
              onPress={() => setForm((f) => ({ ...f, bannerImage: null }))}
              activeOpacity={0.85}
            >
              <Text style={styles.removeBannerText}>Remove banner</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Color picker */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Trip Color</Text>
          <View style={styles.colorRow}>
            {ACCENT_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c, borderColor: form.accentColor === c ? "#fff" : "transparent", borderWidth: form.accentColor === c ? 3 : 0 }]}
                onPress={() => setForm((f) => ({ ...f, accentColor: c }))}
              />
            ))}
          </View>
        </View>

        {/* Basic info */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Trip Details</Text>
          <View style={[styles.inputWrap, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Trip name *"
              placeholderTextColor={colors.mutedForeground}
              value={form.title}
              onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
            />
          </View>
          <View style={[styles.inputWrap, { borderColor: colors.border }]}>
            <Feather name="map-pin" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Destination *"
              placeholderTextColor={colors.mutedForeground}
              value={form.destination}
              onChangeText={(v) => setForm((f) => ({ ...f, destination: v }))}
            />
          </View>
          <View style={[styles.inputWrap, { borderColor: colors.border }]}>
            <Feather name="globe" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Country"
              placeholderTextColor={colors.mutedForeground}
              value={form.country}
              onChangeText={(v) => setForm((f) => ({ ...f, country: v }))}
            />
          </View>
        </View>

        {/* Dates */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Dates</Text>
          <View style={styles.dateRow}>
            <View style={[styles.dateInput, { borderColor: colors.border, flex: 1 }]}>
              <Feather name="calendar" size={14} color={colors.mutedForeground} />
              <TextInput
                style={[styles.dateInputText, { color: colors.foreground }]}
                placeholder="Start (YYYY-MM-DD)"
                placeholderTextColor={colors.mutedForeground}
                value={form.startDate}
                onChangeText={(v) => setForm((f) => ({ ...f, startDate: v }))}
              />
            </View>
            <Feather name="arrow-right" size={14} color={colors.mutedForeground} />
            <View style={[styles.dateInput, { borderColor: colors.border, flex: 1 }]}>
              <Feather name="calendar" size={14} color={colors.mutedForeground} />
              <TextInput
                style={[styles.dateInputText, { color: colors.foreground }]}
                placeholder="End (YYYY-MM-DD)"
                placeholderTextColor={colors.mutedForeground}
                value={form.endDate}
                onChangeText={(v) => setForm((f) => ({ ...f, endDate: v }))}
              />
            </View>
          </View>
        </View>

        {/* Budget */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Budget</Text>
          <View style={styles.budgetRow}>
            <View style={[styles.inputWrap, { flex: 1, borderColor: colors.border }]}>
              <Feather name="dollar-sign" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Total budget"
                placeholderTextColor={colors.mutedForeground}
                value={form.totalBudget}
                onChangeText={(v) => setForm((f) => ({ ...f, totalBudget: v }))}
                keyboardType="numeric"
              />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, { backgroundColor: form.currency === c ? colors.primary : colors.secondary }]}
                  onPress={() => setForm((f) => ({ ...f, currency: c }))}
                >
                  <Text style={[styles.chipText, { color: form.currency === c ? "#fff" : colors.mutedForeground }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Status */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Status</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[styles.statusChip, { backgroundColor: form.status === s.key ? colors.primary : colors.secondary }]}
                onPress={() => setForm((f) => ({ ...f, status: s.key }))}
              >
                <Text style={[styles.chipText, { color: form.status === s.key ? "#fff" : colors.mutedForeground }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Notes</Text>
          <TextInput
            style={[styles.notesInput, { backgroundColor: colors.secondary, color: colors.foreground }]}
            placeholder="Any initial notes or ideas..."
            placeholderTextColor={colors.mutedForeground}
            value={form.notes}
            onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
  },
  closeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, minWidth: 60, alignItems: "center", justifyContent: "center" },
  saveBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  form: { padding: 20, gap: 16 },
  section: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 10 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  colorRow: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  inputWrap: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, paddingVertical: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateInput: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  dateInputText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  budgetRow: { flexDirection: "row", gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  statusRow: { flexDirection: "row", gap: 10 },
  statusChip: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12 },
  notesInput: { borderRadius: 12, padding: 14, fontSize: 15, fontFamily: "Inter_400Regular", minHeight: 80, textAlignVertical: "top" },
  bannerPicker: { height: 120, borderWidth: 2, borderStyle: "dashed", borderRadius: 12, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  bannerPlaceholder: { alignItems: "center", gap: 8 },
  bannerPlaceholderText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  removeBannerBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, alignItems: "center", marginTop: 8 },
  removeBannerText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

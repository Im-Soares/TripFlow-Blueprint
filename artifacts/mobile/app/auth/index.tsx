import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const FEATURES = [
  { icon: "✈️", label: "Plan trips together" },
  { icon: "💰", label: "Track every expense" },
  { icon: "📋", label: "Smart itineraries" },
];

export default function AuthWelcome() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0A0A14", "#12102A", "#0A0A14"]}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={["transparent", "#0A0A14"]}
        style={styles.overlay}
      />

      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <View style={styles.content}>
        <View style={styles.logoRow}>
          <View style={styles.logoDot} />
          <Text style={styles.logoText}>TripFlow</Text>
        </View>

        <Text style={styles.headline}>Travel planning,{"\n"}reimagined.</Text>

        <Text style={styles.sub}>
          Collaborate, budget, and explore — all in one premium experience.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push("/auth/register")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#9B8FF9", "#7C6FF7", "#6355D8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnPrimaryText}>Get started — it's free</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push("/auth/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.legal}>
          By continuing you agree to our{" "}
          <Text style={styles.legalLink}>Terms of Service</Text> and{" "}
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A14" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    top: height * 0.3,
  },
  glow1: {
    position: "absolute",
    top: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#7C6FF7",
    opacity: 0.12,
  },
  glow2: {
    position: "absolute",
    top: 200,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FF6B6B",
    opacity: 0.08,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "flex-end",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "absolute",
    top: 60,
    left: 28,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7C6FF7",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    fontFamily: "Inter_700Bold",
  },
  headline: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 48,
    marginBottom: 16,
    fontFamily: "Inter_700Bold",
  },
  sub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: "Inter_400Regular",
  },
  features: {
    gap: 12,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: { fontSize: 20 },
  featureLabel: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "Inter_400Regular",
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  btnPrimary: {
    borderRadius: 16,
    overflow: "hidden",
  },
  btnGradient: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 16,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  btnSecondary: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(124,111,247,0.3)",
    backgroundColor: "rgba(124,111,247,0.06)",
  },
  btnSecondaryText: {
    color: "#7C6FF7",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  legal: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  legalLink: { color: "rgba(124,111,247,0.7)" },
});

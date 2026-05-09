import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Registration failed. Please try again.";
      Alert.alert("Registration failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const strength =
    password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 ? 2
    : 3;

  const strengthColors = ["#252538", "#FF6B6B", "#FFB347", "#4ECDC4"];
  const strengthLabels = ["", "Weak", "Good", "Strong"];

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#0A0A14", "#12102A", "#0A0A14"]} style={StyleSheet.absoluteFill} />
      <View style={styles.glow} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Start planning your dream trips today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="Alex Johnson"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                }}
                autoCapitalize="words"
                autoComplete="name"
              />
              {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="you@example.com"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
                <TextInput
                  style={styles.inputInner}
                  placeholder="Min. 8 characters"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password) setErrors((e) => ({ ...e, password: "" }));
                  }}
                  secureTextEntry={!showPass}
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPass ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
              {password.length > 0 && (
                <View style={styles.strengthRow}>
                  {[1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        { backgroundColor: i <= strength ? strengthColors[strength] : "#252538" },
                      ]}
                    />
                  ))}
                  <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>
                    {strengthLabels[strength]}
                  </Text>
                </View>
              )}
              {errors.password ? <Text style={styles.fieldError}>{errors.password}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={loading ? ["#444", "#333"] : ["#9B8FF9", "#7C6FF7", "#6355D8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Create account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.legal}>
              By creating an account you agree to our{" "}
              <Text style={styles.legalLink}>Terms</Text> and{" "}
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A14" },
  glow: {
    position: "absolute",
    top: -40,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#7C6FF7",
    opacity: 0.1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  back: { marginBottom: 40 },
  backText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  header: { marginBottom: 40 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Inter_400Regular",
  },
  form: { gap: 20 },
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontFamily: "Inter_600SemiBold",
  },
  input: {
    backgroundColor: "#13131F",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Inter_400Regular",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#13131F",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 18,
  },
  inputInner: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Inter_400Regular",
  },
  eyeBtn: { padding: 4 },
  eyeText: {
    color: "#7C6FF7",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  inputError: { borderColor: "#FF6B6B" },
  fieldError: {
    color: "#FF6B6B",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    width: 44,
    textAlign: "right",
  },
  btnPrimary: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnGradient: {
    paddingVertical: 18,
    alignItems: "center",
    borderRadius: 16,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  legal: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  legalLink: { color: "rgba(124,111,247,0.7)" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    color: "#7C6FF7",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});

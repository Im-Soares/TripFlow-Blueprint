import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Trip } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const COVER_IMAGES: Record<string, ImageSourcePropType> = {
  santorini: require("@/assets/images/trip_santorini.png"),
  tokyo: require("@/assets/images/trip_tokyo.png"),
  bali: require("@/assets/images/trip_bali.png"),
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getTripDuration(start: string, end: string) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const STATUS_COLORS: Record<string, string> = {
  planning: "#FFB347",
  upcoming: "#7C6FF7",
  ongoing: "#4ECDC4",
  completed: "#7575A0",
};

const STATUS_LABELS: Record<string, string> = {
  planning: "Planning",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

interface TripCardProps {
  trip: Trip;
  variant?: "large" | "compact";
}

export function TripCard({ trip, variant = "large" }: TripCardProps) {
  const colors = useColors();
  const router = useRouter();

  const cover = trip.coverImageUrl ? { uri: trip.coverImageUrl } : trip.localCover ? COVER_IMAGES[trip.localCover] : null;
  const days = daysUntil(trip.startDate);
  const duration = getTripDuration(trip.startDate, trip.endDate);
  const statusColor = STATUS_COLORS[trip.status] ?? colors.primary;

  if (variant === "compact") {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/trip/${trip.id}` as any)}
        activeOpacity={0.8}
      >
        {cover ? (
          <Image source={cover} style={styles.compactImage} />
        ) : (
          <View style={[styles.compactImagePlaceholder, { backgroundColor: trip.accentColor + "33" }]}>
            <Feather name="map-pin" size={20} color={trip.accentColor} />
          </View>
        )}
        <View style={styles.compactContent}>
          <Text style={[styles.compactTitle, { color: colors.foreground }]} numberOfLines={1}>
            {trip.title}
          </Text>
          <Text style={[styles.compactSub, { color: colors.mutedForeground }]}>
            {trip.destination} · {duration}d
          </Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor + "22" }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {STATUS_LABELS[trip.status]}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.largeCard}
      onPress={() => router.push(`/trip/${trip.id}` as any)}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        {cover ? (
          <Image source={cover} style={styles.largeImage} />
        ) : (
          <View style={[styles.largeImagePlaceholder, { backgroundColor: trip.accentColor + "44" }]}>
            <Feather name="map" size={40} color={trip.accentColor} />
          </View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.imageOverlay}>
          <View style={[styles.statusPill, { backgroundColor: statusColor + "DD" }]}>
            <Text style={[styles.statusText, { color: "#fff" }]}>
              {STATUS_LABELS[trip.status]}
            </Text>
          </View>
          <Text style={styles.largeTitle}>{trip.title}</Text>
          <View style={styles.largeMeta}>
            <Feather name="map-pin" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.largeMetaText}>{trip.destination}, {trip.country}</Text>
            <View style={styles.dot} />
            <Feather name="calendar" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.largeMetaText}>
              {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.membersRow}>
              {trip.members.slice(0, 3).map((m, i) => (
                <View
                  key={m.id}
                  style={[styles.memberAvatar, { backgroundColor: m.color, marginLeft: i > 0 ? -8 : 0 }]}
                >
                  <Text style={styles.memberInitials}>{m.initials.slice(0, 2)}</Text>
                </View>
              ))}
              {trip.members.length > 3 && (
                <View style={[styles.memberAvatar, { backgroundColor: "rgba(255,255,255,0.2)", marginLeft: -8 }]}>
                  <Text style={styles.memberInitials}>+{trip.members.length - 3}</Text>
                </View>
              )}
            </View>
            {trip.status === "upcoming" && days > 0 && (
              <View style={styles.countdown}>
                <Text style={styles.countdownText}>{days}d away</Text>
              </View>
            )}
            {trip.status === "planning" && (
              <View style={styles.countdown}>
                <Text style={styles.countdownText}>{duration}d trip</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  largeCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  imageWrapper: {
    height: 220,
    position: "relative",
  },
  largeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  largeImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    gap: 6,
  },
  largeTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  largeMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  largeMetaText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  membersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  memberInitials: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  countdown: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countdownText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
  },
  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  // Compact
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  compactImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    resizeMode: "cover",
  },
  compactImagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  compactContent: {
    flex: 1,
    gap: 4,
  },
  compactTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  compactSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});

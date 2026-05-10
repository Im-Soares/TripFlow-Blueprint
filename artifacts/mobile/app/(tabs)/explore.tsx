import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ImageBackground,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const H_PAD = 16;
const CARD_WIDTH = (SCREEN_WIDTH - H_PAD * 2 - 8) / 2;

// Enhanced mock recommendations with real image URLs
const TRENDING_DESTINATIONS = [
  {
    id: "d1",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=500&fit=crop",
    subtitle: "City of Light",
    price: "from €150/night",
  },
  {
    id: "d2",
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=500&h=500&fit=crop",
    subtitle: "Modern Wonder",
    price: "from ¥8,000/night",
  },
  {
    id: "d3",
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d049?w=500&h=500&fit=crop",
    subtitle: "Aegean Paradise",
    price: "from €200/night",
  },
  {
    id: "d4",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537225228614-b4fad34a0b60?w=500&h=500&fit=crop",
    subtitle: "Tropical Escape",
    price: "from $50/night",
  },
];

// Enhanced mock recommendations with real image URLs
const RECOMMENDATIONS = {
  hotels: [
    {
      id: "h1",
      name: "Hotel Indigo Paris",
      location: "Paris, France",
      rating: 4.5,
      price: "€180/night",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      description: "Boutique luxury in Le Marais",
    },
    {
      id: "h2",
      name: "The Ritz Tokyo",
      location: "Tokyo, Japan",
      rating: 4.8,
      price: "¥45,000/night",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      description: "Ultra-luxury experience in Shibuya",
    },
    {
      id: "h3",
      name: "Santorini Bliss Resort",
      location: "Santorini, Greece",
      rating: 4.7,
      price: "€250/night",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
      description: "Cliffside views of the Aegean",
    },
  ],
  activities: [
    {
      id: "a1",
      name: "Eiffel Tower Guided Tour",
      location: "Paris, France",
      rating: 4.6,
      price: "€65/person",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
      description: "Skip-the-line with expert guide",
    },
    {
      id: "a2",
      name: "Tokyo Food Walking Tour",
      location: "Tokyo, Japan",
      rating: 4.9,
      price: "¥8,500/person",
      image: "https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=400&h=300&fit=crop",
      description: "Authentic street food experiences",
    },
    {
      id: "a3",
      name: "Santorini Sunset Cruise",
      location: "Santorini, Greece",
      rating: 4.8,
      price: "€85/person",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d049?w=400&h=300&fit=crop",
      description: "Private yacht with champagne",
    },
  ],
  restaurants: [
    {
      id: "r1",
      name: "Le Jules Verne",
      location: "Paris, France",
      rating: 4.4,
      price: "€€€",
      image: "https://images.unsplash.com/photo-1504674900152-b8b9268170d1?w=400&h=300&fit=crop",
      description: "Michelin-starred on the Eiffel Tower",
    },
    {
      id: "r2",
      name: "Niku Kappo",
      location: "Tokyo, Japan",
      rating: 4.7,
      price: "¥¥¥¥",
      image: "https://images.unsplash.com/photo-1504674900152-b8b9268170d1?w=400&h=300&fit=crop",
      description: "Premium wagyu in Ginza",
    },
    {
      id: "r3",
      name: "Blue Note",
      location: "Santorini, Greece",
      rating: 4.5,
      price: "€€€",
      image: "https://images.unsplash.com/photo-1504674900152-b8b9268170d1?w=400&h=300&fit=crop",
      description: "Mediterranean fine dining",
    },
  ],
};



export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { trips } = useApp();
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  // Get upcoming/planning trips for personalized recommendations
  const upcomingTrips = useMemo(() => {
    return trips.filter(trip =>
      trip.status === "planning" ||
      trip.status === "upcoming"
    );
  }, [trips]);

  // Get recommendations based on upcoming trips
  const personalizedRecommendations = useMemo(() => {
    if (upcomingTrips.length === 0) return null;

    const trip = upcomingTrips[0];
    const destination = trip.destination.toLowerCase();

    let hotels: any[] = [];
    let activities: any[] = [];
    let restaurants: any[] = [];

    if (destination.includes("paris") || destination.includes("france")) {
      hotels = RECOMMENDATIONS.hotels.filter(h => h.location.includes("Paris"));
      activities = RECOMMENDATIONS.activities.filter(a => a.location.includes("Paris"));
      restaurants = RECOMMENDATIONS.restaurants.filter(r => r.location.includes("Paris"));
    } else if (destination.includes("tokyo") || destination.includes("japan")) {
      hotels = RECOMMENDATIONS.hotels.filter(h => h.location.includes("Tokyo"));
      activities = RECOMMENDATIONS.activities.filter(a => a.location.includes("Tokyo"));
      restaurants = RECOMMENDATIONS.restaurants.filter(r => r.location.includes("Tokyo"));
    } else if (destination.includes("santorini") || destination.includes("greece")) {
      hotels = RECOMMENDATIONS.hotels.filter(h => h.location.includes("Santorini"));
      activities = RECOMMENDATIONS.activities.filter(a => a.location.includes("Santorini"));
      restaurants = RECOMMENDATIONS.restaurants.filter(r => r.location.includes("Santorini"));
    } else {
      hotels = RECOMMENDATIONS.hotels.slice(0, 2);
      activities = RECOMMENDATIONS.activities.slice(0, 2);
      restaurants = RECOMMENDATIONS.restaurants.slice(0, 2);
    }

    return { hotels, activities, restaurants, trip };
  }, [upcomingTrips]);

  function TrendingDestinationCard({ item }: { item: any }) {
    return (
      <TouchableOpacity
        style={[styles.trendingCard, { marginHorizontal: H_PAD === 16 ? 8 : 12 }]}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.trendingImage}
          imageStyle={styles.trendingImageStyle}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
            style={styles.trendingGradient}
          />
          <View style={styles.trendingContent}>
            <Text style={styles.trendingSubtitle}>{item.subtitle}</Text>
            <Text style={styles.trendingName}>{item.name}</Text>
            <Text style={styles.trendingCountry}>{item.country}</Text>
            <Text style={styles.trendingPrice}>{item.price}</Text>
            <TouchableOpacity
              style={[styles.trendingCta, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Text style={styles.trendingCtaText}>Explore</Text>
              <Feather name="arrow-right" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  function ImprovedRecommendationCard({ item, type }: { item: any; type: string }) {
    return (
      <TouchableOpacity
        style={[
          styles.improvedCard,
          { 
            width: CARD_WIDTH,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        activeOpacity={0.9}
        onPress={() => setHoveredCard(item.id)}
        onBlur={() => setHoveredCard(null)}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.cardImageBg}
          imageStyle={styles.cardImageStyle}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.6)"]}
            style={styles.cardGradient}
          />
          <View style={styles.cardRatingBadge}>
            <Feather name="star" size={12} color="#FFD700" />
            <Text style={styles.cardRatingValue}>{item.rating}</Text>
          </View>
        </ImageBackground>

        <View style={styles.improvedCardContent}>
          <Text style={[styles.improvedCardTitle, { color: colors.foreground }]} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.cardMetaRow}>
            <Feather name="map-pin" size={12} color={colors.mutedForeground} />
            <Text style={[styles.improvedCardLocation, { color: colors.mutedForeground }]}>
              {item.location}
            </Text>
          </View>
          <Text
            style={[styles.improvedCardDescription, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={[styles.improvedCardPrice, { color: colors.primary }]}>
              {item.price}
            </Text>
            <TouchableOpacity
              style={[styles.improvedCardBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Text style={styles.improvedCardBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function Section({ title, items, type }: { title: string; items: any[]; type: string }) {
    if (items.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllBtn, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {items.map((item) => (
            <ImprovedRecommendationCard key={item.id} item={item} type={type} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {/* HERO DISCOVERY SECTION */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
        }}
        style={[styles.heroSection, { paddingTop: topPad + 20 }]}
        imageStyle={styles.heroImageStyle}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.85)"]}
          style={styles.heroGradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroSubtitle}>DISCOVER</Text>
          <Text style={styles.heroTitle}>Where will your{"\n"}next journey{"\n"}take you?</Text>
          <Text style={styles.heroDescription}>
            Explore curated destinations, local experiences, and hidden gems around the world
          </Text>
          <TouchableOpacity
            style={[styles.heroSearchBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Feather name="search" size={16} color="#fff" />
            <Text style={styles.heroSearchText}>Search destinations</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* TRENDING DESTINATIONS */}
      <View style={styles.trendingSection}>
        <View style={[styles.sectionHeader, { paddingHorizontal: H_PAD }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Trending Now</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllBtn, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingScroll}
          scrollEventThrottle={16}
        >
          {TRENDING_DESTINATIONS.map((dest) => (
            <TrendingDestinationCard key={dest.id} item={dest} />
          ))}
        </ScrollView>
      </View>

      {personalizedRecommendations ? (
        <>
          {/* PERSONALIZED BANNER */}
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop",
            }}
            style={[styles.personalizedBanner, { marginHorizontal: H_PAD, marginVertical: 24 }]}
            imageStyle={styles.personalizedImageStyle}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]}
              style={styles.personalizedGradient}
            />
            <View style={styles.personalizedBannerContent}>
              <Text style={styles.personalizedBannerTag}>CURATED FOR YOU</Text>
              <Text style={styles.personalizedBannerTitle}>
                Your trip to {personalizedRecommendations.trip.destination}
              </Text>
              <Text style={styles.personalizedBannerSubtitle}>
                Handpicked hotels, activities & restaurants
              </Text>
            </View>
          </ImageBackground>

          {/* RECOMMENDATIONS SECTIONS */}
          <Section
            title="Top Hotels"
            items={personalizedRecommendations.hotels}
            type="hotels"
          />
          <Section
            title="Must-Do Activities"
            items={personalizedRecommendations.activities}
            type="activities"
          />
          <Section
            title="Best Restaurants"
            items={personalizedRecommendations.restaurants}
            type="restaurants"
          />
        </>
      ) : (
        /* NO TRIPS STATE */
        <View style={styles.noTrips}>
          <LinearGradient
            colors={[colors.primary + "20", colors.primary + "10"]}
            style={styles.noTripsGradient}
          />
          <View style={styles.noTripsIcon}>
            <Feather name="compass" size={56} color={colors.primary} />
          </View>
          <Text style={[styles.noTripsTitle, { color: colors.foreground }]}>
            Plan Your Next Adventure
          </Text>
          <Text style={[styles.noTripsSubtitle, { color: colors.mutedForeground }]}>
            Create a trip to get personalized destination recommendations and local insights
          </Text>
          <TouchableOpacity
            style={[styles.ctaBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/create-trip")}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.ctaBtnText}>Create Your First Trip</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HERO SECTION
  heroSection: {
    height: Platform.OS === "web" ? 420 : 360,
    justifyContent: "flex-end",
    paddingHorizontal: H_PAD,
    paddingBottom: 40,
    overflow: "hidden",
  },
  heroImageStyle: {
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    gap: 16,
    zIndex: 2,
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: Platform.OS === "web" ? 48 : 40,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    lineHeight: Platform.OS === "web" ? 56 : 48,
  },
  heroDescription: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 24,
  },
  heroSearchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  heroSearchText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },

  // TRENDING SECTION
  trendingSection: {
    marginBottom: 32,
    marginTop: 28,
  },
  trendingScroll: {
    paddingHorizontal: 0,
    gap: 0,
  },
  trendingCard: {
    width: Platform.OS === "web" ? 280 : 240,
    height: Platform.OS === "web" ? 340 : 300,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  trendingImage: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  trendingImageStyle: {
    resizeMode: "cover",
  },
  trendingGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trendingContent: {
    zIndex: 2,
    gap: 10,
  },
  trendingSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
  },
  trendingName: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  trendingCountry: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
  },
  trendingPrice: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  trendingCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  trendingCtaText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },

  // PERSONALIZED BANNER
  personalizedBanner: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  personalizedImageStyle: {
    resizeMode: "cover",
  },
  personalizedGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  personalizedBannerContent: {
    zIndex: 2,
    gap: 8,
  },
  personalizedBannerTag: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 1,
  },
  personalizedBannerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    lineHeight: 32,
  },
  personalizedBannerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
  },

  // SECTIONS
  section: {
    paddingHorizontal: H_PAD,
    marginBottom: 36,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  seeAllBtn: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },

  // GRID
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },

  // IMPROVED RECOMMENDATION CARD
  improvedCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    height: Platform.OS === "web" ? 360 : 320,
  },
  cardImageBg: {
    height: 160,
    justifyContent: "flex-end",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  cardImageStyle: {
    resizeMode: "cover",
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardRatingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 3,
    backdropFilter: "blur(10px)",
  },
  cardRatingValue: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },

  // IMPROVED CARD CONTENT
  improvedCardContent: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
    gap: 10,
  },
  improvedCardTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  improvedCardLocation: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  improvedCardDescription: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  improvedCardPrice: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  improvedCardBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  improvedCardBtnText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },

  // NO TRIPS STATE
  noTrips: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: H_PAD,
    paddingTop: 60,
    paddingBottom: 60,
    position: "relative",
    marginVertical: 24,
  },
  noTripsGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  noTripsIcon: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    zIndex: 1,
  },
  noTripsTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
    textAlign: "center",
    zIndex: 1,
  },
  noTripsSubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
    zIndex: 1,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    zIndex: 1,
  },
  ctaBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
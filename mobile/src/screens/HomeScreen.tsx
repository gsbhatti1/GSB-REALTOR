import React, { useRef, useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Linking, StatusBar, Dimensions,
  Animated, Image,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../lib/theme'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

const { width: W, height: H } = Dimensions.get('window')

type Props = { navigation: NativeStackNavigationProp<any> }

// Gurpreet's photos — rotate as background
const BG_PHOTOS = [
  'https://www.gsbrealtor.com/images/gurpreet-headshot-pro.jpg',
  'https://www.gsbrealtor.com/images/gurpreet-standing.jpg',
  'https://www.gsbrealtor.com/images/gurpreet-headshot-smile.jpg',
]

const LANES = [
  {
    icon: '🔍',
    title: 'Search Homes',
    subtitle: '17,379 active Utah listings — search by city, price, beds',
    screen: 'Search',
    gold: true,
  },
  {
    icon: '💰',
    title: 'Sell Your Home',
    subtitle: 'Free comparative market analysis. No pressure, no obligation. Know your home\'s real value before you decide.',
    screen: 'Lead',
    params: { type: 'seller' },
  },
  {
    icon: '🏢',
    title: 'Commercial / Invest',
    subtitle: 'NNN leases, multi-family, retail, land & industrial. Gurpreet has closed commercial deals across Utah, Nevada & Wyoming.',
    screen: 'Lead',
    params: { type: 'commercial' },
  },
  {
    icon: '📋',
    title: 'Free Consultation',
    subtitle: 'Buying, selling or just have questions? Gurpreet responds personally within the hour — no bots, no assistants.',
    screen: 'Lead',
    params: { type: 'contact' },
  },
]

const STATS = [
  { value: '17K+',   label: 'Listings' },
  { value: '$7.3M+', label: 'Closed' },
  { value: '3',      label: 'States' },
  { value: '< 1hr',  label: 'Response' },
]

const CITIES = [
  'Salt Lake City', 'West Jordan', 'Sandy', 'South Jordan',
  'Draper', 'Murray', 'Lehi', 'Provo', 'Ogden', 'St. George',
]

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets()
  const [photoIdx, setPhotoIdx] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Crossfade between photos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]).start()
      setTimeout(() => {
        setPhotoIdx(i => (i + 1) % BG_PHOTOS.length)
      }, 800)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── CINEMATIC HERO ── */}
      <View style={[styles.heroContainer, { height: H * 0.52 }]}>
        <Animated.Image
          source={{ uri: BG_PHOTOS[photoIdx] }}
          style={[styles.heroBg, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
        {/* Dark overlays */}
        <View style={styles.heroOverlay1} />
        <View style={styles.heroOverlay2} />
        {/* Top gold bar */}
        <View style={[styles.topBar, { top: insets.top }]} />

        {/* Hero content */}
        <View style={[styles.heroContent, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.heroLabel}>GURPREET BHATTI · REALTOR® · USMC VETERAN</Text>
          <Text style={styles.heroTitle}>Utah Real Estate</Text>
          <Text style={styles.heroGold}>Done Different.</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {STATS.map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Photo dots */}
        <View style={styles.photoDots}>
          {BG_PHOTOS.map((_, i) => (
            <View key={i} style={[styles.dot, i === photoIdx && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Lane cards */}
        <View style={styles.lanes}>
          {LANES.map((lane) => (
            <TouchableOpacity
              key={lane.title}
              style={[styles.card, lane.gold && styles.cardGold]}
              onPress={() => navigation.navigate(lane.screen, (lane as any).params)}
              activeOpacity={0.82}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{lane.icon}</Text>
                <Text style={[styles.cardTitle, lane.gold && styles.cardTitleDark]}>
                  {lane.title}
                </Text>
                <Text style={[styles.cardArrow, lane.gold && styles.cardArrowDark]}>›</Text>
              </View>
              <Text style={[styles.cardSub, lane.gold && styles.cardSubDark]}>
                {lane.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular cities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>POPULAR CITIES</Text>
          <View style={styles.cityGrid}>
            {CITIES.map(city => (
              <TouchableOpacity
                key={city}
                style={styles.cityChip}
                onPress={() => navigation.navigate('Search', { city })}
                activeOpacity={0.75}
              >
                <Text style={styles.cityChipText}>{city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact card */}
        <View style={styles.contactCard}>
          <View style={styles.contactTop}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarLetter}>G</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>Gurpreet Bhatti</Text>
              <Text style={styles.contactRole}>REALTOR® · USMC Veteran</Text>
              <Text style={styles.contactLicense}>UT #12907042 · NV #S.0201351 · WY #RE-17041</Text>
            </View>
          </View>
          <Text style={styles.contactQuote}>
            "No bots. No assistants. When you call or text, you get Gurpreet — every single time."
          </Text>
          <TouchableOpacity
            style={styles.btnCall}
            onPress={() => Linking.openURL('tel:8016358462')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnCallText}>📞  Call 801.635.8462</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnText}
            onPress={() => Linking.openURL('sms:8016358462')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnTextText}>💬  Text Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.black },
  scroll:{ flex: 1 },

  // Hero
  heroContainer: {
    width: W,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  heroBg: {
    position: 'absolute',
    top: 0, left: 0,
    width: W,
    height: '100%' as any,
  },
  heroOverlay1: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(6,6,6,0.55)',
  },
  heroOverlay2: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 160,
    // gradient from transparent to black at bottom
    backgroundColor: 'transparent',
  },
  topBar: {
    position: 'absolute',
    left: 0, right: 0,
    height: 2,
    backgroundColor: colors.gold,
    zIndex: 10,
  },
  heroContent: {
    position: 'absolute',
    bottom: 32,
    left: spacing.xl,
    right: spacing.xl,
  },
  heroLabel: {
    fontSize: 9, letterSpacing: 2,
    color: colors.gold, textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 36, fontWeight: '300',
    color: colors.white, lineHeight: 38,
  },
  heroGold: {
    fontSize: 36, fontWeight: '300',
    fontStyle: 'italic', color: colors.gold,
    lineHeight: 42, marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  statItem: {},
  statValue: {
    fontSize: 18, color: colors.gold, fontWeight: '300',
  },
  statLabel: {
    fontSize: 9, color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  photoDots: {
    position: 'absolute',
    bottom: 12, right: 20,
    flexDirection: 'row', gap: 5,
  },
  dot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 18, backgroundColor: colors.gold,
  },

  // Cards
  lanes: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardGold: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon:  { fontSize: 22, marginRight: 10 },
  cardTitle: {
    flex: 1, fontSize: 16,
    fontWeight: '700', color: colors.white,
  },
  cardTitleDark: { color: colors.black },
  cardArrow: { fontSize: 22, color: colors.grey },
  cardArrowDark: { color: 'rgba(0,0,0,0.5)' },
  cardSub: {
    fontSize: 13, color: colors.grey,
    lineHeight: 19,
  },
  cardSubDark: { color: 'rgba(0,0,0,0.65)' },

  // Cities
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 10, letterSpacing: 1.5,
    color: colors.grey, textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: colors.border,
  },
  cityChipText: { fontSize: 13, color: colors.greyLight },

  // Contact
  contactCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    gap: spacing.md,
  },
  contactTop: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  avatarRing: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1.5, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(201,168,76,0.12)',
  },
  avatarLetter: { fontSize: 22, color: colors.gold, fontWeight: '300' },
  contactName:    { fontSize: 16, fontWeight: '700', color: colors.white, marginBottom: 2 },
  contactRole:    { fontSize: 12, color: colors.gold, marginBottom: 1 },
  contactLicense: { fontSize: 10, color: colors.greyDark },
  contactQuote:   {
    fontSize: 13, color: colors.grey,
    lineHeight: 21, fontStyle: 'italic',
  },
  btnCall: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm, paddingVertical: 15,
    alignItems: 'center',
  },
  btnCallText: { color: colors.black, fontWeight: '700', fontSize: 15 },
  btnText: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingVertical: 15,
    alignItems: 'center',
  },
  btnTextText: { color: colors.white, fontWeight: '600', fontSize: 15 },
})

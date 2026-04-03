import React, { useRef } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Linking, StatusBar,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, shadow } from '../lib/theme'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type Props = { navigation: NativeStackNavigationProp<any> }

const LANES = [
  {
    icon: '🔍',
    title: 'Search Homes',
    subtitle: '17,000+ active Utah listings',
    screen: 'Search',
    gold: true,
  },
  {
    icon: '💰',
    title: 'Sell Your Home',
    subtitle: 'Free CMA — no pressure, no obligation',
    screen: 'Lead',
    params: { type: 'seller' },
    gold: false,
  },
  {
    icon: '🏢',
    title: 'Commercial / Invest',
    subtitle: 'NNN · Multi-family · Land · Retail',
    screen: 'Lead',
    params: { type: 'commercial' },
    gold: false,
  },
  {
    icon: '📋',
    title: 'Free Consultation',
    subtitle: 'Talk to Gurpreet — responds within 1 hr',
    screen: 'Lead',
    params: { type: 'contact' },
    gold: false,
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
  const scrollY = useRef(new Animated.Value(0)).current

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <View style={styles.topBar} />

      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero header */}
        <Animated.View style={[styles.hero, { opacity: headerOpacity }]}>
          <Text style={styles.heroLabel}>GURPREET BHATTI · REALTOR® · USMC VETERAN</Text>
          <Text style={styles.heroTitle}>Utah Real Estate</Text>
          <Text style={styles.heroGold}>Done Different.</Text>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Lane cards */}
        <View style={styles.section}>
          {LANES.map((lane, i) => (
            <TouchableOpacity
              key={lane.title}
              style={[styles.card, lane.gold && styles.cardGold]}
              onPress={() => navigation.navigate(lane.screen, lane.params)}
              activeOpacity={0.82}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>{lane.icon}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, lane.gold && styles.cardTitleDark]}>
                    {lane.title}
                  </Text>
                  <Text style={[styles.cardSub, lane.gold && styles.cardSubDark]}>
                    {lane.subtitle}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardArrow, lane.gold && styles.cardArrowDark]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick city search */}
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

        {/* Direct contact */}
        <View style={[styles.section, styles.contactCard]}>
          <View style={styles.contactTop}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarLetter}>G</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Gurpreet Bhatti</Text>
              <Text style={styles.contactTitle}>REALTOR® · USMC Veteran</Text>
              <Text style={styles.contactLicense}>UT #12907042-SA00</Text>
            </View>
          </View>
          <Text style={styles.contactQuote}>
            No bots. No assistants. When you call, you get Gurpreet. Every time.
          </Text>
          <View style={styles.contactBtns}>
            <TouchableOpacity
              style={styles.btnCall}
              onPress={() => Linking.openURL('tel:8016358462')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnCallText}>📞  Call 801.635.8462</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSMS}
              onPress={() => Linking.openURL('sms:8016358462')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnSMSText}>💬  Text Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.black },
  scroll: { flex: 1 },
  topBar: { height: 2, backgroundColor: colors.gold },

  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  heroLabel: {
    fontSize: 9, letterSpacing: 2,
    color: colors.gold, textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 38, fontWeight: '300',
    color: colors.white, lineHeight: 40,
  },
  heroGold: {
    fontSize: 38, fontWeight: '300',
    fontStyle: 'italic', color: colors.gold,
    lineHeight: 42,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.lg,
  },
  statItem:  { alignItems: 'flex-start' },
  statValue: { fontSize: 20, color: colors.gold, fontWeight: '300' },
  statLabel: { fontSize: 9, color: colors.grey, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },

  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: 10, letterSpacing: 1.5,
    color: colors.grey, textTransform: 'uppercase',
    marginBottom: 4,
  },

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardGold: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  cardLeft:  { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  cardIcon:  { fontSize: 26 },
  cardText:  { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.white, marginBottom: 2 },
  cardTitleDark: { color: colors.black },
  cardSub:   { fontSize: 12, color: colors.grey, lineHeight: 16 },
  cardSubDark: { color: 'rgba(0,0,0,0.6)' },
  cardArrow: { fontSize: 24, color: colors.grey, fontWeight: '300' },
  cardArrowDark: { color: colors.black },

  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.border,
  },
  cityChipText: { fontSize: 13, color: colors.greyLight },

  contactCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderGold,
    padding: spacing.xl,
    gap: spacing.md,
  },
  contactTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarRing: {
    width: 52, height: 52, borderRadius: 26,
    borderWidth: 1.5, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.goldFaded,
  },
  avatarLetter: { fontSize: 22, color: colors.gold, fontWeight: '300' },
  contactInfo:   { flex: 1 },
  contactName:   { fontSize: 17, fontWeight: '600', color: colors.white, marginBottom: 2 },
  contactTitle:  { fontSize: 12, color: colors.gold, marginBottom: 1 },
  contactLicense:{ fontSize: 10, color: colors.greyDark },
  contactQuote:  { fontSize: 13, color: colors.grey, lineHeight: 20, fontStyle: 'italic' },
  contactBtns:   { gap: spacing.sm },

  btnCall: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm, paddingVertical: 14,
    alignItems: 'center',
  },
  btnCallText: { color: colors.black, fontWeight: '700', fontSize: 15 },
  btnSMS: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingVertical: 14,
    alignItems: 'center',
  },
  btnSMSText: { color: colors.white, fontWeight: '600', fontSize: 15 },
})

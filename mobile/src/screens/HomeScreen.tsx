import React from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Linking, StatusBar, SafeAreaView,
} from 'react-native'
import { colors, spacing, radius } from '../lib/theme'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type Props = { navigation: NativeStackNavigationProp<any> }

const LANES = [
  {
    icon: '🏠',
    title: 'Buy a Home',
    subtitle: 'Search 17K+ Utah listings',
    action: 'Search',
    screen: 'Search',
    gold: true,
  },
  {
    icon: '💰',
    title: 'Sell Your Home',
    subtitle: 'Free market valuation — no pressure',
    action: 'Get Value',
    screen: 'Lead',
    params: { type: 'seller' },
    gold: false,
  },
  {
    icon: '🏢',
    title: 'Commercial / Invest',
    subtitle: 'NNN, multi-family, land, retail',
    action: 'Inquire',
    screen: 'Lead',
    params: { type: 'commercial' },
    gold: false,
  },
]

const STATS = [
  { value: '17K+',  label: 'Listings' },
  { value: '$7.3M+',label: 'Volume' },
  { value: '3',     label: 'States' },
  { value: '< 1hr', label: 'Response' },
]

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Gold top bar */}
        <View style={styles.topBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>GURPREET BHATTI · REALTOR® · USMC VETERAN</Text>
          <Text style={styles.headerTitle}>Utah Real Estate</Text>
          <Text style={styles.headerGold}>Done Different.</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map(s => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Lane cards */}
        <View style={styles.lanes}>
          {LANES.map((lane) => (
            <TouchableOpacity
              key={lane.title}
              style={[styles.card, lane.gold && styles.cardGold]}
              onPress={() => navigation.navigate(lane.screen, lane.params)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardIcon}>{lane.icon}</Text>
                <View>
                  <Text style={[styles.cardTitle, lane.gold && styles.cardTitleGold]}>
                    {lane.title}
                  </Text>
                  <Text style={styles.cardSub}>{lane.subtitle}</Text>
                </View>
              </View>
              <View style={[styles.cardBtn, lane.gold && styles.cardBtnGold]}>
                <Text style={[styles.cardBtnText, !lane.gold && styles.cardBtnTextGold]}>
                  {lane.action} →
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Direct contact */}
        <View style={styles.contact}>
          <Text style={styles.contactTitle}>Talk to Gurpreet Directly</Text>
          <Text style={styles.contactSub}>No bots. No assistants. You get Gurpreet every time.</Text>
          <View style={styles.contactBtns}>
            <TouchableOpacity
              style={styles.btnCall}
              onPress={() => Linking.openURL('tel:8016358462')}
            >
              <Text style={styles.btnCallText}>📞  Call 801.635.8462</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnText}
              onPress={() => Linking.openURL('sms:8016358462')}
            >
              <Text style={styles.btnTextText}>💬  Text Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  container: { flex: 1, backgroundColor: colors.black },
  topBar: { height: 2, backgroundColor: colors.gold },

  header: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.gold,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '300',
    color: colors.white,
    lineHeight: 42,
  },
  headerGold: {
    fontSize: 40,
    fontWeight: '300',
    fontStyle: 'italic',
    color: colors.gold,
    lineHeight: 44,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  stat: { alignItems: 'flex-start' },
  statValue: {
    fontSize: 20,
    color: colors.gold,
    fontWeight: '300',
  },
  statLabel: {
    fontSize: 9,
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },

  lanes: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardGold: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  cardIcon: { fontSize: 28 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 2,
  },
  cardTitleGold: { color: colors.black },
  cardSub: {
    fontSize: 12,
    color: colors.grey,
  },
  cardBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardBtnGold: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  cardBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  cardBtnTextGold: { color: colors.gold },

  contact: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: colors.white,
    marginBottom: 6,
  },
  contactSub: {
    fontSize: 13,
    color: colors.grey,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  contactBtns: { gap: spacing.sm },
  btnCall: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnCallText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  btnText: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnTextText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
})

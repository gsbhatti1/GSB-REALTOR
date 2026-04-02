import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, SafeAreaView, StatusBar, Dimensions, ActivityIndicator,
} from 'react-native'
import { colors, spacing, radius } from '../lib/theme'
import { getPropertyMedia, Property } from '../lib/api'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'

const { width } = Dimensions.get('window')

type Props = {
  navigation: NativeStackNavigationProp<any>
  route: RouteProp<any>
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function PropertyDetailScreen({ navigation, route }: Props) {
  const property: Property = (route.params as any)?.property
  const [photos, setPhotos]   = useState<string[]>([])
  const [photoIdx, setPhotoIdx] = useState(0)
  const [loadingPhotos, setLoadingPhotos] = useState(true)

  useEffect(() => {
    getPropertyMedia(property.ListingKey).then(p => {
      setPhotos(p)
      setLoadingPhotos(false)
    })
  }, [property.ListingKey])

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Photo area */}
        <View style={styles.photoArea}>
          {loadingPhotos ? (
            <View style={styles.photoPlaceholder}>
              <ActivityIndicator color={colors.gold} size="large" />
            </View>
          ) : photos.length > 0 ? (
            <ScrollView
              horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onScroll={e => setPhotoIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
              scrollEventThrottle={16}
              style={styles.photoScroll}
            >
              {photos.slice(0, 20).map((url, i) => (
                <View key={i} style={styles.photoWrap}>
                  <Text style={styles.photoPlaceholderText}>📷 {i + 1}/{Math.min(photos.length, 20)}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.noPhotoText}>🏠</Text>
              <Text style={styles.noPhotoLabel}>No Photos</Text>
            </View>
          )}
          {photos.length > 1 && (
            <View style={styles.photoDots}>
              <Text style={styles.photoCounter}>{photoIdx + 1} / {Math.min(photos.length, 20)}</Text>
            </View>
          )}
        </View>

        {/* Price & address */}
        <View style={styles.priceBlock}>
          <Text style={styles.price}>{fmt(property.ListPrice)}</Text>
          <Text style={styles.address}>{property.UnparsedAddress}</Text>
          <Text style={styles.cityState}>{property.City}, {property.StateOrProvince} {property.PostalCode}</Text>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Beds',   value: property.BedroomsTotal?.toString()      || '—' },
            { label: 'Baths',  value: property.BathroomsTotalInteger?.toString() || '—' },
            { label: 'Sq Ft',  value: property.LivingArea ? property.LivingArea.toLocaleString() : '—' },
            { label: 'Type',   value: property.PropertyType?.replace('Residential','Res') || '—' },
          ].map(s => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Status badge */}
        <View style={styles.statusRow}>
          <View style={[styles.badge, property.StandardStatus === 'Active' && styles.badgeActive]}>
            <Text style={styles.badgeText}>{property.StandardStatus}</Text>
          </View>
          <Text style={styles.agentLabel}>Listed by {property.ListAgentFullName || 'Agent'}</Text>
        </View>

        {/* Description */}
        {property.PublicRemarks ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Property</Text>
            <Text style={styles.remarks}>{property.PublicRemarks}</Text>
          </View>
        ) : null}

        {/* CTA buttons */}
        <View style={styles.ctas}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() => navigation.navigate('Lead', { type: 'buyer' })}
          >
            <Text style={styles.ctaPrimaryText}>📩  Request a Showing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={() => Linking.openURL('tel:8016358462')}
          >
            <Text style={styles.ctaSecondaryText}>📞  Call 801.635.8462</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaOutline}
            onPress={() => Linking.openURL(`https://www.gsbrealtor.com/property/${property.ListingKey}`)}
          >
            <Text style={styles.ctaOutlineText}>View Full Listing on Web →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  container: { flex: 1 },

  photoArea: { height: 260, backgroundColor: '#111', position: 'relative' },
  photoScroll: { width, height: 260 },
  photoWrap: {
    width, height: 260,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: { color: colors.grey, fontSize: 16 },
  photoPlaceholder: {
    width, height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    gap: spacing.sm,
  },
  noPhotoText: { fontSize: 48 },
  noPhotoLabel: { color: colors.grey, fontSize: 13 },
  photoDots: {
    position: 'absolute', bottom: spacing.sm, right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  photoCounter: { color: colors.white, fontSize: 12 },

  priceBlock: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  price: {
    fontSize: 32, fontWeight: '300',
    color: colors.gold, marginBottom: 4,
  },
  address: { fontSize: 16, color: colors.white, marginBottom: 2 },
  cityState: { fontSize: 13, color: colors.grey },

  statsRow: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 18, color: colors.white, fontWeight: '600' },
  statLabel: {
    fontSize: 10, color: colors.grey,
    textTransform: 'uppercase', letterSpacing: 1, marginTop: 2,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeActive: {
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderColor: 'rgba(76,175,80,0.4)',
  },
  badgeText: { fontSize: 12, color: colors.white, fontWeight: '600' },
  agentLabel: { fontSize: 12, color: colors.grey },

  section: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 11, color: colors.gold, fontWeight: '600',
    letterSpacing: 0.5, marginBottom: spacing.md, textTransform: 'uppercase',
  },
  remarks: { fontSize: 14, color: colors.grey, lineHeight: 22 },

  ctas: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  ctaPrimary: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    padding: 16,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: colors.black, fontWeight: '700', fontSize: 15,
  },
  ctaSecondary: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 16, alignItems: 'center',
  },
  ctaSecondaryText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  ctaOutline: {
    padding: 14, alignItems: 'center',
  },
  ctaOutlineText: { color: colors.gold, fontSize: 13 },
})

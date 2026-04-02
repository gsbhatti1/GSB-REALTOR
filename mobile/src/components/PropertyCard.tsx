import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, spacing, radius } from '../lib/theme'
import { Property } from '../lib/api'

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

interface Props {
  property: Property
  onPress: () => void
}

export default function PropertyCard({ property, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Photo placeholder */}
      <View style={styles.photo}>
        <Text style={styles.photoIcon}>🏠</Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeText}>{fmt(property.ListPrice)}</Text>
        </View>
        {property.StandardStatus === 'Active' && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.address} numberOfLines={1}>
          {property.UnparsedAddress || 'Address not listed'}
        </Text>
        <Text style={styles.city} numberOfLines={1}>
          {property.City}, UT {property.PostalCode}
        </Text>
        <View style={styles.stats}>
          {property.BedroomsTotal ? (
            <Text style={styles.stat}>🛏 {property.BedroomsTotal} bd</Text>
          ) : null}
          {property.BathroomsTotalInteger ? (
            <Text style={styles.stat}>🚿 {property.BathroomsTotalInteger} ba</Text>
          ) : null}
          {property.LivingArea ? (
            <Text style={styles.stat}>📐 {property.LivingArea.toLocaleString()} sqft</Text>
          ) : null}
          {property.PropertyType ? (
            <Text style={styles.stat}>{property.PropertyType.replace('Residential', 'Res')}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  photo: {
    height: 180,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  photoIcon: { fontSize: 40, opacity: 0.3 },
  priceBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  priceBadgeText: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 16,
  },
  activeBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  activeBadgeText: { color: '#4CAF50', fontSize: 11, fontWeight: '600' },

  info: { padding: spacing.md },
  address: {
    fontSize: 15, fontWeight: '600', color: colors.white, marginBottom: 2,
  },
  city: { fontSize: 12, color: colors.grey, marginBottom: spacing.sm },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { fontSize: 12, color: colors.grey },
})

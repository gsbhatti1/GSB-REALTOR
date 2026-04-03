import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ActivityIndicator,
} from 'react-native'
import { colors, spacing, radius, shadow } from '../lib/theme'
import { Property, formatPrice } from '../lib/api'
import { isPropertySaved, saveProperty, unsaveProperty } from '../lib/storage'

interface Props {
  property: Property
  onPress:  () => void
}

export default function PropertyCard({ property, onPress }: Props) {
  const [saved,        setSaved]        = useState(false)
  const [imgLoading,   setImgLoading]   = useState(true)
  const [imgError,     setImgError]     = useState(false)

  const photo = property.Media?.[0]?.MediaURL || null

  useEffect(() => {
    isPropertySaved(property.ListingKey).then(setSaved)
  }, [property.ListingKey])

  const toggleSave = async (e: any) => {
    e.stopPropagation()
    if (saved) {
      await unsaveProperty(property.ListingKey)
      setSaved(false)
    } else {
      await saveProperty({
        listingKey:   property.ListingKey,
        address:      property.UnparsedAddress || '',
        city:         property.City || '',
        listPrice:    property.ListPrice,
        bedrooms:     property.BedroomsTotal,
        bathrooms:    property.BathroomsTotalInteger,
        photoUrl:     photo || '',
        propertyType: property.PropertyType || '',
        savedAt:      new Date().toISOString(),
      })
      setSaved(true)
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Photo */}
      <View style={styles.photoWrap}>
        {photo && !imgError ? (
          <>
            <Image
              source={{ uri: photo }}
              style={styles.photo}
              onLoad={() => setImgLoading(false)}
              onError={() => { setImgError(true); setImgLoading(false) }}
              resizeMode="cover"
            />
            {imgLoading && (
              <View style={styles.photoLoader}>
                <ActivityIndicator color={colors.gold} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.photoFallback}>
            <Text style={styles.photoFallbackIcon}>🏠</Text>
          </View>
        )}

        {/* Price badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{formatPrice(property.ListPrice)}</Text>
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={toggleSave} activeOpacity={0.8}>
          <Text style={styles.saveIcon}>{saved ? '♥' : '♡'}</Text>
        </TouchableOpacity>

        {/* Status badge */}
        {property.StandardStatus === 'Active' && (
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.address} numberOfLines={1}>
          {property.UnparsedAddress || 'Address unavailable'}
        </Text>
        <Text style={styles.city} numberOfLines={1}>
          {property.City}{property.City ? ', UT' : ''} {property.PostalCode}
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {!!property.BedroomsTotal && (
            <View style={styles.statChip}>
              <Text style={styles.statText}>🛏 {property.BedroomsTotal} bd</Text>
            </View>
          )}
          {!!property.BathroomsTotalInteger && (
            <View style={styles.statChip}>
              <Text style={styles.statText}>🚿 {property.BathroomsTotalInteger} ba</Text>
            </View>
          )}
          {!!property.LivingArea && (
            <View style={styles.statChip}>
              <Text style={styles.statText}>📐 {property.LivingArea.toLocaleString()} ft²</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  photoWrap: {
    height: 200,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoLoader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  photoFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  photoFallbackIcon: { fontSize: 48, opacity: 0.2 },

  priceBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(6,6,6,0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  priceText: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  saveBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(6,6,6,0.7)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  saveIcon: { fontSize: 18, color: colors.gold },

  activeBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76,175,80,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.4)',
  },
  activeDot: {
    width: 6, height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  activeText: { fontSize: 10, color: colors.success, fontWeight: '600' },

  info: { padding: spacing.md },
  address: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 3,
  },
  city: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statChip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statText: { fontSize: 11, color: colors.grey },
})

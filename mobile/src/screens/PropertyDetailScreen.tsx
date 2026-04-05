import React, { useState, useEffect, useRef } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, StatusBar, Dimensions, ActivityIndicator,
  Image, FlatList, Share, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, shadow } from '../lib/theme'
import { getPropertyPhotos, Property, formatPrice } from '../lib/api'
import { isPropertySaved, saveProperty, unsaveProperty } from '../lib/storage'
import { getCurrentUser, autoEnrollAlert, submitLeadWithTracking } from '../lib/auth'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'

const { width } = Dimensions.get('window')

type Props = {
  navigation: NativeStackNavigationProp<any>
  route:      RouteProp<any>
}

export default function PropertyDetailScreen({ navigation, route }: Props) {
  const property: Property = (route.params as any)?.property
  const [photos,      setPhotos]      = useState<string[]>([])
  const [photoIdx,    setPhotoIdx]    = useState(0)
  const [loadingPics, setLoadingPics] = useState(true)
  const [saved,       setSaved]       = useState(false)
  const [imgErrors,   setImgErrors]   = useState<Record<number, boolean>>({})

  useEffect(() => {
    // Set nav header save button
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16, marginRight: 8 }}>
          <TouchableOpacity onPress={handleShare}>
            <Text style={{ fontSize: 20 }}>⬆️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSave}>
            <Text style={{ fontSize: 20 }}>{saved ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [saved])

  useEffect(() => {
    isPropertySaved(property.ListingKey).then(setSaved)
    // Use photos from property.Media first (faster), then fetch more
    if (property.Media && property.Media.length > 0) {
      setPhotos(property.Media.map(m => m.MediaURL))
      setLoadingPics(false)
    } else {
      getPropertyPhotos(property.ListingKey).then(p => {
        setPhotos(p)
        setLoadingPics(false)
      })
    }
  }, [property.ListingKey])

  const toggleSave = async () => {
    if (saved) {
      await unsaveProperty(property.ListingKey)
      setSaved(false)
      return
    }
    // Gate: must be signed in to save
    const user = await getCurrentUser()
    if (!user) {
      Alert.alert(
        'Sign In to Save',
        'Create a free account to save properties and get alerts when similar homes hit the market.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Tabs', { screen: 'Profile' }) },
        ]
      )
      return
    }
    // Save the property
    await saveProperty({
      listingKey:   property.ListingKey,
      address:      property.UnparsedAddress || '',
      city:         property.City || '',
      listPrice:    property.ListPrice,
      bedrooms:     property.BedroomsTotal,
      bathrooms:    property.BathroomsTotalInteger,
      photoUrl:     photos[0] || '',
      propertyType: property.PropertyType || '',
      savedAt:      new Date().toISOString(),
    })
    setSaved(true)
    // Auto-enroll in listing alerts for this city (silent)
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
    autoEnrollAlert({ email: user.email!, name, city: property.City, source: 'mobile_save' })
    // Track as lead (silent)
    submitLeadWithTracking({
      name,
      email: user.email!,
      message: `Saved property: ${property.UnparsedAddress || property.City} — $${property.ListPrice?.toLocaleString()}`,
      type: 'saved_property',
      city: property.City,
      propertyAddress: property.UnparsedAddress,
    })
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${formatPrice(property.ListPrice)} property in ${property.City}, UT — listed on GSB Realtor\nhttps://www.gsbrealtor.com/listing/${property.ListingKey}`,
        url: `https://www.gsbrealtor.com/listing/${property.ListingKey}`,
        title: `${formatPrice(property.ListPrice)} in ${property.City}`,
      })
    } catch {}
  }

  const openMaps = () => {
    const addr = encodeURIComponent(`${property.UnparsedAddress}, ${property.City}, UT`)
    const url  = `https://maps.apple.com/?address=${addr}`
    const urlG = `https://www.google.com/maps/search/?api=1&query=${addr}`
    Alert.alert('Open in Maps', 'Choose a maps app:', [
      { text: 'Apple Maps',  onPress: () => Linking.openURL(url)  },
      { text: 'Google Maps', onPress: () => Linking.openURL(urlG) },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const dom = property.DaysOnMarket
  const domLabel = dom === 0 ? 'New today' : dom === 1 ? '1 day' : `${dom} days`

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Photo carousel */}
        <View style={styles.photoArea}>
          {loadingPics ? (
            <View style={styles.photoLoader}>
              <ActivityIndicator size="large" color={colors.gold} />
            </View>
          ) : photos.length > 0 ? (
            <>
              <FlatList
                data={photos.slice(0, 25)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                onScroll={e => setPhotoIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => (
                  <View style={styles.photoSlide}>
                    {!imgErrors[index] ? (
                      <Image
                        source={{ uri: item }}
                        style={styles.photo}
                        resizeMode="cover"
                        onError={() => setImgErrors(prev => ({ ...prev, [index]: true }))}
                      />
                    ) : (
                      <View style={styles.photoFallback}>
                        <Text style={{ fontSize: 40, opacity: 0.2 }}>🏠</Text>
                      </View>
                    )}
                  </View>
                )}
              />
              {/* Photo counter */}
              <View style={styles.photoCounter}>
                <Text style={styles.photoCounterText}>{photoIdx + 1} / {Math.min(photos.length, 25)}</Text>
              </View>
            </>
          ) : (
            <View style={styles.photoFallback}>
              <Text style={{ fontSize: 52, opacity: 0.2 }}>🏠</Text>
              <Text style={{ color: colors.greyDark, fontSize: 13, marginTop: 8 }}>No photos available</Text>
            </View>
          )}
        </View>

        {/* Price block */}
        <View style={styles.priceBlock}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(property.ListPrice)}</Text>
            <View style={[styles.statusBadge, property.StandardStatus === 'Active' && styles.statusActive]}>
              <View style={property.StandardStatus === 'Active' ? styles.dotActive : styles.dot} />
              <Text style={[styles.statusText, property.StandardStatus === 'Active' && styles.statusTextActive]}>
                {property.StandardStatus}
              </Text>
            </View>
          </View>
          <Text style={styles.address}>{property.UnparsedAddress}</Text>
          <TouchableOpacity onPress={openMaps} style={styles.cityRow}>
            <Text style={styles.cityText}>📍  {property.City}, {property.StateOrProvince} {property.PostalCode}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick stats */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Beds',     value: property.BedroomsTotal?.toString()         || '—', icon: '🛏' },
            { label: 'Baths',    value: property.BathroomsTotalInteger?.toString()  || '—', icon: '🚿' },
            { label: 'Sq Ft',    value: property.LivingArea ? property.LivingArea.toLocaleString() : '—', icon: '📐' },
            { label: 'Year Built',value: property.YearBuilt?.toString()             || '—', icon: '🏗' },
            { label: 'On Market', value: domLabel,                                           icon: '📅' },
            { label: 'Type',     value: (property.PropertySubType || property.PropertyType || '—').replace('Residential','Res'), icon: '🏠' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        {!!property.PublicRemarks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT THIS PROPERTY</Text>
            <Text style={styles.remarks}>{property.PublicRemarks}</Text>
          </View>
        )}

        {/* Listing info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LISTING INFO</Text>
          {[
            { label: 'Listed by',  value: property.ListAgentFullName || '—' },
            { label: 'Office',     value: property.ListOfficeName || '—' },
            { label: 'MLS #',      value: property.ListingKey },
            { label: 'Property Type', value: property.PropertyType || '—' },
          ].map(r => (
            <View key={r.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{r.label}</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{r.value}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={styles.ctas}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={async () => {
              const user = await getCurrentUser()
              if (!user) {
                Alert.alert(
                  'Sign In to Request a Showing',
                  'Create a free account so Gurpreet can follow up with you and you get updates on this property.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign In', onPress: () => navigation.navigate('Tabs', { screen: 'Profile' }) },
                  ]
                )
                return
              }
              navigation.navigate('Lead', {
                type: 'buyer',
                prefill: `I'm interested in the property at ${property.UnparsedAddress}, ${property.City} (MLS ${property.ListingKey}) listed at ${formatPrice(property.ListPrice)}.`,
              })
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaPrimaryText}>📩  Request a Showing</Text>
          </TouchableOpacity>

          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={[styles.ctaHalf, styles.ctaGhost]}
              onPress={() => Linking.openURL('tel:8016358462')}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaGhostText}>📞  Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaHalf, styles.ctaGhost]}
              onPress={() => Linking.openURL('sms:8016358462')}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaGhostText}>💬  Text</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.ctaOutline}
            onPress={() => Linking.openURL(`https://www.gsbrealtor.com/listing/${property.ListingKey}`)}
            activeOpacity={0.75}
          >
            <Text style={styles.ctaOutlineText}>View Full Listing on Web →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.black },
  container: { flex: 1 },

  photoArea: { height: 280, backgroundColor: '#111' },
  photoSlide:{ width, height: 280 },
  photo: { width: '100%' as any, height: '100%' as any },
  photoLoader:{
    flex: 1, alignItems: 'center', justifyContent: 'center', height: 280,
  },
  photoFallback: {
    height: 280, width: '100%' as any,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#111',
  },
  photoCounter: {
    position: 'absolute', bottom: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  photoCounterText: { color: colors.white, fontSize: 12 },

  priceBlock: {
    padding: spacing.xl,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  priceRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  price:     { fontSize: 30, fontWeight: '300', color: colors.gold },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full, backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.border,
  },
  statusActive: { backgroundColor: colors.successFaded, borderColor: 'rgba(76,175,80,0.4)' },
  dot:          { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.grey },
  dotActive:    { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  statusText:   { fontSize: 11, color: colors.grey, fontWeight: '600' },
  statusTextActive: { color: colors.success },
  address:   { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 4 },
  cityRow:   { flexDirection: 'row', alignItems: 'center' },
  cityText:  { fontSize: 13, color: colors.gold },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    padding: spacing.md, gap: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  statCard: {
    flex: 1, minWidth: '30%',
    backgroundColor: colors.bgCardAlt,
    borderRadius: radius.sm, padding: spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  statIcon:  { fontSize: 18, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '600', color: colors.white, marginBottom: 2 },
  statLabel: { fontSize: 10, color: colors.grey, textTransform: 'uppercase', letterSpacing: 0.8, textAlign: 'center' },

  section:   { padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border },
  sectionTitle: { fontSize: 10, letterSpacing: 1.5, color: colors.gold, textTransform: 'uppercase', marginBottom: spacing.md },
  remarks:   { fontSize: 14, color: colors.grey, lineHeight: 22 },
  infoRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  infoLabel: { fontSize: 13, color: colors.grey, flex: 1 },
  infoValue: { fontSize: 13, color: colors.white, fontWeight: '500', flex: 1, textAlign: 'right' },

  ctas: { padding: spacing.xl, gap: spacing.sm },
  ctaPrimary: {
    backgroundColor: colors.gold, borderRadius: radius.sm,
    paddingVertical: 16, alignItems: 'center',
  },
  ctaPrimaryText: { color: colors.black, fontWeight: '700', fontSize: 15 },
  ctaRow:    { flexDirection: 'row', gap: spacing.sm },
  ctaHalf:   { flex: 1, paddingVertical: 14, borderRadius: radius.sm, alignItems: 'center' },
  ctaGhost:  { borderWidth: 1, borderColor: colors.border },
  ctaGhostText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  ctaOutline:{ paddingVertical: 12, alignItems: 'center' },
  ctaOutlineText: { color: colors.gold, fontSize: 13 },
})

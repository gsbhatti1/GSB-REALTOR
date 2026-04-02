import React, { useState, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, Image, Alert,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { colors, spacing, radius, shadow } from '../lib/theme'
import { getSavedProperties, unsaveProperty, SavedProperty } from '../lib/storage'
import { formatPrice } from '../lib/api'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type Props = { navigation: NativeStackNavigationProp<any> }

export default function SavedScreen({ navigation }: Props) {
  const [saved, setSaved] = useState<SavedProperty[]>([])

  // Reload every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getSavedProperties().then(setSaved)
    }, [])
  )

  const handleRemove = (listingKey: string, address: string) => {
    Alert.alert(
      'Remove Property',
      `Remove "${address}" from saved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            await unsaveProperty(listingKey)
            setSaved(prev => prev.filter(p => p.listingKey !== listingKey))
          },
        },
      ]
    )
  }

  if (saved.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>No saved homes yet</Text>
          <Text style={styles.emptySub}>
            Tap the heart icon on any property to save it here for easy access
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.85}
          >
            <Text style={styles.browseBtnText}>Browse Properties →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <FlatList
        data={saved}
        keyExtractor={item => item.listingKey}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Saved Homes</Text>
            <Text style={styles.headerSub}>{saved.length} propert{saved.length === 1 ? 'y' : 'ies'}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PropertyDetail', {
              property: {
                ListingKey:            item.listingKey,
                ListPrice:             item.listPrice,
                UnparsedAddress:       item.address,
                City:                  item.city,
                BedroomsTotal:         item.bedrooms,
                BathroomsTotalInteger: item.bathrooms,
                PropertyType:          item.propertyType,
                StandardStatus:        'Active',
                Media: item.photoUrl ? [{ MediaURL: item.photoUrl }] : [],
              }
            })}
            activeOpacity={0.85}
          >
            {/* Photo */}
            <View style={styles.cardPhoto}>
              {item.photoUrl ? (
                <Image source={{ uri: item.photoUrl }} style={styles.photo} resizeMode="cover" />
              ) : (
                <View style={styles.photoFallback}>
                  <Text style={{ fontSize: 30, opacity: 0.2 }}>🏠</Text>
                </View>
              )}
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{formatPrice(item.listPrice)}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
              <Text style={styles.cardAddress} numberOfLines={1}>{item.address}</Text>
              <Text style={styles.cardCity}>{item.city}, UT</Text>
              <View style={styles.cardStats}>
                {!!item.bedrooms  && <Text style={styles.stat}>🛏 {item.bedrooms} bd</Text>}
                {!!item.bathrooms && <Text style={styles.stat}>🚿 {item.bathrooms} ba</Text>}
                <Text style={styles.statType}>{item.propertyType?.replace('Residential','Res')}</Text>
              </View>
            </View>

            {/* Remove button */}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemove(item.listingKey, item.address)}
            >
              <Text style={styles.removeIcon}>♥</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  list: { padding: spacing.md, paddingBottom: 100 },

  header: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  headerTitle: { fontSize: 26, fontWeight: '300', color: colors.white },
  headerSub:   { fontSize: 13, color: colors.grey, marginTop: 2 },

  emptyContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xxl, gap: spacing.md,
  },
  emptyIcon:  { fontSize: 60, color: colors.gold, marginBottom: spacing.sm },
  emptyTitle: { fontSize: 22, fontWeight: '300', color: colors.white },
  emptySub:   { fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 22, maxWidth: 280 },
  browseBtn: {
    marginTop: spacing.md,
    borderWidth: 1, borderColor: colors.borderGold,
    borderRadius: radius.sm, paddingHorizontal: 28, paddingVertical: 13,
  },
  browseBtnText: { color: colors.gold, fontSize: 14, fontWeight: '600' },

  card: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardPhoto: { width: 100, position: 'relative' },
  photo:     { width: 100, height: '100%' },
  photoFallback: {
    width: 100, flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'center',
  },
  priceBadge: {
    position: 'absolute', bottom: 6, left: 4,
    backgroundColor: 'rgba(6,6,6,0.85)',
    paddingHorizontal: 6, paddingVertical: 3,
    borderRadius: 4,
  },
  priceText: { color: colors.gold, fontWeight: '700', fontSize: 11 },

  cardInfo:    { flex: 1, padding: spacing.md, justifyContent: 'center' },
  cardAddress: { fontSize: 13, fontWeight: '600', color: colors.white, marginBottom: 2 },
  cardCity:    { fontSize: 11, color: colors.grey, marginBottom: spacing.sm },
  cardStats:   { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  stat:        { fontSize: 11, color: colors.grey },
  statType:    { fontSize: 10, color: colors.greyDark },

  removeBtn: {
    padding: spacing.md,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  removeIcon: { fontSize: 22, color: colors.gold },
})

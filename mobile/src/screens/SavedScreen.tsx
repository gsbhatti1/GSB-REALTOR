import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar,
} from 'react-native'
import { colors, spacing, radius } from '../lib/theme'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

type Props = { navigation: NativeStackNavigationProp<any> }

export default function SavedScreen({ navigation }: Props) {
  const [saved, setSaved] = useState<any[]>([])

  // TODO: pull from Supabase saved_properties when user is authed
  // For now shows empty state with instructions

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Homes</Text>
          <Text style={styles.subtitle}>Properties you've saved while browsing</Text>
        </View>

        {saved.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyTitle}>No saved homes yet</Text>
            <Text style={styles.emptySub}>
              Tap the ♡ on any property while searching to save it here
            </Text>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.searchBtnText}>Browse Properties →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={saved}
            keyExtractor={item => item.ListingKey}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('PropertyDetail', { property: item })}
              >
                <Text style={styles.cardPrice}>${item.list_price?.toLocaleString()}</Text>
                <Text style={styles.cardAddress}>{item.address}</Text>
                <Text style={styles.cardCity}>{item.city}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ padding: spacing.lg }}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  container: { flex: 1 },
  header: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28, fontWeight: '300', color: colors.white, marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: colors.grey },

  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xxl, gap: spacing.md,
  },
  emptyIcon:  { fontSize: 52 },
  emptyTitle: { fontSize: 22, fontWeight: '300', color: colors.white },
  emptySub:   { fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 21 },
  searchBtn: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
    borderRadius: radius.sm,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  searchBtnText: { color: colors.gold, fontSize: 14, fontWeight: '600' },

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardPrice:   { fontSize: 20, color: colors.gold, fontWeight: '300', marginBottom: 4 },
  cardAddress: { fontSize: 15, color: colors.white, marginBottom: 2 },
  cardCity:    { fontSize: 12, color: colors.grey },
})

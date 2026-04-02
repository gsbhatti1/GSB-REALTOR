import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, SafeAreaView, StatusBar,
} from 'react-native'
import { colors, spacing, radius } from '../lib/theme'
import { searchProperties, Property } from '../lib/api'
import PropertyCard from '../components/PropertyCard'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

const UTAH_CITIES = [
  'Salt Lake City','West Jordan','Sandy','South Jordan','Taylorsville',
  'Murray','Draper','Herriman','Riverton','Lehi','West Valley City',
  'Millcreek','Provo','Orem','Ogden','Layton','St. George','Park City',
  'Bountiful','Midvale','American Fork','Saratoga Springs','Eagle Mountain',
]

const SORT_OPTIONS = [
  { label: 'Price: High → Low', value: 'ListPrice desc' },
  { label: 'Price: Low → High', value: 'ListPrice asc' },
  { label: 'Newest',            value: 'ModificationTimestamp desc' },
]

type Props = { navigation: NativeStackNavigationProp<any> }

export default function SearchScreen({ navigation }: Props) {
  const [city, setCity]         = useState('')
  const [cityInput, setCityInput] = useState('')
  const [showCities, setShowCities] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [beds, setBeds]         = useState('')
  const [orderBy, setOrderBy]   = useState('ListPrice desc')
  const [properties, setProperties] = useState<Property[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(false)
  const [page, setPage]         = useState(0)
  const [hasMore, setHasMore]   = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredCities = UTAH_CITIES.filter(c =>
    c.toLowerCase().includes(cityInput.toLowerCase())
  )

  const load = useCallback(async (reset = true) => {
    setLoading(true)
    const pageNum = reset ? 0 : page + 1
    if (reset) setPage(0)
    const result = await searchProperties({
      city,
      minPrice: minPrice ? Number(minPrice) : undefined,
      beds:     beds     ? Number(beds)     : undefined,
      orderBy,
      top:  20,
      skip: pageNum * 20,
    })
    if (reset) {
      setProperties(result.properties)
    } else {
      setProperties(prev => [...prev, ...result.properties])
      setPage(pageNum)
    }
    setTotal(result.total)
    setHasMore(result.hasMore)
    setLoading(false)
  }, [city, minPrice, beds, orderBy, page])

  useEffect(() => { load(true) }, [city, orderBy])

  const renderItem = ({ item }: { item: Property }) => (
    <PropertyCard
      property={item}
      onPress={() => navigation.navigate('PropertyDetail', { property: item })}
    />
  )

  const renderFooter = () => {
    if (!hasMore) return null
    return (
      <TouchableOpacity style={styles.loadMore} onPress={() => load(false)}>
        {loading
          ? <ActivityIndicator color={colors.gold} />
          : <Text style={styles.loadMoreText}>Load More ({total - properties.length} remaining)</Text>
        }
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      {/* Search bar row */}
      <View style={styles.searchBar}>
        <View style={styles.cityWrap}>
          <TextInput
            style={styles.cityInput}
            placeholder="Any city in Utah..."
            placeholderTextColor={colors.grey}
            value={cityInput}
            onFocus={() => setShowCities(true)}
            onChangeText={v => { setCityInput(v); setShowCities(true) }}
          />
          {city ? (
            <TouchableOpacity onPress={() => { setCity(''); setCityInput(''); }} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilters(f => !f)}
        >
          <Text style={styles.filterBtnText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* City dropdown */}
      {showCities && filteredCities.length > 0 && (
        <View style={styles.cityDropdown}>
          {filteredCities.slice(0, 6).map(c => (
            <TouchableOpacity
              key={c}
              style={styles.cityOption}
              onPress={() => {
                setCity(c)
                setCityInput(c)
                setShowCities(false)
              }}
            >
              <Text style={styles.cityOptionText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filters panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>MIN PRICE</Text>
          <View style={styles.priceRow}>
            {['', '200000', '300000', '400000', '500000', '750000'].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.chip, minPrice === p && styles.chipActive]}
                onPress={() => setMinPrice(p)}
              >
                <Text style={[styles.chipText, minPrice === p && styles.chipTextActive]}>
                  {p ? `$${Number(p)/1000}K+` : 'Any'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.filterLabel}>BEDS</Text>
          <View style={styles.priceRow}>
            {['', '1', '2', '3', '4', '5'].map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.chip, beds === b && styles.chipActive]}
                onPress={() => setBeds(b)}
              >
                <Text style={[styles.chipText, beds === b && styles.chipTextActive]}>
                  {b ? `${b}+` : 'Any'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.filterLabel}>SORT BY</Text>
          <View style={styles.priceRow}>
            {SORT_OPTIONS.map(o => (
              <TouchableOpacity
                key={o.value}
                style={[styles.chip, orderBy === o.value && styles.chipActive]}
                onPress={() => setOrderBy(o.value)}
              >
                <Text style={[styles.chipText, orderBy === o.value && styles.chipTextActive]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={() => { load(true); setShowFilters(false) }}>
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result count */}
      <View style={styles.resultBar}>
        <Text style={styles.resultCount}>
          <Text style={styles.resultNumber}>{total.toLocaleString()}</Text>
          {' '}Utah properties{city ? ` in ${city}` : ''}
        </Text>
      </View>

      {/* Property list */}
      {loading && properties.length === 0 ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Searching Utah MLS...</Text>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.ListingKey}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}
          onScrollBeginDrag={() => setShowCities(false)}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },

  searchBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#111',
  },
  cityWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  cityInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    paddingVertical: 10,
  },
  clearBtn: { padding: 4 },
  clearBtnText: { color: colors.grey, fontSize: 14 },

  filterBtn: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  filterBtnText: { fontSize: 18 },

  cityDropdown: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  cityOption: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  cityOptionText: { color: colors.white, fontSize: 14 },

  filtersPanel: {
    backgroundColor: '#111',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.grey,
    marginBottom: 8,
    marginTop: 12,
  },
  priceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  chipText: { fontSize: 12, color: colors.grey },
  chipTextActive: { color: colors.black, fontWeight: '600' },

  applyBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    padding: 12,
    alignItems: 'center',
  },
  applyBtnText: { color: colors.black, fontWeight: '700', fontSize: 14 },

  resultBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.black,
  },
  resultCount: { fontSize: 13, color: colors.grey },
  resultNumber: { color: colors.gold, fontWeight: '700', fontSize: 16 },

  loadingCenter: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md,
  },
  loadingText: { color: colors.grey, fontSize: 14 },

  loadMore: {
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: radius.sm,
    margin: spacing.md,
  },
  loadMoreText: { color: colors.gold, fontSize: 14 },
})

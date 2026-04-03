import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, StatusBar,
  Modal, ScrollView, Keyboard,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius } from '../lib/theme'
import { searchProperties, Property } from '../lib/api'
import PropertyCard from '../components/PropertyCard'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'

const UTAH_CITIES = [
  'Salt Lake City','West Jordan','Sandy','South Jordan','Taylorsville',
  'Murray','Draper','Herriman','Riverton','Lehi','West Valley City',
  'Millcreek','Provo','Orem','Ogden','Layton','St. George','Park City',
  'Bountiful','Midvale','American Fork','Saratoga Springs','Eagle Mountain',
  'Cottonwood Heights','Holladay','North Salt Lake','Farmington','Kaysville',
  'Roy','Clearfield','Springville','Spanish Fork','Highland','Alpine','Tooele',
]

const PROPERTY_TYPES = [
  { label: 'All',         value: '' },
  { label: 'Residential', value: 'Residential' },
  { label: 'Commercial',  value: 'Commercial Sale' },
  { label: 'Multi-Unit',  value: 'ResidentialIncome' },
  { label: 'Land',        value: 'Land' },
]

const SORT_OPTIONS = [
  { label: 'Price: High → Low', value: 'ListPrice desc' },
  { label: 'Price: Low → High', value: 'ListPrice asc' },
  { label: 'Newest First',      value: 'ModificationTimestamp desc' },
]

const PRICE_OPTIONS = [
  { label: 'No min', value: '' },
  { label: '$200K',  value: '200000' },
  { label: '$300K',  value: '300000' },
  { label: '$400K',  value: '400000' },
  { label: '$500K',  value: '500000' },
  { label: '$750K',  value: '750000' },
  { label: '$1M',    value: '1000000' },
]

const MAX_PRICE_OPTIONS = [
  { label: 'No max', value: '' },
  { label: '$300K',  value: '300000' },
  { label: '$400K',  value: '400000' },
  { label: '$500K',  value: '500000' },
  { label: '$750K',  value: '750000' },
  { label: '$1M',    value: '1000000' },
  { label: '$2M',    value: '2000000' },
]

type Props = {
  navigation: NativeStackNavigationProp<any>
  route: RouteProp<any>
}

export default function SearchScreen({ navigation, route }: Props) {
  const [city,         setCity]         = useState((route.params as any)?.city || '')
  const [cityInput,    setCityInput]    = useState((route.params as any)?.city || '')
  const [showDropdown, setShowDropdown] = useState(false)
  const [minPrice,     setMinPrice]     = useState('')
  const [maxPrice,     setMaxPrice]     = useState('')
  const [beds,         setBeds]         = useState('')
  const [propType,     setPropType]     = useState('')
  const [orderBy,      setOrderBy]      = useState('ListPrice desc')
  const [showFilters,  setShowFilters]  = useState(false)

  const [properties,   setProperties]   = useState<Property[]>([])
  const [total,        setTotal]        = useState(0)
  const [loading,      setLoading]      = useState(true)
  const [loadingMore,  setLoadingMore]  = useState(false)
  const [page,         setPage]         = useState(0)
  const [hasMore,      setHasMore]      = useState(false)

  const PER_PAGE = 20

  const filteredCities = cityInput.length > 0
    ? UTAH_CITIES.filter(c => c.toLowerCase().startsWith(cityInput.toLowerCase()))
    : UTAH_CITIES.slice(0, 8)

  const load = useCallback(async (reset = true, overrides?: Partial<{
    city: string; minPrice: string; maxPrice: string
    beds: string; propType: string; orderBy: string
  }>) => {
    const c = overrides?.city     ?? city
    const mn= overrides?.minPrice ?? minPrice
    const mx= overrides?.maxPrice ?? maxPrice
    const b = overrides?.beds     ?? beds
    const pt= overrides?.propType ?? propType
    const ob= overrides?.orderBy  ?? orderBy
    const pageNum = reset ? 0 : page + 1

    if (reset) setLoading(true)
    else       setLoadingMore(true)

    try {
      const result = await searchProperties({
        city:     c || undefined,
        minPrice: mn ? Number(mn) : undefined,
        maxPrice: mx ? Number(mx) : undefined,
        beds:     b  ? Number(b)  : undefined,
        type:     pt || undefined,
        orderBy:  ob,
        top:      PER_PAGE,
        skip:     pageNum * PER_PAGE,
      })
      if (reset) {
        setProperties(result.properties)
        setPage(0)
      } else {
        setProperties(prev => [...prev, ...result.properties])
        setPage(pageNum)
      }
      setTotal(result.total)
      setHasMore(result.hasMore)
    } catch (e) {
      console.error('Search error', e)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [city, minPrice, maxPrice, beds, propType, orderBy, page])

  useEffect(() => { load(true) }, [])

  // If navigated with a city param
  useEffect(() => {
    const newCity = (route.params as any)?.city
    if (newCity && newCity !== city) {
      setCity(newCity)
      setCityInput(newCity)
      load(true, { city: newCity })
    }
  }, [route.params])

  const applyFilters = () => {
    setShowFilters(false)
    load(true)
  }

  const selectCity = (c: string) => {
    setCity(c)
    setCityInput(c)
    setShowDropdown(false)
    Keyboard.dismiss()
    load(true, { city: c })
  }

  const clearCity = () => {
    setCity('')
    setCityInput('')
    load(true, { city: '' })
  }

  const activeFilterCount = [minPrice, maxPrice, beds, propType].filter(Boolean).length

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />

      {/* Search bar */}
      <View style={styles.searchBar}>
        <View style={styles.inputWrap}>
          <Text style={styles.inputIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="City or neighborhood..."
            placeholderTextColor={colors.grey}
            value={cityInput}
            onFocus={() => setShowDropdown(true)}
            onChangeText={v => { setCityInput(v); setShowDropdown(true) }}
            returnKeyType="search"
            onSubmitEditing={() => {
              const match = UTAH_CITIES.find(c => c.toLowerCase() === cityInput.toLowerCase())
              if (match) selectCity(match)
              else setShowDropdown(false)
            }}
          />
          {cityInput.length > 0 && (
            <TouchableOpacity onPress={clearCity} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterIcon}>⚙</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* City dropdown */}
      {showDropdown && (
        <View style={styles.dropdown}>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 220 }}>
            {filteredCities.slice(0, 8).map(c => (
              <TouchableOpacity key={c} style={styles.dropdownItem} onPress={() => selectCity(c)}>
                <Text style={styles.dropdownItemText}>📍  {c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.dropdownClose} onPress={() => setShowDropdown(false)}>
            <Text style={styles.dropdownCloseText}>Show all Utah</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results bar */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText} numberOfLines={1}>
          {loading ? 'Searching...' : (
            <>
              <Text style={styles.resultsCount}>{total.toLocaleString()}</Text>
              <Text>{city ? ` in ${city}` : ' Utah listings'}</Text>
            </>
          )}
        </Text>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => {
            const next = orderBy === 'ListPrice desc' ? 'ListPrice asc' : orderBy === 'ListPrice asc' ? 'ModificationTimestamp desc' : 'ListPrice desc'
            setOrderBy(next)
            load(true, { orderBy: next })
          }}
        >
          <Text style={styles.sortBtnText}>
            {orderBy === 'ListPrice desc' ? '↓ Price' : orderBy === 'ListPrice asc' ? '↑ Price' : '🆕 New'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Property type tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeTabs} contentContainerStyle={styles.typeTabsContent}>
        {PROPERTY_TYPES.map(pt => (
          <TouchableOpacity
            key={pt.value}
            style={[styles.typeTab, propType === pt.value && styles.typeTabActive]}
            onPress={() => {
              setPropType(pt.value)
              load(true, { propType: pt.value })
            }}
          >
            <Text style={[styles.typeTabText, propType === pt.value && styles.typeTabTextActive]}>
              {pt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      {loading && properties.length === 0 ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.gold} />
          <Text style={styles.loadingText}>Loading Utah listings...</Text>
        </View>
      ) : properties.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔎</Text>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySub}>Try a different city or adjust your filters</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => { clearCity(); setMinPrice(''); setMaxPrice(''); setBeds(''); setPropType(''); load(true, { city: '', minPrice: '', maxPrice: '', beds: '', propType: '' }) }}>
            <Text style={styles.emptyBtnText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.ListingKey}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={() => navigation.navigate('PropertyDetail', { property: item })}
            />
          )}
          contentContainerStyle={styles.list}
          onScrollBeginDrag={() => { setShowDropdown(false); Keyboard.dismiss() }}
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={() => load(false)} disabled={loadingMore}>
                {loadingMore
                  ? <ActivityIndicator color={colors.gold} />
                  : <Text style={styles.loadMoreText}>Load more · {(total - properties.length).toLocaleString()} remaining</Text>
                }
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFilters(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>

            {/* Min price */}
            <Text style={styles.filterLabel}>MIN PRICE</Text>
            <View style={styles.chipRow}>
              {PRICE_OPTIONS.map(o => (
                <TouchableOpacity key={o.value} style={[styles.chip, minPrice === o.value && styles.chipActive]} onPress={() => setMinPrice(o.value)}>
                  <Text style={[styles.chipText, minPrice === o.value && styles.chipTextActive]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Max price */}
            <Text style={styles.filterLabel}>MAX PRICE</Text>
            <View style={styles.chipRow}>
              {MAX_PRICE_OPTIONS.map(o => (
                <TouchableOpacity key={o.value} style={[styles.chip, maxPrice === o.value && styles.chipActive]} onPress={() => setMaxPrice(o.value)}>
                  <Text style={[styles.chipText, maxPrice === o.value && styles.chipTextActive]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Beds */}
            <Text style={styles.filterLabel}>MIN BEDROOMS</Text>
            <View style={styles.chipRow}>
              {['', '1', '2', '3', '4', '5'].map(b => (
                <TouchableOpacity key={b} style={[styles.chip, beds === b && styles.chipActive]} onPress={() => setBeds(b)}>
                  <Text style={[styles.chipText, beds === b && styles.chipTextActive]}>{b || 'Any'}{b ? '+' : ''}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sort */}
            <Text style={styles.filterLabel}>SORT BY</Text>
            <View style={styles.chipRow}>
              {SORT_OPTIONS.map(o => (
                <TouchableOpacity key={o.value} style={[styles.chip, orderBy === o.value && styles.chipActive]} onPress={() => setOrderBy(o.value)}>
                  <Text style={[styles.chipText, orderBy === o.value && styles.chipTextActive]}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetBtn} onPress={() => { setMinPrice(''); setMaxPrice(''); setBeds(''); setPropType(''); setOrderBy('ListPrice desc') }}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
              <Text style={styles.applyBtnText}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },

  searchBar: {
    flexDirection: 'row', gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: '#111',
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: radius.sm, borderWidth: 1.5, borderColor: '#555555',
    paddingHorizontal: spacing.md,
  },
  inputIcon: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, color: '#FFFFFF', fontSize: 14, paddingVertical: 11 },
  clearBtn: { padding: 4 },
  clearBtnText: { color: '#FFFFFF', fontSize: 16 },
  filterBtn: {
    width: 46, backgroundColor: '#2a2a2a',
    borderRadius: radius.sm, borderWidth: 1.5, borderColor: '#555555',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  filterBtnActive: { borderColor: colors.gold, backgroundColor: colors.goldFaded },
  filterIcon: { fontSize: 18, color: '#FFFFFF' },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: colors.gold, width: 16, height: 16,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  filterBadgeText: { fontSize: 9, color: colors.black, fontWeight: '700' },

  dropdown: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  dropdownItem: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  dropdownItemText: { color: colors.white, fontSize: 14 },
  dropdownClose: { padding: spacing.md, alignItems: 'center' },
  dropdownCloseText: { color: colors.gold, fontSize: 13 },

  resultsBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    backgroundColor: colors.black,
  },
  resultsText:  { fontSize: 13, color: colors.grey },
  resultsCount: { color: colors.gold, fontWeight: '700', fontSize: 16 },
  sortBtn: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: radius.full, backgroundColor: colors.bgInput,
    borderWidth: 1, borderColor: colors.border,
  },
  sortBtnText: { fontSize: 12, color: colors.greyLight },

  typeTabs: { backgroundColor: '#1a1a1a', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)' },
  typeTabsContent: { paddingHorizontal: spacing.md, paddingVertical: 12, gap: 8, alignItems: 'center' },
  typeTab: {
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: '#2a2a2a',
    borderWidth: 1.5, borderColor: '#555555',
    flexShrink: 0,
  },
  typeTabActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  typeTabText:   { fontSize: 13, color: '#FFFFFF', fontWeight: '600' },
  typeTabTextActive: { color: '#000000', fontWeight: '700' },

  list: { padding: spacing.md, paddingBottom: 100 },

  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText:  { color: colors.grey, fontSize: 14 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { fontSize: 20, color: colors.white, fontWeight: '300' },
  emptySub:   { fontSize: 14, color: colors.grey, textAlign: 'center' },
  emptyBtn:   { marginTop: spacing.sm, borderWidth: 1, borderColor: colors.borderGold, borderRadius: radius.sm, paddingHorizontal: 24, paddingVertical: 11 },
  emptyBtnText: { color: colors.gold, fontSize: 14 },

  loadMoreBtn: {
    margin: spacing.md, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.borderGold,
    borderRadius: radius.sm, alignItems: 'center',
  },
  loadMoreText: { color: colors.gold, fontSize: 14 },

  // Filter Modal
  modalContainer: { flex: 1, backgroundColor: colors.bg },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 20, fontWeight: '600', color: colors.white },
  modalClose: { fontSize: 20, color: colors.grey, padding: 4 },
  modalBody:  { flex: 1, padding: spacing.xl },
  filterLabel:{ fontSize: 10, letterSpacing: 1.5, color: colors.grey, textTransform: 'uppercase', marginBottom: spacing.sm, marginTop: spacing.lg },
  chipRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: '#2a2a2a', borderWidth: 1.5, borderColor: '#555555' },
  chipActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  chipText:   { fontSize: 13, color: '#FFFFFF' },
  chipTextActive: { color: '#000000', fontWeight: '700' },
  modalFooter:{ flexDirection: 'row', gap: spacing.md, padding: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border },
  resetBtn:   { flex: 1, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, alignItems: 'center' },
  resetBtnText:{ color: colors.grey, fontSize: 14 },
  applyBtn:   { flex: 2, padding: 14, backgroundColor: colors.gold, borderRadius: radius.sm, alignItems: 'center' },
  applyBtnText:{ color: colors.black, fontWeight: '700', fontSize: 15 },
})

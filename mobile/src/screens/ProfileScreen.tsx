import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Alert, Linking,
  ScrollView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, shadow } from '../lib/theme'
import { supabase } from '../lib/supabase'

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await supabase.auth.signOut()
        setUser(null)
      }},
    ])
  }

  if (user) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>
                {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.name}>
              {user.user_metadata?.full_name || user.user_metadata?.name || 'My Account'}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <View style={styles.menuSection}>
            {[
              { icon: '🏠', label: 'Saved Properties',  action: () => {} },
              { icon: '🔔', label: 'Listing Alerts',    action: () => {} },
              { icon: '📋', label: 'My Inquiries',      action: () => {} },
              { icon: '⚙️', label: 'Preferences',       action: () => {} },
            ].map(item => (
              <TouchableOpacity key={item.label} style={styles.menuRow} onPress={item.action} activeOpacity={0.75}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.signOutSection}>
            <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.85}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  // Signed out state
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <ScrollView contentContainerStyle={styles.authContainer} showsVerticalScrollIndicator={false}>

        {/* Branding */}
        <View style={styles.brandBlock}>
          <View style={styles.brandRing}>
            <Text style={styles.brandLetter}>G</Text>
          </View>
          <Text style={styles.brandTitle}>GSB Realtor</Text>
          <Text style={styles.brandSub}>Sign in to save properties and set listing alerts</Text>
        </View>

        {/* Sign in options */}
        <View style={styles.authBtns}>
          {/* Apple Sign In — iOS only */}
          {Platform.OS === 'ios' && (
            <AppleSignInButton />
          )}

          {/* Guest options */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or contact directly</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL('tel:8016358462')} activeOpacity={0.85}>
            <Text style={styles.callBtnText}>📞  Call Gurpreet — 801.635.8462</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smsBtn} onPress={() => Linking.openURL('sms:8016358462')} activeOpacity={0.85}>
            <Text style={styles.smsBtnText}>💬  Text Gurpreet</Text>
          </TouchableOpacity>
        </View>

        {/* Agent info */}
        <View style={styles.agentInfo}>
          <Text style={styles.agentLine}>Gurpreet Bhatti · REALTOR®</Text>
          <Text style={styles.agentLine}>UT #12907042-SA00 · NV #S.0201351 · WY #RE-17041</Text>
          <Text style={styles.agentLine}>Dynasty Point Referral Group</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.gsbrealtor.com')}>
            <Text style={styles.agentLink}>gsbrealtor.com</Text>
          </TouchableOpacity>
        </View>

        {/* App version */}
        <Text style={styles.version}>GSB Realtor App v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

// Apple Sign In — dynamically imported so it doesn't break Android
function AppleSignInButton() {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    import('expo-apple-authentication').then(m => {
      m.isAvailableAsync().then(setAvailable)
    }).catch(() => {})
  }, [])

  if (!available) return null

  const handleApple = async () => {
    try {
      const m = await import('expo-apple-authentication')
      const credential = await m.signInAsync({
        requestedScopes: [
          m.AppleAuthenticationScope.FULL_NAME,
          m.AppleAuthenticationScope.EMAIL,
        ],
      })
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      })
      if (error) Alert.alert('Sign in failed', error.message)
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Error', e.message || 'Sign in failed')
      }
    }
  }

  return (
    <TouchableOpacity style={styles.appleBtn} onPress={handleApple} activeOpacity={0.88}>
      <Text style={styles.appleBtnText}> Sign in with Apple</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },

  // Signed in
  profileHeader: { alignItems: 'center', padding: spacing.xxl, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.goldFaded,
    borderWidth: 1.5, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarLetter: { fontSize: 28, color: colors.gold, fontWeight: '300' },
  name:  { fontSize: 20, color: colors.white, fontWeight: '500', marginBottom: 4 },
  email: { fontSize: 13, color: colors.grey },

  menuSection: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  menuIcon:  { fontSize: 20, width: 36 },
  menuLabel: { flex: 1, fontSize: 15, color: colors.white },
  menuArrow: { fontSize: 24, color: colors.grey },

  signOutSection: { padding: spacing.xl },
  signOutBtn: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, padding: 14, alignItems: 'center',
  },
  signOutText: { color: colors.grey, fontSize: 14 },

  // Signed out
  authContainer: {
    flexGrow: 1, padding: spacing.xl,
    alignItems: 'center', justifyContent: 'center',
    gap: spacing.xl,
  },
  brandBlock: { alignItems: 'center', gap: spacing.md },
  brandRing: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1.5, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.goldFaded,
  },
  brandLetter: { fontSize: 34, color: colors.gold, fontWeight: '200' },
  brandTitle:  { fontSize: 24, color: colors.white, fontWeight: '300', letterSpacing: 2 },
  brandSub:    { fontSize: 13, color: colors.grey, textAlign: 'center', lineHeight: 20 },

  authBtns: { width: '100%' as any, gap: spacing.md },
  appleBtn: {
    backgroundColor: colors.white, borderRadius: radius.sm,
    height: 52, alignItems: 'center', justifyContent: 'center',
  },
  appleBtnText: { color: colors.black, fontWeight: '600', fontSize: 16 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 11, color: colors.greyDark, textTransform: 'uppercase', letterSpacing: 1 },

  callBtn: {
    backgroundColor: colors.gold, borderRadius: radius.sm,
    paddingVertical: 14, alignItems: 'center',
  },
  callBtnText: { color: colors.black, fontWeight: '700', fontSize: 15 },
  smsBtn: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingVertical: 14, alignItems: 'center',
  },
  smsBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },

  agentInfo: {
    alignItems: 'center', gap: 4,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    width: '100%',
  },
  agentLine: { fontSize: 11, color: colors.greyDark, textAlign: 'center' },
  agentLink: { fontSize: 12, color: colors.gold, marginTop: 4 },
  version:   { fontSize: 10, color: colors.greyDark, letterSpacing: 1 },
})

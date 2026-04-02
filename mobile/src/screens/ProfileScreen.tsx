import React, { useState, useEffect } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, Platform,
} from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from '../lib/supabase'
import { colors, spacing, radius } from '../lib/theme'

export default function ProfileScreen() {
  const [user, setUser]           = useState<any>(null)
  const [loading, setLoading]     = useState(false)
  const [appleAvailable, setAppleAvailable] = useState(false)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    // Check if Apple auth is available (iOS 13+ only)
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable)
    }
    return () => listener.subscription.unsubscribe()
  }, [])

  const signInWithApple = async () => {
    try {
      setLoading(true)
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      })
      if (error) throw error
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Sign In Error', e.message || 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.email?.charAt(0).toUpperCase() || 'G'}
              </Text>
            </View>
            <Text style={styles.name}>
              {user.user_metadata?.full_name || user.user_metadata?.name || 'Valued Client'}
            </Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR ACCOUNT</Text>
            {[
              { icon: '🏠', label: 'Saved Properties',  action: () => {} },
              { icon: '🔔', label: 'Listing Alerts',    action: () => {} },
              { icon: '📋', label: 'My Inquiries',      action: () => {} },
            ].map(item => (
              <TouchableOpacity key={item.label} style={styles.row} onPress={item.action}>
                <Text style={styles.rowIcon}>{item.icon}</Text>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <View style={styles.container}>
        <View style={styles.authHeader}>
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>G</Text>
          </View>
          <Text style={styles.authTitle}>Sign in to GSB Realtor</Text>
          <Text style={styles.authSub}>
            Save properties, set listing alerts, and track your inquiries
          </Text>
        </View>

        <View style={styles.authBtns}>
          {appleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={8}
              style={styles.appleBtn}
              onPress={signInWithApple}
            />
          )}

          {/* Google Sign In placeholder — wire up when needed */}
          <TouchableOpacity style={styles.googleBtn} disabled>
            <Text style={styles.googleBtnText}>🔑  Continue with Google</Text>
            <Text style={styles.comingSoon}>Coming Soon</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.legal}>
          By signing in you agree to our Terms of Service and Privacy Policy.
          Your information is never shared.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  container: { flex: 1, padding: spacing.xl },

  // Signed in
  header: { alignItems: 'center', paddingVertical: spacing.xxl },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1.5, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 28, color: colors.gold, fontWeight: '300' },
  name:  { fontSize: 22, color: colors.white, fontWeight: '300', marginBottom: 4 },
  email: { fontSize: 13, color: colors.grey },

  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontSize: 10, letterSpacing: 1.5, color: colors.grey,
    marginBottom: spacing.md, textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  rowIcon:  { fontSize: 18, marginRight: spacing.md, width: 28 },
  rowLabel: { flex: 1, fontSize: 15, color: colors.white },
  rowArrow: { fontSize: 22, color: colors.grey, fontWeight: '300' },

  signOutBtn: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, padding: 14,
    alignItems: 'center', marginTop: 'auto',
  },
  signOutText: { color: colors.grey, fontSize: 14 },

  // Signed out
  authHeader: { alignItems: 'center', paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  monogram: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 1.5, borderColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  monogramText: { fontSize: 30, color: colors.gold, fontWeight: '300' },
  authTitle: {
    fontSize: 26, fontWeight: '300', color: colors.white,
    marginBottom: spacing.sm, textAlign: 'center',
  },
  authSub: {
    fontSize: 14, color: colors.grey, textAlign: 'center',
    lineHeight: 22, maxWidth: 280,
  },

  authBtns: { gap: spacing.md, marginTop: spacing.xl },
  appleBtn: { width: '100%', height: 52 },

  googleBtn: {
    height: 52, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: spacing.sm,
    opacity: 0.4,
  },
  googleBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  comingSoon: {
    fontSize: 10, color: colors.grey,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 6, paddingVertical: 2,
  },

  legal: {
    fontSize: 11, color: colors.greyDark,
    textAlign: 'center', lineHeight: 16,
    marginTop: 'auto', paddingTop: spacing.xl,
  },
})

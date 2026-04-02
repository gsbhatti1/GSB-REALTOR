import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Alert, KeyboardAvoidingView, Platform,
} from 'react-native'
import { colors, spacing, radius } from '../lib/theme'
import { submitLead } from '../lib/api'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'

type Props = {
  navigation: NativeStackNavigationProp<any>
  route: RouteProp<any>
}

const LEAD_CONFIG = {
  seller: {
    title: 'Get Your Free\nHome Value',
    subtitle: 'Honest market analysis — no pressure, no obligation.',
    icon: '💰',
    cta: 'Get My Free Home Value',
    messagePlaceholder: 'Tell us about your property (bedrooms, condition, timeline to sell)...',
  },
  commercial: {
    title: 'Commercial &\nInvestor Inquiry',
    subtitle: 'NNN leases, multi-family, land, retail — Gurpreet specializes in commercial.',
    icon: '🏢',
    cta: 'Submit Commercial Inquiry',
    messagePlaceholder: 'Describe your commercial interest (type, budget, timeline, markets)...',
  },
  contact: {
    title: "Let's Talk",
    subtitle: 'Gurpreet responds within the hour.',
    icon: '📞',
    cta: 'Send Message',
    messagePlaceholder: "How can Gurpreet help you?",
  },
  buyer: {
    title: 'Find Your\nDream Home',
    subtitle: 'Tell Gurpreet what you are looking for.',
    icon: '🏠',
    cta: 'Book Buyer Consultation',
    messagePlaceholder: 'Describe your ideal home (city, size, budget, timeline)...',
  },
}

export default function LeadScreen({ navigation, route }: Props) {
  const type = (route.params as any)?.type || 'contact'
  const config = LEAD_CONFIG[type as keyof typeof LEAD_CONFIG] || LEAD_CONFIG.contact

  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const handleSubmit = async () => {
    if (!name || !phone) {
      Alert.alert('Required', 'Please enter your name and phone number.')
      return
    }
    setLoading(true)
    const ok = await submitLead({ name, email, phone, type, message })
    setLoading(false)
    if (ok) {
      setDone(true)
    } else {
      Alert.alert('Error', 'Something went wrong. Please call Gurpreet directly at 801.635.8462')
    }
  }

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.success}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Request Received!</Text>
          <Text style={styles.successSub}>
            Gurpreet will reach out within the hour.{'\n'}
            For immediate help: 801.635.8462
          </Text>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.icon}>{config.icon}</Text>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.subtitle}>{config.subtitle}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>FULL NAME *</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={colors.grey}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>PHONE *</Text>
              <TextInput
                style={styles.input}
                placeholder="801-555-0100"
                placeholderTextColor={colors.grey}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.grey}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>MESSAGE</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder={config.messagePlaceholder}
                placeholderTextColor={colors.grey}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnLoading]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Sending...' : config.cta}
              </Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              No spam. Gurpreet responds personally within the hour.
            </Text>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  container: { flex: 1 },

  header: {
    padding: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,168,76,0.15)',
  },
  icon: { fontSize: 36, marginBottom: spacing.md },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.white,
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
  subtitle: { fontSize: 14, color: colors.grey, lineHeight: 21 },

  form: { padding: spacing.xl, gap: spacing.lg },
  field: { gap: 6 },
  label: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: colors.grey,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    color: colors.white,
    fontSize: 15,
  },
  textarea: { minHeight: 100, paddingTop: spacing.md },

  submitBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    padding: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitBtnLoading: { opacity: 0.6 },
  submitBtnText: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.greyDark,
    textAlign: 'center',
    lineHeight: 16,
  },

  success: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xxl,
  },
  successIcon:  { fontSize: 56, marginBottom: spacing.xl },
  successTitle: {
    fontSize: 28, fontWeight: '300', color: colors.white,
    marginBottom: spacing.md, textAlign: 'center',
  },
  successSub: {
    fontSize: 14, color: colors.grey, textAlign: 'center',
    lineHeight: 22, marginBottom: spacing.xl,
  },
  doneBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  doneBtnText: { color: colors.black, fontWeight: '700', fontSize: 15 },
})

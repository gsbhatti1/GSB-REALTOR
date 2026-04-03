import React, { useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, StatusBar, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, radius, shadow } from '../lib/theme'
import { submitLead } from '../lib/api'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'

type Props = {
  navigation: NativeStackNavigationProp<any>
  route:      RouteProp<any>
}

const CONFIG: Record<string, { title: string; sub: string; icon: string; cta: string; msgPlaceholder: string }> = {
  seller: {
    title: 'Get Your Free\nHome Valuation',
    sub:   'Honest CMA with no pressure and no obligation. Gurpreet gives you the real number.',
    icon:  '💰',
    cta:   'Get My Free Home Value',
    msgPlaceholder: 'Tell us about your property — bedrooms, condition, timeline to sell...',
  },
  buyer: {
    title: 'Request a Showing',
    sub:   'Gurpreet will confirm within the hour and schedule the showing.',
    icon:  '🏠',
    cta:   'Request Showing',
    msgPlaceholder: 'Which property are you interested in? Any questions?',
  },
  commercial: {
    title: 'Commercial &\nInvestor Inquiry',
    sub:   'NNN leases, multi-family, land, retail — Gurpreet specializes in commercial.',
    icon:  '🏢',
    cta:   'Submit Inquiry',
    msgPlaceholder: 'Describe your interest — type, budget, markets, timeline...',
  },
  contact: {
    title: "Let's Talk",
    sub:   'Gurpreet responds personally within the hour.',
    icon:  '📞',
    cta:   'Send Message',
    msgPlaceholder: 'How can Gurpreet help you today?',
  },
}

export default function LeadScreen({ navigation, route }: Props) {
  const type    = ((route.params as any)?.type   || 'contact') as string
  const prefill = (route.params as any)?.prefill || ''
  const cfg     = CONFIG[type] || CONFIG.contact

  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState(prefill)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) { Alert.alert('Required', 'Please enter your name.'); return }
    if (!phone.trim()){ Alert.alert('Required', 'Please enter your phone number.'); return }
    setLoading(true)
    const ok = await submitLead({ name, phone, email, type, message, source: 'mobile_app' })
    setLoading(false)
    if (ok) {
      setDone(true)
    } else {
      Alert.alert('Could not send', 'Please call Gurpreet directly at 801.635.8462')
    }
  }

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.successCheck}>✅</Text>
          <Text style={styles.successTitle}>Message Sent!</Text>
          <Text style={styles.successSub}>
            Gurpreet will reach out within the hour.{'\n'}
            For immediate help call 801.635.8462
          </Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={styles.icon}>{cfg.icon}</Text>
            <Text style={styles.title}>{cfg.title}</Text>
            <Text style={styles.sub}>{cfg.sub}</Text>
          </View>

          <View style={styles.form}>
            <Field label="Full Name *" value={name} onChangeText={setName}
              placeholder="Your name" autoCapitalize="words" />
            <Field label="Phone *" value={phone} onChangeText={setPhone}
              placeholder="801-555-0100" keyboardType="phone-pad" />
            <Field label="Email" value={email} onChangeText={setEmail}
              placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
            <Field label="Message" value={message} onChangeText={setMessage}
              placeholder={cfg.msgPlaceholder} multiline numberOfLines={4} />

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={colors.black} />
                : <Text style={styles.submitText}>{cfg.cta}</Text>
              }
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Gurpreet responds personally. No spam. No bots.
            </Text>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

function Field({
  label, value, onChangeText, placeholder,
  multiline, numberOfLines, keyboardType, autoCapitalize,
}: any) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, multiline && fieldStyles.textarea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  )
}

const fieldStyles = StyleSheet.create({
  wrap:    { marginBottom: spacing.md },
  label:   { fontSize: 10, letterSpacing: 1.5, color: colors.grey, textTransform: 'uppercase', marginBottom: 6 },
  input:   {
    backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, padding: spacing.md, color: colors.white, fontSize: 15,
  },
  textarea: { minHeight: 100, paddingTop: spacing.md },
})

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },

  header: {
    padding: spacing.xl, paddingBottom: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  icon:  { fontSize: 40, marginBottom: spacing.md },
  title: { fontSize: 30, fontWeight: '300', color: colors.white, lineHeight: 34, marginBottom: spacing.sm },
  sub:   { fontSize: 14, color: colors.grey, lineHeight: 21 },

  form: { padding: spacing.xl },

  submitBtn: {
    backgroundColor: colors.gold, borderRadius: radius.sm,
    paddingVertical: 16, alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitDisabled: { opacity: 0.6 },
  submitText:     { color: colors.black, fontWeight: '700', fontSize: 15 },
  disclaimer:     { fontSize: 11, color: colors.greyDark, textAlign: 'center', marginTop: spacing.md, lineHeight: 16 },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.lg },
  successCheck: { fontSize: 60 },
  successTitle: { fontSize: 28, fontWeight: '300', color: colors.white, textAlign: 'center' },
  successSub:   { fontSize: 14, color: colors.grey, textAlign: 'center', lineHeight: 22 },
  doneBtn:      { backgroundColor: colors.gold, borderRadius: radius.sm, paddingHorizontal: 40, paddingVertical: 14,
 },
  doneBtnText:  { color: colors.black, fontWeight: '700', fontSize: 15 },
})

import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { colors } from '../lib/theme'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const opacity  = useRef(new Animated.Value(0)).current
  const scale    = useRef(new Animated.Value(0.88)).current
  const lineW    = useRef(new Animated.Value(0)).current
  const textFade = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
      // Gold line draws
      Animated.timing(lineW, { toValue: 1, duration: 700, useNativeDriver: false }),
      // Tagline fades in
      Animated.timing(textFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start()

    const timer = setTimeout(onDone, 2600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />

      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        {/* Monogram ring */}
        <View style={styles.ring}>
          <View style={styles.innerRing} />
          <Text style={styles.monogram}>G</Text>
        </View>

        <Text style={styles.brand}>GSB REALTOR</Text>

        {/* Animated gold line */}
        <Animated.View style={[styles.line, {
          width: lineW.interpolate({ inputRange: [0, 1], outputRange: [0, 140] }),
        }]} />

        <Animated.Text style={[styles.tagline, { opacity: textFade }]}>
          Gurpreet Bhatti · REALTOR® · USMC Veteran
        </Animated.Text>

        <Animated.Text style={[styles.states, { opacity: textFade }]}>
          Utah · Nevada · Wyoming
        </Animated.Text>
      </Animated.View>

      <View style={styles.bottomBar} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, backgroundColor: colors.gold,
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 1, backgroundColor: 'rgba(201,168,76,0.2)',
  },
  content: { alignItems: 'center' },
  ring: {
    width: 88, height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  innerRing: {
    position: 'absolute',
    width: 76, height: 76,
    borderRadius: 38,
    borderWidth: 0.5,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  monogram: {
    fontSize: 40,
    color: colors.gold,
    fontWeight: '200',
    letterSpacing: -1,
  },
  brand: {
    fontSize: 20,
    letterSpacing: 7,
    color: colors.white,
    fontWeight: '600',
    marginBottom: 20,
  },
  line: {
    height: 1,
    backgroundColor: colors.gold,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.grey,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  states: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.greyDark,
    textTransform: 'uppercase',
  },
})

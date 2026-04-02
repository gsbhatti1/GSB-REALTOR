import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import { colors } from '../lib/theme'

const { width } = Dimensions.get('window')

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const fade  = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.92)).current
  const line  = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
      Animated.timing(line, { toValue: 1, duration: 600, delay: 200, useNativeDriver: false }),
    ]).start()

    const timer = setTimeout(onDone, 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      {/* Gold top bar */}
      <View style={styles.topBar} />

      <Animated.View style={{ opacity: fade, transform: [{ scale }], alignItems: 'center' }}>
        {/* G monogram */}
        <View style={styles.monogram}>
          <Text style={styles.monogramText}>G</Text>
        </View>

        <Text style={styles.name}>GSB REALTOR</Text>
        <Text style={styles.tagline}>Gurpreet Bhatti · REALTOR® · USMC Veteran</Text>

        {/* Animated gold line */}
        <Animated.View style={[styles.goldLine, {
          width: line.interpolate({ inputRange: [0, 1], outputRange: [0, 120] })
        }]} />

        <Text style={styles.sub}>Utah · Nevada · Wyoming</Text>
      </Animated.View>
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
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: colors.gold,
  },
  monogram: {
    width: 80, height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  monogramText: {
    fontSize: 36,
    color: colors.gold,
    fontWeight: '300',
  },
  name: {
    fontSize: 22,
    letterSpacing: 6,
    color: colors.white,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.grey,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  goldLine: {
    height: 1,
    backgroundColor: colors.gold,
    marginBottom: 16,
  },
  sub: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.greyDark,
    textTransform: 'uppercase',
  },
})

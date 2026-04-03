import 'react-native-url-polyfill/auto'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

// Add screens back one at a time to isolate crash
import SplashScreen from './src/screens/SplashScreen'

export default function App() {
  const [done, setDone] = useState(false)

  if (!done) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SplashScreen onDone={() => setDone(true)} />
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.text}>✅ Splash works — testing navigator next</Text>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060606', alignItems: 'center', justifyContent: 'center', padding: 32 },
  text: { color: '#C9A84C', fontSize: 16, textAlign: 'center' },
})

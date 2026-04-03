import 'react-native-url-polyfill/auto'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View, Text, StyleSheet } from 'react-native'

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Text style={styles.text}>GSB Realtor Loading...</Text>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060606', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#C9A84C', fontSize: 18 },
})

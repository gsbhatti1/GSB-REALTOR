import 'react-native-url-polyfill/auto'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from './src/screens/SplashScreen'
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {ready
        ? <AppNavigator />
        : <SplashScreen onDone={() => setReady(true)} />
      }
    </SafeAreaProvider>
  )
}

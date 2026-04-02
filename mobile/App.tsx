import 'react-native-url-polyfill/auto'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import SplashScreen  from './src/screens/SplashScreen'
import AppNavigator  from './src/navigation/AppNavigator'

export default function App() {
  const [ready, setReady] = useState(false)

  if (!ready) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onDone={() => setReady(true)} />
      </>
    )
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  )
}

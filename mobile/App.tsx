import React, { useState } from 'react'
import { View, StatusBar } from 'react-native'
import SplashScreen from './src/screens/SplashScreen'
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  if (!splashDone) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#060606" />
        <SplashScreen onDone={() => setSplashDone(true)} />
      </>
    )
  }

  return <AppNavigator />
}

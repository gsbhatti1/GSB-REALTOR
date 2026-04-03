import React from 'react'
import { Text, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colors } from '../lib/theme'

import HomeScreen           from '../screens/HomeScreen'
import SearchScreen         from '../screens/SearchScreen'
import LeadScreen           from '../screens/LeadScreen'
import SavedScreen          from '../screens/SavedScreen'
import PropertyDetailScreen from '../screens/PropertyDetailScreen'
import ProfileScreen        from '../screens/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab   = createBottomTabNavigator()

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
            {{ Home: '🏠', Search: '🔍', Saved: '♡', Contact: '📞', Profile: '👤' }[route.name] || '●'}
          </Text>
        ),
        tabBarActiveTintColor:   colors.gold,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 80 : 64,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10 },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}    options={{ title: 'Home' }} />
      <Tab.Screen name="Search"  component={SearchScreen}  options={{ title: 'Search' }} />
      <Tab.Screen name="Saved"   component={SavedScreen}   options={{ title: 'Saved' }} />
      <Tab.Screen name="Contact" component={LeadScreen}    options={{ title: 'Contact' }} initialParams={{ type: 'contact' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle:      { backgroundColor: '#111' },
          headerTintColor:  colors.white,
          headerTitleStyle: { color: colors.white, fontSize: 17 },
        }}
      >
        <Stack.Screen name="Tabs"           component={Tabs}                 options={{ headerShown: false }} />
        <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} options={{ title: 'Property' }} />
        <Stack.Screen name="Lead"           component={LeadScreen}
          options={({ route }) => ({
            title: (route.params as any)?.type === 'seller'     ? 'Home Valuation'
                 : (route.params as any)?.type === 'buyer'      ? 'Request Showing'
                 : (route.params as any)?.type === 'commercial' ? 'Commercial Inquiry'
                 : 'Contact Gurpreet',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

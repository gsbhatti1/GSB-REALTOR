import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
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

const TAB_ICONS: Record<string, string> = {
  Home:    '🏠',
  Search:  '🔍',
  Saved:   '♡',
  Contact: '📞',
  Profile: '👤',
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
        },
        tabBarActiveTintColor:   colors.gold,
        tabBarInactiveTintColor: colors.grey,
        tabBarLabelStyle: {
          fontSize: 11, letterSpacing: 0.5,
        },
        tabBarIcon: ({ focused, color }) => (
          <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home"   component={HomeScreen}   options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="Saved"  component={SavedScreen}  options={{ title: 'Saved' }} />
      <Tab.Screen
        name="Contact"
        component={LeadScreen}
        options={{ title: 'Contact' }}
        initialParams={{ type: 'contact' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  )
}

const screenOptions = {
  headerStyle: {
    backgroundColor: '#111',
  },
  headerTintColor: colors.white,
  headerTitleStyle: {
    color: colors.white,
    fontWeight: '400' as const,
    fontSize: 17,
  },
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.black },
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PropertyDetail"
          component={PropertyDetailScreen}
          options={{ title: 'Property Details' }}
        />
        <Stack.Screen
          name="Lead"
          component={LeadScreen}
          options={({ route }) => ({
            title: (route.params as any)?.type === 'seller'     ? 'Home Valuation'
                 : (route.params as any)?.type === 'commercial' ? 'Commercial Inquiry'
                 : "Let's Talk",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

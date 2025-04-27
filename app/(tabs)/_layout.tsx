import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/component/HapticTab';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  
  return (
<Tabs
  screenOptions={({ route }) => ({
    tabBarActiveTintColor: 'black', // Highlight active tab
    tabBarInactiveTintColor: 'gray', // Inactive tabs color
    headerShown: true,
    tabBarButton: HapticTab,
    // tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',
      },
      default: {},
    }),
    headerStyle: {
      height: 90,
    },
    tabBarLabelStyle: { fontWeight: 'bold' }, // Make active label bold
  })}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />

    }}
  />
  <Tabs.Screen
    name="Search_Properties"
    options={{
      title: 'Search',
      tabBarIcon: ({ color }) => <Ionicons name="search" size={28} color={color} />,
    }}
  />
  <Tabs.Screen
    name="agencies"
    options={{
      title: 'Agencies',
      tabBarIcon: ({ color }) => <Ionicons name="business" size={28} color={color} />,
    }}
  />
</Tabs>

  );
}



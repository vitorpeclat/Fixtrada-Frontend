import { Tabs } from 'expo-router';
import { ClipboardClock, House, User } from 'lucide-react-native';
import React from 'react';

import { MenuIcon } from '@/components/MenuIcon';
import { Colors } from '@/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.secondary, 
        tabBarInactiveTintColor: Colors.primary,  
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1, 
          borderTopColor: Colors.lightGray,
          height: 60,
          paddingBottom: 5, 
        },
      }}>
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <MenuIcon IconComponent={House} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="Servicos"
        options={{
          tabBarIcon: ({ color }) => (
            <MenuIcon IconComponent={ClipboardClock} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="Perfil"
        options={{
          tabBarIcon: ({ color }) => (
            <MenuIcon IconComponent={User} color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
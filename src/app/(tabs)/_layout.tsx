import { Tabs } from 'expo-router';
import { ClipboardClock, House, User } from 'lucide-react-native';
import React from 'react';

import { IconSelect } from '@/components/IconSelect';
import { Colors } from '@/theme/colors';
import { FilterStatus } from '@/types/FilterStatus';

export default function TabLayout() {
  return (
    <Tabs
      // Adicionando esta propriedade para garantir que a home seja sempre a primeira tela
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.lightGray,
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconSelect
              IconComponent={House}
              size={28}
              status={focused ? FilterStatus.SELECTED : FilterStatus.UNSELECTED}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="servicos"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconSelect
              IconComponent={ClipboardClock}
              size={28}
              status={focused ? FilterStatus.SELECTED : FilterStatus.UNSELECTED}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => (
            <IconSelect
              IconComponent={User}
              size={28}
              status={focused ? FilterStatus.SELECTED : FilterStatus.UNSELECTED}
            />
          ),
        }}
      />
    </Tabs>
  );
}
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { PVScreen } from '../screens/PVScreen';
import { ElectricalScreen } from '../screens/ElectricalScreen';
import { HomeAppliancesScreen } from '../screens/HomeAppliancesScreen';
import { WorkEstimateScreen } from '../screens/WorkEstimateScreen';
import { ChangelogScreen } from '../screens/ChangelogScreen';
import { LicenseScreen } from '../screens/LicenseScreen';
import { KnowledgeScreen } from '../screens/KnowledgeScreen';
import { LayoutDashboard, Sun, Zap, Home, Calculator, Clock, FileText, BookOpen } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E1E1E',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#2A2A2A',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#2A2A2A',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Panel Główny',
          tabBarLabel: 'Start',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PV"
        component={PVScreen}
        options={{
          title: 'Fotowoltaika (PV)',
          tabBarLabel: 'PV',
          tabBarIcon: ({ color, size }) => <Sun color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Electrical"
        component={ElectricalScreen}
        options={{
          title: 'Elektryka Ogólna',
          tabBarLabel: 'Elektryka',
          tabBarIcon: ({ color, size }) => <Zap color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Appliances"
        component={HomeAppliancesScreen}
        options={{
          title: 'AGD / Dom',
          tabBarLabel: 'AGD',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Estimate"
        component={WorkEstimateScreen}
        options={{
          title: 'Wycena Prac',
          tabBarLabel: 'Wycena',
          tabBarIcon: ({ color, size }) => <Calculator color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Knowledge"
        component={KnowledgeScreen}
        options={{
          title: 'Baza Wiedzy',
          tabBarLabel: 'Normy',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

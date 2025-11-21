import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

import HomeScreen from '../screens/HomeScreen';
import ComplaintsStack from './complaints-stack';
import ProfileStack from './profile-stack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.Colors.primary.main,
        tabBarInactiveTintColor: Theme.Colors.neutral.gray500,
        tabBarStyle: {
          height: 70,
          paddingBottom: 15,
          paddingTop: 8,
          backgroundColor: Theme.Colors.neutral.white,
          borderTopWidth: 1,
          borderTopColor: Theme.Colors.neutral.gray200,
        },
        tabBarLabelStyle: {
          fontSize: Theme.Typography.fontSize.xs,
          fontFamily: Theme.Typography.fontFamily.medium,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Complaints"
        component={ComplaintsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

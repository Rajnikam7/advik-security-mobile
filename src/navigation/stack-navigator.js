import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import FileComplaintScreen from '../screens/FileComplaintScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import AboutAppScreen from '../screens/AboutAppScreen';
import TabNavigator from './tab-navigator';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Flash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Flash" component={FlashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
        />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="FileComplaint" component={FileComplaintScreen} />
        <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

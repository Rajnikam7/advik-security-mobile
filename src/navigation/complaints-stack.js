import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import SelectServiceScreen from '../screens/SelectServiceScreen';
import FileComplaintScreen from '../screens/FileComplaintScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';

const Stack = createNativeStackNavigator();

const ComplaintsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ComplaintsList" component={ComplaintsScreen} />
      <Stack.Screen name="SelectService" component={SelectServiceScreen} />
      <Stack.Screen name="FileComplaint" component={FileComplaintScreen} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
    </Stack.Navigator>
  );
};

export default ComplaintsStack;

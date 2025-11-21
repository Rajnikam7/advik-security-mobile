import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../assets/themes';

const ProfileScreen = () => {
  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.text}>Profile Screen</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Theme.Typography.fontSize.xl,
    fontFamily: Theme.Typography.fontFamily.bold,
    color: Theme.Colors.neutral.gray900,
  },
});

export default ProfileScreen;

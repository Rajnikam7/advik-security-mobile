import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const HomeHeader = ({ userName, onNotificationPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Icon name="person" size={24} color={Theme.Colors.neutral.white} />
        </View>
        <Text style={styles.greeting}>Hello, {userName}</Text>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
      >
        <Icon
          name="notifications-outline"
          size={26}
          color={Theme.Colors.neutral.gray700}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm + 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: Theme.Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeHeader;

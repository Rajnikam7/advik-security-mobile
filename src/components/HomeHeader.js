import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

const HomeHeader = ({ userName, onNotificationPress, navigation }) => {
  const initials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);

  const handleProfilePress = () => {
    navigation.navigate('Profile', { screen: 'ProfileMain' });
  };
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={handleProfilePress} style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
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
    paddingTop: Theme.Spacing.xl,
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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
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

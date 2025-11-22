import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { Theme } from '../assets/themes';
import authService from '../services/authService';
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setUserData(response.data?.user);
    } catch (error) {
      console.error('Error loading profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully',
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout',
      });
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
        </View>
      </LinearGradient>
    );
  }

  const initials = getInitials(userData?.name);
  const avatarColor = getAvatarColor(userData?.name);

  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{userData?.name || 'User'}</Text>
          <Text style={styles.phone}>{userData?.phone || ''}</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon
                name="person-outline"
                size={20}
                color={Theme.Colors.neutral.gray600}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData?.name || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon
                name="mail-outline"
                size={20}
                color={Theme.Colors.neutral.gray600}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData?.email || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Icon
                name="call-outline"
                size={20}
                color={Theme.Colors.neutral.gray600}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData?.phone || 'Not set'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Icon
              name="create-outline"
              size={22}
              color={Theme.Colors.primary.main}
            />
            <Text style={styles.actionButtonText}>Edit Profile</Text>
            <Icon
              name="chevron-forward"
              size={20}
              color={Theme.Colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Icon
              name="log-out-outline"
              size={22}
              color={Theme.Colors.error.main}
            />
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Logout
            </Text>
            <Icon
              name="chevron-forward"
              size={20}
              color={Theme.Colors.neutral.gray400}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl * 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  name: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  phone: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  section: {
    paddingHorizontal: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.lg,
  },
  infoCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.sm,
  },
  infoContent: {
    flex: 1,
    marginLeft: Theme.Spacing.md,
  },
  infoLabel: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  infoValue: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.Colors.neutral.gray200,
    marginVertical: Theme.Spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    marginLeft: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  logoutText: {
    color: Theme.Colors.error.main,
  },
});

export default ProfileScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const ProfileMainScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: 'personal',
      title: 'Personal Information',
      subtitle: 'Update your details',
      icon: 'person-outline',
      screen: 'EditProfile',
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: 'settings-outline',
      screen: 'Settings',
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs & contact',
      icon: 'help-circle-outline',
      screen: 'Help',
    },
  ];

  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon
                name="person"
                size={48}
                color={Theme.Colors.neutral.white}
              />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon
                name="camera"
                size={16}
                color={Theme.Colors.neutral.white}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Advik Kumar</Text>
          <Text style={styles.userEmail}>advik.kumar@email.com</Text>
          <Text style={styles.userPhone}>+91 98765 43210</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={Theme.Colors.primary.main}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <Icon
                name="chevron-forward"
                size={20}
                color={Theme.Colors.neutral.gray400}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Theme.Colors.neutral.white,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.Colors.neutral.white,
  },
  userName: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  userEmail: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginBottom: 4,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  userPhone: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.lg,
    gap: Theme.Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    alignItems: 'center',
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  statNumber: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary.main,
    marginBottom: 4,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statLabel: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  menuContainer: {
    paddingHorizontal: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  menuSubtitle: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  badge: {
    backgroundColor: Theme.Colors.primary.lightest,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: Theme.Spacing.sm,
  },
  badgeText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    marginBottom: Theme.Spacing.md,
  },
  logoutText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: '#EF4444',
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  versionText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray400,
    textAlign: 'center',
    marginBottom: Theme.Spacing.xl,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});

export default ProfileMainScreen;

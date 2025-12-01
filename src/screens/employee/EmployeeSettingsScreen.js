import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { Theme } from '../../assets/themes';
import authService from '../../services/authService';
import secureStorage from '../../utils/secureStorage';

const EmployeeSettingsScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const appVersion = DeviceInfo.getVersion();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userData = await secureStorage.getUserData();
      setUserInfo(userData);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const settingsSections = [
    {
      title: 'Employee Profile',
      items: [
        {
          id: 'profile',
          label: userInfo?.name || 'Employee User',
          subtitle: `${userInfo?.role || 'employee'} • ${userInfo?.email || userInfo?.phone}`,
          type: 'info',
          icon: 'person-circle-outline',
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'push',
          label: 'Push Notifications',
          subtitle: 'Receive complaint assignment notifications',
          type: 'switch',
          value: pushNotifications,
          onValueChange: setPushNotifications,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'terms',
          label: 'Terms & Conditions',
          subtitle: 'Legal information',
          type: 'navigate',
          icon: 'document-text-outline',
          screen: 'Terms',
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          subtitle: 'How we use your data',
          type: 'navigate',
          icon: 'shield-outline',
          screen: 'PrivacyPolicy',
        },
        {
          id: 'about',
          label: 'About App',
          subtitle: `Version ${appVersion}`,
          type: 'navigate',
          icon: 'information-circle-outline',
          screen: 'AboutApp',
        },
      ],
    },
  ];

  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon
            name="arrow-back"
            size={24}
            color={Theme.Colors.neutral.gray900}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  {item.type === 'switch' ? (
                    <View style={styles.settingItem}>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Text style={styles.settingSubtitle}>
                          {item.subtitle}
                        </Text>
                      </View>
                      <Switch
                        value={item.value}
                        onValueChange={item.onValueChange}
                        trackColor={{
                          false: Theme.Colors.neutral.gray300,
                          true: Theme.Colors.primary.main,
                        }}
                        thumbColor={Theme.Colors.neutral.white}
                      />
                    </View>
                  ) : item.type === 'info' ? (
                    <View style={styles.settingItem}>
                      <View style={styles.profileIconContainer}>
                        <Icon
                          name={item.icon}
                          size={32}
                          color={Theme.Colors.primary.main}
                        />
                      </View>
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Text style={styles.settingSubtitle}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.settingItem}
                      onPress={() => item.screen && handleNavigate(item.screen)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.settingLeft}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Text style={styles.settingSubtitle}>
                          {item.subtitle}
                        </Text>
                      </View>
                      <Icon
                        name="chevron-forward"
                        size={20}
                        color={Theme.Colors.neutral.gray400}
                      />
                    </TouchableOpacity>
                  )}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Icon
                name="log-out-outline"
                size={24}
                color={Theme.Colors.error.main}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Employee Badge */}
        <View style={styles.employeeBadge}>
          <Icon
            name="briefcase"
            size={20}
            color={Theme.Colors.primary.main}
          />
          <Text style={styles.employeeBadgeText}>Employee Access</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.sm,
    paddingTop: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.lg,
  },
  section: {
    marginBottom: Theme.Spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray600,
    marginBottom: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.md,
  },
  profileIconContainer: {
    marginRight: Theme.Spacing.md,
  },
  settingLeft: {
    flex: 1,
    marginRight: Theme.Spacing.md,
  },
  settingLabel: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  settingSubtitle: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.Colors.neutral.gray200,
    marginHorizontal: Theme.Spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.md,
  },
  logoutText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.error.main,
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  employeeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.md,
    marginBottom: Theme.Spacing.xl,
  },
  employeeBadgeText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary.main,
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
});

export default EmployeeSettingsScreen;
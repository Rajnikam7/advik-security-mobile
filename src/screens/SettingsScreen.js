import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { Theme } from '../assets/themes';

const SettingsScreen = ({ navigation }) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const appVersion = DeviceInfo.getVersion();

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  const settingsSections = [
    // {
    //   title: 'Notifications',
    //   items: [
    //     {
    //       id: 'push',
    //       label: 'Push Notifications',
    //       subtitle: 'Receive app notifications',
    //       type: 'switch',
    //       value: pushNotifications,
    //       onValueChange: setPushNotifications,
    //     },
    //   ],
    // },

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
        <Text style={styles.headerTitle}>Settings</Text>
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

        {/* Clear Cache */}
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
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.md,
    marginBottom: Theme.Spacing.xl,
  },
  clearCacheText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});

export default SettingsScreen;

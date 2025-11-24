import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';
import { Theme } from '../assets/themes';
import Config from 'react-native-config';

const AboutAppScreen = ({ navigation }) => {
  const appVersion = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const phoneNumber = Config.SUPPORT_PHONE_NUMBER;

  const handleContactSupport = () => {
    if (!phoneNumber) {
      console.warn('Support phone number is missing');
      return;
    }

    const phoneUrl = `tel:${phoneNumber}`;

    Linking.openURL(phoneUrl).catch(err =>
      console.error('Failed to open dialer:', err),
    );
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@adviksecurity.com');
  };

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
        <Text style={styles.headerTitle}>About App</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* App Icon */}
          <View style={styles.appIconContainer}>
            <View style={styles.appIcon}>
              <Icon
                name="shield-checkmark"
                size={64}
                color={Theme.Colors.primary.main}
              />
            </View>
            <Text style={styles.appName}>Advik Security</Text>
            <Text style={styles.appTagline}>Your Safety, Our Priority</Text>
          </View>

          {/* Version Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>{appVersion}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build Number</Text>
              <Text style={styles.infoValue}>{buildNumber}</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Advik Security</Text>
            <Text style={styles.paragraph}>
              Advik Security is a comprehensive security management application
              designed to help you manage your security services, file
              complaints, and track service requests efficiently.
            </Text>
            <Text style={styles.paragraph}>
              Our mission is to provide reliable and professional security
              solutions with cutting-edge technology and exceptional customer
              service.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featureItem}>
              <Icon
                name="checkmark-circle"
                size={20}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.featureText}>File and track complaints</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon
                name="checkmark-circle"
                size={20}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.featureText}>Real-time service updates</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon
                name="checkmark-circle"
                size={20}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.featureText}>
                Multiple service types (CCTV, GPS, Intercom)
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon
                name="checkmark-circle"
                size={20}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.featureText}>Priority service options</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon
                name="checkmark-circle"
                size={20}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.featureText}>Secure payment integration</Text>
            </View>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleContactSupport}
            >
              <Icon name="call" size={20} color={Theme.Colors.primary.main} />
              <Text style={styles.contactText}>+91 9999999999</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <Icon name="mail" size={20} color={Theme.Colors.primary.main} />
              <Text style={styles.contactText}>support@adviksecurity.com</Text>
            </TouchableOpacity>
          </View>

          {/* Copyright */}
          <Text style={styles.copyright}>
            © 2025 Advik Security. All rights reserved.
          </Text>
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
  },
  content: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.xl,
  },
  appIconContainer: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  appName: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  appTagline: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  infoCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.sm,
  },
  infoLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  infoValue: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.Colors.neutral.gray200,
  },
  section: {
    marginBottom: Theme.Spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  paragraph: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray700,
    lineHeight: 22,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'justify',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  featureText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray700,
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.sm,
  },
  contactText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary.main,
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  copyright: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    textAlign: 'center',
    marginTop: Theme.Spacing.lg,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});

export default AboutAppScreen;

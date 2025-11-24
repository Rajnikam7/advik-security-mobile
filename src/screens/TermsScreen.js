import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const TermsScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: November 25, 2025</Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using the Advik Security mobile application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
          </Text>

          <Text style={styles.sectionTitle}>2. Use of Services</Text>
          <Text style={styles.paragraph}>
            Our security services are provided for legitimate security and surveillance purposes only. You agree to use our services in compliance with all applicable laws and regulations.
          </Text>

          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.paragraph}>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </Text>

          <Text style={styles.sectionTitle}>4. Service Availability</Text>
          <Text style={styles.paragraph}>
            We strive to provide uninterrupted service, but we do not guarantee that our services will be available at all times. We reserve the right to modify, suspend, or discontinue any part of our services without prior notice.
          </Text>

          <Text style={styles.sectionTitle}>5. Payment Terms</Text>
          <Text style={styles.paragraph}>
            All service fees must be paid in advance. Prices are subject to change with prior notice. Refunds will be processed according to our refund policy.
          </Text>

          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            Advik Security shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
          </Text>

          <Text style={styles.sectionTitle}>7. Privacy</Text>
          <Text style={styles.paragraph}>
            Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
          </Text>

          <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the app.
          </Text>

          <Text style={styles.sectionTitle}>9. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms & Conditions, please contact us at support@adviksecurity.com or call +91 9999999999.
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
  lastUpdated: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    marginBottom: Theme.Spacing.lg,
    fontFamily: Theme.Typography.fontFamily.regular,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  paragraph: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray700,
    lineHeight: 22,
    marginBottom: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'justify',
  },
});

export default TermsScreen;

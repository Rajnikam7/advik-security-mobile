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

const PrivacyPolicyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: November 25, 2025</Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information that you provide directly to us, including your name, email address, phone number, and location information when you use our security services.
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to provide, maintain, and improve our services, to process your complaints and service requests, and to communicate with you about our services.
          </Text>

          <Text style={styles.sectionTitle}>3. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our services, subject to confidentiality agreements.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Text>

          <Text style={styles.sectionTitle}>5. Location Data</Text>
          <Text style={styles.paragraph}>
            We collect location data to provide accurate service delivery and to help our technicians reach your location. You can control location permissions through your device settings.
          </Text>

          <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve and analyze our service.
          </Text>

          <Text style={styles.sectionTitle}>7. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us directly.
          </Text>

          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children.
          </Text>

          <Text style={styles.sectionTitle}>9. Changes to Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Text>

          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at privacy@adviksecurity.com or call +91 9999999999.
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

export default PrivacyPolicyScreen;

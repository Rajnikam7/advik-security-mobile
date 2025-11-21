import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (fullName.trim() && email.trim()) {
      navigation.navigate('Main');
    }
  };

  const isFormValid = fullName.trim().length > 0 && email.trim().length > 0;

  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo and Brand */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>🛡️</Text>
              </View>
              <Text style={styles.brandName}>Advik Security</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Let's Get Started</Text>
            <Text style={styles.subtitle}>
              Enter your details below to create your{'\n'}secure account.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Icon
                    name="person-outline"
                    size={22}
                    color={Theme.Colors.neutral.gray600}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Jane Doe"
                  placeholderTextColor={Theme.Colors.neutral.gray400}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.iconContainer}>
                  <Icon
                    name="mail-outline"
                    size={22}
                    color={Theme.Colors.neutral.gray600}
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="jane.doe@email.com"
                  placeholderTextColor={Theme.Colors.neutral.gray400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!isFormValid}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.xxl + 10,
    paddingBottom: Theme.Spacing.xl,
  },

  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.sm + 2,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 28,
  },
  brandName: {
    fontSize: Theme.Typography.fontSize.xl + 2,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },

  // Title
  titleContainer: {
    marginBottom: Theme.Spacing.xl + 4,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xxl + 2,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    textAlign: 'center',
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Theme.Typography.fontFamily.regular,
  },

  // Form
  formContainer: {
    marginBottom: Theme.Spacing.md,
  },
  inputGroup: {
    marginBottom: Theme.Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  label: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  optionalBadge: {
    backgroundColor: Theme.Colors.primary.lightest,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  optionalText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.primary.dark,
    fontWeight: Theme.Typography.fontWeight.medium,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 8,
    height: 50,
    borderWidth: 1.5,
    borderColor: Theme.Colors.neutral.gray300,
    shadowColor: Theme.Colors.neutral.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Theme.Colors.neutral.gray300,
  },
  input: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md - 1,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
  },

  // Continue Button
  continueButton: {
    backgroundColor: Theme.Colors.primary.main,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.md + 4,
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: Theme.Colors.primary.lighter,
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },

  // Terms
  termsContainer: {
    marginBottom: Theme.Spacing.lg,
    paddingHorizontal: Theme.Spacing.sm,
  },
  termsText: {
    fontSize: Theme.Typography.fontSize.xs + 1,
    color: Theme.Colors.neutral.gray500,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  termsLink: {
    color: Theme.Colors.primary.main,
    fontWeight: Theme.Typography.fontWeight.semibold,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
});

export default RegisterScreen;

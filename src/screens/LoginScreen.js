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
import { Theme } from '../assets/themes';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = () => {
    if (phoneNumber.length === 10) {
      navigation.navigate('OTPVerification', { phoneNumber });
    }
  };

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
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🛡️</Text>
            </View>
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to continue.
          </Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity style={styles.countryCodeButton}>
                <Text style={styles.countryCodeText}>+91</Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.phoneInput}
                placeholder="000-000-0000"
                placeholderTextColor={Theme.Colors.neutral.gray400}
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              phoneNumber.length !== 10 && styles.sendButtonDisabled,
            ]}
            onPress={handleSendOTP}
            disabled={phoneNumber.length !== 10}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>Send OTP</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>Having trouble? </Text>
            <TouchableOpacity>
              <Text style={styles.supportLink}>Contact Support</Text>
            </TouchableOpacity>
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
    paddingTop: Theme.Spacing.xxl + 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Theme.Spacing.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Theme.Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: Theme.Typography.fontSize.xxxl + 8,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xxl + 4,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.md - 1,
    color: Theme.Colors.neutral.gray500,
    textAlign: 'center',
    marginBottom: Theme.Spacing.xxl + 8,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  inputSection: {
    marginBottom: Theme.Spacing.xl,
  },
  label: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray800,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.Colors.neutral.white,
    border: 1,
    borderColor: Theme.Colors.neutral.gray300,
    borderRadius: 8,
    overflow: 'hidden',
    height: 54,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Theme.Colors.neutral.gray300,
    gap: 4,
  },
  countryCodeText: {
    fontSize: Theme.Typography.fontSize.md - 1,
    color: Theme.Colors.neutral.gray800,
    fontWeight: Theme.Typography.fontWeight.medium,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  dropdownIcon: {
    fontSize: 8,
    color: Theme.Colors.neutral.gray600,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md - 1,
    color: Theme.Colors.neutral.gray800,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  sendButton: {
    backgroundColor: Theme.Colors.primary.main,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Theme.Colors.primary.lighter,
  },
  sendButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Theme.Spacing.md,
  },
  registerText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  registerLink: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary.main,
    fontWeight: Theme.Typography.fontWeight.bold,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  supportContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: Theme.Spacing.xl,
  },
  supportText: {
    fontSize: Theme.Typography.fontSize.xs + 1,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  supportLink: {
    fontSize: Theme.Typography.fontSize.xs + 1,
    color: Theme.Colors.primary.main,
    fontWeight: Theme.Typography.fontWeight.semibold,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
});

export default LoginScreen;

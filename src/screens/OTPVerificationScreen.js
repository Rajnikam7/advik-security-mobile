import React, { useState, useRef } from 'react';
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

const OTPVerificationScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      navigation.replace('Register');
    }
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
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

          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}+91 {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              otp.join('').length !== 6 && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={otp.join('').length !== 6}
            activeOpacity={0.8}
          >
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendLink}>Resend OTP</Text>
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
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary.darker,
    textAlign: 'center',
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.md - 1,
    color: Theme.Colors.neutral.gray500,
    textAlign: 'center',
    marginBottom: Theme.Spacing.xxl + 8,
    lineHeight: 22,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.xl,
    gap: Theme.Spacing.xs + 2,
  },
  otpInput: {
    flex: 1,
    height: 52,
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary.main,
    borderWidth: 2,
    borderColor: Theme.Colors.neutral.gray200,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  otpInputFilled: {
    borderColor: Theme.Colors.text.tertiary,
    // backgroundColor: Theme.Colors.primary.lightest,
  },
  verifyButton: {
    backgroundColor: Theme.Colors.primary.main,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  verifyButtonDisabled: {
    backgroundColor: Theme.Colors.primary.lighter,
  },
  verifyButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.xl,
  },
  resendText: {
    fontSize: Theme.Typography.fontSize.xs + 1,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  resendLink: {
    fontSize: Theme.Typography.fontSize.xs + 1,
    color: Theme.Colors.primary.main,
    fontWeight: Theme.Typography.fontWeight.semibold,
    fontFamily: Theme.Typography.fontFamily.semibold,
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

export default OTPVerificationScreen;

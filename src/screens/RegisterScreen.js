import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';
import authService from '../services/authService';
import { validateRegistrationForm } from '../utils/validation';
import { setUser } from '../store/slices/authSlice';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [errors, setErrors] = useState({ name: '', email: '' });

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setFetchingProfile(true);
      const response = await authService.getProfile();
      console.log('user profile', response);
      if (response.data && response.data.user) {
        const userData = response.data.user;

        // Pre-fill form with existing data
        if (userData.name) setFullName(userData.name);
        if (userData.email) setEmail(userData.email);

        // Update Redux store
        dispatch(setUser(userData));
      }
    } catch (err) {
      console.log('Failed to fetch profile:', err);
      // Continue with empty form if profile fetch fails
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleContinue = async () => {
    setErrors({ name: '', email: '' });

    // Validate form
    const validation = validateRegistrationForm(fullName, email);
    if (!validation.isValid) {
      // Set inline errors based on validation message
      if (validation.message.toLowerCase().includes('name')) {
        setErrors(prev => ({ ...prev, name: validation.message }));
      } else if (validation.message.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: validation.message }));
      }
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(
        fullName.trim(),
        email.trim(),
      );

      // Update Redux with complete profile
      dispatch(setUser(response.user));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your profile has been created successfully!',
      });

      setTimeout(() => {
        navigation.replace('Main');
      }, 1000);
    } catch (err) {
      console.log(err)
      const errorMessage =
        err.message || 'Failed to complete registration. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });

      // Handle specific field errors
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else if (errorMessage.toLowerCase().includes('name')) {
        setErrors(prev => ({ ...prev, name: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    fullName.trim().length > 0 && email.trim().length > 0 && !loading;

  // Show loading while fetching profile
  if (fetchingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

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
              <View
                style={[
                  styles.inputWrapper,
                  errors.name && styles.inputWrapperError,
                ]}
              >
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
                  onChangeText={text => {
                    setFullName(text);
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  editable={!loading}
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email && styles.inputWrapperError,
                ]}
              >
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
                  onChangeText={text => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  editable={!loading}
                />
              </View>
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
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
            {loading ? (
              <ActivityIndicator color={Theme.Colors.neutral.white} />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
  },
  loadingText: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
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
  inputWrapperError: {
    borderColor: Theme.Colors.error.main,
    borderWidth: 2,
  },
  errorText: {
    fontSize: Theme.Typography.fontSize.xs + 1,
    color: Theme.Colors.error.main,
    marginTop: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});

export default RegisterScreen;

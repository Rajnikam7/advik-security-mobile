import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';
import adminService from '../services/adminService';
import Toast from 'react-native-toast-message';

const RegisterEmployeeScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const employeeData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
      };

      await adminService.registerEmployee(employeeData);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Employee registered successfully',
      });

      // Navigate back to users list
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message || 'Failed to register employee',
      });
    } finally {
      setLoading(false);
    }
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
          <Icon name="arrow-back" size={24} color={Theme.Colors.neutral.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register Employee</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View style={styles.iconContainer}>
                <Icon name="person-add" size={32} color={Theme.Colors.primary.main} />
              </View>
              <Text style={styles.formTitle}>Employee Information</Text>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <View style={[
                styles.inputWrapper,
                errors.name && styles.inputWrapperError
              ]}>
                <Icon
                  name="person-outline"
                  size={20}
                  color={errors.name ? Theme.Colors.error.main : Theme.Colors.neutral.gray400}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  placeholderTextColor={Theme.Colors.neutral.gray400}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View style={[
                styles.inputWrapper,
                errors.email && styles.inputWrapperError
              ]}>
                <Icon
                  name="mail-outline"
                  size={20}
                  color={errors.email ? Theme.Colors.error.main : Theme.Colors.neutral.gray400}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  placeholderTextColor={Theme.Colors.neutral.gray400}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={[
                styles.inputWrapper,
                errors.phone && styles.inputWrapperError
              ]}>
                <Icon
                  name="call-outline"
                  size={20}
                  color={errors.phone ? Theme.Colors.error.main : Theme.Colors.neutral.gray400}
                  style={styles.inputIcon}
                />
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="Enter phone"
                  placeholderTextColor={Theme.Colors.neutral.gray400}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Info Note */}
            <View style={styles.infoNote}>
              <Icon name="information-circle-outline" size={20} color={Theme.Colors.primary.main} />
              <Text style={styles.infoText}>
                The employee will be created with 'employee' role and can be assigned to complaints.
              </Text>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Theme.Colors.neutral.white} />
            ) : (
              <>
                <Icon name="person-add" size={20} color={Theme.Colors.neutral.white} />
                <Text style={styles.registerButtonText}>Register Employee</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: Theme.Spacing.md,
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.md,
  },
  formCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.lg,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  formTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: Theme.Spacing.xs,
  },
  // formSubtitle: {
  //   fontSize: Theme.Typography.fontSize.sm,
  //   color: Theme.Colors.neutral.gray600,
  //   fontFamily: Theme.Typography.fontFamily.regular,
  //   textAlign: 'center',
  // },
  inputGroup: {
    marginBottom: Theme.Spacing.md,
  },
  label: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginBottom: Theme.Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
    paddingHorizontal: Theme.Spacing.md,
  },
  inputWrapperError: {
    borderColor: Theme.Colors.error.main,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: Theme.Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  countryCode: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray700,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginRight: Theme.Spacing.sm,
  },
  phoneInput: {
    marginLeft: 0,
  },
  errorText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.error.main,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginTop: Theme.Spacing.xs,
    marginLeft: Theme.Spacing.xs,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Theme.Colors.primary.lightest,
    borderRadius: 8,
    padding: Theme.Spacing.md,
    marginTop: Theme.Spacing.sm,
  },
  infoText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginLeft: Theme.Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    marginBottom: Theme.Spacing.xl,
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginLeft: Theme.Spacing.sm,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default RegisterEmployeeScreen;
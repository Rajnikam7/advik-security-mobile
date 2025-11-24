import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { Theme } from '../assets/themes';
import authService from '../services/authService';
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

const EditProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      const user = response.data?.user;
      
      if (user) {
        setFullName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Name is required',
      });
      return;
    }

    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Email is required',
      });
      return;
    }

    try {
      setSaving(true);
      await authService.updateProfile({
        name: fullName.trim(),
        email: email.trim(),
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });

      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const initials = getInitials(fullName);
  const avatarColor = getAvatarColor(fullName);

  if (loading) {
    return (
      <LinearGradient
        colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
        </View>
      </LinearGradient>
    );
  }

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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {/* Change Photo - Coming Soon */}
          {/* <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity> */}
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="person-outline"
                size={20}
                color={Theme.Colors.neutral.gray400}
              />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your name"
                placeholderTextColor={Theme.Colors.neutral.gray400}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="mail-outline"
                size={20}
                color={Theme.Colors.neutral.gray400}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Theme.Colors.neutral.gray400}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputWrapper, styles.disabledInput]}>
              <Icon
                name="call-outline"
                size={20}
                color={Theme.Colors.neutral.gray400}
              />
              <TextInput
                style={styles.input}
                value={phone}
                placeholder="Phone number"
                placeholderTextColor={Theme.Colors.neutral.gray400}
                editable={false}
              />
            </View>
            <Text style={styles.helperText}>Phone number cannot be changed</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Theme.Colors.neutral.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  changePhotoButton: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.sm,
  },
  changePhotoText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  formSection: {
    marginBottom: Theme.Spacing.lg,
  },
  inputGroup: {
    marginBottom: Theme.Spacing.md,
  },
  label: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    paddingHorizontal: Theme.Spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  disabledInput: {
    backgroundColor: Theme.Colors.neutral.gray100,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    marginLeft: Theme.Spacing.sm,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  helperText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  saveButton: {
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
    marginBottom: Theme.Spacing.xl,
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});

export default EditProfileScreen;

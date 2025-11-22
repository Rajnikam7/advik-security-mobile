import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { Theme } from '../assets/themes';
import authService from '../services/authService';
import { setAuth } from '../store/slices/authSlice';

const FlashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Minimum splash screen time
      const minSplashTime = new Promise(resolve => setTimeout(resolve, 2500));
      
      // Check authentication
      const authCheck = authService.checkAuth();
      
      // Wait for both to complete
      const [_, authResult] = await Promise.all([minSplashTime, authCheck]);
      
      console.log('Auth check result:', authResult);

      if (authResult.isAuthenticated) {
        // User is authenticated, update Redux
        dispatch(setAuth({
          user: authResult.user,
          token: 'stored_in_keychain', // Token is in secure storage
        }));

        // Navigate based on profile completion
        if (authResult.isProfileComplete) {
          navigation.replace('Main');
        } else {
          navigation.replace('Register');
        }
      } else {
        // Not authenticated, go to login
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, go to login
      navigation.replace('Login');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.glowCircle} />
          <View style={styles.shieldOuter}>
            <View style={styles.shieldInner}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
          </View>
        </View>

        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>ADVIK</Text>
          <View style={styles.divider} />
          <Text style={styles.brandTagline}>SECURITY</Text>
        </View>

        <Text style={styles.subtitle}>Protecting What Matters Most</Text>

        {isChecking && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary,
    overflow: 'hidden',
  },

  bgCircle1: {
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Theme.Colors.background.pale,
    opacity: 0.5,
    marginTop: -150,
    marginLeft: -150,
  },
  bgCircle2: {
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: Theme.Colors.primary.lightest,
    opacity: 0.4,
    marginTop: -300,
    alignSelf: 'flex-end',
    marginRight: -120,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -400,
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.xxl + 5,
  },
  glowCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Theme.Colors.primary.lighter,
    opacity: 0.3,
  },
  shieldOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Theme.Colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -200,
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 5,
    borderColor: Theme.Colors.primary.light,
  },
  shieldInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Theme.Colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIcon: {
    fontSize: 80,
  },

  brandContainer: {
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    paddingVertical: Theme.Spacing.lg + 6,
    paddingHorizontal: Theme.Spacing.xl + 8,
    borderRadius: 16,
    shadowColor: Theme.Colors.primary.darker,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  brandName: {
    fontSize: Theme.Typography.fontSize.massive,
    fontWeight: Theme.Typography.fontWeight.black,
    color: Theme.Colors.text.primary,
    letterSpacing: Theme.Typography.letterSpacing.widest * 3,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  divider: {
    width: 150,
    height: 4,
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 2,
    marginVertical: Theme.Spacing.md - 1,
  },
  brandTagline: {
    fontSize: Theme.Typography.fontSize.xxl - 2,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.tertiary,
    letterSpacing: Theme.Typography.letterSpacing.widest * 3.5,
    fontFamily: Theme.Typography.fontFamily.bold,
  },

  subtitle: {
    fontSize: Theme.Typography.fontSize.md - 1,
    color: Theme.Colors.text.light,
    marginTop: Theme.Spacing.lg + 11,
    fontWeight: Theme.Typography.fontWeight.medium,
    letterSpacing: Theme.Typography.letterSpacing.wide,
    fontFamily: Theme.Typography.fontFamily.medium,
  },

  loaderContainer: {
    marginTop: Theme.Spacing.xxl + 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});

export default FlashScreen;

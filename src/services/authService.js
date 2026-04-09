import api from './api';
import auth from '../config/firebase';
import secureStorage from '../utils/secureStorage';

class AuthService {
  // Test login for development (without Firebase)
  async testLogin(phoneNo, otp) {
    try {
      console.log('Calling test login API:', { phone: phoneNo, otp });
      const response = await api.post('/auth/test-login', {
        phone: phoneNo,
        otp,
      });

      console.log('Test login response:', response.data);

      if (response.data.token && response.data.refreshToken) {
        await secureStorage.setTokens(
          response.data.token,
          response.data.refreshToken,
        );
        await secureStorage.setUserData(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error('Test login error:', error);
      throw this.handleError(error);
    }
  }

  // Send OTP via Firebase
  async sendOTP(phoneNumber) {
    try {
      const formattedPhone = `+91${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      return confirmation;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verify OTP and authenticate with backend
  async verifyOTP(confirmation, otp) {
    try {
      // Confirm OTP with Firebase
      const userCredential = await confirmation.confirm(otp);

      // Get Firebase ID token
      const firebaseToken = await userCredential.user.getIdToken();

      // Verify with backend
      const response = await api.post('/auth/verify-or-create', {
        firebaseToken,
      });

      if (response.data.token && response.data.refreshToken) {
        await secureStorage.setTokens(
          response.data.token,
          response.data.refreshToken,
        );
        await secureStorage.setUserData(response.data.user);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Complete user registration
  async register(name, email) {
    try {
      console.log('Calling register API:', { name, email });
      const response = await api.patch('/auth/register', { name, email });

      console.log('Register response:', response.data);

      if (response.data.token && response.data.refreshToken) {
        await secureStorage.setTokens(
          response.data.token,
          response.data.refreshToken,
        );
        await secureStorage.setUserData(response.data.user);
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response || error);
      throw this.handleError(error);
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/profile');
      if (response.data?.data?.user) {
        await secureStorage.setUserData(response.data.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      console.log('Calling update profile API:', profileData);
      const response = await api.patch('/profile', profileData);

      console.log('Update profile response:', response.data);

      if (response.data?.data?.user) {
        await secureStorage.setUserData(response.data.data.user);
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response || error);
      throw this.handleError(error);
    }
  }

  // Refresh access token
  async refreshToken() {
    try {
      const tokens = await secureStorage.getTokens();
      if (!tokens || !tokens.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', {
        refreshToken: tokens.refreshToken,
      });

      if (response.data.token) {
        await secureStorage.setTokens(response.data.token, tokens.refreshToken);
        if (response.data.user) {
          await secureStorage.setUserData(response.data.user);
        }
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check authentication status
  async checkAuth() {
    try {
      const tokens = await secureStorage.getTokens();
      if (!tokens || !tokens.accessToken) {
        return { isAuthenticated: false };
      }

      // Try to get profile to verify token is valid
      const response = await this.getProfile();
      return {
        isAuthenticated: true,
        user: response.data.user,
        isProfileComplete: response.data.isProfileComplete,
      };
    } catch (error) {
      // If token is expired, try to refresh
      try {
        await this.refreshToken();
        const response = await this.getProfile();
        return {
          isAuthenticated: true,
          user: response.data.user,
          isProfileComplete: response.data.isProfileComplete,
        };
      } catch (refreshError) {
        // Refresh failed, user needs to login again
        await this.logout();
        return { isAuthenticated: false };
      }
    }
  }

  // Logout
  async logout() {
    try {
      await secureStorage.clearAll();

      // Sign out from Firebase if available
      try {
        if (auth().currentUser) {
          await auth().signOut();
        }
      } catch (firebaseError) {
        // Firebase not configured, skip
        console.log('Firebase sign out skipped');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
      };
    } else if (error.code) {
      // Firebase errors
      const firebaseErrors = {
        'auth/invalid-phone-number': 'Invalid phone number format',
        'auth/invalid-verification-code': 'Invalid OTP code',
        'auth/code-expired': 'OTP code has expired',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
      };
      return {
        message: firebaseErrors[error.code] || error.message,
        code: error.code,
      };
    }
    return {
      message: error.message || 'Network error. Please check your connection',
    };
  }
}

export default new AuthService();

import * as Keychain from 'react-native-keychain';

const KEYCHAIN_SERVICE = 'com.adviksecurity.app';

class SecureStorage {
  // Store tokens securely
  async setTokens(accessToken, refreshToken) {
    try {
      await Keychain.setGenericPassword(
        'auth_tokens',
        JSON.stringify({
          accessToken,
          refreshToken,
          timestamp: Date.now(),
        }),
        {
          service: KEYCHAIN_SERVICE,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        }
      );
      return true;
    } catch (error) {
      console.error('Error storing tokens:', error);
      return false;
    }
  }

  // Get tokens
  async getTokens() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      
      if (credentials) {
        const data = JSON.parse(credentials.password);
        return {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          timestamp: data.timestamp,
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  // Clear tokens
  async clearTokens() {
    try {
      await Keychain.resetGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      return true;
    } catch (error) {
      console.error('Error clearing tokens:', error);
      return false;
    }
  }

  // Store user data
  async setUserData(userData) {
    try {
      await Keychain.setGenericPassword(
        'user_data',
        JSON.stringify(userData),
        {
          service: `${KEYCHAIN_SERVICE}.user`,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        }
      );
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  }

  // Store active role
  async setActiveRole(role) {
    try {
      await Keychain.setGenericPassword(
        'active_role',
        role,
        {
          service: `${KEYCHAIN_SERVICE}.role`,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        }
      );
      return true;
    } catch (error) {
      console.error('Error storing active role:', error);
      return false;
    }
  }

  // Get active role
  async getActiveRole() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}.role`,
      });
      
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving active role:', error);
      return null;
    }
  }

  // Clear active role
  async clearActiveRole() {
    try {
      await Keychain.resetGenericPassword({
        service: `${KEYCHAIN_SERVICE}.role`,
      });
      return true;
    } catch (error) {
      console.error('Error clearing active role:', error);
      return false;
    }
  }

  // Get user data
  async getUserData() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: `${KEYCHAIN_SERVICE}.user`,
      });
      
      if (credentials) {
        return JSON.parse(credentials.password);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Clear user data
  async clearUserData() {
    try {
      await Keychain.resetGenericPassword({
        service: `${KEYCHAIN_SERVICE}.user`,
      });
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  }

  // Clear all data
  async clearAll() {
    await this.clearTokens();
    await this.clearUserData();
    await this.clearActiveRole();
  }
}

export default new SecureStorage();

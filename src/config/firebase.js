// Dummy Firebase configuration
// Replace this with actual Firebase setup when ready

let auth = null;

try {
  // Try to import Firebase auth if configured
  const firebaseAuth = require('@react-native-firebase/auth');
  auth = firebaseAuth.default;
} catch (error) {
  // Firebase not configured, use dummy
  console.log('Firebase not configured, using test mode');
  auth = () => ({
    signInWithPhoneNumber: async () => {
      throw new Error('Firebase not configured. Use test mode.');
    },
    currentUser: null,
    signOut: async () => {},
  });
}

export default auth;

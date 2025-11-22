# Services Documentation

## API Service (`api.js`)

Base Axios instance configured with:
- Base URL from environment variables
- 10-second timeout
- Automatic token injection
- 401 error handling (auto-logout)

### Usage:
```javascript
import api from './api';

// GET request
const response = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', { data });

// PUT request
const response = await api.put('/endpoint', { data });

// DELETE request
const response = await api.delete('/endpoint');
```

## Auth Service (`authService.js`)

Handles all authentication-related API calls.

### Methods:

#### `testLogin(phone, otp)`
Test login without Firebase (development only)
```javascript
const result = await authService.testLogin('9999999999', '999999');
// Returns: { token, user: { id, phone, name, isProfileComplete } }
```

#### `sendOTP(phoneNumber)`
Send OTP via Firebase
```javascript
const confirmation = await authService.sendOTP('9876543210');
// Returns: Firebase confirmation object
```

#### `verifyOTP(confirmation, otp)`
Verify OTP and authenticate with backend
```javascript
const result = await authService.verifyOTP(confirmation, '123456');
// Returns: { token, user: { id, phone, name, email, isProfileComplete } }
```

#### `register(name, email)`
Complete user registration
```javascript
const result = await authService.register('John Doe', 'john@example.com');
// Returns: { token, user: { id, name, email, phone, isProfileComplete } }
```

#### `getProfile()`
Get current user profile
```javascript
const profile = await authService.getProfile();
// Returns: { user, isProfileComplete }
```

#### `logout()`
Logout user and clear storage
```javascript
await authService.logout();
```

### Error Handling

All methods throw errors with the following structure:
```javascript
{
  message: 'Error description',
  status: 400, // HTTP status code (if available)
  code: 'auth/error-code' // Firebase error code (if applicable)
}
```

### Token Management

- Tokens are automatically stored in AsyncStorage
- Tokens are automatically attached to API requests
- Tokens are cleared on logout or 401 errors

## Storage Keys

The following keys are used in AsyncStorage:

- `authToken`: JWT authentication token
- `userData`: Serialized user object

## Example Usage in Components

```javascript
import React, { useState } from 'react';
import { Alert } from 'react-native';
import authService from '../services/authService';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await authService.testLogin('9999999999', '999999');
      console.log('Login successful:', result);
      // Navigate to next screen
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your component JSX
  );
};
```

## Backend API Endpoints

### POST `/auth/test-login`
Test login endpoint (development only)
- Body: `{ phone: string, otp: string }`
- Response: `{ token, user }`

### POST `/auth/verify-or-create`
Verify Firebase token and create/login user
- Body: `{ firebaseToken: string }`
- Response: `{ token, user }`

### POST `/auth/register`
Complete user registration
- Headers: `Authorization: Bearer <token>`
- Body: `{ name: string, email: string }`
- Response: `{ token, user }`

### GET `/auth/profile`
Get user profile
- Headers: `Authorization: Bearer <token>`
- Response: `{ user, isProfileComplete }`

### PUT `/auth/profile`
Update user profile
- Headers: `Authorization: Bearer <token>`
- Body: `{ name?: string, email?: string, phone?: string }`
- Response: `{ user }`

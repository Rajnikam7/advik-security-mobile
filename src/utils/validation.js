export const validatePhone = phone => {
  const phoneRegex = /^[6-9]\d{9}$/;
  
  if (!phone || phone.trim() === '') {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      message: 'Please enter a valid 10-digit phone number',
    };
  }
  
  return { isValid: true, message: '' };
};

export const validateOTP = otp => {
  if (!otp || otp.trim() === '') {
    return { isValid: false, message: 'OTP is required' };
  }
  
  if (otp.length !== 6) {
    return { isValid: false, message: 'OTP must be 6 digits' };
  }
  
  if (!/^\d+$/.test(otp)) {
    return { isValid: false, message: 'OTP must contain only numbers' };
  }
  
  return { isValid: true, message: '' };
};

export const validateName = name => {
  if (!name || name.trim() === '') {
    return { isValid: false, message: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, message: 'Name must not exceed 50 characters' };
  }
  
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      message: 'Name can only contain letters and spaces',
    };
  }
  
  return { isValid: true, message: '' };
};

export const validateEmail = email => {
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true, message: '' };
};

export const validateRegistrationForm = (name, email) => {
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    return nameValidation;
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }
  
  return { isValid: true, message: '' };
};

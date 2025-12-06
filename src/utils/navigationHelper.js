/**
 * Navigate to the appropriate screen based on user role
 * @param {object} navigation - React Navigation object
 * @param {object} user - User object with role field
 */
export const navigateByRole = (navigation, user) => {
  if (!user || !user.role) {
    navigation.replace('Main'); // Default to customer UI
    return;
  }

  switch (user.role) {
    case 'super-admin':
      navigation.replace('AdminDashboard');
      break;
    case 'employee':
      navigation.replace('EmployeeDashboard');
      break;
    case 'customer':
    default:
      navigation.replace('Main');
      break;
  }
};

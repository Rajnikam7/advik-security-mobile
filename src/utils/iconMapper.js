// Map Font Awesome icons to Ionicons
export const mapIconToIonicon = (fontAwesomeIcon) => {
  if (!fontAwesomeIcon) return 'help-circle-outline';

  const iconMap = {
    'fa-broom': 'brush-outline',
    'fa-video': 'videocam-outline',
    'fa-camera': 'videocam-outline',
    'fa-location': 'navigate-outline',
    'fa-map': 'navigate-outline',
    'fa-microphone': 'mic-outline',
    'fa-phone': 'call-outline',
    'fa-hotel': 'bed-outline',
    'fa-building': 'business-outline',
    'fa-home': 'home-outline',
    'fa-leaf': 'leaf-outline',
    'fa-tree': 'leaf-outline',
    'fa-shield': 'shield-outline',
    'fa-lock': 'lock-closed-outline',
    'fa-key': 'key-outline',
    'fa-bell': 'notifications-outline',
    'fa-wrench': 'construct-outline',
    'fa-tools': 'build-outline',
    'fa-cog': 'settings-outline',
    'fa-user': 'person-outline',
    'fa-users': 'people-outline',
    'fa-car': 'car-outline',
    'fa-truck': 'car-outline',
  };

  // Extract the icon name from Font Awesome format (e.g., "fas fa-broom" -> "fa-broom")
  const iconName = fontAwesomeIcon.split(' ').pop();
  
  return iconMap[iconName] || 'help-circle-outline';
};

// Map service name to icon (fallback)
export const getServiceIcon = (serviceName) => {
  const serviceIconMap = {
    'cctv': 'videocam-outline',
    'gps': 'navigate-outline',
    'intercom': 'mic-outline',
    'hotel': 'bed-outline',
    'penthouse': 'business-outline',
    'farm': 'leaf-outline',
    'security': 'shield-outline',
    'access control': 'lock-closed-outline',
  };

  const normalizedName = serviceName.toLowerCase();
  return serviceIconMap[normalizedName] || 'help-circle-outline';
};

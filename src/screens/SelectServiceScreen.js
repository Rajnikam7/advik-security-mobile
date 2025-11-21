import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const SelectServiceScreen = ({ navigation }) => {
  const services = [
    {
      id: 'cctv',
      name: 'CCTV',
      description: 'Surveillance and recording issues.',
      icon: 'videocam-outline',
    },
    {
      id: 'gps',
      name: 'GPS',
      description: 'Vehicle or asset tracking problems.',
      icon: 'navigate-outline',
    },
    {
      id: 'intercom',
      name: 'Intercom',
      description: 'Communication and access control.',
      icon: 'mic-outline',
    },
    {
      id: 'hotel',
      name: 'Hotel',
      description: 'Security services for hotel properties.',
      icon: 'bed-outline',
    },
    {
      id: 'penthouse',
      name: 'Penthouse',
      description: 'Residential high-security services.',
      icon: 'business-outline',
    },
    {
      id: 'farm',
      name: 'Farm',
      description: 'Rural property and asset security.',
      icon: 'leaf-outline',
    },
  ];

  const handleServiceSelect = service => {
    navigation.navigate('FileComplaint', { serviceType: service.name });
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
          <Icon
            name="arrow-back"
            size={24}
            color={Theme.Colors.neutral.gray900}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Complaint</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Select a Service</Text>
          <Text style={styles.subtitle}>
            Which service is this complaint about?
          </Text>
        </View>

        {/* Service Grid */}
        <View style={styles.serviceGrid}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => handleServiceSelect(service)}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIconContainer}>
                <Icon
                  name={service.icon}
                  size={32}
                  color={Theme.Colors.primary.main}
                />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>
                {service.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: Theme.Spacing.sm,
    paddingTop: Theme.Spacing.md,
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
  titleSection: {
    marginBottom: Theme.Spacing.lg,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray800,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: Theme.Spacing.md,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.md + 4,
    marginBottom: Theme.Spacing.md,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  serviceIconContainer: {
    width: 40,
    height: 30,
    borderRadius: 12,
    // backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  serviceName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  serviceDescription: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray700,
    lineHeight: 18,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});

export default SelectServiceScreen;

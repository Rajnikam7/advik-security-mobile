import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../assets/themes';
import HomeHeader from '../components/HomeHeader';
import ActionCard from '../components/ActionCard';
import HelpCard from '../components/HelpCard';

const HomeScreen = ({ navigation }) => {
  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleNewComplaint = () => {
    navigation.navigate('Complaints', {
      screen: 'SelectService',
    });
  };

  const handleTrackComplaints = () => {
    navigation.navigate('Complaints', {
      screen: 'ComplaintsList',
    });
  };

  const handlePayments = () => {
    console.log('Payments pressed');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleCCTV = () => {
    navigation.navigate('Complaints', {
      screen: 'FileComplaint',
      params: { serviceType: 'CCTV' },
    });
  };

  const handleGPS = () => {
    navigation.navigate('Complaints', {
      screen: 'FileComplaint',
      params: { serviceType: 'GPS' },
    });
  };

  const handleIncident = () => {
    navigation.navigate('Complaints', {
      screen: 'FileComplaint',
      params: { serviceType: 'Incident' },
    });
  };

  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <HomeHeader
        userName="Advik"
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Action Cards Grid */}
        <View style={styles.section}>
          <View style={styles.row}>
            <ActionCard
              icon="add-circle-outline"
              title="New Complaint"
              subtitle="File a new issue"
              onPress={handleNewComplaint}
              iconColor={Theme.Colors.primary.main}
            />
            <View style={styles.cardSpacing} />
            <ActionCard
              icon="location-outline"
              title="Track Complaints"
              subtitle="Check status updates"
              onPress={handleTrackComplaints}
              iconColor={Theme.Colors.primary.main}
            />
          </View>

          <View style={styles.row}>
            <ActionCard
              icon="card-outline"
              title="Payments"
              subtitle="View invoices"
              onPress={handlePayments}
              iconColor={Theme.Colors.primary.main}
            />
            <View style={styles.cardSpacing} />
            <ActionCard
              icon="person-outline"
              title="Profile"
              subtitle="Your account details"
              onPress={handleProfile}
              iconColor={Theme.Colors.primary.main}
            />
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>What do you need help with?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.helpCardsContainer}
          >
            <HelpCard
              icon="videocam-outline"
              title="CCTV"
              subtitle="Camera & surveillance"
              onPress={handleCCTV}
            />
            <HelpCard
              icon="navigate-outline"
              title="GPS"
              subtitle="Vehicle tracking"
              onPress={handleGPS}
            />
            <HelpCard
              icon="alert-circle-outline"
              title="Incident"
              subtitle="Report emergency"
              onPress={handleIncident}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.md,
  },
  cardSpacing: {
    width: Theme.Spacing.md,
  },
  helpSection: {
    marginTop: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.lg,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  helpCardsContainer: {
    paddingHorizontal: Theme.Spacing.lg,
  },
});

export default HomeScreen;

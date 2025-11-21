import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const ComplaintDetailScreen = ({ navigation, route }) => {
  const { complaint } = route.params;

  const timeline = [
    {
      id: 1,
      status: 'Complaint Submitted',
      description: 'Your complaint has been received',
      date: '2024-07-28',
      time: '10:30 AM',
      completed: true,
    },
    {
      id: 2,
      status: 'Under Review',
      description: 'Our team is reviewing your complaint',
      date: '2024-07-28',
      time: '11:15 AM',
      completed: true,
    },
    {
      id: 3,
      status: 'Technician Assigned',
      description: 'Rajesh Kumar has been assigned',
      date: '2024-07-28',
      time: '02:30 PM',
      completed: true,
    },
    {
      id: 4,
      status: 'In Progress',
      description: 'Work is currently in progress',
      date: '2024-07-29',
      time: '09:00 AM',
      completed: false,
      current: true,
    },
    {
      id: 5,
      status: 'Resolved',
      description: 'Issue will be marked as resolved',
      date: 'Pending',
      time: '',
      completed: false,
    },
  ];

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'in_progress':
        return '#3B82F6';
      case 'resolved':
        return '#10B981';
      default:
        return Theme.Colors.neutral.gray500;
    }
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
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Icon
            name="ellipsis-vertical"
            size={24}
            color={Theme.Colors.neutral.gray900}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.serviceIconLarge}>
              <Icon
                name="videocam"
                size={32}
                color={Theme.Colors.primary.main}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.complaintId}>{complaint.id}</Text>
              <Text style={styles.serviceType}>{complaint.serviceType}</Text>
            </View>
            <View
              style={[
                styles.statusBadgeLarge,
                { backgroundColor: `${getStatusColor(complaint.status)}20` },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(complaint.status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(complaint.status) },
                ]}
              >
                {complaint.status === 'in_progress'
                  ? 'In Progress'
                  : complaint.status.charAt(0).toUpperCase() +
                    complaint.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.complaintTitle}>{complaint.title}</Text>

          <View style={styles.detailRow}>
            <Icon name="location" size={18} color={Theme.Colors.primary.main} />
            <Text style={styles.detailText}>{complaint.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar" size={18} color={Theme.Colors.primary.main} />
            <Text style={styles.detailText}>Filed on {complaint.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="flag" size={18} color={Theme.Colors.primary.main} />
            <Text style={styles.detailText}>{complaint.priority} Priority</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            The main security camera at the front gate has stopped recording
            footage since yesterday morning. The live feed is working, but no
            new recordings are being saved.
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.timeline}>
            {timeline.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      item.completed && styles.timelineDotCompleted,
                      item.current && styles.timelineDotCurrent,
                    ]}
                  >
                    {item.completed && (
                      <Icon
                        name="checkmark"
                        size={12}
                        color={Theme.Colors.neutral.white}
                      />
                    )}
                  </View>
                  {index < timeline.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        item.completed && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineStatus,
                      item.current && styles.timelineStatusCurrent,
                    ]}
                  >
                    {item.status}
                  </Text>
                  <Text style={styles.timelineDescription}>
                    {item.description}
                  </Text>
                  {item.date !== 'Pending' && (
                    <Text style={styles.timelineDate}>
                      {item.date} • {item.time}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Icon
              name="call-outline"
              size={20}
              color={Theme.Colors.primary.main}
            />
            <Text style={styles.secondaryButtonText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Icon
              name="chatbubble-outline"
              size={20}
              color={Theme.Colors.neutral.white}
            />
            <Text style={styles.primaryButtonText}>Chat</Text>
          </TouchableOpacity>
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
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.lg,
  },
  statusCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.md,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  serviceIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  statusInfo: {
    flex: 1,
  },
  complaintId: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  serviceType: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.semibold,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  complaintTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  detailText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  section: {
    marginBottom: Theme.Spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  descriptionText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    lineHeight: 20,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  timeline: {
    paddingLeft: Theme.Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.Colors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.Colors.neutral.white,
  },
  timelineDotCompleted: {
    backgroundColor: Theme.Colors.primary.main,
  },
  timelineDotCurrent: {
    backgroundColor: '#3B82F6',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Theme.Colors.neutral.gray200,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: Theme.Colors.primary.main,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Theme.Spacing.sm,
  },
  timelineStatus: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  timelineStatusCurrent: {
    color: '#3B82F6',
  },
  timelineDescription: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginBottom: 4,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  timelineDate: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray400,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.xl,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    borderWidth: 2,
    borderColor: Theme.Colors.primary.main,
  },
  secondaryButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary.main,
    marginLeft: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    marginLeft: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});

export default ComplaintDetailScreen;

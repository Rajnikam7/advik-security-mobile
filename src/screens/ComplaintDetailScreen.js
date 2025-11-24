import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Config from 'react-native-config';
import { Theme } from '../assets/themes';
import complaintService from '../services/complaintService';
import { mapIconToIonicon, getServiceIcon } from '../utils/iconMapper';

const { width } = Dimensions.get('window');

const ComplaintDetailScreen = ({ navigation, route }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    loadComplaintDetails();
  }, [complaintId]);

  const loadComplaintDetails = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getComplaintById(complaintId);
      setComplaint(response.data);
    } catch (error) {
      console.error('Error loading complaint details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load complaint details',
      });
    } finally {
      setLoading(false);
    }
  };

  const phoneNumber = Config.SUPPORT_PHONE_NUMBER;

  const handleCallSupport = () => {
    if (!phoneNumber) {
      console.warn('Support phone number is missing');
      return;
    }

    const phoneUrl = `tel:${phoneNumber}`;

    Linking.openURL(phoneUrl).catch(err =>
      console.error('Failed to open dialer:', err),
    );
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Toast.show({
        type: 'error',
        text1: 'Rating Required',
        text2: 'Please select a rating before submitting',
      });
      return;
    }

    try {
      setSubmittingFeedback(true);
      await complaintService.submitFeedback(complaintId, {
        rating,
        feedback: feedback.trim(),
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Thank you for your feedback!',
      });

      setShowFeedbackModal(false);
      loadComplaintDetails(); // Reload to show updated status
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to submit feedback',
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusColor = status => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'open':
        return '#F59E0B';
      case 'assigned':
      case 'inprogress':
        return '#3B82F6';
      case 'resolved':
        return '#10B981';
      case 'closed':
        return '#6B7280';
      default:
        return Theme.Colors.neutral.gray500;
    }
  };

  const getStatusLabel = status => {
    switch (status) {
      case 'Open':
        return 'Open';
      case 'Assigned':
        return 'Assigned';
      case 'InProgress':
        return 'In Progress';
      case 'Resolved':
        return 'Resolved';
      case 'Closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = dateString => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const getServiceIcon = serviceName => {
    const name = serviceName?.toLowerCase();
    if (name?.includes('cctv')) return 'videocam';
    if (name?.includes('gps')) return 'navigate';
    if (name?.includes('intercom')) return 'mic';
    return 'construct';
  };

  const getTimeline = () => {
    if (!complaint) return [];

    const timeline = [];
    const statusHistory = complaint.statusHistory || [];

    // Map status history to timeline
    const statusDescriptions = {
      Open: 'Your complaint has been received',
      Assigned: 'Technician has been assigned to your complaint',
      InProgress: 'Work is currently in progress',
      Resolved: 'Issue has been resolved',
      Closed: 'Complaint closed with feedback',
    };

    const statusLabels = {
      Open: 'Complaint Submitted',
      Assigned: 'Assigned',
      InProgress: 'In Progress',
      Resolved: 'Resolved',
      Closed: 'Closed',
    };

    // Add completed statuses from history
    statusHistory.forEach((historyItem, index) => {
      timeline.push({
        id: index + 1,
        status: statusLabels[historyItem.status] || historyItem.status,
        description: statusDescriptions[historyItem.status] || '',
        ...formatDateTime(historyItem.timestamp),
        completed: true,
        current: false,
      });
    });

    // Mark the last item as current if not Closed or Resolved
    if (
      timeline.length > 0 &&
      complaint.status !== 'Closed' &&
      complaint.status !== 'Resolved'
    ) {
      timeline[timeline.length - 1].current = true;
      timeline[timeline.length - 1].completed = false;
    }

    // Add pending statuses
    const allStatuses = [
      'Open',
      'Assigned',
      'InProgress',
      'Resolved',
      'Closed',
    ];
    const completedStatuses = statusHistory.map(h => h.status);

    allStatuses.forEach(status => {
      if (!completedStatuses.includes(status)) {
        timeline.push({
          id: timeline.length + 1,
          status: statusLabels[status] || status,
          description: statusDescriptions[status] || '',
          date: 'Pending',
          time: '',
          completed: false,
          current: false,
        });
      }
    });

    return timeline;
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
          <Text style={styles.loadingText}>Loading complaint details...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!complaint) {
    return (
      <LinearGradient
        colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Icon
            name="alert-circle-outline"
            size={64}
            color={Theme.Colors.neutral.gray400}
          />
          <Text style={styles.errorText}>Complaint not found</Text>
          <TouchableOpacity
            style={styles.backButtonError}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonErrorText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const timeline = getTimeline();

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
        {/* <TouchableOpacity style={styles.moreButton}>
          <Icon
            name="ellipsis-vertical"
            size={24}
            color={Theme.Colors.neutral.gray900}
          />
        </TouchableOpacity> */}
        <View style={styles.placeholder} />
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
                name={getServiceIcon(complaint.serviceType?.serviceName)}
                size={32}
                color={Theme.Colors.primary.main}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.complaintId}>
                #{complaint._id.slice(-8).toUpperCase()}
              </Text>
              <Text style={styles.serviceType}>
                {complaint.serviceType?.serviceName || 'N/A'}
              </Text>
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
                {getStatusLabel(complaint.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.complaintTitle}>
            {complaint.subject || 'No subject'}
          </Text>

          <View style={styles.detailRow}>
            <Icon name="location" size={18} color={Theme.Colors.primary.main} />
            <Text style={styles.detailText}>
              {complaint.location || 'No location'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="calendar" size={18} color={Theme.Colors.primary.main} />
            <Text style={styles.detailText}>
              Filed on {formatDate(complaint.createdAt)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="flag" size={18} color={Theme.Colors.primary.main} />
            <Text style={styles.detailText}>
              {complaint.servicePriority} Priority
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon name="cash" size={18} color={Theme.Colors.primary.main} />
            <Text style={styles.detailText}>₹{complaint.pricing}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {complaint.description || 'No description provided'}
          </Text>
        </View>

        {/* Attached Images */}
        {complaint.attachmentUrl && complaint.attachmentUrl.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attached Images</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {complaint.attachmentUrl.map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.attachedImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

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

        {/* Feedback Section - Show if Resolved */}
        {complaint.status === 'Resolved' && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>Complaint Resolved!</Text>
            <Text style={styles.feedbackSubtitle}>
              Please provide your feedback to help us improve our service
            </Text>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => setShowFeedbackModal(true)}
            >
              <Icon name="star" size={20} color={Theme.Colors.neutral.white} />
              <Text style={styles.feedbackButtonText}>
                Rate & Close Complaint
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Show Rating if Closed */}
        {complaint.status === 'Closed' && complaint.rating && (
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Your Feedback</Text>
            <View style={styles.ratingDisplay}>
              <View style={styles.starsDisplay}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Icon
                    key={star}
                    name={star <= complaint.rating ? 'star' : 'star-outline'}
                    size={24}
                    color="#F59E0B"
                  />
                ))}
              </View>
              {complaint.feedback && (
                <Text style={styles.feedbackText}>{complaint.feedback}</Text>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCallSupport}
          >
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

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackModal}>
            <Text style={styles.modalTitle}>Rate Your Experience</Text>
            <Text style={styles.modalSubtitle}>
              How satisfied are you with the service?
            </Text>

            {/* Star Rating */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Icon
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={40}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Feedback Text */}
            <Text style={styles.feedbackLabel}>
              Additional Comments (Optional)
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Share your experience..."
              placeholderTextColor={Theme.Colors.neutral.gray400}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={feedback}
              onChangeText={setFeedback}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowFeedbackModal(false);
                  setRating(0);
                  setFeedback('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (rating === 0 || submittingFeedback) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitFeedback}
                disabled={rating === 0 || submittingFeedback}
              >
                {submittingFeedback ? (
                  <ActivityIndicator
                    size="small"
                    color={Theme.Colors.neutral.white}
                  />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.xl,
  },
  loadingText: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  errorText: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray700,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  backButtonError: {
    marginTop: Theme.Spacing.lg,
    paddingHorizontal: Theme.Spacing.xl,
    paddingVertical: Theme.Spacing.md,
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 8,
  },
  backButtonErrorText: {
    color: Theme.Colors.neutral.white,
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.sm,
    paddingTop: Theme.Spacing.xl,
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
  imagesContainer: {
    marginTop: Theme.Spacing.sm,
  },
  attachedImage: {
    width: width * 0.6,
    height: 200,
    borderRadius: 12,
    marginRight: Theme.Spacing.md,
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
  feedbackSection: {
    backgroundColor: Theme.Colors.primary.lightest,
    borderRadius: 16,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.lg,
    borderWidth: 1,
    borderColor: Theme.Colors.primary.light,
  },
  feedbackTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  feedbackSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginBottom: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  feedbackButton: {
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
  feedbackButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    marginLeft: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  ratingSection: {
    marginBottom: Theme.Spacing.lg,
  },
  ratingDisplay: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  starsDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  feedbackText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray700,
    lineHeight: 20,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  feedbackModal: {
    backgroundColor: Theme.Colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.xxl,
  },
  modalTitle: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    textAlign: 'center',
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  modalSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginBottom: Theme.Spacing.lg,
    textAlign: 'center',
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  starButton: {
    padding: Theme.Spacing.xs,
  },
  feedbackLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  feedbackInput: {
    backgroundColor: Theme.Colors.neutral.gray50,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray900,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
    height: 100,
    marginBottom: Theme.Spacing.lg,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Theme.Colors.neutral.gray300,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray700,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  submitButton: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    borderRadius: 12,
    backgroundColor: Theme.Colors.primary.main,
    alignItems: 'center',
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});

export default ComplaintDetailScreen;

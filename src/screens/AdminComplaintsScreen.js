import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { Theme } from '../assets/themes';
import complaintService from '../services/complaintService';

const AdminComplaintsScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadAllComplaints();
    }, [])
  );

  const loadAllComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getAllComplaints();
      setComplaints(response.data || []);
    } catch (error) {
      console.error('Error loading complaints:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load complaints',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedComplaint) return;

    try {
      setUpdatingStatus(true);
      await complaintService.updateComplaintStatus(selectedComplaint._id, newStatus);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Complaint status updated',
      });

      setShowStatusModal(false);
      setSelectedComplaint(null);
      loadAllComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update status',
      });
    } finally {
      setUpdatingStatus(false);
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

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statuses = [
    { value: 'Open', label: 'Open', color: '#F59E0B' },
    { value: 'Assigned', label: 'Assigned', color: '#3B82F6' },
    { value: 'InProgress', label: 'In Progress', color: '#3B82F6' },
    { value: 'Resolved', label: 'Resolved', color: '#10B981' },
  ];

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
          <Icon name="arrow-back" size={24} color={Theme.Colors.neutral.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Complaints</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadAllComplaints}>
          <Icon name="refresh" size={24} color={Theme.Colors.primary.main} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
          <Text style={styles.loadingText}>Loading complaints...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {complaints.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="document-text-outline" size={64} color={Theme.Colors.neutral.gray300} />
              <Text style={styles.emptyText}>No complaints found</Text>
            </View>
          ) : (
            complaints.map(complaint => (
              <TouchableOpacity
                key={complaint._id}
                style={styles.complaintCard}
                onPress={() => navigation.navigate('ComplaintDetail', { complaintId: complaint._id })}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.complaintId}>#{complaint._id.slice(-8).toUpperCase()}</Text>
                    <Text style={styles.serviceType}>{complaint.serviceType?.serviceName}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(complaint.status)}20` }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(complaint.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
                      {complaint.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.subject}>{complaint.subject || 'No subject'}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.customerInfo}>
                    <Icon name="person-outline" size={14} color={Theme.Colors.neutral.gray500} />
                    <Text style={styles.customerName}>{complaint.customerId?.name || 'Unknown'}</Text>
                  </View>
                  <Text style={styles.date}>{formatDate(complaint.createdAt)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.changeStatusButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedComplaint(complaint);
                    setShowStatusModal(true);
                  }}
                >
                  <Icon name="create-outline" size={16} color={Theme.Colors.primary.main} />
                  <Text style={styles.changeStatusText}>Change Status</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* Status Change Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Status</Text>
            <Text style={styles.modalSubtitle}>
              Select new status for complaint #{selectedComplaint?._id.slice(-8).toUpperCase()}
            </Text>

            {statuses.map(status => (
              <TouchableOpacity
                key={status.value}
                style={[styles.statusOption, { borderColor: status.color }]}
                onPress={() => handleStatusChange(status.value)}
                disabled={updatingStatus}
              >
                <View style={[styles.statusOptionDot, { backgroundColor: status.color }]} />
                <Text style={styles.statusOptionText}>{status.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowStatusModal(false);
                setSelectedComplaint(null);
              }}
              disabled={updatingStatus}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Theme.Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray700,
    marginTop: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  complaintCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  cardLeft: {
    flex: 1,
  },
  complaintId: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  serviceType: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 4,
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
  subject: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerName: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray600,
    marginLeft: 4,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  date: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  changeStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.Colors.primary.main,
    backgroundColor: Theme.Colors.primary.lightest,
  },
  changeStatusText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.primary.main,
    marginLeft: 4,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
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
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  modalSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginBottom: Theme.Spacing.lg,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: Theme.Spacing.sm,
    backgroundColor: Theme.Colors.neutral.white,
  },
  statusOptionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Theme.Spacing.sm,
  },
  statusOptionText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  cancelButton: {
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
    marginTop: Theme.Spacing.sm,
  },
  cancelButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
});

export default AdminComplaintsScreen;

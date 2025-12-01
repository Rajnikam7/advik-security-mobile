import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../assets/themes';
import employeeService from '../../services/employeeService';
import Toast from 'react-native-toast-message';

const EmployeeComplaintDetailScreen = ({ navigation, route }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'InProgress', label: 'Start Working', color: '#F59E0B', icon: 'play-circle' },
    { value: 'Resolved', label: 'Mark Resolved', color: '#10B981', icon: 'checkmark-circle' },
  ];

  useEffect(() => {
    fetchComplaintDetails();
  }, [complaintId]);

  const fetchComplaintDetails = async () => {
    try {
      const response = await employeeService.getComplaintDetails(complaintId);
      setComplaint(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load complaint details',
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a status',
      });
      return;
    }

    try {
      setUpdating(true);
      await employeeService.updateComplaintStatus(complaintId, selectedStatus, statusNotes);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Status updated successfully',
      });
      setShowStatusModal(false);
      setStatusNotes('');
      fetchComplaintDetails();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update status',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
        return '#8B5CF6';
      case 'InProgress':
        return '#F59E0B';
      case 'Resolved':
        return '#10B981';
      default:
        return Theme.Colors.neutral.gray400;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canUpdateStatus = () => {
    return complaint?.status === 'Assigned' || complaint?.status === 'InProgress';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Complaint not found</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Complaint Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.complaintId}>#{complaint._id.slice(-8).toUpperCase()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
              <Text style={styles.statusText}>{complaint.status}</Text>
            </View>
          </View>
          
          <Text style={styles.complaintTitle}>{complaint.subject}</Text>
          <Text style={styles.complaintDescription}>{complaint.description}</Text>
          
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color={Theme.Colors.primary.main} />
            <Text style={styles.infoText}>{complaint.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="calendar-outline" size={20} color={Theme.Colors.primary.main} />
            <Text style={styles.infoText}>Assigned: {formatDate(complaint.createdAt)}</Text>
          </View>
        </View>

        {/* Customer Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Icon name="person" size={24} color={Theme.Colors.primary.main} />
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{complaint.customerId?.name || 'Unknown'}</Text>
              <Text style={styles.customerContact}>{complaint.customerId?.phone}</Text>
              {complaint.customerId?.email && (
                <Text style={styles.customerContact}>{complaint.customerId?.email}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Information</Text>
          <View style={styles.serviceInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service:</Text>
              <Text style={styles.infoValue}>{complaint.serviceType?.serviceName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Priority:</Text>
              <Text style={styles.infoValue}>{complaint.servicePriority}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Amount:</Text>
              <Text style={styles.infoValue}>₹{complaint.pricing}</Text>
            </View>
          </View>
        </View>

        {/* Status Management */}
        {canUpdateStatus() && (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Update Status</Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => setShowStatusModal(true)}
              >
                <Icon name="create-outline" size={20} color={Theme.Colors.primary.main} />
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.statusHint}>
              {complaint.status === 'Assigned' 
                ? 'Start working on this complaint or mark it as resolved'
                : 'Mark this complaint as resolved when work is complete'
              }
            </Text>
          </View>
        )}

        {/* Status History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status History</Text>
          {complaint.statusHistory?.map((history, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={[styles.historyDot, { backgroundColor: getStatusColor(history.status) }]} />
              <View style={styles.historyContent}>
                <Text style={styles.historyStatus}>{history.status}</Text>
                <Text style={styles.historyDate}>{formatDate(history.timestamp)}</Text>
                {history.notes && (
                  <Text style={styles.historyNotes}>{history.notes}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status</Text>
            
            <View style={styles.statusList}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.statusItem,
                    selectedStatus === status.value && styles.selectedStatus
                  ]}
                  onPress={() => setSelectedStatus(status.value)}
                >
                  <Icon name={status.icon} size={24} color={status.color} />
                  <Text style={styles.statusLabel}>{status.label}</Text>
                  {selectedStatus === status.value && (
                    <Icon name="checkmark-circle" size={24} color={Theme.Colors.primary.main} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.notesInput}
              placeholder="Add notes about the work done (optional)"
              placeholderTextColor={Theme.Colors.neutral.gray400}
              value={statusNotes}
              onChangeText={setStatusNotes}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, updating && styles.disabledButton]}
                onPress={handleUpdateStatus}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color={Theme.Colors.neutral.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>Update</Text>
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Theme.Typography.fontSize.lg,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.md,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.md,
  },
  card: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  cardTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  complaintId: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statusBadge: {
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  complaintTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: Theme.Spacing.sm,
  },
  complaintDescription: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginBottom: Theme.Spacing.md,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  infoText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginLeft: Theme.Spacing.sm,
  },
  infoLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray700,
    fontFamily: Theme.Typography.fontFamily.semibold,
    width: 80,
  },
  infoValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
    flex: 1,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  customerContact: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  serviceInfo: {
    gap: Theme.Spacing.sm,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.Colors.primary.main,
  },
  updateButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginLeft: 4,
  },
  statusHint: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
    fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.Spacing.md,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: Theme.Spacing.sm,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  historyDate: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  historyNotes: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginTop: 2,
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
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.xxl,
  },
  modalTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: Theme.Spacing.lg,
    textAlign: 'center',
  },
  statusList: {
    marginBottom: Theme.Spacing.lg,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.sm,
    borderRadius: 8,
    marginBottom: Theme.Spacing.sm,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  selectedStatus: {
    borderColor: Theme.Colors.primary.main,
    backgroundColor: Theme.Colors.primary.lightest,
  },
  statusLabel: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
    flex: 1,
    marginLeft: Theme.Spacing.sm,
  },
  notesInput: {
    backgroundColor: Theme.Colors.neutral.gray50,
    borderRadius: 8,
    padding: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginBottom: Theme.Spacing.lg,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: Theme.Spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray300,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray700,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: Theme.Spacing.md,
    borderRadius: 8,
    backgroundColor: Theme.Colors.primary.main,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default EmployeeComplaintDetailScreen;
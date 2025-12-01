import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';
import complaintService from '../services/complaintService';
import Toast from 'react-native-toast-message';

const AdminComplaintsScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getAllComplaints();
      setComplaints(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load complaints',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return '#3B82F6';
      case 'InProgress':
        return '#F59E0B';
      case 'Resolved':
        return '#10B981';
      case 'Closed':
        return Theme.Colors.neutral.gray500;
      default:
        return Theme.Colors.neutral.gray400;
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'success':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return Theme.Colors.neutral.gray400;
    }
  };

  const getPaymentStatusText = (paymentStatus) => {
    switch (paymentStatus) {
      case 'success':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const renderComplaint = ({ item }) => (
    <TouchableOpacity
      style={styles.complaintCard}
      onPress={() => navigation.navigate('AdminComplaintDetail', { complaintId: item._id })}
    >
      <View style={styles.complaintHeader}>
        <Text style={styles.complaintId}>#{item._id.slice(-8).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.complaintTitle}>{item.subject}</Text>
      <Text style={styles.complaintDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      {/* Complaint Info Row */}
      <View style={styles.complaintInfo}>
        <View style={styles.infoItem}>
          <Icon name="card-outline" size={16} color={Theme.Colors.neutral.gray500} />
          <Text style={styles.infoLabel}>Payment:</Text>
          <View style={[
            styles.paymentBadge,
            { backgroundColor: getPaymentStatusColor(item.paymentStatus) }
          ]}>
            <Text style={styles.paymentText}>{getPaymentStatusText(item.paymentStatus)}</Text>
          </View>
        </View>
        
        {item.assignedTo && (
          <View style={styles.infoItem}>
            <Icon name="person-outline" size={16} color={Theme.Colors.neutral.gray500} />
            <Text style={styles.infoLabel}>Assigned:</Text>
            <Text style={styles.assignedText}>{item.assignedTo.name}</Text>
          </View>
        )}
      </View>

      <View style={styles.complaintFooter}>
        <View style={styles.customerInfo}>
          <Icon name="person-outline" size={16} color={Theme.Colors.neutral.gray500} />
          <Text style={styles.customerName}>{item.customerId?.name || 'Unknown'}</Text>
        </View>
        <Text style={styles.complaintDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={Theme.Colors.neutral.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Complaints ({complaints.length})</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    paddingHorizontal: Theme.Spacing.md,
    paddingBottom: Theme.Spacing.xl,
  },
  complaintCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
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
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: Theme.Spacing.xs,
  },
  complaintDescription: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginBottom: Theme.Spacing.md,
  },
  complaintInfo: {
    marginBottom: Theme.Spacing.sm,
    gap: Theme.Spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.xs,
  },
  infoLabel: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginLeft: 4,
    marginRight: Theme.Spacing.xs,
  },
  paymentBadge: {
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paymentText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  assignedText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.semibold,
    fontWeight: Theme.Typography.fontWeight.semibold,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Theme.Spacing.xs,
    paddingTop: Theme.Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.neutral.gray100,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerName: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginLeft: 4,
  },
  complaintDate: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});

export default AdminComplaintsScreen;

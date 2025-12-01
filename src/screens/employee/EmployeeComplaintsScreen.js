import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../assets/themes';
import employeeService from '../../services/employeeService';
import Toast from 'react-native-toast-message';

const EmployeeComplaintsScreen = ({ navigation, route }) => {
  const { filter } = route.params || {};
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter || '');

  const filterOptions = [
    { value: '', label: 'All', color: Theme.Colors.neutral.gray600 },
    { value: 'Assigned', label: 'New', color: '#8B5CF6' },
    { value: 'InProgress', label: 'In Progress', color: '#F59E0B' },
    { value: 'Resolved', label: 'Resolved', color: '#10B981' },
  ];

  const fetchComplaints = async () => {
    try {
      const response = await employeeService.getAssignedComplaints(selectedFilter);
      setComplaints(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load complaints',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComplaints();
  }, [selectedFilter]);

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

  const renderComplaint = ({ item }) => (
    <TouchableOpacity
      style={styles.complaintCard}
      onPress={() => navigation.navigate('EmployeeComplaintDetail', { complaintId: item._id })}
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
      
      <View style={styles.complaintInfo}>
        <View style={styles.infoItem}>
          <Icon name="business-outline" size={16} color={Theme.Colors.neutral.gray500} />
          <Text style={styles.infoText}>{item.serviceType?.serviceName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="person-outline" size={16} color={Theme.Colors.neutral.gray500} />
          <Text style={styles.infoText}>{item.customerId?.name || 'Unknown'}</Text>
        </View>
      </View>
      
      <View style={styles.complaintFooter}>
        <Text style={styles.complaintDate}>
          Assigned: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Icon name="chevron-forward" size={20} color={Theme.Colors.neutral.gray400} />
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={Theme.Colors.neutral.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Complaints ({complaints.length})</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterTabs}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterTab,
                  selectedFilter === option.value && styles.activeFilterTab,
                ]}
                onPress={() => setSelectedFilter(option.value)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    selectedFilter === option.value && styles.activeFilterTabText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Complaints List */}
      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Icon name="briefcase-outline" size={64} color={Theme.Colors.neutral.gray400} />
            <Text style={styles.emptyTitle}>No Complaints Found</Text>
            <Text style={styles.emptyText}>
              {selectedFilter 
                ? `No complaints with status "${filterOptions.find(f => f.value === selectedFilter)?.label}"`
                : 'No complaints assigned to you yet'
              }
            </Text>
          </View>
        )}
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
  filterContainer: {
    paddingHorizontal: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
  filterTab: {
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: 20,
    backgroundColor: Theme.Colors.neutral.gray100,
  },
  activeFilterTab: {
    backgroundColor: Theme.Colors.primary.main,
  },
  filterTabText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  activeFilterTabText: {
    color: Theme.Colors.neutral.white,
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
  },
  infoText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginLeft: Theme.Spacing.xs,
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
  complaintDate: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xxl,
  },
  emptyTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
  },
  emptyText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
    paddingHorizontal: Theme.Spacing.lg,
  },
});

export default EmployeeComplaintsScreen;
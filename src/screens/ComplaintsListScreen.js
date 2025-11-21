import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const ComplaintsListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with API call
  const [complaints] = useState([
    {
      id: 'AS20240728-001',
      title: 'Camera Not Recording',
      serviceType: 'CCTV',
      status: 'in_progress',
      date: '2024-07-28',
      priority: 'High',
      location: '123, Cyberpark, Kozhikode',
    },
    {
      id: 'AS20240727-045',
      title: 'GPS Device Offline',
      serviceType: 'GPS',
      status: 'pending',
      date: '2024-07-27',
      priority: 'Standard',
      location: 'Main Street, Kerala',
    },
    {
      id: 'AS20240726-032',
      title: 'Intercom System Issue',
      serviceType: 'Intercom',
      status: 'resolved',
      date: '2024-07-26',
      priority: 'High',
      location: 'Building A, Kochi',
    },
  ]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
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

  const getStatusLabel = status => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' || complaint.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Complaints</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('SelectService')}
        >
          <Icon name="add" size={24} color={Theme.Colors.neutral.white} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color={Theme.Colors.neutral.gray400}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search complaints..."
          placeholderTextColor={Theme.Colors.neutral.gray400}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon
              name="close-circle"
              size={20}
              color={Theme.Colors.neutral.gray400}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              selectedFilter === filter.id && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === filter.id && styles.filterTabTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Complaints List */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredComplaints.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon
              name="document-text-outline"
              size={64}
              color={Theme.Colors.neutral.gray300}
            />
            <Text style={styles.emptyStateText}>No complaints found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery
                ? 'Try adjusting your search'
                : 'Create your first complaint'}
            </Text>
          </View>
        ) : (
          filteredComplaints.map(complaint => (
            <TouchableOpacity
              key={complaint.id}
              style={styles.complaintCard}
              onPress={() =>
                navigation.navigate('ComplaintDetail', { complaint })
              }
              activeOpacity={0.7}
            >
              <View style={styles.complaintHeader}>
                <View style={styles.complaintHeaderLeft}>
                  <View
                    style={[
                      styles.serviceIcon,
                      { backgroundColor: Theme.Colors.primary.lightest },
                    ]}
                  >
                    <Icon
                      name={
                        complaint.serviceType === 'CCTV'
                          ? 'videocam'
                          : complaint.serviceType === 'GPS'
                          ? 'navigate'
                          : 'mic'
                      }
                      size={20}
                      color={Theme.Colors.primary.main}
                    />
                  </View>
                  <View>
                    <Text style={styles.complaintId}>{complaint.id}</Text>
                    <Text style={styles.serviceType}>
                      {complaint.serviceType}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${getStatusColor(complaint.status)}20`,
                    },
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

              <Text style={styles.complaintTitle}>{complaint.title}</Text>

              <View style={styles.complaintFooter}>
                <View style={styles.locationRow}>
                  <Icon
                    name="location-outline"
                    size={14}
                    color={Theme.Colors.neutral.gray500}
                  />
                  <Text style={styles.locationText}>{complaint.location}</Text>
                </View>
                <Text style={styles.dateText}>{complaint.date}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.md,
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    paddingHorizontal: Theme.Spacing.md,
    marginHorizontal: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.Spacing.sm,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  filterContainer: {
    marginBottom: Theme.Spacing.md,
  },
  filterContent: {
    paddingHorizontal: Theme.Spacing.lg,
  },
  filterTab: {
    paddingHorizontal: Theme.Spacing.lg - 8,
    paddingVertical: Theme.Spacing.sm,
    borderRadius: 8,
    height: 40,
    backgroundColor: Theme.Colors.neutral.white,
    marginRight: Theme.Spacing.sm - 4,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  filterTabActive: {
    backgroundColor: Theme.Colors.primary.main,
    borderColor: Theme.Colors.primary.main,
  },
  filterTabText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.neutral.gray800,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  filterTabTextActive: {
    color: Theme.Colors.neutral.white,
  },
  listContainer: {
    // flex: 1,
    paddingHorizontal: Theme.Spacing.lg,
  },
  complaintCard: {
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
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  complaintHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.sm,
  },
  complaintId: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  serviceType: {
    fontSize: Theme.Typography.fontSize.sm,
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
  complaintTitle: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    marginLeft: 4,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  dateText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.xxl * 2,
  },
  emptyStateText: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginTop: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  emptyStateSubtext: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    marginTop: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});

export default ComplaintsListScreen;

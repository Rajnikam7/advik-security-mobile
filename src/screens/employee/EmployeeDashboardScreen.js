import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../../assets/themes';
import employeeService from '../../services/employeeService';
import secureStorage from '../../utils/secureStorage';
import Toast from 'react-native-toast-message';

const EmployeeDashboardScreen = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await employeeService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load dashboard',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      const userData = await secureStorage.getUserData();
      setUserInfo(userData);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    loadUserInfo();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.Colors.primary.main} />
      </View>
    );
  }

  const { statistics, assignedComplaints, recentResolved } = dashboardData || {};

  return (
    <LinearGradient
      colors={[Theme.Colors.neutral.white, Theme.Colors.background.light]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Employee Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Welcome, {userInfo?.name || 'Employee'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('EmployeeSettings')}
        >
          <Icon
            name="settings-outline"
            size={24}
            color={Theme.Colors.neutral.gray900}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('EmployeeComplaints')}
          >
            <LinearGradient
              colors={[Theme.Colors.primary.main, Theme.Colors.primary.dark || '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <View style={styles.statContent}>
                <View style={styles.statTop}>
                  <Icon name="briefcase-outline" size={24} color={Theme.Colors.neutral.white} />
                  <Text style={styles.statValue}>{statistics?.totalAssigned || 0}</Text>
                </View>
                <Text style={styles.statLabel}>Total Assigned</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('EmployeeComplaints', { filter: 'InProgress' })}
          >
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <View style={styles.statContent}>
                <View style={styles.statTop}>
                  <Icon name="time-outline" size={24} color={Theme.Colors.neutral.white} />
                  <Text style={styles.statValue}>{statistics?.inProgress || 0}</Text>
                </View>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('EmployeeComplaints', { filter: 'Resolved' })}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <View style={styles.statContent}>
                <View style={styles.statTop}>
                  <Icon name="checkmark-circle-outline" size={24} color={Theme.Colors.neutral.white} />
                  <Text style={styles.statValue}>{statistics?.resolved || 0}</Text>
                </View>
                <Text style={styles.statLabel}>Resolved</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Assigned Complaints */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Assignments</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('EmployeeComplaints')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {assignedComplaints?.slice(0, 3).map((complaint) => (
            <TouchableOpacity
              key={complaint._id}
              style={styles.complaintCard}
              onPress={() => navigation.navigate('EmployeeComplaintDetail', { complaintId: complaint._id })}
            >
              <View style={styles.complaintHeader}>
                <Text style={styles.complaintId}>#{complaint._id.slice(-8).toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
                  <Text style={styles.statusText}>{complaint.status}</Text>
                </View>
              </View>
              <Text style={styles.complaintTitle}>{complaint.subject}</Text>
              <Text style={styles.customerName}>
                Customer: {complaint.customerId?.name || 'Unknown'}
              </Text>
            </TouchableOpacity>
          ))}

          {(!assignedComplaints || assignedComplaints.length === 0) && (
            <View style={styles.emptyState}>
              <Icon name="briefcase-outline" size={48} color={Theme.Colors.neutral.gray400} />
              <Text style={styles.emptyText}>No complaints assigned yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.md,
    paddingTop: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    marginTop: 4,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
    marginBottom: Theme.Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statGradient: {
    borderRadius: 16,
    padding: Theme.Spacing.md,
    height: 110,
    justifyContent: 'space-between',
  },
  statContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.Spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.semibold,
    opacity: 0.9,
  },
  section: {
    marginBottom: Theme.Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  viewAllText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.lg,
    alignItems: 'center',
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginTop: Theme.Spacing.sm,
    textAlign: 'center',
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
    marginBottom: Theme.Spacing.xs,
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
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginBottom: Theme.Spacing.xs,
  },
  customerName: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl,
  },
  emptyText: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginTop: Theme.Spacing.sm,
  },
});

export default EmployeeDashboardScreen;
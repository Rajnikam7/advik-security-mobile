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
import { Theme } from '../assets/themes';
import adminService from '../services/adminService';
import secureStorage from '../utils/secureStorage';
import Toast from 'react-native-toast-message';

const AdminDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
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
    fetchDashboardStats();
    loadUserInfo();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardStats();
  }, []);

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
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Welcome, {userInfo?.name || 'Administrator'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AdminSettings')}
          >
            <Icon
              name="settings-outline"
              size={24}
              color={Theme.Colors.neutral.gray900}
            />
          </TouchableOpacity>
        </View>
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
          {/* Users Card */}
          <TouchableOpacity
            style={[styles.statCard, styles.usersCard]}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <View style={styles.statIconContainer}>
              <Icon name="people" size={28} color={Theme.Colors.primary.main} />
            </View>
            <Text style={styles.statValue}>{stats?.users?.total || 0}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
            <View style={styles.statDetails}>
              <Text style={styles.statDetailText}>
                Customers: {stats?.users?.customers || 0}
              </Text>
              <Text style={styles.statDetailText}>
                Employees: {stats?.users?.employees || 0}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Complaints Card */}
          <TouchableOpacity
            style={[styles.statCard, styles.complaintsCard]}
            onPress={() => navigation.navigate('AdminComplaints')}
          >
            <View style={styles.statIconContainer}>
              <Icon
                name="document-text"
                size={28}
                color={Theme.Colors.primary.main}
              />
            </View>
            <Text style={styles.statValue}>
              {stats?.complaints?.total || 0}
            </Text>
            <Text style={styles.statLabel}>Total Complaints</Text>
            <View style={styles.statDetails}>
              <Text style={styles.statDetailText}>
                Open: {stats?.complaints?.open || 0}
              </Text>
              <Text style={styles.statDetailText}>
                In Progress: {stats?.complaints?.inProgress || 0}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Status Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complaint Status</Text>
          <View style={styles.statusGrid}>
            <View style={[styles.statusCard, styles.openStatus]}>
              <Text style={styles.statusValue}>
                {stats?.complaints?.open || 0}
              </Text>
              <Text style={styles.statusLabel}>Open</Text>
            </View>
            <View style={[styles.statusCard, styles.progressStatus]}>
              <Text style={styles.statusValue}>
                {stats?.complaints?.inProgress || 0}
              </Text>
              <Text style={styles.statusLabel}>In Progress</Text>
            </View>
            <View style={[styles.statusCard, styles.resolvedStatus]}>
              <Text style={styles.statusValue}>
                {stats?.complaints?.resolved || 0}
              </Text>
              <Text style={styles.statusLabel}>Resolved</Text>
            </View>
            <View style={[styles.statusCard, styles.closedStatus]}>
              <Text style={styles.statusValue}>
                {stats?.complaints?.closed || 0}
              </Text>
              <Text style={styles.statusLabel}>Closed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AdminUsers')}
            >
              <Icon
                name="people-outline"
                size={32}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.actionLabel}>Manage Users</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AdminComplaints')}
            >
              <Icon
                name="list-outline"
                size={32}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.actionLabel}>View Complaints</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AdminSettings')}
            >
              <Icon
                name="settings-outline"
                size={32}
                color={Theme.Colors.primary.main}
              />
              <Text style={styles.actionLabel}>Settings</Text>
            </TouchableOpacity>
          </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
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
    gap: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.md,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  statValue: {
    fontSize: 32,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginBottom: Theme.Spacing.sm,
  },
  statDetails: {
    marginTop: Theme.Spacing.xs,
  },
  statDetailText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginBottom: 2,
  },
  section: {
    marginBottom: Theme.Spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginBottom: Theme.Spacing.md,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.sm,
  },
  statusCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
  },
  openStatus: {
    borderColor: '#3B82F6',
  },
  progressStatus: {
    borderColor: '#F59E0B',
  },
  resolvedStatus: {
    borderColor: '#10B981',
  },
  closedStatus: {
    borderColor: Theme.Colors.neutral.gray400,
  },
  statusValue: {
    fontSize: 28,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  statusLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.Spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
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
});

export default AdminDashboardScreen;

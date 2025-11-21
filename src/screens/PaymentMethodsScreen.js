import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const PaymentMethodsScreen = ({ navigation }) => {
  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      name: 'Visa',
      number: '**** **** **** 4532',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'card',
      name: 'Mastercard',
      number: '**** **** **** 8765',
      expiry: '08/26',
      isDefault: false,
    },
    {
      id: 3,
      type: 'upi',
      name: 'Google Pay',
      number: 'advik@okaxis',
      isDefault: false,
    },
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
          <Icon
            name="arrow-back"
            size={24}
            color={Theme.Colors.neutral.gray900}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Methods List */}
        {paymentMethods.map(method => (
          <View key={method.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View
                style={[
                  styles.paymentIcon,
                  method.type === 'upi' && styles.upiIcon,
                ]}
              >
                <Icon
                  name={method.type === 'card' ? 'card' : 'wallet'}
                  size={24}
                  color={Theme.Colors.neutral.white}
                />
              </View>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentTitleRow}>
                  <Text style={styles.paymentName}>{method.name}</Text>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.paymentNumber}>{method.number}</Text>
                {method.expiry && (
                  <Text style={styles.paymentExpiry}>
                    Expires {method.expiry}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.paymentActions}>
              {!method.isDefault && (
                <TouchableOpacity style={styles.actionButton}>
                  <Icon
                    name="checkmark-circle-outline"
                    size={18}
                    color={Theme.Colors.primary.main}
                  />
                  <Text style={styles.actionButtonText}>Set as Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="trash-outline" size={18} color="#EF4444" />
                <Text style={[styles.actionButtonText, styles.deleteText]}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Add Payment Method Buttons */}
        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>Add New Payment Method</Text>

          <TouchableOpacity style={styles.addButton}>
            <View style={styles.addButtonIcon}>
              <Icon
                name="card-outline"
                size={24}
                color={Theme.Colors.primary.main}
              />
            </View>
            <View style={styles.addButtonContent}>
              <Text style={styles.addButtonTitle}>Add Credit/Debit Card</Text>
              <Text style={styles.addButtonSubtitle}>
                Visa, Mastercard, RuPay
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={20}
              color={Theme.Colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton}>
            <View style={styles.addButtonIcon}>
              <Icon
                name="wallet-outline"
                size={24}
                color={Theme.Colors.primary.main}
              />
            </View>
            <View style={styles.addButtonContent}>
              <Text style={styles.addButtonTitle}>Add UPI ID</Text>
              <Text style={styles.addButtonSubtitle}>
                Google Pay, PhonePe, Paytm
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={20}
              color={Theme.Colors.neutral.gray400}
            />
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.lg,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.md,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Theme.Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  upiIcon: {
    backgroundColor: '#10B981',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentName: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginRight: Theme.Spacing.sm,
  },
  defaultBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: '#16A34A',
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  paymentNumber: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray600,
    marginBottom: 4,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  paymentExpiry: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  paymentActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.neutral.gray200,
    paddingTop: Theme.Spacing.sm,
    gap: Theme.Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.xs,
  },
  actionButtonText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.primary.main,
    marginLeft: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  deleteText: {
    color: '#EF4444',
  },
  addSection: {
    marginTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.xl,
  },
  addSectionTitle: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.Colors.primary.main,
  },
  addButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  addButtonContent: {
    flex: 1,
  },
  addButtonTitle: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  addButtonSubtitle: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
});

export default PaymentMethodsScreen;

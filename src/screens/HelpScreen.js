import React, { useState } from 'react';
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

const HelpScreen = ({ navigation }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I file a complaint?',
      answer:
        'Tap on "New Complaint" from the home screen, select your service type, fill in the details, and submit. You will receive a complaint ID for tracking.',
    },
    {
      id: 2,
      question: 'How long does it take to resolve a complaint?',
      answer:
        'Resolution time depends on the priority level. High priority complaints are typically resolved within 24 hours, while standard complaints may take 2-3 business days.',
    },
    {
      id: 3,
      question: 'Can I track my complaint status?',
      answer:
        'Yes! Go to the Complaints tab to view all your complaints and their current status. You can also click on any complaint to see detailed timeline.',
    },
    {
      id: 4,
      question: 'How do I add a new property?',
      answer:
        'Go to Profile > My Properties > Add New Property. Fill in the property details and select the services you need.',
    },
    {
      id: 5,
      question: 'What payment methods are accepted?',
      answer:
        'We accept all major credit/debit cards (Visa, Mastercard, RuPay) and UPI payments (Google Pay, PhonePe, Paytm).',
    },
  ];

  const contactOptions = [
    {
      id: 'phone',
      icon: 'call',
      title: 'Phone Support',
      subtitle: '+91 1800-123-4567',
      action: 'Call Now',
    },
    {
      id: 'email',
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'support@adviksecurity.com',
      action: 'Send Email',
    },
    {
      id: 'chat',
      icon: 'chatbubbles',
      title: 'Live Chat',
      subtitle: 'Available 24/7',
      action: 'Start Chat',
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Options */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        {contactOptions.map(option => (
          <TouchableOpacity key={option.id} style={styles.contactCard}>
            <View style={styles.contactIcon}>
              <Icon
                name={option.icon}
                size={24}
                color={Theme.Colors.primary.main}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{option.title}</Text>
              <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
            </View>
            <View style={styles.contactAction}>
              <Text style={styles.contactActionText}>{option.action}</Text>
              <Icon
                name="chevron-forward"
                size={20}
                color={Theme.Colors.primary.main}
              />
            </View>
          </TouchableOpacity>
        ))}

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map(faq => (
          <View key={faq.id} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() =>
                setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
              }
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Icon
                name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Theme.Colors.neutral.gray600}
              />
            </TouchableOpacity>
            {expandedFaq === faq.id && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </View>
        ))}

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <TouchableOpacity style={styles.linkCard}>
          <Icon
            name="document-text-outline"
            size={20}
            color={Theme.Colors.primary.main}
          />
          <Text style={styles.linkText}>Terms & Conditions</Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={Theme.Colors.neutral.gray400}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkCard}>
          <Icon
            name="shield-outline"
            size={20}
            color={Theme.Colors.primary.main}
          />
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={Theme.Colors.neutral.gray400}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkCard}>
          <Icon
            name="information-circle-outline"
            size={20}
            color={Theme.Colors.primary.main}
          />
          <Text style={styles.linkText}>About Us</Text>
          <Icon
            name="chevron-forward"
            size={20}
            color={Theme.Colors.neutral.gray400}
          />
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginTop: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  contactSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  contactAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactActionText: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.primary.main,
    marginRight: 4,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  faqCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginRight: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  faqAnswer: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    marginTop: Theme.Spacing.sm,
    lineHeight: 20,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.sm,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  linkText: {
    flex: 1,
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.medium,
    color: Theme.Colors.neutral.gray900,
    marginLeft: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
});

export default HelpScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';
import Config from 'react-native-config';

const ProductsScreen = ({ navigation }) => {
  const products = [
    {
      id: 1,
      name: 'GPS tracking security',
      status: 'Stock',
      price: '₹3,500.00',
      originalPrice: '₹3,590.00',
      icon: 'navigate',
      iconColor: '#3B82F6',
    },
    {
      id: 2,
      name: 'Hikvision Smart IP Bullet',
      price: null,
      icon: 'videocam',
      iconColor: '#EF4444',
    },
    {
      id: 3,
      name: 'Hikvision PTZ 10X Zoom',
      price: null,
      icon: 'scan',
      iconColor: '#8B5CF6',
    },
    {
      id: 4,
      name: 'Cp Plus 360° 4G camera',
      price: '₹5,800.00',
      icon: 'camera',
      iconColor: '#F59E0B',
    },
    {
      id: 5,
      name: 'Hikvision IP Camera',
      price: '₹4,000.00',
      icon: 'videocam',
      iconColor: '#10B981',
    },
    {
      id: 6,
      name: 'Biometric Attendance',
      price: '₹7,999.00',
      icon: 'finger-print',
      iconColor: '#6366F1',
    },
    {
      id: 7,
      name: 'CCTV camera services',
      subtitle: 'Advik Enterprises',
      price: '₹0.00',
      icon: 'shield-checkmark',
      iconColor: '#14B8A6',
    },
    {
      id: 8,
      name: 'Hikvision camera',
      subtitle: 'Advik Enterprises',
      price: '₹0.00',
      icon: 'camera',
      iconColor: '#EC4899',
    },
    {
      id: 9,
      name: 'LED SMART TV',
      price: '₹9,999.00',
      icon: 'tv',
      iconColor: '#06B6D4',
    },
  ];

  const handleWhatsAppEnquiry = () => {
    const phoneNumber = Config.WHATSAPP_ENQUIRY_NUMBER || '+917798742157';
    const message = 'Hello, I would like to enquire about your products.';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log('WhatsApp is not installed');
        }
      })
      .catch((err) => console.error('Error opening WhatsApp:', err));
  };

  const renderProductCard = (product) => (
    <View key={product.id} style={styles.productCard}>
      <View style={[styles.productIconContainer, { backgroundColor: product.iconColor + '20' }]}>
        <Icon name={product.icon} size={32} color={product.iconColor} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.subtitle && (
          <Text style={styles.productSubtitle}>{product.subtitle}</Text>
        )}
        {product.status && (
          <Text style={styles.productStatus}>{product.status}</Text>
        )}
        {product.price && (
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.Colors.primary.main, Theme.Colors.primary.dark]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color={Theme.Colors.neutral.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Catalog</Text>
          {/* <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="cart-outline" size={24} color={Theme.Colors.neutral.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Icon name="link-outline" size={24} color={Theme.Colors.neutral.white} />
            </TouchableOpacity>
          </View> */}
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {products.map(renderProductCard)}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Looking for something else? Message advik enterprises.
          </Text>
        </View>
      </ScrollView>

      {/* Floating WhatsApp Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleWhatsAppEnquiry}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#25D366', '#128C7E']}
          style={styles.floatingButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="logo-whatsapp" size={24} color={Theme.Colors.neutral.white} />
          <Text style={styles.floatingButtonText}>Enquiry Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.Colors.neutral.gray900,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: Theme.Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
    flex: 1,
    marginLeft: Theme.Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
  headerIcon: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Theme.Colors.neutral.gray800,
    marginHorizontal: Theme.Spacing.md,
    marginTop: Theme.Spacing.md,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    alignItems: 'center',
  },
  productIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: Theme.Spacing.md,
  },
  productName: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.semibold,
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray400,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginBottom: 4,
  },
  productStatus: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray400,
    fontFamily: Theme.Typography.fontFamily.regular,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPrice: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  originalPrice: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
    textDecorationLine: 'line-through',
  },
  footer: {
    padding: Theme.Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray400,
    textAlign: 'center',
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 12,
  },
  floatingButtonText: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});

export default ProductsScreen;

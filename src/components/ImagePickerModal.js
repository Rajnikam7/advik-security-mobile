import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Theme } from '../assets/themes';

const ImagePickerModal = ({ visible, onClose, onCamera, onGallery }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Photo</Text>
            <Text style={styles.subtitle}>
              Choose how you want to add a photo
            </Text>
          </View>

          <TouchableOpacity style={styles.option} onPress={onCamera}>
            <View style={styles.iconContainer}>
              <Icon name="camera" size={28} color={Theme.Colors.primary.main} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionSubtitle}>
                Use your camera to take a photo
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={24}
              color={Theme.Colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onGallery}>
            <View style={styles.iconContainer}>
              <Icon
                name="images"
                size={28}
                color={Theme.Colors.primary.main}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionSubtitle}>
                Select photos from your gallery
              </Text>
            </View>
            <Icon
              name="chevron-forward"
              size={24}
              color={Theme.Colors.neutral.gray400}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  header: {
    marginBottom: Theme.Spacing.lg,
  },
  title: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 4,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  optionSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  cancelButton: {
    backgroundColor: Theme.Colors.neutral.gray100,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
    marginTop: Theme.Spacing.sm,
  },
  cancelText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray700,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
});

export default ImagePickerModal;

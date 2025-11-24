import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { Theme } from '../assets/themes';
import complaintService from '../services/complaintService';

const FileComplaintScreen = ({ navigation, route }) => {
  const { 
    serviceType = 'CCTV', 
    serviceId = null,
    servicePriorities = []
  } = route.params || {};
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('123 Main St, Anytown');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      selectionLimit: 5 - selectedImages.length,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets) {
        const newImages = response.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
        }));
        setSelectedImages([...selectedImages, ...newImages]);
      }
    });
  };

  const handleRemoveImage = index => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      setShowPriorityModal(true);
    }
  };

  const handlePrioritySelect = priority => {
    setSelectedPriority(priority);
  };

  const handleReviewAndPay = () => {
    if (selectedPriority) {
      setShowPriorityModal(false);
      setTimeout(() => setShowSummaryModal(true), 300);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      setSubmitting(true);
      setShowSummaryModal(false);

      const priorityDetails = getPriorityDetails();
      if (!priorityDetails) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Invalid priority selected',
        });
        return;
      }

      const complaintData = {
        serviceType: serviceId,
        servicePriority: priorityDetails.servicePriority,
        subject: title,
        description: description,
        location: location,
        images: selectedImages,
      };

      const response = await complaintService.createComplaint(complaintData);
      
      if (response.data) {
        setComplaintId(response.data._id);
        
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Complaint created successfully',
        });

        setTimeout(() => setShowSuccessModal(true), 300);
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to create complaint',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackComplaint = () => {
    setShowSuccessModal(false);
    navigation.navigate('Complaints', {
      screen: 'ComplaintsList',
    });
  };

  const handleBackToHome = () => {
    setShowSuccessModal(false);
    navigation.navigate('Home');
  };

  const getPriorityDetails = () => {
    if (!selectedPriority) return null;
    const priority = servicePriorities.find(p => p._id === selectedPriority);
    return priority || null;
  };

  const getResponseTime = (priorityName) => {
    const responseTimeMap = {
      'Standard': '24-48 hours',
      'Express': '12-24 hours',
      'Urgent': '1-4 hours',
    };
    return responseTimeMap[priorityName] || '24 hours';
  };

  const isFormValid = title.trim() && description.trim() && location.trim();

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
        <Text style={styles.headerTitle}>File a {serviceType} Complaint</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Camera offline in the backyard"
            placeholderTextColor={Theme.Colors.neutral.gray400}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Describe the Issue in Detail</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide as much detail as possible..."
            placeholderTextColor={Theme.Colors.neutral.gray400}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Service Location */}
        <View style={styles.section}>
          <Text style={styles.label}>Service Location</Text>
          <View style={styles.locationInput}>
            <TextInput
              style={styles.locationText}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor={Theme.Colors.neutral.gray400}
            />
            <Icon
              name="checkmark-circle"
              size={24}
              color={Theme.Colors.primary.main}
            />
          </View>
        </View>

        {/* Attach Images */}
        <View style={styles.section}>
          <Text style={styles.label}>Attach Relevant Images</Text>
          <Text style={styles.helperText}>
            You can add up to 5 photos. ({selectedImages.length}/5)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imageGrid}>
              {selectedImages.length < 5 && (
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={handleImagePicker}
                >
                  <Icon
                    name="add-outline"
                    size={32}
                    color={Theme.Colors.neutral.gray400}
                  />
                  <Text style={styles.addImageText}>Add Photo</Text>
                </TouchableOpacity>
              )}
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Icon
                      name="close-circle"
                      size={24}
                      color={Theme.Colors.neutral.white}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>Submit Complaint</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Priority Modal */}
      <Modal
        visible={showPriorityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPriorityModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Service Priority</Text>
                <Text style={styles.modalSubtitle}>
                  Select the response time for your complaint.
                </Text>
              </View>

              {/* Dynamic Priority Options */}
              {servicePriorities.length > 0 ? (
                servicePriorities.map((priority, index) => (
                  <TouchableOpacity
                    key={priority._id}
                    style={[
                      styles.priorityOption,
                      index > 0 && styles.standardOption,
                      selectedPriority === priority._id && 
                        (index === servicePriorities.length - 1 ? styles.prioritySelected : styles.standardSelected),
                    ]}
                    onPress={() => handlePrioritySelect(priority._id)}
                  >
                    <View style={styles.priorityLeft}>
                      <View style={styles.priorityTitleRow}>
                        <Text style={styles.priorityTitle}>
                          {priority.servicePriority} Service
                        </Text>
                        {index === servicePriorities.length - 1 && (
                          <View style={styles.fastestBadge}>
                            <Text style={styles.fastestText}>Fastest</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.prioritySubtitle}>
                        Response within {getResponseTime(priority.servicePriority)}
                      </Text>
                    </View>
                    <View style={styles.priorityRight}>
                      <Text style={styles.priorityPrice}>₹{priority.pricing}</Text>
                      <View
                        style={[
                          index === servicePriorities.length - 1 ? styles.radioButton : styles.radioButtonOutline,
                          selectedPriority === priority._id && styles.radioButtonSelected,
                        ]}
                      >
                        {selectedPriority === priority._id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noPrioritiesContainer}>
                  <Text style={styles.noPrioritiesText}>
                    No service priorities available
                  </Text>
                </View>
              )}

              {/* Review and Pay Button */}
              <TouchableOpacity
                style={[
                  styles.reviewButton,
                  !selectedPriority && styles.reviewButtonDisabled,
                ]}
                onPress={handleReviewAndPay}
                disabled={!selectedPriority}
              >
                <Text style={styles.reviewButtonText}>Review and Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Summary Modal */}
      <Modal
        visible={showSummaryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSummaryModal(false)}
      >
        <View style={styles.summaryModalOverlay}>
          <View style={styles.summaryModalContent}>
            {/* Header */}
            <View style={styles.summaryHeader}>
              <TouchableOpacity
                style={styles.summaryBackButton}
                onPress={() => setShowSummaryModal(false)}
              >
                <Icon
                  name="arrow-back"
                  size={24}
                  color={Theme.Colors.neutral.gray900}
                />
              </TouchableOpacity>
              <Text style={styles.summaryHeaderTitle}>Complaint Summary</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView
              style={styles.summaryScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Service Type Card */}
              <View style={styles.summaryCard}>
                <View style={styles.serviceTypeRow}>
                  <View style={styles.serviceIconContainer}>
                    <Icon
                      name="videocam"
                      size={28}
                      color={Theme.Colors.primary.main}
                    />
                  </View>
                  <View>
                    <Text style={styles.serviceTypeLabel}>Service Type</Text>
                    <Text style={styles.serviceTypeValue}>{serviceType}</Text>
                  </View>
                </View>

                <Text style={styles.complaintTitle}>{title}</Text>
                <Text style={styles.complaintDescription}>{description}</Text>

                <View style={styles.locationRow}>
                  <Icon
                    name="location"
                    size={20}
                    color={Theme.Colors.primary.main}
                  />
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.locationLabel}>Location</Text>
                    <Text style={styles.locationValue}>{location}</Text>
                  </View>
                </View>

                {selectedImages.length > 0 && (
                  <View style={styles.attachedImagesSection}>
                    <Text style={styles.attachedImagesLabel}>
                      Attached Images
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={styles.summaryImageGrid}>
                        {selectedImages.map((image, index) => (
                          <Image
                            key={index}
                            source={{ uri: image.uri }}
                            style={styles.summaryImage}
                          />
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Cost Breakdown */}
              {getPriorityDetails() && (
                <View style={styles.costCard}>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Priority</Text>
                    <Text style={styles.costValue}>
                      {getPriorityDetails().servicePriority} Service
                    </Text>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Service Cost</Text>
                    <Text style={styles.costValue}>
                      ₹{getPriorityDetails().pricing}.00
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalAmount}>
                      ₹{getPriorityDetails().pricing}.00
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Proceed Button */}
            <View style={styles.summaryFooter}>
              <TouchableOpacity
                style={[styles.proceedButton, submitting && styles.proceedButtonDisabled]}
                onPress={handleProceedToPayment}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Theme.Colors.neutral.white} />
                ) : (
                  <Text style={styles.proceedButtonText}>Submit Complaint</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <View style={styles.successIconCircle}>
                <Icon
                  name="checkmark"
                  size={48}
                  color={Theme.Colors.primary.main}
                />
              </View>
            </View>

            {/* Success Message */}
            <Text style={styles.successTitle}>Complaint Submitted!</Text>
            <Text style={styles.successMessage}>
              Your complaint has been successfully received. Our team will look
              into it shortly.
            </Text>

            {/* Complaint Details */}
            <View style={styles.successDetailsCard}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>COMPLAINT ID</Text>
                <Text style={styles.successDetailValue}>
                  {complaintId ? `#${complaintId.slice(-8).toUpperCase()}` : 'N/A'}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>
                  ESTIMATED RESOLUTION
                </Text>
                <Text style={styles.successDetailValue}>
                  {getPriorityDetails() ? getResponseTime(getPriorityDetails().servicePriority) : '2-3 Business Days'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.trackComplaintButton}
              onPress={handleTrackComplaint}
            >
              <Text style={styles.trackComplaintButtonText}>
                Track Complaint
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToHomeButton}
              onPress={handleBackToHome}
            >
              <Text style={styles.backToHomeButtonText}>Back to Home</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.sm,
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
  section: {
    marginBottom: Theme.Spacing.md + 2,
  },
  label: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm - 2,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  helperText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  input: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 8,
    padding: Theme.Spacing.sm + 4,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray300,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  textArea: {
    height: 90,
    paddingTop: Theme.Spacing.md - 4,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 8,
    paddingHorizontal: Theme.Spacing.md,
    paddingVertical: Theme.Spacing.sm - 8,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray300,
  },
  locationText: {
    flex: 1,
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  imageGrid: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
    paddingRight: Theme.Spacing.md,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.Colors.neutral.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
  },
  addImageText: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray500,
    marginTop: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  placeholderText: {
    color: Theme.Colors.neutral.gray400,
  },
  submitButton: {
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 8,
    paddingVertical: Theme.Spacing.md - 4,
    alignItems: 'center',
    marginTop: Theme.Spacing.sm - 8,
    marginBottom: Theme.Spacing.xl,
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: Theme.Colors.primary.lighter,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: Theme.Colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.xl,
    paddingBottom: Theme.Spacing.xxl,
  },
  modalHeader: {
    marginBottom: Theme.Spacing.lg,
  },
  modalTitle: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  modalSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  priorityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.md,
    borderWidth: 2,
    borderColor: '#FFB84D',
    shadowColor: Theme.Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  standardOption: {
    borderColor: Theme.Colors.neutral.gray300,
  },
  priorityLeft: {
    flex: 1,
  },
  priorityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.xs,
  },
  priorityTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
    marginRight: Theme.Spacing.sm,
  },
  fastestBadge: {
    backgroundColor: '#FFE5B4',
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fastestText: {
    fontSize: Theme.Typography.fontSize.xs,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: '#D97706',
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  prioritySubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  priorityRight: {
    alignItems: 'flex-end',
  },
  priorityPrice: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFB84D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFB84D',
  },
  radioButtonOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Theme.Colors.neutral.gray300,
  },
  radioButtonSelected: {
    borderColor: '#FFB84D',
  },
  prioritySelected: {
    borderColor: '#FFB84D',
  },
  standardSelected: {
    borderColor: Theme.Colors.primary.main,
  },
  reviewButton: {
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
    marginTop: Theme.Spacing.sm,
  },
  reviewButtonDisabled: {
    backgroundColor: Theme.Colors.primary.lighter,
  },
  reviewButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  noPrioritiesContainer: {
    padding: Theme.Spacing.xl,
    alignItems: 'center',
  },
  noPrioritiesText: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray500,
    fontFamily: Theme.Typography.fontFamily.regular,
    textAlign: 'center',
  },
  summaryModalOverlay: {
    flex: 1,
    backgroundColor: Theme.Colors.neutral.white,
  },
  summaryModalContent: {
    flex: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.md,
    paddingTop: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral.gray200,
  },
  summaryBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryHeaderTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  summaryScrollView: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.lg,
    paddingTop: Theme.Spacing.md,
  },
  summaryCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  serviceTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },
  serviceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.Spacing.md,
  },
  serviceTypeLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray500,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  serviceTypeValue: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  complaintTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.xs,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  complaintDescription: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    lineHeight: 20,
    marginBottom: Theme.Spacing.md,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.Spacing.md,
  },
  locationTextContainer: {
    marginLeft: Theme.Spacing.sm,
    flex: 1,
  },
  locationLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 2,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  locationValue: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  attachedImagesSection: {
    marginTop: Theme.Spacing.sm,
  },
  attachedImagesLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  summaryImageGrid: {
    flexDirection: 'row',
    gap: Theme.Spacing.sm,
  },
  summaryImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  costCard: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 16,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.xl,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral.gray200,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  costLabel: {
    fontSize: Theme.Typography.fontSize.md,
    color: Theme.Colors.neutral.gray600,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  costValue: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.Colors.neutral.gray200,
    marginVertical: Theme.Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Theme.Spacing.xs,
  },
  totalLabel: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  totalAmount: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  summaryFooter: {
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.neutral.gray200,
    backgroundColor: Theme.Colors.neutral.white,
  },
  proceedButton: {
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  proceedButtonDisabled: {
    opacity: 0.6,
  },
  proceedButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.Spacing.lg,
  },
  successModalContent: {
    backgroundColor: Theme.Colors.neutral.white,
    borderRadius: 24,
    padding: Theme.Spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: Theme.Spacing.lg,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.Colors.primary.lightest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: Theme.Typography.fontSize.xxl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    marginBottom: Theme.Spacing.sm,
    textAlign: 'center',
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  successMessage: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.neutral.gray800,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Theme.Spacing.lg,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  successDetailsCard: {
    width: '100%',
    backgroundColor: Theme.Colors.neutral.gray50,
    borderRadius: 12,
    padding: Theme.Spacing.md,
    marginBottom: Theme.Spacing.lg,
  },
  successDetailRow: {
    marginBottom: Theme.Spacing.sm,
  },
  successDetailLabel: {
    fontSize: Theme.Typography.fontSize.xs,
    color: Theme.Colors.neutral.gray900,
    marginBottom: 4,
    fontFamily: Theme.Typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  successDetailValue: {
    fontSize: Theme.Typography.fontSize.md,
    // fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.gray900,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  trackComplaintButton: {
    width: '100%',
    backgroundColor: Theme.Colors.primary.main,
    borderRadius: 12,
    paddingVertical: Theme.Spacing.md,
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
    shadowColor: Theme.Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  trackComplaintButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.neutral.white,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  backToHomeButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: Theme.Spacing.sm + 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.Colors.primary.main,
  },
  backToHomeButtonText: {
    fontSize: Theme.Typography.fontSize.md,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.primary.main,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
});

export default FileComplaintScreen;

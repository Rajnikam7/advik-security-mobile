import api from './api';

class ComplaintService {
  // Create a new complaint
  async createComplaint(complaintData) {
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('serviceType', complaintData.serviceType);
      formData.append('servicePriority', complaintData.servicePriority);
      formData.append('subject', complaintData.subject);
      formData.append('description', complaintData.description);
      formData.append('location', complaintData.location);
      
      // Append images if any
      if (complaintData.images && complaintData.images.length > 0) {
        complaintData.images.forEach((image, index) => {
          formData.append('attachmentUrl', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.fileName || `image_${index}.jpg`,
          });
        });
      }

      const response = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Create complaint error:', error);
      throw this.handleError(error);
    }
  }

  // Get user complaints
  async getUserComplaints() {
    try {
      const response = await api.get('/complaints');
      return response.data;
    } catch (error) {
      console.error('Get complaints error:', error);
      throw this.handleError(error);
    }
  }

  // Get complaint by ID
  async getComplaintById(complaintId) {
    try {
      const response = await api.get(`/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error('Get complaint error:', error);
      throw this.handleError(error);
    }
  }

  // Update payment status
  async updatePaymentStatus(complaintId, paymentData) {
    try {
      const response = await api.patch(
        `/complaints/${complaintId}/payment`,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error('Update payment error:', error);
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
      };
    }
    return {
      message: error.message || 'Network error. Please check your connection',
    };
  }
}

export default new ComplaintService();

import api from './api';

class ServiceTypeService {
  // Get all service types
  async getServiceTypes() {
    try {
      const response = await api.get('/service-types');
      return response.data;
    } catch (error) {
      console.error('Get service types error:', error);
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

export default new ServiceTypeService();

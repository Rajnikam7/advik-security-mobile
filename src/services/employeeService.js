import api from './api';

class EmployeeService {
  // Get employee dashboard data
  async getDashboard() {
    try {
      const response = await api.get('/employee/dashboard');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get assigned complaints
  async getAssignedComplaints(status = '') {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/employee/complaints${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get complaint details
  async getComplaintDetails(complaintId) {
    try {
      const response = await api.get(`/employee/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update complaint status
  async updateComplaintStatus(complaintId, status, notes = '') {
    try {
      const response = await api.put(`/employee/complaints/${complaintId}/status`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
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

export default new EmployeeService();
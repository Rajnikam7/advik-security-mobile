import api from './api';

class AdminService {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all users
  async getAllUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/admin/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update user role
  async updateUserRole(userId, role) {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get complaint by ID (Admin)
  async getComplaintById(complaintId) {
    try {
      const response = await api.get(`/admin/complaints/${complaintId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Assign complaint to employee
  async assignComplaint(complaintId, employeeId) {
    try {
      const response = await api.put(`/admin/complaints/${complaintId}/assign`, { employeeId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update complaint status
  async updateComplaintStatus(complaintId, status, notes = '') {
    try {
      const response = await api.put(`/admin/complaints/${complaintId}/status`, { status, notes });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all employees
  async getAllEmployees() {
    try {
      const response = await api.get('/admin/employees');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Register new employee
  async registerEmployee(employeeData) {
    try {
      const response = await api.post('/admin/employees', employeeData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update payment status
  async updatePaymentStatus(complaintId, paymentStatus, paymentId = '', notes = '') {
    try {
      const response = await api.put(`/admin/complaints/${complaintId}/payment`, { 
        paymentStatus, 
        paymentId, 
        notes 
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

export default new AdminService();

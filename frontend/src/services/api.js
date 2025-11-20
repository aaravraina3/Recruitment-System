/**
 * API Service Layer
 * Handles all communication with the backend API
 * Automatically includes Clerk JWT token in requests
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @param {function} getToken - Clerk's getToken function
 * @returns {Promise} Response data
 */
const apiRequest = async (endpoint, options = {}, getToken) => {
  try {
    // Get the Clerk session token
    const token = await getToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * User API endpoints
 */
export const userAPI = {
  /**
   * Create a new user
   * @param {object} userData - User data
   * @param {function} getToken - Clerk's getToken function
   */
  create: async (userData, getToken) => {
    return apiRequest('/api/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, getToken);
  },

  /**
   * Get user by email
   * @param {string} email - User email
   * @param {function} getToken - Clerk's getToken function
   */
  get: async (email, getToken) => {
    return apiRequest(`/api/users/get/${encodeURIComponent(email)}`, {
      method: 'GET',
    }, getToken);
  },
};

/**
 * Application API endpoints
 */
export const applicationAPI = {
  /**
   * Create a new application
   * @param {object} applicationData - Application data
   * @param {function} getToken - Clerk's getToken function
   */
  create: async (applicationData, getToken) => {
    return apiRequest('/api/applications/create', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }, getToken);
  },

  /**
   * Get applications by email
   * @param {string} email - User email
   * @param {function} getToken - Clerk's getToken function
   */
  getByEmail: async (email, getToken) => {
    return apiRequest(`/api/applications/get/${encodeURIComponent(email)}`, {
      method: 'GET',
    }, getToken);
  },
};

export default {
  userAPI,
  applicationAPI,
};

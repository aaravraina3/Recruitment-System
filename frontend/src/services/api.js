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
      // For public endpoints like generic chat, we might not need token, 
      // but this wrapper assumes auth.
      // For MVP, if no token, just return null or throw?
      // Let's try to proceed if optional, but usually we want auth.
      // Throwing error to ensure safety.
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
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export const authAPI = {
    getMe: async (getToken) => {
        return apiRequest('/api/auth/me', { method: 'GET' }, getToken);
    }
};

/**
 * User API endpoints
 */
export const userAPI = {
  create: async (userData, getToken) => {
    return apiRequest('/api/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, getToken);
  },

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
  create: async (applicationData, getToken) => {
    return apiRequest('/api/applications/create', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }, getToken);
  },

  getByEmail: async (email, getToken) => {
    return apiRequest(`/api/applications/get/${encodeURIComponent(email)}`, {
      method: 'GET',
    }, getToken);
  },
  
  getDetail: async (id, getToken) => {
    return apiRequest(`/api/applications/${id}`, {
      method: 'GET',
    }, getToken);
  },
  
  getQuestions: async (branch, role, getToken) => {
    return apiRequest(`/api/forms/questions?branch=${encodeURIComponent(branch)}&role=${encodeURIComponent(role)}`, {
      method: 'GET',
    }, getToken);
  }
};

/**
 * Review API endpoints
 */
export const reviewAPI = {
  getQueue: async (branch, getToken) => {
    return apiRequest(`/api/review/queue/${branch}`, {
      method: 'GET',
    }, getToken);
  },

  claim: async (appId, getToken) => {
    return apiRequest(`/api/review/claim/${appId}`, {
      method: 'POST',
    }, getToken);
  },

  submitDecision: async (appId, decisionData, getToken) => {
    return apiRequest(`/api/review/decision/${appId}`, {
      method: 'POST',
      body: JSON.stringify(decisionData),
    }, getToken);
  },
  
  addNote: async (appId, note, getToken) => {
    return apiRequest(`/api/applications/${appId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }, getToken);
  },
  
  getBranchNotes: async (branch, getToken) => {
    return apiRequest(`/api/reports/branch-notes/${branch}`, {
      method: 'GET',
    }, getToken);
  }
};

/**
 * Stats API endpoints
 */
export const statsAPI = {
  getBranchStats: async (getToken) => {
    return apiRequest('/api/stats/branches', {
      method: 'GET',
    }, getToken);
  },
  
  getFunnelStats: async (getToken) => {
    return apiRequest('/api/stats/funnel', {
      method: 'GET',
    }, getToken);
  }
};

export default {
  authAPI,
  userAPI,
  applicationAPI,
  reviewAPI,
  statsAPI
};

// Determine API URL based on environment
const getApiUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // In production, check if we're on Vercel and use relative path
  if (import.meta.env.PROD) {
    // If backend is deployed on same domain, use relative path
    // Otherwise, you need to set VITE_API_URL in Vercel environment variables
    return '/api'
  }
  
  // Development default
  return 'http://localhost:5000/api'
}

const API_BASE_URL = getApiUrl()

const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      let errorMessage = 'Request failed'
      try {
        const error = await response.json()
        errorMessage = error.error || errorMessage
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || `HTTP ${response.status}`
      }
      
      // Provide more helpful error messages
      if (response.status === 0 || response.status === 503) {
        errorMessage = 'Backend server is not available. Please ensure the API server is running and accessible.'
      } else if (response.status === 404) {
        errorMessage = 'API endpoint not found. Please check the API URL configuration.'
      } else if (response.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      }
      
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', {
      endpoint,
      url: `${API_BASE_URL}${endpoint}`,
      error: error.message
    })
    
    // Re-throw with more context
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the API server. Please check your network connection and ensure the backend is running.')
    }
    
    throw error
  }
}

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (data) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// Tasks API
export const tasksAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key])
    })
    const query = params.toString()
    return apiRequest(`/tasks${query ? `?${query}` : ''}`)
  },
  getById: (id) => apiRequest(`/tasks/${id}`),
  create: (data) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => apiRequest(`/tasks/${id}`, {
    method: 'DELETE'
  }),
  addLog: (id, message, type = 'info') => apiRequest(`/tasks/${id}/logs`, {
    method: 'POST',
    body: JSON.stringify({ message, type })
  }),
  addMetric: (id, metrics) => apiRequest(`/tasks/${id}/metrics`, {
    method: 'POST',
    body: JSON.stringify(metrics)
  }),
  getComments: (id) => apiRequest(`/tasks/${id}/comments`),
  addComment: (id, userId, text) => apiRequest(`/tasks/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ userId, text })
  })
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats')
}

// Settings API
export const settingsAPI = {
  get: () => apiRequest('/settings'),
  update: (data) => apiRequest('/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default {
  users: usersAPI,
  tasks: tasksAPI,
  dashboard: dashboardAPI,
  settings: settingsAPI
}

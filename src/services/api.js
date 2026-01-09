const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
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

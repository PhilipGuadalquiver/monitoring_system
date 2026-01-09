// Mock data for frontend-only mode
// This replaces the backend API calls

const mockUsers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'bob.johnson@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: '+1234567892',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockTasks = [
  {
    id: '1',
    name: 'Data Processing Task',
    description: 'Process and analyze customer data',
    status: 'in-progress',
    progress: 65,
    priority: 'high',
    category: 'data',
    assigneeId: '1',
    createdById: '1',
    assignee: mockUsers[0],
    createdBy: mockUsers[0],
    startDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 8,
    color: '#1890ff',
    tags: [{ id: '1', tag: 'urgent' }, { id: '2', tag: 'data' }],
    files: [],
    logs: [],
    metrics: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'System Backup',
    description: 'Create full system backup',
    status: 'pending',
    progress: 0,
    priority: 'medium',
    category: 'backup',
    assigneeId: '2',
    createdById: '1',
    assignee: mockUsers[1],
    createdBy: mockUsers[0],
    startDate: null,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 4,
    color: '#52c41a',
    tags: [{ id: '3', tag: 'backup' }],
    files: [],
    logs: [],
    metrics: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Report Generation',
    description: 'Generate monthly performance report',
    status: 'completed',
    progress: 100,
    priority: 'low',
    category: 'report',
    assigneeId: '3',
    createdById: '2',
    assignee: mockUsers[2],
    createdBy: mockUsers[1],
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDuration: 6,
    color: '#faad14',
    tags: [{ id: '4', tag: 'report' }, { id: '5', tag: 'monthly' }],
    files: [],
    logs: [],
    metrics: [],
    comments: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const mockUsersAPI = {
  getAll: async () => {
    await delay()
    return [...mockUsers]
  },
  getById: async (id) => {
    await delay()
    const user = mockUsers.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return user
  },
  create: async (data) => {
    await delay()
    const newUser = {
      id: String(mockUsers.length + 1),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockUsers.push(newUser)
    return newUser
  },
  update: async (id, data) => {
    await delay()
    const index = mockUsers.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date().toISOString() }
    return mockUsers[index]
  }
}

export const mockTasksAPI = {
  getAll: async (filters = {}) => {
    await delay()
    let filtered = [...mockTasks]
    
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status)
    }
    if (filters.assigneeId) {
      filtered = filtered.filter(t => t.assigneeId === filters.assigneeId)
    }
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority)
    }
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category)
    }
    
    return filtered
  },
  getById: async (id) => {
    await delay()
    const task = mockTasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    return task
  },
  create: async (data) => {
    await delay()
    const newTask = {
      id: String(mockTasks.length + 1),
      ...data,
      status: data.status || 'pending',
      progress: data.progress || 0,
      priority: data.priority || 'medium',
      category: data.category || 'data',
      tags: data.tags || [],
      files: [],
      logs: [],
      metrics: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: mockUsers.find(u => u.id === data.assigneeId) || mockUsers[0],
      createdBy: mockUsers.find(u => u.id === data.createdById) || mockUsers[0]
    }
    mockTasks.push(newTask)
    return newTask
  },
  update: async (id, data) => {
    await delay()
    const index = mockTasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    mockTasks[index] = { 
      ...mockTasks[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    }
    return mockTasks[index]
  },
  delete: async (id) => {
    await delay()
    const index = mockTasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    mockTasks.splice(index, 1)
    return { message: 'Task deleted successfully' }
  },
  addLog: async (id, message, type = 'info') => {
    await delay()
    const task = mockTasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    const log = {
      id: String(task.logs.length + 1),
      message,
      type,
      createdAt: new Date().toISOString()
    }
    task.logs.push(log)
    return log
  },
  addMetric: async (id, metrics) => {
    await delay()
    const task = mockTasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    const metric = {
      id: String(task.metrics.length + 1),
      ...metrics,
      createdAt: new Date().toISOString()
    }
    task.metrics.push(metric)
    return metric
  },
  getComments: async (id) => {
    await delay()
    const task = mockTasks.find(t => t.id === id)
    if (!task) return []
    return task.comments || []
  },
  addComment: async (id, userId, text) => {
    await delay()
    const task = mockTasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0]
    const comment = {
      id: String((task.comments || []).length + 1),
      userId,
      text,
      user,
      createdAt: new Date().toISOString()
    }
    if (!task.comments) task.comments = []
    task.comments.push(comment)
    return comment
  }
}

export const mockDashboardAPI = {
  getStats: async () => {
    await delay()
    const total = mockTasks.length
    const completed = mockTasks.filter(t => t.status === 'completed').length
    const inProgress = mockTasks.filter(t => t.status === 'in-progress').length
    const pending = mockTasks.filter(t => t.status === 'pending').length
    const failed = mockTasks.filter(t => t.status === 'failed').length
    
    return {
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      pendingTasks: pending,
      failedTasks: failed,
      total,
      running: inProgress,
      completed,
      failed,
      pending
    }
  }
}

export const mockSettingsAPI = {
  get: async () => {
    await delay()
    return {
      id: '1',
      notifications: true,
      theme: 'light',
      language: 'en',
      updatedAt: new Date().toISOString()
    }
  },
  update: async (data) => {
    await delay()
    return {
      id: '1',
      ...data,
      updatedAt: new Date().toISOString()
    }
  }
}

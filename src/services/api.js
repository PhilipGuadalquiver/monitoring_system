// Frontend-only mode: Using mock data instead of backend API
// Import mock data APIs
import {
  mockUsersAPI,
  mockTasksAPI,
  mockDashboardAPI,
  mockSettingsAPI
} from './mockData'

// Export mock APIs as the main APIs
export const usersAPI = mockUsersAPI
export const tasksAPI = mockTasksAPI
export const dashboardAPI = mockDashboardAPI
export const settingsAPI = mockSettingsAPI

export default {
  users: usersAPI,
  tasks: tasksAPI,
  dashboard: dashboardAPI,
  settings: settingsAPI
}

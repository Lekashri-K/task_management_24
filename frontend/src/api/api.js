import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API
const authApi = {
  login: async (credentials) => {
    try {
      const response = await api.post('login/', credentials);
      // Store tokens if login successful
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('user/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Super Manager API
const superManagerApi = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('supermanager-dashboard-stats/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },
  getUsers: async () => {
    try {
      const response = await api.get('supermanager/users/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },
  createUser: async (userData) => {
    try {
      const response = await api.post('supermanager/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error.response?.data);
      throw error;
    }
  },
  getProjects: async () => {
    try {
      const response = await api.get('supermanager/projects/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  },
  createProject: async (projectData) => {
    try {
      const response = await api.post('supermanager/projects/', projectData);
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error.response?.data);
      throw error;
    }
  },
  getTasks: async () => {
    try {
      const response = await api.get('supermanager/tasks/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },
  createTask: async (taskData) => {
    try {
      const response = await api.post('supermanager/tasks/', taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error.response?.data);
      throw error;
    }
  }
};

// Manager API
const managerApi = {
  getProjects: async () => {
    try {
      const response = await api.get('manager/projects/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch manager projects:', error);
      throw error;
    }
  },
  getTeamTasks: async () => {
    try {
      const response = await api.get('manager/tasks/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch team tasks:', error);
      throw error;
    }
  }
};

// Employee API
const employeeApi = {
  getTasks: async () => {
    try {
      const response = await api.get('employee/tasks/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch employee tasks:', error);
      throw error;
    }
  }
};

// Request interceptor for JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only attempt refresh if 401 error and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');
        
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        });
        
        localStorage.setItem('access_token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Refresh token failed:', err);
        authApi.logout();
        // You might want to redirect to login here
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export { authApi, superManagerApi, managerApi, employeeApi };
export default api;
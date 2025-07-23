import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login/`, { username, password });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data.user;
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

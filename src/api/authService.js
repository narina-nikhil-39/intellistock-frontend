import apiClient from './client';

export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const createAdminUser = (adminData) => apiClient.post('/auth/create-admin', adminData);
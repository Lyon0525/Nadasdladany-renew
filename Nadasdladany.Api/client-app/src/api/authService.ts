import apiClient from './apiClient';
import { type LoginResponse } from '../types/Auth';

export interface LoginCredentials {
    email: string;
    password?: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<LoginResponse>('/Auth/login', credentials);
        if (response.data.token && !response.data.mustChangePassword) {
            sessionStorage.setItem('admin_token', response.data.token);
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    changePassword: async (data: any, tempToken: string) => {
        const response = await apiClient.post<LoginResponse>('/Auth/change-password', data, {
            headers: { Authorization: `Bearer ${tempToken}` }
        });
        if (response.data.token) {
            sessionStorage.setItem('admin_token', response.data.token);
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    extendSession: async () => {
        const response = await apiClient.post<LoginResponse>('/Auth/extend-session');
        if (response.data.token) {
            sessionStorage.setItem('admin_token', response.data.token);
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('user');
    },
    getCurrentUser: (): LoginResponse | null => {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
    getAllUsers: async () => {
        const response = await apiClient.get<any[]>('/users');
        return response.data;
    },
    registerUser: async (userData: any) => {
        const response = await apiClient.post('/users/register', userData);
        return response.data;
    },
    updateUser: async (id: string, userData: any) => {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id: string) => {
        await apiClient.delete(`/users/${id}`);
    }
};
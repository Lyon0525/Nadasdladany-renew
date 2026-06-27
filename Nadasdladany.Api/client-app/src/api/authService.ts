import apiClient from './apiClient';
import { type LoginResponse } from '../types/Auth';

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface AdminUser {
    id: string;
    userName: string;
    email: string;
    mustChangePassword: boolean;
}

export interface RegisterUserRequest {
    email: string;
    password?: string;
}

export interface UpdateUserRequest {
    email?: string;
    password?: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<LoginResponse>('/Auth/login', credentials);
        if (!response.data.mustChangePassword) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    changePassword: async (data: ChangePasswordRequestDto) => {
        const response = await apiClient.post<LoginResponse>('/Auth/change-password', data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },
    extendSession: async () => {
        const response = await apiClient.post<LoginResponse>('/Auth/extend-session');
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },
    logout: async () => {
        try {
            await apiClient.post('/Auth/logout');
        } catch { }
        localStorage.removeItem('user');
        localStorage.removeItem('last_activity');
    },
    getCurrentUser: (): LoginResponse | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
    getAllUsers: async (): Promise<AdminUser[]> => {
        const response = await apiClient.get<AdminUser[]>('/users');
        return response.data;
    },
    registerUser: async (userData: RegisterUserRequest) => {
        const response = await apiClient.post('/users/register', userData);
        return response.data;
    },
    updateUser: async (id: string, userData: UpdateUserRequest) => {
        const response = await apiClient.put(`/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id: string) => {
        await apiClient.delete(`/users/${id}`);
    }
};

export interface ChangePasswordRequestDto {
    currentPassword?: string;
    newPassword?: string;
}
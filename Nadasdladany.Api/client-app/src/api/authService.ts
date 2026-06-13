import apiClient from './apiClient';
import { type LoginResponse } from '../types/Auth';

export interface LoginCredentials {
    email: string;
    password?: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: (): LoginResponse | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
};
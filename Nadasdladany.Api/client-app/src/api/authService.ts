import apiClient from './apiClient';
import { type LoginResponse } from '../types/Auth';

export const authService = {
    login: async (credentials: any) => {
        const response = await apiClient.post<LoginResponse>('/account/login', credentials);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    },
    getCurrentUser: (): LoginResponse | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    }
};
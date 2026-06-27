import apiClient from './apiClient';

export interface DashboardStats {
    newsCount: number;
    eventsCount: number;
    albumsCount: number;
    documentsCount: number;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get<DashboardStats>('/dashboard/stats');
        return response.data;
    }
};
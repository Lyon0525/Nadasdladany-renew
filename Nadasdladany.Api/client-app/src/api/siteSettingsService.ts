import apiClient from './apiClient';

export interface SiteSetting {
    id: number;
    mayorName: string;
    welcomeTitle: string;
    welcomeText: string;
    mayorImageUrl?: string;
}

export const siteSettingsService = {
    getSettings: async () => {
        const response = await apiClient.get<SiteSetting>('/sitesettings');
        return response.data;
    },
    updateSettings: async (formData: FormData) => {
        const response = await apiClient.put<number>('/sitesettings', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};
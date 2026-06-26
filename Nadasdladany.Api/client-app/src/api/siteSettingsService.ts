import apiClient from './apiClient';

export interface SiteSetting {
    id: number;
    mayorName: string;
    welcomeTitle: string;
    welcomeText: string;
    mayorImageUrl: string | null;
    historyText: string;
    coatOfArmsText: string;
    coatOfArmsImageUrl: string | null;
    landmarksText: string;
    committeeText?: string;
    contactAddress?: string;
    contactEmail?: string;
    contactPhone?: string;
    impressumText?: string;
    gdprText?: string;
    accessibilityText?: string;
    hostingProviderText?: string;
}

export const siteSettingsService = {
    getSettings: async () => {
        const response = await apiClient.get<SiteSetting>('/sitesettings');
        return response.data;
    },

    updateSettings: async (formData: FormData) => {
        const response = await apiClient.put<number>('/sitesettings', formData);
        return response.data;
    },
};
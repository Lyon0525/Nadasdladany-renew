import apiClient from './apiClient';

export interface Representative {
    id: number;
    name: string;
    role: number | string;
    customTitleOverride?: string;
    email?: string;
    phoneNumber?: string;
    receptionHoursInfo?: string;
    imageUrl?: string;
    biography?: string;
    displayOrder: number;
}

export const representativeService = {
    getRepresentatives: async () => {
        const response = await apiClient.get<Representative[]>('/representatives');
        return response.data;
    },
    createRepresentative: async (formData: FormData) => {
        const response = await apiClient.post<number>('/representatives', formData);
        return response.data;
    },
    updateRepresentative: async (id: number, formData: FormData) => {
        await apiClient.put(`/representatives/${id}`, formData);
    },
    deleteRepresentative: async (id: number) => {
        await apiClient.delete(`/representatives/${id}`);
    }
};
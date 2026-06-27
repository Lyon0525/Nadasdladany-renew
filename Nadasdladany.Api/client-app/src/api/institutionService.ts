import apiClient from './apiClient';

export interface Institution {
    id: number;
    name: string;
    description?: string;
    content?: string;
    leaderName?: string;
    openingHours?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    websiteUrl?: string;
    imageUrl?: string;
    slug?: string;
    displayOrder: number;
}

export const institutionService = {
    getInstitutions: async () => {
        const response = await apiClient.get<Institution[]>('/institutions');
        return response.data;
    },
    getInstitutionBySlug: async (slug: string) => {
        const response = await apiClient.get<Institution>(`/institutions/${slug}`);
        return response.data;
    },
    createInstitution: async (formData: FormData) => {
        const response = await apiClient.post<number>('/institutions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    updateInstitution: async (id: number, formData: FormData) => {
        await apiClient.put(`/institutions/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteInstitution: async (id: number) => {
        await apiClient.delete(`/institutions/${id}`);
    }
};
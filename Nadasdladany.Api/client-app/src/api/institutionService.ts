import apiClient from './apiClient';

export interface Institution {
    id: number;
    name: string;
    description?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    websiteUrl?: string;
    imageUrl?: string;
    slug?: string;
}

export const institutionService = {
    // Összes publikus intézmény lekérése
    getInstitutions: async () => {
        const response = await apiClient.get<Institution[]>('/institutions');
        return response.data;
    },
    // ADMIN: Új intézmény
    createInstitution: async (formData: FormData) => {
        const response = await apiClient.post<Institution>('/institutions', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    // ADMIN: Törlés
    deleteInstitution: async (id: number) => {
        await apiClient.delete(`/institutions/${id}`);
    }
};
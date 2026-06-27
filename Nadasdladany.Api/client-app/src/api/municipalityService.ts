import apiClient from './apiClient';
import { type Representative, type DocumentFile } from '../types/Municipality';
import { type PaginatedResult } from './articleService';

export const municipalityService = {
    getRepresentatives: async () => {
        const response = await apiClient.get<Representative[]>('/municipality/representatives');
        return response.data;
    },
    getRepresentativeById: async (id: number) => {
        const response = await apiClient.get<Representative>(`/municipality/representatives/${id}`);
        return response.data;
    },
    createRepresentative: async (formData: FormData) => {
        const response = await apiClient.post<number>('/municipality/representatives', formData);
        return response.data;
    },
    updateRepresentative: async (id: number, formData: FormData) => {
        await apiClient.put(`/municipality/representatives/${id}`, formData);
    },
    deleteRepresentative: async (id: number) => {
        await apiClient.delete(`/municipality/representatives/${id}`);
    },

    getDocuments: async (category?: string, pageNumber = 1, pageSize = 50) => {
        const response = await apiClient.get<PaginatedResult<DocumentFile>>('/documents', {
            params: { category, pageNumber, pageSize }
        });
        return response.data;
    }
};
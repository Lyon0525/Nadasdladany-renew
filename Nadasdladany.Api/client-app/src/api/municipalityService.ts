import apiClient from './apiClient';
import { type Representative, type DocumentFile } from '../types/Municipality';
import { type PaginatedResult } from './articleService';

export const municipalityService = {
    getRepresentatives: async () => {
        const response = await apiClient.get<Representative[]>('/municipality/representatives');
        return response.data;
    },

    getDocuments: async (category?: string, pageNumber = 1, pageSize = 50) => {
        const response = await apiClient.get<PaginatedResult<DocumentFile>>('/documents', {
            params: { category, pageNumber, pageSize }
        });
        return response.data;
    }
};
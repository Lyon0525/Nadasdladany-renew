import apiClient from './apiClient';
import { type Representative, type DocumentFile } from '../types/Municipality';

export const municipalityService = {
    getRepresentatives: async () => {
        const response = await apiClient.get<Representative[]>('/municipality/representatives');
        return response.data;
    },
    getDocuments: async (category?: string) => {
        const response = await apiClient.get<DocumentFile[]>('/documents', { params: { category } });
        return response.data;
    }
};
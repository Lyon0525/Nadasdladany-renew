import apiClient from './apiClient';
import { type DocumentFile } from '../types/Municipality';
import { type PaginatedResult } from './articleService';

export const documentService = {
    getDocuments: async (pageNumber = 1, pageSize = 100, categoryId?: number, searchTerm?: string) => {
        const response = await apiClient.get<PaginatedResult<DocumentFile>>('/documents', {
            params: { pageNumber, pageSize, categoryId, searchTerm }
        });
        return response.data;
    },

    uploadDocument: async (formData: FormData) => {
        const response = await apiClient.post<number>('/documents', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    updateDocument: async (id: number, formData: FormData) => {
        await apiClient.put(`/documents/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteDocument: async (id: number) => {
        await apiClient.delete(`/documents/${id}`);
    }
};
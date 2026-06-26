import apiClient from './apiClient';

export const documentService = {
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
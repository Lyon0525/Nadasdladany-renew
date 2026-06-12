import apiClient from './apiClient';

export const documentService = {
    uploadDocument: async (formData: FormData) => {
        const response = await apiClient.post<number>('/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteDocument: async (id: number) => {
        await apiClient.delete(`/documents/${id}`);
    }
};
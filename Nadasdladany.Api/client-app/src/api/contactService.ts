import apiClient from './apiClient';

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const contactService = {
    submitMessage: async (data: { name: string; email: string; subject: string; message: string }) => {
        const response = await apiClient.post<number>('/contact', data);
        return response.data;
    },
    getMessages: async () => {
        const response = await apiClient.get<ContactMessage[]>('/contact');
        return response.data;
    },
    markAsRead: async (id: number) => {
        await apiClient.put(`/contact/${id}/read`);
    },
    deleteMessage: async (id: number) => {
        await apiClient.delete(`/contact/${id}`);
    }
};
import apiClient from './apiClient';

export const newsletterService = {
    subscribe: async (email: string, name?: string) => {
        const response = await apiClient.post<boolean>('/newsletter/subscribe', { email, name });
        return response.data;
    },
    getSubscriberCount: async () => {
        const response = await apiClient.get<number>('/newsletter/subscribers');
        return response.data;
    },
    sendNewsletter: async (subject: string, body: string) => {
        const response = await apiClient.post<{ message: string; isDummy: boolean }>('/newsletter/send', { subject, body });
        return response.data;
    }
};
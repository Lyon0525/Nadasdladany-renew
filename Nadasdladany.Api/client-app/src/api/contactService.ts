import apiClient from './apiClient';

export interface ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactService = {
    submitMessage: async (message: ContactMessage) => {
        const response = await apiClient.post('/contact', message);
        return response.data;
    }
};
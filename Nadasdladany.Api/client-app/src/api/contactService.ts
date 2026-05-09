import apiClient from './apiClient';

export interface ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactService = {
    // Üzenet küldése a backendnek
    submitMessage: async (message: ContactMessage) => {
        const response = await apiClient.post('/contact', message);
        return response.data;
    }
};
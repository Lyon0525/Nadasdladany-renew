import apiClient from './apiClient';

export interface VillageEvent {
    id: number;
    title: string;
    description?: string;
    slug: string;
    startDate: string;
    endDate?: string;
    location?: string;
    isAllDay: boolean;
    organizer?: string;
    eventUrl?: string;
    imageUrl?: string;
}

export const eventService = {
    getEvents: async () => {
        const response = await apiClient.get<VillageEvent[]>('/events');
        return response.data;
    },
    getEventBySlug: async (slug: string) => {
        const response = await apiClient.get<VillageEvent>(`/events/${slug}`);
        return response.data;
    },
    createEvent: async (formData: FormData) => {
        const response = await apiClient.post<number>('/events', formData);
        return response.data;
    },
    updateEvent: async (id: number, formData: FormData) => {
        await apiClient.put(`/events/${id}`, formData);
    },
    deleteEvent: async (id: number) => {
        await apiClient.delete(`/events/${id}`);
    }
};
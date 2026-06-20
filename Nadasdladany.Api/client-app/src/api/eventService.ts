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
    updateEvent: async (id: number, eventData: any) => {
        await apiClient.put(`/events/${id}`, eventData);
    },
    createEvent: async (event: any) => {
        const response = await apiClient.post<VillageEvent>('/events', event);
        return response.data;
    },
    deleteEvent: async (id: number) => {
        await apiClient.delete(`/events/${id}`);
    }
};
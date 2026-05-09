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
    // Összes publikus esemény lekérése
    getEvents: async () => {
        const response = await apiClient.get<VillageEvent[]>('/events');
        return response.data;
    },
    // Egy esemény lekérése slug alapján
    getEventBySlug: async (slug: string) => {
        const response = await apiClient.get<VillageEvent>(`/events/${slug}`);
        return response.data;
    },
    // ADMIN: Új esemény
    createEvent: async (event: any) => {
        const response = await apiClient.post<VillageEvent>('/events', event);
        return response.data;
    },
    // ADMIN: Törlés
    deleteEvent: async (id: number) => {
        await apiClient.delete(`/events/${id}`);
    }
};
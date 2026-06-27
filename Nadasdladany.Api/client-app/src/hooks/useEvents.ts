import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../api/eventService';
import toast from 'react-hot-toast';

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await eventService.getEvents();
            return Array.isArray(res) ? res : ((res as any)?.items || []);
        }
    });
};

export const useEventBySlug = (slug?: string) => {
    return useQuery({
        queryKey: ['event', slug],
        queryFn: () => eventService.getEventBySlug(slug!),
        enabled: !!slug
    });
};

export const useSaveEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
            id ? eventService.updateEvent(id, formData) : eventService.createEvent(formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success(variables.id ? "Esemény frissítve!" : "Esemény közzétéve!");
        },
        onError: () => {
            toast.error("Mentési hiba!");
        }
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => eventService.deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success("Esemény sikeresen törölve");
        },
        onError: () => {
            toast.error("Hiba a törlés során");
        }
    });
};
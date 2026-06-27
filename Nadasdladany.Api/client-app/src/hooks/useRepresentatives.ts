import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { municipalityService } from '../api/municipalityService';
import toast from 'react-hot-toast';

export const useRepresentatives = () => {
    return useQuery({
        queryKey: ['representatives'],
        queryFn: async () => {
            const data = await municipalityService.getRepresentatives();
            const items = Array.isArray(data) ? data : (data as any)?.items || [];
            return items.sort((a: any, b: any) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        }
    });
};

export const useRepresentativeById = (id?: number) => {
    return useQuery({
        queryKey: ['representative', id],
        queryFn: () => municipalityService.getRepresentativeById(id!),
        enabled: !!id
    });
};

export const useSaveRepresentative = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
            id ? municipalityService.updateRepresentative(id, formData) : municipalityService.createRepresentative(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['representatives'] });
            toast.success("Adatok mentve!");
        },
        onError: () => toast.error("Hiba a mentés során.")
    });
};

export const useDeleteRepresentative = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => municipalityService.deleteRepresentative(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['representatives'] });
            toast.success("Személy sikeresen törölve");
        },
        onError: () => toast.error("Hiba a törlés során")
    });
};
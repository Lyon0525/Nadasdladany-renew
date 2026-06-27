import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { institutionService } from '../api/institutionService';
import toast from 'react-hot-toast';

export const useInstitutions = () => {
    return useQuery({
        queryKey: ['institutions'],
        queryFn: () => institutionService.getInstitutions()
    });
};

export const useInstitutionBySlug = (slug?: string) => {
    return useQuery({
        queryKey: ['institution', slug],
        queryFn: () => institutionService.getInstitutionBySlug(slug!),
        enabled: !!slug
    });
};

export const useSaveInstitution = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
            id ? institutionService.updateInstitution(id, formData) : institutionService.createInstitution(formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['institutions'] });
            toast.success(variables.id ? "Intézmény adatai frissítve!" : "Intézmény sikeresen létrehozva!");
        },
        onError: () => toast.error("Hiba a mentés során. Ellenőrizze az adatokat!")
    });
};

export const useDeleteInstitution = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => institutionService.deleteInstitution(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['institutions'] });
            toast.success("Intézmény törölve");
        },
        onError: () => toast.error("Hiba a törlés során")
    });
};
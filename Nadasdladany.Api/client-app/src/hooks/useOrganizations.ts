import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService, OrganizationType } from '../api/organizationService';
import toast from 'react-hot-toast';

export const useOrganizations = (type?: OrganizationType | 'all') => {
    return useQuery({
        queryKey: ['organizations', type],
        queryFn: () => {
            const typeParam = type === 'all' ? undefined : type;
            return organizationService.getOrganizations(typeParam);
        }
    });
};

export const useSaveOrganization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
            id ? organizationService.updateOrganization(id, formData) : organizationService.createOrganization(formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            toast.success(variables.id ? "Szervezet sikeresen frissítve!" : "Szervezet sikeresen rögzítve!");
        },
        onError: () => toast.error("Hiba történt a mentés során!")
    });
};

export const useDeleteOrganization = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => organizationService.deleteOrganization(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            toast.success("Szervezet sikeresen törölve");
        },
        onError: () => toast.error("Hiba a törlés során")
    });
};
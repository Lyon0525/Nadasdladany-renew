import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsService } from '../api/siteSettingsService';
import toast from 'react-hot-toast';

export const useSiteSettings = () => {
    return useQuery({
        queryKey: ['siteSettings'],
        queryFn: () => siteSettingsService.getSettings()
    });
};

export const useSaveSiteSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => siteSettingsService.updateSettings(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
        },
        onError: () => {
            toast.error("Hiba történt a mentés során.");
        }
    });
};
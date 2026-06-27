import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../api/galleryService';
import toast from 'react-hot-toast';

export const useAlbums = () => {
    return useQuery({
        queryKey: ['albums'],
        queryFn: () => galleryService.getAlbums()
    });
};

export const useAlbumImages = (slug?: string) => {
    return useQuery({
        queryKey: ['albumImages', slug],
        queryFn: () => galleryService.getImagesByAlbum(slug!),
        enabled: !!slug
    });
};

export const useDeleteAlbum = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => galleryService.deleteAlbum(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['albums'] });
            toast.success("Album sikeresen törölve!");
        },
        onError: () => toast.error("Hiba történt a törlés során.")
    });
};
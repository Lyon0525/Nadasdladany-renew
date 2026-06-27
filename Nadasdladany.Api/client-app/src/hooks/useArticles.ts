import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService } from '../api/articleService';
import toast from 'react-hot-toast';

export const useArticles = (pageNumber = 1, pageSize = 50, categoryId?: number | null) => {
    return useQuery({
        queryKey: ['articles', pageNumber, pageSize, categoryId],
        queryFn: () => articleService.getArticles(pageNumber, pageSize, categoryId || undefined)
    });
};

export const useArticleBySlug = (slug?: string) => {
    return useQuery({
        queryKey: ['article', slug],
        queryFn: () => articleService.getArticleBySlug(slug!),
        enabled: !!slug
    });
};

export const useSaveArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
            id ? articleService.updateArticle(id, formData) : articleService.createArticle(formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success(variables.id ? "Hír sikeresen frissítve!" : "Hír sikeresen közzétéve!");
        },
        onError: () => {
            toast.error("Hiba a mentés során!");
        }
    });
};

export const useDeleteArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => articleService.deleteArticle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success("Hír törölve!");
        },
        onError: () => {
            toast.error("Hiba a törlés során!");
        }
    });
};
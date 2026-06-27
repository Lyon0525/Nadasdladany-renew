import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../api/documentService';
import toast from 'react-hot-toast';

export const useDocuments = (pageNumber = 1, pageSize = 100, categoryId?: number, searchTerm?: string) => {
    return useQuery({
        queryKey: ['documents', pageNumber, pageSize, categoryId, searchTerm],
        queryFn: () => documentService.getDocuments(pageNumber, pageSize, categoryId, searchTerm)
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => documentService.deleteDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success("Dokumentum sikeresen törölve!");
        },
        onError: () => toast.error("Nem sikerült törölni a dokumentumot.")
    });
};
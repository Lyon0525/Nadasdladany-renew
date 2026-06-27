import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../api/projectService';
import toast from 'react-hot-toast';

export const useProjects = (pageNumber = 1, pageSize = 50) => {
    return useQuery({
        queryKey: ['projects', pageNumber, pageSize],
        queryFn: () => projectService.getProjects(pageNumber, pageSize)
    });
};

export const useSaveProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: { id?: number; formData: FormData }) =>
            id ? projectService.updateProject(id, formData) : projectService.createProject(formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success(variables.id ? "Pályázat adatai frissítve!" : "Pályázat sikeresen rögzítve!");
        },
        onError: () => toast.error("Hiba a mentés során")
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => projectService.deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success("Pályázat törölve!");
        },
        onError: () => toast.error("Hiba a törlés során.")
    });
};
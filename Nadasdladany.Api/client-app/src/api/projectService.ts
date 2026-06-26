import apiClient from './apiClient';
import { type PaginatedResult } from './articleService';

export interface Project {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImageUrl?: string;
    projectCode?: string;
    totalFunding?: string;
    supportRate?: string;
    createdAt: string;
}

export const projectService = {
    getProjects: async (pageNumber = 1, pageSize = 10) => {
        const response = await apiClient.get<PaginatedResult<Project>>('/projects', {
            params: { pageNumber, pageSize }
        });
        return response.data;
    },

    createProject: async (formData: FormData) => {
        const response = await apiClient.post<number>('/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateProject: async (id: number, formData: FormData) => {
        await apiClient.put(`/projects/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteProject: async (id: number) => {
        await apiClient.delete(`/projects/${id}`);
    }
};
import apiClient from './apiClient';
import type { Article } from "../types/Article";

export interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export const articleService = {
    getArticles: async (pageNumber = 1, pageSize = 10, categoryId?: number) => {
        const response = await apiClient.get<PaginatedResult<Article>>('/articles', {
            params: { pageNumber, pageSize, categoryId }
        });
        return response.data;
    },

    createArticle: async (formData: FormData) => {
        const response = await apiClient.post<number>('/articles', formData);
        return response.data;
    },

    updateArticle: async (id: number, formData: FormData) => {
        await apiClient.put(`/articles/${id}`, formData);
    },

    deleteArticle: async (id: number) => {
        await apiClient.delete(`/articles/${id}`);
    }
};
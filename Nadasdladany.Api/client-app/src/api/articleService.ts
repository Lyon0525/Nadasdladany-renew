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
    getArticles: async (pageNumber = 1, pageSize = 10) => {
        const response = await apiClient.get<PaginatedResult<Article>>('/articles', {
            params: { pageNumber, pageSize }
        });
        return response.data;
    },

    getArticleBySlug: async (slug: string) => {
        const response = await apiClient.get<Article>(`/articles/${slug}`);
        return response.data;
    },

    createArticle: async (formData: FormData) => {
        const response = await apiClient.post<Article>('/articles', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateArticle: async (id: number, formData: FormData) => {
        const response = await apiClient.put<Article>(`/articles/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteArticle: async (id: number) => {
        await apiClient.delete(`/articles/${id}`);
    }
};
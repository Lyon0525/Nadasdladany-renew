import apiClient from './apiClient';
import type { Article } from "../types/Article";

export const articleService = {
    getArticles: async () => {
        const response = await apiClient.get<Article[]>('/articles');
        return response.data;
    },

  getArticleBySlug: async (slug: string) => {
    const response = await apiClient.get<Article>(`/articles/${slug}`);
    return response.data;
  },

  // ÚJ: Hír létrehozása
  createArticle: async (formData: FormData) => {
    const response = await apiClient.post<Article>('/articles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // ÚJ: Hír módosítása
  updateArticle: async (id: number, formData: FormData) => {
    const response = await apiClient.put<Article>(`/articles/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // ÚJ: Hír törlése
  deleteArticle: async (id: number) => {
    await apiClient.delete(`/articles/${id}`);
  }
};
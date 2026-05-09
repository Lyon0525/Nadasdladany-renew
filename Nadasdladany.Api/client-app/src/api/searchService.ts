import apiClient from './apiClient';

export interface SearchResult {
    title: string;
    description: string;
    url: string;
    resultType: 'Hír' | 'Esemény' | 'Dokumentum';
}

export const searchService = {
    search: async (query: string) => {
        if (!query || query.length < 2) return [];
        const response = await apiClient.get<SearchResult[]>('/search', { params: { query } });
        return response.data;
    }
};
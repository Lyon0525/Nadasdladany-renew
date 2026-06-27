import apiClient from './apiClient';

export interface GalleryAlbum {
    id: number;
    title: string;
    slug: string;
    description?: string;
    imageCount: number;
    thumbnailUrl?: string;
}

export interface GalleryImage {
    id: number;
    imageUrl: string;
}

export const galleryService = {
    getAlbums: async (): Promise<GalleryAlbum[]> => {
        const response = await apiClient.get<GalleryAlbum[]>('/gallery/albums');
        return response.data;
    },
    getImagesByAlbum: async (slug: string): Promise<GalleryImage[]> => {
        const response = await apiClient.get<GalleryImage[]>(`/gallery/albums/${slug}`);
        return response.data;
    },
    createAlbum: async (formData: FormData): Promise<number> => {
        const response = await apiClient.post<number>('/gallery/albums', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    updateAlbum: async (id: number, data: { id: number, name: string, description?: string }): Promise<void> => {
        await apiClient.put(`/gallery/albums/${id}`, data);
    },
    uploadImages: async (albumId: number, files: FileList): Promise<void> => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('images', file);
        });
        await apiClient.post(`/gallery/albums/${albumId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteAlbum: async (id: number): Promise<void> => {
        await apiClient.delete(`/gallery/albums/${id}`);
    },
    deleteImage: async (id: number): Promise<void> => {
        await apiClient.delete(`/gallery/image/${id}`);
    }
};
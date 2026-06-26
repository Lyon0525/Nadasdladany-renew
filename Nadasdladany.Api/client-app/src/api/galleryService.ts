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
    createAlbum: async (album: any): Promise<any> => {
        const response = await apiClient.post('/gallery/albums', album);
        return response.data;
    },
    updateAlbum: async (id: number, data: { id: number, name: string, description?: string }): Promise<void> => {
        await apiClient.put(`/gallery/albums/${id}`, data);
    },
    uploadImages: async (albumId: number, files: FileList): Promise<any> => {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('images', file);
        });
        const response = await apiClient.post(`/gallery/albums/${albumId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteAlbum: async (id: number): Promise<void> => {
        await apiClient.delete(`/gallery/albums/${id}`);
    },
    deleteImage: async (id: number): Promise<void> => {
        await apiClient.delete(`/gallery/image/${id}`);
    }
};
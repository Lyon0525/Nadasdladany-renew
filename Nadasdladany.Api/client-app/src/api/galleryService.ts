import apiClient from './apiClient';

export interface GalleryAlbum {
    id: number;
    title: string;
    description?: string;
    slug: string;
    thumbnailUrl?: string;
    imageCount: number;
}

export interface GalleryImage {
    id: number;
    imageUrl: string;
    thumbnailUrl?: string;
    title?: string;
    altText?: string;
}

export const galleryService = {
    // Összes publikus album lekérése
    getAlbums: async () => {
        const response = await apiClient.get<GalleryAlbum[]>('/gallery/albums');
        return response.data;
    },
    // Egy album képeinek lekérése slug alapján
    getImagesByAlbum: async (slug: string) => {
        const response = await apiClient.get<GalleryImage[]>(`/gallery/albums/${slug}/images`);
        return response.data;
    },
    // ADMIN: Album létrehozása
    createAlbum: async (album: any) => {
        const response = await apiClient.post('/gallery/albums', album);
        return response.data;
    },
    // ADMIN: Képek feltöltése (több fájl egyszerre)
    uploadImages: async (albumId: number, files: FileList) => {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('images', file));
        await apiClient.post(`/gallery/albums/${albumId}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
import apiClient from './apiClient';

export interface VillageLocation {
    id: number;
    name: string;
    iconType: string;
    latitude: number;
    longitude: number;
    address: string;
    description: string;
}

export const villageMapService = {
    getLocations: async () => {
        const response = await apiClient.get<VillageLocation[]>('/locations');
        return response.data;
    },
    saveLocation: async (location: Omit<VillageLocation, 'id'> & { id?: number }) => {
        const response = await apiClient.post<number>('/locations', location);
        return response.data;
    },
    deleteLocation: async (id: number) => {
        const response = await apiClient.delete<boolean>(`/locations/${id}`);
        return response.data;
    }
};
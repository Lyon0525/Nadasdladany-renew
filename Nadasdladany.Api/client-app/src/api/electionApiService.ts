import apiClient from './apiClient';
import { type ElectionResult } from '../pages/ElectionsPage';

export const electionApiService = {
    getNadasdladanyResults: async (year: number): Promise<ElectionResult | null> => {
        try {
            const response = await apiClient.get<ElectionResult>(`/elections/${year}`);
            return response.data;
        } catch (error) {
            console.error("Hiba a választási adatok letöltésekor:", error);
            return null;
        }
    },

    saveElectionResults: async (data: any): Promise<number> => {
        const response = await apiClient.post<number>('/elections', data);
        return response.data;
    }
};
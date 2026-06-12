import apiClient from './apiClient';

export interface PublicDataRequest {
    id: number;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    requestedDataDescription: string;
    isProcessed: boolean;
    internalNotes?: string;
    createdAt: string;
}

export const dataRequestService = {
    submitRequest: async (requestData: { applicantName: string; applicantEmail: string; applicantPhone?: string; requestedDataDescription: string }) => {
        const response = await apiClient.post<number>('/publicdatarequests', requestData);
        return response.data;
    },
    getAllRequests: async () => {
        const response = await apiClient.get<PublicDataRequest[]>('/publicdatarequests');
        return response.data;
    }
};
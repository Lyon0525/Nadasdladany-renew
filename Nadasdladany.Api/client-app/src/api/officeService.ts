import apiClient from './apiClient';

export interface StaffMember {
    id?: number;
    name: string;
    position: string;
    email?: string;
    phone?: string;
    order: number;
}

export interface OfficeDetails {
    officialName: string;
    address: string;
    phone: string;
    email: string;
    openingHoursJson: string;
    staff: StaffMember[];
}

export const officeService = {
    getDetails: async () => {
        const response = await apiClient.get<OfficeDetails>('/office/details');
        return response.data;
    },
    updateDetails: async (data: OfficeDetails) => {
        await apiClient.put('/office/details', data);
    }
};
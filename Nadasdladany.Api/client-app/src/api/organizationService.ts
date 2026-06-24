import apiClient from './apiClient';

export const OrganizationType = {
    CivilSzervezet: 0,
    Egyhaz: 1,
    Alapitvany: 2
} as const;

export type OrganizationType = typeof OrganizationType[keyof typeof OrganizationType];

export interface Organization {
    id: number;
    name: string;
    slug: string;
    description?: string;
    leaderName?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    websiteUrl?: string;
    imageUrl?: string;
    type: OrganizationType;
    displayOrder: number;
}

export const organizationService = {
    getOrganizations: async (type?: OrganizationType) => {
        const response = await apiClient.get<Organization[]>('/organizations', { params: { type } });
        return response.data;
    },
    createOrganization: async (formData: FormData) => {
        const response = await apiClient.post<number>('/organizations', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    updateOrganization: async (id: number, formData: FormData) => {
        await apiClient.put(`/organizations/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteOrganization: async (id: number) => {
        await apiClient.delete(`/organizations/${id}`);
    }
};
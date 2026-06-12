import apiClient from './apiClient';

export interface JobPosting {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    department?: string;
    location?: string;
    employmentType?: string;
    applicationDeadline?: string;
    isActive: boolean;
    createdAt: string;
}

export const jobService = {
    getActiveJobs: async () => {
        const response = await apiClient.get<JobPosting[]>('/jobpostings');
        return response.data;
    },
    createJob: async (jobData: any) => {
        const response = await apiClient.post<number>('/jobpostings', jobData);
        return response.data;
    }
};
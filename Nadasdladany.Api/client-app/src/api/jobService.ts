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

export interface JobPostingSubmitData {
    id?: number;
    title: string;
    content: string;
    excerpt?: string | null;
    department?: string | null;
    location?: string | null;
    employmentType?: string | null;
    applicationDeadline?: string | null;
}

export const jobService = {
    getActiveJobs: async (): Promise<JobPosting[]> => {
        const response = await apiClient.get<JobPosting[]>('/jobpostings');
        return response.data;
    },
    createJob: async (jobData: JobPostingSubmitData): Promise<number> => {
        const response = await apiClient.post<number>('/jobpostings', jobData);
        return response.data;
    },
    updateJob: async (id: number, jobData: JobPostingSubmitData): Promise<void> => {
        await apiClient.put(`/jobpostings/${id}`, jobData);
    },
    deleteJob: async (id: number): Promise<void> => {
        await apiClient.delete(`/jobpostings/${id}`);
    }
};
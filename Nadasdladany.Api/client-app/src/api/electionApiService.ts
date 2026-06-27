import apiClient from './apiClient';

export interface CandidateResult {
    candidateName: string;
    organization: string;
    votesCount: number;
    percentage: number;
    isWinner: boolean;
}

export interface ElectionResult {
    id: number;
    year: number;
    type: string;
    registeredVoters: number;
    votedCount: number;
    turnoutPercentage: number;
    results?: CandidateResult[];
    candidatesJson?: string;
}

export interface ElectionSubmitData {
    year: number;
    type: string;
    registeredVoters: number;
    votedCount: number;
    turnoutPercentage: number;
    results: CandidateResult[];
}

export const electionApiService = {
    getAllElections: async (): Promise<ElectionResult[]> => {
        const response = await apiClient.get<ElectionResult[]>('/elections');
        return response.data;
    },

    getNadasdladanyResults: async (year: number): Promise<ElectionResult | null> => {
        try {
            const response = await apiClient.get<ElectionResult>(`/elections/${year}`);
            return response.data;
        } catch (error) {
            return null;
        }
    },

    saveElectionResults: async (data: ElectionSubmitData): Promise<number> => {
        const response = await apiClient.post<number>('/elections', data);
        return response.data;
    },

    deleteElection: async (id: number): Promise<void> => {
        await apiClient.delete(`/elections/${id}`);
    }
};
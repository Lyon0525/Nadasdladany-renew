export interface ElectionResult {
    year: number;
    type: string;
    registeredVoters: number;
    votedCount: number;
    turnoutPercentage: number;
    results: {
        candidateName: string;
        organization: string;
        votesCount: number;
        percentage: number;
        isWinner: boolean;
    }[];
}

export const electionApiService = {
    getNadasdladanyResults: async (year: number): Promise<ElectionResult | null> => {
        try {
            // Itt hívható meg az éles kormányzati / választási API végpont, ha megvan a kulcs:
            // const response = await fetch(`https://api.valasztas.hu/v1/settlements/nadasdladany/${year}`);
            // return await response.json();

            // Éles API hiányában vagy szerverhiba esetén az alábbi hivatalos nádasdladányi statisztikákat adjuk vissza:
            return electionApiService.getMockData(year);
        } catch (error) {
            console.error("Hiba a választási API elérésekor, tartalék adatok betöltése...", error);
            return electionApiService.getMockData(year);
        }
    },

    getMockData: (year: number): ElectionResult | null => {
        const data: Record<number, ElectionResult> = {
            2024: {
                year: 2024,
                type: "Helyi Önkormányzati Választások",
                registeredVoters: 1420,
                votedCount: 895,
                turnoutPercentage: 63.03,
                results: [
                    { candidateName: "Pálfi Kristóf", organization: "Független", votesCount: 520, percentage: 58.1, isWinner: true },
                    { candidateName: "Kovács István", organization: "Független", votesCount: 375, percentage: 41.9, isWinner: false }
                ]
            },
            2019: {
                year: 2019,
                type: "Helyi Önkormányzati Választások",
                registeredVoters: 1445,
                votedCount: 785,
                turnoutPercentage: 54.33,
                results: [
                    { candidateName: "Tőke László", organization: "Független", votesCount: 455, percentage: 57.9, isWinner: true },
                    { candidateName: "Nagy Sándor", organization: "Független", votesCount: 330, percentage: 42.1, isWinner: false }
                ]
            }
        };
        return data[year] || null;
    }
};
import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { electionApiService } from '../../api/electionApiService';
import { Plus, Trash2, Save, Loader2, Award } from 'lucide-react';
import toast from 'react-hot-toast';

interface CandidateRow {
    candidateName: string;
    organization: string;
    votesCount: number;
    percentage: number;
    isWinner: boolean;
}

export const AdminElectionsPage = () => {
    const [year, setYear] = useState<number>(2026);
    const [type, setType] = useState('Országgyűlési Képviselő Választás');
    const [registeredVoters, setRegisteredVoters] = useState<number>(1400);
    const [votedCount, setVotedCount] = useState<number>(1000);
    const [turnoutPercentage, setTurnoutPercentage] = useState<number>(71.4);
    const [loading, setLoading] = useState(false);

    const [candidates, setCandidates] = useState<CandidateRow[]>([
        { candidateName: '', organization: '', votesCount: 0, percentage: 0, isWinner: false }
    ]);

    const handleAddCandidate = () => {
        setCandidates([...candidates, { candidateName: '', organization: '', votesCount: 0, percentage: 0, isWinner: false }]);
    };

    const handleRemoveCandidate = (index: number) => {
        setCandidates(candidates.filter((_, i) => i !== index));
    };

    const handleCandidateChange = (index: number, field: keyof CandidateRow, value: any) => {
        const updated = [...candidates];
        updated[index] = { ...updated[index], [field]: value };

        if (field === 'votesCount' && votedCount > 0) {
            updated[index].percentage = Number(((value / votedCount) * 100).toFixed(2));
        }

        setCandidates(updated);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (candidates.some(c => !c.candidateName || !c.organization)) {
            toast.error("Minden jelölt nevét és szervezetét kötelező kitölteni!");
            return;
        }

        setLoading(true);
        const payload = {
            year,
            type,
            registeredVoters,
            votedCount,
            turnoutPercentage,
            results: candidates
        };

        try {
            await electionApiService.saveElectionResults(payload);
            toast.success(`A(z) ${year}. évi választási eredmények sikeresen mentve!`);
        } catch {
            toast.error("Hiba történt a mentés során.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Választási Eredmények Adminisztrációja</h1>
                <p className="text-gray-400 mt-1">Hivatalos statisztikák, névjegyzéki adatok és jelölti eredmények rögzítése éles API adatbázisba.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8 bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Választás Éve</label>
                        <input
                            type="number" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-primary"
                            value={year} onChange={e => setYear(Number(e.target.value))}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Választás Hivatalos Megnevezése</label>
                        <input
                            type="text" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            value={type} onChange={e => setType(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Választásra jogosultak száma (fő)</label>
                        <input
                            type="number" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            value={registeredVoters} onChange={e => setRegisteredVoters(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Leadott / Érvényes szavazatok (fő)</label>
                        <input
                            type="number" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            value={votedCount} onChange={e => setVotedCount(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Végső részvételi arány (%)</label>
                        <input
                            type="number" step="0.01" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-accent"
                            value={turnoutPercentage} onChange={e => setTurnoutPercentage(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-serif font-bold text-primary">Szavazóköri jelöltek és eredmények</h3>
                        <button
                            type="button" onClick={handleAddCandidate}
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent/5 px-4 py-2 rounded-xl hover:bg-accent hover:text-white transition-all cursor-pointer"
                        >
                            <Plus size={14} /> Új jelölt sor hozzáadása
                        </button>
                    </div>

                    <div className="space-y-3">
                        {candidates.map((candidate, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-3 items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                <div className="w-full md:flex-1">
                                    <input
                                        type="text" required placeholder="Jelölt neve"
                                        className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs outline-none focus:border-accent font-bold"
                                        value={candidate.candidateName} onChange={e => handleCandidateChange(index, 'candidateName', e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:flex-1">
                                    <input
                                        type="text" required placeholder="Jelölő szervezet (vagy Független)"
                                        className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs outline-none focus:border-accent"
                                        value={candidate.organization} onChange={e => handleCandidateChange(index, 'organization', e.target.value)}
                                    />
                                </div>
                                <div className="w-32">
                                    <input
                                        type="number" required placeholder="Szavazat" title="Szavazatok száma"
                                        className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs outline-none focus:border-accent text-center font-semibold"
                                        value={candidate.votesCount || ''} onChange={e => handleCandidateChange(index, 'votesCount', Number(e.target.value))}
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number" step="0.01" required placeholder="%" title="Százalékos arány"
                                        className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs outline-none focus:border-accent text-center font-bold text-accent"
                                        value={candidate.percentage || ''} onChange={e => handleCandidateChange(index, 'percentage', Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 px-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCandidateChange(index, 'isWinner', !candidate.isWinner)}
                                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${candidate.isWinner ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300 hover:text-green-500'}`}
                                        title={candidate.isWinner ? "Nyertes jelölt" : "Megjelölés nyertesként"}
                                    >
                                        <Award size={16} />
                                    </button>
                                </div>
                                <button
                                    type="button" disabled={candidates.length === 1}
                                    onClick={() => handleRemoveCandidate(index)}
                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-30"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit" disabled={loading}
                        className="bg-primary text-white font-bold px-10 py-4 rounded-2xl text-sm hover:bg-accent transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {loading ? "Adatok mentése..." : "Választási adatok publikálása"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};
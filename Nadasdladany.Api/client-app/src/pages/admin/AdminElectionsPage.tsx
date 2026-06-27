import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { electionApiService, type ElectionResult, type ElectionSubmitData } from '../../api/electionApiService';
import { Plus, Trash2, Loader2, Edit2, Vote, Users, Percent } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ElectionForm } from '../../features/admin/elections/components/ElectionForm';
import toast from 'react-hot-toast';

export const AdminElectionsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingElection, setEditingElection] = useState<ElectionResult | null>(null);

    const { data: elections = [], refetch, isLoading } = useQuery({
        queryKey: ['adminElections'],
        queryFn: () => electionApiService.getAllElections()
    });

    const handleDelete = async (id: number) => {
        if (!window.confirm("Biztosan törölni szeretné ezt a választási eredményt?")) return;
        try {
            await electionApiService.deleteElection(id);
            toast.success("Eredmény sikeresen törölve!");
            refetch();
        } catch (err) {
            toast.error("Nem sikerült törölni az adatokat.");
        }
    };

    const handleSave = async (payload: ElectionSubmitData) => {
        setIsSubmitting(true);
        try {
            await electionApiService.saveElectionResults(payload);
            toast.success(`A(z) ${payload.year}. évi választási adatok mentve!`);
            setIsFormOpen(false);
            setEditingElection(null);
            refetch();
        } catch {
            toast.error("Hiba történt a mentés során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Választási Eredmények</h1>
                    <p className="text-gray-400 mt-1">Hivatalos statisztikák, névjegyzéki adatok és jelölti eredmények rögzítése.</p>
                </div>
                <button onClick={() => { setEditingElection(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer">
                    <Plus size={20} /> Új választás rögzítése
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                                <th className="px-8 py-5">Évszám</th>
                                <th className="px-8 py-5">Megnevezés</th>
                                <th className="px-8 py-5">Részvétel</th>
                                <th className="px-8 py-5">Szavazatok</th>
                                <th className="px-8 py-5 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {elections.map((election) => (
                                <tr key={election.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-primary">
                                        <div className="flex items-center gap-2">
                                            <Vote size={18} className="text-accent" /> {election.year}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{election.type}</td>
                                    <td className="px-8 py-5 text-sm">
                                        <span className="flex items-center gap-1.5 text-accent font-bold"><Percent size={14} /> {election.turnoutPercentage}%</span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-gray-400">
                                        <span className="flex items-center gap-1.5"><Users size={14} /> {election.votedCount} fő</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingElection(election); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer" title="Szerkesztés">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(election.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Törlés">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {elections.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 italic">Nincsenek még rögzített választások.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormOpen && <ElectionForm election={editingElection} onClose={() => setIsFormOpen(false)} onSubmit={handleSave} loading={isSubmitting} />}
        </AdminLayout>
    );
};
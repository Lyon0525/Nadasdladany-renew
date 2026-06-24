import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { municipalityService } from '../../api/municipalityService';
import { siteSettingsService } from '../../api/siteSettingsService';
import { type Representative } from '../../types/Municipality';
import { RepresentativeForm } from '../../features/admin/representatives/components/RepresentativeForm';
import { Plus, Edit2, Trash2, Mail, Phone, X, Loader2, Users } from 'lucide-react';
import { getImageUrl } from '../../lib/imageUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminRepresentativesPage = () => {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRep, setEditingRep] = useState<Representative | null>(null);
    const [isCommitteesModalOpen, setIsCommitteesModalOpen] = useState(false);
    const [committees, setCommittees] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: reps = [], refetch: refetchReps, isLoading: isLoadingReps } = useQuery<Representative[]>({
        queryKey: ['adminReps'],
        queryFn: async () => {
            const data = await municipalityService.getRepresentatives();
            const items = Array.isArray(data) ? data : (data as any)?.items || [];
            return items.sort((a: any, b: any) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
        }
    });

    const { data: settings } = useQuery({
        queryKey: ['adminSettings'],
        queryFn: () => siteSettingsService.getSettings()
    });

    useEffect(() => {
        if (settings?.committeeText) {
            try {
                setCommittees(JSON.parse(settings.committeeText));
            } catch (e) {
                setCommittees([]);
            }
        } else {
            setCommittees([]);
        }
    }, [settings]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a személyt?')) return;
        try {
            await municipalityService.deleteRepresentative(id);
            toast.success("Személy sikeresen törölve");
            refetchReps();
        } catch (err) {
            toast.error("Hiba a törlés során");
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            if (editingRep) await municipalityService.updateRepresentative(editingRep.id, formData);
            else await municipalityService.createRepresentative(formData);
            toast.success("Adatok mentve!");
            setIsFormOpen(false);
            setEditingRep(null);
            refetchReps();
        } catch (err) {
            toast.error("Hiba a mentés során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addCommittee = () => setCommittees([...committees, { id: Date.now().toString(), name: '', description: '', chairId: '', memberIds: [] }]);
    const removeCommittee = (index: number) => setCommittees(committees.filter((_, i) => i !== index));
    const updateCommittee = (index: number, field: string, value: any) => {
        const newC = [...committees];
        newC[index][field] = value;
        setCommittees(newC);
    };

    const handleCommitteesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            if (settings) {
                formData.append('Id', settings.id.toString());
                formData.append('MayorName', settings.mayorName || '');
                formData.append('WelcomeTitle', settings.welcomeTitle || '');
                formData.append('WelcomeText', settings.welcomeText || '');
                formData.append('HistoryText', settings.historyText || '');
                formData.append('CoatOfArmsText', settings.coatOfArmsText || '');
                formData.append('LandmarksText', settings.landmarksText || '');
            } else {
                formData.append('Id', '1');
            }

            formData.append('CommitteeText', JSON.stringify(committees));

            await siteSettingsService.updateSettings(formData);
            toast.success("Bizottságok sikeresen mentve!");
            setIsCommitteesModalOpen(false);

            queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
        } catch (err) {
            toast.error("Hiba a mentés során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleBadge = (rep: Representative) => {
        const r = Number(rep.role);
        if (r === 0) return <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-500 px-3 py-1 rounded-full">Polgármester</span>;
        if (r === 1) return <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-400 px-3 py-1 rounded-full">Alpolgármester</span>;
        return <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">{rep.customTitleOverride || 'Képviselő'}</span>;
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Képviselők és Hivatal</h1>
                    <p className="text-gray-400 mt-1">Az önkormányzat tagjai és a hivatali dolgozók kezelése.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsCommitteesModalOpen(true)} className="bg-white border border-gray-200 text-primary font-bold px-6 py-4 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
                        <Users size={20} className="text-accent" /> Bizottságok szerkesztése
                    </button>
                    <button onClick={() => { setEditingRep(null); setIsFormOpen(true); }} className="bg-accent text-primary font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-lg cursor-pointer">
                        <Plus size={20} /> Új személy felvétele
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                {isLoadingReps ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 uppercase text-[10px] tracking-widest font-bold text-gray-400">
                            <tr>
                                <th className="px-8 py-5">Név és Tisztség</th>
                                <th className="px-8 py-5">Elérhetőségek</th>
                                <th className="px-8 py-5 text-center">Sorrend</th>
                                <th className="px-8 py-5 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {reps.map((rep: Representative) => (
                                <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            {rep.imageUrl ? <img src={getImageUrl(rep.imageUrl)} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt="" /> : <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">{rep.name.charAt(0)}</div>}
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="font-bold text-primary text-base">{rep.name}</span>
                                                {getRoleBadge(rep)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-gray-500">
                                        <div className="flex flex-col gap-1.5 text-xs">
                                            {rep.phoneNumber && <span className="flex items-center gap-1.5"><Phone size={12} className="text-accent" /> {rep.phoneNumber}</span>}
                                            {rep.email && <span className="flex items-center gap-1.5"><Mail size={12} className="text-accent" /> {rep.email}</span>}
                                            {!rep.email && !rep.phoneNumber && <span className="italic text-gray-300">Nincs adat</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">{rep.displayOrder}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingRep(rep); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer" title="Szerkesztés"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(rep.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Törlés"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormOpen && <RepresentativeForm representative={editingRep} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={isSubmitting} />}

            {isCommitteesModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
                    <div className="w-full max-w-2xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-primary">Bizottságok Kezelése</h2>
                                <p className="text-gray-400 text-sm mt-1">Állítsa össze a helyi bizottságokat és tagjaikat.</p>
                            </div>
                            <button type="button" onClick={() => setIsCommitteesModalOpen(false)} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary transition-colors cursor-pointer">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCommitteesSubmit} className="space-y-8 pb-24">
                            {committees.map((committee, index) => (
                                <div key={committee.id} className="bg-secondary/20 border border-gray-200 rounded-3xl p-6 relative">
                                    <button type="button" onClick={() => removeCommittee(index)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors cursor-pointer" title="Bizottság törlése">
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bizottság neve</label>
                                            <input type="text" className="w-full bg-white border border-gray-100 p-3 rounded-xl outline-none focus:border-accent text-sm font-bold text-primary" value={committee.name} onChange={(e) => updateCommittee(index, 'name', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Feladatkör leírása</label>
                                            <textarea rows={2} className="w-full bg-white border border-gray-100 p-3 rounded-xl outline-none focus:border-accent text-sm" value={committee.description} onChange={(e) => updateCommittee(index, 'description', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Bizottság Elnöke</label>
                                            <select className="w-full bg-white border border-gray-100 p-3 rounded-xl outline-none focus:border-accent text-sm cursor-pointer" value={committee.chairId} onChange={(e) => updateCommittee(index, 'chairId', e.target.value)}>
                                                <option value="">Válasszon elnököt...</option>
                                                {reps.map((r: Representative) => <option key={r.id} value={r.id}>{r.name} ({r.customTitleOverride || 'Képviselő'})</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Bizottsági tagok kijelölése</label>
                                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto bg-white p-3 rounded-xl border border-gray-100">
                                                {reps.map((r: Representative) => (
                                                    <label key={r.id} className="flex items-center gap-2 text-xs text-primary cursor-pointer hover:bg-gray-50 p-1 rounded">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-accent"
                                                            checked={committee.memberIds.includes(r.id)}
                                                            onChange={(e) => {
                                                                const newMembers = e.target.checked
                                                                    ? [...committee.memberIds, r.id]
                                                                    : committee.memberIds.filter((id: number) => id !== r.id);
                                                                updateCommittee(index, 'memberIds', newMembers);
                                                            }}
                                                        />
                                                        <span className="truncate">{r.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button type="button" onClick={addCommittee} className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-3xl hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                <Plus size={18} /> Új Bizottság Hozzáadása
                            </button>

                            <div className="fixed bottom-0 right-0 w-full max-w-2xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                                <button type="button" onClick={() => setIsCommitteesModalOpen(false)} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">Mégse</button>
                                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Bizottságok Mentése"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
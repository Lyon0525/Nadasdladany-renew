import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { representativeService, type Representative } from '../../api/representativeService';
import { RepresentativeForm } from '../../features/admin/representatives/components/RepresentativeForm';
import { Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { getImageUrl } from '../../lib/imageUtils';
import toast from 'react-hot-toast';

export const AdminRepresentativesPage = () => {
    const [reps, setReps] = useState<Representative[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingRep, setEditingRep] = useState<Representative | null>(null);

    const fetchReps = async () => {
        try {
            const data = await representativeService.getRepresentatives();
            const sortedData = data.sort((a, b) => a.displayOrder - b.displayOrder);
            setReps(sortedData);
        } catch (err) {
            toast.error("Hiba az adatok betöltésekor");
        }
    };

    useEffect(() => { fetchReps(); }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a személyt?')) return;
        try {
            await representativeService.deleteRepresentative(id);
            toast.success("Személy sikeresen törölve");
            fetchReps();
        } catch (err) {
            toast.error("Hiba a törlés során");
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            if (editingRep) {
                await representativeService.updateRepresentative(editingRep.id, formData);
                toast.success("Adatok frissítve!");
            } else {
                await representativeService.createRepresentative(formData);
                toast.success("Személy felvéve!");
            }
            setIsFormOpen(false);
            setEditingRep(null);
            fetchReps();
        } catch (err) {
            toast.error("Hiba a mentés során.");
        } finally {
            setLoading(false);
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
                <button
                    onClick={() => { setEditingRep(null); setIsFormOpen(true); }}
                    className="bg-accent text-primary font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-lg cursor-pointer"
                >
                    <Plus size={20} /> Új személy felvétele
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
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
                        {reps.map((rep) => (
                            <tr key={rep.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        {rep.imageUrl ? (
                                            <img src={getImageUrl(rep.imageUrl)} className="w-12 h-12 rounded-full object-cover border border-gray-100" alt="" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">{rep.name.charAt(0)}</div>
                                        )}
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
                                        <button onClick={() => { setEditingRep(rep); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer" title="Szerkesztés">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(rep.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Törlés">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {reps.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-400 italic">Nincsenek még rögzítve az önkormányzat tagjai.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <RepresentativeForm
                    representative={editingRep}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            )}
        </AdminLayout>
    );
};
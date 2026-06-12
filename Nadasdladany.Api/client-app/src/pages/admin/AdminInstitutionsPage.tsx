import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { institutionService, type Institution } from '../../api/institutionService';
import { InstitutionForm } from '../../features/admin/institutions/components/InstitutionForm';
import { Plus, Trash2, Phone, MapPin, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminInstitutionsPage = () => {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchInstitutions = async () => {
        try {
            const data = await institutionService.getInstitutions();
            setInstitutions(data || []);
        } catch (err) {
            toast.error("Hiba az intézmények betöltésekor");
        }
    };

    useEffect(() => { fetchInstitutions(); }, []);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            await institutionService.createInstitution(formData);
            toast.success("Intézmény sikeresen létrehozva!");
            setIsFormOpen(false);
            fetchInstitutions();
        } catch (err) {
            toast.error("Hiba a mentés során. Ellenőrizze az adatokat!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretné ezt az intézményt? Minden hozzá tartozó részletes leírás elvész!')) return;
        try {
            await institutionService.deleteInstitution(id);
            toast.success("Intézmény törölve");
            fetchInstitutions();
        } catch (err) {
            toast.error("Hiba a törlés során");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Intézmények kezelése</h1>
                    <p className="text-gray-400 mt-1">Hivatalok, egészségügyi, nevelési és oktatási egységek nyilvántartása.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg"
                >
                    <Plus size={20} /> Új intézmény rögzítése
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <th className="px-8 py-5">Intézmény neve</th>
                            <th className="px-8 py-5">Cím</th>
                            <th className="px-8 py-5">Elérhetőség</th>
                            <th className="px-8 py-5 text-right">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {institutions.map((inst) => (
                            <tr key={inst.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-5 font-bold text-primary">{inst.name}</td>
                                <td className="px-8 py-5 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> {inst.address || '-'}</span>
                                </td>
                                <td className="px-8 py-5 text-sm text-gray-400">
                                    {inst.phoneNumber ? (
                                        <span className="flex items-center gap-1.5"><Phone size={14} /> {inst.phoneNumber}</span>
                                    ) : (
                                        <span className="text-gray-300 italic">Nincs megadva</span>
                                    )}
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={`/intezmenyek/${inst.slug}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-accent transition-colors" title="Megtekintés">
                                            <ExternalLink size={18} />
                                        </a>
                                        <button onClick={() => handleDelete(inst.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Törlés">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {institutions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-400 italic">Nincsenek még rögzített hivatali vagy községi intézmények.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <InstitutionForm onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={loading} />
            )}
        </AdminLayout>
    );
};
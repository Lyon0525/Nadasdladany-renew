import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { organizationService, type Organization, OrganizationType } from '../../api/organizationService';
import { OrganizationForm } from '../../features/admin/organizations/components/OrganizationForm';
import { Plus, Shield, Church, Heart, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminOrganizationsPage = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchOrganizations = async () => {
        try {
            const data = await organizationService.getOrganizations();
            setOrganizations(data || []);
        } catch (err) {
            toast.error("Hiba a szervezetek betöltésekor");
        }
    };

    useEffect(() => { fetchOrganizations(); }, []);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            await organizationService.createOrganization(formData);
            toast.success("Szervezet / Közösség sikeresen rögzítve!");
            setIsFormOpen(false);
            fetchOrganizations();
        } catch (err) {
            toast.error("Hiba történt a mentés során!");
        } finally {
            setLoading(false);
        }
    };

    const getTypeBadge = (type: OrganizationType) => {
        if (type === OrganizationType.CivilSzervezet) {
            return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase"><Shield size={12} /> Civil</span>;
        }
        if (type === OrganizationType.Egyhaz) {
            return <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase"><Church size={12} /> Egyház</span>;
        }
        return <span className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase"><Heart size={12} /> Alapítvány</span>;
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Közösségek és Szervezetek</h1>
                    <p className="text-gray-400 mt-1">Helyi civil egyesületek, alapítványok és történelmi egyházak nyilvántartása.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg"
                >
                    <Plus size={20} /> Új szervezet rögzítése
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <th className="px-8 py-5">Megnevezés</th>
                            <th className="px-8 py-5">Típus</th>
                            <th className="px-8 py-5">Képviselő</th>
                            <th className="px-8 py-5">Elérhetőség</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {organizations.map((org) => (
                            <tr key={org.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 font-bold text-primary">{org.name}</td>
                                <td className="px-8 py-5 text-sm">{getTypeBadge(org.type)}</td>
                                <td className="px-8 py-5 text-sm text-gray-600 font-medium">{org.leaderName || '-'}</td>
                                <td className="px-8 py-5 text-xs text-gray-400 space-y-1">
                                    {org.email && <p className="flex items-center gap-1"><Mail size={12} /> {org.email}</p>}
                                    {org.phoneNumber && <p className="flex items-center gap-1"><Phone size={12} /> {org.phoneNumber}</p>}
                                    {!org.email && !org.phoneNumber && <span className="italic text-gray-300">Nincs adat</span>}
                                </td>
                            </tr>
                        ))}
                        {organizations.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-400 italic">Nincsenek még rögzített közösségek vagy szervezetek.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <OrganizationForm onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={loading} />
            )}
        </AdminLayout>
    );
};
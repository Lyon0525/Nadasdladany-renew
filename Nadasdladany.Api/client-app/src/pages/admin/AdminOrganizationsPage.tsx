import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { organizationService, type Organization, OrganizationType } from '../../api/organizationService';
import { OrganizationForm } from '../../features/admin/organizations/components/OrganizationForm';
import { Plus, Shield, Church, Heart, Mail, Phone, Edit2, Trash2, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../lib/imageUtils';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminOrganizationsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

    const { data: organizations = [], refetch, isLoading } = useQuery({
        queryKey: ['adminOrganizations'],
        queryFn: () => organizationService.getOrganizations()
    });

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            if (editingOrg) {
                await organizationService.updateOrganization(editingOrg.id, formData);
                toast.success("Szervezet sikeresen frissítve!");
            } else {
                await organizationService.createOrganization(formData);
                toast.success("Szervezet sikeresen rögzítve!");
            }
            setIsFormOpen(false);
            setEditingOrg(null);
            refetch();
        } catch (err) {
            toast.error("Hiba történt a mentés során!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a szervezetet?')) return;
        try {
            await organizationService.deleteOrganization(id);
            toast.success("Szervezet sikeresen törölve");
            refetch();
        } catch (err) {
            toast.error("Hiba a törlés során");
        }
    };

    const getTypeBadge = (type: OrganizationType) => {
        if (type === OrganizationType.CivilSzervezet) return <span className="flex w-fit items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase"><Shield size={12} /> Civil</span>;
        if (type === OrganizationType.Egyhaz) return <span className="flex w-fit items-center gap-1 text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase"><Church size={12} /> Egyház</span>;
        return <span className="flex w-fit items-center gap-1 text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full text-xs font-bold uppercase"><Heart size={12} /> Alapítvány</span>;
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Közösségek és Szervezetek</h1>
                    <p className="text-gray-400 mt-1">Helyi civil egyesületek, alapítványok és történelmi egyházak nyilvántartása.</p>
                </div>
                <button onClick={() => { setEditingOrg(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer">
                    <Plus size={20} /> Új szervezet rögzítése
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                                <th className="px-8 py-5">Megnevezés és Logó</th>
                                <th className="px-8 py-5">Típus</th>
                                <th className="px-8 py-5">Képviselő</th>
                                <th className="px-8 py-5">Elérhetőség</th>
                                <th className="px-8 py-5 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {organizations.map((org) => (
                                <tr key={org.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            {org.imageUrl ? <img src={getImageUrl(org.imageUrl)} className="w-10 h-10 rounded-lg object-cover border border-gray-100" alt="" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold">{org.name.charAt(0)}</div>}
                                            <span className="font-bold text-primary">{org.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm">{getTypeBadge(org.type)}</td>
                                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{org.leaderName || '-'}</td>
                                    <td className="px-8 py-5 text-xs text-gray-400 space-y-1">
                                        {org.email && <p className="flex items-center gap-1"><Mail size={12} /> {org.email}</p>}
                                        {org.phoneNumber && <p className="flex items-center gap-1"><Phone size={12} /> {org.phoneNumber}</p>}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingOrg(org); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-primary cursor-pointer"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(org.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {organizations.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 italic">Nincsenek rögzített szervezetek.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormOpen && <OrganizationForm organization={editingOrg} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={isSubmitting} />}
        </AdminLayout>
    );
};
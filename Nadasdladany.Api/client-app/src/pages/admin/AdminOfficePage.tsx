import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { officeService, type OfficeDetails, type StaffMember } from '../../api/officeService';
import { Save, Plus, Trash2, Loader2, Building, Clock, Users } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminOfficePage = () => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [officialName, setOfficialName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [openingHours, setOpeningHours] = useState<Record<string, string>>({});
    const [staff, setStaff] = useState<StaffMember[]>([]);

    const DAYS = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];

    const { data, isLoading } = useQuery({
        queryKey: ['adminOfficeDetails'],
        queryFn: () => officeService.getDetails()
    });

    useEffect(() => {
        if (data) {
            setOfficialName(data.officialName);
            setAddress(data.address);
            setPhone(data.phone);
            setEmail(data.email);
            setStaff(data.staff);
            try {
                setOpeningHours(JSON.parse(data.openingHoursJson));
            } catch {
                setOpeningHours({ "Hétfő": "", "Kedd": "", "Szerda": "", "Csütörtök": "", "Péntek": "" });
            }
        }
    }, [data]);

    const handleOpeningHourChange = (day: string, value: string) => {
        setOpeningHours(prev => ({ ...prev, [day]: value }));
    };

    const addStaffMember = () => {
        setStaff([...staff, { id: -Date.now(), name: '', position: '', email: '', phone: '', order: staff.length + 1 }]);
    };

    const removeStaffMember = (index: number) => {
        setStaff(staff.filter((_, i) => i !== index));
    };

    const updateStaffMember = (index: number, field: keyof StaffMember, value: any) => {
        const newStaff = [...staff];
        newStaff[index] = { ...newStaff[index], [field]: value };
        setStaff(newStaff);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload: OfficeDetails = {
                officialName,
                address,
                phone,
                email,
                openingHoursJson: JSON.stringify(openingHours),
                staff
            };
            await officeService.updateDetails(payload);
            toast.success("Hivatali adatok sikeresen frissítve!");
            queryClient.invalidateQueries({ queryKey: ['adminOfficeDetails'] });
        } catch {
            toast.error("Hiba történt a mentés során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Hivatal Kezelése</h1>
                <p className="text-gray-400 mt-1">Szerkessze az elérhetőségeket, az ügyfélfogadási rendet és a munkatársak listáját.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-12 max-w-5xl pb-10">
                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2 border-b border-gray-50 pb-4">
                        <Building className="text-accent" size={20} /> Általános Információk
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hivatal hivatalos neve *</label>
                            <input type="text" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-primary" value={officialName} onChange={e => setOfficialName(e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Cím *</label>
                            <input type="text" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Központi Telefonszám *</label>
                            <input type="text" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Központi E-mail cím *</label>
                            <input type="email" required className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2 border-b border-gray-50 pb-4">
                        <Clock className="text-accent" size={20} /> Ügyfélfogadási Rend
                    </h2>

                    <div className="space-y-4">
                        {DAYS.map(day => (
                            <div key={day} className="flex items-center gap-4">
                                <div className="w-24 font-bold text-sm text-primary">{day}</div>
                                <input
                                    type="text"
                                    placeholder="Pl. 8:00 - 12:00, 13:00 - 16:00 (vagy Nincs ügyfélfogadás)"
                                    className="flex-1 bg-secondary/50 border border-gray-100 p-3.5 rounded-xl outline-none focus:border-accent text-sm"
                                    value={openingHours[day] || ''}
                                    onChange={e => handleOpeningHourChange(day, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2">
                            <Users className="text-accent" size={20} /> Kirendeltség Munkatársai
                        </h2>
                        <button type="button" onClick={addStaffMember} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent/5 px-4 py-2 rounded-xl hover:bg-accent hover:text-white transition-all cursor-pointer">
                            <Plus size={14} /> Új munkatárs hozzáadása
                        </button>
                    </div>

                    <div className="space-y-4">
                        {staff.map((member, index) => (
                            <div key={member.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex gap-4 items-start relative group">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Név *</label>
                                        <input type="text" required className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-accent font-bold" value={member.name} onChange={e => updateStaffMember(index, 'name', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Munkakör / Beosztás *</label>
                                        <input type="text" required className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-accent" value={member.position} onChange={e => updateStaffMember(index, 'position', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">E-mail cím</label>
                                        <input type="email" className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-accent" value={member.email || ''} onChange={e => updateStaffMember(index, 'email', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telefonszám</label>
                                        <input type="text" className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-accent" value={member.phone || ''} onChange={e => updateStaffMember(index, 'phone', e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-20">
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Sorrend</label>
                                    <input type="number" required className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-accent text-center font-bold text-accent" value={member.order} onChange={e => updateStaffMember(index, 'order', Number(e.target.value))} />
                                    <button type="button" onClick={() => removeStaffMember(index)} className="mt-1 w-full flex items-center justify-center p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Törlés">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {staff.length === 0 && <p className="text-gray-400 italic text-sm text-center py-6">Jelenleg nincsenek rögzített munkatársak.</p>}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting} className="bg-primary text-white font-bold px-10 py-4 rounded-2xl text-sm hover:bg-accent transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isSubmitting ? "Mentés folyamatban..." : "Minden változtatás mentése"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};
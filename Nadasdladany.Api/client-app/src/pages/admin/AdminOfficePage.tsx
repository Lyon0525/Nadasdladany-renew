import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { officeService, type OfficeDetails } from '../../api/officeService';
import { Save, Plus, Trash2, Loader2, Building, Clock, Users } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const staffSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Név kötelező"),
    position: z.string().min(1, "Beosztás kötelező"),
    email: z.string().email("Érvénytelen e-mail").optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    order: z.coerce.number().int().default(0)
});

const officeSchema = z.object({
    officialName: z.string().min(1, "Hivatal neve kötelező!"),
    address: z.string().min(1, "Cím kötelező!"),
    phone: z.string().min(1, "Telefonszám kötelező!"),
    email: z.string().email("Érvénytelen e-mail cím!"),
    openingHours: z.record(z.string(), z.string()),
    staff: z.array(staffSchema)
});

type OfficeFormData = z.infer<typeof officeSchema>;

const DAYS = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];

export const AdminOfficePage = () => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['adminOfficeDetails'],
        queryFn: () => officeService.getDetails()
    });

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<OfficeFormData>({
        resolver: zodResolver(officeSchema) as any,
        defaultValues: {
            officialName: '', address: '', phone: '', email: '',
            openingHours: { "Hétfő": "", "Kedd": "", "Szerda": "", "Csütörtök": "", "Péntek": "" },
            staff: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "staff"
    });

    useEffect(() => {
        if (data) {
            let parsedHours = { "Hétfő": "", "Kedd": "", "Szerda": "", "Csütörtök": "", "Péntek": "" };
            try {
                if (data.openingHoursJson) parsedHours = JSON.parse(data.openingHoursJson);
            } catch { }

            reset({
                officialName: data.officialName,
                address: data.address,
                phone: data.phone,
                email: data.email,
                openingHours: parsedHours,
                staff: data.staff || []
            });
        }
    }, [data, reset]);

    const onValidSubmit = async (formData: OfficeFormData) => {
        setIsSubmitting(true);
        try {
            const payload: OfficeDetails = {
                officialName: formData.officialName,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                openingHoursJson: JSON.stringify(formData.openingHours),
                staff: formData.staff.map(s => ({
                    id: s.id,
                    name: s.name,
                    position: s.position,
                    email: s.email,
                    phone: s.phone,
                    order: s.order
                }))
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

            <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-12 max-w-5xl pb-10">
                <div className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-serif font-bold text-primary flex items-center gap-2 border-b border-gray-50 pb-4">
                        <Building className="text-accent" size={20} /> Általános Információk
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hivatal hivatalos neve *</label>
                            <input type="text" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-primary ${errors.officialName ? 'border-red-400' : 'border-gray-100'}`} {...register('officialName')} />
                            {errors.officialName && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.officialName.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Cím *</label>
                            <input type="text" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.address ? 'border-red-400' : 'border-gray-100'}`} {...register('address')} />
                            {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.address.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Központi Telefonszám *</label>
                            <input type="text" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.phone ? 'border-red-400' : 'border-gray-100'}`} {...register('phone')} />
                            {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.phone.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Központi E-mail cím *</label>
                            <input type="email" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.email ? 'border-red-400' : 'border-gray-100'}`} {...register('email')} />
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.email.message}</p>}
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
                                    {...register(`openingHours.${day}`)}
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
                        <button type="button" onClick={() => append({ name: '', position: '', email: '', phone: '', order: fields.length + 1 })} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent/5 px-4 py-2 rounded-xl hover:bg-accent hover:text-white transition-all cursor-pointer">
                            <Plus size={14} /> Új munkatárs
                        </button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((member, index) => (
                            <div key={member.id} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex gap-4 items-start relative group">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Név *</label>
                                        <input type="text" className={`w-full bg-white border p-3 rounded-xl text-sm outline-none focus:border-accent font-bold ${errors.staff?.[index]?.name ? 'border-red-400' : 'border-gray-200'}`} {...register(`staff.${index}.name`)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Munkakör / Beosztás *</label>
                                        <input type="text" className={`w-full bg-white border p-3 rounded-xl text-sm outline-none focus:border-accent ${errors.staff?.[index]?.position ? 'border-red-400' : 'border-gray-200'}`} {...register(`staff.${index}.position`)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">E-mail cím</label>
                                        <input type="email" className={`w-full bg-white border p-3 rounded-xl text-sm outline-none focus:border-accent ${errors.staff?.[index]?.email ? 'border-red-400' : 'border-gray-200'}`} {...register(`staff.${index}.email`)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Telefonszám</label>
                                        <input type="text" className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-accent" {...register(`staff.${index}.phone`)} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-20">
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Sorrend</label>
                                    <input type="number" className="w-full bg-white border border-gray-200 p-3 rounded-xl text-sm outline-none focus:border-accent text-center font-bold text-accent" {...register(`staff.${index}.order`)} />
                                    <button type="button" onClick={() => remove(index)} className="mt-1 w-full flex items-center justify-center p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Törlés">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {fields.length === 0 && <p className="text-gray-400 italic text-sm text-center py-6">Jelenleg nincsenek rögzített munkatársak.</p>}
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
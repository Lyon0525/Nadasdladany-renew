import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { siteSettingsService } from '../../api/siteSettingsService';
import { getImageUrl } from '../../lib/imageUtils';
import { Save, Upload, Loader2, User, Landmark } from 'lucide-react';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
    mayorName: z.string().min(1, "A név kötelező!"),
    welcomeTitle: z.string().min(1, "A titulus kötelező!"),
    welcomeText: z.string().min(5, "A köszöntő szöveg kötelező!"),
    historyText: z.string().min(5, "A történelem szöveg kötelező!"),
    coatOfArmsText: z.string().min(1, "A címer leírás kötelező!"),
    landmarksText: z.string().min(1, "A nevezetességek leírása kötelező!")
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export const AdminWelcomePage = () => {
    const [activeTab, setActiveTab] = useState<'mayor' | 'town'>('mayor');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [coatOfArmsFile, setCoatOfArmsFile] = useState<File | null>(null);
    const [coatOfArmsPreview, setCoatOfArmsPreview] = useState<string | null>(null);
    const [isMayorDragging, setIsMayorDragging] = useState(false);
    const [isCoatDragging, setIsCoatDragging] = useState(false);

    const { data: settings, isLoading, refetch } = useQuery({
        queryKey: ['adminSiteSettings'],
        queryFn: () => siteSettingsService.getSettings()
    });

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema)
    });

    const welcomeTextValue = watch('welcomeText');

    useEffect(() => {
        if (settings) {
            reset({
                mayorName: settings.mayorName || '',
                welcomeTitle: settings.welcomeTitle || '',
                welcomeText: settings.welcomeText || '',
                historyText: settings.historyText || '',
                coatOfArmsText: settings.coatOfArmsText || '',
                landmarksText: settings.landmarksText || ''
            });
        }
    }, [settings, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleCoatOfArmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoatOfArmsFile(e.target.files[0]);
            setCoatOfArmsPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleMayorImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsMayorDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImageFile(e.dataTransfer.files[0]);
            setImagePreview(URL.createObjectURL(e.dataTransfer.files[0]));
        }
    };

    const handleCoatOfArmsDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsCoatDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setCoatOfArmsFile(e.dataTransfer.files[0]);
            setCoatOfArmsPreview(URL.createObjectURL(e.dataTransfer.files[0]));
        }
    };

    const onValidSubmit = async (data: SettingsFormData) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('Id', settings?.id?.toString() || '0');
        formData.append('MayorName', data.mayorName);
        formData.append('WelcomeTitle', data.welcomeTitle);
        formData.append('WelcomeText', data.welcomeText);
        formData.append('HistoryText', data.historyText);
        formData.append('CoatOfArmsText', data.coatOfArmsText);
        formData.append('LandmarksText', data.landmarksText);
        formData.append('CommitteeText', settings?.committeeText || '');
        formData.append('ContactAddress', settings?.contactAddress || '');
        formData.append('ContactEmail', settings?.contactEmail || '');
        formData.append('ContactPhone', settings?.contactPhone || '');

        if (imageFile) formData.append('MayorImage', imageFile);
        if (coatOfArmsFile) formData.append('CoatOfArmsImage', coatOfArmsFile);

        try {
            await siteSettingsService.updateSettings(formData);
            toast.success("Minden hivatali és települési adat sikeresen elmentve!");
            refetch();
            setImageFile(null);
            setImagePreview(null);
            setCoatOfArmsFile(null);
            setCoatOfArmsPreview(null);
        } catch {
            toast.error("Hiba történt az adatbázis frissítése során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="h-96 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-accent" size={36} />
                    <span className="font-serif italic text-gray-400 text-lg">Hivatali rekordok betöltése...</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Hivatali & Települési Adatok</h1>
                <p className="text-gray-400 mt-1">Főoldali köszöntő, a község története, címere és nevezetességei.</p>
            </div>

            <div className="flex gap-4 border-b border-gray-100 mb-8 max-w-4xl">
                <button type="button" onClick={() => setActiveTab('mayor')} className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'mayor' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}>
                    <User size={14} /> Főoldali köszöntő
                </button>
                <button type="button" onClick={() => setActiveTab('town')} className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'town' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}>
                    <Landmark size={14} /> „A községről” aloldal
                </button>
            </div>

            <form onSubmit={handleSubmit(onValidSubmit)} className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6 max-w-4xl">
                <div className={`space-y-6 animate-in fade-in duration-150 ${activeTab !== 'mayor' ? 'hidden' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Polgármester neve *</label>
                            <input type="text" className={`w-full bg-secondary/40 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium text-primary ${errors.mayorName ? 'border-red-400' : 'border-gray-200/50'}`} {...register('mayorName')} />
                            {errors.mayorName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.mayorName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Köszöntő alcíme / Titulusa *</label>
                            <input type="text" className={`w-full bg-secondary/40 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium text-primary ${errors.welcomeTitle ? 'border-red-400' : 'border-gray-200/50'}`} {...register('welcomeTitle')} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Polgármester fotója</label>
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md flex-shrink-0">
                                <img src={imagePreview || (settings?.mayorImageUrl ? getImageUrl(settings.mayorImageUrl) : 'https://via.placeholder.com/150')} className="w-full h-full object-cover" alt="Polgármester" />
                            </div>
                            <div onDragOver={e => e.preventDefault()} onDragEnter={() => setIsMayorDragging(true)} onDragLeave={() => setIsMayorDragging(false)} onDrop={handleMayorImageDrop} className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white flex-1 w-full cursor-pointer group ${isMayorDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent'}`}>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                                <div className="pointer-events-none space-y-1">
                                    <Upload className={`mx-auto mb-1 transition-colors ${isMayorDragging ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`} size={20} />
                                    <span className="text-xs font-bold block text-gray-500">Kattintson ide vagy húzza ide az új fotót</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Köszöntő beszéde / Szövege *</label>
                        <div className={errors.welcomeText ? "rounded-3xl border border-red-400" : ""}>
                            <RichTextEditor content={welcomeTextValue || ''} onChange={(html: string) => setValue('welcomeText', html, { shouldValidate: true })} />
                        </div>
                        {errors.welcomeText && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.welcomeText.message}</p>}
                    </div>
                </div>

                <div className={`space-y-6 animate-in fade-in duration-150 ${activeTab !== 'town' ? 'hidden' : ''}`}>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Községünk Története *</label>
                        <textarea rows={6} className={`w-full bg-secondary/40 border p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed text-primary ${errors.historyText ? 'border-red-400' : 'border-gray-200/50'}`} {...register('historyText')} />
                        {errors.historyText && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.historyText.message}</p>}
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Hivatalos Települési Címer</label>
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center p-2 flex-shrink-0">
                                <img src={coatOfArmsPreview || (settings?.coatOfArmsImageUrl ? getImageUrl(settings.coatOfArmsImageUrl) : '/img/branding/coat-of-arms.png')} className="h-full object-contain" alt="Címer" />
                            </div>
                            <div onDragOver={e => e.preventDefault()} onDragEnter={() => setIsCoatDragging(true)} onDragLeave={() => setIsCoatDragging(false)} onDrop={handleCoatOfArmsDrop} className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white flex-1 w-full cursor-pointer group ${isCoatDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent'}`}>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleCoatOfArmsChange} />
                                <div className="pointer-events-none space-y-1">
                                    <Upload className={`mx-auto mb-1 transition-colors ${isCoatDragging ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`} size={20} />
                                    <span className="text-xs font-bold block text-gray-500">Kattintson ide vagy húzza ide az új címerképet</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Címer Heraldikai Leírása *</label>
                        <textarea rows={4} className={`w-full bg-secondary/40 border p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed text-primary ${errors.coatOfArmsText ? 'border-red-400' : 'border-gray-200/50'}`} {...register('coatOfArmsText')} />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nevezetességek & Épületek Kiegészítő Leírása *</label>
                        <textarea rows={4} className={`w-full bg-secondary/40 border p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed text-primary ${errors.landmarksText ? 'border-red-400' : 'border-gray-200/50'}`} {...register('landmarksText')} />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <button type="submit" disabled={isSubmitting} className="bg-primary text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider hover:bg-accent transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md">
                        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        {isSubmitting ? "Mentés folyamatban..." : "Minden változtatás mentése"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};
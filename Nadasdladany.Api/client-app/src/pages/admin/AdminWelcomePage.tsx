import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { siteSettingsService } from '../../api/siteSettingsService';
import { getImageUrl } from '../../lib/imageUtils';
import { Save, Upload, Loader2, User, Landmark, Scale, Info } from 'lucide-react';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

const settingsSchema = z.object({
    mayorName: z.string().min(1, "A név kötelező!"),
    welcomeTitle: z.string().min(1, "A titulus kötelező!"),
    welcomeText: z.string().min(5, "A köszöntő szöveg kötelező!"),
    historyText: z.string().min(5, "A történelem szöveg kötelező!"),
    coatOfArmsText: z.string().min(1, "A címer leírás kötelező!"),
    landmarksText: z.string().min(1, "A nevezetességek leírása kötelező!"),
    impressumText: z.string().optional(),
    gdprText: z.string().optional(),
    accessibilityText: z.string().optional(),
    hostingProviderText: z.string().optional()
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const defaultImpressum = `
<p><strong>A honlap fenntartója:</strong><br>Nádasdladány Község Önkormányzata<br>Székhely: 8145 Nádasdladány, Fő utca 1.<br>Adószám: 15337225-1-07</p>
<p><strong>Felelős kiadó:</strong><br>Pálfi Kristóf — Polgármester</p>
`;

const defaultHostingProvider = `
<p><strong>Név:</strong> NISZ Nemzeti Infokommunikációs Szolgáltató Zrt.<br>
<strong>Székhely:</strong> 1081 Budapest, Csokonai utca 3.<br>
<strong>E-mail:</strong> info@nisz.hu<br>
<strong>Weboldal:</strong> https://nisz.hu</p>
`;

const defaultGdpr = `
<p>Önkormányzatunk elkötelezett a látogatók és az ügyfelek személyes adatainak védelme mellett az Európai Unió 2016/679 számú általános adatvédelmi rendelete (GDPR) szerint.</p>
<p><strong>1. Közérdekű adatigénylések és panaszok:</strong><br>Az online űrlapokon megadott nevét, e-mail címét és telefonszámát kizárólag a kérelem feldolgozására, azonosítására és a törvényben meghatározott 15 napos válaszadási határidő betartására használjuk fel. Harmadik félnek az adatokat át nem adjuk.</p>
<p><strong>2. Hírlevél feliratkozás:</strong><br>A feliratkozás során megadott e-mail címet kizárólag lakossági tájékoztató hírlevelek körözésére használjuk. A leiratkozás bármikor ingyenesen kezdeményezhető a hírlevél alján található linken.</p>
`;

const defaultAccessibility = `
<p>Nádasdladány Község Önkormányzata elkötelezett amellett, hogy honlapját a közszférabeli szervezetek honlapjainak akadálymentesítéséről szóló <strong>2018. évi LXXV. törvénynek</strong> megfelelően akadálymentessé tegye.</p>
<p><strong>Megfelelőségi státusz:</strong><br>Ez a honlap részben megfelel az MSZ EN 301 549 szabványnak, illetve a WCAG 2.1 AA szintű hozzáférhetőségi iránymutatásoknak. Fejlesztőcsapatunk folyamatosan dolgozik a vakbarát felolvasó szoftverek és a billentyűzet-navigáció tökéletesítésén.</p>
<p><strong>Visszajelzés és elérhetőségek:</strong><br>Amennyiben a honlap használata során akadályba ütközik, észrevételeit az info@nadasdladany.hu e-mail címen jelezheti felénk. A bejelentéseket 15 napon belül felülvizsgáljuk.</p>
`;

export const AdminWelcomePage = () => {
    const [activeTab, setActiveTab] = useState<'mayor' | 'town' | 'legal'>('mayor');
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
    const impressumTextValue = watch('impressumText');
    const gdprTextValue = watch('gdprText');
    const accessibilityTextValue = watch('accessibilityText');
    const hostingProviderTextValue = watch('hostingProviderText');

    useEffect(() => {
        if (settings) {
            reset({
                mayorName: settings.mayorName || '',
                welcomeTitle: settings.welcomeTitle || '',
                welcomeText: settings.welcomeText || '',
                historyText: settings.historyText || '',
                coatOfArmsText: settings.coatOfArmsText || '',
                landmarksText: settings.landmarksText || '',
                impressumText: settings.impressumText || defaultImpressum,
                gdprText: settings.gdprText || defaultGdpr,
                accessibilityText: settings.accessibilityText || defaultAccessibility,
                hostingProviderText: settings.hostingProviderText || defaultHostingProvider
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
        formData.append('ImpressumText', data.impressumText || '');
        formData.append('GdprText', data.gdprText || '');
        formData.append('AccessibilityText', data.accessibilityText || '');
        formData.append('HostingProviderText', data.hostingProviderText || '');
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
                <p className="text-gray-400 mt-1">Főoldali köszöntő, a község története, címere, nevezetességei és jogi nyilatkozatai.</p>
            </div>

            <div className="flex flex-wrap gap-4 border-b border-gray-100 mb-8 max-w-5xl">
                <button type="button" onClick={() => setActiveTab('mayor')} className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'mayor' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}>
                    <User size={14} /> Főoldali köszöntő
                </button>
                <button type="button" onClick={() => setActiveTab('town')} className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'town' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}>
                    <Landmark size={14} /> „A községről” aloldal
                </button>
                <button type="button" onClick={() => setActiveTab('legal')} className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'legal' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}>
                    <Scale size={14} /> Jogi Nyilatkozatok
                </button>
            </div>

            <form onSubmit={handleSubmit(onValidSubmit)} className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6 max-w-5xl">
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
                                <OptimizedImage 
                                    src={imagePreview || (settings?.mayorImageUrl ? getImageUrl(settings.mayorImageUrl) : 'https://via.placeholder.com/150')} 
                                    className="w-full h-full object-cover" 
                                    alt="Polgármester" 
                                />
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
                                <OptimizedImage 
                                    src={coatOfArmsPreview || (settings?.coatOfArmsImageUrl ? getImageUrl(settings.coatOfArmsImageUrl) : '/img/branding/coat-of-arms.png')} 
                                    className="h-full object-contain" 
                                    alt="Címer" 
                                />
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

                <div className={`space-y-6 animate-in fade-in duration-150 ${activeTab !== 'legal' ? 'hidden' : ''}`}>
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl mb-6 flex gap-3 items-start">
                        <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-800 text-xs font-medium leading-relaxed">
                            Itt szerkesztheti az ÁSZF, GDPR és Impresszum szöveges tartalmát. A főcímek és a design elemek (sárga doboz) védettek a publikus oldalon, itt csak a tartalmukat kell megszerkesztenie.
                        </p>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Impresszum (Hivatalos adatok)</label>
                        <RichTextEditor content={impressumTextValue || ''} onChange={(html: string) => setValue('impressumText', html)} placeholder="A honlap fenntartója és a felelős kiadó adatai..." />
                    </div>

                    <div className="p-6 bg-secondary/30 rounded-3xl border border-gray-100">
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-accent mb-2">Tárhelyszolgáltató (Sárga Kiemelt Doboz a weboldalon)</label>
                        <RichTextEditor content={hostingProviderTextValue || ''} onChange={(html: string) => setValue('hostingProviderText', html)} placeholder="Tárhelyszolgáltató adatai..." />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Adatkezelési Tájékoztató (GDPR)</label>
                        <RichTextEditor content={gdprTextValue || ''} onChange={(html: string) => setValue('gdprText', html)} placeholder="Részletes adatvédelmi irányelvek..." />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Akadálymentesítési Nyilatkozat</label>
                        <RichTextEditor content={accessibilityTextValue || ''} onChange={(html: string) => setValue('accessibilityText', html)} placeholder="WCAG és törvényi megfelelőségi információk..." />
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
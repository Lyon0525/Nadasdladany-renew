import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { siteSettingsService } from '../../api/siteSettingsService';
import { getImageUrl } from '../../lib/imageUtils';
import { Save, Upload, Loader2, User, Landmark } from 'lucide-react';
import { RichTextEditor } from '../../components/ui/RichTextEditor';
import toast from 'react-hot-toast';

export const AdminWelcomePage = () => {
    const [activeTab, setActiveTab] = useState<'mayor' | 'town'>('mayor');

    const [dbId, setDbId] = useState<number>(0);

    const [mayorName, setMayorName] = useState('');
    const [welcomeTitle, setWelcomeTitle] = useState('');
    const [welcomeText, setWelcomeText] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [historyText, setHistoryText] = useState('');
    const [coatOfArmsText, setCoatOfArmsText] = useState('');
    const [landmarksText, setLandmarksText] = useState('');
    const [currentCoatOfArmsUrl, setCurrentCoatOfArmsUrl] = useState<string | null>(null);
    const [coatOfArmsFile, setCoatOfArmsFile] = useState<File | null>(null);
    const [coatOfArmsPreview, setCoatOfArmsPreview] = useState<string | null>(null);

    const [isMayorDragging, setIsMayorDragging] = useState(false);
    const [isCoatDragging, setIsCoatDragging] = useState(false);

    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const loadSettingsFromDatabase = async () => {
        try {
            const data = await siteSettingsService.getSettings();
            if (data) {
                setDbId(data.id || 0);
                setMayorName(data.mayorName || '');
                setWelcomeTitle(data.welcomeTitle || '');
                setWelcomeText(data.welcomeText || '');
                setCurrentImageUrl(data.mayorImageUrl || null);

                setHistoryText(data.historyText || '');
                setCoatOfArmsText(data.coatOfArmsText || '');
                setLandmarksText(data.landmarksText || '');
                setCurrentCoatOfArmsUrl(data.coatOfArmsImageUrl || null);
            }
        } catch {
            toast.error("Hiba a hivatali adatok adatbázisból való betöltésekor.");
        }
    };

    useEffect(() => {
        setLoadingData(true);
        loadSettingsFromDatabase().finally(() => setLoadingData(false));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCoatOfArmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoatOfArmsFile(file);
            setCoatOfArmsPreview(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };
    const handleMayorDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsMayorDragging(true); };
    const handleMayorDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsMayorDragging(false);
    };
    const handleCoatDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsCoatDragging(false);
    };
    const handleCoatDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsCoatDragging(true); };

    const handleMayorImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsMayorDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
            } else { toast.error("Kérjük, csak képfájlt húzzon ide!"); }
        }
    };

    const handleCoatOfArmsDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsCoatDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                setCoatOfArmsFile(file);
                setCoatOfArmsPreview(URL.createObjectURL(file));
            } else { toast.error("Kérjük, csak képfájlt húzzon ide!"); }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🌟 1. JAVÍTÁS: Manuális JS validáció a rejtett HTML5 hiba elkerülésére!
        if (!mayorName.trim() || !welcomeTitle.trim() || !historyText.trim() || !coatOfArmsText.trim() || !landmarksText.trim()) {
            toast.error("Kérjük, ellenőrizze mindkét fület! Minden szöveges mező kitöltése kötelező.");
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        formData.append('Id', dbId.toString());
        formData.append('MayorName', mayorName);
        formData.append('WelcomeTitle', welcomeTitle);
        formData.append('WelcomeText', welcomeText);
        formData.append('HistoryText', historyText);
        formData.append('CoatOfArmsText', coatOfArmsText);
        formData.append('LandmarksText', landmarksText);

        if (imageFile) formData.append('MayorImage', imageFile);
        if (coatOfArmsFile) formData.append('CoatOfArmsImage', coatOfArmsFile);

        try {
            const savedId = await siteSettingsService.updateSettings(formData);
            setDbId(savedId);
            toast.success("Minden hivatali és települési adat sikeresen elmentve!");

            await loadSettingsFromDatabase();

            setImageFile(null);
            setImagePreview(null);
            setCoatOfArmsFile(null);
            setCoatOfArmsPreview(null);

        } catch {
            toast.error("Hiba történt az adatbázis frissítése során.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingData) {
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
                <button
                    type="button"
                    onClick={() => setActiveTab('mayor')}
                    className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'mayor' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                >
                    <User size={14} /> Főoldali köszöntő
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('town')}
                    className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'town' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                >
                    <Landmark size={14} /> „A községről” aloldal
                </button>
            </div>

            <form onSubmit={handleSave} className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6 max-w-4xl">

                <div className={`space-y-6 animate-in fade-in duration-150 ${activeTab !== 'mayor' ? 'hidden' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Polgármester neve</label>
                            {/* 🌟 2. JAVÍTÁS: A 'required' szavak törölve mindenhol! */}
                            <input
                                type="text"
                                className="w-full bg-secondary/40 border border-gray-200/50 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium text-primary"
                                value={mayorName} onChange={e => setMayorName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Köszöntő alcíme / Titulusa</label>
                            <input
                                type="text"
                                className="w-full bg-secondary/40 border border-gray-200/50 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium text-primary"
                                value={welcomeTitle} onChange={e => setWelcomeTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Polgármester fotója</label>
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md flex-shrink-0">
                                <img
                                    src={imagePreview || (currentImageUrl ? getImageUrl(currentImageUrl) : 'https://via.placeholder.com/150')}
                                    className="w-full h-full object-cover"
                                    alt="Polgármester"
                                />
                            </div>

                            <div
                                onDragOver={handleDragOver}
                                onDragEnter={handleMayorDragEnter}
                                onDragLeave={handleMayorDragLeave}
                                onDrop={handleMayorImageDrop}
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white flex-1 w-full cursor-pointer group ${isMayorDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent'}`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleImageChange}
                                />
                                <div className="pointer-events-none space-y-1">
                                    <Upload className={`mx-auto mb-1 transition-colors ${isMayorDragging ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`} size={20} />
                                    <span className={`text-xs font-bold block ${isMayorDragging ? 'text-accent' : 'text-gray-500'}`}>
                                        {imageFile ? `Kiválasztva: ${imageFile.name}` : "Kattintson ide vagy húzza ide az új fotót"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Köszöntő beszéde / Szövege</label>
                        <RichTextEditor
                            content={welcomeText}
                            onChange={(html: string) => setWelcomeText(html)}
                        />
                    </div>
                </div>

                {/* --- 2. FÜL --- */}
                <div className={`space-y-6 animate-in fade-in duration-150 ${activeTab !== 'town' ? 'hidden' : ''}`}>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Községünk Története</label>
                        <textarea
                            rows={6}
                            className="w-full bg-secondary/40 border border-gray-200/50 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed text-primary"
                            value={historyText} onChange={e => setHistoryText(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Hivatalos Települési Címer</label>
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center p-2 flex-shrink-0">
                                <img
                                    src={coatOfArmsPreview || (currentCoatOfArmsUrl ? getImageUrl(currentCoatOfArmsUrl) : '/img/branding/coat-of-arms.png')}
                                    className="h-full object-contain"
                                    alt="Címer"
                                />
                            </div>

                            <div
                                onDragOver={handleDragOver}
                                onDragEnter={handleCoatDragEnter}
                                onDragLeave={handleCoatDragLeave}
                                onDrop={handleCoatOfArmsDrop}
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-white flex-1 w-full cursor-pointer group ${isCoatDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent'}`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleCoatOfArmsChange}
                                />
                                <div className="pointer-events-none space-y-1">
                                    <Upload className={`mx-auto mb-1 transition-colors ${isCoatDragging ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`} size={20} />
                                    <span className={`text-xs font-bold block ${isCoatDragging ? 'text-accent' : 'text-gray-500'}`}>
                                        {coatOfArmsFile ? `Kiválasztva: ${coatOfArmsFile.name}` : "Kattintson ide vagy húzza ide az új címerképet"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Címer Heraldikai Leírása</label>
                        <textarea
                            rows={4}
                            className="w-full bg-secondary/40 border border-gray-200/50 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed text-primary"
                            value={coatOfArmsText} onChange={e => setCoatOfArmsText(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Nevezetességek & Épületek Kiegészítő Leírása</label>
                        <textarea
                            rows={4}
                            className="w-full bg-secondary/40 border border-gray-200/50 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed text-primary"
                            value={landmarksText} onChange={e => setLandmarksText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <button
                        type="submit" disabled={submitting}
                        className="bg-primary text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider hover:bg-accent transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        {submitting ? "Mentés folyamatban..." : "Minden változtatás mentése"}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
};